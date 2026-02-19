# Test Instructions: Today Section

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

The Today section is the BD's command center for managing daily calls and follow-ups. Tests should verify the tabbed interface, lead selection, outcome logging with conditional form logic, and auto-advance behavior.

---

## User Flow Tests

### Flow 1: View Daily Queue and Stats

**Scenario:** BD opens the Today page to see their work queue

**Setup:**
- Stats: { callsMade: 12, connected: 5, followUpsCleared: 3, remainingInQueue: 9 }
- 5 leads in followUpsDue array
- 7 leads in newLeads array

**Steps:**
1. User navigates to `/today`
2. User sees the stats header

**Expected Results:**
- [ ] Page title shows "Today"
- [ ] Stats header shows "12" for Calls Made
- [ ] Stats header shows "5" for Connected
- [ ] Stats header shows "3" for Follow-ups Cleared
- [ ] Stats header shows "9" for Remaining
- [ ] "Follow-ups Due" tab is active by default
- [ ] Tab shows badge with "5" for follow-up count
- [ ] "New Leads" tab shows badge with "7"
- [ ] Lead list displays 5 follow-up leads

---

### Flow 2: Switch Between Tabs

**Scenario:** BD switches from follow-ups to new leads

**Steps:**
1. User clicks "New Leads" tab

**Expected Results:**
- [ ] "New Leads" tab becomes active (highlighted)
- [ ] "Follow-ups Due" tab becomes inactive
- [ ] Lead list now shows 7 new leads
- [ ] Side panel closes if it was open

---

### Flow 3: Select Lead and View Details

**Scenario:** BD clicks a lead to see details

**Setup:**
- Lead with name "Rajesh Kumar", score 82, source "YouTube", stage "Hot"
- Lead has 2 previous calls in history
- Lead has follow-up reason "Sent demo link - check if watched"

**Steps:**
1. User clicks on lead row for "Rajesh Kumar"

**Expected Results:**
- [ ] Side panel opens (slides in from right on desktop)
- [ ] Panel header shows "Rajesh Kumar"
- [ ] Panel shows score "82", source "YouTube", stage "Hot"
- [ ] Contact info section shows phone number as clickable link
- [ ] Contact info section shows email as clickable link
- [ ] "Call Now" button is visible
- [ ] Follow-up reason box shows "Sent demo link - check if watched"
- [ ] Call history shows 2 previous calls
- [ ] Outcome form is visible at bottom

---

### Flow 4: Log Outcome - Not Connected

**Scenario:** BD logs a call where lead did not pick up

**Steps:**
1. User has lead panel open
2. User clicks "Did not pick" in Call Result section
3. User sees retry time options appear
4. User clicks "In 1 hour"
5. User optionally types in Notes field
6. User clicks "Log Outcome"

**Expected Results:**
- [ ] "Did not pick" button shows selected state (ring highlight)
- [ ] Retry time options appear (animated slide-in)
- [ ] "In 1 hour" button shows selected state (amber highlight)
- [ ] "Log Outcome" button becomes enabled
- [ ] `onLogOutcome` is called with: `{ callResult: 'did_not_pick', retryTime: '1hour', notes: '...' }`
- [ ] Success toast appears: "Outcome logged successfully"
- [ ] After 500ms, panel shows next lead (or closes if last lead)

#### Failure Path: Missing Retry Time

**Steps:**
1. User clicks "Did not pick"
2. User does NOT select a retry time
3. User attempts to click "Log Outcome"

**Expected Results:**
- [ ] "Log Outcome" button is disabled (gray, not clickable)
- [ ] Form is not submitted

---

### Flow 5: Log Outcome - Connected

**Scenario:** BD logs a connected call with conversation outcome and next action

**Steps:**
1. User clicks "Connected" in Call Result section
2. User sees Conversation Outcome options appear
3. User clicks "Want to discuss with family" under Timing category
4. User sees Next Action options appear
5. User clicks "Schedule follow-up"
6. User sees date/time picker appear
7. User selects date "2024-01-15" and time "10:00"
8. User types "Will call after discussing with parents" in Notes
9. User clicks "Log Outcome"

**Expected Results:**
- [ ] "Connected" shows selected state (emerald highlight)
- [ ] Conversation Outcome section appears with categories
- [ ] "Want to discuss with family" shows selected state
- [ ] Next Action section appears
- [ ] "Schedule follow-up" shows selected state
- [ ] Date/time inputs appear
- [ ] Both inputs are required (form invalid without them)
- [ ] "Log Outcome" button is enabled after filling all required fields
- [ ] `onLogOutcome` called with complete data including `followUpDate` and `followUpTime`
- [ ] Success toast appears
- [ ] Auto-advances to next lead

#### Failure Path: Missing Conversation Outcome

**Steps:**
1. User clicks "Connected"
2. User does NOT select conversation outcome
3. User attempts to log

**Expected Results:**
- [ ] Next Action section is visible but "Log Outcome" is disabled
- [ ] Form requires conversation outcome before submission

---

### Flow 6: Number Incorrect

**Scenario:** BD marks a number as incorrect

**Steps:**
1. User clicks "Number Incorrect"

**Expected Results:**
- [ ] Warning message appears: "This lead will be marked as having an incorrect number and removed from the queue."
- [ ] No retry time or conversation outcome fields appear
- [ ] "Log Outcome" button is enabled
- [ ] `onLogOutcome` called with `{ callResult: 'number_incorrect' }`

---

### Flow 7: Close Won / Close Lost

**Scenario:** BD closes a lead as won

**Steps:**
1. User clicks "Connected"
2. User selects any conversation outcome
3. User clicks "Close Won"
4. User clicks "Log Outcome"

