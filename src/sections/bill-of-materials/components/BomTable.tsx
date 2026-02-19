import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type {
  BillOfMaterials,
  BomStatus,
  BomActiveFilters,
  SortConfig,
  TableColumn,
  BomFilterOptions,
} from '@/../product/sections/bill-of-materials/types'
import { BomStatusBadge, BomTypeBadge } from './BomStatusBadge'

interface BomTableProps {
  boms: BillOfMaterials[]
  tableColumns: TableColumn[]
  filterOptions: BomFilterOptions
  selectedBomId?: string | null
  onRowClick?: (bomId: string) => void
  onRowDoubleClick?: (bomId: string) => void
  onBomCreate?: () => void
  onBulkStatusChange?: (bomIds: string[], newStatus: BomStatus) => void
  onBulkExport?: (bomIds: string[]) => void
  onCompare?: (bomIds: string[]) => void
  onSearch?: (query: string) => void
  onFilterChange?: (filters: BomActiveFilters) => void
  onSortChange?: (sort: SortConfig) => void
  onColumnVisibilityChange?: (columns: TableColumn[]) => void
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatCurrency(value: number, currency: string = 'USD'): string {
  if (value === 0) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}

const columnHelper = createColumnHelper<BillOfMaterials>()

export function BomTable({
  boms,
  tableColumns,
  filterOptions,
  selectedBomId,
  onRowClick,
  onRowDoubleClick,
  onBomCreate,
  onBulkStatusChange,
  onBulkExport,
  onCompare,
  onSearch,
  onFilterChange,
  onSortChange,
  onColumnVisibilityChange,
}: BomTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<BomActiveFilters>({})
  const [userColumns, setUserColumns] = useState<TableColumn[]>(tableColumns)

  // TanStack Table state
  const [sorting, setSorting] = useState<SortingState>([{ id: 'modifiedAt', desc: true }])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [columnFiltersState] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })

  // Derive column visibility from userColumns
  const columnVisibility: VisibilityState = useMemo(() => {
    const vis: VisibilityState = {}
    userColumns.forEach((c) => {
      vis[c.key] = c.visible
    })
    return vis
  }, [userColumns])

  // Pre-filter data (status/type/subtype chips are external filters)
  const preFilteredBoms = useMemo(() => {
    let result = [...boms]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.productName.toLowerCase().includes(q) ||
          b.productCode.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      )
    }

    if (filters.status && filters.status.length > 0) {
      result = result.filter((b) => filters.status!.includes(b.status))
    }

    if (filters.bomType && filters.bomType.length > 0) {
      result = result.filter((b) => filters.bomType!.includes(b.bomTypeName))
    }

    if (filters.subtype && filters.subtype.length > 0) {
      result = result.filter((b) => filters.subtype!.includes(b.subtype))
    }

    return result
  }, [boms, searchQuery, filters])

  // Column definitions
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(e) => e.stopPropagation()}
            aria-label="Select row"
            className={`border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 ${
              !row.getIsSelected() ? 'opacity-0 group-hover/row:opacity-100' : ''
            }`}
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      }),
      columnHelper.accessor('name', {
        header: 'BOM Name',
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {row.original.name}
            </p>
            {row.original.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                {row.original.description.slice(0, 60)}
                {row.original.description.length > 60 ? '…' : ''}
              </p>
            )}
          </div>
        ),
        size: 260,
      }),
      columnHelper.accessor('productName', {
        header: 'Product',
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{row.original.productName}</p>
            {row.original.styleName && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{row.original.styleName}</p>
            )}
          </div>
        ),
        size: 160,
      }),
      columnHelper.accessor('bomTypeName', {
        header: 'Type',
        cell: ({ getValue }) => <BomTypeBadge type={getValue()} />,
        size: 100,
      }),
      columnHelper.accessor('subtype', {
        header: 'Subtype',
        cell: ({ getValue }) => (
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{getValue()}</span>
        ),
        size: 100,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => <BomStatusBadge status={getValue()} />,
        size: 110,
      }),
      columnHelper.accessor('version', {
        header: 'Version',
        cell: ({ getValue }) => (
          <span className="text-xs text-slate-600 dark:text-slate-300 font-mono tabular-nums">v{getValue()}</span>
        ),
        size: 70,
      }),
      columnHelper.accessor('totalCost', {
        header: 'Total Cost',
        cell: ({ row }) => (
          <span className="text-xs text-slate-700 dark:text-slate-300 font-mono tabular-nums">
            {formatCurrency(row.original.totalCost, row.original.currency)}
          </span>
        ),
        size: 100,
      }),
      columnHelper.accessor('lineItemCount', {
        header: 'Items',
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-700 dark:text-slate-300 tabular-nums">{getValue()}</span>
        ),
        size: 60,
      }),
      columnHelper.accessor('assignedTo', {
        header: 'Assigned',
        cell: ({ getValue }) => (
          <span className="text-sm text-slate-600 dark:text-slate-400 truncate">{getValue()}</span>
        ),
        size: 100,
      }),
      columnHelper.accessor('seasonName', {
        header: 'Season',
        cell: ({ getValue }) => (
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{getValue()}</span>
        ),
        size: 100,
      }),
      columnHelper.accessor('modifiedAt', {
        header: 'Modified',
        cell: ({ getValue }) => (
          <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(getValue())}</span>
        ),
        size: 80,
      }),
    ],
    []
  )

  const table = useReactTable({
    data: preFilteredBoms,
    columns,
    state: {
      sorting,
      columnFilters: columnFiltersState,
      columnVisibility,
      rowSelection,
      pagination,
    },
    enableRowSelection: true,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(newSorting)
      if (newSorting.length > 0) {
        onSortChange?.({
          key: newSorting[0].id,
          direction: newSorting[0].desc ? 'desc' : 'asc',
        })
      }
    },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
  })

  const selectedRowIds = Object.keys(rowSelection).filter((k) => rowSelection[k])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPagination((p) => ({ ...p, pageIndex: 0 }))
    onSearch?.(query)
  }

  const toggleFilter = (key: keyof BomActiveFilters, value: string) => {
    setFilters((prev) => {
      const current = (prev[key] as string[]) || []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      const newFilters = { ...prev, [key]: next.length > 0 ? next : undefined }
      onFilterChange?.(newFilters)
      setPagination((p) => ({ ...p, pageIndex: 0 }))
      return newFilters
    })
  }

  const toggleColumnVisibility = (key: string) => {
    const newColumns = userColumns.map((c) =>
      c.key === key ? { ...c, visible: !c.visible } : c
    )
    setUserColumns(newColumns)
    onColumnVisibilityChange?.(newColumns)
  }

  const activeFilterCount = Object.values(filters).filter(
    (v) => Array.isArray(v) && v.length > 0
  ).length

  const totalRows = table.getFilteredRowModel().rows.length
  const paginatedRows = table.getRowModel().rows

  return (
    <div className="flex flex-col h-full">
      {/* ─── Toolbar ─── */}
      <div className="shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* New BOM button */}
          <Button
            size="sm"
            onClick={onBomCreate}
            className="bg-blue-500 hover:bg-blue-600 text-white shrink-0"
          >
            <Icon name="add" size={16} />
            <span className="hidden sm:inline">New BOM</span>
          </Button>

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Icon name="search" size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search BOMs, products…"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-8 pl-8 pr-8 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm placeholder:text-slate-400 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleSearch('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" size={14} />
              </Button>
            )}
          </div>

          {/* Filter toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={
              showFilters || activeFilterCount > 0
                ? 'border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }
          >
            <Icon name="filter_list" size={16} />
            <span className="hidden md:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="size-4 flex items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Column picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
              >
                <Icon name="view_column" size={16} />
                <span className="hidden md:inline">Columns</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-52 p-1">
              {userColumns.map((col) => (
                <button
                  key={col.key}
                  onClick={() => toggleColumnVisibility(col.key)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                  <Checkbox
                    checked={col.visible}
                    className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    tabIndex={-1}
                  />
                  <span className="text-slate-700 dark:text-slate-300">{col.label}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Import */}
          <Button
            variant="outline"
            size="sm"
            className="hidden lg:inline-flex border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
          >
            <Icon name="upload" size={16} />
            <span>Import</span>
          </Button>

          {/* Results count + page size */}
          <div className="hidden lg:flex items-center gap-2 ml-auto text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing {totalRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1}-
              {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows)} of {totalRows}
            </span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(val) => {
                setPagination({ pageIndex: 0, pageSize: Number(val) })
              }}
            >
              <SelectTrigger size="sm" className="w-16 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter chips */}
        {showFilters && (
          <div className="px-4 pb-3 flex flex-wrap gap-4 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Status</span>
              <div className="flex flex-wrap gap-1">
                {filterOptions.statuses.map((status) => (
                  <Button
                    key={status}
                    variant="ghost"
                    size="xs"
                    onClick={() => toggleFilter('status', status)}
                    className={`rounded-full ${
                      (filters.status as string[] | undefined)?.includes(status)
                        ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Type</span>
              <div className="flex flex-wrap gap-1">
                {filterOptions.bomTypes.map((type) => (
                  <Button
                    key={type}
                    variant="ghost"
                    size="xs"
                    onClick={() => toggleFilter('bomType', type)}
                    className={`rounded-full ${
                      (filters.bomType as string[] | undefined)?.includes(type)
                        ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Subtype</span>
              <div className="flex flex-wrap gap-1">
                {filterOptions.subtypes.map((sub) => (
                  <Button
                    key={sub}
                    variant="ghost"
                    size="xs"
                    onClick={() => toggleFilter('subtype', sub)}
                    className={`rounded-full ${
                      (filters.subtype as string[] | undefined)?.includes(sub)
                        ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {sub}
                  </Button>
                ))}
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setFilters({})
                  onFilterChange?.({})
                }}
                className="self-end text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Bulk action bar */}
        {selectedRowIds.length > 0 && (
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-500/10 border-t border-blue-100 dark:border-blue-500/20 flex items-center gap-3">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {selectedRowIds.length} selected
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onBulkStatusChange?.(selectedRowIds, 'Approved')}
                className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/20"
              >
                <Icon name="edit" size={12} /> Change Status
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onBulkExport?.(selectedRowIds)}
                className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/20"
              >
                <Icon name="download" size={12} /> Export
              </Button>
              {selectedRowIds.length >= 2 && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onCompare?.(selectedRowIds)}
                  className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/20"
                >
                  <Icon name="compare_arrows" size={12} /> Compare
                </Button>
              )}
              <Button
                variant="ghost"
                size="xs"
                className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/20"
              >
                <Icon name="content_copy" size={12} /> Duplicate
              </Button>
              <Button
                variant="ghost"
                size="xs"
                className="text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/20"
              >
                <Icon name="archive" size={12} /> Archive
              </Button>
            </div>
            <button
              onClick={() => setRowSelection({})}
              className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>

      {/* ─── Table ─── */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-slate-50 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span className="inline-flex">
                          {header.column.getIsSorted() === 'asc' ? (
                            <Icon name="expand_less" size={14} className="text-blue-500" />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <Icon name="expand_more" size={14} className="text-blue-500" />
                          ) : (
                            <Icon name="unfold_more" size={14} className="text-slate-400" />
                          )}
                        </span>
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row.original.id)}
                onDoubleClick={() => onRowDoubleClick?.(row.original.id)}
                className={`group/row cursor-pointer transition-colors ${
                  selectedBomId === row.original.id
                    ? 'bg-blue-50 dark:bg-blue-500/5'
                    : row.getIsSelected()
                      ? 'bg-blue-50/50 dark:bg-blue-500/5'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-3 py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Empty state */}
        {paginatedRows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <Icon name="search" size={20} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {searchQuery || activeFilterCount > 0
                ? 'No BOMs match your filters'
                : 'No BOMs yet'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {searchQuery || activeFilterCount > 0
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first Bill of Materials to get started'}
            </p>
            {!(searchQuery || activeFilterCount > 0) && (
              <Button
                size="sm"
                onClick={onBomCreate}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Icon name="add" size={16} />
                New BOM
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ─── Pagination ─── */}
      {table.getPageCount() > 1 && (
        <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
