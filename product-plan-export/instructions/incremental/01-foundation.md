# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan-export/design-system/tokens.css` for CSS custom properties
- See `product-plan-export/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan-export/design-system/fonts.md` for Google Fonts setup

**Colors:**
- Primary: `indigo` — Buttons, links, active states
- Secondary: `amber` — Hot badges, warnings, highlights
- Neutral: `slate` — Backgrounds, text, borders

**Typography:**
- Heading & Body: Inter (400, 500, 600, 700)
- Mono: JetBrains Mono (400, 500)

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan-export/data-model/types.ts` for interface definitions
- See `product-plan-export/data-model/README.md` for entity relationships

**Core entities to implement:**
- User (BD, Admin, Founder roles)
- Lead (with score, qualification, stage)
- Call (call attempts and outcomes)
- FollowUp (scheduled follow-up tasks)
- Stage (pipeline stages)
- DropReason (loss reasons for analytics)
- Pipeline (stage containers)

### 3. Routing Structure

Create placeholder routes for each section:

| Route | Section | Description |
|-------|---------|-------------|
| `/` or `/today` | Today | BD's daily command center (default) |
| `/leads` | Leads | Full lead database |
| `/leads/:id` | Lead Detail | Full-page lead view (optional) |
| `/dashboard` | Dashboard | Founder's metrics |
| `/settings` | Settings | Process configuration |

### 4. Application Shell

Copy the shell components from `product-plan-export/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with sidebar
- `MainNav.tsx` — Navigation component
- `UserMenu.tsx` — User menu with avatar and logout

**Wire Up Navigation:**

Connect navigation to your routing:

| Nav Item | Route | Icon |
|----------|-------|------|
| Today | `/today` | Calendar/Home |
| Leads | `/leads` | Users/Database |
| Dashboard | `/dashboard` | Chart/Analytics |
| Settings | `/settings` | Cog/Settings |

**User Menu:**

The user menu expects:
- User name
- User role (BD, Admin, Founder)
- Avatar URL (optional, shows initials if null)
- Logout callback

**Responsive Behavior:**
- Desktop (1024px+): Full sidebar always visible
- Tablet (768-1023px): Collapsible sidebar with toggle
- Mobile (<768px): Hamburger menu, sidebar slides in as overlay

## Files to Reference

- `product-plan-export/design-system/` — Design tokens (colors, fonts)
- `product-plan-export/data-model/` — Type definitions and relationships
- `product-plan-export/shell/README.md` — Shell design intent
- `product-plan-export/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (colors, fonts loading)
- [ ] Data model types are defined
- [ ] Routes exist for all sections (can be placeholder pages)
- [ ] Shell renders with sidebar navigation
- [ ] Navigation links to correct routes
- [ ] Active nav item is highlighted
- [ ] User menu shows user info
- [ ] Logout callback works
- [ ] Responsive on mobile (hamburger menu works)
- [ ] Dark mode toggle works (if implementing)
