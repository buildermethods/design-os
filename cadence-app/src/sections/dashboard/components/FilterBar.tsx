import { ChevronDown, Calendar, User, Radio, Layers, GitBranch } from 'lucide-react'
import type { FilterOptions, SelectedFilters, User as UserType, FilterVisibility } from '../types'

interface FilterBarProps {
  currentUser: UserType
  filterOptions: FilterOptions
  selectedFilters: SelectedFilters
  onFilterChange?: (filterKey: keyof SelectedFilters, value: string) => void
}

interface FilterDropdownProps {
  label: string
  icon: typeof Calendar
  options: { id: string; label: string }[]
  value: string
  onChange?: (value: string) => void
  visibility: FilterVisibility
  userRole: UserType['role']
}

function FilterDropdown({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  visibility,
  userRole,
}: FilterDropdownProps) {
  // Check visibility - founder_only filters are only shown to founders/admins
  if (visibility === 'founder_only' && userRole === 'bd') {
    return null
  }

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="
            appearance-none w-full pl-9 pr-8 py-2 text-sm font-medium
            bg-white dark:bg-slate-800
            border border-slate-200 dark:border-slate-700
            rounded-lg
            text-slate-900 dark:text-slate-100
            hover:border-indigo-300 dark:hover:border-indigo-600
            focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
            transition-colors cursor-pointer
          "
        >
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  )
}

export function FilterBar({
  currentUser,
  filterOptions,
  selectedFilters,
  onFilterChange,
}: FilterBarProps) {
  const isFounderOrAdmin = currentUser.role === 'founder' || currentUser.role === 'admin'

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
      <div className="flex flex-wrap gap-4">
        {/* Date Range - Always visible */}
        <FilterDropdown
          label="Date Range"
          icon={Calendar}
          options={filterOptions.dateRange.options}
          value={selectedFilters.dateRange}
          onChange={(value) => onFilterChange?.('dateRange', value)}
          visibility={filterOptions.dateRange.visibility}
          userRole={currentUser.role}
        />

        {/* BD Filter - Founder only */}
        <FilterDropdown
          label="Team Member"
          icon={User}
          options={filterOptions.bds.options}
          value={selectedFilters.bdId}
          onChange={(value) => onFilterChange?.('bdId', value)}
          visibility={filterOptions.bds.visibility}
          userRole={currentUser.role}
        />

        {/* Source Filter */}
        <FilterDropdown
          label="Source"
          icon={Radio}
          options={filterOptions.sources.options}
          value={selectedFilters.sourceId}
          onChange={(value) => onFilterChange?.('sourceId', value)}
          visibility={filterOptions.sources.visibility}
          userRole={currentUser.role}
        />

        {/* Pipeline Filter */}
        <FilterDropdown
          label="Pipeline"
          icon={Layers}
          options={filterOptions.pipelines.options}
          value={selectedFilters.pipelineId}
          onChange={(value) => onFilterChange?.('pipelineId', value)}
          visibility={filterOptions.pipelines.visibility}
          userRole={currentUser.role}
        />

        {/* Stage Filter */}
        <FilterDropdown
          label="Stage"
          icon={GitBranch}
          options={filterOptions.stages.options}
          value={selectedFilters.stageId}
          onChange={(value) => onFilterChange?.('stageId', value)}
          visibility={filterOptions.stages.visibility}
          userRole={currentUser.role}
        />
      </div>

      {/* Role indicator for context */}
      {isFounderOrAdmin && (
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Viewing as {currentUser.role === 'founder' ? 'Founder' : 'Admin'} — full filter access enabled
        </p>
      )}
    </div>
  )
}
