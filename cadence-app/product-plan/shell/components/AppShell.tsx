import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'

export interface NavigationItem {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: number
  isActive?: boolean
}

export interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  settingsItem?: NavigationItem
  user?: {
    name: string
    avatarUrl?: string
    role?: 'BD' | 'Admin'
  }
  logo?: React.ReactNode
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

export function AppShell({
  children,
  navigationItems,
  settingsItem,
  user,
  logo,
  onNavigate,
  onLogout,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center">
          {logo || (
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
              Cadence
            </span>
          )}
        </div>
        <div className="w-9" /> {/* Spacer for centering */}
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-60 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo area */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
            {logo || (
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                Cadence
              </span>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <MainNav
              items={navigationItems}
              onNavigate={(href) => {
                onNavigate?.(href)
                setSidebarOpen(false)
              }}
            />
          </nav>

          {/* Bottom section: Settings + User */}
          <div className="border-t border-slate-200 dark:border-slate-700 px-3 py-3 space-y-2">
            {settingsItem && (
              <MainNav
                items={[settingsItem]}
                onNavigate={(href) => {
                  onNavigate?.(href)
                  setSidebarOpen(false)
                }}
              />
            )}
            {user && (
              <UserMenu
                user={user}
                onLogout={onLogout}
              />
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-60 pt-14 lg:pt-0 min-h-screen">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
