import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Product, Style } from '@/../product/sections/product-catalog/types'
import { StatusBadge, PriorityBadge } from './StatusBadge'

interface QuickViewPanelProps {
  product: Product
  styles?: Style[]
  onClose?: () => void
  onPrevious?: () => void
  onNext?: () => void
  onViewDetail?: (productId: string) => void
  onEdit?: (productId: string) => void
  onDuplicate?: (productId: string) => void
  onArchive?: (productId: string) => void
  hasPrevious?: boolean
  hasNext?: boolean
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

export function QuickViewPanel({
  product,
  styles = [],
  onClose,
  onPrevious,
  onNext,
  onViewDetail,
  onEdit,
  onDuplicate,
  onArchive,
  hasPrevious = false,
  hasNext = false,
}: QuickViewPanelProps) {
  const productStyles = styles.filter((s) => s.productId === product.id)

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
            title="Previous product"
          >
            <Icon name="expand_less" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onNext}
            disabled={!hasNext}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            title="Next product"
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
        {/* Image */}
        <div className="aspect-[16/9] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {product.imageUrl ? (
            <div className="size-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
          ) : (
            <Icon name="image" size={40} className="text-slate-300 dark:text-slate-600" />
          )}
        </div>

        <div className="p-4 space-y-5">
          {/* Title + status */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {product.name}
              </h3>
              <PriorityBadge priority={product.priority} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-2">
              {product.code}
            </p>
            <StatusBadge status={product.status} size="md" />
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {product.description}
          </p>

          {/* Key fields */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Season" value={product.seasonName} />
            <Field label="Type" value={product.productType} />
            <Field label="Dev Type" value={product.developmentType} />
            <Field label="Styles" value={String(product.styleCount)} />
            <Field label="Target Cost" value={formatCurrency(product.targetCost)} mono />
            <Field label="Target Retail" value={formatCurrency(product.targetRetail)} mono />
          </div>

          {/* Custom attributes */}
          {Object.keys(product.attributes).length > 0 && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Attributes
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="rounded-lg px-2 py-1 bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 gap-1"
                  >
                    <Icon name="label" size={12} className="text-slate-400" />
                    <span className="text-slate-500 dark:text-slate-500">{key}:</span>{' '}
                    <span className="font-medium text-slate-700 dark:text-slate-300">{value}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Styles preview */}
          {productStyles.length > 0 && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Styles ({productStyles.length})
              </h4>
              <div className="space-y-1.5">
                {productStyles.slice(0, 4).map((style) => (
                  <div
                    key={style.id}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="size-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                      {style.imageUrl ? (
                        <div className="size-full rounded bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500" />
                      ) : (
                        <Icon name="image" size={12} className="text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                        {style.name}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {style.colorway}
                      </p>
                    </div>
                    <StatusBadge status={style.status} />
                  </div>
                ))}
                {productStyles.length > 4 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-1">
                    +{productStyles.length - 4} more styles
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Created by</span>
              <span className="text-slate-700 dark:text-slate-300">{product.createdBy}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Created</span>
              <span className="text-slate-700 dark:text-slate-300">{formatDate(product.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Last modified</span>
              <span className="text-slate-700 dark:text-slate-300">
                {formatDate(product.modifiedAt)} by {product.modifiedBy}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel footer actions */}
      <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => onViewDetail?.(product.id)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Icon name="open_in_new" size={14} />
          View Full Detail
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onEdit?.(product.id)}
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
              onClick={() => onDuplicate?.(product.id)}
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
              onClick={() => onArchive?.(product.id)}
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
