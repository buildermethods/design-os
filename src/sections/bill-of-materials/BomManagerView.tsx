import data from '@/../product/sections/bill-of-materials/data.json'
import { BomManager } from './components/BomManager'

export default function BomManagerView() {
  return (
    <BomManager
      billsOfMaterials={data.billsOfMaterials as never[]}
      bomLineItems={data.bomLineItems as never}
      bomTypes={data.bomTypes as never[]}
      materials={data.materials as never[]}
      bomVersions={data.bomVersions as never[]}
      approvalSteps={data.approvalSteps as never[]}
      filterOptions={data.filterOptions as never}
      tableColumns={data.tableColumns as never[]}
      enableMultiSourceCosting
      enableLandedCost
      enableCostScenarios
      enableWhatIfAnalysis
      enableDiagramView
      enableApprovalWorkflows
      onBomSelect={(id) => console.log('Select BOM:', id)}
      onBomCreate={(data) => console.log('Create BOM:', data)}
      onBomDuplicate={(id) => console.log('Duplicate BOM:', id)}
      onBomArchive={(id) => console.log('Archive BOM:', id)}
      onBomDelete={(id) => console.log('Delete BOM:', id)}
      onLineItemAdd={(bomId, li) => console.log('Add line item:', bomId, li)}
      onLineItemUpdate={(bomId, liId, data) => console.log('Update line item:', bomId, liId, data)}
      onLineItemRemove={(bomId, liId) => console.log('Remove line item:', bomId, liId)}
      onLineItemMove={(bomId, liId, parentId, order) => console.log('Move line item:', bomId, liId, parentId, order)}
      onSupplierChange={(bomId, liId, supId) => console.log('Change supplier:', bomId, liId, supId)}
      onCostScenarioChange={(scenario) => console.log('Cost scenario:', scenario)}
      onVersionSelect={(bomId, ver) => console.log('View version:', bomId, ver)}
      onVersionRestore={(bomId, ver) => console.log('Restore version:', bomId, ver)}
      onCompare={(ids) => console.log('Compare BOMs:', ids)}
      onApprove={(bomId, stepId, comment) => console.log('Approve:', bomId, stepId, comment)}
      onReject={(bomId, stepId, comment) => console.log('Reject:', bomId, stepId, comment)}
      onSubmitForReview={(bomId) => console.log('Submit for review:', bomId)}
      onBulkStatusChange={(ids, status) => console.log('Bulk status change:', ids, status)}
      onBulkExport={(ids) => console.log('Bulk export:', ids)}
      onSearch={(q) => console.log('Search:', q)}
      onFilterChange={(f) => console.log('Filters:', f)}
      onSortChange={(s) => console.log('Sort:', s)}
      onViewModeChange={(m) => console.log('View mode:', m)}
      onPageChange={(p) => console.log('Page:', p)}
      onPageSizeChange={(s) => console.log('Page size:', s)}
      onColumnVisibilityChange={(c) => console.log('Columns:', c)}
      onImport={(bomId, file) => console.log('Import:', bomId, file)}
      onExport={(bomId, format) => console.log('Export:', bomId, format)}
    />
  )
}
