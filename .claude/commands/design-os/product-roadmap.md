# Product Roadmap

You are helping the user create or update their product roadmap for Design OS.

## Step 1: Check Current State

First, check if `/product/product-roadmap.md` exists.

---

## If Roadmap Already Exists (Updating)

Read both:
- `/product/product-overview.md`
- `/product/product-roadmap.md`

Present the current state and ask what to change:

"Your product roadmap currently has [N] sections:

1. **[Section 1]** — [Description]
2. **[Section 2]** — [Description]
3. **[Section 3]** — [Description]

What would you like to change about the sections?"

Wait for the user's response describing what they want changed. Once you receive their notes, **immediately proceed** to update `product/product-roadmap.md` based on their requested changes — do not present a draft for approval.

After updating, inform the user:

"I've updated the product roadmap based on your feedback. Review the changes and let me know if you'd like further adjustments."

Stop here — the remaining steps below are for generating a new roadmap from scratch.

---

## If No Roadmap Exists (Creating New)

### Check Prerequisites

Read `/product/product-overview.md`. If it doesn't exist:

"Before creating a product roadmap, you'll need to define your product vision. Please run `/product-vision` first."

Stop here if the product overview is missing.

### Analyze and Generate

Read the product overview and analyze:
- The core description
- The problems being solved
- The key features listed

**Immediately proceed** to create `/product/product-roadmap.md` — do not present a draft for approval. Generate 3-5 sections that represent:
- **Navigation items** - main areas of the product UI
- **Roadmap phases** - logical order for building
- **Self-contained feature areas** - each can be designed and built independently

Use this exact format:

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

### Confirm

"I've created your product roadmap at `/product/product-roadmap.md` with [N] sections:

1. **[Section 1]** — [Description]
2. **[Section 2]** — [Description]
3. **[Section 3]** — [Description]

Review the sections and let me know if you'd like to adjust anything. When you're ready, run `/data-shape` to sketch out the general shape of your product's data."

---

## Important Notes

- Sections should be ordered by development priority
- Each section should be self-contained enough to design and build independently
- Section titles become navigation items in the app
- The numbered format (`### 1. Title`) is required for parsing
- Keep descriptions to one sentence - concise and clear
- Don't create too many sections (3-5 is ideal)
- Do NOT present a draft for approval — generate the file immediately and let the user review after
- If the user requests changes after reviewing, update the file immediately
