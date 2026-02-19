import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface UserMenuProps {
  user?: {
    name: string
    avatarUrl?: string
    role?: string
  }
  onLogout?: () => void
  onSettings?: () => void
  onThemeToggle?: () => void
  isDark?: boolean
  collapsed?: boolean
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function UserMenu({
  user,
  onLogout,
  onSettings,
  onThemeToggle,
  isDark = false,
  collapsed = false,
}: UserMenuProps) {
  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'h-auto gap-2 rounded-lg px-2 py-1.5 text-left',
            collapsed && 'justify-center'
          )}
        >
          <Avatar className="size-8 shrink-0">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {user.name}
                </p>
                {user.role && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user.role}
                  </p>
                )}
              </div>
              <Icon name="expand_more" size={16} className="text-slate-400 shrink-0" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={collapsed ? 'right' : 'top'}
        align="start"
        className="w-56"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium">{user.name}</p>
            {user.role && (
              <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {onSettings && (
            <DropdownMenuItem onClick={onSettings}>
              <Icon name="settings" size={16} />
              Account Settings
            </DropdownMenuItem>
          )}
          {onThemeToggle && (
            <DropdownMenuItem onClick={onThemeToggle}>
              <Icon name={isDark ? 'light_mode' : 'dark_mode'} size={16} />
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {onLogout && (
          <DropdownMenuItem onClick={onLogout} variant="destructive">
            <Icon name="logout" size={16} />
            Log Out
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
