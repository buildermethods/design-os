# Codebase Implementation

After exporting your designs from Design OS, you have a complete handoff package ready for implementation. This guide covers how to work with your AI coding agent to build the product.

## Getting Started

1. Copy the `product-plan/` folder into your target codebase
2. Start your AI coding agent (Claude Code, Cursor, etc.)
3. Choose your implementation approach: one-shot or section-by-section

## Implementation Approaches

### Option A: Incremental Implementation (Recommended)

For larger products or when you want to review progress incrementally.

**How it works:**

Work through the instructions in order:

1. **Foundation** (`instructions/incremental/01-foundation.md`) — Design tokens, data model types, routing
2. **Shell** (`instructions/incremental/02-shell.md`) — Application shell and navigation
3. **Sections** (`instructions/incremental/03-*.md`, `04-*.md`, etc.) — Each feature section, one at a time

For each milestone:

1. Open `product-plan/prompts/section-prompt.md`
2. Fill in the section variables at the top (SECTION_NAME, SECTION_ID, NN)
3. Add any section-specific notes
4. Copy/paste the prompt into your coding agent
5. Answer clarifying questions and let the agent implement
6. Review and test before moving to the next milestone

**The section prompt:**

- References the section's instruction file and assets
- Points to `tests.md` for test-driven development
- Asks about auth, data relationships, and integration points

### Option B: One-Shot Implementation

For simpler products or when you want to build everything in one session.

**How it works:**

1. Open `product-plan/prompts/one-shot-prompt.md`
2. Add any additional notes (tech stack preferences, constraints)
3. Copy/paste the prompt into your coding agent
4. Answer the agent's clarifying questions about auth, user modeling, etc.
5. Let the agent plan and implement everything

The prompt references `product-overview.md` and `instructions/one-shot-instructions.md`, and guides your agent to ask important questions before starting.

**The prompt includes questions about:**

- Authentication & authorization (login methods, user roles)
- User & account modeling (single-user vs multi-user, teams/workspaces)
- Tech stack preferences (backend framework, database)
- Any other clarifications needed

## Test-Driven Development

Each section includes a `tests.md` file with detailed test-writing instructions. We recommend a TDD approach:

1. **Read the test instructions** — Review `sections/[section-id]/tests.md`
2. **Write failing tests** — Based on the user flows and assertions described
3. **Implement the feature** — Make the tests pass
4. **Refactor** — Clean up while keeping tests green

The test instructions include:

- **User flow tests** — Success and failure paths for key interactions
- **Empty state tests** — Verifying behavior when no records exist
- **Component interaction tests** — Specific UI elements and behaviors
- **Edge cases** — Boundary conditions and transitions

Test instructions are **framework-agnostic**—they describe WHAT to test, not HOW. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

## Spec-Driven Development

We also recommend a spec-driven approach:

1. **Review the design** — Understand what's been designed and why
2. **Ask clarifying questions** — Resolve any ambiguities before coding
3. **Write the technical spec** — Define the backend architecture, API contracts, database schema
4. **Write tests first** — Based on the provided test instructions
5. **Implement** — Build to make tests pass
6. **Verify** — Ensure the implementation matches the design

This approach prevents wasted work from misunderstandings and ensures the backend properly supports the frontend designs.

## Clarifying Questions

Before finalizing any implementation plan, encourage your agent to ask questions like:

**Architecture:**
- What backend framework are we using?
- How should authentication work?
- Are there existing patterns in this codebase to follow?

**Data:**
- How should the data model extend what's defined?
- Are there validation rules beyond what the UI shows?
- How should relationships be handled (eager loading, lazy loading)?

**Integration:**
- How should the callbacks be implemented (API calls, local state)?
- What error handling patterns should we use?
- Are there existing UI components to reuse alongside the new ones?

**Scope:**
- Should we implement all features in this milestone or prioritize?
- Are there any features to skip for now?
- What's the testing strategy?

## What Your Agent Needs to Build

The Design OS export provides finished UI designs. Your implementation agent still needs to create:

**Backend:**
- Database schema and migrations
- API endpoints (REST or GraphQL)
- Business logic and validation
- Authentication and authorization

**Data Layer:**
- State management setup
- Data fetching and caching
- Real-time updates (if needed)

**Integration:**
- Routing configuration
- Callback implementations
- Error handling and loading states
- Empty state handling (when no records exist)
- Form validation and submission

**Tests:**
- Unit and integration tests based on `tests.md` instructions
- User flow tests (success and failure paths)
- Empty state verification

**The UI components are complete and production-ready.** Focus implementation effort on the data layer, backend, and tests—don't redesign or restyle the provided components.

## Tips

- **Use the pre-written prompts** — They include important clarifying questions about auth and data modeling
- **Always include product-overview.md** — It gives essential context about the full product
- **Write tests first** — Use the `tests.md` instructions for TDD
- **Review incrementally** — Section-by-section implementation lets you catch issues early
- **Test with sample data first** — Use the provided sample-data.json before building real APIs
- **Handle empty states** — Ensure good UX when no records exist (first-time users)
- **Trust the components** — They're designed and styled already; wire them up, don't rebuild them
