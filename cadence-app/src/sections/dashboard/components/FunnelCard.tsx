import { Phone, PhoneCall, Percent, Flame, Trophy, XCircle } from 'lucide-react'
import type { FunnelMetric, DrilldownFilter, FunnelMetrics } from '../types'

interface FunnelCardProps {
  metricKey: keyof FunnelMetrics
  metric: FunnelMetric
  onClick?: (filter: DrilldownFilter) => void
}

const iconMap: Record<keyof FunnelMetrics, typeof Phone> = {
  callsMade: Phone,
  connected: PhoneCall,
  connectRate: Percent,
  hotLeads: Flame,
  won: Trophy,
  lost: XCircle,
}

const colorMap: Record<keyof FunnelMetrics, { bg: string; icon: string; text: string }> = {
  callsMade: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    icon: 'text-slate-500 dark:text-slate-400',
    text: 'text-slate-900 dark:text-slate-100',
  },
  connected: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    icon: 'text-indigo-500 dark:text-indigo-400',
    text: 'text-indigo-900 dark:text-indigo-100',
  },
  connectRate: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    icon: 'text-indigo-500 dark:text-indigo-400',
    text: 'text-indigo-900 dark:text-indigo-100',
  },
  hotLeads: {
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    icon: 'text-amber-500 dark:text-amber-400',
    text: 'text-amber-900 dark:text-amber-100',
  },
  won: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    icon: 'text-emerald-500 dark:text-emerald-400',
    text: 'text-emerald-900 dark:text-emerald-100',
  },
  lost: {
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    icon: 'text-rose-500 dark:text-rose-400',
    text: 'text-rose-900 dark:text-rose-100',
  },
}

export function FunnelCard({ metricKey, metric, onClick }: FunnelCardProps) {
  const Icon = iconMap[metricKey]
  const colors = colorMap[metricKey]
  const isClickable = metric.drilldownFilter !== null

  const displayValue = metric.unit === 'percent'
    ? `${metric.value}%`
    : metric.value.toLocaleString()

  return (
    <button
      onClick={() => metric.drilldownFilter && onClick?.(metric.drilldownFilter)}
      disabled={!isClickable}
      className={`
        ${colors.bg} rounded-xl p-4 text-left transition-all w-full
        ${isClickable
          ? 'hover:scale-[1.02] hover:shadow-md cursor-pointer active:scale-[0.98]'
          : 'cursor-default'}
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
            {metric.label}
          </p>
          <p className={`text-2xl font-bold font-mono ${colors.text}`}>
            {displayValue}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${colors.bg} ${colors.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {isClickable && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          Click to view leads
        </p>
      )}
    </button>
  )
}
