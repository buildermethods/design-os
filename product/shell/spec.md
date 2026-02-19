# Application Shell Specification

## Overview
Centric PLM uses a **Sidebar + Top Bar** layout — the standard for dense, enterprise-grade SaaS applications. The sidebar provides primary navigation across the five product sections plus administration, while the top bar handles global actions (search, notifications, user menu). The layout is designed to maximize content area while keeping navigation always accessible.

## Navigation Structure

### Sidebar (Primary Navigation)
- **Dashboard** → Dashboard & Reporting (default landing view)
- **Products** → Product Catalog
- **Bill of Materials** → Bill of Materials
- **Sourcing** → Sourcing & Suppliers
- **Calendar** → Calendar & Milestones

#### Sidebar Footer
- **Settings** → Admin & Configuration (tenant config, user management, workflows, attributes)

### Top Bar (Global Actions)
- **Left:** Sidebar collapse toggle + breadcrumb / current section title
- **Center:** Global search bar (search products, materials, suppliers, etc.)
- **Right:** Notification bell + User menu (avatar, name, role, logout)

## Default View / Home
The Dashboard is the default landing page but is designed as a **personalized home** rather than a static KPI page:
- **Persona-aware widgets:** Surface relevant KPIs based on user role (executive sees pipeline health, designer sees active projects, sourcer sees pending RFQs)
- **Recently accessed:** Quick links to the products, materials, or suppliers the user most recently worked on
- **Frequently used:** Surfaces the most commonly accessed items and workflows based on usage patterns
- **Activity feed:** Latest updates relevant to the user's role and assigned items

## User Menu
- **Location:** Top right corner of the top bar
- **Trigger:** Avatar + user name dropdown
- **Contents:**
  - User avatar and full name
  - Current role / persona label
  - Account settings link
  - Theme toggle (light/dark)
  - Logout

## Layout Pattern

### Structure
```
┌─────────────────────────────────────────────────┐
│  [≡]  Section Title / Breadcrumb    🔍 Search        🔔  👤 User  │
├────────┬────────────────────────────────────────┤
│        │                                        │
│  Logo  │                                        │
│        │                                        │
│  ────  │         Content Area                   │
│  Nav   │                                        │
│  Items │         (Section screen designs        │
│        │          render here)                   │
│        │                                        │
│  ────  │                                        │
│        │                                        │
│ ⚙ Set. │                                        │
│        │                                        │
├────────┴────────────────────────────────────────┤
```

### Dimensions
- **Sidebar (expanded):** 240px wide
- **Sidebar (collapsed):** 64px wide (icon-only rail)
- **Top bar:** 56px tall
- **Content area:** Fills remaining space, scrolls independently

## Sidebar Behavior

### Manual Collapse
Users can toggle the sidebar between expanded (240px with labels) and collapsed (64px icon rail) using the toggle button in the top bar. The preference persists across sessions.

### Responsive Auto-Collapse
- **Desktop (≥1280px):** Full expanded sidebar by default, user can manually collapse
- **Tablet (768px–1279px):** Auto-collapses to icon rail, user can expand temporarily as overlay
- **Mobile (<768px):** Hidden by default, opens as a full-width overlay sheet via hamburger menu

## Design Notes

### Color Application (Design Tokens)
- **Sidebar background:** `slate-900` (dark) / `slate-50` (light)
- **Active nav item:** `blue-500` text with `blue-500/10` background
- **Hover state:** `slate-700` (dark) / `slate-100` (light)
- **Top bar background:** `white` (light) / `slate-900` (dark) with subtle bottom border
- **Secondary accents:** `violet` for notification badges, status indicators

### Typography
- **Nav items:** Inter, 14px, medium weight
- **Section title:** Inter, 16px, semibold
- **User name:** Inter, 14px, medium
- **Search placeholder:** Inter, 14px, regular

### Icons
- Use Lucide React icons for all navigation items
- Icon size: 20px in expanded sidebar, 20px in collapsed rail
- Consistent stroke width across all icons

### Interactions
- Sidebar collapse/expand: 200ms ease transition
- Nav item hover: Immediate background change
- Active item: Left accent border (3px, blue-500)
- Mobile overlay: Slide-in from left with backdrop
