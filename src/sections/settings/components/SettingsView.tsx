import type { SettingsProps, SettingsTab } from '@/../product/sections/settings/types'
import { PipelinePanel } from './PipelinePanel'
import { DropReasonPanel } from './DropReasonPanel'
import { TeamPanel } from './TeamPanel'

const tabs: { id: SettingsTab; label: string }[] = [
  { id: 'pipelines', label: 'Pipelines' },
  { id: 'dropReasons', label: 'Drop Reasons' },
  { id: 'team', label: 'Team' },
]

export function SettingsView({
  currentUser,
  ui,
  pipelines,
  stages,
  dropReasons,
  users,
  systemRules,
  onTabChange,
  onSelectPipeline,
  onCreatePipeline,
  onEditPipeline,
  onArchivePipeline,
  onSetDefaultPipeline,
  onCreateStage,
  onEditStage,
  onArchiveStage,
  onReorderStages,
  onCreateDropReason,
  onEditDropReason,
  onToggleDropReasonActive,
  onInviteUser,
  onEditUser,
  onDeactivateUser,
  onReactivateUser,
}: SettingsProps) {
  // Filter for active pipelines
  const activePipelines = pipelines.filter(p => !p.archivedAt)
  const selectedPipeline = pipelines.find(p => p.id === ui.selectedPipelineId)
  const selectedPipelineStages = stages
    .filter(s => s.pipelineId === ui.selectedPipelineId && !s.archivedAt)
    .sort((a, b) => a.order - b.order)

  // Filter for active drop reasons
  const activeDropReasons = dropReasons.filter(d => !d.archivedAt)

  // Filter users
  const activeUsers = users.filter(u => u.isActive)
  const inactiveUsers = users.filter(u => !u.isActive)

  if (!currentUser.permissions.canAccessSettings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Access Restricted</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Only founders and admins can access settings.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Configure your sales process, team, and drop reasons
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 -mb-px">
            {tabs.map((tab) => {
              const isActive = ui.activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  className={`
                    px-4 py-3 text-sm font-medium rounded-t-lg transition-colors
                    ${isActive
                      ? 'bg-slate-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-t border-x border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {ui.activeTab === 'pipelines' && (
          <PipelinePanel
            pipelines={activePipelines}
            selectedPipeline={selectedPipeline ?? null}
            stages={selectedPipelineStages}
            systemRules={systemRules}
            canManage={currentUser.permissions.canManagePipelines}
            onSelectPipeline={onSelectPipeline}
            onCreatePipeline={onCreatePipeline}
            onEditPipeline={onEditPipeline}
            onArchivePipeline={onArchivePipeline}
            onSetDefaultPipeline={onSetDefaultPipeline}
            onCreateStage={onCreateStage}
            onEditStage={onEditStage}
            onArchiveStage={onArchiveStage}
            onReorderStages={onReorderStages}
          />
        )}

        {ui.activeTab === 'dropReasons' && (
          <DropReasonPanel
            dropReasons={activeDropReasons}
            canManage={currentUser.permissions.canManageDropReasons}
            onCreateDropReason={onCreateDropReason}
            onEditDropReason={onEditDropReason}
            onToggleDropReasonActive={onToggleDropReasonActive}
          />
        )}

        {ui.activeTab === 'team' && (
          <TeamPanel
            activeUsers={activeUsers}
            inactiveUsers={inactiveUsers}
            pipelines={activePipelines}
            canManage={currentUser.permissions.canManageUsers}
            onInviteUser={onInviteUser}
            onEditUser={onEditUser}
            onDeactivateUser={onDeactivateUser}
            onReactivateUser={onReactivateUser}
          />
        )}
      </div>
    </div>
  )
}
