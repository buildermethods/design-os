# Product Catalog Specification

## Overview
The Product Catalog is the central hub of Centric PLM — where users define, manage, and organize all products across their lifecycle. It provides configurable list views with advanced table capabilities (filtering, sorting, column configuration, multiple view modes), a quick-view side panel for previewing records, and a full-page detail view with tabbed sections for deep editing. The catalog is designed with vertical-agnostic abstractions — the data model, navigation hierarchy, and nomenclature are all tenant-configurable so fashion brands see Seasons → Styles → Colorways, food companies see Product Lines → SKUs → Formulations, and so on.

## User Flows

### List View (Primary)
- User lands on the product list view showing a configurable data table
- Table columns are tenant-configurable (product name, code, description, season, status, type, image, custom attributes)
- User can switch between view modes: table (default), card grid, and condensed list
- User can filter by any column, including custom attributes, using a filter bar
- User can sort by clicking column headers (ascending/descending toggle)
- User can configure visible columns via a column picker
- User can adjust results per page (20, 50, 100)
- User can perform global search across product names, codes, and descriptions
- Pagination with total result count ("Displaying 20 of 247 results")

### Quick-View Side Panel
- User clicks a row to open a side panel on the right showing a summary of the product
- Panel shows key fields: name, code, image, status, season, type, and a subset of custom attributes
- Panel includes quick-action buttons: Edit, Duplicate, Archive, View Full Detail
- User can navigate between records using up/down arrows while the panel is open
- Panel can be dismissed by clicking outside or pressing Escape

### Detail View (Full Page)
- User clicks "View Full Detail" (or double-clicks a row) to navigate to a full-page detail view
- Detail view has a header area with product name, code, status badge, and primary image
- Below the header, a horizontal tab bar provides access to related entities:
  - **Overview** — Core attributes, description, and key metadata
  - **Styles/Variants** — List of child styles (colorways, flavors, formulations, etc.) with their own mini-table
  - **Specifications** — Structured attributes organized into sections (dimensions, composition, packaging, etc.)
  - **Documents** — Attached files: tech packs, images, lab reports, certificates
  - **BOM** — Bill of Materials preview (links to the BOM section for full editing)
  - **History** — Audit log of changes, status transitions, and comments
- Each tab can be edited inline or via a modal form
- Breadcrumb navigation at the top to return to the list view

### Create / Edit Product
- "New Product" button in the list view toolbar opens a creation form
- Form is a modal or slide-over panel with configurable fields based on tenant's product type definition
- Required fields are validated inline
- User can save as draft or submit for review (depending on workflow configuration)
- Editing uses the same form, pre-populated with existing data

### Bulk Operations
- User can multi-select rows via checkboxes
- Bulk action toolbar appears with options: Change Status, Edit Attribute, Duplicate, Export, Archive
- Confirmation dialog for destructive actions
- Progress indicator for bulk operations

### Compare & Review
- User can select 2-4 products/styles and trigger a side-by-side comparison view
- Comparison shows key attributes in a column layout, highlighting differences
- Review workflow: products can be submitted for approval, and reviewers see a review panel with approve/reject/comment actions

## UI Requirements
- Configurable data table with sortable columns, column filters, and column picker
- View mode switcher: table view, card/grid view, condensed list view
- Filter bar with support for text, select, date range, and boolean filter types
- Pagination with configurable page size and total count display
- Quick-view side panel (right drawer) for record preview
- Full-page detail view with horizontal tab navigation
- Breadcrumb navigation for hierarchical drill-down
- Multi-select with bulk action toolbar
- Inline status badges with color coding (Draft, In Review, Approved, Manufacturing, Archived)
- Image thumbnails in table rows and detail views
- Responsive: table scrolls horizontally on mobile, side panel becomes full-screen
- Empty states for new tenants with no products yet
- Loading skeletons for data fetching states

## Configuration
- shell: false
