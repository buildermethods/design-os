import { useState } from 'react'
import data from '@/../product/sections/dashboard/data.json'
import type { SelectedFilters, FunnelMetrics, DrilldownFilter } from '@/../product/sections/dashboard/types'
import { DashboardView } from './components/DashboardView'

export default function DashboardPreview() {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(
    data.selectedFilters as SelectedFilters
  )

  const handleFilterChange = (filterKey: keyof SelectedFilters, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [filterKey]: value }))
    console.log('Filter changed:', filterKey, '=', value)
  }

  const handleMetricClick = (metricKey: keyof FunnelMetrics, filter: DrilldownFilter) => {
    console.log('Metric clicked:', metricKey, 'Filter:', filter)
    console.log('→ Navigate to Leads with filter:', JSON.stringify(filter, null, 2))
  }

  const handleDropReasonClick = (dropReasonId: string | null, filter: DrilldownFilter) => {
    console.log('Drop reason clicked:', dropReasonId ?? 'unknown', 'Filter:', filter)
    console.log('→ Navigate to Leads with filter:', JSON.stringify(filter, null, 2))
  }

  const handleCustomDateRange = (startDate: string, endDate: string) => {
    console.log('Custom date range:', startDate, 'to', endDate)
  }

  return (
    <DashboardView
      currentUser={data.currentUser as { id: string; name: string; role: 'bd' | 'founder' | 'admin' }}
      funnelMetrics={data.funnelMetrics as unknown as import('@/../product/sections/dashboard/types').FunnelMetrics}
      dropReasonStats={data.dropReasonStats as unknown as import('@/../product/sections/dashboard/types').DropReasonStat[]}
      filterOptions={data.filterOptions as unknown as import('@/../product/sections/dashboard/types').FilterOptions}
      selectedFilters={selectedFilters}
      onMetricClick={handleMetricClick}
      onDropReasonClick={handleDropReasonClick}
      onFilterChange={handleFilterChange}
      onCustomDateRange={handleCustomDateRange}
    />
  )
}
