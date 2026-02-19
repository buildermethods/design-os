# Test Instructions: Dashboard Section

These test-writing instructions are framework-agnostic. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Dashboard shows funnel metrics and drop reason analytics with role-based filters. Tests should verify filter visibility, drilldown interactions, metric formatting, and insight messaging.

---

## User Flow Tests

### Flow 1: Founder/Admin View

**Scenario:** Founder views team metrics and filters

**Setup:**
- `currentUser.role = 'founder'`
- `filterOptions.bds.visibility = 'founder_only'`
- `selectedFilters` populated with defaults

**Expected Results:**
- [ ] Header shows "Dashboard"
- [ ] Subtext reads "Team performance overview"
- [ ] Filter bar shows Date Range, Team Member, Source, Pipeline, Stage
- [ ] Role indicator shows "Viewing as Founder" or "Admin"

---

### Flow 2: BD View (Role Gating)

**Scenario:** BD sees only their own metrics

**Setup:**
- `currentUser.role = 'bd'`
- `filterOptions.bds.visibility = 'founder_only'`

**Expected Results:**
- [ ] Subtext reads "Your performance metrics"
- [ ] "Team Member" filter is not rendered
- [ ] Role indicator is not shown

---

### Flow 3: Update Filters

**Scenario:** User changes filter values

**Steps:**
1. Change Date Range to "This Week"
2. Change Source to "YouTube"
3. Change Pipeline to "NEET Coaching"

**Expected Results:**
- [ ] `onFilterChange` is called with `('dateRange', 'this_week')`
- [ ] `onFilterChange` is called with `('sourceId', 'src-001')`
- [ ] `onFilterChange` is called with `('pipelineId', 'pipe-001')`

---

### Flow 4: Funnel Metric Drilldown

**Scenario:** User clicks a metric to open filtered Leads view

**Steps:**
1. Click "Calls Made" card
2. Click "Connected" card

**Expected Results:**
- [ ] `onMetricClick` called with `('callsMade', drilldownFilter)`
- [ ] `onMetricClick` called with `('connected', drilldownFilter)`
- [ ] Cards with `drilldownFilter = null` are disabled (no click)

---

### Flow 5: Drop Reason Drilldown

**Scenario:** User clicks a drop reason segment

**Steps:**
1. Click "Price too high" row in chart

**Expected Results:**
- [ ] `onDropReasonClick` called with `(dropReasonId, drilldownFilter)`
- [ ] Count and percentage values are displayed
- [ ] Total lost count is shown in header

---

### Flow 6: Quick Insights

**Scenario:** Insights change based on metrics

**Expected Results:**
- [ ] Connect rate >= 50 shows "Above average" message
- [ ] Connect rate between 30-49 shows "Room for improvement" message
- [ ] Connect rate < 30 shows "Low connect rate" message
- [ ] Hot lead insight appears only when `hotLeads.value > 0`
- [ ] Top drop reason appears when `dropReasonStats.length > 0`
- [ ] Win/Loss insight appears when `won > 0` or `lost > 0`

---

## Empty State Tests

### No Drop Reasons

**Setup:**
- `dropReasonStats = []`

**Expected Results:**
- [ ] Empty state message "No lost leads in selected period"
- [ ] No chart rows rendered

---

## Component Interaction Tests

### FilterBar

- [ ] Date Range select is always visible
- [ ] Founder-only filters are hidden for BD role
- [ ] Selected option reflects `selectedFilters`

### FunnelCard

- [ ] Values are formatted as numbers with commas
- [ ] Percent metric displays with a "%" suffix
- [ ] Non-drillable metric shows disabled state

### DropReasonChart

- [ ] Each row shows label, count, and percentage
- [ ] Unknown bucket (dropReasonId = null) renders with gray color

---

## Accessibility Checks

- [ ] Filter selects are keyboard accessible
- [ ] Metric cards are focusable buttons (when clickable)
- [ ] Chart rows are focusable and activate via Enter/Space
- [ ] Text contrast meets accessibility requirements in light and dark mode

---

## Sample Test Data

```typescript
const currentUser = { id: 'user-001', name: 'Arjun Mehta', role: 'founder' }

const funnelMetrics = {
  callsMade: { value: 156, label: 'Calls Made', drilldownFilter: { hasCall: true } },
  connected: { value: 89, label: 'Connected', drilldownFilter: { hasConnectedCall: true } },
  connectRate: { value: 57.1, label: 'Connect Rate', unit: 'percent', drilldownFilter: null },
  hotLeads: { value: 34, label: 'Hot Leads', drilldownFilter: { stageIn: ['stage-hot'] } },
  won: { value: 12, label: 'Won', drilldownFilter: { stageIn: ['stage-won'] } },
  lost: { value: 23, label: 'Lost', drilldownFilter: { stageIn: ['stage-lost'] } },
}

const dropReasonStats = [
  { dropReasonId: 'dr-001', reason: 'Price too high', count: 8, percentage: 34.8, drilldownFilter: { dropReasonId: 'dr-001' } },
  { dropReasonId: null, reason: 'Unknown / Not captured', count: 3, percentage: 13.0, drilldownFilter: { dropReasonId: null } },
]

const filterOptions = {
  dateRange: { options: [{ id: 'today', label: 'Today' }], visibility: 'all', default: 'today' },
  bds: { options: [{ id: 'all', label: 'All Team' }], visibility: 'founder_only', default: 'all' },
  sources: { options: [{ id: 'all', label: 'All Sources' }], visibility: 'all', default: 'all' },
  pipelines: { options: [{ id: 'all', label: 'All Pipelines' }], visibility: 'all', default: 'all' },
  stages: { options: [{ id: 'all', label: 'All Stages' }], visibility: 'all', default: 'all' },
}

const selectedFilters = {
  dateRange: 'today',
  bdId: 'all',
  sourceId: 'all',
  pipelineId: 'all',
  stageId: 'all',
}
```
