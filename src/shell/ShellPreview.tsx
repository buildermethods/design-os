import { CalendarCheck, Users, BarChart3, Settings } from 'lucide-react'
import { AppShell } from './components/AppShell'

export default function ShellPreview() {
  const navigationItems = [
    {
      label: 'Today',
      href: '/today',
      icon: <CalendarCheck className="w-5 h-5" />,
      badge: 5,
      isActive: true,
    },
    {
      label: 'Leads',
      href: '/leads',
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
    },
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
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
          Today
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Your prioritized calls and follow-ups for today.
        </p>

        {/* Placeholder content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              Calls Today
            </div>
            <div className="text-3xl font-semibold text-slate-900 dark:text-white font-mono">
              24
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              Follow-ups Due
            </div>
            <div className="text-3xl font-semibold text-amber-600 dark:text-amber-400 font-mono">
              5
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              Connected
            </div>
            <div className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
              8
            </div>
          </div>
        </div>

        {/* Placeholder list */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Priority Calls
            </h2>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {[
              { name: 'Rajesh Kumar', score: 85, stage: 'Hot', source: 'YouTube' },
              { name: 'Anita Desai', score: 72, stage: 'Contacted', source: 'WhatsApp' },
              { name: 'Vikram Singh', score: 68, stage: 'New', source: 'App Install' },
            ].map((lead) => (
              <div key={lead.name} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {lead.name}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {lead.source} · {lead.stage}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-medium text-indigo-600 dark:text-indigo-400">
                    {lead.score}
                  </span>
                  <button className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                    Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
