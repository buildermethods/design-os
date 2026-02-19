# Milestone 3: Leads Section

Build the full lead database with search, filters, data table, and side panel details.

## Prerequisites

- Milestone 1 (Foundation) complete
- Milestone 2 (Today) complete — Leads reuses outcome form patterns

## Overview

The Leads section is the **lookup-oriented** complement to Today's queue-based calling. BDs use it to find specific leads, view their history, and log outcomes from calls made outside Cadence.

### Key Differences from Today

| Aspect | Today | Leads |
|--------|-------|-------|
| Purpose | Work the queue | Find & manage any lead |
| Layout | List → Detail | Table → Side panel |
| After log | Auto-advance | Stay on current lead |
| Selection | Single | Multi-select + bulk |

## Files to Create

```
src/sections/leads/
├── components/
│   ├── LeadsView.tsx        # Main container
│   ├── LeadTableRow.tsx     # Table row component
│   ├── LeadDetailPanel.tsx  # Side panel
│   ├── OutcomeForm.tsx      # 3-layer disposition form
│   └── index.ts
├── types.ts
└── page.tsx                 # Route: /leads
```

## Implementation Steps

### Step 1: Types Setup

Copy `types.ts` from the export package. Key types:
- `Lead` — Extended lead with timeline, flags, extra fields
- `TimelineEvent` — Union of call, link_sent, stage_change, note
- `QuickFilter` — Filter chip identifiers
- `FilterCounts` — Counts for each quick filter
- `LeadsProps` — All props for the main view

### Step 2: LeadsView Layout

```tsx
<div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
  {/* Header: title, search, filters */}
  <div className="flex-shrink-0 px-4 lg:px-6 py-4 bg-white dark:bg-slate-800">
    {/* Title + Export */}
    {/* Search input */}
    {/* Quick filter chips */}
  </div>

  {/* Bulk actions bar (conditional) */}
  {hasCheckedLeads && <BulkActionsBar />}

  {/* Main content */}
  <div className="flex-1 flex overflow-hidden">
    {/* Left: Table */}
    <div className={`flex-1 ${selectedLead ? 'lg:w-1/2' : 'w-full'}`}>
      <table>...</table>
    </div>

    {/* Right: Side panel (desktop) */}
    {selectedLead && (
      <div className="hidden lg:block w-1/2 max-w-xl">
        <LeadDetailPanel />
      </div>
    )}
  </div>

  {/* Mobile: Bottom sheet */}
  {selectedLead && <MobileBottomSheet />}
</div>
```

### Step 3: Quick Filters

```tsx
const quickFilterLabels = {
  myLeads: 'My Leads',
  overdue: 'Overdue',
  dueToday: 'Due Today',
  hot: 'Hot',
  new: 'New',
  unassigned: 'Unassigned',  // Admin only
  lost7d: 'Lost (7d)',       // Admin only
}

// Toggle behavior - one active at a time
const handleQuickFilterClick = (filter) => {
  const newFilter = activeFilter === filter ? null : filter
  setActiveFilter(newFilter)
  onQuickFilter?.(newFilter)
}
```

### Step 4: Data Table

Columns with appropriate widths:
1. Checkbox (w-10)
2. Lead — Name + Phone
3. Score — Color-coded
4. Source — Badge
5. Stage — Chip
6. Qualification — Icon + label
7. Next Action — Time or "—"
8. Last Touch — Relative date
9. Owner — Avatar + first name

Use `min-w-[900px]` for horizontal scroll on mobile.

### Step 5: LeadTableRow

```tsx
<tr onClick={onSelect} className={isSelected ? 'bg-indigo-50' : ''}>
  <td onClick={e => e.stopPropagation()}>
    <input type="checkbox" checked={isChecked} onChange={onToggleCheck} />
  </td>
  <td>
    <div>{lead.name}</div>
    <div className="font-mono text-sm">{lead.phone}</div>
    {hasBadNumber && <BadNumberIndicator />}
  </td>
  {/* ... other columns */}
</tr>
```

Key patterns:
- Checkbox click doesn't select row (stopPropagation)
- Row click opens side panel
- Bad number dimmed with opacity-60

### Step 6: LeadDetailPanel

Structure (above-fold priority):
1. **Header**: Name, score, source badge, stage chip
2. **Phone**: With copy button
3. **Owner + Qualification**: Editable dropdowns
4. **Next Action**: Amber box if present
5. **Quick Actions**: Log Call, WhatsApp, Schedule, Send Link

