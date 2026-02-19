# Leads Section — Test Instructions

Use these test cases when writing automated tests (any framework) or performing manual QA.

---

## 1. Search & Filter

### 1.1 Full-Text Search
**Setup**: Render LeadsView with sample leads data

**Test: Search by name**
1. Type "Rajesh" in search box
2. Verify only leads with "Rajesh" in name are displayed
3. Clear search
4. Verify all leads are displayed again

**Test: Search by phone**
1. Type "9876" in search box
2. Verify leads with matching phone numbers appear
3. Partial matches should work (searching "987" matches "9876543210")

**Test: Search by notes**
1. Type "demo" in search box
2. Verify leads with "demo" in their timeline notes appear

**Test: Search empty results**
1. Type "xyznonexistent" in search box
2. Verify empty state with "No leads found" message
3. Verify "Try adjusting your filters" hint is shown

### 1.2 Quick Filters
**Setup**: Render LeadsView with various lead states

**Test: Filter toggles**
1. Click "My Leads" chip
2. Verify chip shows active state (indigo ring)
3. Verify only current user's leads are displayed
4. Click "My Leads" again
5. Verify chip deactivates and all leads return

**Test: Filter counts**
1. Verify each quick filter chip shows correct count
2. Verify "Overdue" count matches leads with past-due next actions
3. Verify "Hot" count matches leads with stage = "Hot"
4. Verify "New" count matches leads with stage = "New"
5. Verify "Unassigned" count matches leads with no owner

**Test: Filter mutual exclusivity**
1. Click "Hot" filter
2. Click "New" filter
3. Verify "Hot" is deselected, only "New" is active
4. Only one quick filter can be active at a time

**Test: Admin-only filters**
1. Render with isAdmin = false
2. Verify "Unassigned" and "Lost 7d" chips are not visible
3. Render with isAdmin = true
4. Verify both chips are visible

---

## 2. Lead Table

### 2.1 Table Display
**Test: Column visibility**
1. Verify all columns are visible: Lead, Score, Source, Stage, Qualification, Next Action, Last Touch, Owner
2. Verify table is horizontally scrollable on narrow screens

**Test: Score color coding**
1. Lead with score >= 80: verify emerald/green color
2. Lead with score 60-79: verify amber/yellow color
3. Lead with score < 60: verify slate/gray color

**Test: Source badges**
1. YouTube lead: verify red badge
2. WhatsApp Group lead: verify green badge
3. App Install lead: verify indigo badge
4. Referral lead: verify purple badge
5. Paid Ad lead: verify amber badge

**Test: Stage chips**
1. New lead: verify slate chip
2. Contacted lead: verify blue chip
3. Hot lead: verify orange chip
4. Demo Scheduled: verify indigo chip
5. Won lead: verify emerald chip
6. Lost lead: verify red chip

**Test: Bad number indicator**
1. Lead with bad_number flag: verify row is dimmed (opacity-60)
2. Verify red "Bad number" label with warning icon appears

**Test: Next action display**
1. Lead with future next action: verify time displayed (e.g., "In 2h")
2. Lead with overdue next action: verify red color and "overdue" text
3. Lead with no next action: verify "—" is displayed

**Test: Owner display**
1. Lead with owner: verify avatar initial and first name shown
2. Lead without owner: verify "Unassigned" in italic

### 2.2 Row Selection
**Test: Single row click**
1. Click a lead row
2. Verify row shows selected state (indigo background)
3. Verify side panel opens with that lead's details
4. Click another row
5. Verify selection moves to new row

**Test: Checkbox selection**
1. Click checkbox (not row) on a lead
2. Verify checkbox is checked
3. Verify row is NOT selected for detail view
4. Verify bulk actions bar appears

**Test: Select all**
1. Click header checkbox
2. Verify all lead checkboxes are checked
3. Verify bulk actions bar shows correct count
4. Click header checkbox again
5. Verify all checkboxes are unchecked

---

## 3. Side Panel

### 3.1 Header Section
**Test: Lead info display**
1. Open side panel for a lead
2. Verify name is displayed as heading
3. Verify score with appropriate color
4. Verify source badge
5. Verify stage chip
6. Verify phone number with copy button

