# Designing Sections

After completing [Product Planning](product-planning.md), you're ready to design individual sections. Work through each section in your roadmap, completing these steps for each one.

## 1. Shape the Section

```
/shape-section
```

Define what the section does. If you have multiple sections, you'll be asked which one to work on.

This is a conversational process to establish:

- **Overview** — What this section is for (2-3 sentences)
- **User flows** — The main actions and step-by-step interactions
- **UI requirements** — Specific layouts, patterns, or components needed
- **Scope boundaries** — What's intentionally excluded

Share any notes or ideas you have. The AI will ask clarifying questions about user actions, information to display, and UI patterns. Focus on experience and interface requirements—no backend or database details.

You'll also be asked whether this section should display inside the application shell (most sections do) or as a standalone page (for things like landing pages or embedded widgets).

**Creates:** `product/sections/[section-id]/spec.md`

## 2. Create Sample Data

```
/sample-data
```

Generate realistic sample data based on the spec. This data populates your screen designs and makes them feel real.

The AI analyzes your section spec and proposes a data structure:

- **Entities** — Based on your global data model (if defined) or inferred from the spec
- **Relationships** — How the data connects
- **Sample records** — 5-10 realistic entries with varied content

You'll also get TypeScript types generated automatically:

- **Data interfaces** — Type definitions for each entity
- **Props interface** — What the component expects, including callbacks for actions (onView, onEdit, onDelete, etc.)

The sample data includes:
- Realistic names, dates, and descriptions (not "Lorem ipsum")
- Varied content lengths and statuses
- Edge cases (empty arrays, long text)

**Creates:**
- `product/sections/[section-id]/data.json` — Sample data with `_meta` descriptions
- `product/sections/[section-id]/types.ts` — TypeScript interfaces

## 3. Design the Screen

```
/design-screen
```

Build the actual React components for the section. This is where the spec and sample data become a working UI.

### What Gets Created

**Exportable components** (props-based, portable):

The main component and any sub-components, all accepting data and callbacks via props. These are what get exported to your codebase.

```tsx
// Example: Components accept props, never import data directly
export function InvoiceList({
  invoices,
  onView,
  onEdit,
  onDelete,
  onCreate
}: InvoiceListProps) {
  // ...
}
```

**Preview wrapper** (for Design OS only):

A wrapper that imports the sample data and feeds it to the component, so you can see it running in Design OS.

### Design Requirements

All screen designs include:

- **Mobile responsive** — Tailwind responsive prefixes (`sm:`, `md:`, `lg:`)
- **Light & dark mode** — Using `dark:` variants
- **Design tokens applied** — Your color palette and typography choices
- **All spec requirements** — Every user flow and UI requirement implemented

### Multiple Views

If the spec implies multiple views (list view, detail view, form, etc.), you'll be asked which to build first. Run `/design-screen` again for additional views.

**Creates:**
- `src/sections/[section-id]/components/[ViewName].tsx` — Main component
- `src/sections/[section-id]/components/[SubComponent].tsx` — Sub-components as needed
- `src/sections/[section-id]/components/index.ts` — Component exports
- `src/sections/[section-id]/[ViewName].tsx` — Preview wrapper

**Important:** Restart your dev server after creating screen designs to see the changes.

## 4. Capture Screenshots (Optional)

```
/screenshot-design
```

Take screenshots of your screen designs for documentation. Screenshots are saved alongside the spec and data files.

This command:
1. Starts the dev server automatically
2. Navigates to your screen design
3. Hides the Design OS navigation bar
4. Captures a full-page screenshot

Screenshots are useful for:
- Visual reference during implementation
- Documentation and handoff materials
- Comparing designs across sections

**Requires:** Playwright MCP server. If not installed, you'll be prompted with setup instructions.

**Creates:** `product/sections/[section-id]/[screen-name].png`

## Repeat for Each Section

Work through your roadmap sections in order. Each section builds on the foundation you established and benefits from the consistency of your global data model and design tokens.

## What's Next

When all sections are designed, you're ready to export. See [Export](export.md) for generating the complete handoff package.
