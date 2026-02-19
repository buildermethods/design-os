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
