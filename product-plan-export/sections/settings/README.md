# Settings Section

## Overview

The Settings section lets founders and admins configure pipelines, stages, drop reasons, and team members. It uses a tabbed layout with panels for each configuration area and role-based access controls.

## User Flows

1. User opens Settings and sees tabs for Pipelines, Drop Reasons, and Team.
2. User selects a pipeline to view and manage its stages.
3. User updates stages, sets default pipeline, or triggers a reorder.
4. User manages drop reasons (create, edit, activate/deactivate).
5. User manages team members (invite, edit, deactivate/reactivate).
6. BD users without permission see an access restricted state.

## Components Provided

| Component | Description |
|-----------|-------------|
| `SettingsView` | Main view with tabs, access control, and panel rendering |
| `PipelinePanel` | Pipeline list and stage configuration panel |
| `StageList` | Stage list with color, type badges, and reorder action |
| `DropReasonPanel` | Drop reason tables with active/inactive toggles |
| `TeamPanel` | Team member list with role badges and pipeline chips |

## Data Used

**From props:**
- `currentUser` - Includes permissions for access and management
- `ui` - Active tab and selected pipeline
- `pipelines` - Pipeline definitions
- `stages` - All stages across pipelines
- `dropReasons` - Drop reason list with usage counts
- `users` - Team members and roles
- `systemRules` - Informational hints for validation

## Callback Props

| Callback | Description |
|----------|-------------|
| `onTabChange` | Called when a tab is selected |
| `onSelectPipeline` | Called when a pipeline is selected |
| `onCreatePipeline` | Called to start pipeline creation |
| `onEditPipeline` | Called to edit a pipeline |
| `onArchivePipeline` | Called to archive a pipeline |
| `onSetDefaultPipeline` | Called to set a pipeline as default |
| `onCreateStage` | Called to create a stage in a pipeline |
| `onEditStage` | Called to edit a stage |
| `onArchiveStage` | Called to archive a stage |
| `onReorderStages` | Called when stages are reordered |
| `onCreateDropReason` | Called to create a drop reason |
| `onEditDropReason` | Called to edit a drop reason |
| `onToggleDropReasonActive` | Called to activate/deactivate a reason |
| `onInviteUser` | Called to invite a team member |
| `onEditUser` | Called to edit a user |
| `onDeactivateUser` | Called to deactivate a user |
| `onReactivateUser` | Called to reactivate a user |

## Visual Reference

See `settings.png` for the target UI design.

## Empty States

- **No pipelines:** Empty list with "Create your first pipeline" action
- **No stages:** Prompt to add stages
- **No active drop reasons:** Empty message with add action
- **No active team members:** Empty message

## Design Notes

- Tabs are rendered in the Settings header and control panel visibility.
- Stage reorder is triggered via a drag-handle button (callback fired with IDs).
- Terminal stages (Won/Lost) cannot be archived.
- Side drawers for create/edit are implied in callbacks (not implemented in UI).
