import { useState } from 'react'
import {
  X,
  Phone,
  Mail,
  Clock,
  PhoneCall,
  PhoneMissed,
  Send,
  Link2,
  ArrowRight,
  MessageSquare,
  Calendar,
  ExternalLink,
  Edit2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type {
  Lead,
  User,
  TimelineEvent,
  CallEvent,
  LinkSentEvent,
  StageChangeEvent,
  SelectOption,
  ConversationOutcomeCategory,
  NextActionOption,
  RetryTimeOption,
  LinkTypeOption,
  OutcomeFormData,
  LinkType,
  Qualification,
  Stage,
} from '../types'
import { OutcomeForm } from './OutcomeForm'

interface LeadDetailPanelProps {
  lead: Lead
  users: User[]
  currentUserId: string
  callResultOptions: SelectOption[]
  conversationOutcomeOptions: ConversationOutcomeCategory[]
  nextActionOptions: NextActionOption[]
  retryTimeOptions: RetryTimeOption[]
  lossReasonOptions: SelectOption[]
  linkTypeOptions: LinkTypeOption[]
  stageOptions: SelectOption[]
  qualificationOptions: SelectOption[]
  onClose?: () => void
  onLogOutcome?: (outcome: OutcomeFormData) => void
  onLogLinkSent?: (linkType: LinkType) => void
  onScheduleFollowUp?: (date: string, time: string, reason: string) => void
  onChangeOwner?: (newOwnerId: string) => void
  onChangeQualification?: (qualification: Qualification) => void
  onMoveStage?: (stage: Stage, reason?: string) => void
  onMarkBadNumber?: () => void
  onOpenFullProfile?: () => void
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

const qualificationLabels: Record<Qualification, string> = {
  'qualified': 'Qualified',
  'unknown': 'Unknown',
  'unqualified': 'Unqualified',
}

const callResultLabels: Record<string, string> = {
  'did_not_pick': 'Did not pick',
  'phone_busy': 'Phone busy',
  'unreachable': 'Unreachable',
  'number_incorrect': 'Number incorrect',
  'connected': 'Connected',
}

const outcomeLabels: Record<string, string> = {
  'just_browsing': 'Just browsing',
  'other_exam': 'Other exam',
  'not_eligible': 'Not eligible',
  'product_unavailable': 'Product unavailable',
  'call_back_later': 'Call back later',
  'discuss_with_family': 'Discuss with family',
  'already_purchased_competitor': 'Bought from competitor',
  'competitor_cheaper': 'Competitor cheaper',
  'affordability_barrier': 'Affordability barrier',
  'need_discount': 'Need discount',
  'already_customer': 'Already a customer',
}

const linkTypeLabels: Record<string, string> = {
  'demo': 'Demo link',
  'payment': 'Payment link',
  'syllabus': 'Syllabus PDF',
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-slate-500 dark:text-slate-400'
}

function TimelineItem({ event, users }: { event: TimelineEvent; users: User[] }) {
  const user = users.find((u) => u.id === event.userId)

  if (event.type === 'call') {
    const callEvent = event as CallEvent
    const isConnected = callEvent.callResult === 'connected'
    const Icon = isConnected ? PhoneCall : PhoneMissed

    return (
      <div className="flex gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
        <div className={`mt-0.5 ${isConnected ? 'text-emerald-500' : 'text-slate-400'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-900 dark:text-white">
              {callResultLabels[callEvent.callResult]}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400">
              {formatDate(callEvent.date)} at {formatTime(callEvent.time)}
            </span>
          </div>
          {isConnected && callEvent.conversationOutcome && (
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              {outcomeLabels[callEvent.conversationOutcome]}
            </div>
          )}
          {callEvent.notes && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {callEvent.notes}
            </p>
          )}
          {user && (
            <div className="text-xs text-slate-400 mt-1">by {user.name}</div>
          )}
        </div>
      </div>
    )
  }

  if (event.type === 'link_sent') {
    const linkEvent = event as LinkSentEvent
    return (
      <div className="flex gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
        <div className="mt-0.5 text-indigo-500">
          <Link2 className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-900 dark:text-white">
              {linkTypeLabels[linkEvent.linkType]} sent
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400">
              {formatDate(linkEvent.date)} at {formatTime(linkEvent.time)}
            </span>
          </div>
          {user && (
            <div className="text-xs text-slate-400 mt-1">by {user.name}</div>
          )}
        </div>
      </div>
    )
  }

  if (event.type === 'stage_change') {
    const stageEvent = event as StageChangeEvent
    return (
      <div className="flex gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
        <div className="mt-0.5 text-slate-400">
          <ArrowRight className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-900 dark:text-white">
              Stage: {stageEvent.fromStage} → {stageEvent.toStage}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400">
              {formatDate(stageEvent.date)}
            </span>
          </div>
          {stageEvent.reason && (
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Reason: {stageEvent.reason}
            </div>
          )}
          {user && (
            <div className="text-xs text-slate-400 mt-1">by {user.name}</div>
          )}
        </div>
      </div>
    )
  }

  return null
}

export function LeadDetailPanel({
  lead,
  users,
  currentUserId,
  callResultOptions,
  conversationOutcomeOptions,
  nextActionOptions,
  retryTimeOptions,
  lossReasonOptions,
  linkTypeOptions,
  stageOptions,
  qualificationOptions,
  onClose,
  onLogOutcome,
  onLogLinkSent,
  onScheduleFollowUp,
  onChangeOwner,
  onChangeQualification,
  onMoveStage,
  onMarkBadNumber,
  onOpenFullProfile,
}: LeadDetailPanelProps) {
  const [showOutcomeForm, setShowOutcomeForm] = useState(false)
  const [showLinkMenu, setShowLinkMenu] = useState(false)
  const [showOwnerMenu, setShowOwnerMenu] = useState(false)
  const [showStageMenu, setShowStageMenu] = useState(false)
  const [showQualMenu, setShowQualMenu] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [showFullTimeline, setShowFullTimeline] = useState(false)

  const owner = users.find((u) => u.id === lead.ownerId)
  const sortedTimeline = [...lead.timeline].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateB.getTime() - dateA.getTime()
  })
  const previewTimeline = sortedTimeline.slice(0, 3)
  const remainingTimeline = sortedTimeline.slice(3)

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(lead.phone)
    setCopiedPhone(true)
    setTimeout(() => setCopiedPhone(false), 2000)
  }

  const handleLogOutcome = (data: OutcomeFormData) => {
    onLogOutcome?.(data)
    setShowOutcomeForm(false)
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700">
      {/* Header - Above the fold */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
              {lead.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`font-mono font-semibold ${getScoreColor(lead.score)}`}>
                {lead.score}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${sourceColors[lead.source]}`}>
                {lead.source}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${stageColors[lead.stage]}`}>
                {lead.stage}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phone + Copy */}
        <div className="mt-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-slate-400" />
          <span className="font-mono text-slate-900 dark:text-white">{lead.phone}</span>
          <button
            onClick={handleCopyPhone}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded"
          >
            {copiedPhone ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Owner + Qualification (editable) */}
        <div className="mt-3 flex items-center gap-4">
          {/* Owner dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowOwnerMenu(!showOwnerMenu)}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {owner ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs">
                    {owner.name.charAt(0)}
                  </div>
                  <span>{owner.name}</span>
                </>
              ) : (
                <span className="italic">Unassigned</span>
              )}
              <Edit2 className="w-3 h-3" />
            </button>
            {showOwnerMenu && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onChangeOwner?.(u.id)
                      setShowOwnerMenu(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs">
                      {u.name.charAt(0)}
                    </div>
                    {u.name}
                    {u.id === lead.ownerId && <Check className="w-4 h-4 ml-auto text-indigo-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-slate-300 dark:text-slate-600">|</span>

          {/* Qualification dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowQualMenu(!showQualMenu)}
              className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <span>{qualificationLabels[lead.qualification]}</span>
              <Edit2 className="w-3 h-3" />
            </button>
            {showQualMenu && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                {qualificationOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onChangeQualification?.(opt.id as Qualification)
                      setShowQualMenu(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    {opt.label}
                    {opt.id === lead.qualification && <Check className="w-4 h-4 text-indigo-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Next Action indicator */}
        {lead.nextAction && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-amber-800 dark:text-amber-300 truncate">
                {lead.nextAction.reason}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400">
                Due: {formatDate(lead.nextAction.dueDate)} at {formatTime(lead.nextAction.dueTime)}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setShowOutcomeForm(!showOutcomeForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            Log Call
          </button>
          <button
            onClick={() => window.open(`https://wa.me/91${lead.phone}`, '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp
          </button>
          <button
            onClick={() => onScheduleFollowUp?.('', '', '')}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
          <div className="relative">
            <button
              onClick={() => setShowLinkMenu(!showLinkMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Send Link
            </button>
            {showLinkMenu && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                {linkTypeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onLogLinkSent?.(opt.id)
                      setShowLinkMenu(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Outcome Form (inline, expandable) */}
        {showOutcomeForm && (
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <OutcomeForm
              callResultOptions={callResultOptions}
              conversationOutcomeOptions={conversationOutcomeOptions}
              nextActionOptions={nextActionOptions}
              retryTimeOptions={retryTimeOptions}
              lossReasonOptions={lossReasonOptions}
              onSubmit={handleLogOutcome}
              onCancel={() => setShowOutcomeForm(false)}
            />
          </div>
        )}

        {/* Mini Timeline Preview */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Recent Activity
            </h3>
            {sortedTimeline.length > 3 && (
              <button
                onClick={() => setShowFullTimeline(!showFullTimeline)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {showFullTimeline ? 'Show less' : `View all (${sortedTimeline.length})`}
                {showFullTimeline ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>
          {sortedTimeline.length > 0 ? (
            <div className="space-y-0">
              {(showFullTimeline ? sortedTimeline : previewTimeline).map((event) => (
                <TimelineItem key={event.id} event={event} users={users} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No activity yet</p>
          )}
        </div>

        {/* Extra Fields */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
            Lead Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-slate-400 text-xs uppercase tracking-wide">Exam</div>
              <div className="text-slate-900 dark:text-white">{lead.extraFields.exam}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs uppercase tracking-wide">Attempt</div>
              <div className="text-slate-900 dark:text-white">{lead.extraFields.attempt}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs uppercase tracking-wide">City</div>
              <div className="text-slate-900 dark:text-white">{lead.extraFields.city}</div>
            </div>
            <div>
              <div className="text-slate-400 text-xs uppercase tracking-wide">Language</div>
              <div className="text-slate-900 dark:text-white">{lead.extraFields.language}</div>
            </div>
          </div>
        </div>

        {/* Stage Change */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
            Move Stage
          </h3>
          <div className="relative">
            <button
              onClick={() => setShowStageMenu(!showStageMenu)}
              className="w-full flex items-center justify-between px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <span className={`px-2 py-0.5 rounded-full text-xs ${stageColors[lead.stage]}`}>
                {lead.stage}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showStageMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                {stageOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onMoveStage?.(opt.label as Stage)
                      setShowStageMenu(false)
                    }}
                    disabled={opt.label === lead.stage}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                  >
                    <span className={`px-2 py-0.5 rounded-full text-xs ${stageColors[opt.label] || 'bg-slate-100'}`}>
                      {opt.label}
                    </span>
                    {opt.label === lead.stage && <Check className="w-4 h-4 text-indigo-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={onOpenFullProfile}
              className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Open full profile
            </button>
            <button
              onClick={onMarkBadNumber}
              className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              <X className="w-4 h-4" />
              Mark as bad number
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
