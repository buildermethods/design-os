import { useState, useEffect } from 'react'
import { Check, X, Clock, Send, Calendar, Trophy, XCircle } from 'lucide-react'
import type {
  CallResult,
  ConversationOutcome,
  NextActionType,
  SelectOption,
  ConversationOutcomeCategory,
  NextActionOption,
  RetryTimeOption,
  OutcomeFormData,
} from '../types'

interface OutcomeFormProps {
  callResultOptions: SelectOption[]
  conversationOutcomeOptions: ConversationOutcomeCategory[]
  nextActionOptions: NextActionOption[]
  retryTimeOptions: RetryTimeOption[]
  lossReasonOptions: SelectOption[]
  onSubmit?: (data: OutcomeFormData) => void
  onCancel?: () => void
}

const callResultIcons: Record<CallResult, typeof Check> = {
  'did_not_pick': X,
  'phone_busy': X,
  'unreachable': X,
  'number_incorrect': XCircle,
  'connected': Check,
}

const nextActionIcons: Record<NextActionType, typeof Send> = {
  'send_demo_link': Send,
  'send_payment_link': Send,
  'send_syllabus_link': Send,
  'schedule_follow_up': Calendar,
  'close_won': Trophy,
  'close_lost': XCircle,
}

export function OutcomeForm({
  callResultOptions,
  conversationOutcomeOptions,
  nextActionOptions,
  retryTimeOptions,
  lossReasonOptions,
  onSubmit,
  onCancel,
}: OutcomeFormProps) {
  const [callResult, setCallResult] = useState<CallResult | null>(null)
  const [conversationOutcome, setConversationOutcome] = useState<ConversationOutcome | null>(null)
  const [nextAction, setNextAction] = useState<NextActionType | null>(null)
  const [retryTime, setRetryTime] = useState<string | null>(null)
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpTime, setFollowUpTime] = useState('')
  const [notes, setNotes] = useState('')
  const [lossReason, setLossReason] = useState<string | null>(null)
  const [wonCourse, setWonCourse] = useState('')
  const [wonAmount, setWonAmount] = useState('')

  const isConnected = callResult === 'connected'
  const isNotConnected = callResult && ['did_not_pick', 'phone_busy', 'unreachable'].includes(callResult)
  const isNumberIncorrect = callResult === 'number_incorrect'
  const needsFollowUp = nextAction && ['send_demo_link', 'send_payment_link', 'send_syllabus_link', 'schedule_follow_up'].includes(nextAction)
  const isClosingLost = nextAction === 'close_lost'
  const isClosingWon = nextAction === 'close_won'

  // Validation
  const isValid = (() => {
    if (!callResult) return false
    if (isNotConnected && !retryTime) return false
    if (isConnected && !conversationOutcome) return false
    if (isConnected && !nextAction) return false
    if (needsFollowUp && (!followUpDate || !followUpTime)) return false
    if (isClosingLost && !lossReason) return false
    return true
  })()

  const handleSubmit = () => {
    if (!isValid || !callResult) return

    const data: OutcomeFormData = {
      callResult,
      conversationOutcome: conversationOutcome || undefined,
      nextAction: nextAction || undefined,
      retryTime: retryTime || undefined,
      followUpDate: followUpDate || undefined,
      followUpTime: followUpTime || undefined,
      notes: notes || undefined,
      lossReason: lossReason || undefined,
      wonCourse: wonCourse || undefined,
      wonAmount: wonAmount ? parseFloat(wonAmount) : undefined,
    }

    onSubmit?.(data)
  }

  // Reset dependent fields when call result changes
  useEffect(() => {
    if (!isConnected) {
      setConversationOutcome(null)
      setNextAction(null)
      setLossReason(null)
      setWonCourse('')
      setWonAmount('')
    }
    if (!isNotConnected) {
      setRetryTime(null)
    }
  }, [callResult, isConnected, isNotConnected])

  // Reset loss reason when next action changes
  useEffect(() => {
    if (!isClosingLost) {
      setLossReason(null)
    }
    if (!isClosingWon) {
      setWonCourse('')
      setWonAmount('')
    }
  }, [nextAction, isClosingLost, isClosingWon])

  return (
    <div className="space-y-6">
      {/* Call Result */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Call Result <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {callResultOptions.map((option) => {
            const Icon = callResultIcons[option.id as CallResult]
            const isSelected = callResult === option.id
            const isConnectedOption = option.id === 'connected'

            return (
              <button
                key={option.id}
                onClick={() => setCallResult(option.id as CallResult)}
                className={`
                  flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isSelected
                    ? isConnectedOption
                      ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-slate-200 text-slate-800 ring-2 ring-slate-400 dark:bg-slate-700 dark:text-slate-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Retry Time (if not connected) */}
      {isNotConnected && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Retry Time <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {retryTimeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setRetryTime(option.id)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${retryTime === option.id
                    ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-500 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Number Incorrect Message */}
      {isNumberIncorrect && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-400">
            This lead will be marked as having an incorrect number and removed from the queue.
          </p>
        </div>
      )}

      {/* Conversation Outcome (if connected) */}
      {isConnected && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Conversation Outcome <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {conversationOutcomeOptions.map((category) => (
              <div key={category.category}>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  {category.category}
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setConversationOutcome(option.id as ConversationOutcome)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        ${conversationOutcome === option.id
                          ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Action (if connected) */}
      {isConnected && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Next Action <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {nextActionOptions.map((option) => {
              const Icon = nextActionIcons[option.id]

              return (
                <button
                  key={option.id}
                  onClick={() => setNextAction(option.id)}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${nextAction === option.id
                      ? option.id === 'close_won'
                        ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : option.id === 'close_lost'
                        ? 'bg-red-100 text-red-700 ring-2 ring-red-500 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Follow-up Date/Time (if action requires it) */}
      {needsFollowUp && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Follow-up Date & Time <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="time"
              value={followUpTime}
              onChange={(e) => setFollowUpTime(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Loss Reason (if closing lost) */}
      {isClosingLost && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Loss Reason <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {lossReasonOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setLossReason(option.id)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${lossReason === option.id
                    ? 'bg-red-100 text-red-700 ring-2 ring-red-500 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Won Details (if closing won) */}
      {isClosingWon && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Course <span className="text-slate-400">(recommended)</span>
            </label>
            <input
              type="text"
              value={wonCourse}
              onChange={(e) => setWonCourse(e.target.value)}
              placeholder="e.g., UGC NET Complete Course"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Amount <span className="text-slate-400">(recommended)</span>
            </label>
            <input
              type="number"
              value={wonAmount}
              onChange={(e) => setWonAmount(e.target.value)}
              placeholder="e.g., 12999"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Notes <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about this call..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`
            flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors
            ${isValid
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
            }
          `}
        >
          Log Outcome
        </button>
      </div>
    </div>
  )
}
