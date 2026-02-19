import { Phone, Clock, AlertCircle } from 'lucide-react'
import type { Lead, FollowUpPriority } from '../types'

interface LeadRowProps {
  lead: Lead
  isSelected?: boolean
  onSelect?: () => void
  onCall?: () => void
}

const sourceColors: Record<string, string> = {
  'YouTube': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'WhatsApp Group': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'App Install': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Referral': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Paid Ad': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

const stageColors: Record<string, string> = {
  'New': 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  'Contacted': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Hot': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Demo Scheduled': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Won': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Lost': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const priorityIndicator: Record<FollowUpPriority, string> = {
  'high': 'bg-red-500',
  'medium': 'bg-amber-500',
  'low': 'bg-slate-400',
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Never'
  const date = new Date(dateStr)
  const today = new Date()
  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-slate-500 dark:text-slate-400'
}

export function LeadRow({ lead, isSelected, onSelect, onCall }: LeadRowProps) {
  return (
    <div
      onClick={onSelect}
      className={`
        group relative flex items-center gap-4 px-4 py-3 cursor-pointer transition-all
        border-b border-slate-100 dark:border-slate-800
        ${isSelected
          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-2 border-l-indigo-500'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-2 border-l-transparent'
        }
      `}
    >
      {/* Priority indicator for follow-ups */}
      {lead.followUp && (
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r ${priorityIndicator[lead.followUp.priority]}`}
          title={`${lead.followUp.priority} priority`}
        />
      )}

      {/* Score */}
      <div className={`w-10 text-center font-mono font-semibold text-lg ${getScoreColor(lead.score)}`}>
        {lead.score}
      </div>

      {/* Lead info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-900 dark:text-white truncate">
            {lead.name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${sourceColors[lead.source] || 'bg-slate-100 text-slate-700'}`}>
            {lead.source}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${stageColors[lead.stage] || 'bg-slate-100 text-slate-700'}`}>
            {lead.stage}
          </span>
        </div>

        {/* Follow-up reason or last contact */}
        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
          {lead.followUp ? (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span className="truncate">{lead.followUp.reason}</span>
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDate(lead.lastContactDate)}</span>
            </>
          )}
        </div>
      </div>

      {/* Call button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onCall?.()
        }}
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <Phone className="w-4 h-4" />
        <span className="hidden sm:inline">Call</span>
      </button>
    </div>
  )
}
