# Usage

Design OS uses slash commands to guide you through the design process. Each command is a conversation—the AI asks questions, you provide direction, and together you shape your product.

## The Design Workflow

Design OS follows a structured sequence. Each step builds on the previous one.

### Phase 1: Product Planning

Before designing any screens, establish the foundation:

1. **Product Vision** — Define what you're building and why
2. **Product Roadmap** — Break your product into sections
3. **Data Model** — Define the core entities in your system
4. **Design Tokens** — Choose colors and typography
5. **Application Shell** — Design navigation and layout

See [Product Planning](product-planning.md) for details on each command.

### Phase 2: Section Design

Once the foundation is set, work through each section:

1. **Shape the Section** — Define scope and requirements
2. **Create Sample Data** — Generate realistic data and types
3. **Design the Screen** — Build the actual React components
4. **Capture Screenshots** — Document the design (optional)

Repeat for each section in your roadmap.

See [Designing Sections](design-section.md) for details on each command.

### Phase 3: Export

When all sections are designed:

1. **Export** — Generate the complete handoff package

See [Export](export.md) for details on what's included and how to use it.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `/product-vision` | Define product name, description, problems, features |
| `/product-roadmap` | Break product into sections |
| `/data-model` | Define core entities and relationships |
| `/design-tokens` | Choose colors and typography |
| `/design-shell` | Design navigation and layout |
| `/shape-section` | Define a section's scope and requirements |
| `/sample-data` | Generate sample data and TypeScript types |
| `/design-screen` | Create screen design components |
| `/screenshot-design` | Capture screenshots |
| `/export-product` | Generate the complete handoff package |

## Tips

- **Follow the sequence** — Each step builds on the previous. Don't skip ahead.
- **Be specific** — The more detail you provide, the better the output.
- **Iterate** — Each command is a conversation. Refine until you're happy.
- **Restart the dev server** — After creating new components, restart to see changes.
