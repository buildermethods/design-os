import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import data from '@/sections/leads/sample-data.json'
import { LeadsView } from '@/sections/leads/components/LeadsView'
import type {
  AdvancedFilters,
  BulkAssignPayload,
  BulkMarkBadNumberPayload,
  BulkQualifyPayload,
  BulkStageChangePayload,
  CallEvent,
  ConversationOutcomeCategory,
  FilterCounts,
  Lead,
  LeadFlag,
  LinkSentEvent,
  LinkType,
  LinkTypeOption,
  MergeCandidate,
  MergePayload,
  NextActionOption,
  OutcomeFormData,
  Qualification,
  QuickFilter,
  RetryTimeOption,
  SelectOption,
  SortField,
  SortOrder,
  Stage,
  StageChangeEvent,
  User,
} from '@/sections/leads/types'

const MS_IN_DAY = 24 * 60 * 60 * 1000

const pad = (value: number) => String(value).padStart(2, '0')
const formatDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const formatTime = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60 * 1000)
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * MS_IN_DAY)

const getReferenceDate = (leads: Lead[]) => {
  if (!leads.length) return new Date()
  const dateKeys: string[] = []

  for (const lead of leads) {
    dateKeys.push(lead.createdDate)
    if (lead.lastContactDate) {
      dateKeys.push(lead.lastContactDate)
    }
    if (lead.nextAction?.dueDate) {
      dateKeys.push(lead.nextAction.dueDate)
    }
    for (const event of lead.timeline) {
      dateKeys.push(event.date)
    }
  }

  const latestKey = dateKeys.reduce((latest, key) => (key > latest ? key : latest), dateKeys[0])
  return new Date(`${latestKey}T12:00:00`)
}

const isWithinDays = (referenceDate: Date, dateStr: string | null, days: number) => {
  if (!dateStr) return false
  const referenceStart = startOfDay(referenceDate).getTime()
  const value = new Date(`${dateStr}T00:00:00`).getTime()
  const diffDays = Math.floor((referenceStart - value) / MS_IN_DAY)
  return diffDays >= 0 && diffDays < days
}

const getLatestCallEvent = (lead: Lead): CallEvent | null => {
  let latest: CallEvent | null = null
  for (const event of lead.timeline) {
    if (event.type !== 'call') continue
    const eventDate = new Date(`${event.date}T${event.time}`)
    if (!latest) {
      latest = event as CallEvent
      continue
    }
    const latestDate = new Date(`${latest.date}T${latest.time}`)
    if (eventDate > latestDate) {
      latest = event as CallEvent
    }
  }
  return latest
}

const matchesSearch = (lead: Lead, query: string) => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  if (lead.name.toLowerCase().includes(normalized)) return true
  if (lead.phone.includes(normalized)) return true
  if (lead.email.toLowerCase().includes(normalized)) return true
  return lead.timeline.some((event) => {
    if (event.type === 'call') {
      return Boolean(event.notes && event.notes.toLowerCase().includes(normalized))
    }
    if (event.type === 'note') {
      return event.content.toLowerCase().includes(normalized)
    }
    return false
  })
}

const matchesQuickFilter = (
  lead: Lead,
  filter: QuickFilter,
  currentUserId: string,
  referenceDateKey: string,
  referenceDate: Date,
) => {
  switch (filter) {
    case 'myLeads':
      return lead.ownerId === currentUserId
    case 'overdue':
      return Boolean(lead.nextAction?.dueDate && lead.nextAction.dueDate < referenceDateKey)
    case 'dueToday':
      return Boolean(lead.nextAction?.dueDate && lead.nextAction.dueDate === referenceDateKey)
    case 'hot':
      return lead.stage === 'Hot'
    case 'new':
      return lead.stage === 'New'
    case 'unassigned':
      return !lead.ownerId
    case 'lost7d':
      return lead.stage === 'Lost' && isWithinDays(referenceDate, lead.lastContactDate, 7)
    default:
      return true
  }
}

