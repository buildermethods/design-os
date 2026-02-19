import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dashData from '@/sections/dashboard/sample-data.json'
import leadsData from '@/sections/leads/sample-data.json'
import { DashboardView } from '@/sections/dashboard/components/DashboardView'
import type {
  DashboardProps,
  DropReasonStat,
  FilterOptions,
  FunnelMetrics,
  SelectedFilters,
  User,
} from '@/sections/dashboard/types'

// ---------------------------------------------------------------------------
// Source filter: dashboard source ID → lead source string
// ---------------------------------------------------------------------------
const SOURCE_ID_TO_NAME: Record<string, string> = {
  'src-001': 'YouTube',
  'src-002': 'WhatsApp Group',
  'src-003': 'App Install',
  'src-004': 'Referral',
  'src-005': 'Paid Ad',
}

// ---------------------------------------------------------------------------
// Loss reason: lead lossReason value → display label
// ---------------------------------------------------------------------------
const LOSS_REASON_LABELS: Record<string, string> = {
  affordability_barrier: 'Price too high',
  already_purchased_competitor: 'Chose competitor',
  not_the_right_time: 'Not the right time',
  no_response: 'No response after multiple attempts',
  not_eligible: 'Not eligible for course',
  already_enrolled: 'Already enrolled elsewhere',
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
type RawLead = (typeof leadsData.leads)[number]
type RawEvent = RawLead['timeline'][number]

const pad = (n: number) => String(n).padStart(2, '0')
const dateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function getReferenceDate(leads: RawLead[]): Date {
  const keys: string[] = []
  for (const lead of leads) {
    keys.push(lead.createdDate)
    for (const evt of lead.timeline) keys.push(evt.date)
  }
  if (!keys.length) return new Date()
  const latest = keys.reduce((a, b) => (b > a ? b : a))
  return new Date(`${latest}T12:00:00`)
}

function getDateBounds(
  dateRange: string,
  ref: Date,
): { startKey: string; endKey: string } {
  const end = ref
  let start: Date
  if (dateRange === 'today') {
    start = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate())
  } else if (dateRange === 'this_week') {
    start = new Date(ref.getTime() - 6 * 24 * 60 * 60 * 1000)
  } else {
    // this_month and custom both default to 30 days for mock data
    start = new Date(ref.getTime() - 29 * 24 * 60 * 60 * 1000)
  }
  return { startKey: dateKey(start), endKey: dateKey(end) }
}

