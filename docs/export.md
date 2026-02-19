# Export

When your designs are complete, export everything your implementation agent (or team) needs to build the product.

## When to Export

You're ready to export when:

- Product vision and roadmap are defined
- At least one section has screen designs
- You're satisfied with the design direction

You can export at any point—it doesn't have to be "complete." Exporting generates a snapshot of your current designs. You can always export again later as you add more sections.

## Running the Export

```
/export-product
```

The export command:

1. **Checks prerequisites** — Verifies required files exist
2. **Gathers all design assets** — Components, types, data, tokens
3. **Generates implementation instructions** — Including ready-to-use prompts
4. **Generates test instructions** — TDD specs for each section
5. **Creates the export package** — A complete `product-plan/` directory
6. **Creates a zip file** — `product-plan.zip` for easy download

## What's Included

### Ready-to-Use Prompts

```
product-plan/prompts/
├── one-shot-prompt.md     # Prompt for full implementation
└── section-prompt.md      # Prompt template for section-by-section
```

These are pre-written prompts you copy/paste into your coding agent. They reference the instruction files and prompt your agent to ask important clarifying questions about authentication, user modeling, and tech stack before implementing.

### Instructions

```
product-plan/
├── product-overview.md              # Product summary (always provide)
└── instructions/
    ├── one-shot-instructions.md     # All milestones combined
    └── incremental/                 # Milestone-by-milestone implementation
        ├── 01-foundation.md         # Design tokens, data model, routing
        ├── 02-shell.md              # Application shell implementation
        ├── 03-[section-id].md        # One per section (e.g., 03-invoices.md)
        └── ...
```

**product-overview.md** provides context about the full product—always include it with any implementation session.

**one-shot-instructions.md** combines all milestones into a single document. Use this with `one-shot-prompt.md` for full implementation.

**Incremental instructions** break the work into milestones. Use these with `section-prompt.md` for step-by-step implementation.

### Design System

```
product-plan/design-system/
├── tokens.css           # CSS custom properties
├── tailwind-colors.md   # Tailwind configuration guide
└── fonts.md             # Google Fonts setup
```

### Data Model

```
product-plan/data-model/
├── README.md            # Entity descriptions
├── types.ts             # TypeScript interfaces
└── sample-data.json     # Combined sample data
```

### Shell Components

```
product-plan/shell/
├── README.md            # Design intent
├── components/
│   ├── AppShell.tsx     # Main layout wrapper
│   ├── MainNav.tsx      # Navigation
│   ├── UserMenu.tsx     # User menu
│   └── index.ts         # Exports
└── screenshot.png       # Visual reference (if captured)
```

### Section Components

For each section:

```
product-plan/sections/[section-id]/
├── README.md            # Feature overview, user flows
├── tests.md             # Test-writing instructions (TDD)
├── components/
│   ├── [Component].tsx  # Exportable components
│   └── index.ts         # Exports
├── types.ts             # TypeScript interfaces
├── sample-data.json     # Test data
└── screenshot.png       # Visual reference (if captured)
```

### Test Instructions

Each section includes a `tests.md` file with framework-agnostic test-writing instructions:

- **User flow tests** — Success and failure paths for key interactions
- **Empty state tests** — Verifying UI when no records exist
- **Component interaction tests** — Specific UI elements and behaviors to verify

These instructions describe WHAT to test, not HOW—your coding agent adapts them to your test framework (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

## About the Components

Exported components are:

- **Props-based** — Accept data and callbacks via props, never import data directly
- **Portable** — Work with any React setup, no Design OS dependencies
- **Complete** — Full styling, responsive design, dark mode support
- **Production-ready** — Not prototypes or mockups

```tsx
// Components expect data and callbacks as props
<InvoiceList
  invoices={data}
  onView={(id) => navigate(`/invoices/${id}`)}
  onEdit={(id) => navigate(`/invoices/${id}/edit`)}
  onDelete={(id) => confirmDelete(id)}
  onCreate={() => navigate('/invoices/new')}
/>
```

Your implementation agent's job is to:
- Wire up callbacks to routing and API calls
- Replace sample data with real data from your backend
- Implement proper error handling and loading states
- Implement empty states when no records exist (first-time users, after deletions)
- Build the backend APIs the components need
- Write tests based on the provided test instructions (TDD approach)

## Using the Export

See [Codebase Implementation](codebase-implementation.md) for detailed guidance on implementing your design in your codebase.
