# Cadence — Product Overview

## Summary

Cadence is a Sales Operating System for Indian educator and coaching businesses. It turns messy lead handling into a predictable conversion machine — combining software, SOPs, and hands-on implementation to help teams stop losing revenue to chaos.

### Key Problems Solved

1. **Follow-ups slip through the cracks** — Automated scheduling, reminders, and accountability built into the daily workflow
2. **BDs waste effort on low-intent leads** — Lead scoring and prioritization so every BD knows exactly who to call today
3. **Founders can't see what's happening** — Daily dashboard with calls → connects → hot leads → conversions
4. **Every BD works differently** — Sales process embedded into the tool (scripts, stages, drop reasons)
5. **No clarity on why leads don't convert** — Drop reason tracking at every stage for data-driven improvements

## Planned Sections

1. **Today** — The BD's command center: prioritized calls, follow-ups due, and quick outcome logging in one focused view
2. **Leads** — Full lead database with scoring, stage history, qualification status, and the ability to search/filter across all leads
3. **Dashboard** — Founder's daily visibility: calls → connects → hot leads → conversions → expected revenue, plus drop reason analytics
4. **Settings** — Process configuration: pipeline stages, drop reasons, and team management

## Data Model

### Core Entities

- **Lead** — A prospective customer with score, qualification status, and pipeline stage
- **Call** — A call attempt or conversation between a BD and a lead
- **FollowUp** — A scheduled follow-up action with due date and reason
- **Stage** — A step in the sales pipeline (New, Contacted, Hot, Demo Scheduled, Won, Lost)
- **DropReason** — A reason why a lead didn't convert (pricing, timing, competitor, etc.)
- **User** — A team member (BD, Admin, or Founder) with role-based permissions
- **Source** — Where a lead originated from (YouTube, WhatsApp, Referral, Paid Ad, etc.)

### Key Relationships

- Lead has many Calls
- Lead has many FollowUps
- Lead belongs to one Stage (current position in pipeline)
- Lead belongs to one Source (where they came from)
- Lead may have one DropReason (if lost)
- Call belongs to User (who made the call)
- FollowUp belongs to User (who is assigned to complete it)

## Design System

**Colors:**
- Primary: `indigo` — Buttons, links, key accents
- Secondary: `amber` — Tags, highlights, hot indicators
- Neutral: `slate` — Backgrounds, text, borders

**Typography:**
- Heading: Inter
- Body: Inter
- Mono: JetBrains Mono

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, routing structure, and application shell
2. **Today** — BD's daily command center with follow-ups and new leads
3. **Leads** — Full lead database with search, filters, and bulk actions
4. **Dashboard** — Founder's metrics and drop reason analytics
5. **Settings** — Pipeline stages, drop reasons, and team management

Each milestone has a dedicated instruction document in `product-plan-export/instructions/`.
