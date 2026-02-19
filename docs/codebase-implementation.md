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

1. **Shell** (`instructions/incremental/01-shell.md`) — Design tokens and application shell
2. **Sections** (`instructions/incremental/02-*.md`, `03-*.md`, etc.) — Each feature section, one at a time

For each milestone:

1. Open `product-plan/prompts/section-prompt.md`
2. Fill in the section variables at the top (SECTION_NAME, SECTION_ID, NN)
3. Add any section-specific notes
4. Copy/paste the prompt into your coding agent
5. Answer clarifying questions and let the agent implement
6. Review and test before moving to the next milestone

**The section prompt:**

- References the section's instruction file and assets
- Points to `tests.md` for UI behavior test specs
- Guides the agent to ask clarifying questions before implementing

### Option B: One-Shot Implementation

For simpler products or when you want to build everything in one session.

**How it works:**

1. Open `product-plan/prompts/one-shot-prompt.md`
2. Add any additional notes (tech stack preferences, constraints)
3. Copy/paste the prompt into your coding agent
4. Answer the agent's clarifying questions about auth, user modeling, etc.
5. Let the agent plan and implement everything

The prompt references `product-overview.md` and `instructions/one-shot-instructions.md`, and guides your agent to review all provided files and ask clarifying questions before starting.

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
3. **Plan the implementation** — Decide on architecture, data layer, and integration approach
4. **Write tests first** — Based on the provided test instructions
5. **Implement** — Build to make tests pass
6. **Verify** — Ensure the implementation matches the design

This approach prevents wasted work from misunderstandings and ensures the implementation properly supports the UI designs.

## Clarifying Questions

Before finalizing any implementation plan, encourage your agent to review all provided files and ask clarifying questions about:

- Your tech stack and any existing codebase conventions
- Authentication and user management approach
- How to extend the data shapes for your backend needs
- Any product requirements that need clarification
- Anything else needed before implementing

## What's Included vs. What You Build

The Design OS export provides:

- **Finished UI components** — Props-based, fully styled, responsive, dark mode support
- **Product requirements** — Specs, user flows, and scope definitions
- **Design system tokens** — Colors, typography, CSS custom properties
- **Sample data** — Showing the shape of data components expect
- **UI behavior test specs** — What to test from the user's perspective

Your implementation agent builds everything else — the backend, data layer, routing, state management, and tests. The components accept data and fire callbacks via props; how you fulfill those contracts is an implementation decision.

**The UI components are complete and production-ready.** Wire them up, don't rebuild them.

## Tips

- **Use the pre-written prompts** — They guide your agent to review designs and ask the right questions
- **Always include product-overview.md** — It gives essential context about the full product
- **Write tests first** — Use the `tests.md` instructions for TDD
- **Review incrementally** — Section-by-section implementation lets you catch issues early
- **Test with sample data first** — Use the provided sample-data.json before building real APIs
- **Handle empty states** — Ensure good UX when no records exist (first-time users)
- **Trust the components** — They're designed and styled already; wire them up, don't rebuild them
