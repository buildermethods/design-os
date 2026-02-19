import { useState, useCallback, useEffect } from 'react'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MainNav from './MainNav'
import UserMenu from './UserMenu'
import type { NavigationItem } from './MainNav'
import type { UserMenuProps } from './UserMenu'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: UserMenuProps['user']
  productName?: string
  productIcon?: string
  currentSection?: string
  onNavigate?: (href: string) => void
  onLogout?: () => void
  onSettings?: () => void
  onSearch?: (query: string) => void
  notificationCount?: number
  onNotificationsClick?: () => void
}

const SIDEBAR_EXPANDED_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 64
const TOPBAR_HEIGHT = 56

export default function AppShell({
  children,
  navigationItems,
  user,
  productName = 'Centric PLM',
  productIcon = 'C',
  currentSection: _currentSection,
  onNavigate,
  onLogout,
  onSettings,
  onSearch,
  notificationCount = 0,
  onNotificationsClick,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDark, setIsDark] = useState(false)

  // Detect dark mode
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  const handleThemeToggle = useCallback(() => {
    const root = document.documentElement
    const isCurrentlyDark = root.classList.contains('dark')
    root.classList.toggle('dark', !isCurrentlyDark)
    localStorage.setItem('theme', isCurrentlyDark ? 'light' : 'dark')
    setIsDark(!isCurrentlyDark)
  }, [])

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        onSearch?.(searchQuery.trim())
      }
    },
    [searchQuery, onSearch]
  )

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-['Inter',system-ui,sans-serif]">
      {/* ─── Top Bar ─── */}
      <header
        className="shrink-0 flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-40"
        style={{ height: TOPBAR_HEIGHT }}
      >
        {/* Left: Product identity + hamburger/collapse toggle */}
        <div className="flex items-center gap-3 pl-4">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
            aria-label="Open navigation"
          >
            <Icon name="menu" size={20} />
          </Button>
          {/* Product icon + name */}
          <div className="flex items-center gap-2.5">
            <div className="size-8 shrink-0 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{productIcon}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 hidden sm:block">
              {productName}
            </span>
          </div>
          {/* Desktop collapse toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name={sidebarCollapsed ? 'left_panel_open' : 'left_panel_close'} size={20} />
          </Button>
        </div>

        {/* Center: Global search */}
        <div className="flex-1 flex justify-center px-4">
          <form
            onSubmit={handleSearchSubmit}
            className={cn(
              'relative w-full max-w-md transition-all',
              searchFocused && 'max-w-lg'
            )}
          >
            <Icon
              name="search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <Input
              type="text"
              placeholder="Search products, materials, suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="h-9 pl-9 pr-4 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500/30 focus-visible:border-blue-500 dark:focus-visible:border-blue-400"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setSearchQuery('')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <Icon name="close" size={14} />
              </Button>
            )}
          </form>
        </div>

        {/* Right: Notifications + User menu */}
        <div className="flex items-center gap-1 pr-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationsClick}
            className="relative text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
            aria-label="Notifications"
          >
            <Icon name="notifications" size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 size-4 flex items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </Button>
          <div className="hidden sm:block">
            <UserMenu
              user={user}
              onLogout={onLogout}
              onSettings={onSettings}
              onThemeToggle={handleThemeToggle}
              isDark={isDark}
              collapsed={false}
            />
          </div>
          {/* Mobile: just avatar */}
          <div className="sm:hidden">
            <UserMenu
              user={user}
              onLogout={onLogout}
              onSettings={onSettings}
              onThemeToggle={handleThemeToggle}
              isDark={isDark}
              collapsed={true}
            />
          </div>
        </div>
      </header>

      {/* ─── Body: Sidebar + Content ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop sidebar */}
        <aside
          className="hidden lg:flex flex-col shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-[width] duration-200 ease-in-out overflow-hidden"
          style={{ width: sidebarWidth }}
        >
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-2">
            <MainNav
              items={navigationItems}
              collapsed={sidebarCollapsed}
              onNavigate={onNavigate}
            />
          </div>
        </aside>

        {/* Mobile sidebar (sheet overlay) */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="w-72 p-0">
            {/* Nav */}
            <div className="flex-1 overflow-y-auto py-2">
              <MainNav
                items={navigationItems}
                collapsed={false}
                onNavigate={(href) => {
                  onNavigate?.(href)
                  setMobileNavOpen(false)
                }}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
