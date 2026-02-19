import { useState } from 'react'
import data from '@/sections/settings/sample-data.json'
import { SettingsView } from '@/sections/settings/components/SettingsView'
import {
  DropReasonModal,
  EditUserModal,
  InviteUserModal,
  PipelineModal,
  StageModal,
} from '@/sections/settings/components/SettingsModals'
import type {
  CurrentUser,
  DropReason,
  DropReasonFormData,
  Pipeline,
  PipelineFormData,
  SettingsProps,
  SettingsUIState,
  Stage,
  StageFormData,
  SystemRules,
  User,
  UserRole,
} from '@/sections/settings/types'

// ---------------------------------------------------------------------------
// Modal state types
// ---------------------------------------------------------------------------
type PipelineModalState = { open: false } | { open: true; mode: 'create' } | { open: true; mode: 'edit'; pipelineId: string }
type StageModalState = { open: false } | { open: true; mode: 'create'; pipelineId: string } | { open: true; mode: 'edit'; stageId: string; pipelineId: string }
type DropReasonModalState = { open: false } | { open: true; mode: 'create' } | { open: true; mode: 'edit'; dropReasonId: string }
type UserModalState = { open: false } | { open: true }
type EditUserModalState = { open: false } | { open: true; userId: string }

export function SettingsPage() {
  const currentUser = data.currentUser as CurrentUser
  const systemRules = data.systemRules as SystemRules

  const [ui, setUi] = useState<SettingsUIState>(data.ui as SettingsUIState)
  const [pipelines, setPipelines] = useState<Pipeline[]>(data.pipelines as Pipeline[])
  const [stages, setStages] = useState<Stage[]>(data.stages as Stage[])
  const [dropReasons, setDropReasons] = useState<DropReason[]>(data.dropReasons as DropReason[])
  const [users, setUsers] = useState<User[]>(data.users as User[])

  // Modal state
  const [pipelineModal, setPipelineModal] = useState<PipelineModalState>({ open: false })
  const [stageModal, setStageModal] = useState<StageModalState>({ open: false })
  const [dropReasonModal, setDropReasonModal] = useState<DropReasonModalState>({ open: false })
  const [inviteModal, setInviteModal] = useState<UserModalState>({ open: false })
  const [editUserModal, setEditUserModal] = useState<EditUserModalState>({ open: false })

  // ---------------------------------------------------------------------------
  // Tab / pipeline selection
  // ---------------------------------------------------------------------------

  const handleTabChange: SettingsProps['onTabChange'] = (tab) => {
    setUi((prev) => ({ ...prev, activeTab: tab }))
  }

  const handleSelectPipeline: SettingsProps['onSelectPipeline'] = (pipelineId) => {
    setUi((prev) => ({ ...prev, selectedPipelineId: pipelineId }))
  }

  // ---------------------------------------------------------------------------
  // Pipeline CRUD
  // ---------------------------------------------------------------------------

  const handleCreatePipeline: SettingsProps['onCreatePipeline'] = () => {
    setPipelineModal({ open: true, mode: 'create' })
  }

  const handleEditPipeline: SettingsProps['onEditPipeline'] = (pipelineId) => {
    setPipelineModal({ open: true, mode: 'edit', pipelineId })
  }

  const handleArchivePipeline: SettingsProps['onArchivePipeline'] = (pipelineId) => {
    setPipelines((prev) =>
      prev.map((pipeline) =>
        pipeline.id === pipelineId
          ? { ...pipeline, archivedAt: new Date().toISOString() }
          : pipeline,
      ),
    )
    setUi((prev) =>
      prev.selectedPipelineId === pipelineId ? { ...prev, selectedPipelineId: null } : prev,
    )
  }

  const handleSetDefaultPipeline: SettingsProps['onSetDefaultPipeline'] = (pipelineId) => {
    setPipelines((prev) =>
      prev.map((pipeline) => ({ ...pipeline, isDefault: pipeline.id === pipelineId })),
    )
  }

  const handleSubmitPipeline = (formData: PipelineFormData) => {
    if (pipelineModal.open && pipelineModal.mode === 'create') {
      const newPipeline: Pipeline = {
        id: `pipe-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        isDefault: pipelines.filter((p) => !p.archivedAt).length === 0,
        stageIds: [],
        createdAt: new Date().toISOString(),
        archivedAt: null,
      }
      setPipelines((prev) => [...prev, newPipeline])
      setUi((prev) => ({ ...prev, selectedPipelineId: newPipeline.id }))
    } else if (pipelineModal.open && pipelineModal.mode === 'edit') {
      setPipelines((prev) =>
        prev.map((p) =>
          p.id === pipelineModal.pipelineId ? { ...p, ...formData } : p,
        ),
      )
    }
  }

  // ---------------------------------------------------------------------------
  // Stage CRUD
  // ---------------------------------------------------------------------------

  const handleCreateStage: SettingsProps['onCreateStage'] = (pipelineId) => {
    setStageModal({ open: true, mode: 'create', pipelineId })
  }

  const handleEditStage: SettingsProps['onEditStage'] = (stageId) => {
    const stage = stages.find((s) => s.id === stageId)
    if (!stage) return
    setStageModal({ open: true, mode: 'edit', stageId, pipelineId: stage.pipelineId })
  }

  const handleArchiveStage: SettingsProps['onArchiveStage'] = (stageId) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId ? { ...stage, archivedAt: new Date().toISOString() } : stage,
      ),
    )
  }

  const handleReorderStages: SettingsProps['onReorderStages'] = (_pipelineId, stageIds) => {
    setStages((prev) =>
      prev.map((stage) => {
        const index = stageIds.indexOf(stage.id)
        if (index === -1) return stage
        return { ...stage, order: index + 1 }
      }),
    )
  }

  const handleSubmitStage = (formData: StageFormData) => {
    if (stageModal.open && stageModal.mode === 'create') {
      const pipelineStages = stages.filter((s) => s.pipelineId === stageModal.pipelineId && !s.archivedAt)
      const newStage: Stage = {
        id: `stage-${Date.now()}`,
        pipelineId: stageModal.pipelineId,
        name: formData.name,
        type: formData.type,
        color: formData.color,
        isHot: formData.isHot,
        order: pipelineStages.length + 1,
        archivedAt: null,
      }
      setStages((prev) => [...prev, newStage])
      setPipelines((prev) =>
        prev.map((p) =>
          p.id === stageModal.pipelineId
            ? { ...p, stageIds: [...p.stageIds, newStage.id] }
            : p,
        ),
      )
    } else if (stageModal.open && stageModal.mode === 'edit') {
      setStages((prev) =>
        prev.map((s) =>
          s.id === stageModal.stageId ? { ...s, ...formData } : s,
        ),
      )
    }
  }

  // ---------------------------------------------------------------------------
  // Drop Reason CRUD
  // ---------------------------------------------------------------------------

  const handleCreateDropReason: SettingsProps['onCreateDropReason'] = () => {
    setDropReasonModal({ open: true, mode: 'create' })
  }

  const handleEditDropReason: SettingsProps['onEditDropReason'] = (dropReasonId) => {
    setDropReasonModal({ open: true, mode: 'edit', dropReasonId })
  }

  const handleToggleDropReasonActive: SettingsProps['onToggleDropReasonActive'] = (
    dropReasonId,
    isActive,
  ) => {
    setDropReasons((prev) =>
      prev.map((reason) => (reason.id === dropReasonId ? { ...reason, isActive } : reason)),
    )
  }

  const handleSubmitDropReason = (formData: DropReasonFormData) => {
    if (dropReasonModal.open && dropReasonModal.mode === 'create') {
      const newReason: DropReason = {
        id: `dr-${Date.now()}`,
        reason: formData.reason,
        category: formData.category,
        isActive: true,
        usageCount: 0,
        archivedAt: null,
      }
      setDropReasons((prev) => [...prev, newReason])
    } else if (dropReasonModal.open && dropReasonModal.mode === 'edit') {
      setDropReasons((prev) =>
        prev.map((r) =>
          r.id === dropReasonModal.dropReasonId ? { ...r, ...formData } : r,
        ),
      )
    }
  }

  // ---------------------------------------------------------------------------
  // User / team management
  // ---------------------------------------------------------------------------

  const handleInviteUser: SettingsProps['onInviteUser'] = () => {
    setInviteModal({ open: true })
  }

  const handleEditUser: SettingsProps['onEditUser'] = (userId) => {
    setEditUserModal({ open: true, userId })
  }

  const handleDeactivateUser: SettingsProps['onDeactivateUser'] = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, isActive: false, deactivatedAt: new Date().toISOString() }
          : user,
      ),
    )
  }

  const handleReactivateUser: SettingsProps['onReactivateUser'] = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isActive: true, deactivatedAt: null } : user,
      ),
    )
  }

  const handleSubmitInviteUser = (formData: { name: string; email: string; role: UserRole; assignedPipelineIds: string[] }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      isActive: true,
      assignedPipelineIds: formData.assignedPipelineIds,
      createdAt: new Date().toISOString(),
      deactivatedAt: null,
    }
    setUsers((prev) => [...prev, newUser])
  }

  const handleSubmitEditUser = (
    userId: string,
    formData: { role: UserRole; assignedPipelineIds: string[] },
  ) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role: formData.role, assignedPipelineIds: formData.assignedPipelineIds } : u,
      ),
    )
  }

  // ---------------------------------------------------------------------------
  // Derive modal initial data
  // ---------------------------------------------------------------------------

  const pipelineForEdit = pipelineModal.open && pipelineModal.mode === 'edit'
    ? pipelines.find((p) => p.id === pipelineModal.pipelineId)
    : undefined

  const stageForEdit = stageModal.open && stageModal.mode === 'edit'
    ? stages.find((s) => s.id === stageModal.stageId)
    : undefined

  const dropReasonForEdit = dropReasonModal.open && dropReasonModal.mode === 'edit'
    ? dropReasons.find((r) => r.id === dropReasonModal.dropReasonId)
    : undefined

  const userForEdit = editUserModal.open
    ? users.find((u) => u.id === editUserModal.userId)
    : undefined

  return (
    <>
      <SettingsView
        currentUser={currentUser}
        ui={ui}
        pipelines={pipelines}
        stages={stages}
        dropReasons={dropReasons}
        users={users}
        systemRules={systemRules}
        onTabChange={handleTabChange}
        onSelectPipeline={handleSelectPipeline}
        onCreatePipeline={handleCreatePipeline}
        onEditPipeline={handleEditPipeline}
        onArchivePipeline={handleArchivePipeline}
        onSetDefaultPipeline={handleSetDefaultPipeline}
        onCreateStage={handleCreateStage}
        onEditStage={handleEditStage}
        onArchiveStage={handleArchiveStage}
        onReorderStages={handleReorderStages}
        onCreateDropReason={handleCreateDropReason}
        onEditDropReason={handleEditDropReason}
        onToggleDropReasonActive={handleToggleDropReasonActive}
        onInviteUser={handleInviteUser}
        onEditUser={handleEditUser}
        onDeactivateUser={handleDeactivateUser}
        onReactivateUser={handleReactivateUser}
      />

      <PipelineModal
        open={pipelineModal.open}
        mode={pipelineModal.open ? pipelineModal.mode : 'create'}
        initialData={pipelineForEdit ? { name: pipelineForEdit.name, description: pipelineForEdit.description } : undefined}
        onClose={() => setPipelineModal({ open: false })}
        onSubmit={handleSubmitPipeline}
      />

      <StageModal
        open={stageModal.open}
        mode={stageModal.open ? stageModal.mode : 'create'}
        initialData={stageForEdit ? { name: stageForEdit.name, type: stageForEdit.type, color: stageForEdit.color, isHot: stageForEdit.isHot } : undefined}
        onClose={() => setStageModal({ open: false })}
        onSubmit={handleSubmitStage}
      />

      <DropReasonModal
        open={dropReasonModal.open}
        mode={dropReasonModal.open ? dropReasonModal.mode : 'create'}
        initialData={dropReasonForEdit ? { reason: dropReasonForEdit.reason, category: dropReasonForEdit.category } : undefined}
        onClose={() => setDropReasonModal({ open: false })}
        onSubmit={handleSubmitDropReason}
      />

      <InviteUserModal
        open={inviteModal.open}
        pipelines={pipelines}
        onClose={() => setInviteModal({ open: false })}
        onSubmit={handleSubmitInviteUser}
      />

      <EditUserModal
        open={editUserModal.open}
        userName={userForEdit?.name}
        initialRole={userForEdit?.role}
        initialPipelineIds={userForEdit?.assignedPipelineIds}
        pipelines={pipelines}
        onClose={() => setEditUserModal({ open: false })}
        onSubmit={(formData) => {
          if (editUserModal.open) handleSubmitEditUser(editUserModal.userId, formData)
        }}
      />
    </>
  )
}
