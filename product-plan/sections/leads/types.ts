// =============================================================================
// Core Types (reused from Today for consistency)
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

export type NextActionType =
  | 'send_demo_link'
  | 'send_payment_link'
  | 'send_syllabus_link'
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

export type Qualification = 'qualified' | 'unknown' | 'unqualified'

export type LeadFlag = 'bad_number' | 'already_customer'

export type LinkType = 'demo' | 'payment' | 'syllabus'

export type UserRole = 'bd' | 'founder' | 'admin'

// =============================================================================
// Data Entities
// =============================================================================

export interface User {
  id: string
  name: string
  role: UserRole
  avatar: string | null
}

export interface NextAction {
  type: 'follow_up' | 'retry'
  reason: string
  dueDate: string
  dueTime: string
}

export interface WonDetails {
  course: string
  amount: number
}

export interface ExtraFields {
  exam: string
  attempt: string
  city: string
  language: string
}

// Timeline event types
export interface CallEvent {
  id: string
  type: 'call'
  date: string
  time: string
  callResult: CallResult
  conversationOutcome?: ConversationOutcome | null
  nextAction?: NextActionType
  notes: string | null
  userId: string
}

export interface LinkSentEvent {
  id: string
  type: 'link_sent'
  date: string
  time: string
  linkType: LinkType
  userId: string
}

export interface StageChangeEvent {
  id: string
  type: 'stage_change'
  date: string
  time: string
  fromStage: Stage
  toStage: Stage
  reason?: string
  userId: string
}

export interface NoteEvent {
  id: string
  type: 'note'
  date: string
  time: string
  content: string
  userId: string
}

export type TimelineEvent = CallEvent | LinkSentEvent | StageChangeEvent | NoteEvent

export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  score: number
  source: Source
  stage: Stage
  qualification: Qualification
  ownerId: string | null
  nextAction: NextAction | null
  lastContactDate: string | null
  createdDate: string
  flags: LeadFlag[]
  extraFields: ExtraFields
  timeline: TimelineEvent[]
  lossReason?: string
  wonDetails?: WonDetails
}

// =============================================================================
// Filter Types
// =============================================================================

export type QuickFilter =
  | 'myLeads'
  | 'overdue'
  | 'dueToday'
  | 'hot'
  | 'new'
  | 'unassigned'
  | 'lost7d'

export interface FilterCounts {
  myLeads: number
  overdue: number
  dueToday: number
  hot: number
  new: number
  unassigned: number
  lost7d: number
}

export interface AdvancedFilters {
  sources?: string[]
  stages?: string[]
  owners?: string[]
  qualification?: Qualification
  nextActionDue?: 'overdue' | 'today' | 'next7d' | 'none'
  lastContacted?: 'today' | 'last7d' | 'last30d' | { start: string; end: string }
  createdDate?: 'last7d' | 'last30d' | { start: string; end: string }
  lastOutcome?: ConversationOutcome
  lastCallResult?: CallResult
  flags?: LeadFlag[]
}

export type SortField = 'score' | 'nextActionDue' | 'lastContactDate' | 'createdDate' | 'name'
export type SortOrder = 'asc' | 'desc'

// =============================================================================
// Form Options (for dropdowns)
// =============================================================================

export interface SelectOption {
  id: string
  label: string
}

export interface ConversationOutcomeCategory {
  category: string
  options: SelectOption[]
}

export interface NextActionOption {
  id: NextActionType
  label: string
  requiresFollowUp: boolean
}

export interface RetryTimeOption {
  id: string
  label: string
}

export interface LinkTypeOption {
  id: LinkType
  label: string
}

// =============================================================================
// Outcome Form Data (reused from Today)
// =============================================================================

export interface OutcomeFormData {
  callResult: CallResult
  conversationOutcome?: ConversationOutcome
  nextAction?: NextActionType
  retryTime?: string
  followUpDate?: string
  followUpTime?: string
  notes?: string
  lossReason?: string
  wonCourse?: string
  wonAmount?: number
}

// =============================================================================
// Bulk Action Types
// =============================================================================

export interface BulkAssignPayload {
  leadIds: string[]
  ownerId: string
}

export interface BulkQualifyPayload {
  leadIds: string[]
  qualification: Qualification
}

