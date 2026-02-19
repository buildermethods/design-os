import data from '@/../product/sections/product-catalog/data.json'
import { ProductCatalog } from './components/ProductCatalog'

export default function ProductCatalogView() {
  return (
    <ProductCatalog
      seasons={data.seasons as any}
      products={data.products as any}
      styles={data.styles as any}
      documents={data.documents as any}
      activityLog={data.activityLog as any}
      filterOptions={data.filterOptions as any}
      tableColumns={data.tableColumns as any}
      onProductSelect={(id) => console.log('Select product:', id)}
      onProductCreate={(data) => console.log('Create product:', data)}
      onProductUpdate={(id, data) => console.log('Update product:', id, data)}
      onProductDelete={(id) => console.log('Delete product:', id)}
      onProductDuplicate={(id) => console.log('Duplicate product:', id)}
      onBulkStatusChange={(ids, status) => console.log('Bulk status change:', ids, status)}
      onBulkExport={(ids) => console.log('Bulk export:', ids)}
      onStyleSelect={(id) => console.log('Select style:', id)}
      onStyleCreate={(productId, data) => console.log('Create style:', productId, data)}
      onDocumentUpload={(entityId, entityType, file) => console.log('Upload document:', entityId, entityType, file)}
      onDocumentDownload={(id) => console.log('Download document:', id)}
      onCompare={(ids) => console.log('Compare products:', ids)}
      onApprove={(id, comment) => console.log('Approve product:', id, comment)}
      onReject={(id, comment) => console.log('Reject product:', id, comment)}
      onSearch={(query) => console.log('Search:', query)}
      onFilterChange={(filters) => console.log('Filters changed:', filters)}
      onSortChange={(sort) => console.log('Sort changed:', sort)}
      onViewModeChange={(mode) => console.log('View mode changed:', mode)}
      onPageChange={(page) => console.log('Page changed:', page)}
      onPageSizeChange={(size) => console.log('Page size changed:', size)}
      onColumnVisibilityChange={(columns) => console.log('Column visibility changed:', columns)}
    />
  )
}
