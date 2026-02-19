import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import type {
  Product,
  Style,
  Document as DocType,
  ActivityLogEntry,
} from '@/../product/sections/product-catalog/types'
import { StatusBadge, PriorityBadge } from './StatusBadge'

interface ProductDetailProps {
  product: Product
  styles?: Style[]
  documents?: DocType[]
  activityLog?: ActivityLogEntry[]
  onBack?: () => void
  onEdit?: (productId: string) => void
  onApprove?: (productId: string, comment?: string) => void
  onReject?: (productId: string, comment: string) => void
  onStyleSelect?: (styleId: string) => void
  onStyleCreate?: (productId: string) => void
  onDocumentUpload?: (entityId: string, entityType: 'Product' | 'Style') => void
  onDocumentDownload?: (documentId: string) => void
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ProductDetail({
  product,
  styles = [],
  documents = [],
  activityLog = [],
  onBack,
  onEdit,
  onApprove,
  onReject,
  onStyleSelect,
  onStyleCreate,
  onDocumentUpload,
  onDocumentDownload,
}: ProductDetailProps) {
  const productStyles = styles.filter((s) => s.productId === product.id)
  const productDocs = documents.filter((d) => d.entityId === product.id && d.entityType === 'Product')
  const productActivity = activityLog.filter((a) => a.entityId === product.id)

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Breadcrumb + actions */}
      <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              <Icon name="arrow_back" size={16} />
              Products
            </Button>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {product.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {product.status === 'In Review' && (
              <>
                <Button
                  size="sm"
                  onClick={() => onApprove?.(product.id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Icon name="check_circle" size={16} />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject?.(product.id, '')}
                  className="border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Icon name="cancel" size={16} />
                  Reject
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(product.id)}
            >
              <Icon name="edit" size={16} />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Product header + tabs + content */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        {/* Product header card */}
        <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="px-6 py-5">
            <div className="flex gap-5">
              {/* Image */}
              <div className="size-24 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                {product.imageUrl ? (
                  <div className="size-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
                ) : (
                  <Icon name="image" size={32} className="text-slate-300 dark:text-slate-600" />
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-1">
                  <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    {product.name}
                  </h1>
                  <PriorityBadge priority={product.priority} />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                    {product.code}
                  </span>
                  <StatusBadge status={product.status} size="md" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {product.description}
                </p>
              </div>
              {/* Quick stats */}
              <div className="hidden lg:grid grid-cols-3 gap-6 shrink-0 self-center">
                <QuickStat label="Season" value={product.seasonName.split(' - ')[0]} />
                <QuickStat label="Target Cost" value={formatCurrency(product.targetCost)} mono />
                <QuickStat label="Target Retail" value={formatCurrency(product.targetRetail)} mono />
              </div>
            </div>
          </div>

          {/* Tab bar — underline style */}
          <div className="px-6 border-t border-slate-100 dark:border-slate-800">
            <TabsList className="bg-transparent rounded-none p-0 h-auto gap-0 w-full justify-start">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="styles"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Styles
                {productStyles.length > 0 && (
                  <span className="ml-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                    {productStyles.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Documents
                {productDocs.length > 0 && (
                  <span className="ml-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                    {productDocs.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="bom"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              >
                BOM
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              >
                History
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">
          <TabsContent value="overview" className="mt-0">
            <OverviewTab product={product} />
          </TabsContent>
          <TabsContent value="styles" className="mt-0">
            <StylesTab
              styles={productStyles}
              productId={product.id}
              onStyleSelect={onStyleSelect}
              onStyleCreate={onStyleCreate}
            />
          </TabsContent>
          <TabsContent value="specifications" className="mt-0">
            <SpecificationsTab product={product} />
          </TabsContent>
          <TabsContent value="documents" className="mt-0">
            <DocumentsTab
              documents={productDocs}
              productId={product.id}
              onUpload={onDocumentUpload}
              onDownload={onDocumentDownload}
            />
          </TabsContent>
          <TabsContent value="bom" className="mt-0">
            <BomTab />
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <HistoryTab activity={productActivity} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

// ─── Tab Panels ───

function OverviewTab({ product }: { product: Product }) {
  return (
    <div className="max-w-3xl space-y-6">
      {/* Key info grid */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Product Information
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
          <InfoField label="Product Type" value={product.productType} />
          <InfoField label="Development Type" value={product.developmentType} />
          <InfoField label="Season" value={product.seasonName} />
          <InfoField label="Priority" value={product.priority} />
          <InfoField label="Styles" value={String(product.styleCount)} />
          <InfoField label="Status" value={product.status} />
          <InfoField label="Target Cost" value={formatCurrency(product.targetCost)} />
          <InfoField label="Target Retail" value={formatCurrency(product.targetRetail)} />
          <InfoField
            label="Margin"
            value={`${(((product.targetRetail - product.targetCost) / product.targetRetail) * 100).toFixed(1)}%`}
          />
        </div>
      </section>

      {/* Custom attributes */}
      {Object.keys(product.attributes).length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Custom Attributes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
            {Object.entries(product.attributes).map(([key, value]) => (
              <InfoField key={key} label={key} value={value} />
            ))}
          </div>
        </section>
      )}

      {/* Metadata */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Metadata
        </h2>
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <InfoField label="Created By" value={product.createdBy} />
          <InfoField label="Created" value={formatDate(product.createdAt)} />
          <InfoField label="Modified By" value={product.modifiedBy} />
          <InfoField label="Last Modified" value={formatDate(product.modifiedAt)} />
        </div>
      </section>
    </div>
  )
}

function StylesTab({
  styles,
  productId,
  onStyleSelect,
  onStyleCreate,
}: {
  styles: Style[]
  productId: string
  onStyleSelect?: (styleId: string) => void
  onStyleCreate?: (productId: string) => void
}) {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Styles ({styles.length})
        </h2>
        <Button
          size="sm"
          onClick={() => onStyleCreate?.(productId)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Icon name="add" size={16} />
          New Style
        </Button>
      </div>

      {styles.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Icon name="layers" size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No styles yet. Create your first style to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-100 dark:border-slate-800">
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Image</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Style</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Code</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Colorway</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Color Spec</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Status</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {styles.map((style) => (
                <TableRow
                  key={style.id}
                  onClick={() => onStyleSelect?.(style.id)}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <TableCell className="py-2.5">
                    <div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {style.imageUrl ? (
                        <div className="size-full rounded bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
                      ) : (
                        <Icon name="image" size={14} className="text-slate-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {style.name}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {style.code}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{style.colorway}</span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {style.colorSpecification}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <StatusBadge status={style.status} />
                  </TableCell>
                  <TableCell className="py-2.5">
                    <PriorityBadge priority={style.priority} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

function SpecificationsTab({ product }: { product: Product }) {
  return (
    <div className="max-w-3xl space-y-6">
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Product Specifications
        </h2>
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <InfoField label="Product Type" value={product.productType} />
          <InfoField label="Development Type" value={product.developmentType} />
          {Object.entries(product.attributes).map(([key, value]) => (
            <InfoField key={key} label={key} value={value} />
          ))}
        </div>
      </section>
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-8 text-center">
        <Icon name="label" size={24} className="text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Additional specification sections are configured per product type by your tenant administrator.
        </p>
      </div>
    </div>
  )
}

function DocumentsTab({
  documents,
  productId,
  onUpload,
  onDownload,
}: {
  documents: DocType[]
  productId: string
  onUpload?: (entityId: string, entityType: 'Product' | 'Style') => void
  onDownload?: (documentId: string) => void
}) {
  const fileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return 'PDF'
    if (fileType.includes('zip')) return 'ZIP'
    if (fileType.includes('image')) return 'IMG'
    return 'DOC'
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Documents ({documents.length})
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpload?.(productId, 'Product')}
        >
          <Icon name="upload" size={16} />
          Upload
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Icon name="description" size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No documents attached yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3 group hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {fileIcon(doc.fileType)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {doc.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatFileSize(doc.fileSize)} · v{doc.version} · Uploaded by {doc.uploadedBy} on{' '}
                  {formatDate(doc.uploadedAt)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDownload?.(doc.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Icon name="download" size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BomTab() {
  return (
    <div className="max-w-3xl">
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-12 text-center">
        <Icon name="open_in_new" size={24} className="text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Bill of Materials
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View and manage this product's BOM in the Bill of Materials section.
        </p>
        <Button
          size="sm"
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Icon name="open_in_new" size={14} />
          Open BOM
        </Button>
      </div>
    </div>
  )
}

function HistoryTab({ activity }: { activity: ActivityLogEntry[] }) {
  const activityIconMap: Record<string, string> = {
    status_change: 'open_in_new',
    document_uploaded: 'description',
    comment: 'chat_bubble',
    attribute_updated: 'edit',
  }

  return (
    <div className="max-w-3xl">
      {activity.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Icon name="schedule" size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-0">
          {activity.map((entry, i) => {
            const iconName = activityIconMap[entry.action] || 'schedule'
            return (
              <div key={entry.id} className="flex gap-3 pb-6 relative">
                {/* Timeline line */}
                {i < activity.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                )}
                {/* Icon */}
                <div className="size-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 z-10">
                  <Icon name={iconName} size={14} className="text-slate-500 dark:text-slate-400" />
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {entry.userName}
                    </span>{' '}
                    {entry.description}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {formatDateTime(entry.timestamp)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Helpers ───

function QuickStat({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="text-center">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
        {label}
      </span>
      <span className={`text-sm font-semibold text-slate-900 dark:text-slate-100 ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
        {label}
      </span>
      <span className="text-sm text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  )
}