const matchesAdvancedFilters = (
  lead: Lead,
  filters: AdvancedFilters,
  referenceDate: Date,
  referenceDateKey: string,
) => {
  if (filters.sources?.length && !filters.sources.includes(lead.source)) return false
  if (filters.stages?.length && !filters.stages.includes(lead.stage)) return false
  if (filters.owners?.length && !filters.owners.includes(lead.ownerId ?? '')) return false
  if (filters.qualification && lead.qualification !== filters.qualification) return false
  if (filters.flags?.length && !filters.flags.every((flag) => lead.flags.includes(flag))) return false

  if (filters.nextActionDue) {
    if (filters.nextActionDue === 'none') {
      return !lead.nextAction
    }
    if (!lead.nextAction?.dueDate) return false
    if (filters.nextActionDue === 'overdue') {
      return lead.nextAction.dueDate < referenceDateKey
    }
    if (filters.nextActionDue === 'today') {
      return lead.nextAction.dueDate === referenceDateKey
    }
    if (filters.nextActionDue === 'next7d') {
      const nextWeekKey = formatDate(addDays(referenceDate, 7))
      return lead.nextAction.dueDate > referenceDateKey && lead.nextAction.dueDate <= nextWeekKey
    }
  }

  if (filters.lastContacted) {
    if (!lead.lastContactDate) return false
    if (filters.lastContacted === 'today') {
      if (lead.lastContactDate !== referenceDateKey) return false
    } else if (filters.lastContacted === 'last7d') {
      if (!isWithinDays(referenceDate, lead.lastContactDate, 7)) return false
    } else if (filters.lastContacted === 'last30d') {
      if (!isWithinDays(referenceDate, lead.lastContactDate, 30)) return false
    } else {
      if (lead.lastContactDate < filters.lastContacted.start || lead.lastContactDate > filters.lastContacted.end) {
        return false
      }
    }
  }

  if (filters.createdDate) {
    if (filters.createdDate === 'last7d') {
      if (!isWithinDays(referenceDate, lead.createdDate, 7)) return false
    } else if (filters.createdDate === 'last30d') {
      if (!isWithinDays(referenceDate, lead.createdDate, 30)) return false
    } else {
      if (lead.createdDate < filters.createdDate.start || lead.createdDate > filters.createdDate.end) {
        return false
      }
    }
  }

  if (filters.lastOutcome || filters.lastCallResult) {
    const latestCall = getLatestCallEvent(lead)
    if (!latestCall) return false
    if (filters.lastOutcome && latestCall.conversationOutcome !== filters.lastOutcome) return false
    if (filters.lastCallResult && latestCall.callResult !== filters.lastCallResult) return false
  }

  return true
}

const sortLeads = (
  items: Lead[],
  sort: { field: SortField; order: SortOrder } | null,
) => {
  if (!sort) return items
  const { field, order } = sort
  const direction = order === 'asc' ? 1 : -1

  const getValue = (lead: Lead): number | string | null => {
    if (field === 'score') return lead.score
    if (field === 'name') return lead.name.toLowerCase()
    if (field === 'createdDate') return lead.createdDate
    if (field === 'lastContactDate') return lead.lastContactDate ?? null
    if (field === 'nextActionDue') {
      if (!lead.nextAction) return null
      return `${lead.nextAction.dueDate}T${lead.nextAction.dueTime}`
    }
    return null
  }

  return [...items].sort((a, b) => {
    const valueA = getValue(a)
    const valueB = getValue(b)

    if (valueA === null && valueB === null) return 0
    if (valueA === null) return 1
    if (valueB === null) return -1

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (valueA - valueB) * direction
    }

    return valueA.toString().localeCompare(valueB.toString()) * direction
  })
}

const downloadJson = (filename: string, payload: unknown) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

