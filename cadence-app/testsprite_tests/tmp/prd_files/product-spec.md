# Cadence — Product Specification

**Last updated:** January 26, 2026

## 1. Overview
Cadence is a Sales Operating System for Indian educator and coaching businesses. It turns messy lead handling into a predictable conversion machine by combining software with SOPs, reminders, and visibility so teams stop losing revenue to chaos.

## 2. Target Users & Roles
- **BD (Business Development):** Works daily call queues, logs outcomes, manages follow-ups, updates lead stages.
- **Founder/Admin:** Monitors funnel performance, configures process, manages team and pipeline settings.

## 3. Problems to Solve
1. Follow-ups slip through the cracks → automated scheduling, reminders, and accountability.
2. BDs waste effort on low-intent leads → lead scoring + prioritization.
3. Founders lack daily visibility → funnel metrics and forecast dashboard.
4. No standardized sales process → stages, scripts, drop reasons embedded in tool.
5. Drop reasons not captured → analytics to improve scripts, offers, and targeting.

## 4. Product Goals
- Ensure no lead is lost due to missed follow-ups.
- Help BDs focus on the highest-intent leads first.
- Provide founders a daily, reliable view of the funnel and revenue outlook.
- Standardize the sales process across BDs with measurable outcomes.

## 5. Scope & Sections
1. **Today** — BD command center: follow-ups due, new leads, and outcome logging.
2. **Leads** — Full lead database with fast search, filters, side panel detail, and audit history.
3. **Dashboard** — Funnel visibility and drop reason analytics (role-based).
4. **Settings** — Pipeline/stage configuration, drop reasons, team management (admin only).

## 6. Core Workflows
### 6.1 Today (BD Workflow)
- View daily stats: calls made, connected, follow-ups cleared, remaining in queue.
- Work through tabbed lists: Follow-ups Due and New Leads.
- Open a lead side panel for details and call history.
- Log call outcome using adaptive form:
  - **Not Connected** → retry time required.
  - **Number Incorrect** → mark bad number and remove from queue.
  - **Connected** → conversation outcome + next action required.
- Save, show confirmation toast, auto-advance to next lead.

### 6.2 Leads (Database + Outcome Capture)
- Search by name/phone/notes in seconds.
- Filter via quick chips and advanced filter drawer.
- Open side panel to review details and log outcomes inline.
- Enforce next action for connected calls or link sends (unless closing Won/Lost).
- Support bulk actions (assign, qualify, mark bad, export) with admin-only bulk stage changes.
- Merge duplicates with confirmation and retained history.

### 6.3 Dashboard (Founder/BD Insights)
- View funnel stats (Calls → Connected → Hot → Conversions).
- Date range selector for today/week/month/custom.
- Drop reason breakdown chart.
- Click any metric or chart segment to jump to Leads with filters applied.
- Role-based filters for founders/admins (BD, Source, Pipeline, Stage).

### 6.4 Settings (Process Configuration)
Tabs: Pipelines | Drop Reasons | Team
- **Pipelines & Stages:** Create/edit/reorder stages, define stage type (open/won/lost), mark Hot stages.
- **Drop Reasons:** CRUD with categories; required when lead moves to Lost stage.
- **Team Management:** Add/deactivate users, assign roles and pipelines.

## 7. Data Model (Core Entities)
- **Lead** — Score, qualification, stage, source, owner, and status details.
- **Call** — Outcome, duration, notes, and caller (BD).
- **FollowUp** — Due date/time, reason, and completion status.
- **Stage** — Pipeline step with type (open/won/lost), order, and hot indicator.
- **DropReason** — Reason captured on Lost; used in analytics.
- **User** — BD or Founder/Admin with role-based permissions.
- **Source** — Origin channel (e.g., YouTube, WhatsApp, Referral, Paid).

### Key Relationships
- Lead has many Calls and FollowUps.
- Lead belongs to one Stage, Source, and optionally DropReason.
- Call belongs to Lead and User.
- FollowUp belongs to Lead and User.

## 8. Roles & Permissions
- **BD:** Access Today, Leads, own metrics in Dashboard.
- **Founder/Admin:** Access all sections; full filters; Settings access.
- **Settings:** Restricted to Founder/Admin only.

## 9. Functional Requirements (Highlights)
### Today
- Adaptive outcome form with required fields.
- Auto-advance to next lead after logging.
- Two lead queues: Follow-ups Due and New Leads.

### Leads
- Quick filters + advanced filter drawer.
- Side panel with above-the-fold summary + full timeline.
- Inline log call flow with toast confirmation.
- Duplicate detection and merge workflow.
- Bulk actions and CSV export.

### Dashboard
- Funnel metrics stat cards and drop reason chart.
- Drilldown to Leads with pre-applied filters.
- Date selector available to all; advanced filters for founders/admins only.

### Settings
- Pipeline selector with drag-and-drop stage ordering.
- Validation: exactly one won and one lost stage per pipeline.
- Drop reason management with categories and active/inactive toggles.
- Team management with role and pipeline assignment.

## 10. Design & UX Requirements
- **Responsive**: Mobile, tablet, and desktop layouts.
- **Light/Dark Mode**: All UI elements visible in both modes.
- **Shell**: Sidebar nav with Today, Leads, Dashboard, Settings; user menu at bottom.
- **Design Tokens (Product):**
  - Colors: primary `indigo`, secondary `amber`, neutral `slate`
  - Typography: heading/body `Inter`, mono `JetBrains Mono`

## 11. Analytics & Reporting
- Funnel metrics derived from Calls and Stage transitions.
- Drop reason analytics grouped by reason with an "Unknown" bucket if missing.
- Drilldowns from Dashboard to Leads with filter context.

## 12. Out of Scope (Deferred)
- Lead scoring rules configuration (v2).
- Sales scripts/playbooks configuration (v2).
- Calling inside Cadence (calls are external; Cadence logs outcomes).

## 13. Assumptions
- Each pipeline must have exactly one Won and one Lost stage.
- Follow-ups are the primary SLA mechanism for lead movement.
- Duplicate detection is based on normalized phone number.
