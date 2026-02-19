import type { Pipeline, Stage, SystemRules } from '../types'
import { StageList } from './StageList'

interface PipelinePanelProps {
  pipelines: Pipeline[]
  selectedPipeline: Pipeline | null
  stages: Stage[]
  systemRules: SystemRules
  canManage: boolean
  onSelectPipeline?: (pipelineId: string) => void
  onCreatePipeline?: () => void
  onEditPipeline?: (pipelineId: string) => void
  onArchivePipeline?: (pipelineId: string) => void
  onSetDefaultPipeline?: (pipelineId: string) => void
  onCreateStage?: (pipelineId: string) => void
  onEditStage?: (stageId: string) => void
  onArchiveStage?: (stageId: string) => void
  onReorderStages?: (pipelineId: string, stageIds: string[]) => void
}

export function PipelinePanel({
  pipelines,
  selectedPipeline,
  stages,
  systemRules,
  canManage,
  onSelectPipeline,
  onCreatePipeline,
  onEditPipeline,
  onArchivePipeline,
  onSetDefaultPipeline,
  onCreateStage,
  onEditStage,
  onArchiveStage,
  onReorderStages,
}: PipelinePanelProps) {
  // Validation: Check if pipeline has required stages
  const hasWonStage = stages.some(s => s.type === 'won')
  const hasLostStage = stages.some(s => s.type === 'lost')
  const isValidPipeline = hasWonStage && hasLostStage

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pipeline List */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-white">Pipelines</h2>
            {canManage && (
              <button
                onClick={() => onCreatePipeline?.()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {pipelines.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">No pipelines yet</p>
                {canManage && (
                  <button
                    onClick={() => onCreatePipeline?.()}
                    className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                  >
                    Create your first pipeline
                  </button>
                )}
              </div>
            ) : (
              pipelines.map((pipeline) => {
                const isSelected = selectedPipeline?.id === pipeline.id
                return (
                  <button
                    key={pipeline.id}
                    onClick={() => onSelectPipeline?.(pipeline.id)}
                    className={`
                      w-full p-4 text-left transition-colors
                      ${isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-900/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium truncate ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                            {pipeline.name}
                          </span>
                          {pipeline.isDefault && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {pipeline.description}
                        </p>
                      </div>
                      {isSelected && (
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Stage Configuration */}
      <div className="lg:col-span-2">
        {selectedPipeline ? (
          <div className="space-y-6">
            {/* Pipeline Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {selectedPipeline.name}
                    </h2>
                    {selectedPipeline.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        Default Pipeline
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                    {selectedPipeline.description}
                  </p>
                </div>
                {canManage && (
                  <div className="flex items-center gap-2">
                    {!selectedPipeline.isDefault && (
                      <button
                        onClick={() => onSetDefaultPipeline?.(selectedPipeline.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => onEditPipeline?.(selectedPipeline.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    {!selectedPipeline.isDefault && (
                      <button
                        onClick={() => onArchivePipeline?.(selectedPipeline.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        Archive
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Validation Warning */}
              {!isValidPipeline && (
                <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                        Pipeline configuration incomplete
                      </p>
                      <ul className="mt-1 text-sm text-amber-700 dark:text-amber-400 list-disc list-inside">
                        {!hasWonStage && <li>Missing a "Won" stage</li>}
                        {!hasLostStage && <li>Missing a "Lost" stage</li>}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* System Rules Hint */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {systemRules.pipelineHint}
              </p>
            </div>

            {/* Stage List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Stages</h3>
                {canManage && (
                  <button
                    onClick={() => onCreateStage?.(selectedPipeline.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Stage
                  </button>
                )}
              </div>

              <StageList
                stages={stages}
                pipelineId={selectedPipeline.id}
                canManage={canManage}
                onEditStage={onEditStage}
                onArchiveStage={onArchiveStage}
                onReorderStages={onReorderStages}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                Select a pipeline
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Choose a pipeline from the list to configure its stages
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
