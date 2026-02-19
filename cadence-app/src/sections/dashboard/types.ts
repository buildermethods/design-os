// =============================================================================
// Metric Definitions (Internal Alignment)
// =============================================================================

/**
 * Documents how each metric is calculated.
 * Not for end-user display — prevents internal disputes about metric logic.
 */
export interface MetricDefinitions {
  _note: string
  callsMade: string
  connected: string
  connectRate: string
  hotLeads: string
  won: string
  lost: string
  dateFields: {
    callMetrics: string
    stageMetrics: string
  }
}

// =============================================================================
// Core Types
// =============================================================================

export type UserRole = 'bd' | 'founder' | 'admin'

export type FilterVisibility = 'all' | 'founder_only'

export type DateRangeOption = 'today' | 'this_week' | 'this_month' | 'custom'

export interface User {
  id: string
  name: string
  role: UserRole
}

// =============================================================================
// Drilldown Filters
// =============================================================================

/**
 * Filter payload passed to Leads section when clicking a metric or chart segment.
 * Maps directly to Leads section filter parameters.
 */
export interface DrilldownFilter {
  /** Filter leads that have at least one call */
  hasCall?: boolean
  /** Filter leads that have at least one connected call */
  hasConnectedCall?: boolean
  /** Apply call filters within the selected date range */
  callDateRange?: 'selected_range'
  /** Filter leads in specific stages (by stage ID) */
  stageIn?: string[]
  /** Only include leads whose stage changed within the selected range */
  stageChangedInRange?: boolean
  /** Filter by specific drop reason ID (null = unknown/not captured) */
  dropReasonId?: string | null
}

// =============================================================================
// Funnel Metrics
// =============================================================================

export interface FunnelMetric {
  value: number
  label: string
  /** Unit for display (e.g., 'percent' for rates) */
  unit?: 'percent'
  /** Filter to apply when clicking this metric. Null if not drillable. */
  drilldownFilter: DrilldownFilter | null
}

export interface FunnelMetrics {
  callsMade: FunnelMetric
  connected: FunnelMetric
  connectRate: FunnelMetric
  hotLeads: FunnelMetric
  won: FunnelMetric
  lost: FunnelMetric
}

// =============================================================================
// Drop Reason Stats
// =============================================================================

export interface DropReasonStat {
  /** Stable identifier for the drop reason. Null for "Unknown / Not captured" bucket. */
  dropReasonId: string | null
  /** Display text for the reason */
  reason: string
  /** Number of lost leads with this reason */
  count: number
  /** Percentage of total lost leads */
  percentage: number
  /** Filter to apply when clicking this chart segment */
  drilldownFilter: DrilldownFilter
}

// =============================================================================
// Filter Options
// =============================================================================

export interface FilterOptionItem {
  id: string
  label: string
}

export interface FilterConfig<T extends string = string> {
  options: FilterOptionItem[]
  /** Who can see this filter */
  visibility: FilterVisibility
  /** Default selected value */
  default: T
}

export interface FilterOptions {
  dateRange: FilterConfig<DateRangeOption | string>
  bds: FilterConfig
  sources: FilterConfig
  pipelines: FilterConfig
  stages: FilterConfig
}

export interface SelectedFilters {
  dateRange: DateRangeOption | string
  bdId: string
  sourceId: string
  pipelineId: string
  stageId: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface DashboardProps {
  /** The currently logged-in user */
  currentUser: User

  /** Aggregated funnel metrics for the selected filters */
  funnelMetrics: FunnelMetrics

  /** Breakdown of drop reasons for the chart */
  dropReasonStats: DropReasonStat[]

  /** Available filter options with visibility metadata */
  filterOptions: FilterOptions

  /** Currently selected filter values */
  selectedFilters: SelectedFilters

  /** Called when user clicks a funnel metric to drill down */
  onMetricClick?: (metricKey: keyof FunnelMetrics, filter: DrilldownFilter) => void

  /** Called when user clicks a drop reason chart segment */
  onDropReasonClick?: (dropReasonId: string | null, filter: DrilldownFilter) => void

  /** Called when user changes a filter selection */
  onFilterChange?: (filterKey: keyof SelectedFilters, value: string) => void

  /** Called when user selects a custom date range */
  onCustomDateRange?: (startDate: string, endDate: string) => void
}
