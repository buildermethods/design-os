import { useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { BomLineItem, BomViewMode } from '@/../product/sections/bill-of-materials/types'

interface BomTreeEditorProps {
  lineItems: BomLineItem[]
  viewMode: BomViewMode
  onLineItemUpdate?: (lineItemId: string, data: Partial<BomLineItem>) => void
  onLineItemRemove?: (lineItemId: string) => void
  onLineItemAdd?: (parentId: string | null) => void
  onLineItemMove?: (lineItemId: string, newParentId: string | null, newSortOrder: number) => void
}

function formatCurrency(value: number): string {
  if (value === 0) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function BomTreeEditor({
  lineItems,
  viewMode,
  onLineItemUpdate,
  onLineItemRemove,
  onLineItemAdd,
}: BomTreeEditorProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Auto-expand top-level sub-assemblies
    const ids = new Set<string>()
    lineItems.forEach((item) => {
      if (item.children.length > 0) ids.add(item.id)
    })
    return ids
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (viewMode === 'diagram') {
    return <DiagramView lineItems={lineItems} />
  }

  if (viewMode === 'inline-table') {
    return (
      <InlineTableView
        lineItems={lineItems}
        expandedIds={expandedIds}
        selectedId={selectedId}
        onToggleExpand={toggleExpand}
        onSelect={setSelectedId}
        onLineItemUpdate={onLineItemUpdate}
        onLineItemRemove={onLineItemRemove}
        onLineItemAdd={onLineItemAdd}
      />
    )
  }

  // Default: tree-table
  return (
    <TreeTableView
      lineItems={lineItems}
      expandedIds={expandedIds}
      selectedId={selectedId}
      onToggleExpand={toggleExpand}
      onSelect={setSelectedId}
      onLineItemUpdate={onLineItemUpdate}
      onLineItemRemove={onLineItemRemove}
      onLineItemAdd={onLineItemAdd}
    />
  )
}

// ─── Tree + Table View ───

function TreeTableView({
  lineItems,
  expandedIds,
  selectedId,
  onToggleExpand,
  onSelect,
  onLineItemUpdate,
  onLineItemRemove,
  onLineItemAdd,
}: {
  lineItems: BomLineItem[]
  expandedIds: Set<string>
  selectedId: string | null
  onToggleExpand: (id: string) => void
  onSelect: (id: string | null) => void
  onLineItemUpdate?: (lineItemId: string, data: Partial<BomLineItem>) => void
  onLineItemRemove?: (lineItemId: string) => void
  onLineItemAdd?: (parentId: string | null) => void
}) {
  const selectedItem = findItem(lineItems, selectedId)

  return (
    <div className="flex h-full">
      {/* Tree panel */}
      <div className="w-64 xl:w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 overflow-y-auto bg-white dark:bg-slate-900">
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-1.5 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Structure
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onLineItemAdd?.(null)}
                  className="text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                >
                  <Icon name="add" size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add line item</TooltipContent>
            </Tooltip>
          </div>
          {lineItems.map((item) => (
            <TreeNode
              key={item.id}
              item={item}
              depth={0}
              expandedIds={expandedIds}
              selectedId={selectedId}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
            />
          ))}
          {lineItems.length === 0 && (
            <div className="px-3 py-8 text-center">
              <Icon name="inventory_2" size={24} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400">No line items yet</p>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onLineItemAdd?.(null)}
                className="mt-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10"
              >
                <Icon name="add" size={12} /> Add material
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4">
        {selectedItem ? (
          <LineItemDetail
            item={selectedItem}
            onUpdate={onLineItemUpdate}
            onRemove={onLineItemRemove}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Icon name="layers" size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Select a line item from the tree to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Tree Node ───
// Tree nodes stay as raw <button> — too specialized (dynamic paddingLeft, nested interactive elements)

function TreeNode({
  item,
  depth,
  expandedIds,
  selectedId,
  onToggleExpand,
  onSelect,
}: {
  item: BomLineItem
  depth: number
  expandedIds: Set<string>
  selectedId: string | null
  onToggleExpand: (id: string) => void
  onSelect: (id: string) => void
}) {
  const isExpanded = expandedIds.has(item.id)
  const hasChildren = item.children.length > 0
  const isSelected = selectedId === item.id
  const isSubAssembly = item.category === 'Sub-Assembly'

  return (
    <div>
      <button
        onClick={() => onSelect(item.id)}
        className={`w-full flex items-center gap-1 px-2 py-1.5 rounded-md text-left transition-colors group ${
          isSelected
            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300'
            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Drag handle */}
        <Icon name="drag_indicator" size={12} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 shrink-0 cursor-grab" />

        {/* Expand toggle */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(item.id)
            }}
            className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
          >
            <Icon name={isExpanded ? 'expand_more' : 'chevron_right'} size={12} />
          </button>
        ) : (
          <span className="size-4 shrink-0" />
        )}

        {/* Icon */}
        <Icon
          name={isSubAssembly ? 'layers' : 'inventory_2'}
          size={14}
          className={isSubAssembly ? 'text-violet-500 shrink-0' : 'text-slate-400 shrink-0'}
        />

        {/* Name + cost */}
        <span className="text-xs font-medium truncate flex-1">{item.materialName}</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tabular-nums shrink-0 ml-1">
          {formatCurrency(item.totalCost)}
        </span>
      </button>

      {/* Children */}
      {isExpanded &&
        hasChildren &&
        item.children.map((child) => (
          <TreeNode
            key={child.id}
            item={child}
            depth={depth + 1}
            expandedIds={expandedIds}
            selectedId={selectedId}
            onToggleExpand={onToggleExpand}
            onSelect={onSelect}
          />
        ))}
    </div>
  )
}

// ─── Inline Table View ───

function InlineTableView({
  lineItems,
  expandedIds,
  selectedId,
  onToggleExpand,
  onSelect,
  onLineItemUpdate,
  onLineItemRemove,
  onLineItemAdd,
}: {
  lineItems: BomLineItem[]
  expandedIds: Set<string>
  selectedId: string | null
  onToggleExpand: (id: string) => void
  onSelect: (id: string | null) => void
  onLineItemUpdate?: (lineItemId: string, data: Partial<BomLineItem>) => void
  onLineItemRemove?: (lineItemId: string) => void
  onLineItemAdd?: (parentId: string | null) => void
}) {
  const flattenItems = (items: BomLineItem[], depth: number = 0): Array<{ item: BomLineItem; depth: number }> => {
    const result: Array<{ item: BomLineItem; depth: number }> = []
    for (const item of items) {
      result.push({ item, depth })
      if (expandedIds.has(item.id) && item.children.length > 0) {
        result.push(...flattenItems(item.children, depth + 1))
      }
    }
    return result
  }

  const flatItems = flattenItems(lineItems)

  return (
    <div className="h-full overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="bg-slate-50 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
            <TableHead className="w-8 px-2" />
            <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 min-w-[200px]">Material</TableHead>
            <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-20">Code</TableHead>
            <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-24">Category</TableHead>
            <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-20 text-right">Qty</TableHead>
            <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-16">Unit</TableHead>
            <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-24 text-right">Unit Cost</TableHead>
            <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-24 text-right">Total</TableHead>
            <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 min-w-[120px]">Supplier</TableHead>
            <TableHead className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-16">Waste %</TableHead>
            <TableHead className="w-10 px-2" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {flatItems.map(({ item, depth }) => {
            const hasChildren = item.children.length > 0
            const isExpanded = expandedIds.has(item.id)
            const isSelected = selectedId === item.id
            const isSubAssembly = item.category === 'Sub-Assembly'

            return (
              <TableRow
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`group cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-500/5'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <TableCell className="w-8 px-2 py-2">
                  <Icon name="drag_indicator" size={12} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 cursor-grab" />
                </TableCell>
                <TableCell className="px-3 py-2">
                  <div className="flex items-center gap-1" style={{ paddingLeft: `${depth * 20}px` }}>
                    {hasChildren ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleExpand(item.id)
                        }}
                        className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                      >
                        <Icon name={isExpanded ? 'expand_more' : 'chevron_right'} size={12} />
                      </button>
                    ) : (
                      <span className="size-4 shrink-0" />
                    )}
                    <Icon
                      name={isSubAssembly ? 'layers' : 'inventory_2'}
                      size={14}
                      className={isSubAssembly ? 'text-violet-500 shrink-0' : 'text-slate-400 shrink-0'}
                    />
                    <span className={`text-sm truncate ${isSubAssembly ? 'font-semibold text-slate-900 dark:text-slate-100' : 'text-slate-800 dark:text-slate-200'}`}>
                      {item.materialName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-3 py-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {item.materialCode || '—'}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.category}</span>
                </TableCell>
                <TableCell className="px-3 py-2 text-right">
                  <InlineInput
                    value={String(item.quantity)}
                    onChange={(v) => onLineItemUpdate?.(item.id, { quantity: Number(v) })}
                    className="text-right"
                  />
                </TableCell>
                <TableCell className="px-3 py-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.unit}</span>
                </TableCell>
                <TableCell className="px-3 py-2 text-right">
                  <InlineInput
                    value={item.unitCost.toFixed(2)}
                    onChange={(v) => onLineItemUpdate?.(item.id, { unitCost: Number(v) })}
                    className="text-right"
                    prefix="$"
                  />
                </TableCell>
                <TableCell className="px-3 py-2 text-right">
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                    {formatCurrency(item.totalCost)}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {item.activeSupplierName || '—'}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    {item.wastagePercent > 0 ? `${item.wastagePercent}%` : '—'}
                  </span>
                </TableCell>
                <TableCell className="w-10 px-2 py-2" onClick={(e) => e.stopPropagation()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onLineItemRemove?.(item.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100"
                      >
                        <Icon name="delete" size={14} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove</TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Add row */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          variant="ghost"
          size="xs"
          onClick={() => onLineItemAdd?.(null)}
          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10"
        >
          <Icon name="add" size={14} />
          Add line item
        </Button>
      </div>

      {lineItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Icon name="inventory_2" size={32} className="text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">No line items in this BOM</p>
          <Button
            size="sm"
            onClick={() => onLineItemAdd?.(null)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Icon name="add" size={16} />
            Add first material
          </Button>
        </div>
      )}
    </div>
  )
}

// ─── Diagram View (Visual) ───

function DiagramView({ lineItems }: { lineItems: BomLineItem[] }) {
  if (lineItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Icon name="layers" size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">No line items to visualize</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex flex-col items-center gap-3">
        {/* Root BOM node */}
        <div className="px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-300 dark:border-blue-500/30 text-center min-w-[160px]">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Bill of Materials</p>
          <p className="text-xs text-blue-500 dark:text-blue-400 font-mono mt-0.5">
            {formatCurrency(lineItems.reduce((sum, li) => sum + li.totalCost, 0))}
          </p>
        </div>

        {/* Connector */}
        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />

        {/* Top-level items */}
        <div className="flex flex-wrap gap-4 justify-center">
          {lineItems.map((item) => (
            <DiagramNode key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function DiagramNode({ item }: { item: BomLineItem }) {
  const isSubAssembly = item.category === 'Sub-Assembly'

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`px-3 py-2.5 rounded-xl border-2 min-w-[140px] text-center transition-shadow hover:shadow-md ${
          isSubAssembly
            ? 'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Icon
            name={isSubAssembly ? 'layers' : 'inventory_2'}
            size={14}
            className={isSubAssembly ? 'text-violet-500' : 'text-slate-400'}
          />
          <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
            {item.materialName}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 text-[10px]">
          <span className="text-slate-500 dark:text-slate-400">
            {item.quantity} {item.unit}
          </span>
          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
            {formatCurrency(item.totalCost)}
          </span>
        </div>
        {item.activeSupplierName && (
          <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 truncate">
            {item.activeSupplierName}
          </p>
        )}
      </div>

      {/* Children */}
      {item.children.length > 0 && (
        <>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
          <div className="flex gap-3">
            {item.children.map((child) => (
              <DiagramNode key={child.id} item={child} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Line Item Detail Panel ───

function LineItemDetail({
  item,
  onUpdate,
  onRemove,
}: {
  item: BomLineItem
  onUpdate?: (lineItemId: string, data: Partial<BomLineItem>) => void
  onRemove?: (lineItemId: string) => void
}) {
  const isSubAssembly = item.category === 'Sub-Assembly'

  return (
    <div className="max-w-lg space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`size-8 rounded-lg flex items-center justify-center ${
            isSubAssembly
              ? 'bg-violet-100 dark:bg-violet-500/10'
              : 'bg-slate-100 dark:bg-slate-800'
          }`}>
            <Icon
              name={isSubAssembly ? 'layers' : 'inventory_2'}
              size={16}
              className={isSubAssembly ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400'}
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {item.materialName}
            </h3>
            {item.materialCode && (
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{item.materialCode}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <Icon name="more_horiz" size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>More options</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onRemove?.(item.id)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <Icon name="delete" size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Remove</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Editable fields */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <EditableField
            label="Quantity"
            value={String(item.quantity)}
            onChange={(v) => onUpdate?.(item.id, { quantity: Number(v) })}
            type="number"
          />
          <EditableField label="Unit" value={item.unit} readOnly />
          <EditableField
            label="Unit Cost"
            value={item.unitCost.toFixed(2)}
            onChange={(v) => onUpdate?.(item.id, { unitCost: Number(v) })}
            type="number"
            prefix="$"
          />
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Total Cost
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-mono">
              {formatCurrency(item.totalCost)}
            </span>
          </div>
          <EditableField
            label="Wastage %"
            value={String(item.wastagePercent)}
            onChange={(v) => onUpdate?.(item.id, { wastagePercent: Number(v) })}
            type="number"
            suffix="%"
          />
          <EditableField label="Category" value={item.category} readOnly />
        </div>

        {item.activeSupplierName && (
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Supplier
            </span>
            <span className="text-sm text-slate-800 dark:text-slate-200">{item.activeSupplierName}</span>
          </div>
        )}

        {item.notes && (
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Notes
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.notes}</p>
          </div>
        )}
      </div>

      {/* Children summary */}
      {item.children.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Contains ({item.children.length})
          </h4>
          <div className="space-y-2">
            {item.children.map((child) => (
              <div key={child.id} className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon name="inventory_2" size={14} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                    {child.materialName}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                  {formatCurrency(child.totalCost)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Helpers ───

function findItem(items: BomLineItem[], id: string | null): BomLineItem | null {
  if (!id) return null
  for (const item of items) {
    if (item.id === id) return item
    if (item.children.length > 0) {
      const found = findItem(item.children, id)
      if (found) return found
    }
  }
  return null
}

function InlineInput({
  value,
  onChange,
  className = '',
  prefix,
}: {
  value: string
  onChange?: (value: string) => void
  className?: string
  prefix?: string
}) {
  return (
    <div className="inline-flex items-center">
      {prefix && <span className="text-xs text-slate-400 mr-0.5">{prefix}</span>}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-16 h-auto bg-transparent border-transparent text-xs font-mono text-slate-800 dark:text-slate-200 tabular-nums focus-visible:bg-blue-50 dark:focus-visible:bg-blue-500/10 focus-visible:border-blue-500/30 rounded px-1 py-0.5 ${className}`}
      />
    </div>
  )
}

function EditableField({
  label,
  value,
  onChange,
  type = 'text',
  readOnly = false,
  prefix,
  suffix,
}: {
  label: string
  value: string
  onChange?: (value: string) => void
  type?: 'text' | 'number'
  readOnly?: boolean
  prefix?: string
  suffix?: string
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
        {label}
      </label>
      {readOnly ? (
        <span className="text-sm text-slate-800 dark:text-slate-200">{value}</span>
      ) : (
        <div className="flex items-center">
          {prefix && <span className="text-sm text-slate-400 mr-1">{prefix}</span>}
          <Input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="h-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm font-mono focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
          />
          {suffix && <span className="text-sm text-slate-400 ml-1">{suffix}</span>}
        </div>
      )}
    </div>
  )
}