// Maps dashboard DrilldownFilter stage IDs to the Stage values used in leads
const STAGE_ID_TO_NAME: Record<string, Stage> = {
  'stage-new': 'New',
  'stage-contacted': 'Contacted',
  'stage-hot': 'Hot',
  'stage-demo': 'Demo Scheduled',
  'stage-won': 'Won',
  'stage-lost': 'Lost',
}

interface DashboardDrilldownState {
  source: 'dashboard'
  metricKey?: string
  dropReasonId?: string | null
  filter?: {
    stageIn?: string[]
    hasCall?: boolean
    hasConnectedCall?: boolean
    dropReasonId?: string | null
  }
}

function drilldownToAdvancedFilters(state: DashboardDrilldownState): AdvancedFilters {
  const filter = state.filter ?? {}
  const result: AdvancedFilters = {}
  if (filter.stageIn?.length) {
    const stages = filter.stageIn.map((id) => STAGE_ID_TO_NAME[id]).filter(Boolean) as Stage[]
    if (stages.length) result.stages = stages
  }
  if (filter.hasConnectedCall) {
    result.lastCallResult = 'connected'
  }
  return result
}

export function LeadsPage() {
  const users = data.users as User[]
  const sourceOptions = data.sourceOptions as SelectOption[]
  const stageOptions = data.stageOptions as SelectOption[]
  const qualificationOptions = data.qualificationOptions as SelectOption[]
  const callResultOptions = data.callResultOptions as SelectOption[]
  const conversationOutcomeOptions = data.conversationOutcomeOptions as ConversationOutcomeCategory[]
  const nextActionOptions = data.nextActionOptions as NextActionOption[]
  const retryTimeOptions = data.retryTimeOptions as RetryTimeOption[]
  const lossReasonOptions = data.lossReasonOptions as SelectOption[]
  const linkTypeOptions = data.linkTypeOptions as LinkTypeOption[]

  const location = useLocation()
  const drilldownState = location.state as DashboardDrilldownState | null
  const initialAdvancedFilters = drilldownState?.source === 'dashboard'
    ? drilldownToAdvancedFilters(drilldownState)
    : null

  const [leads, setLeads] = useState<Lead[]>(data.leads as Lead[])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilter | null>(null)
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters | null>(initialAdvancedFilters)
  const [sort, setSort] = useState<{ field: SortField; order: SortOrder } | null>(null)
  const [drilldownLabel, setDrilldownLabel] = useState<string | null>(
    drilldownState?.source === 'dashboard' ? drilldownState.metricKey ?? null : null,
  )

  const currentUserId = users[2]?.id ?? users[0]?.id ?? 'user-001'
  const referenceDate = useMemo(() => getReferenceDate(leads), [leads])
  const referenceDateKey = useMemo(() => formatDate(referenceDate), [referenceDate])

  const filterCounts = useMemo<FilterCounts>(() => {
    const count = (filter: QuickFilter) =>
      leads.filter((lead) => matchesQuickFilter(lead, filter, currentUserId, referenceDateKey, referenceDate)).length

    return {
      myLeads: count('myLeads'),
      overdue: count('overdue'),
      dueToday: count('dueToday'),
      hot: count('hot'),
      new: count('new'),
      unassigned: count('unassigned'),
      lost7d: count('lost7d'),
    }
  }, [leads, currentUserId, referenceDate, referenceDateKey])

  const filteredLeads = useMemo(() => {
    const result = leads.filter((lead) => {
      if (!matchesSearch(lead, searchQuery)) return false
      if (activeQuickFilter && !matchesQuickFilter(lead, activeQuickFilter, currentUserId, referenceDateKey, referenceDate)) {
        return false
      }
      if (advancedFilters && !matchesAdvancedFilters(lead, advancedFilters, referenceDate, referenceDateKey)) return false
      return true
    })

    return sortLeads(result, sort)
  }, [leads, searchQuery, activeQuickFilter, advancedFilters, sort, currentUserId, referenceDate, referenceDateKey])

  const updateLead = (leadId: string, updater: (lead: Lead) => Lead) => {
    setLeads((prev) => prev.map((lead) => (lead.id === leadId ? updater(lead) : lead)))
  }

  const updateLeads = (leadIds: string[], updater: (lead: Lead) => Lead) => {
    const idSet = new Set(leadIds)
    setLeads((prev) => prev.map((lead) => (idSet.has(lead.id) ? updater(lead) : lead)))
  }

  const resolveRetrySchedule = (retryTime: string, baseDate: Date) => {
    if (retryTime === '30min') return addMinutes(baseDate, 30)
    if (retryTime === '1hour') return addMinutes(baseDate, 60)
    if (retryTime === '2hours') return addMinutes(baseDate, 120)
    if (retryTime === 'tomorrow_morning') return new Date(`${formatDate(addDays(baseDate, 1))}T09:00:00`)
    if (retryTime === 'tomorrow_afternoon') return new Date(`${formatDate(addDays(baseDate, 1))}T15:00:00`)
    return new Date(`${formatDate(addDays(baseDate, 1))}T10:00:00`)
  }

  const handleLogOutcome = (leadId: string, outcome: OutcomeFormData) => {
    const now = new Date()
    const dateKey = formatDate(now)
    const timeKey = formatTime(now)
    const retryLabel = outcome.retryTime
      ? retryTimeOptions.find((opt) => opt.id === outcome.retryTime)?.label ?? 'Retry'
      : null
    const nextActionLabel = outcome.nextAction
      ? nextActionOptions.find((opt) => opt.id === outcome.nextAction)?.label ?? 'Follow up'
      : null

    updateLead(leadId, (lead) => {
      const callEvent: CallEvent = {
        id: `evt-${leadId}-${now.getTime()}`,
        type: 'call',
        date: dateKey,
        time: timeKey,
        callResult: outcome.callResult,
        conversationOutcome: outcome.conversationOutcome ?? null,
        nextAction: outcome.nextAction,
        notes: outcome.notes ?? null,
        userId: currentUserId,
      }

      let nextAction = lead.nextAction
      let stage = lead.stage
      let lossReason = lead.lossReason
      let wonDetails = lead.wonDetails
      let flags: LeadFlag[] = lead.flags

      if (outcome.callResult === 'number_incorrect') {
        flags = flags.includes('bad_number') ? flags : [...flags, 'bad_number']
        nextAction = null
      }

      if (outcome.callResult !== 'connected' && outcome.retryTime) {
        const retryDate = resolveRetrySchedule(outcome.retryTime, now)
        nextAction = {
          type: 'retry',
          reason: retryLabel ?? 'Retry',
          dueDate: formatDate(retryDate),
          dueTime: formatTime(retryDate),
        }
      }

      if (outcome.callResult === 'connected') {
        if (outcome.nextAction === 'close_won') {
          stage = 'Won'
          lossReason = undefined
          nextAction = null
          if (outcome.wonCourse) {
            wonDetails = {
              course: outcome.wonCourse,
              amount: outcome.wonAmount ?? 0,
            }
          }
        } else if (outcome.nextAction === 'close_lost') {
          stage = 'Lost'
          lossReason = outcome.lossReason ?? lead.lossReason
          nextAction = null
        } else if (outcome.nextAction && outcome.followUpDate && outcome.followUpTime) {
          nextAction = {
            type: 'follow_up',
            reason: nextActionLabel ?? 'Follow up',
            dueDate: outcome.followUpDate,
            dueTime: outcome.followUpTime,
          }
        }
      }

      return {
        ...lead,
        stage,
        lossReason,
        wonDetails,
        flags,
        nextAction,
        lastContactDate: dateKey,
        timeline: [callEvent, ...lead.timeline],
      }
    })
  }

  const handleLogLinkSent = (leadId: string, linkType: LinkType) => {
    const now = new Date()
    const linkEvent: LinkSentEvent = {
      id: `evt-${leadId}-${now.getTime()}`,
      type: 'link_sent',
      date: formatDate(now),
      time: formatTime(now),
      linkType,
      userId: currentUserId,
    }

    updateLead(leadId, (lead) => ({
      ...lead,
      timeline: [linkEvent, ...lead.timeline],
    }))
  }

  const handleScheduleFollowUp = (leadId: string, date: string, time: string, reason: string) => {
    updateLead(leadId, (lead) => ({
      ...lead,
      nextAction: {
        type: 'follow_up',
        reason: reason || 'Scheduled follow-up',
        dueDate: date,
        dueTime: time,
      },
    }))
  }

  const handleEditPhone = (leadId: string, newPhone: string) => {
    updateLead(leadId, (lead) => ({
      ...lead,
      phone: newPhone,
    }))
  }

  const handleChangeOwner = (leadId: string, newOwnerId: string) => {
    updateLead(leadId, (lead) => ({
      ...lead,
      ownerId: newOwnerId,
    }))
  }

  const handleChangeQualification = (leadId: string, qualification: Qualification) => {
    updateLead(leadId, (lead) => ({
      ...lead,
      qualification,
    }))
  }

  const handleMoveStage = (leadId: string, stage: Stage, reason?: string) => {
    const now = new Date()
    updateLead(leadId, (lead) => {
      if (lead.stage === stage) return lead
      const stageEvent: StageChangeEvent = {
        id: `evt-${leadId}-${now.getTime()}`,
        type: 'stage_change',
        date: formatDate(now),
        time: formatTime(now),
        fromStage: lead.stage,
        toStage: stage,
        reason,
        userId: currentUserId,
      }
      return {
        ...lead,
        stage,
        lossReason: stage === 'Lost' ? reason ?? lead.lossReason : lead.lossReason,
        timeline: [stageEvent, ...lead.timeline],
      }
    })
  }

  const handleMarkBadNumber = (leadId: string) => {
    updateLead(leadId, (lead) => ({
      ...lead,
      flags: lead.flags.includes('bad_number') ? lead.flags : [...lead.flags, 'bad_number'],
    }))
  }

  const handleBulkAssign = (payload: BulkAssignPayload) => {
    updateLeads(payload.leadIds, (lead) => ({
      ...lead,
      ownerId: payload.ownerId,
    }))
  }

  const handleBulkQualify = (payload: BulkQualifyPayload) => {
    updateLeads(payload.leadIds, (lead) => ({
      ...lead,
      qualification: payload.qualification,
    }))
  }

  const handleBulkMarkBadNumber = (payload: BulkMarkBadNumberPayload) => {
    updateLeads(payload.leadIds, (lead) => ({
      ...lead,
      flags: lead.flags.includes('bad_number') ? lead.flags : [...lead.flags, 'bad_number'],
    }))
  }

  const handleExportSelected = (leadIds: string[]) => {
    const selected = leads.filter((lead) => leadIds.includes(lead.id))
    downloadJson(`cadence-leads-selected-${formatDate(new Date())}.json`, selected)
  }

  const handleExportFiltered = () => {
    downloadJson(`cadence-leads-filtered-${formatDate(new Date())}.json`, filteredLeads)
  }

  const handleBulkMoveStage = (payload: BulkStageChangePayload) => {
    const now = new Date()
    updateLeads(payload.leadIds, (lead) => {
      if (lead.stage === payload.stage) return lead
      const stageEvent: StageChangeEvent = {
        id: `evt-${lead.id}-${now.getTime()}`,
        type: 'stage_change',
        date: formatDate(now),
        time: formatTime(now),
        fromStage: lead.stage,
        toStage: payload.stage,
        reason: payload.reason,
        userId: currentUserId,
      }
      return {
        ...lead,
        stage: payload.stage,
        lossReason: payload.stage === 'Lost' ? payload.reason ?? lead.lossReason : lead.lossReason,
        timeline: [stageEvent, ...lead.timeline],
      }
    })
  }

  const handleCheckDuplicate = (phone: string): MergeCandidate | null => {
    const match = leads.find((lead) => lead.phone === phone)
    if (!match) return null
    return {
      lead: match,
      matchReason: 'Same phone number',
    }
  }

  const handleMerge = (payload: MergePayload) => {
    setLeads((prev) => {
      const primary = prev.find((lead) => lead.id === payload.primaryLeadId)
      if (!primary) return prev
      const secondary = prev.filter((lead) => payload.secondaryLeadIds.includes(lead.id))
      const mergedFlags = Array.from(new Set([...primary.flags, ...secondary.flatMap((lead) => lead.flags)]))
      const mergedTimeline = [...primary.timeline, ...secondary.flatMap((lead) => lead.timeline)]
      const mergedLead: Lead = {
        ...primary,
        flags: mergedFlags,
        timeline: mergedTimeline,
      }
      return prev
        .filter((lead) => !payload.secondaryLeadIds.includes(lead.id))
        .map((lead) => (lead.id === payload.primaryLeadId ? mergedLead : lead))
    })
  }

  const handleAdvancedFilter = (filters: AdvancedFilters) => {
    setAdvancedFilters(filters)
    setDrilldownLabel(null)
  }

  const handleSort = (field: SortField, order: SortOrder) => {
    setSort({ field, order })
  }

  const metricLabels: Record<string, string> = {
    callsMade: 'Calls Made',
    connected: 'Connected',
    hotLeads: 'Hot Leads',
    won: 'Won',
    lost: 'Lost',
  }

  return (
    <div className="h-full flex flex-col">
      {drilldownLabel && (
        <div className="flex-shrink-0 flex items-center justify-between px-4 lg:px-6 py-2 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-200 dark:border-indigo-800 text-sm text-indigo-700 dark:text-indigo-300">
          <span>Filtered from Dashboard: <strong>{metricLabels[drilldownLabel] ?? drilldownLabel}</strong></span>
          <button
            onClick={() => { setDrilldownLabel(null); setAdvancedFilters(null) }}
            className="text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200 font-medium"
          >
            Clear
          </button>
        </div>
      )}
      <LeadsView
        leads={filteredLeads}
        users={users}
      currentUserId={currentUserId}
      isAdmin
      filterCounts={filterCounts}
      sourceOptions={sourceOptions}
      stageOptions={stageOptions}
      qualificationOptions={qualificationOptions}
      callResultOptions={callResultOptions}
      conversationOutcomeOptions={conversationOutcomeOptions}
      nextActionOptions={nextActionOptions}
      retryTimeOptions={retryTimeOptions}
      lossReasonOptions={lossReasonOptions}
      linkTypeOptions={linkTypeOptions}
      onSearch={setSearchQuery}
      onQuickFilter={setActiveQuickFilter}
      onAdvancedFilter={handleAdvancedFilter}
      onSort={handleSort}
      onLogOutcome={handleLogOutcome}
      onLogLinkSent={handleLogLinkSent}
      onScheduleFollowUp={handleScheduleFollowUp}
      onEditPhone={handleEditPhone}
      onChangeOwner={handleChangeOwner}
      onChangeQualification={handleChangeQualification}
      onMarkBadNumber={handleMarkBadNumber}
      onMoveStage={handleMoveStage}
      onBulkAssign={handleBulkAssign}
      onBulkQualify={handleBulkQualify}
      onBulkMarkBadNumber={handleBulkMarkBadNumber}
      onExportSelected={handleExportSelected}
      onExportFiltered={handleExportFiltered}
      onBulkMoveStage={handleBulkMoveStage}
      onCheckDuplicate={handleCheckDuplicate}
      onMerge={handleMerge}
    />
    </div>
  )
}
