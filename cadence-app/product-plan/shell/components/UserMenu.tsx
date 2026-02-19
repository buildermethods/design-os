import { useState, useRef, useEffect } from 'react'
import { LogOut, ChevronUp } from 'lucide-react'

interface UserMenuProps {
  user: {
    name: string
    avatarUrl?: string
    role?: 'BD' | 'Admin'
  }
  onLogout?: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get initials from name
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
      >
        {/* Avatar */}
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-medium text-indigo-700 dark:text-indigo-300">
            {initials}
          </div>
        )}

        {/* Name and role */}
        <div className="flex-1 text-left min-w-0">
          <div className="font-medium text-slate-900 dark:text-white truncate">
            {user.name}
          </div>
          {user.role && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {user.role}
            </div>
          )}
        </div>

        {/* Chevron */}
        <ChevronUp
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? '' : 'rotate-180'
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
          <button
            onClick={() => {
              onLogout?.()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  )
}
