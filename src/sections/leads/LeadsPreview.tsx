import data from '@/../product/sections/leads/data.json'
import { LeadsView } from './components/LeadsView'

export default function LeadsPreview() {
  return (
    <LeadsView
      leads={data.leads as any}
      users={data.users as any}
      currentUserId="user-001"
      isAdmin={true}
      filterCounts={data.filterCounts as any}
      sourceOptions={data.sourceOptions}
      stageOptions={data.stageOptions}
      qualificationOptions={data.qualificationOptions}
      callResultOptions={data.callResultOptions}
      conversationOutcomeOptions={data.conversationOutcomeOptions as any}
      nextActionOptions={data.nextActionOptions as any}
      retryTimeOptions={data.retryTimeOptions}
      lossReasonOptions={data.lossReasonOptions}
      linkTypeOptions={data.linkTypeOptions as any}
      onSearch={(query) => console.log('Search:', query)}
      onQuickFilter={(filter) => console.log('Quick filter:', filter)}
      onAdvancedFilter={(filters) => console.log('Advanced filters:', filters)}
      onSort={(field, order) => console.log('Sort:', field, order)}
      onSelectLead={(id) => console.log('Select lead:', id)}
      onClosePanel={() => console.log('Close panel')}
      onOpenFullProfile={(id) => console.log('Open full profile:', id)}
      onLogOutcome={(id, outcome) => console.log('Log outcome:', id, outcome)}
      onLogLinkSent={(id, linkType) => console.log('Log link sent:', id, linkType)}
      onScheduleFollowUp={(id, date, time, reason) => console.log('Schedule follow-up:', id, date, time, reason)}
      onEditPhone={(id, phone) => console.log('Edit phone:', id, phone)}
      onChangeOwner={(id, ownerId) => console.log('Change owner:', id, ownerId)}
      onChangeQualification={(id, qual) => console.log('Change qualification:', id, qual)}
      onMarkBadNumber={(id) => console.log('Mark bad number:', id)}
      onMoveStage={(id, stage, reason) => console.log('Move stage:', id, stage, reason)}
      onSelectionChange={(ids) => console.log('Selection changed:', ids)}
      onBulkAssign={(payload) => console.log('Bulk assign:', payload)}
      onBulkQualify={(payload) => console.log('Bulk qualify:', payload)}
      onBulkMarkBadNumber={(payload) => console.log('Bulk mark bad number:', payload)}
      onExportSelected={(ids) => console.log('Export selected:', ids)}
      onExportFiltered={() => console.log('Export filtered view')}
      onBulkMoveStage={(payload) => console.log('Bulk move stage:', payload)}
      onCheckDuplicate={(phone) => {
        console.log('Check duplicate:', phone)
        return null
      }}
      onMerge={(payload) => console.log('Merge:', payload)}
    />
  )
}
