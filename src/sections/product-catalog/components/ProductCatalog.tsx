import { useState, useCallback, useMemo } from 'react'
import type { ProductCatalogProps } from '@/../product/sections/product-catalog/types'
import { ProductTable } from './ProductTable'
import { QuickViewPanel } from './QuickViewPanel'
import { ProductDetail } from './ProductDetail'

type View = 'list' | 'detail'

export function ProductCatalog({
  title = 'Products',
  description = 'Manage your product catalog — styles, specifications, and documents.',
  seasons: _seasons,
  products,
  styles,
  documents,
  activityLog,
  filterOptions,
  tableColumns,
  onProductSelect,
  onProductCreate,
  onProductUpdate,
  onProductDelete,
  onProductDuplicate,
  onBulkStatusChange,
  onBulkExport,
  onStyleSelect,
  onStyleCreate,
  onDocumentUpload,
  onDocumentDownload,
  onCompare,
  onApprove,
  onReject,
  onSearch,
  onFilterChange,
  onSortChange,
  onViewModeChange,
  onPageChange: _onPageChange,
  onPageSizeChange: _onPageSizeChange,
  onColumnVisibilityChange,
}: ProductCatalogProps) {
  const [currentView, setCurrentView] = useState<View>('list')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [detailProductId, setDetailProductId] = useState<string | null>(null)

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || null,
    [products, selectedProductId]
  )

  const detailProduct = useMemo(
    () => products.find((p) => p.id === detailProductId) || null,
    [products, detailProductId]
  )

  const selectedIndex = useMemo(
    () => (selectedProductId ? products.findIndex((p) => p.id === selectedProductId) : -1),
    [products, selectedProductId]
  )

  // Row click → open quick-view panel
  const handleRowClick = useCallback(
    (productId: string) => {
      setSelectedProductId(productId)
      setPanelOpen(true)
      onProductSelect?.(productId)
    },
    [onProductSelect]
  )

  // Row double-click → open detail view
  const handleRowDoubleClick = useCallback(
    (productId: string) => {
      setDetailProductId(productId)
      setCurrentView('detail')
      onProductSelect?.(productId)
    },
    [onProductSelect]
  )

  // Panel → view full detail
  const handleViewDetail = useCallback(
    (productId: string) => {
      setDetailProductId(productId)
      setPanelOpen(false)
      setCurrentView('detail')
    },
    []
  )

  // Navigate to previous/next product in panel
  const handlePrevious = useCallback(() => {
    if (selectedIndex > 0) {
      const prevId = products[selectedIndex - 1].id
      setSelectedProductId(prevId)
      onProductSelect?.(prevId)
    }
  }, [selectedIndex, products, onProductSelect])

  const handleNext = useCallback(() => {
    if (selectedIndex < products.length - 1) {
      const nextId = products[selectedIndex + 1].id
      setSelectedProductId(nextId)
      onProductSelect?.(nextId)
    }
  }, [selectedIndex, products, onProductSelect])

  // Back from detail to list
  const handleBack = useCallback(() => {
    setCurrentView('list')
    setDetailProductId(null)
  }, [])

  // ─── Detail View ───
  if (currentView === 'detail' && detailProduct) {
    return (
      <ProductDetail
        product={detailProduct}
        styles={styles}
        documents={documents}
        activityLog={activityLog}
        onBack={handleBack}
        onEdit={(id) => onProductUpdate?.(id, {})}
        onApprove={onApprove}
        onReject={onReject}
        onStyleSelect={onStyleSelect}
        onStyleCreate={(productId) => onStyleCreate?.(productId, {})}
        onDocumentUpload={onDocumentUpload as (entityId: string, entityType: 'Product' | 'Style') => void}
        onDocumentDownload={onDocumentDownload}
      />
    )
  }

  // ─── List View with Optional Quick-View Panel ───
  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 font-['Inter',system-ui,sans-serif]">
      {/* ─── Page Header ─── */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>

      {/* ─── Content ─── */}
      <div className="flex-1 flex min-h-0">
        {/* Main list area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ProductTable
          products={products}
          tableColumns={tableColumns}
          filterOptions={filterOptions}
          selectedProductId={panelOpen ? selectedProductId : null}
          onRowClick={handleRowClick}
          onRowDoubleClick={handleRowDoubleClick}
          onProductCreate={() => onProductCreate?.({})}
          onBulkStatusChange={onBulkStatusChange}
          onBulkExport={onBulkExport}
          onCompare={onCompare}
          onSearch={onSearch}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          onViewModeChange={onViewModeChange}
          onColumnVisibilityChange={onColumnVisibilityChange}
        />
      </div>

        {/* Quick-view side panel */}
        {panelOpen && selectedProduct && (
          <QuickViewPanel
            product={selectedProduct}
            styles={styles}
            onClose={() => setPanelOpen(false)}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onViewDetail={handleViewDetail}
            onEdit={(id) => onProductUpdate?.(id, {})}
            onDuplicate={onProductDuplicate}
            onArchive={onProductDelete}
            hasPrevious={selectedIndex > 0}
            hasNext={selectedIndex < products.length - 1}
          />
        )}
      </div>
    </div>
  )
}
