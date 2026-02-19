# Data Model

## Entities

### Lead
A prospective customer interested in purchasing a course. Each lead has a score indicating their likelihood to convert, a qualification status, and moves through pipeline stages as the sales process progresses.

### Call
A call attempt or conversation between a BD and a lead. Records the outcome (connected, not answered, busy, etc.), duration if connected, and any notes about the conversation.

### FollowUp
A scheduled follow-up action for a lead. Has a due date, a reason for the follow-up, and tracks whether it's been completed. Follow-ups are the core mechanism for ensuring no lead falls through the cracks.

### Stage
A step in the sales pipeline that leads progress through. Examples: New, Contacted, Hot, Demo Scheduled, Won, Lost. Stages are configurable per business.

### DropReason
A reason why a lead didn't convert, captured when a lead is marked as lost. Examples: Price too high, Wrong timing, Chose competitor, Not interested. Used for analytics to improve scripts, offers, and targeting.

### User
A team member who uses Cadence — either a BD (makes calls, manages leads) or a founder/admin (views dashboard, configures settings). Users have roles that determine their permissions.

### Source
Where a lead originated from. Examples: YouTube, WhatsApp group, App install, Referral, Paid ad. Used to track which channels produce the highest-quality leads.

## Relationships

- Lead has many Calls
- Lead has many FollowUps
- Lead belongs to one Stage (current position in pipeline)
- Lead belongs to one Source (where they came from)
- Lead may have one DropReason (if lost)
- Call belongs to Lead
- Call belongs to User (who made the call)
- FollowUp belongs to Lead
- FollowUp belongs to User (who is assigned to complete it)
