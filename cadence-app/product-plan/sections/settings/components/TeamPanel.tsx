import type { User, Pipeline, UserRole } from '../types'

interface TeamPanelProps {
  activeUsers: User[]
  inactiveUsers: User[]
  pipelines: Pipeline[]
  canManage: boolean
  onInviteUser?: () => void
  onEditUser?: (userId: string) => void
  onDeactivateUser?: (userId: string) => void
  onReactivateUser?: (userId: string) => void
}

const roleLabels: Record<UserRole, { label: string; color: string }> = {
  founder: {
    label: 'Founder',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  admin: {
    label: 'Admin',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  },
  bd: {
    label: 'BD',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getPipelineNames(pipelineIds: string[], pipelines: Pipeline[]): string[] {
  return pipelineIds
    .map((id) => pipelines.find((p) => p.id === id)?.name)
    .filter((name): name is string => !!name)
}

export function TeamPanel({
  activeUsers,
  inactiveUsers,
  pipelines,
  canManage,
  onInviteUser,
  onEditUser,
  onDeactivateUser,
  onReactivateUser,
}: TeamPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Team</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage team members, roles, and pipeline assignments.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => onInviteUser?.()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Invite Member
          </button>
        )}
      </div>

      {/* Active Members */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Active Members
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              ({activeUsers.length})
            </span>
          </h3>
        </div>

        {activeUsers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No active team members</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {activeUsers.map((user) => {
              const role = roleLabels[user.role]
              const assignedPipelines = getPipelineNames(user.assignedPipelineIds, pipelines)

              return (
                <div
                  key={user.id}
                  className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {getInitials(user.name)}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white truncate">
                        {user.name}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${role.color}`}>
                        {role.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Assigned Pipelines */}
                  <div className="hidden sm:flex flex-wrap gap-1 max-w-xs">
                    {assignedPipelines.length === 0 ? (
                      <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                        No pipelines assigned
                      </span>
                    ) : assignedPipelines.length <= 2 ? (
                      assignedPipelines.map((name) => (
                        <span
                          key={name}
                          className="inline-flex px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400"
                        >
                          {name}
                        </span>
                      ))
                    ) : (
                      <>
                        <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">
                          {assignedPipelines[0]}
                        </span>
                        <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-400">
                          +{assignedPipelines.length - 1} more
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  {canManage && (
                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditUser?.(user.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {user.role !== 'founder' && (
                        <button
                          onClick={() => onDeactivateUser?.(user.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                          title="Deactivate user"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Deactivated Members */}
      {inactiveUsers.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Deactivated Members
              <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                ({inactiveUsers.length})
              </span>
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {inactiveUsers.map((user) => {
              const role = roleLabels[user.role]
              const deactivatedDate = user.deactivatedAt
                ? new Date(user.deactivatedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : null

              return (
                <div
                  key={user.id}
                  className="p-4 flex items-center gap-4 opacity-60 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all group"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {getInitials(user.name)}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900 dark:text-white truncate">
                        {user.name}
                      </span>
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${role.color}`}>
                        {role.label}
                      </span>
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                        Deactivated
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                      {deactivatedDate && (
                        <span className="ml-2 text-slate-400 dark:text-slate-500">
                          · Deactivated {deactivatedDate}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  {canManage && (
                    <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onReactivateUser?.(user.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Reactivate
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Info Note */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Deactivated users cannot log in but remain visible in historical reports and analytics.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
