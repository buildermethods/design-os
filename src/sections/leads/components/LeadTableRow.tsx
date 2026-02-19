import { Clock, AlertTriangle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react'
import type { Lead, User, Qualification } from '@/../product/sections/leads/types'

interface LeadTableRowProps {
  lead: Lead
  owner?: User
  isSelected?: boolean
  isChecked?: boolean
  onSelect?: () => void
  onToggleCheck?: () => void
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

const qualificationConfig: Record<Qualification, { icon: typeof CheckCircle2; color: string; label: string }> = {
  'qualified': { icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', label: 'Qualified' },
  'unknown': { icon: HelpCircle, color: 'text-slate-400 dark:text-slate-500', label: 'Unknown' },
  'unqualified': { icon: XCircle, color: 'text-red-500 dark:text-red-400', label: 'Unqualified' },
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-slate-500 dark:text-slate-400'
}

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  const today = new Date()
  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1d ago'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function formatNextActionTime(nextAction: Lead['nextAction']): string {
  if (!nextAction) return '—'
  const dueDate = new Date(`${nextAction.dueDate}T${nextAction.dueTime}`)
  const now = new Date()
  const diffMs = dueDate.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMs < 0) {
    const pastHours = Math.abs(diffHours)
    if (pastHours < 24) return `${pastHours}h overdue`
    return `${Math.abs(diffDays)}d overdue`
  }
  if (diffHours < 1) return 'Now'
  if (diffHours < 24) return `In ${diffHours}h`
  return `In ${diffDays}d`
}

function isOverdue(nextAction: Lead['nextAction']): boolean {
  if (!nextAction) return false
  const dueDate = new Date(`${nextAction.dueDate}T${nextAction.dueTime}`)
  return dueDate.getTime() < Date.now()
}

export function LeadTableRow({
  lead,
  owner,
  isSelected,
  isChecked,
  onSelect,
  onToggleCheck,
}: LeadTableRowProps) {
  const QualIcon = qualificationConfig[lead.qualification].icon
  const qualColor = qualificationConfig[lead.qualification].color
  const hasBadNumber = lead.flags.includes('bad_number')
  const nextActionOverdue = isOverdue(lead.nextAction)

  return (
    <tr
      onClick={onSelect}
      className={`
        group cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800
        ${isSelected
          ? 'bg-indigo-50 dark:bg-indigo-900/20'
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }
        ${hasBadNumber ? 'opacity-60' : ''}
      `}
    >
      {/* Checkbox */}
      <td className="w-10 px-3 py-3">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => {
            e.stopPropagation()
            onToggleCheck?.()
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
        />
      </td>

      {/* Lead (Name + Phone) */}
      <td className="px-3 py-3 min-w-[180px]">
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
            {lead.name}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
            {lead.phone}
          </span>
        </div>
        {hasBadNumber && (
          <div className="flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3 text-red-500" />
            <span className="text-xs text-red-500">Bad number</span>
          </div>
        )}
      </td>

      {/* Score */}
      <td className="px-3 py-3 w-16">
        <span className={`font-mono font-semibold text-lg ${getScoreColor(lead.score)}`}>
          {lead.score}
        </span>
      </td>

      {/* Source */}
      <td className="px-3 py-3">
        <span className={`inline-flex text-xs px-2 py-1 rounded-full font-medium ${sourceColors[lead.source] || 'bg-slate-100 text-slate-700'}`}>
          {lead.source}
        </span>
      </td>

      {/* Stage */}
      <td className="px-3 py-3">
        <span className={`inline-flex text-xs px-2 py-1 rounded-full font-medium ${stageColors[lead.stage] || 'bg-slate-100 text-slate-700'}`}>
          {lead.stage}
        </span>
      </td>

      {/* Qualification */}
      <td className="px-3 py-3">
        <div className={`flex items-center gap-1.5 ${qualColor}`}>
          <QualIcon className="w-4 h-4" />
          <span className="text-sm">{qualificationConfig[lead.qualification].label}</span>
        </div>
      </td>

      {/* Next Action */}
      <td className="px-3 py-3">
        {lead.nextAction ? (
          <div className={`flex items-center gap-1.5 text-sm ${nextActionOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
            <Clock className="w-4 h-4" />
            <span className={nextActionOverdue ? 'font-medium' : ''}>
              {formatNextActionTime(lead.nextAction)}
            </span>
          </div>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )}
      </td>

      {/* Last Touch */}
      <td className="px-3 py-3">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {formatRelativeDate(lead.lastContactDate)}
        </span>
      </td>

      {/* Owner */}
      <td className="px-3 py-3">
        {owner ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
              {owner.name.charAt(0)}
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[80px]">
              {owner.name.split(' ')[0]}
            </span>
          </div>
        ) : (
          <span className="text-sm text-slate-400 italic">Unassigned</span>
        )}
      </td>
    </tr>
  )
}
