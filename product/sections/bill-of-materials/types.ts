// =============================================================================
// Bill of Materials — TypeScript Interfaces
// =============================================================================

/** Status values for BOMs */
export type BomStatus =
  | 'Draft'
  | 'In Review'
  | 'Approved'
  | 'Locked'
  | 'Archived'

/** Core BOM types (tenant can add custom types) */
export type BomTypeName = 'Design' | 'Manufacturing' | 'Sourcing' | string

/** Design BOM subtypes */
export type DesignSubtype = 'Concept' | 'Development' | 'Final'

/** Manufacturing BOM subtypes */
export type ManufacturingSubtype = 'Pre-Production' | 'Production' | 'Pilot Run'

/** Sourcing BOM subtypes */
export type SourcingSubtype = 'RFQ' | 'Awarded' | 'Confirmed'

/** All possible subtypes (tenants can define additional) */
export type BomSubtype = DesignSubtype | ManufacturingSubtype | SourcingSubtype | string

/** Material categories */
export type MaterialCategory =
  | 'Fabric'
  | 'Trims'
  | 'Thread'
  | 'Labels & Packaging'
  | 'Packaging'
  | 'Hardware'
  | 'Sub-Assembly'
  | string

/** Approval step status */
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected' | 'Skipped'

/** BOM editor view modes */
export type BomViewMode = 'tree-table' | 'inline-table' | 'diagram'

/** Cost scenario types */
export type CostScenario = 'expected' | 'best' | 'worst'

/** Sort direction */
export type SortDirection = 'asc' | 'desc'

// =============================================================================
// Core Entities
// =============================================================================

/** A configurable BOM type with subtypes */
export interface BomType {
  id: string
  name: BomTypeName
  description: string
  /** Whether this is a core (non-removable) type */
  isCore: boolean
  /** Available subtypes for this BOM type */
  subtypes: string[]
}

/** Supplier cost option for a material */
export interface SupplierCost {
  supplierId: string
  supplierName: string
  unitCost: number
  /** Minimum order quantity */
  moq: number
  /** Lead time in calendar days */
  leadTimeDays: number
}

/** A raw material, component, or sub-assembly in the material library */
export interface Material {
  id: string
  name: string
  code: string
  category: MaterialCategory
  unit: string
  defaultUnitCost: number
  currency: string
  supplierCosts: SupplierCost[]
  /** Key-value specifications (weight, width, composition, etc.) */
  specifications: Record<string, string | number | boolean>
}

/** Detailed cost breakdown for a BOM or line item */
export interface CostBreakdown {
  materialCost: number
  laborCost: number
  overheadCost: number
  shippingCost: number
  dutiesCost: number
  totalCost: number
}

/** A single entry in a BOM hierarchy */
export interface BomLineItem {
  id: string
  bomId: string
  /** Parent line item ID (null for top-level items) */
  parentLineItemId: string | null
  /** Reference to a material in the library (null for sub-assembly groupings) */
  materialId: string | null
  materialName: string
  materialCode: string | null
  category: MaterialCategory
  quantity: number
  unit: string
  unitCost: number
  totalCost: number
  /** Currently selected supplier for this line item */
  activeSupplierId: string | null
  activeSupplierName: string | null
  /** Material wastage percentage */
  wastagePercent: number
  notes: string
  sortOrder: number
  /** Nested child line items (sub-assemblies) */
  children: BomLineItem[]
}

/** A Bill of Materials */
export interface BillOfMaterials {
  id: string
  name: string
  productId: string
  productName: string
  productCode: string
  /** Style-level BOMs reference a specific style (null for product-level) */
  styleId: string | null
  styleName: string | null
  bomTypeId: string
  bomTypeName: BomTypeName
  subtype: BomSubtype
  status: BomStatus
  version: number
  totalCost: number
  currency: string
  lineItemCount: number
  createdBy: string
  modifiedBy: string
  createdAt: string
  modifiedAt: string
  assignedTo: string
  seasonId: string
  seasonName: string
  description: string
  costBreakdown: CostBreakdown
}

/** A historical version snapshot of a BOM */
export interface BomVersion {
  id: string
  bomId: string
  version: number
  status: BomStatus
  totalCost: number
  lineItemCount: number
  createdBy: string
  createdAt: string
  changeDescription: string
}

/** A single step in a BOM approval workflow */
export interface ApprovalStep {
  id: string
  bomId: string
  stepOrder: number
  role: string
  assigneeId: string
  assigneeName: string
  status: ApprovalStatus
  comment: string | null
  decidedAt: string | null
}

// =============================================================================
// Table Configuration
// =============================================================================

/** Column definition for the BOM list table */
export interface TableColumn {
  key: string
  label: string
  sortable: boolean
  filterable: boolean
  visible: boolean
  width: number
}

/** Available filter options for the BOM list */
export interface BomFilterOptions {
  bomTypes: BomTypeName[]
  subtypes: BomSubtype[]
  statuses: BomStatus[]
  seasons: string[]
  materialCategories: MaterialCategory[]
}

/** Active filter state for the BOM list */
export interface BomActiveFilters {
  search?: string
  bomType?: BomTypeName[]
  subtype?: BomSubtype[]
  status?: BomStatus[]
  seasonId?: string[]
  assignedTo?: string[]
  costMin?: number
  costMax?: number
  [key: string]: unknown
}

/** Sort configuration */
export interface SortConfig {
  key: string
  direction: SortDirection
}