Below fold (scrollable):
1. OutcomeForm (expandable)
2. Recent Activity timeline
3. Lead Details (extra fields)
4. Move Stage dropdown
5. Actions: Open full profile, Mark bad number

### Step 7: OutcomeForm

Extended from Today's version with additional fields:
- Loss reason (required when closing lost)
- Won details: course, amount (optional)
- Syllabus link as additional link type

Validation rules:
```tsx
const isValid = (() => {
  if (!callResult) return false
  if (isNotConnected && !retryTime) return false
  if (isConnected && !conversationOutcome) return false
  if (isConnected && !nextAction) return false
  if (needsFollowUp && (!followUpDate || !followUpTime)) return false
  if (isClosingLost && !lossReason) return false
  return true
})()
```

### Step 8: Bulk Actions

```tsx
{hasCheckedLeads && (
  <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 flex gap-4">
    <span>{checkedLeadIds.size} selected</span>
    <button onClick={handleClearSelection}>Clear</button>

    {/* Dropdown menus */}
    <BulkAssignDropdown users={users} onAssign={handleBulkAssign} />
    <BulkQualifyDropdown onQualify={handleBulkQualify} />
    <button onClick={handleBulkMarkBadNumber}>Bad #</button>
    <button onClick={handleExportSelected}>Export</button>
  </div>
)}
```

### Step 9: Timeline Display

```tsx
function TimelineItem({ event, users }) {
  switch (event.type) {
    case 'call':
      return (
        <div className="flex gap-3 py-3 border-b">
          <CallIcon isConnected={event.callResult === 'connected'} />
          <div>
            <div>{callResultLabels[event.callResult]}</div>
            {event.conversationOutcome && <div>{outcomeLabels[event.conversationOutcome]}</div>}
            {event.notes && <p>{event.notes}</p>}
          </div>
        </div>
      )
    case 'link_sent':
      return <LinkSentItem event={event} />
    case 'stage_change':
      return <StageChangeItem event={event} />
  }
}
```

### Step 10: Mobile Bottom Sheet

```tsx
{selectedLead && (
  <div className="lg:hidden fixed inset-0 z-50">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-slate-900/50"
      onClick={handleClosePanel}
    />

    {/* Sheet */}
    <div className="absolute inset-x-0 bottom-0 max-h-[90vh] bg-white rounded-t-2xl">
      <div className="h-full max-h-[90vh] overflow-y-auto">
        <LeadDetailPanel {...props} />
      </div>
    </div>
  </div>
)}
```

## State Management

```tsx
const [searchQuery, setSearchQuery] = useState('')
const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilter | null>(null)
const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
const [checkedLeadIds, setCheckedLeadIds] = useState<Set<string>>(new Set())
const [showToast, setShowToast] = useState(false)
```

Key behaviors:
- Search → debounce, call onSearch
- Quick filter → toggle, call onQuickFilter
- Row click → set selected, call onSelectLead
- Checkbox → toggle in Set, call onSelectionChange

## Toast Pattern

```tsx
const showSuccessToast = (message: string) => {
  setToastMessage(message)
  setShowToast(true)
  setTimeout(() => setShowToast(false), 2500)
}

// After logging outcome
handleLogOutcome = (outcome) => {
  onLogOutcome?.(selectedLeadId, outcome)
  showSuccessToast('Outcome logged successfully')
  // Stay on lead (lookup flow, not queue)
}
```

## Testing Checklist

Refer to `tests.md` for comprehensive test cases. Key areas:
- [ ] Search by name, phone, notes
- [ ] Quick filter toggles and counts
- [ ] Table sorting and display
- [ ] Row vs checkbox selection
- [ ] Side panel all sections work
- [ ] OutcomeForm validation
- [ ] Bulk actions
- [ ] Mobile bottom sheet
- [ ] Empty states

## Design Tokens

Use the established palette:
- Primary: `indigo-600` (actions, selected states)
- Success: `emerald-600` (connected, won)
- Warning: `amber-600` (pending, retry)
- Danger: `red-600` (lost, bad number)
- Neutral: `slate-*` (text, borders, backgrounds)

## Next Milestone

Continue to [Milestone 4: Dashboard](04-dashboard.md) for founder visibility metrics.
