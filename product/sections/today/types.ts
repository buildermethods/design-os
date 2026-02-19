// =============================================================================
// Core Types
// =============================================================================

export type CallResult =
  | 'did_not_pick'
  | 'phone_busy'
  | 'unreachable'
  | 'number_incorrect'
  | 'connected'

export type ConversationOutcome =
  // Intent / Fit
  | 'just_browsing'
  | 'other_exam'
  | 'not_eligible'
  | 'product_unavailable'
  // Timing
  | 'call_back_later'
  | 'discuss_with_family'
  // Competition
  | 'already_purchased_competitor'
  | 'competitor_cheaper'
  // Pricing
  | 'affordability_barrier'
  | 'need_discount'
  // Customer State
  | 'already_customer'

export type NextAction =
  | 'send_demo_link'
  | 'send_payment_link'
  | 'schedule_follow_up'
  | 'close_won'
  | 'close_lost'

export type Source =
  | 'YouTube'
  | 'WhatsApp Group'
  | 'App Install'
  | 'Referral'
  | 'Paid Ad'

export type Stage =
  | 'New'
  | 'Contacted'
  | 'Hot'
  | 'Demo Scheduled'
  | 'Won'
  | 'Lost'

export type FollowUpPriority = 'high' | 'medium' | 'low'

// =============================================================================
// Data Entities
// =============================================================================

export interface Call {
  id: string
  date: string
  time: string
  callResult: CallResult
  conversationOutcome?: ConversationOutcome | null
  nextAction?: NextAction
  notes: string | null
}

export interface FollowUp {
  id: string
  reason: string
  dueDate: string
  dueTime: string
  priority: FollowUpPriority
}

export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  score: number
  source: Source
  stage: Stage
  lastContactDate: string | null
  followUp?: FollowUp
  calls: Call[]
}

export interface Stats {
  callsMade: number
  connected: number
  followUpsCleared: number
  remainingInQueue: number
}

// =============================================================================
// Form Options
// =============================================================================

export interface CallResultOption {
  id: CallResult
  label: string
}

export interface ConversationOutcomeOption {
  id: ConversationOutcome
  label: string
}

export interface ConversationOutcomeCategory {
  category: string
  options: ConversationOutcomeOption[]
}

export interface NextActionOption {
  id: NextAction
  label: string
  requiresFollowUp: boolean
}

export interface RetryTimeOption {
  id: string
  label: string
}

// =============================================================================
// Outcome Form Data
// =============================================================================

export interface OutcomeFormData {
  callResult: CallResult
  conversationOutcome?: ConversationOutcome
  nextAction?: NextAction
  retryTime?: string
  followUpDate?: string
  followUpTime?: string
  notes?: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface TodayProps {
  /** Today's progress statistics */
  stats: Stats
  /** Leads with follow-ups due today */
  followUpsDue: Lead[]
  /** New leads prioritized by score */
  newLeads: Lead[]
  /** Options for call result dropdown */
  callResultOptions: CallResultOption[]
  /** Options for conversation outcome (grouped by category) */
  conversationOutcomeOptions: ConversationOutcomeCategory[]
  /** Options for next action */
  nextActionOptions: NextActionOption[]
  /** Options for retry time when not connected */
  retryTimeOptions: RetryTimeOption[]
  /** Called when user switches between Follow-ups and New Leads tabs */
  onTabChange?: (tab: 'followups' | 'newleads') => void
  /** Called when user selects a lead to view details */
  onSelectLead?: (leadId: string) => void
  /** Called when user closes the lead detail panel */
  onClosePanel?: () => void
  /** Called when user submits the outcome form */
  onLogOutcome?: (leadId: string, outcome: OutcomeFormData) => void
  /** Called when user clicks the call button on a lead */
  onInitiateCall?: (leadId: string) => void
}
