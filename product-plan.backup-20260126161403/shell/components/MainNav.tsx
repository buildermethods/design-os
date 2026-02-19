import type { NavigationItem } from './AppShell'

interface MainNavProps {
  items: NavigationItem[]
  onNavigate?: (href: string) => void
}

export function MainNav({ items, onNavigate }: MainNavProps) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.href}>
          <button
            onClick={() => onNavigate?.(item.href)}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                item.isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700/50'
              }
            `}
          >
            {item.icon && (
              <span className={`flex-shrink-0 ${item.isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {item.icon}
              </span>
            )}
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}
