# Data Model

You are helping the user define the core data model for their product. This establishes the "nouns" of the system — the entities and their relationships.

## Step 1: Check Prerequisites

First, verify that the product overview and roadmap exist:

1. Read `/product/product-overview.md` to understand what the product does
2. Read `/product/product-roadmap.md` to understand the planned sections

If either file is missing, let the user know:

"Before defining your data model, you'll need to establish your product vision. Please run `/product-vision` first, then `/product-roadmap` to define your sections."

Stop here if prerequisites are missing.

## Step 2: Gather Initial Input

Review the product overview and roadmap, then present your initial analysis:

"Based on your product vision and roadmap, I can see you're building **[Product Name]** with sections for [list sections].

Let me help you define the core data model — the main "things" your app will work with.

Looking at your product, here are some entities I'm seeing:

- **[Entity 1]** — [Brief description based on product overview]
- **[Entity 2]** — [Brief description based on sections]
- **[Entity 3]** — [Brief description]

Does this capture the main things your app works with? What would you add, remove, or change?"

Wait for their response before proceeding.

## Step 3: Refine Entities

Use the AskUserQuestion tool to clarify:

- "Are there any other core entities in your system that users will create, view, or manage?"
- "For [Entity], what are the most important pieces of information it contains? (Don't need every field, just the key ones)"
- "How do these entities relate to each other?"

Keep the conversation focused on:
- **Entity names** — What are the main nouns?
- **Plain-language descriptions** — What does each entity represent?
- **Relationships** — How do entities connect to each other?

**Important:** Do NOT define every field or database schema details. Keep it minimal and conceptual.

## Step 4: Present Draft and Refine

Once you have enough information, present a draft:

"Here's your data model:

**Entities:**

- **[Entity1]** — [Description]
- **[Entity2]** — [Description]

**Relationships:**

- [Entity1] has many [Entity2]
- [Entity2] belongs to [Entity1]
- [Entity3] links [Entity1] and [Entity4]

Does this look right? Any adjustments?"

Iterate until the user is satisfied.

## Step 5: Create the File

Once approved, create the file at `/product/data-model/data-model.md` with this format:

```markdown
# Data Model

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

**Important:** Keep descriptions minimal — focus on what each entity represents, not every field it contains. Leave room for the implementation agent to extend the model.

## Step 6: Confirm Completion

Let the user know:

"I've created your data model at `/product/data-model/data-model.md`.

**Entities defined:**
- [List entities]

**Relationships:**
- [List key relationships]

This provides a shared vocabulary that will be used when generating sample data for your sections. When you run `/sample-data`, it will reference this model to ensure consistency.

Next step: Run `/design-tokens` to choose your color palette and typography."

## Important Notes

- Keep the data model **minimal** — entity names, descriptions, and relationships
- Do NOT define detailed schemas, field types, or validation rules
- Use plain language that a non-technical person could understand
- Relationships should describe how entities connect conceptually
- The implementation agent will extend this with additional fields as needed
- Entity names should be singular (User, Invoice, Project — not Users, Invoices)
