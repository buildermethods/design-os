import { X, Phone, Mail, Clock, PhoneCall, PhoneMissed, History } from 'lucide-react'
import type {
  Lead,
  Call,
  CallResultOption,
  ConversationOutcomeCategory,
  NextActionOption,
  RetryTimeOption,
  OutcomeFormData,
} from '@/../product/sections/today/types'
import { OutcomeForm } from './OutcomeForm'

interface LeadPanelProps {
  lead: Lead
  callResultOptions: CallResultOption[]
  conversationOutcomeOptions: ConversationOutcomeCategory[]
  nextActionOptions: NextActionOption[]
  retryTimeOptions: RetryTimeOption[]
  onClose?: () => void
  onLogOutcome?: (data: OutcomeFormData) => void
  onCall?: () => void
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

const actionLabels: Record<string, string> = {
  'send_demo_link': 'Sent demo link',
  'send_payment_link': 'Sent payment link',
  'schedule_follow_up': 'Scheduled follow-up',
  'close_won': 'Closed Won',
  'close_lost': 'Closed Lost',
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function CallHistoryItem({ call }: { call: Call }) {
  const isConnected = call.callResult === 'connected'
  const Icon = isConnected ? PhoneCall : PhoneMissed

  return (
    <div className="flex gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className={`mt-0.5 ${isConnected ? 'text-emerald-500' : 'text-slate-400'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-900 dark:text-white">
            {callResultLabels[call.callResult]}
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 dark:text-slate-400">
            {formatDate(call.date)} at {call.time}
          </span>
        </div>
        {isConnected && call.conversationOutcome && (
          <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {outcomeLabels[call.conversationOutcome]}
            {call.nextAction && ` → ${actionLabels[call.nextAction]}`}
          </div>
        )}
        {call.notes && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {call.notes}
          </p>
        )}
      </div>
    </div>
  )
}

export function LeadPanel({
  lead,
  callResultOptions,
  conversationOutcomeOptions,
  nextActionOptions,
  retryTimeOptions,
  onClose,
  onLogOutcome,
  onCall,
}: LeadPanelProps) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {lead.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-mono">{lead.score}</span>
              <span>·</span>
              <span>{lead.source}</span>
              <span>·</span>
              <span>{lead.stage}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Contact Info */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
            Contact Information
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400" />
              <a
                href={`tel:${lead.phone}`}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {lead.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <a
                href={`mailto:${lead.email}`}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {lead.email}
              </a>
            </div>
          </div>

          {/* Quick call button */}
          <button
            onClick={onCall}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Now</span>
          </button>
        </div>

        {/* Follow-up reason (if applicable) */}
        {lead.followUp && (
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/10">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  Follow-up Reason
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">
                  {lead.followUp.reason}
                </p>
                <div className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  Due: {formatDate(lead.followUp.dueDate)} at {lead.followUp.dueTime}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call History */}
        {lead.calls.length > 0 && (
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Call History ({lead.calls.length})
              </h3>
            </div>
            <div className="space-y-0">
              {lead.calls.map((call) => (
                <CallHistoryItem key={call.id} call={call} />
              ))}
            </div>
          </div>
        )}

        {/* Outcome Form */}
        <div className="px-6 py-4">
          <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-4">
            Log Call Outcome
          </h3>
          <OutcomeForm
            callResultOptions={callResultOptions}
            conversationOutcomeOptions={conversationOutcomeOptions}
            nextActionOptions={nextActionOptions}
            retryTimeOptions={retryTimeOptions}
            onSubmit={onLogOutcome}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  )
}
