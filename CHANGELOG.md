# Changelog

Get notified of major releases by subscribing here:
https://buildermethods.com/design-os

## [0.1.3] - 2026-01-05

### Changed
- Replaced build-time `import.meta.glob` with runtime `fetch()` for loading product markdown and JSON files
- All page components now use async data loading pattern via `useProductData` hook

### Added
- New `useProductData` hook (`src/lib/use-product-data.ts`) for consistent async data loading across components
- Loading states for all pages while product data is being fetched

### Fixed
- Fixed markdown parsing failing on Windows due to CRLF line endings - now normalizes to LF before parsing
- Product files (overview, roadmap, data model, design system, shell spec) now hot-reload without dev server restart

### Technical Details
- `product-loader.ts`: Now uses `fetch()` with cache busting in dev mode
- `data-model-loader.ts`: Converted to async with CRLF normalization
- `design-system-loader.ts`: Converted to async for JSON loading
- `shell-loader.ts`: Spec loading now async; component loading remains build-time for bundling
- All page components updated: `ProductPage`, `SectionsPage`, `SectionPage`, `DataModelPage`, `DesignPage`, `ExportPage`, `PhaseNav`, `PhaseWarningBanner`, `ScreenDesignPage`

## [0.1.2] - 2025-12-19

- Fixed errors related to importing google fonts out of order.
- Handled sections that use '&' in their name.

## [0.1.1] - 2025-12-18

- In the export package, consolidated '01-foundation' and '02-shell' into one.
- Updated README.md tips that come in the export.

## [0.1] - 2025-12-16

- Initial release