export interface BulkStageChangePayload {
  leadIds: string[]
  stage: Stage
  reason?: string
}

export interface BulkMarkBadNumberPayload {
  leadIds: string[]
}

// =============================================================================
// Merge Types
// =============================================================================

export interface MergeCandidate {
  lead: Lead
  matchReason: string
}

export interface MergePayload {
  primaryLeadId: string
  secondaryLeadIds: string[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface LeadsProps {
  /** List of all leads */
  leads: Lead[]
  /** List of users for owner assignment */
  users: User[]
  /** Current logged-in user ID */
  currentUserId: string
  /** Whether current user is admin/founder */
  isAdmin: boolean
  /** Counts for quick filter chips */
  filterCounts: FilterCounts
  /** Source options for filter dropdown */
  sourceOptions: SelectOption[]
  /** Stage options for filter dropdown */
  stageOptions: SelectOption[]
  /** Qualification options for filter dropdown */
  qualificationOptions: SelectOption[]
  /** Call result options for outcome form */
  callResultOptions: SelectOption[]
  /** Conversation outcome options (grouped) */
  conversationOutcomeOptions: ConversationOutcomeCategory[]
  /** Next action options for outcome form */
  nextActionOptions: NextActionOption[]
  /** Retry time options for not-connected calls */
  retryTimeOptions: RetryTimeOption[]
  /** Loss reason options for closing lost */
  lossReasonOptions: SelectOption[]
  /** Link type options for send link action */
  linkTypeOptions: LinkTypeOption[]

  // Search and filter callbacks
  /** Called when user types in search box */
  onSearch?: (query: string) => void
  /** Called when user clicks a quick filter chip */
  onQuickFilter?: (filter: QuickFilter | null) => void
  /** Called when user applies advanced filters */
  onAdvancedFilter?: (filters: AdvancedFilters) => void
  /** Called when user changes sort */
  onSort?: (field: SortField, order: SortOrder) => void

  // Lead selection callbacks
  /** Called when user clicks a lead row to open side panel */
  onSelectLead?: (leadId: string) => void
  /** Called when user closes the side panel */
  onClosePanel?: () => void
  /** Called when user clicks "Open full profile" */
  onOpenFullProfile?: (leadId: string) => void

  // Action callbacks (side panel)
  /** Called when user submits outcome form after logging a call */
  onLogOutcome?: (leadId: string, outcome: OutcomeFormData) => void
  /** Called when user logs a link sent */
  onLogLinkSent?: (leadId: string, linkType: LinkType) => void
  /** Called when user schedules a follow-up */
  onScheduleFollowUp?: (leadId: string, date: string, time: string, reason: string) => void
  /** Called when user edits lead phone number */
  onEditPhone?: (leadId: string, newPhone: string) => void
  /** Called when user changes lead owner */
  onChangeOwner?: (leadId: string, newOwnerId: string) => void
  /** Called when user changes lead qualification */
  onChangeQualification?: (leadId: string, qualification: Qualification) => void
  /** Called when user marks number as bad */
  onMarkBadNumber?: (leadId: string) => void
  /** Called when user moves lead to a new stage */
  onMoveStage?: (leadId: string, stage: Stage, reason?: string) => void

  // Bulk action callbacks
  /** Called when user selects/deselects leads */
  onSelectionChange?: (leadIds: string[]) => void
  /** Called when user bulk assigns owner */
  onBulkAssign?: (payload: BulkAssignPayload) => void
  /** Called when user bulk sets qualification */
  onBulkQualify?: (payload: BulkQualifyPayload) => void
  /** Called when user bulk marks bad numbers */
  onBulkMarkBadNumber?: (payload: BulkMarkBadNumberPayload) => void
  /** Called when user exports selected leads */
  onExportSelected?: (leadIds: string[]) => void
  /** Called when user exports current filtered view */
  onExportFiltered?: () => void
  /** Called when admin bulk moves stage (admin only) */
  onBulkMoveStage?: (payload: BulkStageChangePayload) => void

  // Merge callbacks
  /** Called when system detects potential duplicate on phone edit */
  onCheckDuplicate?: (phone: string) => MergeCandidate | null
  /** Called when user confirms merge */
  onMerge?: (payload: MergePayload) => void
}
