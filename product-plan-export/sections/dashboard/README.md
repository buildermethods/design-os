# Dashboard Section

## Overview

The Dashboard gives a funnel-level view of performance from calls to connects to hot leads to conversions. It is role-aware: BDs see their own metrics, while founders/admins see team-wide data with filter controls.

## User Flows

1. User opens Dashboard and sees funnel metrics for the selected date range.
2. User changes date range or other filters (source, pipeline, stage).
3. Founder/admin filters by team member (BD) when needed.
4. User clicks a funnel metric card to drill into Leads with a pre-applied filter.
5. User reviews drop reason breakdown and clicks a segment to drill into lost leads.

## Components Provided

| Component | Description |
|-----------|-------------|
| `DashboardView` | Main dashboard view with header, filters, funnel cards, and insights |
| `FilterBar` | Filter controls with role-based visibility |
| `FunnelCard` | Metric card for a funnel step (clickable when drilldown available) |
| `DropReasonChart` | Breakdown chart with click-to-drill segments |

## Data Used

**From props:**
- `currentUser` - Used to determine role and filter visibility
- `funnelMetrics` - Metric cards for calls, connect rate, hot leads, won, lost
- `dropReasonStats` - Drop reason aggregation for chart
- `filterOptions` - Filter options and visibility rules
- `selectedFilters` - Current selections for each filter

**From global model:**
- Lead, Call, DropReason (for aggregation and drilldown filters)

## Callback Props

| Callback | Description |
|----------|-------------|
| `onMetricClick` | Called when a funnel metric is clicked (passes drilldown filter) |
| `onDropReasonClick` | Called when a drop reason segment is clicked |
| `onFilterChange` | Called when a filter selection changes |
| `onCustomDateRange` | Called when a custom date range is selected |

## Visual Reference

See `dashboard.png` for the target UI design.

## Empty States

- **No drop reasons:** Show "No lost leads in selected period" in the chart card.

## Design Notes

- Funnel cards follow the ordered sequence: calls, connected, connect rate, hot, won, lost.
- Connect rate shows a percent value and is not drillable.
- Filter bar hides founder-only filters for BD users.
- Quick insights panel summarizes connect rate, hot leads, top drop reason, and win/loss.
- Drop reason bars are clickable and display percentage and count.
