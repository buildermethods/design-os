import type { DropReason, DropReasonCategory } from '../types'

interface DropReasonPanelProps {
  dropReasons: DropReason[]
  canManage: boolean
  onCreateDropReason?: () => void
  onEditDropReason?: (dropReasonId: string) => void
  onToggleDropReasonActive?: (dropReasonId: string, isActive: boolean) => void
}

const categoryLabels: Record<DropReasonCategory, { label: string; color: string }> = {
  pricing: {
    label: 'Pricing',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  timing: {
    label: 'Timing',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
  eligibility: {
    label: 'Eligibility',
    color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  },
  competitor: {
    label: 'Competitor',
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  },
  noResponse: {
    label: 'No Response',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  },
  other: {
    label: 'Other',
    color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  },
}

export function DropReasonPanel({
  dropReasons,
  canManage,
  onCreateDropReason,
  onEditDropReason,
  onToggleDropReasonActive,
}: DropReasonPanelProps) {
  const activeReasons = dropReasons.filter(d => d.isActive)
  const inactiveReasons = dropReasons.filter(d => !d.isActive)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Drop Reasons</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Configure reasons why leads don't convert. Required when marking a lead as lost.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => onCreateDropReason?.()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Reason
          </button>
        )}
      </div>

      {/* Active Reasons */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Active Reasons
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              ({activeReasons.length})
            </span>
          </h3>
        </div>

        {activeReasons.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No active drop reasons</p>
            {canManage && (
              <button
                onClick={() => onCreateDropReason?.()}
                className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                Add your first reason
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Usage</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  {canManage && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {activeReasons.map((reason) => {
                  const category = categoryLabels[reason.category]
                  return (
                    <tr
                      key={reason.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {reason.reason}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${category.color}`}>
                          {category.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {reason.usageCount ?? 0} leads
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onToggleDropReasonActive?.(reason.id, false)}
                          disabled={!canManage}
                          className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                            ${canManage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                            bg-indigo-600
                          `}
                          title={canManage ? 'Click to deactivate' : 'No permission to change'}
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                        </button>
                      </td>
                      {canManage && (
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onEditDropReason?.(reason.id)}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Edit reason"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inactive Reasons */}
      {inactiveReasons.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Inactive Reasons
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                ({inactiveReasons.length})
              </span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Historical Usage</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  {canManage && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {inactiveReasons.map((reason) => {
                  const category = categoryLabels[reason.category]
                  return (
                    <tr
                      key={reason.id}
                      className="opacity-60 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {reason.reason}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${category.color}`}>
                          {category.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {reason.usageCount ?? 0} leads
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onToggleDropReasonActive?.(reason.id, true)}
                          disabled={!canManage}
                          className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                            ${canManage ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                            bg-slate-300 dark:bg-slate-600
                          `}
                          title={canManage ? 'Click to reactivate' : 'No permission to change'}
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                        </button>
                      </td>
                      {canManage && (
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onEditDropReason?.(reason.id)}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Edit reason"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
