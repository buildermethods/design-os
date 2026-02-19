import { AlertCircle } from 'lucide-react'
import type { DropReasonStat, DrilldownFilter } from '@/../product/sections/dashboard/types'

interface DropReasonChartProps {
  stats: DropReasonStat[]
  onSegmentClick?: (dropReasonId: string | null, filter: DrilldownFilter) => void
}

// Color palette for chart segments
const segmentColors = [
  { bg: 'bg-rose-500', hover: 'hover:bg-rose-600', text: 'text-rose-500' },
  { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', text: 'text-amber-500' },
  { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600', text: 'text-indigo-500' },
  { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', text: 'text-emerald-500' },
  { bg: 'bg-slate-400', hover: 'hover:bg-slate-500', text: 'text-slate-400' }, // Unknown bucket
]

export function DropReasonChart({ stats, onSegmentClick }: DropReasonChartProps) {
  if (stats.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
          Drop Reason Breakdown
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <AlertCircle className="w-8 h-8 mb-2" />
          <p className="text-sm">No lost leads in selected period</p>
        </div>
      </div>
    )
  }

  const totalLost = stats.reduce((sum, s) => sum + s.count, 0)
  const maxCount = Math.max(...stats.map(s => s.count))

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Drop Reason Breakdown
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {totalLost} total lost
        </span>
      </div>

      <div className="space-y-4">
        {stats.map((stat, index) => {
          const color = stat.dropReasonId === null
            ? segmentColors[segmentColors.length - 1] // Unknown gets last color (gray)
            : segmentColors[index % (segmentColors.length - 1)]

          const barWidth = (stat.count / maxCount) * 100

          return (
            <button
              key={stat.dropReasonId ?? 'unknown'}
              onClick={() => onSegmentClick?.(stat.dropReasonId, stat.drilldownFilter)}
              className="w-full text-left group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${color.bg}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {stat.reason}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
                    {stat.count}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 w-12 text-right">
                    {stat.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color.bg} rounded-full transition-all duration-300 group-hover:opacity-80`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view these leads
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
