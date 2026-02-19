# Test Instructions: Settings Section

These test-writing instructions are framework-agnostic. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, etc.).

## Overview

The Settings section supports role-based access and three configuration panels: Pipelines, Drop Reasons, and Team. Tests should validate access control, tab switching, list rendering, and callback behavior.

---

## Access Control

### Access Restricted State

**Setup:** `currentUser.permissions.canAccessSettings = false`

**Expected Results:**
- [ ] "Access Restricted" title is visible
- [ ] Message reads "Only founders and admins can access settings"
- [ ] Tabs and panels are not rendered

---

## Tab Navigation

### Switch Tabs

**Setup:** `ui.activeTab = 'pipelines'`

**Steps:**
1. Click "Drop Reasons" tab
2. Click "Team" tab

**Expected Results:**
- [ ] `onTabChange('dropReasons')` is called
- [ ] `onTabChange('team')` is called
- [ ] Active tab has highlighted styling

---

## Pipelines Panel

### Pipeline List and Selection

**Setup:** Multiple pipelines, one default

**Expected Results:**
- [ ] Default pipeline shows "Default" badge
- [ ] Clicking a pipeline calls `onSelectPipeline(pipelineId)`
- [ ] Selected pipeline row uses highlighted background

### Pipeline Actions (Manage Enabled)

**Setup:** `canManage = true`

**Expected Results:**
- [ ] "Add" button calls `onCreatePipeline`
- [ ] "Edit" button calls `onEditPipeline`
- [ ] "Archive" button is hidden for default pipeline
- [ ] "Set as Default" button appears for non-default pipeline and calls `onSetDefaultPipeline`

### Validation Warning

**Setup:** Selected pipeline missing a Won or Lost stage

**Expected Results:**
- [ ] Warning banner is visible
- [ ] Missing stage types are listed (Won/Lost)

### Stage List Rendering

**Expected Results:**
- [ ] Stages are sorted by `order`
- [ ] Stage color dot matches `stage.color`
- [ ] Hot stages show "Hot" badge
- [ ] Stage type badge shows Open/Won/Lost

### Stage Actions

**Setup:** `canManage = true`

**Expected Results:**
- [ ] Edit stage button calls `onEditStage(stageId)`
- [ ] Archive button hidden for Won/Lost stages
- [ ] Archive button calls `onArchiveStage(stageId)` for Open stages

### Reorder Stages

**Steps:**
1. Click the reorder handle

**Expected Results:**
- [ ] `onReorderStages(pipelineId, stageIds)` is called

### Empty States

- [ ] No pipelines shows "No pipelines yet" and "Create your first pipeline" action
- [ ] No selected pipeline shows "Select a pipeline" empty state
- [ ] No stages shows "No stages configured" message

---

## Drop Reasons Panel

### Active Reasons

**Expected Results:**
- [ ] Active table shows Reason, Category, Usage, Status
- [ ] Category badge color matches category
- [ ] Toggle calls `onToggleDropReasonActive(reasonId, false)` when clicked
- [ ] Edit action calls `onEditDropReason(reasonId)`

### Inactive Reasons

**Expected Results:**
- [ ] Inactive table shows Reason, Category, Historical Usage, Status
- [ ] Toggle calls `onToggleDropReasonActive(reasonId, true)` when clicked

### Empty State

**Setup:** `dropReasons = []`

**Expected Results:**
- [ ] "No active drop reasons" message is visible
- [ ] "Add your first reason" link appears when `canManage = true`

---

## Team Panel

### Active Members

**Expected Results:**
- [ ] Active members list shows name, email, role badge
- [ ] Role badge color matches role
- [ ] Assigned pipelines show chips (or "No pipelines assigned")
- [ ] Invite button calls `onInviteUser`
- [ ] Edit user button calls `onEditUser(userId)`
- [ ] Deactivate button hidden for founders

### Deactivated Members

**Expected Results:**
- [ ] Inactive list shows members with reduced opacity
- [ ] Reactivate button calls `onReactivateUser(userId)`

### Empty State

**Setup:** `activeUsers = []`

**Expected Results:**
- [ ] "No active team members" message is visible

---

## Accessibility Checks

- [ ] Tabs are keyboard focusable
- [ ] Buttons have visible focus styles
- [ ] Toggle buttons are keyboard accessible
- [ ] Empty state actions are reachable via keyboard

---

## Sample Test Data

```typescript
const currentUser = {
  id: 'user-001',
  name: 'Arjun Mehta',
  email: 'arjun@cadence.io',
  role: 'founder',
  permissions: {
    canAccessSettings: true,
    canManagePipelines: true,
    canManageDropReasons: true,
    canManageUsers: true,
  },
}

const pipelines = [
  { id: 'pipe-001', name: 'NEET Coaching', description: 'Medical entrance exam', isDefault: true, stageIds: ['stage-001'], createdAt: '2024-01-01', archivedAt: null },
]

const stages = [
  { id: 'stage-001', pipelineId: 'pipe-001', name: 'New', type: 'open', order: 1, color: 'slate', isHot: false, archivedAt: null },
  { id: 'stage-002', pipelineId: 'pipe-001', name: 'Won', type: 'won', order: 2, color: 'emerald', isHot: false, archivedAt: null },
  { id: 'stage-003', pipelineId: 'pipe-001', name: 'Lost', type: 'lost', order: 3, color: 'rose', isHot: false, archivedAt: null },
]

const dropReasons = [
  { id: 'dr-001', reason: 'Price too high', category: 'pricing', isActive: true, usageCount: 8, archivedAt: null },
  { id: 'dr-002', reason: 'Not the right time', category: 'timing', isActive: false, usageCount: 5, archivedAt: '2024-01-10' },
]

const users = [
  { id: 'user-002', name: 'Priya Sharma', email: 'priya@cadence.io', role: 'bd', isActive: true, assignedPipelineIds: ['pipe-001'], createdAt: '2024-01-01', deactivatedAt: null },
  { id: 'user-003', name: 'Rahul Verma', email: 'rahul@cadence.io', role: 'admin', isActive: false, assignedPipelineIds: [], createdAt: '2024-01-01', deactivatedAt: '2024-02-01' },
]
```