// =============================================================================
// Comparison
// =============================================================================

/** A BOM selected for comparison */
export interface BomComparisonItem {
  bom: BillOfMaterials
  lineItems: BomLineItem[]
}

/** Diff result for a single line item across compared BOMs */
export interface BomLineItemDiff {
  materialId: string | null
  materialName: string
  /** 'added' | 'removed' | 'changed' | 'unchanged' */
  changeType: 'added' | 'removed' | 'changed' | 'unchanged'
  /** Values per compared BOM (keyed by BOM ID) */
  values: Record<string, { quantity: number; unitCost: number; totalCost: number } | null>
}

// =============================================================================
// Component Props
// =============================================================================

/** Props for the Bill of Materials section */
export interface BillOfMaterialsProps {
  // ─── Page Header ───
  /** Page title shown above all content */
  title?: string
  /** Brief description shown below the title */
  description?: string

  // ─── Data ───
  billsOfMaterials: BillOfMaterials[]
  /** Line items keyed by BOM ID */
  bomLineItems: Record<string, BomLineItem[]>
  bomTypes: BomType[]
  materials: Material[]
  bomVersions: BomVersion[]
  approvalSteps: ApprovalStep[]
  filterOptions: BomFilterOptions
  tableColumns: TableColumn[]

  // ─── Feature Flags ───
  /** Enable multi-source costing (default: simple rollup) */
  enableMultiSourceCosting?: boolean
  /** Enable full landed cost breakdown */
  enableLandedCost?: boolean
  /** Enable cost scenarios (best/worst/expected) */
  enableCostScenarios?: boolean
  /** Enable what-if analysis */
  enableWhatIfAnalysis?: boolean
  /** Enable visual diagram view mode */
  enableDiagramView?: boolean
  /** Enable approval workflows */
  enableApprovalWorkflows?: boolean

  // ─── BOM List Callbacks ───
  /** Called when the user navigates to a BOM detail/editor view */
  onBomSelect?: (bomId: string) => void
  /** Called when the user creates a new BOM */
  onBomCreate?: (data: Partial<BillOfMaterials>) => void
  /** Called when the user duplicates a BOM */
  onBomDuplicate?: (bomId: string) => void
  /** Called when the user archives a BOM */
  onBomArchive?: (bomId: string) => void
  /** Called when the user deletes a draft BOM */
  onBomDelete?: (bomId: string) => void

  // ─── Line Item Callbacks ───
  /** Called when a line item is added to a BOM */
  onLineItemAdd?: (bomId: string, lineItem: Partial<BomLineItem>) => void
  /** Called when a line item is updated (quantity, cost, supplier, etc.) */
  onLineItemUpdate?: (bomId: string, lineItemId: string, data: Partial<BomLineItem>) => void
  /** Called when a line item is removed from a BOM */
  onLineItemRemove?: (bomId: string, lineItemId: string) => void
  /** Called when a line item is moved/reordered in the hierarchy */
  onLineItemMove?: (bomId: string, lineItemId: string, newParentId: string | null, newSortOrder: number) => void

  // ─── Supplier & Costing Callbacks ───
  /** Called when the user changes the active supplier for a line item */
  onSupplierChange?: (bomId: string, lineItemId: string, supplierId: string) => void
  /** Called when the user switches cost scenario */
  onCostScenarioChange?: (scenario: CostScenario) => void

  // ─── Version & Comparison Callbacks ───
  /** Called when the user views a specific BOM version */
  onVersionSelect?: (bomId: string, version: number) => void
  /** Called when the user restores a previous version */
  onVersionRestore?: (bomId: string, version: number) => void
  /** Called when the user initiates a comparison of BOMs */
  onCompare?: (bomIds: string[]) => void

  // ─── Approval Callbacks ───
  /** Called when a reviewer approves a BOM at their approval step */
  onApprove?: (bomId: string, stepId: string, comment?: string) => void
  /** Called when a reviewer rejects a BOM at their approval step */
  onReject?: (bomId: string, stepId: string, comment: string) => void
  /** Called when the user submits a BOM for review */
  onSubmitForReview?: (bomId: string) => void

  // ─── Bulk Action Callbacks ───
  /** Called when the user performs a bulk status change */
  onBulkStatusChange?: (bomIds: string[], newStatus: BomStatus) => void
  /** Called when the user exports selected BOMs */
  onBulkExport?: (bomIds: string[]) => void

  // ─── Search & Filter Callbacks ───
  /** Called when the user searches */
  onSearch?: (query: string) => void
  /** Called when filters change */
  onFilterChange?: (filters: BomActiveFilters) => void
  /** Called when sort changes */
  onSortChange?: (sort: SortConfig) => void
  /** Called when the BOM editor view mode changes */
  onViewModeChange?: (mode: BomViewMode) => void
  /** Called when page changes */
  onPageChange?: (page: number) => void
  /** Called when page size changes */
  onPageSizeChange?: (size: number) => void

  // ─── Table Configuration Callbacks ───
  /** Called when the user changes column visibility */
  onColumnVisibilityChange?: (columns: TableColumn[]) => void

  // ─── Import/Export Callbacks ───
  /** Called when the user imports a BOM from CSV/Excel */
  onImport?: (bomId: string, file: File) => void
  /** Called when the user exports a BOM to CSV/Excel/PDF */
  onExport?: (bomId: string, format: 'csv' | 'xlsx' | 'pdf') => void
}