// ---------------------------------------------------------------------------
// Metric computation
// ---------------------------------------------------------------------------
function computeMetrics(
  leads: RawLead[],
  filters: SelectedFilters,
): { funnelMetrics: FunnelMetrics; dropReasonStats: DropReasonStat[] } {
  const ref = getReferenceDate(leads)
  const { startKey, endKey } = getDateBounds(filters.dateRange, ref)

  // Apply owner and source filters to the lead pool
  const filteredLeads = leads.filter((lead) => {
    if (filters.bdId !== 'all' && lead.ownerId !== filters.bdId) return false
    if (filters.sourceId !== 'all') {
      const sourceName = SOURCE_ID_TO_NAME[filters.sourceId]
      if (sourceName && lead.source !== sourceName) return false
    }
    return true
  })

  // Call-based metrics: only count call events within the date range
  let callsMade = 0
  let connected = 0
  const leadsWithCall = new Set<string>()
  const leadsConnected = new Set<string>()

  for (const lead of filteredLeads) {
    for (const evt of lead.timeline) {
      if (evt.type !== 'call') continue
      if (evt.date < startKey || evt.date > endKey) continue
      leadsWithCall.add(lead.id)
      callsMade++
      if ((evt as RawEvent & { callResult?: string }).callResult === 'connected') {
        leadsConnected.add(lead.id)
        connected++
      }
    }
  }

  const connectRate = callsMade > 0 ? parseFloat(((connected / callsMade) * 100).toFixed(1)) : 0

  // Stage-based metrics: current stage of all filtered leads
  const hotLeads = filteredLeads.filter((l) => l.stage === 'Hot').length
  const won = filteredLeads.filter((l) => l.stage === 'Won').length
  const lost = filteredLeads.filter((l) => l.stage === 'Lost').length

  // Drop reason breakdown from lost leads
  const lostLeads = filteredLeads.filter((l) => l.stage === 'Lost')
  const reasonCounts: Record<string, number> = {}
  for (const lead of lostLeads) {
    const key = (lead as RawLead & { lossReason?: string }).lossReason ?? '__unknown__'
    reasonCounts[key] = (reasonCounts[key] ?? 0) + 1
  }

  const totalLost = lostLeads.length
  const dropReasonStats: DropReasonStat[] = Object.entries(reasonCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([reasonId, count]) => {
      const isUnknown = reasonId === '__unknown__'
      return {
        dropReasonId: isUnknown ? null : reasonId,
        reason: isUnknown ? 'Unknown / Not captured' : (LOSS_REASON_LABELS[reasonId] ?? reasonId),
        count,
        percentage: totalLost > 0 ? parseFloat(((count / totalLost) * 100).toFixed(1)) : 0,
        drilldownFilter: {
          stageIn: ['stage-lost'],
          dropReasonId: isUnknown ? null : reasonId,
          stageChangedInRange: true,
        },
      }
    })

  const funnelMetrics: FunnelMetrics = {
    callsMade: {
      value: callsMade,
      label: 'Calls Made',
      drilldownFilter: { hasCall: true, callDateRange: 'selected_range' },
    },
    connected: {
      value: connected,
      label: 'Connected',
      drilldownFilter: { hasConnectedCall: true, callDateRange: 'selected_range' },
    },
    connectRate: {
      value: connectRate,
      label: 'Connect Rate',
      unit: 'percent',
      drilldownFilter: null,
    },
    hotLeads: {
      value: hotLeads,
      label: 'Hot Leads',
      drilldownFilter: { stageIn: ['stage-hot'], stageChangedInRange: true },
    },
    won: {
      value: won,
      label: 'Won',
      drilldownFilter: { stageIn: ['stage-won'], stageChangedInRange: true },
    },
    lost: {
      value: lost,
      label: 'Lost',
      drilldownFilter: { stageIn: ['stage-lost'], stageChangedInRange: true },
    },
  }

  return { funnelMetrics, dropReasonStats }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function DashboardPage() {
  const navigate = useNavigate()
  const currentUser = dashData.currentUser as User
  const filterOptions = dashData.filterOptions as FilterOptions
  const leads = leadsData.leads as RawLead[]

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(
    dashData.selectedFilters as SelectedFilters,
  )

  const { funnelMetrics, dropReasonStats } = useMemo(
    () => computeMetrics(leads, selectedFilters),
    [leads, selectedFilters],
  )

  const handleFilterChange: DashboardProps['onFilterChange'] = (filterKey, value) => {
    setSelectedFilters((prev) => ({ ...prev, [filterKey]: value }))
  }

  const handleMetricClick: DashboardProps['onMetricClick'] = (metricKey, filter) => {
    navigate('/leads', { state: { source: 'dashboard', metricKey, filter } })
  }

  const handleDropReasonClick: DashboardProps['onDropReasonClick'] = (dropReasonId, filter) => {
    navigate('/leads', { state: { source: 'dashboard', dropReasonId, filter } })
  }

  return (
    <DashboardView
      currentUser={currentUser}
      funnelMetrics={funnelMetrics}
      dropReasonStats={dropReasonStats}
      filterOptions={filterOptions}
      selectedFilters={selectedFilters}
      onFilterChange={handleFilterChange}
      onMetricClick={handleMetricClick}
      onDropReasonClick={handleDropReasonClick}
    />
  )
}
