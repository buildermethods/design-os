# Sample Data

You are helping the user create or update realistic sample data for a section of their product. This data will be used to populate screen designs. You will also generate TypeScript types based on the data structure.

## Step 1: Check Prerequisites

First, identify the target section and verify that `spec.md` exists for it.

Read `/product/product-roadmap.md` to get the list of available sections.

If there's only one section, auto-select it. If there are multiple sections, use the AskUserQuestion tool to ask which section the user wants to generate data for.

Then check if `product/sections/[section-id]/spec.md` exists. If it doesn't:

"I don't see a specification for **[Section Title]** yet. Please run `/shape-section` first to define the section's requirements, then come back to generate sample data."

Stop here if the spec doesn't exist.

## Step 2: Check for Existing Sample Data

Check if `product/sections/[section-id]/data.json` already exists.

**If sample data already exists:**

Read the existing `data.json` and `types.ts` files, then ask the user:

"Sample data already exists for **[Section Title]**. What would you like to change about the existing data shape or sample data?"

Wait for the user's response describing what they want changed. Once you receive their notes, **immediately proceed** to update `data.json` and `types.ts` based on their requested changes — do not present a draft for approval.

After updating, inform the user:

"I've updated the sample data and types for **[Section Title]** based on your feedback. Review the changes and let me know if you'd like further adjustments, or run `/design-screen` when you're ready."

Stop here — the remaining steps below are for generating new data from scratch.

**If no sample data exists:** Continue to Step 3.

## Step 3: Check for Global Data Shape

Check if `/product/data-shape/data-shape.md` exists.

**If it exists:**
- Read the file to understand the global entity definitions
- Entity names in your sample data should match the global data shape
- Use the descriptions and relationships as a guide

**If it doesn't exist:**
Show a warning but continue:

"Note: A global data shape hasn't been defined yet. I'll create entity structures based on the section spec, but for consistency across sections, consider running `/data-shape` first."

## Step 4: Analyze and Generate

Read and analyze `product/sections/[section-id]/spec.md` to understand:

- What data entities are implied by the user flows?
- What fields/properties would each entity need?
- What sample values would be realistic and helpful for design?
- What actions can be taken on each entity? (These become callback props)

**If a global data shape exists:** Cross-reference the spec with the data shape. Use the same entity names and ensure consistency.

**Immediately proceed** to generate both files — do not present a draft for approval.

### Generate `product/sections/[section-id]/data.json`

Create the data file with:

- **A `_meta` section** - Human-readable descriptions of each entity and how they relate in the UI (displayed in the Design OS interface)
- **Realistic sample data** - Use believable names, dates, descriptions, etc.
- **Varied content** - Mix short and long text, different statuses, etc.
- **Edge cases** - Include at least one empty array, one long description, etc.
- **TypeScript-friendly structure** - Use consistent field names and types

#### Required `_meta` Structure

Every data.json MUST include a `_meta` object at the top level with:

1. **`models`** - An object where each key is an entity name and value is a plain-language description of what it represents in the UI
2. **`relationships`** - An array of strings describing how entities relate from the user's perspective

Example structure:

```json
{
  "_meta": {
    "models": {
      "invoices": "Each invoice represents a bill you send to a client for work completed.",
      "lineItems": "Line items are the individual services or products listed on each invoice."
    },
    "relationships": [
      "Each Invoice contains one or more Line Items (the breakdown of charges)",
      "Invoices track which Client they belong to via the clientName field"
    ]
  },
  "invoices": [
    {
      "id": "inv-001",
      "invoiceNumber": "INV-2024-001",
      "clientName": "Acme Corp",
      "clientEmail": "billing@acme.com",
      "total": 1500.00,
      "status": "sent",
      "dueDate": "2024-02-15",
      "lineItems": [
        { "description": "Web Design", "quantity": 1, "rate": 1500.00 }
      ]
    }
  ]
}
```

The `_meta` descriptions should:
- Use plain, non-technical language
- Explain what each entity represents from the user's perspective
- Describe relationships in terms of "contains", "belongs to", "links to" — these are conceptual, not database relationships
- **Match the global data shape entity names if one exists**

The data should directly support the user flows and UI requirements in the spec.

### Generate `product/sections/[section-id]/types.ts`

Generate TypeScript types based on the data structure.

#### Type Generation Rules

1. **Infer types from the sample data values:**
   - Strings → `string`
   - Numbers → `number`
   - Booleans → `boolean`
   - Arrays → `TypeName[]`
   - Objects → Create a named interface

2. **Use union types for status/enum fields:**

   - If a field like `status` has known values, use a union: `'draft' | 'sent' | 'paid' | 'overdue'`

   - Base this on the spec and the variety in sample data

3. **Create a Props interface for the main component:**
   - Include the data as a prop (e.g., `invoices: Invoice[]`)
   - Include optional callback props for each action (e.g., `onDelete?: (id: string) => void`)

4. **Use consistent entity names:**
   - If a global data shape exists, use the same entity names
   - This ensures consistency across sections

Example types.ts:

```typescript
// =============================================================================
// UI Data Shapes — These define the data the components expect to receive
// =============================================================================

export interface LineItem {
  description: string
  quantity: number
  rate: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  dueDate: string
  lineItems: LineItem[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface InvoiceListProps {
  /** The list of invoices to display */
  invoices: Invoice[]
  /** Called when user wants to view an invoice's details */
  onView?: (id: string) => void
  /** Called when user wants to edit an invoice */
  onEdit?: (id: string) => void
  /** Called when user wants to delete an invoice */
  onDelete?: (id: string) => void
  /** Called when user wants to archive an invoice */
  onArchive?: (id: string) => void
  /** Called when user wants to create a new invoice */
  onCreate?: () => void
}
```

#### Naming Conventions

- Use PascalCase for interface names: `Invoice`, `LineItem`, `InvoiceListProps`

- Use camelCase for property names: `clientName`, `dueDate`, `lineItems`

- Props interface should be named `[SectionName]Props` (e.g., `InvoiceListProps`)

- Add JSDoc comments for callback props to explain when they're called

- **Match entity names from the global data shape if one exists**

## Step 5: Inform and Next Steps

After creating both files, let the user know:

"I've created two files for **[Section Title]**:

1. `product/sections/[section-id]/data.json` - Sample data with [X] records

2. `product/sections/[section-id]/types.ts` - TypeScript interfaces for type safety

The types include:

- `[Entity]` - The main data type
- `[SectionName]Props` - Props interface for the component (includes callbacks for [list actions])

Review the files and let me know if you'd like any adjustments. When you're ready, run `/design-screen` to create the screen design for this section."

## Important Notes

- Generate realistic, believable sample data - not "Lorem ipsum" or "Test 123"
- Include 5-10 sample records for main entities (enough to show a realistic list)
- Include edge cases: empty arrays, long text, different statuses
- Keep field names clear and TypeScript-friendly (camelCase)
- The data structure should directly map to the spec's user flows
- Always generate types.ts alongside data.json
- Callback props should cover all actions mentioned in the spec
- **Use entity names from the global data shape for consistency across sections**
- Do NOT present a draft for approval — generate the files immediately and let the user review after
- If the user requests changes after reviewing, update the files immediately
