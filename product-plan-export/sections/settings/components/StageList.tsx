import type { Stage, StageColor, StageType } from '../types'

interface StageListProps {
  stages: Stage[]
  pipelineId: string
  canManage: boolean
  onEditStage?: (stageId: string) => void
  onArchiveStage?: (stageId: string) => void
  onReorderStages?: (pipelineId: string, stageIds: string[]) => void
}

const stageColorMap: Record<StageColor, { bg: string; text: string; dot: string }> = {
  slate: {
    bg: 'bg-slate-100 dark:bg-slate-700',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-500',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    text: 'text-indigo-700 dark:text-indigo-400',
    dot: 'bg-indigo-500',
  },
  violet: {
    bg: 'bg-violet-100 dark:bg-violet-900/30',
    text: 'text-violet-700 dark:text-violet-400',
    dot: 'bg-violet-500',
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  rose: {
    bg: 'bg-rose-100 dark:bg-rose-900/30',
    text: 'text-rose-700 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
}

const stageTypeLabels: Record<StageType, { label: string; className: string }> = {
  open: {
    label: 'Open',
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
  },
  won: {
    label: 'Won',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  lost: {
    label: 'Lost',
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  },
}

export function StageList({
  stages,
  pipelineId,
  canManage,
  onEditStage,
  onArchiveStage,
  onReorderStages,
}: StageListProps) {
  if (stages.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">No stages configured</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Add stages to define your sales process
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-700">
      {stages.map((stage, index) => {
        const colorStyle = stageColorMap[stage.color]
        const typeLabel = stageTypeLabels[stage.type]
        const isTerminal = stage.type === 'won' || stage.type === 'lost'

        return (
          <div
            key={stage.id}
            className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
          >
            {/* Drag Handle */}
            {canManage && (
              <button
                className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500 transition-colors"
                title="Drag to reorder"
                onClick={() => {
                  // In a real implementation, this would use a drag library
                  // For now, we'll just log the intent
                  console.log('Reorder stages for pipeline:', pipelineId)
                  onReorderStages?.(pipelineId, stages.map(s => s.id))
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                </svg>
              </button>
            )}

            {/* Order Number */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {stage.order}
              </span>
            </div>

            {/* Stage Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {/* Color Dot */}
                <span className={`w-2.5 h-2.5 rounded-full ${colorStyle.dot}`} />

                {/* Stage Name */}
                <span className="font-medium text-slate-900 dark:text-white">
                  {stage.name}
                </span>

                {/* Hot Badge */}
                {stage.isHot && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    Hot
                  </span>
                )}
              </div>
            </div>

            {/* Type Badge */}
            <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${typeLabel.className}`}>
              {typeLabel.label}
            </span>

            {/* Actions */}
            {canManage && (
              <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEditStage?.(stage.id)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="Edit stage"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                {!isTerminal && (
                  <button
                    onClick={() => onArchiveStage?.(stage.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    title="Archive stage"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
