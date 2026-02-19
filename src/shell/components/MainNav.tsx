import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface NavigationItem {
  label: string
  href: string
  icon?: string
  isActive?: boolean
}

export interface MainNavProps {
  items: NavigationItem[]
  collapsed?: boolean
  onNavigate?: (href: string) => void
}

const iconMap: Record<string, string> = {
  dashboard: 'dashboard',
  products: 'inventory_2',
  'bill-of-materials': 'layers',
  sourcing: 'domain',
  calendar: 'calendar_month',
}

function getIconName(item: NavigationItem): string {
  // Try to match by icon key first
  if (item.icon && iconMap[item.icon]) {
    return iconMap[item.icon]
  }
  // Try to match by href
  const href = item.href.replace(/^\//, '')
  if (iconMap[href]) {
    return iconMap[href]
  }
  // Try to match by label (lowercase)
  const labelKey = item.label.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')
  if (iconMap[labelKey]) {
    return iconMap[labelKey]
  }
  // Default
  return 'inventory_2'
}

export default function MainNav({ items, collapsed = false, onNavigate }: MainNavProps) {
  // Filter out settings/admin items — settings lives in the user profile dropdown
  const navItems = items.filter(
    (item) => !item.href.includes('settings') && !item.href.includes('admin')
  )

  return (
    <nav className="flex flex-col h-full">
      <div className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const iconName = getIconName(item)
          const button = (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate?.(item.href)}
              className={cn(
                'group relative w-full justify-start gap-3 px-3 py-2 h-auto',
                collapsed && 'justify-center px-2',
                item.isActive
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/15 hover:text-blue-600 dark:hover:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              {/* Active indicator bar */}
              {item.isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-blue-500" />
              )}
              <Icon name={iconName} size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Button>
          )

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            )
          }

          return button
        })}
      </div>
    </nav>
  )
}
