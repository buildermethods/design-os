# Design Shell

You are helping the user design the application shell — the persistent navigation and layout that wraps all sections. This is a screen design, not implementation code.

## Step 1: Check Prerequisites

First, verify prerequisites exist:

1. Read `/product/product-overview.md` — Product name and description
2. Read `/product/product-roadmap.md` — Sections for navigation
3. Check if `/product/design-system/colors.json` and `/product/design-system/typography.json` exist

If overview or roadmap are missing:

"Before designing the shell, you need to define your product and sections. Please run:
1. `/product-vision` — Define your product
2. `/product-roadmap` — Define your sections"

Stop here if overview or roadmap are missing.

If design tokens are missing, show a warning but continue:

"Note: Design tokens haven't been defined yet. I'll proceed with default styling, but you may want to run `/design-tokens` first for consistent colors and typography."

## Step 2: Analyze Product Structure

Review the roadmap sections and present navigation options:

"I'm designing the shell for **[Product Name]**. Based on your roadmap, you have [N] sections:

1. **[Section 1]** — [Description]
2. **[Section 2]** — [Description]
3. **[Section 3]** — [Description]

Let's decide on the shell layout. Common patterns:

**A. Sidebar Navigation** — Vertical nav on the left, content on the right
   Best for: Apps with many sections, dashboard-style tools, admin panels

**B. Top Navigation** — Horizontal nav at top, content below
   Best for: Simpler apps, marketing-style products, fewer sections

**C. Minimal Header** — Just logo + user menu, sections accessed differently
   Best for: Single-purpose tools, wizard-style flows

Which pattern fits **[Product Name]** best?"

Wait for their response.

## Step 3: Gather Design Details

Use AskUserQuestion to clarify:

- "Where should the user menu (avatar, logout) appear?"
- "Do you want the sidebar collapsible on mobile, or should it become a hamburger menu?"
- "Any additional items in the navigation? (Settings, Help, etc.)"
- "What should the 'home' or default view be when the app loads?"

## Step 4: Present Shell Specification

Once you understand their preferences:

"Here's the shell design for **[Product Name]**:

**Layout Pattern:** [Sidebar/Top Nav/Minimal]

**Navigation Structure:**
- [Nav Item 1] → [Section]
- [Nav Item 2] → [Section]
- [Nav Item 3] → [Section]
- [Additional items like Settings, Help]

**User Menu:**
- Location: [Top right / Bottom of sidebar]
- Contents: Avatar, user name, logout

**Responsive Behavior:**
- Desktop: [How it looks]
- Mobile: [How it adapts]

Does this match what you had in mind?"

Iterate until approved.

## Step 5: Create the Shell Specification

Create `/product/shell/spec.md`:

```markdown
# Application Shell Specification

## Overview
[Description of the shell design and its purpose]

## Navigation Structure
- [Nav Item 1] → [Section 1]
- [Nav Item 2] → [Section 2]
- [Nav Item 3] → [Section 3]
- [Any additional nav items]

## User Menu
[Description of user menu location and contents]

## Layout Pattern
[Description of the layout — sidebar, top nav, etc.]

## Responsive Behavior
- **Desktop:** [Behavior]
- **Tablet:** [Behavior]
- **Mobile:** [Behavior]

## Design Notes
[Any additional design decisions or notes]
```

## Step 6: Create Shell Components

Create the shell components at `src/shell/components/`:

### AppShell.tsx
The main wrapper component that accepts children and provides the layout structure.

```tsx
interface AppShellProps {
  children: React.ReactNode
  navigationItems: Array<{ label: string; href: string; isActive?: boolean }>
  user?: { name: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  onLogout?: () => void
}
```

### MainNav.tsx
The navigation component (sidebar or top nav based on the chosen pattern).

### UserMenu.tsx
The user menu with avatar and dropdown.

### index.ts
Export all components.

**Component Requirements:**
- Use props for all data and callbacks (portable)
- Apply design tokens if they exist (colors, fonts)
- Support light and dark mode with `dark:` variants
- Be mobile responsive
- Use Tailwind CSS for styling
- Use lucide-react for icons

## Step 7: Create Shell Preview

Create `src/shell/ShellPreview.tsx` — a preview wrapper for viewing the shell in Design OS:

```tsx
import data from '@/../product/sections/[first-section]/data.json' // if exists
import { AppShell } from './components/AppShell'

export default function ShellPreview() {
  const navigationItems = [
    { label: '[Section 1]', href: '/section-1', isActive: true },
    { label: '[Section 2]', href: '/section-2' },
    { label: '[Section 3]', href: '/section-3' },
  ]

  const user = {
    name: 'Alex Morgan',
    avatarUrl: undefined,
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Content Area</h1>
        <p className="text-stone-600 dark:text-stone-400">
          Section content will render here.
        </p>
      </div>
    </AppShell>
  )
}
```

## Step 8: Apply Design Tokens

If design tokens exist, apply them to the shell components:

**Colors:**
- Read `/product/design-system/colors.json`
- Use primary color for active nav items, key accents
- Use secondary color for hover states, subtle highlights
- Use neutral color for backgrounds, borders, text

**Typography:**
- Read `/product/design-system/typography.json`
- Apply heading font to nav items and titles
- Apply body font to other text
- Include Google Fonts import in the preview

## Step 9: Confirm Completion

Let the user know:

"I've designed the application shell for **[Product Name]**:

**Created files:**
- `/product/shell/spec.md` — Shell specification
- `src/shell/components/AppShell.tsx` — Main shell wrapper
- `src/shell/components/MainNav.tsx` — Navigation component
- `src/shell/components/UserMenu.tsx` — User menu component
- `src/shell/components/index.ts` — Component exports
- `src/shell/ShellPreview.tsx` — Preview wrapper

**Shell features:**
- [Layout pattern] layout
- Navigation for all [N] sections
- User menu with avatar and logout
- Mobile responsive design
- Light/dark mode support

**Important:** Restart your dev server to see the changes.

When you design section screens with `/design-screen`, they will render inside this shell, showing the full app experience.

Next: Run `/shape-section` to start designing your first section."

## Important Notes

- The shell is a screen design — it demonstrates the navigation and layout design
- Components are props-based and portable to the user's codebase
- The preview wrapper is for Design OS only — not exported
- Apply design tokens when available for consistent styling
- Keep the shell focused on navigation chrome — no authentication UI
- Section screen designs will render inside the shell's content area
