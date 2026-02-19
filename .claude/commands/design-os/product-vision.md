# Product Vision

You are helping the user define their product vision for Design OS. This is a conversational process that results in three files: the product overview, product roadmap, and data shape.

## Step 1: Gather Initial Input

First, ask the user to share their raw notes, ideas, or thoughts about the product they want to build. Be warm and open-ended:

"I'd love to help you define your product vision. Tell me about the product you're building - share any notes, ideas, or rough thoughts you have. What problem are you trying to solve? Who is it for? Don't worry about structure yet, just share what's on your mind."

Wait for their response before proceeding.

## Step 2: Ask Clarifying Questions

After receiving their input, use the AskUserQuestion tool to ask targeted questions covering all three areas. Ask questions one or two at a time, conversationally, with follow-ups as needed.

### Product Vision Questions

Shape the core product definition:

- **The product name** - A clear, concise name for the product
- **The core product description** (1-3 sentences that capture the essence)
- **The key problems** the product solves (1-5 specific pain points)
- **How the product solves each problem** (concrete solutions)
- **The main features** that make this possible

**Important:** If the user hasn't already provided a product name, ask them:
- "What would you like to call this product? (A short, memorable name)"

Example questions (adapt based on their input):
- "Who is the primary user of this product? Can you describe them?"
- "What's the single biggest pain point you're addressing?"
- "How do people currently solve this problem without your product?"
- "What makes your approach different or better?"
- "What are the 3-5 most essential features?"

### Roadmap Questions

Identify the main areas/sections of the product:

- "What are the main areas or screens of this product? (e.g., Dashboard, Settings, Invoices)"
- "What would you consider the most critical area to build first?"
- "Are there any areas that should be separate from the core functionality?"

### Data Shape Questions

Identify the core entities ("nouns") of the product:

- "What are the main 'things' users will create, view, or manage in this product? (e.g., Projects, Invoices, Clients)"
- "How do these things relate to each other?"

The goal is to gather enough information for all three files before proceeding. Don't need exhaustive detail on every entity — just the core nouns and their relationships.

## Step 3: Auto-Proceed — Create All Three Files

Once you have enough information from the clarifying questions, **immediately proceed** without asking for approval. Write all three files uninterrupted:

### 3a: Create Product Overview

Create the file at `/product/product-overview.md` with this exact format:

```markdown
# [Product Name]

## Description
[The finalized 1-3 sentence description]

## Problems & Solutions

### Problem 1: [Problem Title]
[How the product solves it in 1-2 sentences]

### Problem 2: [Problem Title]
[How the product solves it in 1-2 sentences]

[Add more as needed, up to 5]

## Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]
[Add more as needed]
```

**Important:** The `# [Product Name]` heading at the top is required - this is what displays as the card title in the app.

### 3b: Create Product Roadmap

Create `/product/product-roadmap.md` with this exact format:

```markdown
# Product Roadmap

## Sections

### 1. [Section Title]
[One sentence description]

### 2. [Section Title]
[One sentence description]

### 3. [Section Title]
[One sentence description]
```

Sections should be:
- Ordered by development priority
- Self-contained enough to design and build independently
- 3-5 sections (ideal range)
- The numbered format (`### 1. Title`) is required for parsing

### 3c: Create Data Shape

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

Keep descriptions minimal — focus on what each entity represents, not every field it contains. Entity names should be singular (User, Invoice, Project — not Users, Invoices).

### 3d: Inform the User

After all three files are created, present a summary:

"I've set up the foundation for **[Product Name]**:

1. **Product Overview** — `product/product-overview.md`
2. **Product Roadmap** — `product/product-roadmap.md` ([N] sections)
3. **Data Shape** — `product/data-shape/data-shape.md` ([N] entities)

**Sections:**
1. **[Section 1]** — [Description]
2. **[Section 2]** — [Description]
3. **[Section 3]** — [Description]

**Core Entities:** [Entity1], [Entity2], [Entity3]

Review these files and let me know if you'd like to adjust anything. When you're ready, run `/design-tokens` to choose your color palette and typography, or `/shape-section` to start designing a section."

## Important Notes

- Be conversational and helpful, not robotic
- Ask follow-up questions when answers are vague
- Help the user think through their product, don't just transcribe
- Keep the final output concise and clear
- The format must match exactly for the app to parse it correctly
- **Always ensure the product has a name** - if user didn't provide one, ask for it
- Do NOT present a draft for approval — go straight to writing all three files after gathering enough info
- If the user requests changes after reviewing, update the relevant files immediately
