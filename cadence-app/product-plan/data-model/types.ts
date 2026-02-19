// =============================================================================
// Enums and Constants
// =============================================================================

export type UserRole = 'bd' | 'admin' | 'founder'

export type StageType = 'open' | 'won' | 'lost'

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

export type Qualification = 'qualified' | 'unknown' | 'unqualified'

export type LeadFlag = 'bad_number' | 'already_customer'

export type LinkType = 'demo' | 'payment' | 'syllabus'

export type DropReasonCategory =
  | 'pricing'
  | 'timing'
  | 'eligibility'
  | 'competitor'
  | 'noResponse'
  | 'other'

// =============================================================================
// Core Entities
// =============================================================================

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string | null
  isActive: boolean
  assignedPipelineIds: string[]
  createdAt: string
  deactivatedAt: string | null
}

export interface Pipeline {
  id: string
  name: string
  description: string
  isDefault: boolean
  stageIds: string[]
  createdAt: string
  archivedAt: string | null
}

export interface Stage {
  id: string
  pipelineId: string
  name: string
  type: StageType
  order: number
  color: string
  isHot: boolean
  archivedAt: string | null
}

export interface DropReason {
  id: string
  reason: string
  category: DropReasonCategory
  isActive: boolean
  usageCount?: number
  archivedAt: string | null
}

export interface SourceEntity {
  id: string
  name: Source
  description?: string
}

// =============================================================================
// Lead and Related Entities
// =============================================================================

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

export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  score: number
  source: Source
  stage: string // Stage name or ID
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
// Timeline Events
// =============================================================================

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
  fromStage: string
  toStage: string
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

// =============================================================================
// Follow-Up
// =============================================================================

export type FollowUpPriority = 'high' | 'medium' | 'low'

export interface FollowUp {
  id: string
  leadId: string
  reason: string
  dueDate: string
  dueTime: string
  priority: FollowUpPriority
  assignedUserId: string
  completedAt: string | null
}

// =============================================================================
// Call
// =============================================================================

export interface Call {
  id: string
  leadId: string
  userId: string
  date: string
  time: string
  callResult: CallResult
  conversationOutcome?: ConversationOutcome | null
  nextAction?: NextActionType
  notes: string | null
  createdAt: string
}

// =============================================================================
// Dashboard Metrics
// =============================================================================

export interface FunnelMetrics {
  callsMade: number
  connected: number
  connectRate: number
  hotLeads: number
  won: number
  lost: number
}

export interface DropReasonStat {
  dropReasonId: string | null
  reason: string
  count: number
  percentage: number
}
