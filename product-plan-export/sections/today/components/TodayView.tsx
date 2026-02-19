import { useState } from 'react'
import { Clock, CheckCircle } from 'lucide-react'
import type { TodayProps, OutcomeFormData } from '../types'
import { StatsHeader } from './StatsHeader'
import { LeadList, Tabs } from './LeadList'
import { LeadPanel } from './LeadPanel'

export function TodayView({
  stats,
  followUpsDue,
  newLeads,
  callResultOptions,
  conversationOutcomeOptions,
  nextActionOptions,
  retryTimeOptions,
  onTabChange,
  onSelectLead,
  onClosePanel,
  onLogOutcome,
  onInitiateCall,
}: TodayProps) {
  const [activeTab, setActiveTab] = useState<'followups' | 'newleads'>('followups')
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)

  const currentLeads = activeTab === 'followups' ? followUpsDue : newLeads
  const selectedLead = [...followUpsDue, ...newLeads].find((l) => l.id === selectedLeadId)

  const handleTabChange = (tab: 'followups' | 'newleads') => {
    setActiveTab(tab)
    setSelectedLeadId(null)
    onTabChange?.(tab)
  }

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId)
    onSelectLead?.(leadId)
  }

  const handleClosePanel = () => {
    setSelectedLeadId(null)
    onClosePanel?.()
  }

  const handleLogOutcome = (data: OutcomeFormData) => {
    if (!selectedLeadId) return

    onLogOutcome?.(selectedLeadId, data)

    // Show toast
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2000)

    // Auto-advance to next lead
    const currentIndex = currentLeads.findIndex((l) => l.id === selectedLeadId)
    const nextLead = currentLeads[currentIndex + 1]

    if (nextLead) {
      setTimeout(() => {
        setSelectedLeadId(nextLead.id)
        onSelectLead?.(nextLead.id)
      }, 500)
    } else {
      setTimeout(() => {
        setSelectedLeadId(null)
        onClosePanel?.()
      }, 500)
    }
  }

  const handleCallLead = (leadId: string) => {
    setSelectedLeadId(leadId)
    onSelectLead?.(leadId)
    onInitiateCall?.(leadId)
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Main content area with conditional side panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Stats + List */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${selectedLeadId ? 'lg:w-1/2' : 'w-full'}`}>
          {/* Header with stats */}
          <div className="flex-shrink-0 p-4 lg:p-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="mb-1">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                Today
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your prioritized calls and follow-ups
              </p>
            </div>
            <div className="mt-4">
              <StatsHeader stats={stats} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-shrink-0 bg-white dark:bg-slate-800">
            <Tabs
              activeTab={activeTab}
              followUpCount={followUpsDue.length}
              newLeadCount={newLeads.length}
              onTabChange={handleTabChange}
            />
          </div>

          {/* Lead list */}
          <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800">
            <LeadList
              leads={currentLeads}
              selectedLeadId={selectedLeadId || undefined}
              onSelectLead={handleSelectLead}
              onCallLead={handleCallLead}
              emptyIcon={activeTab === 'followups' ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : undefined}
              emptyTitle={activeTab === 'followups' ? 'All caught up!' : 'No new leads'}
              emptyDescription={
                activeTab === 'followups'
                  ? "You've cleared all your follow-ups for today. Great work!"
                  : 'New leads will appear here when they come in.'
              }
            />
          </div>
        </div>

        {/* Right: Side panel */}
        {selectedLead && (
          <div className="hidden lg:block w-1/2 max-w-xl animate-in slide-in-from-right duration-300">
            <LeadPanel
              lead={selectedLead}
              callResultOptions={callResultOptions}
              conversationOutcomeOptions={conversationOutcomeOptions}
              nextActionOptions={nextActionOptions}
              retryTimeOptions={retryTimeOptions}
              onClose={handleClosePanel}
              onLogOutcome={handleLogOutcome}
              onCall={() => onInitiateCall?.(selectedLead.id)}
            />
          </div>
        )}
      </div>

      {/* Mobile: Bottom sheet for lead panel */}
      {selectedLead && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={handleClosePanel}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-2xl shadow-xl animate-in slide-in-from-bottom duration-300">
            <div className="h-full max-h-[90vh] overflow-y-auto">
              <LeadPanel
                lead={selectedLead}
                callResultOptions={callResultOptions}
                conversationOutcomeOptions={conversationOutcomeOptions}
                nextActionOptions={nextActionOptions}
                retryTimeOptions={retryTimeOptions}
                onClose={handleClosePanel}
                onLogOutcome={handleLogOutcome}
                onCall={() => onInitiateCall?.(selectedLead.id)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {showToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg shadow-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Outcome logged successfully</span>
          </div>
        </div>
      )}
    </div>
  )
}
