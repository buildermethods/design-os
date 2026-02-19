# Leads Specification

## Overview
The full lead database where BDs and founders can find any lead in seconds, understand their status at a glance, log outcomes from external calls, audit history, and clean data. Optimized for fast scanning with a side panel for details. Calling happens outside Cadence; Cadence captures outcomes.

## User Flows
- Search and find a lead by name/phone/notes in <10 seconds
- Filter leads using quick chips (My Leads, Overdue, Due Today, Hot, New, Unassigned, Lost 7d) or advanced filters
- Click a lead to open side panel → see key info above the fold → decide + act in 5 seconds
- Log Call opens 3-layer disposition form inline in side panel; after save shows toast and stays on lead (lookup flow, not queue flow)
- Log "Send link" (demo/payment/syllabus) → system requires next action (unless closing Won/Lost)
- If BD logs Connected OR Send link OR moves to Follow-up → system requires next action (unless closing Won/Lost)
- For not-connected calls, system forces retry time (same as Today logic)
- Move stage with conditional requirements (Lost → reason required, Won → course + amount, Follow-up → time required)
- Edit lead details (phone, owner, qualification) from side panel
- Mark number as incorrect → moves to Bad Number, removes from queue
- Bulk select leads → assign owner, set qualification, mark bad number, export
- Bulk stage move / bulk close lost (Admin-only, requires confirmation + reason)
- Export current filtered view or selected leads as CSV
- Merge duplicates: review + confirm flow, choose primary record, histories retained, merged record archived (not deleted)

## UI Requirements
- List view columns: Lead (name + phone), Score, Source (badge), Stage (chip), Qualification, Next action (scheduled task due time or "—"), Last touch, Owner
- Top bar: Search left, quick filter chips below (My Leads, Overdue, Due Today, Hot, New, Unassigned, Lost 7d)
- "More filters" opens advanced filter drawer:
  - Lead meta: Source, Stage, Owner, Qualification
  - Time-based: Next action due, Last contacted, Created date
  - Outcome-based: Last conversation outcome, Call result
  - Flags: Bad number, Already customer
- Side panel on lead click: above fold shows key info + quick actions (Log Call, WhatsApp, Schedule, Send link), below fold has full timeline, stage history, notes, extra fields
- Log Call: 3-layer disposition form opens inline in side panel; after save shows toast and stays on current lead
- "Open full profile" link for deep dive (optional full-page view)
- Phone auto-validation: normalize on save (strip spaces/dashes/+91), warn if not 10 digits
- Duplicate prevention: if canonical phone exists, update existing lead (append source, recompute score, add audit event) instead of creating new
- Ownership on duplicate update: if existing lead has owner → keep owner; if unassigned → assign based on current user/import rule
- Phone edit warns if number matches another lead → offer merge
- Manual merge hidden as safety net (not prominent in UI)
- Bulk actions toolbar on multi-select: Assign owner, Set qualification, Mark bad number, Export selected
- Admin-only bulk actions: Move stage, Close lost (with confirmation + reason)

## Configuration
- shell: true
