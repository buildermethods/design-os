# Today Specification

## Overview
The Today section is the BD's daily command center. It shows follow-ups due and prioritized new leads in tabbed lists, with a side panel for viewing lead details and logging call outcomes. Summary stats at the top track daily progress.

## User Flows
- BD opens Today and sees progress stats (calls made, connected, follow-ups cleared, remaining)
- BD switches between "Follow-ups" and "New Leads" tabs
- BD clicks a lead to open the side panel with full details
- BD makes the call, then logs using a smart outcome form:
  - Call Result (always required): Did not pick / Phone Busy / Unreachable / Number Incorrect / Connected
  - If Not Connected → Pick a retry time (required)
  - If Connected → Select Conversation Outcome (required) + Next Action (required)
- Form adapts based on selections — only shows relevant fields
- After logging, quick confirmation, then auto-advances to next lead

## UI Requirements
- Stats header: Calls Made, Connected, Follow-ups Cleared, Remaining in Queue
- Two tabs: "Follow-ups Due" and "New Leads"
- Lead list shows: Name, score, source, stage, last contact date
- Side panel: full lead details, contact info, call history, outcome form

### Outcome Form Logic

| Call Result | Next Fields |
|-------------|-------------|
| Did not pick / Phone Busy / Unreachable | Retry time picker (required) + optional notes |
| Number Incorrect | Mark lead as bad number, remove from queue |
| Connected | Conversation Outcome + Next Action |

### Conversation Outcome (if Connected, grouped)
- Intent/Fit: Just browsing, Preparing for other exam, Not eligible, Product unavailable
- Timing: Call back later, Discuss with family
- Competition: Already purchased elsewhere, Competitor cheaper
- Pricing: Affordability barrier, Need discount
- Customer state: Already a customer

### Next Action (if Connected)
- Send demo link → prompts for follow-up time
- Send payment link → prompts for follow-up time
- Schedule follow-up → pick date/time
- Close Won
- Close Lost

### Additional Requirements
- Notes field always available (optional)
- Validation: Form can't save until all required fields are complete
- Quick confirmation toast after logging, then auto-advance to next lead

## Configuration
- shell: true
