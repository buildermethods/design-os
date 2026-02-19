import { useMemo, useCallback } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, Calendar, Settings, Users } from 'lucide-react'
import { AppShell, type NavigationItem } from '@/shell/components/AppShell'
import { useAuth } from '@/lib/auth'

const baseItems: Omit<NavigationItem, 'isActive'>[] = [
  { label: 'Today', href: '/today', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Leads', href: '/leads', icon: <Users className="w-4 h-4" /> },
  { label: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="w-4 h-4" /> },
]

const roleDisplayMap: Record<string, 'BD' | 'Admin'> = {
  bd: 'BD',
  admin: 'Admin',
  founder: 'Admin',
}

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()

  const navigationItems = useMemo(() => (
    baseItems.map((item) => ({
      ...item,
      isActive: location.pathname === item.href || (item.href === '/today' && location.pathname === '/'),
    }))
  ), [location.pathname])

  const settingsItem: NavigationItem = {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-4 h-4" />,
    isActive: location.pathname === '/settings',
  }

  const handleLogout = useCallback(async () => {
    await signOut()
    navigate('/login')
  }, [signOut, navigate])

  const user = profile
    ? {
        name: profile.name,
        avatarUrl: profile.avatar_url ?? undefined,
        role: roleDisplayMap[profile.role] ?? ('BD' as const),
      }
    : { name: 'User', role: 'BD' as const }

  return (
    <AppShell
      navigationItems={navigationItems}
      settingsItem={settingsItem}
      user={user}
      onNavigate={(href) => navigate(href)}
      onLogout={handleLogout}
    >
      <div className="p-6 lg:p-8">
        <Outlet />
      </div>
    </AppShell>
  )
}
