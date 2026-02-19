// =============================================================================
// Enums and Constants
// =============================================================================

export type UserRole = 'bd' | 'admin' | 'founder'

export type StageType = 'open' | 'won' | 'lost'

export type DropReasonCategory =
  | 'pricing'
  | 'timing'
  | 'eligibility'
  | 'competitor'
  | 'noResponse'
  | 'other'

export type SettingsTab = 'pipelines' | 'dropReasons' | 'team'

export type StageColor =
  | 'slate'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'amber'
  | 'emerald'
  | 'rose'

// =============================================================================
// Core Entities
// =============================================================================

export interface Pipeline {
  id: string
  name: string
  description: string
  isDefault: boolean
  /** IDs of stages in this pipeline (for UI convenience) */
  stageIds: string[]
  createdAt: string
  /** ISO timestamp if archived, null if active */
  archivedAt: string | null
}

export interface Stage {
  id: string
  /** Which pipeline this stage belongs to */
  pipelineId: string
  name: string
  /** open = in progress, won = conversion, lost = dropped */
  type: StageType
  /** Display order within the pipeline (1-based) */
  order: number
  /** Tailwind color name for UI display */
  color: StageColor
  /** If true, leads in this stage count toward "Hot Leads" metric */
  isHot: boolean
  /** ISO timestamp if archived, null if active */
  archivedAt: string | null
}

export interface DropReason {
  id: string
  reason: string
  category: DropReasonCategory
  isActive: boolean
  /** Read-only: Number of leads using this reason (derived from Leads table) */
  usageCount?: number
  /** ISO timestamp if archived, null if active */
  archivedAt: string | null
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  /** Pipeline IDs this user is assigned to work on */
  assignedPipelineIds: string[]
  createdAt: string
  /** ISO timestamp if deactivated, null if active */
  deactivatedAt: string | null
}

// =============================================================================
// Permissions
// =============================================================================

export interface SettingsPermissions {
  canAccessSettings: boolean
  canManagePipelines: boolean
  canManageDropReasons: boolean
  canManageUsers: boolean
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: SettingsPermissions
}

// =============================================================================
// UI State
// =============================================================================

export interface SettingsUIState {
  activeTab: SettingsTab
  selectedPipelineId: string | null
}

// =============================================================================
// System Rules (read-only hints for UI)
// =============================================================================

export interface SystemRules {
  pipelineHint: string
  defaultPipelineWarning: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface SettingsProps {
  /** Currently logged-in user with permissions */
  currentUser: CurrentUser

  /** UI state (active tab, selected pipeline) */
  ui: SettingsUIState

  /** All pipelines (active and archived) */
  pipelines: Pipeline[]

  /** All stages across all pipelines */
  stages: Stage[]

  /** All drop reasons */
  dropReasons: DropReason[]

  /** All team members */
  users: User[]

  /** System rules text for UI hints */
  systemRules: SystemRules

  // -------------------------------------------------------------------------
  // Tab navigation
  // -------------------------------------------------------------------------

  /** Called when user switches tabs */
  onTabChange?: (tab: SettingsTab) => void

  // -------------------------------------------------------------------------
  // Pipeline actions
  // -------------------------------------------------------------------------

  /** Called when user selects a pipeline to view/edit */
  onSelectPipeline?: (pipelineId: string) => void

  /** Called when user creates a new pipeline */
  onCreatePipeline?: () => void

  /** Called when user edits a pipeline */
  onEditPipeline?: (pipelineId: string) => void

  /** Called when user archives a pipeline */
  onArchivePipeline?: (pipelineId: string) => void

  /** Called when user sets a pipeline as default (triggers confirmation modal) */
  onSetDefaultPipeline?: (pipelineId: string) => void

  // -------------------------------------------------------------------------
  // Stage actions
  // -------------------------------------------------------------------------

  /** Called when user creates a new stage */
  onCreateStage?: (pipelineId: string) => void

  /** Called when user edits a stage */
  onEditStage?: (stageId: string) => void

  /** Called when user archives a stage */
  onArchiveStage?: (stageId: string) => void

  /** Called when user reorders stages (drag & drop) */
  onReorderStages?: (pipelineId: string, stageIds: string[]) => void

  // -------------------------------------------------------------------------
  // Drop reason actions
  // -------------------------------------------------------------------------

  /** Called when user creates a new drop reason */
  onCreateDropReason?: () => void

  /** Called when user edits a drop reason */
  onEditDropReason?: (dropReasonId: string) => void

  /** Called when user toggles a drop reason's active status */
  onToggleDropReasonActive?: (dropReasonId: string, isActive: boolean) => void

  // -------------------------------------------------------------------------
  // User/team actions
  // -------------------------------------------------------------------------

  /** Called when user invites a new team member */
  onInviteUser?: () => void

  /** Called when user edits a team member */
  onEditUser?: (userId: string) => void

  /** Called when user deactivates a team member */
  onDeactivateUser?: (userId: string) => void

  /** Called when user reactivates a team member */
  onReactivateUser?: (userId: string) => void
}

// =============================================================================
// Form Data Types (for side drawer forms)
// =============================================================================

export interface PipelineFormData {
  name: string
  description: string
}

export interface StageFormData {
  name: string
  type: StageType
  color: StageColor
  isHot: boolean
}

export interface DropReasonFormData {
  reason: string
  category: DropReasonCategory
}

export interface UserFormData {
  name: string
  email: string
  role: UserRole
  assignedPipelineIds: string[]
}

// =============================================================================
// Validation Types
// =============================================================================

export interface PipelineValidation {
  hasWonStage: boolean
  hasLostStage: boolean
  isValid: boolean
  errors: string[]
}
