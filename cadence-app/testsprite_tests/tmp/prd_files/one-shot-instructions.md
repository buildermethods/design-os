# One-Shot Implementation Instructions

This document combines all milestone instructions for a full implementation. Follow the milestones in order.

---

# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Colors:**
- Primary: `indigo` — Buttons, links, active states
- Secondary: `amber` — Hot badges, warnings, highlights
- Neutral: `slate` — Backgrounds, text, borders

**Typography:**
- Heading & Body: Inter (400, 500, 600, 700)
- Mono: JetBrains Mono (400, 500)

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

**Core entities to implement:**
- User (BD, Admin, Founder roles)
- Lead (with score, qualification, stage)
- Call (call attempts and outcomes)
- FollowUp (scheduled follow-up tasks)
- Stage (pipeline stages)
- DropReason (loss reasons for analytics)
- Pipeline (stage containers)

### 3. Routing Structure

Create placeholder routes for each section:

| Route | Section | Description |
|-------|---------|-------------|
| `/` or `/today` | Today | BD's daily command center (default) |
| `/leads` | Leads | Full lead database |
| `/leads/:id` | Lead Detail | Full-page lead view (optional) |
| `/dashboard` | Dashboard | Founder's metrics |
| `/settings` | Settings | Process configuration |

### 4. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with sidebar
- `MainNav.tsx` — Navigation component
- `UserMenu.tsx` — User menu with avatar and logout

**Wire Up Navigation:**

Connect navigation to your routing:

| Nav Item | Route | Icon |
|----------|-------|------|
| Today | `/today` | Calendar/Home |
| Leads | `/leads` | Users/Database |
| Dashboard | `/dashboard` | Chart/Analytics |
| Settings | `/settings` | Cog/Settings |

**User Menu:**

The user menu expects:
- User name
- User role (BD, Admin, Founder)
- Avatar URL (optional, shows initials if null)
- Logout callback

**Responsive Behavior:**
- Desktop (1024px+): Full sidebar always visible
- Tablet (768-1023px): Collapsible sidebar with toggle
- Mobile (<768px): Hamburger menu, sidebar slides in as overlay

## Files to Reference

- `product-plan/design-system/` — Design tokens (colors, fonts)
- `product-plan/data-model/` — Type definitions and relationships
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (colors, fonts loading)
- [ ] Data model types are defined
- [ ] Routes exist for all sections (can be placeholder pages)
- [ ] Shell renders with sidebar navigation
- [ ] Navigation links to correct routes
- [ ] Active nav item is highlighted
- [ ] User menu shows user info
- [ ] Logout callback works
- [ ] Responsive on mobile (hamburger menu works)
- [ ] Dark mode toggle works (if implementing)

---

# Milestone 2: Today

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement the Today feature — the BD's daily command center with prioritized calls and follow-ups.

## Overview

The Today section shows BDs their work queue for the day: follow-ups that are due and new leads prioritized by score. BDs can view lead details, make calls (outside the app), and log outcomes with a smart conditional form.

**Key Functionality:**
- View daily progress stats (calls made, connected, follow-ups cleared, remaining)
- Switch between Follow-ups Due and New Leads tabs
- Click a lead to view details in side panel
- Log call outcomes with conditional form logic
- Auto-advance to next lead after logging

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/today/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/today/components/`:

- `TodayView.tsx` — Main view orchestrating the page
- `StatsHeader.tsx` — Daily progress stats
- `LeadList.tsx` — Lead list with tabs
- `LeadRow.tsx` — Individual lead row
- `LeadPanel.tsx` — Side panel with lead details
- `OutcomeForm.tsx` — Smart outcome logging form

### Data Layer

The components expect these data shapes:

```typescript
interface Stats {
  callsMade: number
  connected: number
  followUpsCleared: number
  remainingInQueue: number
}

