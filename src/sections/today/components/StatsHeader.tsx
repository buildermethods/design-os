import { Phone, PhoneCall, CheckCircle2, ListTodo } from 'lucide-react'
import type { Stats } from '@/../product/sections/today/types'

interface StatsHeaderProps {
  stats: Stats
}

export function StatsHeader({ stats }: StatsHeaderProps) {
  const statItems = [
    {
      label: 'Calls Made',
      value: stats.callsMade,
      icon: Phone,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
    },
    {
      label: 'Connected',
      value: stats.connected,
      icon: PhoneCall,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
    },
    {
      label: 'Follow-ups Cleared',
      value: stats.followUpsCleared,
      icon: CheckCircle2,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
    },
    {
      label: 'Remaining',
      value: stats.remainingInQueue,
      icon: ListTodo,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/30',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {statItems.map((item) => (
        <div
          key={item.label}
          className={`${item.bgColor} rounded-xl p-4 transition-all hover:scale-[1.02]`}
        >
          <div className="flex items-center gap-3">
            <div className={`${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-2xl font-semibold font-mono ${item.color}`}>
                {item.value}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {item.label}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
