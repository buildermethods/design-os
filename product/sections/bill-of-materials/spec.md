# Bill of Materials Specification

## Overview
The Bill of Materials (BOM) section provides a comprehensive, multi-mode interface for defining, managing, and costing the hierarchical breakdown of materials, components, and packaging required to manufacture products and styles. It is accessible both as a top-level section (for cross-product BOM management, comparison, and reporting) and contextually from within the Product Catalog's detail view. BOM types follow a tiered approach: universal core types (Design, Manufacturing, Sourcing) ship as defaults, with full tenant configurability to modify defaults, rename types, and add vertical-specific subtypes.

## User Flows

### BOM List (Top-Level Section)
- View all BOMs across products and styles in a searchable, filterable data table
- Filter by BOM type, subtype, status, product, season, cost range, and assignee
- Sort by any column; configure visible columns per user preference
- Bulk actions: change status, export, compare, duplicate, archive
- Quick-view panel for BOM summary without leaving the list
- Deep-link into a specific BOM from anywhere in the application

### BOM Editor (Multi-Mode)
- **Tree + Table mode**: Collapsible tree view on the left showing the material hierarchy; editable detail table on the right for the selected node — quantities, units, costs, supplier, notes
- **Inline hierarchical table mode**: A single dense data table with expandable/collapsible rows showing parent-child nesting via indentation — familiar for power users who prefer a flat, scannable view
- **Visual diagram mode**: A node-and-edge canvas showing material relationships, quantities, and cost flow — ideal for understanding structure at a glance and for presentations/reviews
- Users can switch between modes at any time; all modes reflect the same underlying data
- Drag-and-drop reordering within the tree and table modes
- Inline editing of quantities, units, costs, and supplier assignments
- Add line items from a material library, by search, or by manual entry
- Nest line items to create sub-assemblies and grouped components

### BOM Creation
- Create a new BOM from scratch, from a template, or by copying an existing BOM
- Select BOM type (Design, Manufacturing, Sourcing, or tenant-configured types) and subtype
- Associate the BOM with a specific product or style
- Import BOM data from CSV/Excel

### Cost Management (Full Costing Engine, Progressively Disclosed)
- **Simple rollup (default)**: Each line item has a unit cost; BOM auto-calculates total cost by summing (quantity × unit cost) up the hierarchy
- **Multi-source costing**: Each material can have costs from multiple suppliers; users pick the active source and the rollup reflects the selected sourcing scenario
- **Full landed cost**: Material cost + labor + overhead + shipping + duties/tariffs per line item, with rollups at every hierarchy level
- **Cost scenarios**: Best case / worst case / expected cost projections; toggle between scenarios to see impact on total BOM cost
- **What-if analysis**: Duplicate a BOM, change materials or suppliers, and compare cost impact side-by-side
- Progressive disclosure: simple rollup shown by default; advanced costing features revealed based on user persona, permissions, and feature flags
- Cost history tracking — see how costs have changed over time per line item and per BOM

### Version History & Comparison
- Full version history for every BOM — who changed what, when, and why
- Compare any number of BOM versions side-by-side with a visual diff
- Highlight added, removed, and changed line items between versions
- Show cost impact of changes (delta per line item and total)
- Restore a previous version or fork a new BOM from any historical version

### Approval Workflows (Full Workflow Engine)
- Configurable approval chains: e.g., Design Lead → Cost Engineer → Sourcing Manager
- Parallel and sequential approval paths
- Conditional routing based on cost thresholds, BOM type, or custom rules
- Auto-notifications at each approval stage
- Escalation rules for overdue approvals
- Status lifecycle: Draft → In Review → Approved → Locked (with configurable additional states)
- Approval for changes above cost thresholds — any material cost change exceeding a configured delta triggers re-approval
- Comments, annotations, and sign-off at each approval gate

### BOM Comparison (Cross-BOM)
- Compare any number of BOMs side-by-side — across products, styles, versions, or BOM types
- Visual diff of line items: additions, removals, quantity changes, cost changes
- Summary metrics: total cost delta, material count differences, supplier overlap
- Export comparison as PDF or spreadsheet for review meetings

## UI Requirements
- **Multi-mode editor**: Tree+Table, Inline Hierarchical Table, and Visual Diagram as switchable view modes in the BOM detail/editor
- **BOM list view**: Configurable data table with the same patterns as the Product Catalog (sorting, filtering, column picker, view modes, bulk actions, pagination)
- **Quick-view panel**: Right-side sliding panel for BOM summary from the list view (consistent with Product Catalog pattern)
- **Full detail view**: Tabbed layout — Overview, Line Items (multi-mode editor), Costing, Documents, Approval History, Version History
- **Cost dashboard**: Summary cards at the top of the BOM showing total cost, material cost, labor cost, and cost trend sparkline — progressively disclosed based on costing level
- **Inline editing**: Edit quantities, costs, suppliers, and notes directly in the tree and table views without modal dialogs
- **Drag-and-drop**: Reorder and reparent line items in tree and table modes
- **Comparison view**: Multi-column layout for side-by-side BOM comparison with color-coded diffs
- **Feature flags**: Costing complexity, approval workflow depth, and view mode availability controlled by feature flags and user persona/permissions
- **Responsive**: Full functionality on desktop; simplified tree view on tablet; read-only summary on mobile
- **Light & dark mode**: Full support using design tokens

## Configuration
- shell: true
