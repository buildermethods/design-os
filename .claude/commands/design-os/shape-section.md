# Shape Section

You are helping the user define the specification for a section of their product. This is a conversational process to establish the scope of functionality, user flows, and UI requirements.

## Step 1: Check Prerequisites

First, verify that `/product/product-roadmap.md` exists. If it doesn't:

"I don't see a product roadmap defined yet. Please run `/product-roadmap` first to define your product sections, then come back to shape individual sections."

Stop here if the roadmap doesn't exist.

## Step 2: Identify the Target Section

Read `/product/product-roadmap.md` to get the list of available sections.

If there's only one section, auto-select it. If there are multiple sections, use the AskUserQuestion tool to ask which section the user wants to work on:

"Which section would you like to define the specification for?"

Present the available sections as options.

## Step 3: Gather Initial Input

Once the section is identified, invite the user to share any initial thoughts:

"Let's define the scope and requirements for **[Section Title]**.

Do you have any notes or ideas about what this section should include? Share any thoughts about the features, user flows, or UI patterns you're envisioning. If you're not sure yet, we can start with questions."

Wait for their response. The user may provide raw notes or ask to proceed with questions.

## Step 4: Ask Clarifying Questions

Use the AskUserQuestion tool to ask 4-6 targeted questions to define:

- **Main user actions/tasks** - What can users do in this section?
- **Information to display** - What data and content needs to be shown?
- **Key user flows** - What are the step-by-step interactions?
- **UI patterns** - Any specific interactions, layouts, or components needed?
- **Scope boundaries** - What should be explicitly excluded?

Example questions (adapt based on their input and the section):
- "What are the main actions a user can take in this section?"
- "What information needs to be displayed on the primary view?"
- "Walk me through the main user flow - what happens step by step?"
- "Are there any specific UI patterns you want to use (e.g., tables, cards, modals)?"
- "What's intentionally out of scope for this section?"
- "Are there multiple views needed (e.g., list view and detail view)?"

Ask questions one or two at a time, conversationally. Focus on user experience and interface requirements - no backend or database details.

## Step 5: Ask About Shell Configuration

If a shell design has been created for this project (check if `/src/shell/components/AppShell.tsx` exists), ask the user about shell usage:

"Should this section's screen designs be displayed **inside the app shell** (with navigation header), or should they be **standalone pages** (without the shell)?

Most sections use the app shell, but some pages like public-facing views, landing pages, or embedded widgets should be standalone."

Use AskUserQuestion with options:
- "Inside app shell" - The default for most in-app sections
- "Standalone (no shell)" - For public pages, landing pages, or embeds

If no shell design exists yet, skip this question and default to using the shell.

## Step 6: Present Draft and Refine

Once you have enough information, present a draft specification:

"Based on our discussion, here's the specification for **[Section Title]**:

**Overview:**
[2-3 sentence summary of what this section does]

**User Flows:**
- [Flow 1]
- [Flow 2]
- [Flow 3]

**UI Requirements:**
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

**Display:** [Inside app shell / Standalone]

Does this capture everything? Would you like to adjust anything?"

Iterate until the user is satisfied. Don't add features that weren't discussed. Don't leave out features that were discussed.

## Step 7: Create the Spec File

Once the user approves, create the file at `product/sections/[section-id]/spec.md` with this exact format:

```markdown
# [Section Title] Specification

## Overview
[The finalized 2-3 sentence description]

## User Flows
- [Flow 1]
- [Flow 2]
- [Flow 3]
[Add all flows discussed]

## UI Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]
[Add all requirements discussed]

## Configuration
- shell: [true/false]
```

**Important:**
- Set `shell: true` if the section should display inside the app shell (this is the default)
- Set `shell: false` if the section should display as a standalone page without the shell

The section-id is the slug version of the section title (lowercase, hyphens instead of spaces).

## Step 8: Confirm and Next Steps

Let the user know:

"I've created the specification at `product/sections/[section-id]/spec.md`.

You can review the spec on the section page. When you're ready, run `/sample-data` to create sample data for this section."

## Important Notes

- Be conversational and helpful, not robotic
- Ask follow-up questions when answers are vague
- Focus on UX and UI - don't discuss backend, database, or API details
- Keep the spec concise - only include what was discussed, no bloat
- The format must match exactly for the app to parse it correctly
