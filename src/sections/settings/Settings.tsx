import { useState } from 'react'
import data from '@/../product/sections/settings/data.json'
import type {
  SettingsTab,
  SettingsUIState,
  CurrentUser,
  Pipeline,
  Stage,
  DropReason,
  User,
  SystemRules,
} from '@/../product/sections/settings/types'
import { SettingsView } from './components/SettingsView'

export default function SettingsPreview() {
  const [ui, setUi] = useState<SettingsUIState>(data.ui as SettingsUIState)

  const handleTabChange = (tab: SettingsTab) => {
    setUi((prev) => ({ ...prev, activeTab: tab }))
    console.log('Tab changed to:', tab)
  }

  const handleSelectPipeline = (pipelineId: string) => {
    setUi((prev) => ({ ...prev, selectedPipelineId: pipelineId }))
    console.log('Selected pipeline:', pipelineId)
  }

  const handleCreatePipeline = () => {
    console.log('→ Open side drawer: Create Pipeline')
  }

  const handleEditPipeline = (pipelineId: string) => {
    console.log('→ Open side drawer: Edit Pipeline', pipelineId)
  }

  const handleArchivePipeline = (pipelineId: string) => {
    console.log('→ Confirm archive pipeline:', pipelineId)
  }

  const handleSetDefaultPipeline = (pipelineId: string) => {
    console.log('→ Confirm set default pipeline:', pipelineId)
    console.log('  Warning:', data.systemRules.defaultPipelineWarning)
  }

  const handleCreateStage = (pipelineId: string) => {
    console.log('→ Open side drawer: Create Stage for pipeline', pipelineId)
  }

  const handleEditStage = (stageId: string) => {
    console.log('→ Open side drawer: Edit Stage', stageId)
  }

  const handleArchiveStage = (stageId: string) => {
    console.log('→ Confirm archive stage:', stageId)
  }

  const handleReorderStages = (pipelineId: string, stageIds: string[]) => {
    console.log('→ Reorder stages for pipeline', pipelineId)
    console.log('  New order:', stageIds)
  }

  const handleCreateDropReason = () => {
    console.log('→ Open side drawer: Create Drop Reason')
  }

  const handleEditDropReason = (dropReasonId: string) => {
    console.log('→ Open side drawer: Edit Drop Reason', dropReasonId)
  }

  const handleToggleDropReasonActive = (dropReasonId: string, isActive: boolean) => {
    console.log('→ Toggle drop reason active:', dropReasonId, '→', isActive)
  }

  const handleInviteUser = () => {
    console.log('→ Open side drawer: Invite User')
  }

  const handleEditUser = (userId: string) => {
    console.log('→ Open side drawer: Edit User', userId)
  }

  const handleDeactivateUser = (userId: string) => {
    console.log('→ Confirm deactivate user:', userId)
  }

  const handleReactivateUser = (userId: string) => {
    console.log('→ Reactivate user:', userId)
  }

  return (
    <SettingsView
      currentUser={data.currentUser as CurrentUser}
      ui={ui}
      pipelines={data.pipelines as Pipeline[]}
      stages={data.stages as Stage[]}
      dropReasons={data.dropReasons as DropReason[]}
      users={data.users as User[]}
      systemRules={data.systemRules as SystemRules}
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
  )
}
