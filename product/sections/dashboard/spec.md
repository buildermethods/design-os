# Dashboard Specification

## Overview
A performance dashboard providing visibility into the sales funnel (calls → connects → hot leads → conversions) with drop reason analytics. Access and data visibility are role-based: BDs see their own metrics while founders see team-wide data with filtering capabilities.

## User Flows
- View funnel metrics for selected time period (today/week/month/custom)
- Toggle between different time frames using date selector
- Click any metric or chart segment to navigate to Leads section with filters pre-applied
- View drop reason breakdown to understand why leads are falling off
- Apply filters to slice data by various dimensions (founders only)

## Permissions
- **BDs**: View their own metrics only by default; can view team-wide data only if role permits
- **Founders/Admins**: View team-wide metrics by default; can filter down to individual BD or other dimensions

## Filters (Founders/Admins only)
- Date range (today, this week, this month, custom)
- BD (filter to specific team member)
- Source (YouTube, WhatsApp, Referral, App Install, etc.)
- Pipeline (if multiple pipelines exist)
- Stage (filter by current pipeline stage)

## UI Requirements
- Funnel metrics displayed as stat cards (Calls Made → Connected → Hot Leads → Conversions)
- Date range selector (visible to all users)
- Filter bar with BD, Source, Pipeline, Stage dropdowns (visible to founders/admins only)
- Drop reason breakdown chart (pie or bar chart)
- Clickable metrics and chart segments that navigate to filtered Leads view

## Configuration
- shell: true