**Test: Copy phone**
1. Click copy button next to phone
2. Verify success indicator (checkmark)
3. Verify phone is copied to clipboard

**Test: Owner editing**
1. Click owner name with edit icon
2. Verify dropdown appears with all users
3. Select different user
4. Verify onChangeOwner callback is called
5. Verify success toast appears

**Test: Qualification editing**
1. Click qualification with edit icon
2. Verify dropdown with Qualified/Unknown/Unqualified
3. Select different qualification
4. Verify onChangeQualification callback is called

### 3.2 Next Action Display
**Test: Pending next action**
1. Open lead with next action
2. Verify amber background section shows next action reason
3. Verify due date and time are displayed

**Test: No next action**
1. Open lead without next action
2. Verify next action section is not displayed

### 3.3 Quick Actions
**Test: Log Call button**
1. Click "Log Call" button
2. Verify OutcomeForm expands inline below header
3. Click "Log Call" again
4. Verify form collapses

**Test: WhatsApp button**
1. Click "WhatsApp" button
2. Verify window.open is called with wa.me link
3. Verify phone number is included in URL (with 91 prefix)

**Test: Schedule button**
1. Click "Schedule" button
2. Verify onScheduleFollowUp callback is called

**Test: Send Link menu**
1. Click "Send Link" button
2. Verify dropdown with Demo link, Payment link, Syllabus PDF
3. Click "Demo link"
4. Verify onLogLinkSent callback is called with 'demo'
5. Verify success toast

### 3.4 Activity Timeline
**Test: Timeline display**
1. Open lead with multiple timeline events
2. Verify most recent 3 events are shown
3. Verify "View all (N)" button if more than 3 events

**Test: Timeline expansion**
1. Click "View all" button
2. Verify all timeline events are displayed
3. Click "Show less"
4. Verify only 3 events shown again

**Test: Call event display**
1. Verify connected calls show PhoneCall icon (green)
2. Verify not-connected calls show PhoneMissed icon (gray)
3. Verify call result label is shown
4. Verify conversation outcome is shown (if connected)
5. Verify notes are shown (if present)
6. Verify user name is shown

**Test: Link sent event**
1. Verify Link2 icon (indigo)
2. Verify link type label (e.g., "Demo link sent")
3. Verify date and time

**Test: Stage change event**
1. Verify ArrowRight icon
2. Verify "Stage: [From] → [To]" format
3. Verify reason if present

### 3.5 Lead Details
**Test: Extra fields display**
1. Verify Exam field
2. Verify Attempt field
3. Verify City field
4. Verify Language field

### 3.6 Stage Change
**Test: Stage dropdown**
1. Click stage dropdown
2. Verify all stages are shown
3. Verify current stage is indicated with checkmark
4. Verify current stage button is disabled

**Test: Stage change**
1. Select different stage
2. Verify onMoveStage callback is called
3. Verify success toast

### 3.7 Bottom Actions
**Test: Open full profile**
1. Click "Open full profile"
2. Verify onOpenFullProfile callback is called

**Test: Mark bad number**
1. Click "Mark as bad number"
2. Verify onMarkBadNumber callback is called
3. Verify success toast

---

## 4. Outcome Form

### 4.1 Call Result Selection
**Test: Initial state**
1. Verify no call result is selected
2. Verify "Log Outcome" button is disabled

**Test: Call result selection**
1. Click "Connected" button
2. Verify button shows selected state (emerald ring)
3. Verify Conversation Outcome section appears
4. Verify Next Action section appears

**Test: Not-connected results**
1. Click "Did not pick"
2. Verify Retry Time section appears
3. Verify Conversation Outcome section does NOT appear

**Test: Number incorrect**
1. Click "Number incorrect"
2. Verify red warning message appears
3. Verify no retry time or outcome sections

### 4.2 Conversation Outcome (when Connected)
**Test: Category display**
1. Verify outcomes are grouped by category
2. Verify category headers: Intent/Fit, Timing, Competition, Pricing, Customer State

**Test: Outcome selection**
1. Click an outcome (e.g., "Just browsing")
2. Verify pill shows selected state (indigo ring)
3. Click different outcome
4. Verify only one is selected

