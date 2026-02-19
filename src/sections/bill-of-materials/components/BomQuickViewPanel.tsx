import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { BillOfMaterials, BomLineItem, ApprovalStep } from '@/../product/sections/bill-of-materials/types'
import { BomStatusBadge, BomTypeBadge, ApprovalStatusBadge } from './BomStatusBadge'

interface BomQuickViewPanelProps {
  bom: BillOfMaterials
  lineItems?: BomLineItem[]
  approvalSteps?: ApprovalStep[]
  onClose?: () => void
  onPrevious?: () => void
  onNext?: () => void
  onViewDetail?: (bomId: string) => void
  onEdit?: (bomId: string) => void
  onDuplicate?: (bomId: string) => void
  onArchive?: (bomId: string) => void
  hasPrevious?: boolean
  hasNext?: boolean
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

export function BomQuickViewPanel({
  bom,
  lineItems = [],
  approvalSteps = [],
  onClose,
  onPrevious,
  onNext,
  onViewDetail,
  onEdit,
  onDuplicate,
  onArchive,
  hasPrevious = false,
  hasNext = false,
}: BomQuickViewPanelProps) {
  const bomApprovals = approvalSteps.filter((a) => a.bomId === bom.id).sort((a, b) => a.stepOrder - b.stepOrder)
  const { costBreakdown } = bom

  // Count line items by category
  const categoryCounts: Record<string, number> = {}
  const countItems = (items: BomLineItem[]) => {
    for (const item of items) {
      if (item.materialId) {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
      }
      if (item.children.length > 0) countItems(item.children)
    }
  }
  countItems(lineItems)

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-[380px] shrink-0">
      {/* Panel header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <Icon name="expand_less" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onNext}
            disabled={!hasNext}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <Icon name="expand_more" size={16} />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Icon name="close" size={16} />
        </Button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">
          {/* Title + badges */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {bom.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <BomStatusBadge status={bom.status} size="md" />
              <BomTypeBadge type={bom.bomTypeName} />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                v{bom.version}
              </span>
            </div>
          </div>

          {/* Description */}
          {bom.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {bom.description}
            </p>
          )}

          {/* Cost summary cards */}
          <div className="grid grid-cols-2 gap-2">
            <CostCard
              label="Total Cost"
              value={formatCurrency(bom.totalCost, bom.currency)}
              iconName="payments"
              primary
            />
            <CostCard
              label="Materials"
              value={formatCurrency(costBreakdown.materialCost, bom.currency)}
              iconName="inventory_2"
            />
            <CostCard
              label="Labor"
              value={formatCurrency(costBreakdown.laborCost, bom.currency)}
              iconName="person"
            />
            <CostCard
              label="Shipping + Duties"
              value={formatCurrency(costBreakdown.shippingCost + costBreakdown.dutiesCost, bom.currency)}
              iconName="layers"
            />
          </div>

          {/* Key fields */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Product" value={bom.productName} />
            <Field label="Product Code" value={bom.productCode} mono />
            {bom.styleName && <Field label="Style" value={bom.styleName} />}
            <Field label="Subtype" value={bom.subtype} />
            <Field label="Season" value={bom.seasonName} />
            <Field label="Assigned To" value={bom.assignedTo} />
            <Field label="Line Items" value={String(bom.lineItemCount)} />
          </div>

          {/* Material breakdown */}
          {Object.keys(categoryCounts).length > 0 && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Material Breakdown
              </h4>
              <div className="space-y-1">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <span className="text-xs text-slate-600 dark:text-slate-400">{category}</span>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                      {count} item{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approval workflow */}
          {bomApprovals.length > 0 && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Approval Workflow
              </h4>
              <div className="space-y-1.5">
                {bomApprovals.map((step, i) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center justify-center size-5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                        {step.assigneeName}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{step.role}</p>
                    </div>
                    <ApprovalStatusBadge status={step.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Created by</span>
              <span className="text-slate-700 dark:text-slate-300">{bom.createdBy}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Created</span>
              <span className="text-slate-700 dark:text-slate-300">{formatDate(bom.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Last modified</span>
              <span className="text-slate-700 dark:text-slate-300">
                {formatDate(bom.modifiedAt)} by {bom.modifiedBy}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel footer actions */}
      <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => onViewDetail?.(bom.id)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Icon name="open_in_new" size={14} />
          Open Editor
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onEdit?.(bom.id)}
              className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Icon name="edit" size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onDuplicate?.(bom.id)}
              className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Icon name="content_copy" size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Duplicate</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onArchive?.(bom.id)}
              className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Icon name="archive" size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Archive</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

// ─── Helpers ───

function CostCard({
  label,
  value,
  iconName,
  primary = false,
}: {
  label: string
  value: string
  iconName: string
  primary?: boolean
}) {
  return (
    <div
      className={`rounded-lg p-3 ${
        primary
          ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20'
          : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Icon
          name={iconName}
          size={12}
          className={primary ? 'text-blue-500' : 'text-slate-400'}
        />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>
      <span
        className={`text-sm font-semibold font-mono ${
          primary
            ? 'text-blue-700 dark:text-blue-300'
            : 'text-slate-800 dark:text-slate-200'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
        {label}
      </span>
      <span className={`text-sm text-slate-800 dark:text-slate-200 ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  )
}
