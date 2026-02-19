import data from '@/sections/today/sample-data.json'
import { TodayView } from '@/sections/today/components/TodayView'
import type {
  Stats,
  Lead,
  CallResultOption,
  ConversationOutcomeCategory,
  NextActionOption,
  RetryTimeOption,
} from '@/sections/today/types'

export function TodayPage() {
  return (
    <TodayView
      stats={data.stats as Stats}
      followUpsDue={data.followUpsDue as Lead[]}
      newLeads={data.newLeads as Lead[]}
      callResultOptions={data.callResultOptions as CallResultOption[]}
      conversationOutcomeOptions={data.conversationOutcomeOptions as ConversationOutcomeCategory[]}
      nextActionOptions={data.nextActionOptions as NextActionOption[]}
      retryTimeOptions={data.retryTimeOptions as RetryTimeOption[]}
      onTabChange={(tab) => console.log('Tab changed:', tab)}
      onSelectLead={(leadId) => console.log('Selected lead:', leadId)}
      onClosePanel={() => console.log('Panel closed')}
      onLogOutcome={(leadId, outcome) => console.log('Logged outcome for', leadId, outcome)}
      onInitiateCall={(leadId) => console.log('Initiating call to:', leadId)}
    />
  )
}
