import { useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type {
  BillOfMaterials,
  BomLineItem,
  BomVersion,
  ApprovalStep,
  BomViewMode,
} from '@/../product/sections/bill-of-materials/types'
import { BomStatusBadge, BomTypeBadge, ApprovalStatusBadge } from './BomStatusBadge'
import { BomTreeEditor } from './BomTreeEditor'

interface BomDetailProps {
  bom: BillOfMaterials
  lineItems?: BomLineItem[]
  versions?: BomVersion[]
  approvalSteps?: ApprovalStep[]
  enableLandedCost?: boolean
  enableApprovalWorkflows?: boolean
  onBack?: () => void
  onEdit?: (bomId: string) => void
  onApprove?: (bomId: string, stepId: string, comment?: string) => void
  onReject?: (bomId: string, stepId: string, comment: string) => void
  onSubmitForReview?: (bomId: string) => void
  onLineItemUpdate?: (bomId: string, lineItemId: string, data: Partial<BomLineItem>) => void
  onLineItemRemove?: (bomId: string, lineItemId: string) => void
  onLineItemAdd?: (bomId: string, lineItem: Partial<BomLineItem>) => void
  onVersionSelect?: (bomId: string, version: number) => void
  onVersionRestore?: (bomId: string, version: number) => void
  onCompare?: (bomIds: string[]) => void
  onExport?: (bomId: string, format: 'csv' | 'xlsx' | 'pdf') => void
}

function formatCurrency(value: number, currency: string = 'USD'): string {
  if (value === 0) return '\u2014'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
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

const UNDERLINE_TAB =
  'rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'

export function BomDetail({
  bom,
  lineItems = [],
  versions = [],
  approvalSteps = [],
  enableLandedCost = true,
  enableApprovalWorkflows = true,
  onBack,
  onEdit,
  onApprove,
  onReject,
  onSubmitForReview,
  onLineItemUpdate,
  onLineItemRemove,
  onLineItemAdd,
  onVersionSelect,
  onVersionRestore,
  onCompare,
  onExport,
}: BomDetailProps) {
  const [editorViewMode, setEditorViewMode] = useState<BomViewMode>('inline-table')

  const bomApprovals = approvalSteps.filter((a) => a.bomId === bom.id).sort((a, b) => a.stepOrder - b.stepOrder)
  const bomVersions = versions.filter((v) => v.bomId === bom.id).sort((a, b) => b.version - a.version)
  const pendingApproval = bomApprovals.find((a) => a.status === 'Pending')

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
              BOMs
            </Button>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[300px]">
              {bom.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {bom.status === 'Draft' && (
              <Button
                size="sm"
                onClick={() => onSubmitForReview?.(bom.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Icon name="send" size={16} />
                Submit for Review
              </Button>
            )}
            {bom.status === 'In Review' && pendingApproval && enableApprovalWorkflows && (
              <>
                <Button
                  size="sm"
                  onClick={() => onApprove?.(bom.id, pendingApproval.id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Icon name="check_circle" size={16} />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject?.(bom.id, pendingApproval.id, '')}
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
              onClick={() => onExport?.(bom.id, 'xlsx')}
            >
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(bom.id)}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* BOM header + tabs + content */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        {/* BOM header */}
        <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="px-6 py-5">
            <div className="flex gap-5 items-start">
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-2">
                  <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    {bom.name}
                  </h1>
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <BomStatusBadge status={bom.status} size="md" />
                  <BomTypeBadge type={bom.bomTypeName} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{bom.subtype}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">v{bom.version}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>{bom.productName} ({bom.productCode})</span>
                  {bom.styleName && <span>· {bom.styleName}</span>}
                  <span>· {bom.seasonName}</span>
                </div>
              </div>

              {/* Cost summary cards */}
              <div className="hidden lg:grid grid-cols-4 gap-3 shrink-0">
                <QuickStat label="Total Cost" value={formatCurrency(bom.totalCost, bom.currency)} highlight />
                <QuickStat label="Materials" value={formatCurrency(bom.costBreakdown.materialCost, bom.currency)} />
                <QuickStat label="Labor" value={formatCurrency(bom.costBreakdown.laborCost, bom.currency)} />
                <QuickStat label="Line Items" value={String(bom.lineItemCount)} />
              </div>
            </div>
          </div>

          {/* Tab bar — underline style */}
          <div className="px-6 border-t border-slate-100 dark:border-slate-800">
            <TabsList className="bg-transparent rounded-none p-0 h-auto gap-0 w-full justify-start">
              <TabsTrigger value="overview" className={UNDERLINE_TAB}>Overview</TabsTrigger>
              <TabsTrigger value="line-items" className={UNDERLINE_TAB}>
                Line Items
                {bom.lineItemCount > 0 && (
                  <span className="ml-1.5 text-[10px] text-slate-400 dark:text-slate-500">{bom.lineItemCount}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="costing" className={UNDERLINE_TAB}>Costing</TabsTrigger>
              <TabsTrigger value="documents" className={UNDERLINE_TAB}>Documents</TabsTrigger>
              <TabsTrigger value="approvals" className={UNDERLINE_TAB}>
                Approvals
                {bomApprovals.length > 0 && (
                  <span className="ml-1.5 text-[10px] text-slate-400 dark:text-slate-500">{bomApprovals.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="versions" className={UNDERLINE_TAB}>
                Versions
                {bomVersions.length > 0 && (
                  <span className="ml-1.5 text-[10px] text-slate-400 dark:text-slate-500">{bomVersions.length}</span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="mt-0 p-6">
            <OverviewTab bom={bom} />
          </TabsContent>
          <TabsContent value="line-items" className="mt-0 h-full">
            <div className="h-full flex flex-col">
              {/* View mode switcher */}
              <div className="shrink-0 px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mr-2">View</span>
                <ToggleGroup
                  type="single"
                  value={editorViewMode}
                  onValueChange={(val) => val && setEditorViewMode(val as BomViewMode)}
                  className="gap-1"
                >
                  <ToggleGroupItem
                    value="tree-table"
                    size="sm"
                    className="h-7 px-2.5 rounded-lg text-xs font-medium gap-1.5 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700 dark:data-[state=on]:bg-blue-500/10 dark:data-[state=on]:text-blue-400 data-[state=on]:border data-[state=on]:border-blue-200 dark:data-[state=on]:border-blue-500/20"
                  >
                    <Icon name="account_tree" size={14} />
                    Tree + Table
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="inline-table"
                    size="sm"
                    className="h-7 px-2.5 rounded-lg text-xs font-medium gap-1.5 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700 dark:data-[state=on]:bg-blue-500/10 dark:data-[state=on]:text-blue-400 data-[state=on]:border data-[state=on]:border-blue-200 dark:data-[state=on]:border-blue-500/20"
                  >
                    <Icon name="table" size={14} />
                    Inline Table
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="diagram"
                    size="sm"
                    className="h-7 px-2.5 rounded-lg text-xs font-medium gap-1.5 data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700 dark:data-[state=on]:bg-blue-500/10 dark:data-[state=on]:text-blue-400 data-[state=on]:border data-[state=on]:border-blue-200 dark:data-[state=on]:border-blue-500/20"
                  >
                    <Icon name="hub" size={14} />
                    Diagram
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="flex-1 overflow-hidden">
                <BomTreeEditor
                  lineItems={lineItems}
                  viewMode={editorViewMode}
                  onLineItemUpdate={(lineItemId, data) => onLineItemUpdate?.(bom.id, lineItemId, data)}
                  onLineItemRemove={(lineItemId) => onLineItemRemove?.(bom.id, lineItemId)}
                  onLineItemAdd={(parentId) => onLineItemAdd?.(bom.id, { parentLineItemId: parentId })}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="costing" className="mt-0 p-6">
            <CostingTab bom={bom} enableLandedCost={enableLandedCost} />
          </TabsContent>
          <TabsContent value="documents" className="mt-0 p-6">
            <DocumentsTab />
          </TabsContent>
          <TabsContent value="approvals" className="mt-0 p-6">
            <ApprovalsTab
              approvals={bomApprovals}
              bomId={bom.id}
              onApprove={onApprove}
              onReject={onReject}
            />
          </TabsContent>
          <TabsContent value="versions" className="mt-0 p-6">
            <VersionsTab
              versions={bomVersions}
              bomId={bom.id}
              currentVersion={bom.version}
              onVersionSelect={onVersionSelect}
              onVersionRestore={onVersionRestore}
              onCompare={onCompare}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

// ─── Tab Panels ───

function OverviewTab({ bom }: { bom: BillOfMaterials }) {
  return (
    <div className="max-w-3xl space-y-6">
      {bom.description && (
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Description</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{bom.description}</p>
        </section>
      )}

      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">BOM Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
          <InfoField label="BOM Type" value={bom.bomTypeName} />
          <InfoField label="Subtype" value={bom.subtype} />
          <InfoField label="Status" value={bom.status} />
          <InfoField label="Version" value={`v${bom.version}`} />
          <InfoField label="Product" value={bom.productName} />
          <InfoField label="Product Code" value={bom.productCode} />
          {bom.styleName && <InfoField label="Style" value={bom.styleName} />}
          <InfoField label="Season" value={bom.seasonName} />
          <InfoField label="Assigned To" value={bom.assignedTo} />
          <InfoField label="Line Items" value={String(bom.lineItemCount)} />
        </div>
      </section>

      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Metadata</h2>
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <InfoField label="Created By" value={bom.createdBy} />
          <InfoField label="Created" value={formatDate(bom.createdAt)} />
          <InfoField label="Modified By" value={bom.modifiedBy} />
          <InfoField label="Last Modified" value={formatDate(bom.modifiedAt)} />
        </div>
      </section>
    </div>
  )
}

function CostingTab({ bom, enableLandedCost }: { bom: BillOfMaterials; enableLandedCost: boolean }) {
  const { costBreakdown } = bom
  const hasCosts = bom.totalCost > 0

  if (!hasCosts) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Icon name="payments" size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No cost data available. Add line items to see cost breakdown.
          </p>
        </div>
      </div>
    )
  }

  const costItems: Array<{ label: string; value: number; percentage: number; color: string }> = [
    { label: 'Materials', value: costBreakdown.materialCost, percentage: (costBreakdown.materialCost / bom.totalCost) * 100, color: 'bg-blue-500' },
    { label: 'Labor', value: costBreakdown.laborCost, percentage: (costBreakdown.laborCost / bom.totalCost) * 100, color: 'bg-violet-500' },
    { label: 'Overhead', value: costBreakdown.overheadCost, percentage: (costBreakdown.overheadCost / bom.totalCost) * 100, color: 'bg-amber-500' },
  ]

  if (enableLandedCost) {
    costItems.push(
      { label: 'Shipping', value: costBreakdown.shippingCost, percentage: (costBreakdown.shippingCost / bom.totalCost) * 100, color: 'bg-emerald-500' },
      { label: 'Duties & Tariffs', value: costBreakdown.dutiesCost, percentage: (costBreakdown.dutiesCost / bom.totalCost) * 100, color: 'bg-red-500' },
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Total cost hero */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Total {enableLandedCost ? 'Landed' : ''} Cost
            </span>
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {formatCurrency(bom.totalCost, bom.currency)}
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            per unit · {bom.lineItemCount} line items
          </span>
        </div>

        {/* Stacked bar chart */}
        <div className="h-3 rounded-full overflow-hidden flex mb-4">
          {costItems.map((item) => (
            <div
              key={item.label}
              className={`${item.color} transition-all`}
              style={{ width: `${item.percentage}%` }}
              title={`${item.label}: ${formatCurrency(item.value, bom.currency)} (${item.percentage.toFixed(1)}%)`}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {costItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`size-2.5 rounded-full ${item.color}`} />
              <div className="min-w-0">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">{item.label}</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {formatCurrency(item.value, bom.currency)}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost breakdown table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Cost Breakdown</h2>
        </div>
        <Table>
          <TableBody>
            {costItems.map((item) => (
              <TableRow key={item.label}>
                <TableCell className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${item.color}`} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{item.label}</span>
                  </div>
                </TableCell>
                <TableCell className="px-5 py-3 text-right">
                  <span className="text-sm font-mono text-slate-800 dark:text-slate-200 tabular-nums">
                    {formatCurrency(item.value, bom.currency)}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-3 text-right w-20">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.percentage.toFixed(1)}%</span>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-slate-50 dark:bg-slate-800/30 font-semibold">
              <TableCell className="px-5 py-3">
                <span className="text-sm text-slate-900 dark:text-slate-100">Total</span>
              </TableCell>
              <TableCell className="px-5 py-3 text-right">
                <span className="text-sm font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatCurrency(bom.totalCost, bom.currency)}
                </span>
              </TableCell>
              <TableCell className="px-5 py-3 text-right w-20">
                <span className="text-xs text-slate-500 dark:text-slate-400">100%</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function DocumentsTab() {
  return (
    <div className="max-w-3xl">
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-12 text-center">
        <Icon name="inventory_2" size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Documents</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Attach tech packs, material swatches, test reports, and other supporting documentation to this BOM.
        </p>
      </div>
    </div>
  )
}

function ApprovalsTab({
  approvals,
  bomId,
  onApprove,
  onReject,
}: {
  approvals: ApprovalStep[]
  bomId: string
  onApprove?: (bomId: string, stepId: string, comment?: string) => void
  onReject?: (bomId: string, stepId: string, comment: string) => void
}) {
  if (approvals.length === 0) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Icon name="check_circle" size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No approval workflow configured for this BOM.
          </p>
        </div>
      </div>
    )
  }

  const statusIconMap: Record<string, string> = {
    Approved: 'check_circle',
    Rejected: 'cancel',
    Pending: 'schedule',
    Skipped: 'skip_next',
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Approval Chain</h2>
        <div className="space-y-0">
          {approvals.map((step, i) => {
            const isLast = i === approvals.length - 1
            const iconName = statusIconMap[step.status] || 'schedule'

            return (
              <div key={step.id} className="flex gap-3 relative">
                {/* Timeline line */}
                {!isLast && (
                  <div className={`absolute left-[15px] top-8 bottom-0 w-px ${
                    step.status === 'Approved' ? 'bg-emerald-300 dark:bg-emerald-500/30' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}

                {/* Step icon */}
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  step.status === 'Approved'
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-400 dark:border-emerald-500/30'
                    : step.status === 'Rejected'
                      ? 'bg-red-50 dark:bg-red-500/10 border-2 border-red-400 dark:border-red-500/30'
                      : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700'
                }`}>
                  <Icon
                    name={iconName}
                    size={14}
                    className={
                      step.status === 'Approved' ? 'text-emerald-500' : step.status === 'Rejected' ? 'text-red-500' : 'text-slate-400'
                    }
                  />
                </div>

                {/* Step content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {step.assigneeName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{step.role}</p>
                    </div>
                    <ApprovalStatusBadge status={step.status} />
                  </div>
                  {step.comment && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 pl-0 leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2">
                      &ldquo;{step.comment}&rdquo;
                    </p>
                  )}
                  {step.decidedAt && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      {formatDateTime(step.decidedAt)}
                    </p>
                  )}
                  {step.status === 'Pending' && (
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="xs"
                        onClick={() => onApprove?.(bomId, step.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        <Icon name="check_circle" size={12} />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => onReject?.(bomId, step.id, '')}
                        className="border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        <Icon name="cancel" size={12} />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function VersionsTab({
  versions,
  bomId,
  currentVersion,
  onVersionSelect,
  onVersionRestore,
  onCompare,
}: {
  versions: BomVersion[]
  bomId: string
  currentVersion: number
  onVersionSelect?: (bomId: string, version: number) => void
  onVersionRestore?: (bomId: string, version: number) => void
  onCompare?: (bomIds: string[]) => void
}) {
  if (versions.length === 0) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Icon name="fork_right" size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">No version history yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Version History ({versions.length})
        </h2>
        {versions.length >= 2 && (
          <Button
            variant="outline"
            size="xs"
            onClick={() => onCompare?.([bomId])}
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 border-blue-200 dark:border-blue-500/20"
          >
            <Icon name="compare_arrows" size={12} />
            Compare Versions
          </Button>
        )}
      </div>

      <div className="space-y-0">
        {versions.map((ver, i) => {
          const isCurrent = ver.version === currentVersion
          const isFirst = i === versions.length - 1
          const costDelta = i < versions.length - 1 ? ver.totalCost - versions[i + 1].totalCost : 0

          return (
            <div key={ver.id} className="flex gap-3 relative">
              {/* Timeline */}
              {!isFirst && (
                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
              )}

              {/* Version badge */}
              <div className={`size-8 rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-bold ${
                isCurrent
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                v{ver.version}
              </div>

              {/* Content */}
              <div className="flex-1 pb-5">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Version {ver.version}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                        <BomStatusBadge status={ver.status} />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        by {ver.createdBy} · {formatDateTime(ver.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                        {formatCurrency(ver.totalCost)}
                      </span>
                      {costDelta !== 0 && (
                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${
                          costDelta > 0 ? 'text-red-500' : 'text-emerald-500'
                        }`}>
                          <Icon name={costDelta > 0 ? 'trending_up' : 'trending_down'} size={12} />
                          {costDelta > 0 ? '+' : ''}{formatCurrency(costDelta)}
                        </span>
                      )}
                      {costDelta === 0 && i > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                          <Icon name="remove" size={12} /> no change
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {ver.changeDescription}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-slate-400">{ver.lineItemCount} items</span>
                    {!isCurrent && (
                      <>
                        <Button
                          variant="link"
                          size="xs"
                          onClick={() => onVersionSelect?.(bomId, ver.version)}
                          className="text-blue-600 dark:text-blue-400 h-auto p-0"
                        >
                          View
                        </Button>
                        <Button
                          variant="link"
                          size="xs"
                          onClick={() => onVersionRestore?.(bomId, ver.version)}
                          className="text-blue-600 dark:text-blue-400 h-auto p-0"
                        >
                          <Icon name="history" size={12} />
                          Restore
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Helpers ───

function QuickStat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`text-center px-3 py-2 rounded-lg ${highlight ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">{label}</span>
      <span className={`text-sm font-semibold font-mono ${
        highlight ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-slate-100'
      }`}>
        {value}
      </span>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">{label}</span>
      <span className="text-sm text-slate-800 dark:text-slate-200">{value}</span>
    </div>
  )
}
