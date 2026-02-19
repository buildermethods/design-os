# Application Shell

## Overview

The Cadence shell provides a consistent navigation structure across all sections. It uses a sidebar layout optimized for a sales tool that BDs use throughout their workday, with quick access to main sections and clear visual hierarchy.

## Components

### AppShell

Main layout wrapper with sidebar navigation.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Main content area |
| `navigationItems` | `NavigationItem[]` | Main nav items (Today, Leads, Dashboard) |
| `settingsItem` | `NavigationItem` | Settings nav item (shown at bottom) |
| `user` | `{ name, avatarUrl?, role? }` | Current user info for menu |
| `logo` | `ReactNode` | Custom logo (defaults to "Cadence" text) |
| `onNavigate` | `(href: string) => void` | Navigation callback |
| `onLogout` | `() => void` | Logout callback |

### MainNav

Navigation list component.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `items` | `NavigationItem[]` | Navigation items to render |
| `onNavigate` | `(href: string) => void` | Navigation callback |

### UserMenu

User menu with avatar and logout dropdown.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `user` | `{ name, avatarUrl?, role? }` | User info |
| `onLogout` | `() => void` | Logout callback |

## Navigation Structure

| Nav Item | Route | Icon | Badge |
|----------|-------|------|-------|
| Today | `/today` | Calendar | Follow-up count (optional) |
| Leads | `/leads` | Users | — |
| Dashboard | `/dashboard` | BarChart | — |
| Settings | `/settings` | Cog | — (separated at bottom) |

## Layout Pattern

- **Desktop (1024px+):** Fixed 240px sidebar, content fills remaining space
- **Tablet (768-1023px):** Collapsible sidebar with toggle button
- **Mobile (<768px):** Hamburger menu in header, sidebar slides in as overlay

## Design Notes

- Active nav item uses indigo background highlight
- Hover states use subtle slate background change
- Settings is visually separated at the bottom
- Follow-up badges use amber for attention
- Dark mode supported with appropriate color inversions
- User menu opens upward (above the button)

## Usage Example

```tsx
import { AppShell } from './components/AppShell'
import { Calendar, Users, BarChart3, Settings } from 'lucide-react'

function App() {
  const navigationItems = [
    { label: 'Today', href: '/today', icon: <Calendar className="w-5 h-5" />, isActive: true, badge: 5 },
    { label: 'Leads', href: '/leads', icon: <Users className="w-5 h-5" /> },
    { label: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  ]

  const settingsItem = {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
  }

  const user = {
    name: 'Priya Sharma',
    role: 'BD' as const,
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      settingsItem={settingsItem}
      user={user}
      onNavigate={(href) => router.push(href)}
      onLogout={() => auth.signOut()}
    >
      <YourPageContent />
    </AppShell>
  )
}
```

## Dependencies

- `lucide-react` for icons (Menu, X, LogOut, ChevronUp)
- Tailwind CSS for styling
