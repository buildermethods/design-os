// =============================================================================
// Product Catalog — TypeScript Interfaces
// =============================================================================

/** Status values for products and styles */
export type ProductStatus =
  | 'Draft'
  | 'Development'
  | 'In Review'
  | 'Approved'
  | 'Manufacturing'
  | 'Archived'

/** Product type categories (tenant-configurable) */
export type ProductType = 'Apparel' | 'Footwear' | 'Accessories' | string

/** Development type classification */
export type DevelopmentType = 'New Introduction' | 'Carryover'

/** Priority levels */
export type Priority = 'P1' | 'P2' | 'P3'

/** Season status */
export type SeasonStatus = 'Active' | 'Frozen' | 'Archived'

/** View mode for the product list */
export type ViewMode = 'table' | 'card' | 'condensed'

/** Sort direction */
export type SortDirection = 'asc' | 'desc'

// =============================================================================
// Core Entities
// =============================================================================

/** A time-bound grouping of products */
export interface Season {
  id: string
  name: string
  code: string
  description: string
  status: SeasonStatus
  productCount: number
  styleCount: number
  imageUrl: string | null
  createdBy: string
  modifiedBy: string
  createdAt: string
  modifiedAt: string
}

/** A top-level item being brought to market */
export interface Product {
  id: string
  name: string
  code: string
  description: string
  seasonId: string
  seasonName: string
  status: ProductStatus
  productType: ProductType
  developmentType: DevelopmentType
  priority: Priority
  imageUrl: string | null
  styleCount: number
  targetCost: number
  targetRetail: number
  createdBy: string
  modifiedBy: string
  createdAt: string
  modifiedAt: string
  /** Tenant-configurable custom attributes */
  attributes: Record<string, string>
}

/** A specific variant of a product (colorway, flavor, formulation, etc.) */
export interface Style {
  id: string
  productId: string
  name: string
  code: string
  description: string
  styleType: ProductType
  developmentType: DevelopmentType
  priority: Priority
  imageUrl: string | null
  status: ProductStatus
  colorway: string
  colorSpecification: string
  gender: string
  pricePoint: string
  isActive: boolean
}

/** A file attachment associated with a product or style */
export interface Document {
  id: string
  entityId: string
  entityType: 'Product' | 'Style'
  name: string
  fileType: string
  /** File size in bytes */
  fileSize: number
  uploadedBy: string
  uploadedAt: string
  version: number
}

/** An entry in the activity/audit log */
export interface ActivityLogEntry {
  id: string
  entityId: string
  entityType: 'Product' | 'Style'
  action: 'status_change' | 'document_uploaded' | 'comment' | 'attribute_updated'
  description: string
  userId: string
  userName: string
  timestamp: string
  details: Record<string, unknown>
}

// =============================================================================
// Table Configuration
// =============================================================================

/** Column definition for the configurable data table */
export interface TableColumn {
  key: string
  label: string
  sortable: boolean
  filterable: boolean
  visible: boolean
  width: number
}

/** Available filter options (populated from backend/config) */
export interface FilterOptions {
  statuses: ProductStatus[]
  productTypes: ProductType[]
  developmentTypes: DevelopmentType[]
  priorities: Priority[]
  genders: string[]
  ageGroups: string[]
}

/** Active filter state */
export interface ActiveFilters {
  search?: string
  status?: ProductStatus[]
  productType?: ProductType[]
  developmentType?: DevelopmentType[]
  priority?: Priority[]
  seasonId?: string[]
  [key: string]: unknown
}

/** Sort configuration */
export interface SortConfig {
  key: string
  direction: SortDirection
}

// =============================================================================
// Component Props
// =============================================================================

/** Props for the Product Catalog section */
export interface ProductCatalogProps {
  // ─── Page Header ───
  /** Page title shown above all content */
  title?: string
  /** Brief description shown below the title */
  description?: string

  // ─── Data ───
  seasons: Season[]
  products: Product[]
  styles: Style[]
  documents: Document[]
  activityLog: ActivityLogEntry[]
  filterOptions: FilterOptions
  tableColumns: TableColumn[]

  // ─── List View Callbacks ───
  /** Called when the user navigates to a product detail view */
  onProductSelect?: (productId: string) => void
  /** Called when the user creates a new product */
  onProductCreate?: (data: Partial<Product>) => void
  /** Called when the user updates a product */
  onProductUpdate?: (productId: string, data: Partial<Product>) => void
  /** Called when the user deletes/archives a product */
  onProductDelete?: (productId: string) => void
  /** Called when the user duplicates a product */
  onProductDuplicate?: (productId: string) => void

  // ─── Bulk Action Callbacks ───
  /** Called when the user performs a bulk status change */
  onBulkStatusChange?: (productIds: string[], newStatus: ProductStatus) => void
  /** Called when the user performs a bulk attribute edit */
  onBulkAttributeEdit?: (productIds: string[], attribute: string, value: string) => void
  /** Called when the user exports selected products */
  onBulkExport?: (productIds: string[]) => void

  // ─── Style Callbacks ───
  /** Called when the user selects a style within a product */
  onStyleSelect?: (styleId: string) => void
  /** Called when the user creates a new style for a product */
  onStyleCreate?: (productId: string, data: Partial<Style>) => void

  // ─── Document Callbacks ───
  /** Called when the user uploads a document */
  onDocumentUpload?: (entityId: string, entityType: 'Product' | 'Style', file: File) => void
  /** Called when the user downloads a document */
  onDocumentDownload?: (documentId: string) => void

  // ─── Compare & Review Callbacks ───
  /** Called when the user initiates a comparison of selected products */
  onCompare?: (productIds: string[]) => void
  /** Called when a reviewer approves a product */
  onApprove?: (productId: string, comment?: string) => void
  /** Called when a reviewer rejects a product */
  onReject?: (productId: string, comment: string) => void

  // ─── Search & Filter Callbacks ───
  /** Called when the user searches */
  onSearch?: (query: string) => void
  /** Called when filters change */
  onFilterChange?: (filters: ActiveFilters) => void
  /** Called when sort changes */
  onSortChange?: (sort: SortConfig) => void
  /** Called when view mode changes */
  onViewModeChange?: (mode: ViewMode) => void
  /** Called when page changes */
  onPageChange?: (page: number) => void
  /** Called when page size changes */
  onPageSizeChange?: (size: number) => void

  // ─── Table Configuration Callbacks ───
  /** Called when the user changes column visibility */
  onColumnVisibilityChange?: (columns: TableColumn[]) => void
}
