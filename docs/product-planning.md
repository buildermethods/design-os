# Product Planning

The first phase of Design OS establishes the foundation for your product. Complete these steps before designing any screens.

## 1. Product Vision

```
/product-vision
```

Define your product's core identity. This is a conversational process where you'll establish:

- **Product name** — A clear, memorable name
- **Description** — 1-3 sentences capturing the essence
- **Problems & solutions** — What pain points you're addressing and how
- **Key features** — The main capabilities that make this possible

Share any notes, ideas, or rough thoughts you have about what you're building. The AI will ask clarifying questions and help you refine everything into a clear product overview.

**Creates:** `product/product-overview.md`

## 2. Product Roadmap

```
/product-roadmap
```

Break your product into 3-5 sections. Each section represents:

- A navigation item in your app's UI
- A self-contained feature area that can be designed and built independently
- A logical phase of your development roadmap

Based on your product overview, the AI will propose sections and discuss ordering. Sections are sequenced by development priority—the first section is your core functionality, with each subsequent section building on it.

**Creates:** `product/product-roadmap.md`

## 3. Data Model

```
/data-model
```

Define the core entities in your product—the "nouns" of your system. What are the main things users create, view, and manage?

The focus is conceptual, not technical:

- **Entity names** — User, Project, Invoice, Task, etc.
- **Plain-language descriptions** — What each entity represents
- **Relationships** — How entities connect to each other

Don't worry about database schemas or field types. Keep it minimal. The implementation agent will extend the model with additional details as needed.

**Creates:** `product/data-model/data-model.md`

## 4. Design Tokens

```
/design-tokens
```

Choose your visual identity:

### Colors

Select from Tailwind's built-in color palette:

- **Primary** — Main accent for buttons, links, key actions (e.g., `blue`, `indigo`, `emerald`, `lime`)
- **Secondary** — Complementary accent for tags, highlights (e.g., `violet`, `amber`, `teal`)
- **Neutral** — Backgrounds, text, borders (e.g., `slate`, `gray`, `zinc`, `stone`)

### Typography

Select from Google Fonts:

- **Heading** — For titles and section headers (e.g., `DM Sans`, `Inter`, `Space Grotesk`)
- **Body** — For paragraphs and UI text (e.g., `Inter`, `Source Sans 3`, `Nunito Sans`)
- **Mono** — For code and technical content (e.g., `JetBrains Mono`, `Fira Code`)

The AI will suggest options based on your product type and help you find a combination that fits.

**Creates:** `product/design-system/colors.json`, `product/design-system/typography.json`

## 5. Application Shell

```
/design-shell
```

Design the persistent navigation and layout that wraps all your sections. Choose from common patterns:

- **Sidebar Navigation** — Vertical nav on the left, content on the right. Best for dashboard-style tools, admin panels, apps with many sections.
- **Top Navigation** — Horizontal nav at top, content below. Best for simpler apps, marketing-style products, fewer sections.
- **Minimal Header** — Just logo + user menu. Best for single-purpose tools, wizard-style flows.

You'll also define:

- User menu placement and contents
- Responsive behavior (how it adapts on mobile)
- Any additional nav items (Settings, Help, etc.)

The shell is implemented as React components that will wrap your section screen designs.

**Creates:**
- `product/shell/spec.md` — Shell specification
- `src/shell/components/AppShell.tsx` — Main shell wrapper
- `src/shell/components/MainNav.tsx` — Navigation component
- `src/shell/components/UserMenu.tsx` — User menu component
- `src/shell/ShellPreview.tsx` — Preview wrapper for Design OS

## What's Next

With the foundation established, you're ready to design individual sections. See [Designing Sections](design-section.md) for the next steps.