### 4.3 Next Action Selection
**Test: Action buttons**
1. Verify all 6 action options are displayed
2. Send demo link: indigo selected state
3. Send payment link: indigo selected state
4. Send syllabus link: indigo selected state
5. Schedule follow-up: indigo selected state
6. Close Won: emerald selected state
7. Close Lost: red selected state

**Test: Follow-up required**
1. Select "Send demo link"
2. Verify date/time picker section appears
3. Verify form is invalid until date and time are entered

### 4.4 Close Lost Flow
**Test: Loss reason required**
1. Select "Close Lost"
2. Verify Loss Reason section appears
3. Verify form is invalid until reason selected
4. Select a reason
5. Verify form becomes valid

### 4.5 Close Won Flow
**Test: Won details**
1. Select "Close Won"
2. Verify Course and Amount fields appear
3. Fields are optional (recommended)
4. Verify form is valid without entering values

### 4.6 Retry Time (Not Connected)
**Test: Retry options**
1. Click "Did not pick"
2. Verify retry time options: 30min, 1hour, 2hours, tomorrow morning, tomorrow afternoon, custom
3. Select "In 1 hour"
4. Verify amber selected state

### 4.7 Form Submission
**Test: Valid submission**
1. Complete all required fields
2. Click "Log Outcome"
3. Verify onSubmit callback receives complete OutcomeFormData
4. Verify form closes
5. Verify success toast

**Test: Cancel**
1. Fill some fields
2. Click "Cancel"
3. Verify form closes
4. Verify no callback is fired

---

## 5. Bulk Actions

### 5.1 Selection UI
**Test: Bulk bar appears**
1. Check one lead
2. Verify bulk actions bar appears with "[N] selected"
3. Check another lead
4. Verify count updates

**Test: Clear selection**
1. Select multiple leads
2. Click "Clear"
3. Verify all checkboxes unchecked
4. Verify bulk bar disappears

### 5.2 Bulk Assign
**Test: Assign dropdown**
1. Select leads
2. Click "Assign" button
3. Verify dropdown with all users
4. Select a user
5. Verify onBulkAssign callback with leadIds and ownerId
6. Verify success toast with count
7. Verify selection is cleared

### 5.3 Bulk Qualify
**Test: Qualify dropdown**
1. Select leads
2. Click "Qualify" button
3. Verify dropdown with Qualified/Unknown/Unqualified
4. Select option
5. Verify onBulkQualify callback
6. Verify selection cleared

### 5.4 Bulk Mark Bad Number
**Test: Mark bad number**
1. Select leads
2. Click "Bad #" button
3. Verify onBulkMarkBadNumber callback
4. Verify success toast

### 5.5 Export Selected
**Test: Export**
1. Select leads
2. Click "Export" button
3. Verify onExportSelected callback with lead IDs

---

## 6. Mobile Responsiveness

### 6.1 Table Behavior
**Test: Horizontal scroll**
1. View on mobile viewport (< 1024px)
2. Verify table is horizontally scrollable
3. Verify all columns accessible via scroll

### 6.2 Bottom Sheet
**Test: Mobile detail view**
1. View on mobile viewport
2. Tap a lead row
3. Verify bottom sheet slides up from bottom
4. Verify max height is 90vh
5. Verify sheet is scrollable

**Test: Backdrop dismiss**
1. Open bottom sheet
2. Tap dark backdrop
3. Verify sheet closes

---

## 7. Empty States

**Test: No leads**
1. Render with empty leads array
2. Verify empty state with search icon
3. Verify "No leads found" message
4. Verify "Try adjusting your filters" hint

**Test: No timeline**
1. Open lead with empty timeline
2. Verify "No activity yet" message

---

## 8. Accessibility

**Test: Keyboard navigation**
1. Tab through filter chips
2. Verify focus indicators visible
3. Enter/Space to activate filters

**Test: Checkbox labels**
1. Verify checkboxes have proper focus states
2. Verify checkbox can be toggled with keyboard

**Test: Color contrast**
1. Verify all text meets WCAG AA contrast
2. Test in dark mode