**Expected Results:**
- [ ] "Close Won" shows selected state (emerald highlight)
- [ ] No follow-up date/time is required
- [ ] `onLogOutcome` called with `{ callResult: 'connected', conversationOutcome: '...', nextAction: 'close_won' }`

---

## Empty State Tests

### Follow-ups Empty

**Scenario:** BD has no follow-ups due today

**Setup:**
- `followUpsDue` is empty array `[]`
- `newLeads` has some leads

**Expected Results:**
- [ ] "Follow-ups Due" tab shows no badge (or "0")
- [ ] List area shows empty state with checkmark icon
- [ ] Heading: "All caught up!"
- [ ] Message: "You've cleared all your follow-ups for today. Great work!"
- [ ] Switching to "New Leads" shows the leads list

### New Leads Empty

**Scenario:** No new leads available

**Setup:**
- `newLeads` is empty array `[]`

**Expected Results:**
- [ ] "New Leads" tab shows no badge (or "0")
- [ ] When tab is selected, shows empty state
- [ ] Heading: "No new leads"
- [ ] Message: "New leads will appear here when they come in."

### Both Empty

**Scenario:** Nothing in queue

**Setup:**
- Both arrays empty
- Stats show 0 remaining

**Expected Results:**
- [ ] Stats header shows "0" for Remaining
- [ ] Both tabs show empty states when selected

---

## Component Interaction Tests

### StatsHeader

**Renders correctly:**
- [ ] Shows 4 stat cards in a grid
- [ ] Each card has icon, value, and label
- [ ] Values use monospace font
- [ ] Colors match: slate for Calls Made, indigo for Connected, emerald for Follow-ups Cleared, amber for Remaining

### LeadRow

**Renders correctly:**
- [ ] Shows lead score with color coding
- [ ] Shows lead name truncated if too long
- [ ] Shows source badge with correct color
- [ ] Shows stage badge with correct color
- [ ] Shows follow-up reason (if present) with amber alert icon
- [ ] Shows last contact date if no follow-up

**User interactions:**
- [ ] Clicking row calls `onSelect` with lead ID
- [ ] Hovering shows Call button
- [ ] Clicking Call button calls `onCall` with lead ID
- [ ] Clicking Call button does NOT trigger row select (stopPropagation)

**Selected state:**
- [ ] Selected row has indigo background and left border

### LeadPanel

**Renders correctly:**
- [ ] Shows lead name, score, source, stage in header
- [ ] Close button (X) is visible
- [ ] Contact section shows phone and email as links
- [ ] "Call Now" button is prominent
- [ ] Follow-up reason box visible if lead has follow-up
- [ ] Call history shows previous calls

**Close behavior:**
- [ ] Clicking X button calls `onClose`
- [ ] On mobile, clicking overlay calls `onClose`

### OutcomeForm

**Form validation:**
- [ ] Initially, "Log Outcome" button is disabled
- [ ] Selecting call result updates button state based on requirements
- [ ] Missing required fields keep button disabled

**Conditional rendering:**
- [ ] Not-connected results show retry time picker
- [ ] Connected shows conversation outcome + next action
- [ ] Follow-up actions show date/time inputs
- [ ] Number incorrect shows warning message

---

## Edge Cases

- [ ] Very long lead names are truncated with ellipsis
- [ ] Lead with 0 calls shows no call history section (or "No previous calls")
- [ ] Lead with 10+ calls shows scrollable history
- [ ] Auto-advance after last lead closes panel instead of showing next
- [ ] Switching tabs while panel is open closes the panel
- [ ] Mobile: Panel appears as bottom sheet, not side panel
- [ ] Toast disappears after 2 seconds

---

## Accessibility Checks

- [ ] Call Result buttons are keyboard accessible
- [ ] Tab navigation works with arrow keys
- [ ] Form fields have associated labels
- [ ] Error states are announced to screen readers
- [ ] Close button has aria-label "Close"
- [ ] Mobile menu toggle has aria-label

---

## Sample Test Data

```typescript
// Stats
const mockStats = {
  callsMade: 12,
  connected: 5,
  followUpsCleared: 3,
  remainingInQueue: 9,
}

// Lead with follow-up
const mockLeadWithFollowUp = {
  id: 'lead-001',
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  email: 'rajesh.kumar@gmail.com',
  score: 82,
  source: 'YouTube',
  stage: 'Hot',
  lastContactDate: '2024-01-08',
  followUp: {
    id: 'fu-001',
    reason: 'Sent demo link - check if watched',
    dueDate: '2024-01-10',
    dueTime: '10:00',
    priority: 'high',
  },
  calls: [
    {
      id: 'call-001',
      date: '2024-01-08',
      time: '14:30',
      callResult: 'connected',
      conversationOutcome: 'call_back_later',
      nextAction: 'send_demo_link',
      notes: 'Interested in course',
    },
  ],
}

// New lead (no follow-up, no calls)
const mockNewLead = {
  id: 'lead-006',
  name: 'Ananya Reddy',
  phone: '+91 96543 21098',
  email: 'ananya.reddy@gmail.com',
  score: 91,
  source: 'App Install',
  stage: 'New',
  lastContactDate: null,
  calls: [],
}

// Empty state
const mockEmptyFollowUps = []
const mockEmptyNewLeads = []
```

---

## Notes for Test Implementation

- Mock `onLogOutcome`, `onSelectLead`, `onTabChange` callbacks to verify they're called with correct arguments
- Test the auto-advance behavior with timers/fake timers
- Verify toast appears and disappears after timeout
- Test mobile view separately (bottom sheet behavior)
- Form state should reset when selecting a different lead
