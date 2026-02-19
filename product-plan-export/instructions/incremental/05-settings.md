# Milestone 5: Settings

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-4 complete

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
- **DO** implement empty states when no records exist
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement the Settings feature for pipelines, drop reasons, and team management.

## Overview

Settings is an admin-only area for configuring sales process data. It provides a tabbed interface with panels for:
- Pipelines and stages
- Drop reasons
- Team members

BD users without permission should see an access restricted state.

## Recommended Approach: Test-Driven Development

Before implementing, write tests based on:
- `product-plan-export/sections/settings/tests.md`

## What to Implement

### Components

Copy components from `product-plan-export/sections/settings/components/`:
- `SettingsView.tsx`
- `PipelinePanel.tsx`
- `StageList.tsx`
- `DropReasonPanel.tsx`
- `TeamPanel.tsx`

### Data Layer

You will need API endpoints for:
- Pipelines (list, create, edit, archive, set default)
- Stages (list, create, edit, archive, reorder)
- Drop reasons (list, create, edit, toggle active)
- Users (list, invite, edit, deactivate/reactivate)

### Validation Rules

- Each pipeline must have exactly one Won and one Lost stage
- Default pipeline changes should trigger confirmation
- Won/Lost stages should not be archived

### Callbacks

Wire up these actions:

| Callback | Backend Action |
|----------|---------------|
| `onTabChange` | Update active tab
| `onSelectPipeline` | Load pipeline stages
| `onCreatePipeline` | Open create pipeline flow
| `onEditPipeline` | Open edit pipeline flow
| `onArchivePipeline` | Archive pipeline (soft delete)
| `onSetDefaultPipeline` | Set default pipeline
| `onCreateStage` | Open create stage flow
| `onEditStage` | Open edit stage flow
| `onArchiveStage` | Archive stage
| `onReorderStages` | Persist new stage order
| `onCreateDropReason` | Open create drop reason flow
| `onEditDropReason` | Open edit drop reason flow
| `onToggleDropReasonActive` | Activate/deactivate reason
| `onInviteUser` | Invite a new team member
| `onEditUser` | Edit user details and assignments
| `onDeactivateUser` | Deactivate user (soft delete)
| `onReactivateUser` | Reactivate user

### Empty States

- No pipelines (prompt to create first pipeline)
- No stages in selected pipeline
- No active drop reasons
- No active team members

## Files to Reference

- `product-plan-export/sections/settings/README.md` — Feature overview
- `product-plan-export/sections/settings/tests.md` — Test instructions
- `product-plan-export/sections/settings/components/` — React components
- `product-plan-export/sections/settings/types.ts` — TypeScript interfaces
- `product-plan-export/sections/settings/sample-data.json` — Sample data
- `product-plan-export/sections/settings/settings.png` — Visual reference

## Expected User Flows

### Flow 1: Access Control
1. Founder/admin opens Settings
2. Tabs render and default to Pipelines
3. BD without access sees restricted state

### Flow 2: Manage Pipelines
1. Select a pipeline from list
2. View stages and validation warnings
3. Create or edit stages
4. Set a pipeline as default

### Flow 3: Manage Drop Reasons
1. View active and inactive reasons
2. Toggle active state
3. Create or edit reasons

### Flow 4: Manage Team
1. View active and deactivated users
2. Invite new member
3. Edit or deactivate user

## Done When

- [ ] Tests written for key flows and edge cases
- [ ] Access control state renders correctly
- [ ] Tabs switch and show correct panel
- [ ] Pipeline actions and validation work
- [ ] Drop reason toggles work
- [ ] Team management actions trigger callbacks
- [ ] Responsive layout works for mobile and desktop