interface Lead {
  id: string
  name: string
  phone: string
  email: string
  score: number
  source: Source
  stage: Stage
  lastContactDate: string | null
  followUp?: FollowUp
  calls: Call[]
}
```

You'll need to:
- Create API endpoint to fetch today's queue (follow-ups due + new leads)
- Create API endpoint to fetch/update stats
- Create API endpoint to log call outcomes
- Implement real-time or polling updates for stats

### Callbacks

Wire up these user actions:

| Callback | Backend Action |
|----------|---------------|
| `onTabChange` | Track active tab (client state only) |
| `onSelectLead` | Fetch full lead details if needed |
| `onClosePanel` | Clear selection (client state only) |
| `onLogOutcome` | POST outcome to API, update stats, refresh queue |
| `onInitiateCall` | Open phone dialer or log call initiation |

### Empty States

The components include empty state designs:

- **Follow-ups empty:** "All caught up! You've cleared all your follow-ups for today."
- **New Leads empty:** "No new leads. New leads will appear here when they come in."

Make sure to pass empty arrays when no data exists — the components will render the appropriate empty state.

## Files to Reference

- `product-plan/sections/today/README.md` — Feature overview and design intent
- `product-plan/sections/today/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/today/components/` — React components
- `product-plan/sections/today/types.ts` — TypeScript interfaces
- `product-plan/sections/today/sample-data.json` — Test data
- `product-plan/sections/today/today.png` — Visual reference

## Expected User Flows

### Flow 1: View Daily Queue

1. BD navigates to Today page
2. BD sees stats header showing today's progress
3. BD sees Follow-ups Due tab active by default with count badge
4. **Outcome:** BD knows how many calls to make and follow-ups to clear

### Flow 2: Work Through Follow-ups

1. BD clicks first lead in Follow-ups Due list
2. BD sees lead details in side panel (contact info, follow-up reason, call history)
3. BD clicks "Call Now" to initiate call (opens phone dialer)
4. BD logs outcome using the form
5. **Outcome:** Outcome saved, toast shown, auto-advances to next lead

### Flow 3: Log Not-Connected Call

1. BD selects "Did not pick" as call result
2. BD sees retry time options appear
3. BD selects "In 1 hour"
4. BD clicks "Log Outcome"
5. **Outcome:** Follow-up rescheduled, lead moves back in queue

### Flow 4: Log Connected Call with Follow-up

1. BD selects "Connected" as call result
2. BD selects conversation outcome (e.g., "Want to discuss with family")
3. BD selects next action (e.g., "Schedule follow-up")
4. BD picks follow-up date and time
5. BD clicks "Log Outcome"
6. **Outcome:** Call logged, follow-up created, lead removed from today's queue

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Today page shows stats and tabbed lead lists
- [ ] Clicking lead opens side panel with details
- [ ] Outcome form works with conditional logic
- [ ] Empty states display when no follow-ups or new leads
- [ ] Logging outcome shows toast and auto-advances
- [ ] Stats update after logging outcomes
- [ ] Responsive on mobile (bottom sheet instead of side panel)

---

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

---

# Milestone 4: Dashboard

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement the Dashboard feature with funnel metrics, filters, and drop reason analytics.

## Overview

The Dashboard provides visibility into the sales funnel (calls, connects, hot leads, won, lost) and shows drop reason breakdowns. It supports role-based filters: founders/admins can filter by BD, while BDs see their own metrics by default.

**Key Functionality:**
- View funnel metrics for a selected date range
- Filter by date range, source, pipeline, and stage
- Founder/admin-only filter by BD
- Click funnel metrics to drill into filtered Leads
- Click drop reason segments to drill into lost Leads

## Recommended Approach: Test-Driven Development

Before implementing, write tests based on:
- `product-plan/sections/dashboard/tests.md`

## What to Implement

### Components

Copy components from `product-plan/sections/dashboard/components/`:
- `DashboardView.tsx`
- `FilterBar.tsx`
- `FunnelCard.tsx`
- `DropReasonChart.tsx`

### Data Layer

You will need API endpoints for:
- Funnel metrics aggregation
- Drop reason breakdown
- Filter options (date ranges, sources, pipelines, stages, team members)

The metrics should align with these rules:
- Calls Made: count of calls in selected range
- Connected: calls with connected outcome
- Connect Rate: connected / calls
- Hot Leads: leads in hot stage during range
- Won/Lost: leads moved to terminal stages during range

### Callbacks

Wire up these interactions:

| Callback | Backend Action |
|----------|---------------|
| `onFilterChange` | Update filter selection, refetch metrics |
| `onCustomDateRange` | Set custom range, refetch metrics |
| `onMetricClick` | Navigate to Leads with drilldown filters |
| `onDropReasonClick` | Navigate to Leads filtered by drop reason |

### Role-Based Access

- BDs should not see founder-only filters (Team Member)
- Founder/admin users see full filter set

### Empty States

- If there are no lost leads in the selected range, show the drop reason empty state

## Files to Reference

- `product-plan/sections/dashboard/README.md` — Feature overview
- `product-plan/sections/dashboard/tests.md` — Test instructions
- `product-plan/sections/dashboard/components/` — React components
- `product-plan/sections/dashboard/types.ts` — TypeScript interfaces
- `product-plan/sections/dashboard/sample-data.json` — Sample data
- `product-plan/sections/dashboard/dashboard.png` — Visual reference

## Expected User Flows

### Flow 1: View Funnel Metrics
1. User opens Dashboard
2. Sees funnel cards in order
3. Sees quick insights panel on the right

### Flow 2: Filter Metrics
1. User changes date range
2. User filters by source or pipeline
3. Dashboard updates aggregates

### Flow 3: Drilldown to Leads
1. User clicks "Calls Made" or "Lost" card
2. App navigates to Leads with filter payload

### Flow 4: Drop Reason Drilldown
1. User clicks a drop reason segment
2. App navigates to Leads with drop reason filter

## Done When

- [ ] Tests written for key flows and edge cases
- [ ] Funnel metrics render and update with filters
- [ ] Role-based filter visibility works
- [ ] Drilldown callbacks fire correctly
- [ ] Drop reason empty state renders when needed
- [ ] Responsive layout works for mobile and desktop

---

# Milestone 5: Settings

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-4 complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement the Settings feature for pipelines, drop reasons, and team management.

## Overview

Settings is an admin-only area for configuring sales process data. It provides a tabbed interface with panels for:
- Pipelines and stages
- Drop reasons
- Team members

BD users without permission should see an access restricted state.

## Recommended Approach: Test-Driven Development

Before implementing, write tests based on:
- `product-plan/sections/settings/tests.md`

## What to Implement

### Components

Copy components from `product-plan/sections/settings/components/`:
- `SettingsView.tsx`
- `PipelinePanel.tsx`
- `StageList.tsx`
- `DropReasonPanel.tsx`
- `TeamPanel.tsx`

### Data Layer

You will need API endpoints for:
- Pipelines (list, create, edit, archive, set default)
- Stages (list, create, edit, archive, reorder)
- Drop reasons (list, create, edit, toggle active)
- Users (list, invite, edit, deactivate/reactivate)

### Validation Rules

- Each pipeline must have exactly one Won and one Lost stage
- Default pipeline changes should trigger confirmation
- Won/Lost stages should not be archived

### Callbacks

Wire up these actions:

| Callback | Backend Action |
|----------|---------------|
| `onTabChange` | Update active tab
| `onSelectPipeline` | Load pipeline stages
| `onCreatePipeline` | Open create pipeline flow
| `onEditPipeline` | Open edit pipeline flow
| `onArchivePipeline` | Archive pipeline (soft delete)
| `onSetDefaultPipeline` | Set default pipeline
| `onCreateStage` | Open create stage flow
| `onEditStage` | Open edit stage flow
| `onArchiveStage` | Archive stage
| `onReorderStages` | Persist new stage order
| `onCreateDropReason` | Open create drop reason flow
| `onEditDropReason` | Open edit drop reason flow
| `onToggleDropReasonActive` | Activate/deactivate reason
| `onInviteUser` | Invite a new team member
| `onEditUser` | Edit user details and assignments
| `onDeactivateUser` | Deactivate user (soft delete)
| `onReactivateUser` | Reactivate user

### Empty States

- No pipelines (prompt to create first pipeline)
- No stages in selected pipeline
- No active drop reasons
- No active team members

## Files to Reference

- `product-plan/sections/settings/README.md` — Feature overview
- `product-plan/sections/settings/tests.md` — Test instructions
- `product-plan/sections/settings/components/` — React components
- `product-plan/sections/settings/types.ts` — TypeScript interfaces
- `product-plan/sections/settings/sample-data.json` — Sample data
- `product-plan/sections/settings/settings.png` — Visual reference

## Expected User Flows

### Flow 1: Access Control
1. Founder/admin opens Settings
2. Tabs render and default to Pipelines
3. BD without access sees restricted state

### Flow 2: Manage Pipelines
1. Select a pipeline from list
2. View stages and validation warnings
3. Create or edit stages
4. Set a pipeline as default

### Flow 3: Manage Drop Reasons
1. View active and inactive reasons
2. Toggle active state
3. Create or edit reasons

### Flow 4: Manage Team
1. View active and deactivated users
2. Invite new member
3. Edit or deactivate user

## Done When

- [ ] Tests written for key flows and edge cases
- [ ] Access control state renders correctly
- [ ] Tabs switch and show correct panel
- [ ] Pipeline actions and validation work
- [ ] Drop reason toggles work
- [ ] Team management actions trigger callbacks
- [ ] Responsive layout works for mobile and desktop
