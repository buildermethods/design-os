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

See `product-plan-export/sections/today/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan-export/sections/today/components/`:

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

- `product-plan-export/sections/today/README.md` — Feature overview and design intent
- `product-plan-export/sections/today/tests.md` — Test-writing instructions (use for TDD)
- `product-plan-export/sections/today/components/` — React components
- `product-plan-export/sections/today/types.ts` — TypeScript interfaces
- `product-plan-export/sections/today/sample-data.json` — Test data
- `product-plan-export/sections/today/today.png` — Visual reference

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
