import { Clock, Users } from 'lucide-react'
import type { Lead } from '@/../product/sections/today/types'
import { LeadRow } from './LeadRow'

interface LeadListProps {
  leads: Lead[]
  selectedLeadId?: string
  onSelectLead?: (leadId: string) => void
  onCallLead?: (leadId: string) => void
  emptyIcon?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
}

export function LeadList({
  leads,
  selectedLeadId,
  onSelectLead,
  onCallLead,
  emptyIcon,
  emptyTitle = 'No leads',
  emptyDescription = 'Nothing to show here.',
}: LeadListProps) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          {emptyIcon || <Users className="w-6 h-6 text-slate-400" />}
        </div>
        <h3 className="font-medium text-slate-900 dark:text-white mb-1">
          {emptyTitle}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
          {emptyDescription}
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {leads.map((lead) => (
        <LeadRow
          key={lead.id}
          lead={lead}
          isSelected={lead.id === selectedLeadId}
          onSelect={() => onSelectLead?.(lead.id)}
          onCall={() => onCallLead?.(lead.id)}
        />
      ))}
    </div>
  )
}

// Tab component for switching between lists
interface TabsProps {
  activeTab: 'followups' | 'newleads'
  followUpCount: number
  newLeadCount: number
  onTabChange?: (tab: 'followups' | 'newleads') => void
}

export function Tabs({ activeTab, followUpCount, newLeadCount, onTabChange }: TabsProps) {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-700">
      <button
        onClick={() => onTabChange?.('followups')}
        className={`
          flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
          ${activeTab === 'followups'
            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }
        `}
      >
        <Clock className="w-4 h-4" />
        <span>Follow-ups Due</span>
        {followUpCount > 0 && (
          <span className={`
            min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-medium rounded-full
            ${activeTab === 'followups'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
            }
          `}>
            {followUpCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onTabChange?.('newleads')}
        className={`
          flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
          ${activeTab === 'newleads'
            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
            : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }
        `}
      >
        <Users className="w-4 h-4" />
        <span>New Leads</span>
        {newLeadCount > 0 && (
          <span className={`
            min-w-[20px] h-5 px-1.5 flex items-center justify-center text-xs font-medium rounded-full
            ${activeTab === 'newleads'
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
            }
          `}>
            {newLeadCount}
          </span>
        )}
      </button>
    </div>
  )
}
