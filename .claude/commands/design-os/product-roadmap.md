# Product Roadmap

You are helping the user create or update their product roadmap for Design OS. This command serves two purposes:

1. **Create** an initial roadmap if one doesn't exist
2. **Sync** changes if the user has manually edited the markdown files

## Step 1: Check Current State

First, check if `/product/product-roadmap.md` exists and read `/product/product-overview.md` if it exists.

---

## If No Roadmap Exists (Creating New)

### Analyze the Product Overview

Read the product overview and analyze:
- The core description
- The problems being solved
- The key features listed

### Propose Sections

Based on your analysis, propose 3-5 sections that represent:
- **Navigation items** - main areas of the product UI
- **Roadmap phases** - logical order for building
- **Self-contained feature areas** - each can be designed and built independently

Present your proposal:

"Based on your product overview, I'd suggest breaking this into these sections:

1. **[Section Title]** - [One sentence description]
2. **[Section Title]** - [One sentence description]
3. **[Section Title]** - [One sentence description]

These are ordered by importance and logical development sequence. The first section would be the core functionality, with each subsequent section building on it."

Then use the AskUserQuestion tool to ask the user: "Does this breakdown make sense? Would you like to adjust any sections or their order?"

### Refine with User

Iterate on the sections based on user feedback. Ask clarifying questions:
- "Should [feature X] be its own section or part of [Section Y]?"
- "What would you consider the most critical section to build first?"
- "Are there any major areas I'm missing?"

### Create the File

Once approved, create `/product/product-roadmap.md` with this exact format:

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

"I've created your product roadmap at `/product/product-roadmap.md`. The homepage now shows your [N] sections:

1. **[Section 1]** — [Description]
2. **[Section 2]** — [Description]
3. **[Section 3]** — [Description]

**Next step:** Run `/data-model` to define the core entities and relationships in your product. This establishes a shared vocabulary that keeps your sections consistent."

---

## If Roadmap Already Exists (Syncing)

### Read Current Files

Read both:
- `/product/product-overview.md`
- `/product/product-roadmap.md`

### Report Current State

"I see you already have a product roadmap defined with [N] sections:

1. [Section 1 Title]
2. [Section 2 Title]
...

What would you like to do?
- **Update sections** - Add, remove, or reorder sections
- **Sync from files** - I'll re-read the markdown files and confirm everything is in sync
- **Start fresh** - Regenerate the roadmap based on the current product overview"

### Handle User Choice

**If updating sections:**
Ask what changes they want to make, then update the file accordingly.

**If syncing:**
Confirm the current state matches what's in the files. If the user has manually edited the `.md` files, let them know the app will pick up those changes on next build/refresh.

**If starting fresh:**
Follow the "Creating New" flow above, but note you're replacing the existing roadmap.

---

## Important Notes

- Sections should be ordered by development priority
- Each section should be self-contained enough to design and build independently
- Section titles become navigation items in the app
- The numbered format (`### 1. Title`) is required for parsing
- Keep descriptions to one sentence - concise and clear
- Don't create too many sections (3-5 is ideal)
