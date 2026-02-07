# Tech Stack & Architecture

You are helping the user define the technology choices and architecture for their product. This establishes the "how" — the tools, frameworks, and structural patterns that will power the product.

## Step 1: Check Prerequisites

First, verify that the product overview and roadmap exist:

1. Read `/product/product-overview.md` to understand what the product does
2. Read `/product/product-roadmap.md` to understand the planned sections
3. Read `/product/data-model/data-model.md` if it exists, for entity context

If the product overview is missing, let the user know:

"Before defining your tech stack, you'll need to establish your product vision. Please run `/product-vision` first."

Stop here if the prerequisite is missing.

## Step 2: Gather Initial Input

Review the product overview, roadmap, and data model, then present your initial analysis:

"Based on your product — **[Product Name]** — I'll help you choose the right technologies and define the architecture.

Let's cover:
1. **Technology Choices** — Frontend, backend, database, hosting, etc.
2. **Architecture Layers** — How the system is organized
3. **Architecture Diagram** — A visual overview

Do you already have preferences for any technologies (e.g., React, Node.js, PostgreSQL), or would you like me to suggest a stack based on your product requirements?"

Wait for their response before proceeding.

## Step 3: Define Technology Choices

Walk through each category with the user. For each, suggest options based on the product type:

**Categories to cover:**
- **Frontend Framework** — React, Vue, Svelte, Next.js, etc.
- **Backend/API** — Node.js, Python/Django, Go, serverless functions, etc.
- **Database** — PostgreSQL, MongoDB, SQLite, Supabase, etc.
- **Hosting/Infrastructure** — Vercel, AWS, Railway, Fly.io, etc.
- **Authentication** — Auth0, Clerk, Supabase Auth, NextAuth, etc.
- **Styling** — Tailwind CSS, CSS Modules, Styled Components, etc.

For each category, use AskUserQuestion to ask:

"For **[Category]**, I'd suggest **[Choice]** because [rationale based on product needs].

Other options to consider:
- [Alternative 1] — [brief rationale]
- [Alternative 2] — [brief rationale]

What would you prefer?"

Only include categories that are relevant to the product. Skip categories that don't apply.

## Step 4: Define Architecture Layers

Based on the chosen technologies, propose architecture layers:

"Here's how I'd structure your architecture:

**[Layer 1 Name]** — [Description]
- [Component 1]
- [Component 2]

**[Layer 2 Name]** — [Description]
- [Component 1]
- [Component 2]

Common layers include:
- **Presentation** — UI components, pages, routing
- **Application** — Business logic, state management, API clients
- **API** — REST/GraphQL endpoints, middleware, validation
- **Data** — Database models, migrations, seed data
- **Infrastructure** — Hosting, CI/CD, monitoring

Does this structure make sense for your product?"

Use AskUserQuestion to refine.

## Step 5: Create Architecture Diagram

Create a simple ASCII architecture diagram showing how the layers connect:

"Here's a high-level view of your architecture:

```
[Browser] → [Frontend (React)] → [API (Node.js)] → [Database (PostgreSQL)]
                                       ↓
                                 [Auth (Clerk)]
                                 [Storage (S3)]
```

Does this capture the main flow?"

## Step 6: Present Final Choices and Confirm

Present the complete tech stack for approval:

"Here's your complete tech stack and architecture:

**Technology Choices:**
- **Frontend:** [Choice] — [Rationale]
- **Backend:** [Choice] — [Rationale]
- **Database:** [Choice] — [Rationale]
[etc.]

**Architecture:**
[Layer summary]

**Diagram:**
[ASCII diagram]

Ready to save?"

## Step 7: Create the File

Once approved, create the file at `/product/tech-stack/tech-stack.md` with this exact format:

```markdown
# Tech Stack & Architecture

## Technology Choices

### [Category]
**Choice:** [Technology Name]
**Rationale:** [Why this choice fits the product]

### [Category]
**Choice:** [Technology Name]
**Rationale:** [Why this choice fits the product]

[Add more categories as needed]

## Architecture

### [Layer Name]
[Description of this layer's responsibility]
- [Component 1]
- [Component 2]

### [Layer Name]
[Description of this layer's responsibility]
- [Component 1]
- [Component 2]

[Add more layers as needed]

## Architecture Diagram
```
[ASCII diagram here]
```
```

**Important:** The format with `### Category`, `**Choice:**`, and `**Rationale:**` must match exactly for the app to parse it correctly.

## Step 8: Confirm Completion

Let the user know:

"I've created your tech stack definition at `/product/tech-stack/tech-stack.md`.

**Technologies chosen:**
- [List key choices]

**Architecture layers:**
- [List layers]

This provides a clear technical foundation for your product. The implementation agent will use these choices when building your app.

Next step: Run `/cost-estimator` to estimate infrastructure and service costs based on your tech stack."

## Important Notes

- Suggest technologies that match the product's complexity — don't over-engineer simple products
- Consider the user's experience level — suggest well-documented, widely-adopted tools when possible
- Keep the architecture layers practical — 3-5 layers is ideal
- The ASCII diagram should be simple and readable
- Focus on the "what" and "why", not detailed configuration
- Don't include pricing in the tech stack — that's for the cost estimator
