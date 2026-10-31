# Changelog

All notable changes to the Sesama UI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Design system catalog now renders a "Canonical (ESM)" example for every component and block page (legacy examples remain for comparison); see `site/canonical-examples.mjs`.

### Fixed
- Input fields no longer render a double focus outline (stacked inset ring + outer outline); a single inset focus ring remains.
- Message action icons use compact 20px hit areas with 14px icons and sit 8px below the message text instead of 16px.
- Recipes now use real builder signatures: badge `tone`, `statusDot({ tone, label })`, avatar initials from `name`, list row `description`, table column `header`, Select `name`/`ariaLabel`, and card `classes` (removing duplicate `class` attributes); Card gains a `classes` option.
- Removed native browser tooltips (`title` attributes) from Sidebar, Composer, Message and File Card controls; accessible names remain via `aria-label`.
- People List rows use the plain appearance (no card background inside bordered sections).
- Chart hover info is placed beside the hovered point, bar top or donut segment instead of covering it; donut segments highlight on hover.
- AI agents demo sidebar collapse keeps main content visible and animates like the dashboard app shell.

## [0.1.0-alpha.2] - 2026-10-31

### Changed
- First npm publication of the package (`sesama-ui`); `0.1.0-alpha.1` was never published — its registry stage blocked republishing under the same version.

## [0.1.0-alpha.1] - 2026-10-31

### Added
- **Modern ESM Architecture**:
  - Pure functional HTML string builders for all 48 components and 20 structural blocks.
  - Full DOM-free rendering capability for SSR, build-time, and client-side usage.
  - Centralized hydration runtime (`mount`) with controller registry, reference counting, and session lifecycles (`refresh`, `destroy`).
  - Strict CSS scoping under `:where(.sui-root)` across all component and block stylesheets.
- **Component Implementations (P0–P7)**:
  - Phase P0: Button, Input, Input Field, Select, Modal.
  - Phase P1: Badge, Status Dot, Avatar, Label, Divider, Card, Banner, Empty State, Loader, Skeleton, Scroll Area.
  - Phase P2: Checkbox, Radio, Switch, Input Area (Textarea), Chip.
  - Phase P3: Menu Item, Menu, Popover, Dropdown Menu, Tooltip, Toast, Button Group, Command Palette.
  - Phase P4: Combobox, Date Picker, Tag Input, Tabs, Breadcrumbs.
  - Phase P5: Tree, Tree Item, Tree Section, List Row, Toolbar, Collapsible, Table, Pagination.
  - Phase P6: Chart, Wire, Canvas.
  - Phase P7: File Card, File Attachment, Message, Tool Call, Agent Run, Composer.
- **Structural Blocks & Recipes (P8)**:
  - Page layout blocks: `appShell`, `workspaceSidebar` / `sidebar`, `pageHeader`, `pageLayout`, `pageGrid`.
  - Content blocks: `contentSection`, `dataSection`, `metricCard`, `metricSummary`, `peopleList`, `activityFeed`, `chartSection`.
  - Domain recipes: `dashboardOverviewRecipe`, `revenueChartRecipe`, `dataWorkspaceRecipe`, and skill/resource dialog recipes.
- **Packaging & Developer Experience (P10)**:
  - Configured root and per-component subpath exports in `package.json` (`sesama-ui`, `sesama-ui/button`, `sesama-ui/blocks`, `sesama-ui/icons`, `sesama-ui/runtime`, `sesama-ui/css/*`).
  - Complete TypeScript declarations (`.d.mts`) for all 48 components, blocks, icons, and runtime.
  - Comprehensive packaging test suite in `tests/package.test.mjs` verifying export targets and `npm pack --dry-run`.
  - Clean consumer integration test suite in `tests/consumer.test.mjs`.
  - Repository starter and agent skill updated in `skills/sesama-ui/`.
  - Added `NOTICE` and attribution for Rune Icons and Inter font.

### Changed
- Migrated all application demos (`Login.html`, `Dashboard overview.html`, `Revenue report.html`, `Orders.html`, `Customers.html`, `Workspace demo.html`, `Issue workspace.html`, `AI agents demo.html`) from legacy global scripts to canonical public ESM imports and modern stylesheets.
- Replaced monolithic `library.css` with modular `components.css` and `blocks.css`.

### Deprecated
- Monolithic script globals (`SESAMA_UI`, `SESAMA_BLOCKS`, `SESAMA_CHARTS`) are now legacy bridge artifacts generated from canonical source modules.
