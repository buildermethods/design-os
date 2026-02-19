# Application Shell Specification

## Overview
The Cadence shell provides a consistent navigation structure across all sections. It uses a sidebar layout optimized for a sales tool that BDs use throughout their workday, with quick access to main sections and clear visual hierarchy.

## Navigation Structure
- **Today** → BD's daily command center (default view)
- **Leads** → Full lead database
- **Dashboard** → Founder's metrics and analytics
- **Settings** → Process configuration (separated at bottom)

## User Menu
Located at the bottom of the sidebar, below Settings. Displays:
- User avatar (or initials if no avatar)
- User name
- Role badge (BD or Admin)
- Logout option in dropdown

## Layout Pattern
Sidebar navigation with:
- Fixed sidebar width (~240px) on desktop
- Logo/wordmark at top of sidebar
- Main navigation items in the middle
- Settings and User Menu at bottom (visually separated)
- Content area fills remaining horizontal space

## Responsive Behavior
- **Desktop (1024px+):** Full sidebar always visible, content area beside it
- **Tablet (768-1023px):** Collapsible sidebar with toggle button, content area expands when collapsed
- **Mobile (<768px):** Hamburger menu in header, sidebar slides in as overlay from left

## Design Notes
- Active nav item uses primary color (indigo) with background highlight
- Hover states use subtle background change
- Settings icon appears slightly muted until hovered
- Follow-up counts can display as badges on the Today nav item
- Sidebar has subtle border on the right edge
- Dark mode supported with appropriate color inversions
