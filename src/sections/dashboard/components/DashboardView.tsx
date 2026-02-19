import { BarChart3 } from 'lucide-react'
import type { DashboardProps, FunnelMetrics } from '@/../product/sections/dashboard/types'
import { FunnelCard } from './FunnelCard'
import { FilterBar } from './FilterBar'
import { DropReasonChart } from './DropReasonChart'

export function DashboardView({
  currentUser,
  funnelMetrics,
  dropReasonStats,
  filterOptions,
  selectedFilters,
  onMetricClick,
  onDropReasonClick,
  onFilterChange,
}: DashboardProps) {
  // Define the funnel metric order
  const metricOrder: (keyof FunnelMetrics)[] = [
    'callsMade',
    'connected',
    'connectRate',
    'hotLeads',
    'won',
    'lost',
  ]

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-6 lg:px-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              Dashboard
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 ml-12">
            {currentUser.role === 'bd'
              ? 'Your performance metrics'
              : 'Team performance overview'}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <FilterBar
            currentUser={currentUser}
            filterOptions={filterOptions}
            selectedFilters={selectedFilters}
            onFilterChange={onFilterChange}
          />
        </div>

        {/* Funnel Metrics Grid */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
            Sales Funnel
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metricOrder.map((key) => (
              <FunnelCard
                key={key}
                metricKey={key}
                metric={funnelMetrics[key]}
                onClick={(filter) => onMetricClick?.(key, filter)}
              />
            ))}
          </div>

          {/* Funnel flow indicator */}
          <div className="hidden lg:flex items-center justify-center mt-4 text-xs text-slate-400 dark:text-slate-500">
            <span>Calls</span>
            <span className="mx-2">→</span>
            <span>Connected</span>
            <span className="mx-2">→</span>
            <span>Hot</span>
            <span className="mx-2">→</span>
            <span className="text-emerald-500">Won</span>
            <span className="mx-1">/</span>
            <span className="text-rose-500">Lost</span>
          </div>
        </div>

        {/* Drop Reason Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DropReasonChart
            stats={dropReasonStats}
            onSegmentClick={onDropReasonClick}
          />

          {/* Quick insights panel */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
              Quick Insights
            </h3>

            <div className="space-y-4">
              {/* Connect rate insight */}
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  funnelMetrics.connectRate.value >= 50
                    ? 'bg-emerald-500'
                    : funnelMetrics.connectRate.value >= 30
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Connect Rate: {funnelMetrics.connectRate.value}%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {funnelMetrics.connectRate.value >= 50
                      ? 'Above average — great job reaching leads!'
                      : funnelMetrics.connectRate.value >= 30
                      ? 'Room for improvement — try different call times'
                      : 'Low connect rate — review lead quality or timing'}
                  </p>
                </div>
              </div>

              {/* Conversion insight */}
              {funnelMetrics.hotLeads.value > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 bg-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {funnelMetrics.hotLeads.value} Hot Lead{funnelMetrics.hotLeads.value !== 1 ? 's' : ''} in Pipeline
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Focus on converting these high-intent prospects
                    </p>
                  </div>
                </div>
              )}

              {/* Top drop reason */}
              {dropReasonStats.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 bg-rose-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Top Drop Reason: {dropReasonStats[0].reason}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {dropReasonStats[0].percentage.toFixed(0)}% of lost leads — consider addressing this objection
                    </p>
                  </div>
                </div>
              )}

              {/* Win/Loss ratio */}
              {(funnelMetrics.won.value > 0 || funnelMetrics.lost.value > 0) && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 bg-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Win/Loss: {funnelMetrics.won.value}/{funnelMetrics.lost.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {funnelMetrics.won.value > funnelMetrics.lost.value
                        ? 'More wins than losses — keep up the momentum!'
                        : 'Review lost leads to identify improvement areas'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
