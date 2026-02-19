import { useState, useMemo } from 'react'
import type {
  BillOfMaterialsProps,
} from '@/../product/sections/bill-of-materials/types'
import { BomTable } from './BomTable'
import { BomQuickViewPanel } from './BomQuickViewPanel'
import { BomDetail } from './BomDetail'

type View = 'list' | 'detail'

export function BomManager({
  title = 'Bill of Materials',
  description = 'Manage BOMs, cost rollups, version history, and approval workflows.',
  billsOfMaterials,
  bomLineItems,
  bomTypes: _bomTypes,
  materials: _materials,
  bomVersions,
  approvalSteps,
  filterOptions,
  tableColumns,
  enableMultiSourceCosting: _enableMultiSourceCosting,
  enableLandedCost = true,
  enableCostScenarios: _enableCostScenarios,
  enableWhatIfAnalysis: _enableWhatIfAnalysis,
  enableDiagramView: _enableDiagramView,
  enableApprovalWorkflows = true,
  onBomSelect,
  onBomCreate,
  onBomDuplicate,
  onBomArchive,
  onBomDelete: _onBomDelete,
  onLineItemAdd,
  onLineItemUpdate,
  onLineItemRemove,
  onLineItemMove: _onLineItemMove,
  onSupplierChange: _onSupplierChange,
  onCostScenarioChange: _onCostScenarioChange,
  onVersionSelect,
  onVersionRestore,
  onCompare,
  onApprove,
  onReject,
  onSubmitForReview,
  onBulkStatusChange,
  onBulkExport,
  onSearch,
  onFilterChange,
  onSortChange,
  onViewModeChange: _onViewModeChange,
  onPageChange: _onPageChange,
  onPageSizeChange: _onPageSizeChange,
  onColumnVisibilityChange,
  onImport: _onImport,
  onExport,
}: BillOfMaterialsProps) {
  const [view, setView] = useState<View>('list')
  const [selectedBomId, setSelectedBomId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const selectedBom = useMemo(
    () => billsOfMaterials.find((b) => b.id === selectedBomId) || null,
    [billsOfMaterials, selectedBomId]
  )

  const selectedBomLineItems = useMemo(
    () => (selectedBomId ? bomLineItems[selectedBomId] || [] : []),
    [bomLineItems, selectedBomId]
  )

  // Navigation helpers for the quick-view panel
  const selectedIndex = useMemo(
    () => billsOfMaterials.findIndex((b) => b.id === selectedBomId),
    [billsOfMaterials, selectedBomId]
  )

  const handleRowClick = (bomId: string) => {
    setSelectedBomId(bomId)
    setPanelOpen(true)
    onBomSelect?.(bomId)
  }

  const handleRowDoubleClick = (bomId: string) => {
    setSelectedBomId(bomId)
    setView('detail')
    onBomSelect?.(bomId)
  }

  const handleViewDetail = (bomId: string) => {
    setSelectedBomId(bomId)
    setView('detail')
    setPanelOpen(false)
    onBomSelect?.(bomId)
  }

  const handleBack = () => {
    setView('list')
  }

  const handlePanelClose = () => {
    setPanelOpen(false)
  }

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      const prevBom = billsOfMaterials[selectedIndex - 1]
      setSelectedBomId(prevBom.id)
    }
  }

  const handleNext = () => {
    if (selectedIndex < billsOfMaterials.length - 1) {
      const nextBom = billsOfMaterials[selectedIndex + 1]
      setSelectedBomId(nextBom.id)
    }
  }

  // ─── Detail View ───
  if (view === 'detail' && selectedBom) {
    return (
      <BomDetail
        bom={selectedBom}
        lineItems={selectedBomLineItems}
        versions={bomVersions}
        approvalSteps={approvalSteps}
        enableLandedCost={enableLandedCost}
        enableApprovalWorkflows={enableApprovalWorkflows}
        onBack={handleBack}
        onEdit={(id) => onBomSelect?.(id)}
        onApprove={onApprove}
        onReject={onReject}
        onSubmitForReview={onSubmitForReview}
        onLineItemUpdate={onLineItemUpdate}
        onLineItemRemove={onLineItemRemove}
        onLineItemAdd={onLineItemAdd}
        onVersionSelect={onVersionSelect}
        onVersionRestore={onVersionRestore}
        onCompare={onCompare}
        onExport={onExport}
      />
    )
  }

  // ─── List View ───
  return (
    <div className="h-full flex flex-col">
      {/* ─── Page Header ─── */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>

      {/* ─── Content ─── */}
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 min-w-0">
          <BomTable
            boms={billsOfMaterials}
            tableColumns={tableColumns}
            filterOptions={filterOptions}
            selectedBomId={panelOpen ? selectedBomId : null}
            onRowClick={handleRowClick}
            onRowDoubleClick={handleRowDoubleClick}
            onBomCreate={() => onBomCreate?.({})}
            onBulkStatusChange={onBulkStatusChange}
            onBulkExport={onBulkExport}
            onCompare={onCompare}
            onSearch={onSearch}
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
            onColumnVisibilityChange={onColumnVisibilityChange}
          />
        </div>

        {/* Quick-view panel */}
        {panelOpen && selectedBom && (
          <BomQuickViewPanel
            bom={selectedBom}
            lineItems={selectedBomLineItems}
            approvalSteps={approvalSteps}
            onClose={handlePanelClose}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onViewDetail={handleViewDetail}
            onEdit={(id) => onBomSelect?.(id)}
            onDuplicate={onBomDuplicate}
            onArchive={onBomArchive}
            hasPrevious={selectedIndex > 0}
            hasNext={selectedIndex < billsOfMaterials.length - 1}
          />
        )}
      </div>
    </div>
  )
}
