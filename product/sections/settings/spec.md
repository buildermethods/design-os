# Settings Specification

## Overview
Administrative configuration for founders and admins to customize the sales process. Includes pipeline/stage management, drop reason configuration, and team management with role-based access. Settings are **global** (not pipeline-contextual) — users must explicitly select a pipeline to configure it. Navigation via horizontal tabs. Uses side drawers for create/edit flows.

## MVP Scope
1. **Pipelines & Stages** — Create/edit pipelines and configure stages
2. **Drop Reasons** — CRUD for drop reasons with categories and active/inactive toggle
3. **Team Management** — Add/deactivate users, assign roles, assign pipelines per BD

## Deferred to v2
- Lead Scoring Rules
- Scripts (Sales Playbook)

## User Flows

### Pipelines & Stages
- View list of pipelines → Select one → See stage list
- Add/edit/reorder stages within a pipeline (drag & drop)
- Configure stage properties: name, order, color, type, "Hot" toggle
- **Stage type enum:** `open` | `won` | `lost`
  - Multiple `open` stages allowed
  - Exactly one `won` stage required per pipeline
  - Exactly one `lost` stage required per pipeline
- Mark stages as Hot (drives Hot Leads metric on Dashboard)
- Archive stages (soft delete) instead of hard delete
- **Default pipeline:** One pipeline must be marked as default
  - New leads default to this pipeline unless specified
  - New BDs auto-assigned to default pipeline (editable)
  - Changing default triggers confirmation modal: "Changing the default pipeline will affect where new leads are created. Existing leads will not be changed."
- **System rules hint:** Display info text: "Each pipeline must have exactly one Won and one Lost stage. These stages power conversion and drop analytics."

### Drop Reasons
- View table of drop reasons with category, status, usage count
- Add new drop reason via side drawer
- Edit/deactivate drop reasons (soft delete to preserve history)
- Categorize: Pricing | Timing | Eligibility | Competitor | No Response | Other
- **Required on Lost:** When a lead moves to a `lost` stage, drop reason is mandatory
  - If reason is missing (edge case), bucket as "Unknown" in analytics

### Team Management
- View table of users (Name, Role, Status, Assigned Pipelines)
- Add new user (BD or Admin role) via side drawer
- Edit user details, assign/unassign pipelines
- Deactivate users (soft delete)
- **Deactivated users:**
  - Cannot log in
  - Remain visible in historical reports and analytics
  - Leads owned by deactivated users remain assigned (reassignment is v2)

## UI Requirements
- Horizontal tab bar: Pipelines | Drop Reasons | Team
- Side drawer for all create/edit forms
- Role-gated: Only Founder/Admin can access Settings (BDs redirected or see nothing)
- Pipeline selector dropdown to choose which pipeline to configure
- Pipeline stage list with drag-and-drop reordering
- Stage type selector (open/won/lost) with validation indicators
- Validation: Warn while editing if missing won/lost stage; hard block on save
- Default pipeline indicator (star or badge) with ability to change + confirmation modal
- System rules info text under stage editor explaining won/lost requirement
- Drop reason table with Active toggle and usage count column
- Team table with role badges and pipeline assignment chips

## Configuration
- shell: true
