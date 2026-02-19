# Data Shape

You are helping the user create or update the general shape of their product's data — the core entities ("nouns") and how they relate to each other. This creates a shared vocabulary that ensures consistency across sections when generating sample data and screen designs. This is not the final data model — it's a starting point that the implementation agent will extend and refine.

## Step 1: Check Current State

First, check if `/product/data-shape/data-shape.md` exists.

---

## If Data Shape Already Exists (Updating)

Read:
- `/product/data-shape/data-shape.md`
- `/product/product-overview.md` (if it exists, for context)
- `/product/product-roadmap.md` (if it exists, for context)

Present the current state and ask what to change:

"Your data shape currently defines these entities:

- **[Entity1]** — [Description]
- **[Entity2]** — [Description]

**Relationships:**
- [Relationship 1]
- [Relationship 2]

What would you like to change about the entities or relationships?"

Wait for the user's response describing what they want changed. Once you receive their notes, **immediately proceed** to update `product/data-shape/data-shape.md` based on their requested changes — do not present a draft for approval.

After updating, inform the user:

"I've updated the data shape based on your feedback. Review the changes and let me know if you'd like further adjustments."

Stop here — the remaining steps below are for generating a new data shape from scratch.

---

## If No Data Shape Exists (Creating New)

### Check Prerequisites

Read:
1. `/product/product-overview.md` to understand what the product does
2. `/product/product-roadmap.md` to understand the planned sections

If either file is missing, let the user know:

"Before defining your data shape, you'll need to establish your product vision. Please run `/product-vision` first."

Stop here if prerequisites are missing.

### Analyze and Generate

Review the product overview and roadmap, then **immediately proceed** to create the data shape file — do not present a draft for approval.

Identify:
- **Entity names** — The main nouns (things users create, view, or manage)
- **Plain-language descriptions** — What each entity represents
- **Relationships** — How entities connect to each other

Create `/product/data-shape/data-shape.md` with this format:

```markdown
# Data Shape

## Entities

### [EntityName]
[Plain-language description of what this entity represents and its purpose in the system.]

### [AnotherEntity]
[Plain-language description.]

[Add more entities as needed]

## Relationships

- [Entity1] has many [Entity2]
- [Entity2] belongs to [Entity1]
- [Entity3] belongs to both [Entity1] and [Entity2]
[Add more relationships as needed]
```

### Confirm

"I've created your data shape at `/product/data-shape/data-shape.md`.

**Entities defined:**
- [List entities]

**Relationships:**
- [List key relationships]

This provides a shared vocabulary for your screen designs. When you run `/sample-data`, it will reference these entities to ensure consistent naming across sections.

Review and let me know if you'd like to adjust anything. When you're ready, run `/design-tokens` to choose your color palette and typography."

---

## Important Notes

- Keep it **minimal** — entity names, descriptions, and relationships
- Do NOT define detailed schemas, field types, or validation rules
- Use plain language that a non-technical person could understand
- Relationships are conceptual — they describe how data relates from the user's perspective, not database structure
- The implementation agent will decide how to model, store, and extend these entities
- Entity names should be singular (User, Invoice, Project — not Users, Invoices)
- Do NOT present a draft for approval — generate the file immediately and let the user review after
- If the user requests changes after reviewing, update the file immediately
