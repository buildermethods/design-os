import { useState } from 'react'
import {
  Search,
  Filter,
  Download,
  UserPlus,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  X,
} from 'lucide-react'
import type {
  LeadsProps,
  QuickFilter,
  OutcomeFormData,
  LinkType,
  Qualification,
  Stage,
  SortField,
  SortOrder,
  AdvancedFilters,
} from '../types'
import { LeadTableRow } from './LeadTableRow'
import { LeadDetailPanel } from './LeadDetailPanel'

const quickFilterLabels: Record<QuickFilter, string> = {
  myLeads: 'My Leads',
  overdue: 'Overdue',
  dueToday: 'Due Today',
  hot: 'Hot',
  new: 'New',
  unassigned: 'Unassigned',
  lost7d: 'Lost (7d)',
}

export function LeadsView({
  leads,
  users,
  isAdmin,
  filterCounts,
  sourceOptions,
  stageOptions,
  qualificationOptions,
  callResultOptions,
  conversationOutcomeOptions,
  nextActionOptions,
  retryTimeOptions,
  lossReasonOptions,
  linkTypeOptions,
  onSearch,
  onQuickFilter,
  onAdvancedFilter,
  onSelectLead,
  onClosePanel,
  onOpenFullProfile,
  onLogOutcome,
  onLogLinkSent,
  onScheduleFollowUp,
  onChangeOwner,
  onChangeQualification,
  onMarkBadNumber,
  onMoveStage,
  onSelectionChange,
  onBulkAssign,
  onBulkQualify,
  onBulkMarkBadNumber,
  onExportSelected,
  onExportFiltered,
  onSort,
}: LeadsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilter | null>(null)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [checkedLeadIds, setCheckedLeadIds] = useState<Set<string>>(new Set())
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [activeSort, setActiveSort] = useState<{ field: SortField; order: SortOrder } | null>(null)
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)
  const [draftFilters, setDraftFilters] = useState<AdvancedFilters>({})
  const [appliedFilters, setAppliedFilters] = useState<AdvancedFilters>({})
  const [showBulkAssignMenu, setShowBulkAssignMenu] = useState(false)
  const [showBulkQualMenu, setShowBulkQualMenu] = useState(false)

  const selectedLead = leads.find((l) => l.id === selectedLeadId)
  const hasCheckedLeads = checkedLeadIds.size > 0

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch?.(e.target.value)
  }

  const handleQuickFilterClick = (filter: QuickFilter) => {
    const newFilter = activeQuickFilter === filter ? null : filter
    setActiveQuickFilter(newFilter)
    onQuickFilter?.(newFilter)
  }

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId)
    onSelectLead?.(leadId)
  }

  const handleClosePanel = () => {
    setSelectedLeadId(null)
    onClosePanel?.()
  }

  const handleToggleCheck = (leadId: string) => {
    const newChecked = new Set(checkedLeadIds)
    if (newChecked.has(leadId)) {
      newChecked.delete(leadId)
    } else {
      newChecked.add(leadId)
    }
    setCheckedLeadIds(newChecked)
    onSelectionChange?.(Array.from(newChecked))
  }

  const handleSelectAll = () => {
    if (checkedLeadIds.size === leads.length) {
      setCheckedLeadIds(new Set())
      onSelectionChange?.([])
    } else {
      const allIds = new Set(leads.map((l) => l.id))
      setCheckedLeadIds(allIds)
      onSelectionChange?.(Array.from(allIds))
    }
  }

  const handleClearSelection = () => {
    setCheckedLeadIds(new Set())
    onSelectionChange?.([])
  }

  const showSuccessToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  const handleLogOutcome = (outcome: OutcomeFormData) => {
    if (!selectedLeadId) return
    onLogOutcome?.(selectedLeadId, outcome)
    showSuccessToast('Outcome logged successfully')
    // Stay on the lead (lookup flow, not queue flow)
  }

  const handleLogLinkSent = (linkType: LinkType) => {
    if (!selectedLeadId) return
    onLogLinkSent?.(selectedLeadId, linkType)
    showSuccessToast('Link logged')
  }

  const handleChangeOwner = (newOwnerId: string) => {
    if (!selectedLeadId) return
    onChangeOwner?.(selectedLeadId, newOwnerId)
    showSuccessToast('Owner updated')
  }

  const handleChangeQualification = (qualification: Qualification) => {
    if (!selectedLeadId) return
    onChangeQualification?.(selectedLeadId, qualification)
    showSuccessToast('Qualification updated')
  }

  const handleMoveStage = (stage: Stage, reason?: string) => {
    if (!selectedLeadId) return
    onMoveStage?.(selectedLeadId, stage, reason)
    showSuccessToast(`Moved to ${stage}`)
  }

  const handleMarkBadNumber = () => {
    if (!selectedLeadId) return
    onMarkBadNumber?.(selectedLeadId)
    showSuccessToast('Marked as bad number')
  }

  const handleBulkAssign = (ownerId: string) => {
    onBulkAssign?.({ leadIds: Array.from(checkedLeadIds), ownerId })
    showSuccessToast(`${checkedLeadIds.size} leads assigned`)
    handleClearSelection()
    setShowBulkAssignMenu(false)
  }

  const handleBulkQualify = (qualification: Qualification) => {
    onBulkQualify?.({ leadIds: Array.from(checkedLeadIds), qualification })
    showSuccessToast(`${checkedLeadIds.size} leads updated`)
    handleClearSelection()
    setShowBulkQualMenu(false)
  }

  const handleBulkMarkBadNumber = () => {
    onBulkMarkBadNumber?.({ leadIds: Array.from(checkedLeadIds) })
    showSuccessToast(`${checkedLeadIds.size} leads marked`)
    handleClearSelection()
  }

  const handleExportSelected = () => {
    onExportSelected?.(Array.from(checkedLeadIds))
    showSuccessToast('Exporting...')
  }

  const handleSortColumn = (field: SortField) => {
    const next: { field: SortField; order: SortOrder } =
      activeSort?.field === field && activeSort.order === 'desc'
        ? { field, order: 'asc' }
        : activeSort?.field === field
        ? { field, order: 'desc' }
        : { field, order: 'asc' }
    setActiveSort(next)
    onSort?.(next.field, next.order)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (activeSort?.field !== field) return <ChevronsUpDown className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    return activeSort.order === 'asc'
      ? <ChevronUp className="w-3 h-3 text-indigo-500" />
      : <ChevronDown className="w-3 h-3 text-indigo-500" />
  }

  const handleOpenFiltersDrawer = () => {
    setDraftFilters(appliedFilters)
    setShowFiltersDrawer(true)
  }

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters)
    onAdvancedFilter?.(draftFilters)
    setShowFiltersDrawer(false)
  }

  const handleClearFilters = () => {
    setDraftFilters({})
    setAppliedFilters({})
    onAdvancedFilter?.({})
    setShowFiltersDrawer(false)
  }

  const activeFilterCount = Object.values(appliedFilters).filter(
    (v) => v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : true),
  ).length

  const toggleMulti = <T extends string>(arr: T[] | undefined, value: T): T[] => {
    const current = arr ?? []
    return current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Main content with optional side panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Search + Filters + Table */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selectedLeadId ? 'lg:w-1/2' : 'w-full'}`}>
          {/* Header */}
          <div className="flex-shrink-0 px-4 lg:px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Leads</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {leads.length} leads total
                </p>
              </div>
              <button
                onClick={() => onExportFiltered?.()}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by name, phone, or notes..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-0 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(quickFilterLabels) as QuickFilter[]).map((filter) => {
                const count = filterCounts[filter]
                const isActive = activeQuickFilter === filter
                // Only show certain filters for non-admin
                const isAdminOnly = filter === 'unassigned' || filter === 'lost7d'
                if (isAdminOnly && !isAdmin) return null

                return (
                  <button
                    key={filter}
                    onClick={() => handleQuickFilterClick(filter)}
                    className={`
                      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
                      ${isActive
                        ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                      }
                    `}
                  >
                    {quickFilterLabels[filter]}
                    {count > 0 && (
                      <span className={`text-xs ${isActive ? 'text-indigo-500' : 'text-slate-400'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
              <button
                onClick={handleOpenFiltersDrawer}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilterCount > 0
                    ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                More filters
                {activeFilterCount > 0 && (
                  <span className="text-xs text-indigo-500">{activeFilterCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {hasCheckedLeads && (
            <div className="flex-shrink-0 px-4 lg:px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-200 dark:border-indigo-800 flex items-center gap-4">
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                {checkedLeadIds.size} selected
              </span>
              <button
                onClick={handleClearSelection}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear
              </button>
              <div className="flex-1" />
              
              {/* Bulk Assign */}
              <div className="relative">
                <button
                  onClick={() => setShowBulkAssignMenu(!showBulkAssignMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Assign
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showBulkAssignMenu && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleBulkAssign(u.id)}
                        className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs">
                          {u.name.charAt(0)}
                        </div>
                        {u.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bulk Qualify */}
              <div className="relative">
                <button
                  onClick={() => setShowBulkQualMenu(!showBulkQualMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Qualify
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showBulkQualMenu && (
                  <div className="absolute top-full right-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-10">
                    {qualificationOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleBulkQualify(opt.id as Qualification)}
                        className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mark Bad Number */}
              <button
                onClick={handleBulkMarkBadNumber}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Bad #
              </button>

              {/* Export Selected */}
              <button
                onClick={handleExportSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          )}

          {/* Table */}
          <div className="flex-1 overflow-auto bg-white dark:bg-slate-800">
            <table className="w-full min-w-[900px]">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="w-10 px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={checkedLeadIds.size === leads.length && leads.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                  </th>
                  <th className="px-3 py-3 text-left">
                    <button
                      onClick={() => handleSortColumn('name')}
                      className="group inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      Lead
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left">
                    <button
                      onClick={() => handleSortColumn('score')}
                      className="group inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      Score
                      <SortIcon field="score" />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Source
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Stage
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Qualification
                  </th>
                  <th className="px-3 py-3 text-left">
                    <button
                      onClick={() => handleSortColumn('nextActionDue')}
                      className="group inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      Next Action
                      <SortIcon field="nextActionDue" />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left">
                    <button
                      onClick={() => handleSortColumn('lastContactDate')}
                      className="group inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      Last Touch
                      <SortIcon field="lastContactDate" />
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Owner
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <LeadTableRow
                      key={lead.id}
                      lead={lead}
                      owner={users.find((u) => u.id === lead.ownerId)}
                      isSelected={selectedLeadId === lead.id}
                      isChecked={checkedLeadIds.has(lead.id)}
                      onSelect={() => handleSelectLead(lead.id)}
                      onToggleCheck={() => handleToggleCheck(lead.id)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="text-slate-400 dark:text-slate-500">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No leads found</p>
                        <p className="text-xs mt-1">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Side panel */}
        {selectedLead && (
          <div className="hidden lg:block w-1/2 max-w-xl animate-in slide-in-from-right duration-300">
            <LeadDetailPanel
              lead={selectedLead}
              users={users}
              callResultOptions={callResultOptions}
              conversationOutcomeOptions={conversationOutcomeOptions}
              nextActionOptions={nextActionOptions}
              retryTimeOptions={retryTimeOptions}
              lossReasonOptions={lossReasonOptions}
              linkTypeOptions={linkTypeOptions}
              stageOptions={stageOptions}
              qualificationOptions={qualificationOptions}
              onClose={handleClosePanel}
              onLogOutcome={handleLogOutcome}
              onLogLinkSent={handleLogLinkSent}
              onScheduleFollowUp={(date, time, reason) => onScheduleFollowUp?.(selectedLeadId!, date, time, reason)}
              onChangeOwner={handleChangeOwner}
              onChangeQualification={handleChangeQualification}
              onMoveStage={handleMoveStage}
              onMarkBadNumber={handleMarkBadNumber}
              onOpenFullProfile={() => onOpenFullProfile?.(selectedLeadId!)}
            />
          </div>
        )}
      </div>

      {/* Mobile: Bottom sheet for lead panel */}
      {selectedLead && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={handleClosePanel}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-2xl shadow-xl animate-in slide-in-from-bottom duration-300">
            <div className="h-full max-h-[90vh] overflow-y-auto">
              <LeadDetailPanel
                lead={selectedLead}
                users={users}
                callResultOptions={callResultOptions}
                conversationOutcomeOptions={conversationOutcomeOptions}
                nextActionOptions={nextActionOptions}
                retryTimeOptions={retryTimeOptions}
                lossReasonOptions={lossReasonOptions}
                linkTypeOptions={linkTypeOptions}
                stageOptions={stageOptions}
                qualificationOptions={qualificationOptions}
                onClose={handleClosePanel}
                onLogOutcome={handleLogOutcome}
                onLogLinkSent={handleLogLinkSent}
                onScheduleFollowUp={(date, time, reason) => onScheduleFollowUp?.(selectedLeadId!, date, time, reason)}
                onChangeOwner={handleChangeOwner}
                onChangeQualification={handleChangeQualification}
                onMoveStage={handleMoveStage}
                onMarkBadNumber={handleMarkBadNumber}
                onOpenFullProfile={() => onOpenFullProfile?.(selectedLeadId!)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* More Filters Drawer */}
      {showFiltersDrawer && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setShowFiltersDrawer(false)}
          />
          {/* Drawer */}
          <div className="relative ml-auto w-full max-w-sm h-full bg-white dark:bg-slate-900 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Filters</h2>
              <button
                onClick={() => setShowFiltersDrawer(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter sections */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

              {/* Source */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Source</p>
                <div className="flex flex-wrap gap-2">
                  {sourceOptions.map((opt) => {
                    const active = draftFilters.sources?.includes(opt.id)
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setDraftFilters((f) => ({ ...f, sources: toggleMulti(f.sources, opt.id) }))}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          active
                            ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Stage */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Stage</p>
                <div className="flex flex-wrap gap-2">
                  {stageOptions.map((opt) => {
                    const active = draftFilters.stages?.includes(opt.id)
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setDraftFilters((f) => ({ ...f, stages: toggleMulti(f.stages, opt.id) }))}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          active
                            ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Owner */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Owner</p>
                <div className="flex flex-wrap gap-2">
                  {users.map((u) => {
                    const active = draftFilters.owners?.includes(u.id)
                    return (
                      <button
                        key={u.id}
                        onClick={() => setDraftFilters((f) => ({ ...f, owners: toggleMulti(f.owners, u.id) }))}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          active
                            ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-[10px] font-semibold">
                          {u.name.charAt(0)}
                        </div>
                        {u.name.split(' ')[0]}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Qualification */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Qualification</p>
                <div className="flex flex-wrap gap-2">
                  {qualificationOptions.map((opt) => {
                    const active = draftFilters.qualification === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setDraftFilters((f) => ({
                          ...f,
                          qualification: active ? undefined : opt.id as 'qualified' | 'unknown' | 'unqualified',
                        }))}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          active
                            ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Next Action Due */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Next Action Due</p>
                <div className="flex flex-wrap gap-2">
                  {(['overdue', 'today', 'next7d', 'none'] as const).map((opt) => {
                    const labels = { overdue: 'Overdue', today: 'Today', next7d: 'Next 7 days', none: 'None set' }
                    const active = draftFilters.nextActionDue === opt
                    return (
                      <button
                        key={opt}
                        onClick={() => setDraftFilters((f) => ({ ...f, nextActionDue: active ? undefined : opt }))}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          active
                            ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {labels[opt]}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Last Contacted */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Last Contacted</p>
                <div className="flex flex-wrap gap-2">
                  {(['today', 'last7d', 'last30d'] as const).map((opt) => {
                    const labels = { today: 'Today', last7d: 'Last 7 days', last30d: 'Last 30 days' }
                    const active = draftFilters.lastContacted === opt
                    return (
                      <button
                        key={opt}
                        onClick={() => setDraftFilters((f) => ({ ...f, lastContacted: active ? undefined : opt }))}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          active
                            ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {labels[opt]}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Last Call Result */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Last Call Result</p>
                <div className="flex flex-wrap gap-2">
                  {callResultOptions.map((opt) => {
                    const active = draftFilters.lastCallResult === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setDraftFilters((f) => ({
                          ...f,
                          lastCallResult: active ? undefined : opt.id as 'connected' | 'did_not_pick' | 'number_incorrect',
                        }))}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          active
                            ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Flags */}
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Flags</p>
                <div className="flex flex-wrap gap-2">
                  {([
                    { id: 'bad_number', label: 'Bad number' },
                    { id: 'already_customer', label: 'Already customer' },
                  ] as const).map((opt) => {
                    const active = draftFilters.flags?.includes(opt.id)
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setDraftFilters((f) => ({ ...f, flags: toggleMulti(f.flags, opt.id) }))}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          active
                            ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Footer actions */}
            <div className="flex items-center gap-3 px-5 py-4 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={handleClearFilters}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
