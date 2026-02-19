# Data Model

## Core Entities

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

```
Lead ──┬── has many ──> Call
       ├── has many ──> FollowUp
       ├── belongs to ──> Stage (current position)
       ├── belongs to ──> Source (origin)
       └── may have ──> DropReason (if lost)

Call ──┬── belongs to ──> Lead
       └── belongs to ──> User (who made the call)

FollowUp ──┬── belongs to ──> Lead
           └── belongs to ──> User (assigned to complete)

Pipeline ──── has many ──> Stage

User ──── assigned to many ──> Pipeline
```

## Implementation Notes

- **Soft deletes**: Stages, drop reasons, and users are archived rather than deleted to preserve historical data
- **Pipeline validation**: Each pipeline must have exactly one "won" stage and one "lost" stage
- **Lead scoring**: Scores are calculated based on source quality, engagement, and qualification status
- **Ownership**: Leads can be assigned to a specific BD (owner) or remain unassigned
