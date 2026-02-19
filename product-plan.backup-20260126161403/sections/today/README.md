# Today Section

## Overview

The Today section is the BD's daily command center. It shows follow-ups due and prioritized new leads in tabbed lists, with a side panel for viewing lead details and logging call outcomes. Summary stats at the top track daily progress.

## User Flows

1. BD opens Today and sees progress stats (calls made, connected, follow-ups cleared, remaining)
2. BD switches between "Follow-ups" and "New Leads" tabs
3. BD clicks a lead to open the side panel with full details
4. BD makes the call, then logs using a smart outcome form:
   - Call Result (always required): Did not pick / Phone Busy / Unreachable / Number Incorrect / Connected
   - If Not Connected → Pick a retry time (required)
   - If Connected → Select Conversation Outcome (required) + Next Action (required)
5. Form adapts based on selections — only shows relevant fields
6. After logging, quick confirmation toast, then auto-advances to next lead

## Components Provided

| Component | Description |
|-----------|-------------|
| `TodayView` | Main view with stats, tabs, list, and side panel |
| `StatsHeader` | Progress stats display (calls made, connected, etc.) |
| `LeadList` | List of leads with selection and call actions |
| `LeadRow` | Individual lead row with score, source, stage |
| `LeadPanel` | Side panel with lead details and outcome form |
| `OutcomeForm` | Smart form with conditional logic for logging calls |
| `Tabs` | Tab component for switching between lists |

## Data Used

**From props:**
- `stats` — Today's progress metrics
- `followUpsDue` — Leads with follow-ups due today
- `newLeads` — New leads prioritized by score
- `callResultOptions` — Options for call result dropdown
- `conversationOutcomeOptions` — Grouped options for conversation outcome
- `nextActionOptions` — Options for next action
- `retryTimeOptions` — Options for retry time

**From global model:**
- Lead (with score, source, stage, calls, followUp)
- Call (callResult, conversationOutcome, nextAction, notes)
- FollowUp (reason, dueDate, dueTime, priority)

## Callback Props

| Callback | Description |
|----------|-------------|
| `onTabChange` | Called when user switches tabs |
| `onSelectLead` | Called when user clicks a lead |
| `onClosePanel` | Called when user closes the side panel |
| `onLogOutcome` | Called when user submits the outcome form |
| `onInitiateCall` | Called when user clicks the call button |

## Visual Reference

See `screenshot.png` for the target UI design.

## Empty States

- **Follow-ups tab empty:** "All caught up! You've cleared all your follow-ups for today. Great work!"
- **New Leads tab empty:** "No new leads. New leads will appear here when they come in."

## Design Notes

- Priority indicator bar on left edge for high/medium/low priority follow-ups
- Score uses color coding (green 80+, amber 60-79, gray <60)
- Source and stage shown as color-coded badges
- Call button appears on hover
- Mobile: Side panel slides up as bottom sheet
- Toast notification after logging outcome
- Auto-advance to next lead after logging
