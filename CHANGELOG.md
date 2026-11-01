# Changelog

All notable changes to the Sesama UI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Full Rune icon set is now available as canonical ESM: `runeIcon(name, size)` + `RUNE_ICON_NAMES` (224 glyphs, generated from `assets/rune-icons` via `tools/build-rune-icons.mjs`, hooked into `npm run build`/`check`) — opt-in import (`sesama-ui/icons/rune-icons`) so component consumers keep the 36KB curated control set (`controlIcon`, 56 glyphs + 28 aliases, now exposing `CONTROL_ICON_NAMES`).
- Design system catalog now renders an equivalent "(ESM)" example directly below every legacy variant example, built with the canonical builders from `src/index.mjs` (`site/canonical-examples.mjs`); legacy previews remain for comparison. The Icons page now shows both sets: Basic (control icons) and Full (Rune set), with a shared search.

### Fixed
- Input fields no longer render a double focus outline (stacked inset ring + outer outline); a single inset focus ring remains.
- Message action icons use compact 20px hit areas with 14px icons and sit 8px below the message text instead of 16px.
- Recipes now use real builder signatures: badge `tone`, `statusDot({ tone, label })`, avatar initials from `name`, list row `description`, table column `header`, Select `name`/`ariaLabel`, and card `classes` (removing duplicate `class` attributes); Card gains a `classes` option.
- Popover keeps its free-form content purpose; only its typography and spacing were standardized — shared `.sx-pop-content` styling (8px padding, 8px row gap, UI font size, normal text color) now lives in base styles, and combobox loading/no-results status styling is scoped to the combobox list.
- Popover adopts the Dropdown/Combobox panel patterns: the shared `.sx-choice` choice-row pattern and thin-scrollbar treatment for `.sx-popover-options` moved into the canonical styles, panel width follows its content, and the catalog examples use the real popover structure (header, body, options list, footer with apply action).
- Breadcrumbs render crumbs with the ghost-button pattern (13px/16px medium, 26px hit area, subtle color, 11px separators) matching the legacy look and hover behavior; the list container is hardened against host page `ol` styling so crumbs never collapse into a vertical list.
- Canvas zoom rail is a transparent bar with individually raised buttons (legacy pattern) instead of a joined pill; the canvas example cards use the chip header like the legacy canvas cards.
- Button accepts the `secondary-destructive` variant in the canonical builder and type declaration, and the catalog icon-button ESM examples use the shared size variants (raised / outline size-base) so they align with legacy.
- Button icons render at Rune's designed 16px (crisp 1.5px strokes) instead of 14px, matching the legacy icon weight; xs buttons keep 12px. The catalog Sizes example shows icon+label at every size.
- Button Group defaults to the regular button size (sm, 26px) instead of base, matching legacy groups; menu buttons in the catalog use the canonical Dropdown pattern.
- Checkbox/Radio labels and choice rows no longer select their text on double-click (`user-select: none`); control icons gain the `fields` (grid-2x2 artwork) and `import` (arrow-down-to-line) aliases.
- Combobox dropdown anchors to the field shell (not the bare input) and matches the field's width via `positionOverlay(matchWidth)`, which now also caps the panel max-width to the trigger width.
- Combobox opens on focus or click (legacy behavior) with the full option list, scrolling repositions the anchored list instead of closing it, and committing/clearing no longer reopens it; option entries use canonical `data-sui-combobox-*` attributes so legacy global handlers no longer hijack them.
- Combobox status messages ("N results", "Selected …") are now a visually hidden live region (`role="status"`, `aria-live="polite"`) so the visible layout keeps a single helper line — the error — and the error is linked to the input via `aria-describedby`.
- Command Palette uses canonical `data-sui-command-*` attributes (dialog flag, input, close button, option actions, auto-connect triggers) so page-level legacy handlers no longer double-handle its typing, keyboard navigation or execution.
- Command Palette and Combobox active options use the shared background-only highlight (`--color-tint`, like menu items) instead of a blue outline ring — the focus indicator lives on the field, so the active descendant no longer draws a second one.
- Date Picker gains a `size` option (`sm` / `base` / `lg`) using the shared control-size tokens, matching Input Field heights; the trigger fills the field height and the catalog shows a Sizes example.
- Date Picker fields show human-readable dates instead of raw ISO — single `Nov 22, 2026`, range collapsed like `Nov 22 – 29, 2026` (full dates across months/years) — so dash-separated range values are no longer ambiguous. The submitted value and `getValue()` stay ISO.
- Divider catalog pairs line up: Horizontal compares as a plain line in both renders, and the labeled divider (text between two lines) is its own "With label" example instead of appearing inside Horizontal.
- Dropdown Menu placement matches legacy: the menu opens left-aligned under the trigger with a 6px gap (the shared Menu controller no longer right-aligns popovers it does not own, and legacy scroll dismissal skips canonical menus); scrolling now repositions menus instead of closing them, like the Combobox.
- Menu, Dropdown Menu and Menu Item selection ESM examples mirror the legacy grouped selection: a Visibility checkbox group and a Density radio group instead of two flat items.
- Menu Item gains a `control` option (`'check'` default trailing checkmark, `'checkbox'` / `'radio'` leading square/circle controls like legacy); check and radio selections keep the menu open — only actions and links close it.
- File Card preview no longer ignores clicks: the legacy global preview handler skipped nothing and double-toggled canonical cards; it now skips cards owned by the canonical controller (`data-sui-file-card`). The default icon preview shows the file's own icon at 80px with the legacy 120px preview height, and the catalog ESM examples match legacy (With preview expanded, Image loads a real image).
- Motion audit (Emil Kowalski's animation principles): toasts use interruptible transitions with `@starting-style` for entry and a fade-and-sink exit (`.is-leaving`) before removal instead of restarting keyframes; modals gain a 200ms rise + scale(0.97) entry, backdrop fade, and a matching fade-and-scale exit (`display`/`overlay` with `allow-discrete`; the keyboard-first command palette stays instant); popovers/menus/selects/calendars scale in from the edge facing their trigger (`data-placement` transform-origin); tab panels fade in on switch, tag chips pop in when added, and tab/collapsible transitions (including the height animation) consolidate onto the shared motion tokens. Table rows and menu items get a 140ms hover-surface transition; checkbox/radio checkmarks pop in. Reduced motion keeps opacity fades and drops movement everywhere.
- Typography parity sweep across the remaining catalog components: table cells use the meta type scale (12/16, subtle) like legacy; pill tabs and tree chevrons use the placeholder/subtle tones legacy uses; expanded tree folders no longer switch label color until selected; tree section action buttons are raised; banner titles keep the legacy 16px line height; Tool Call body labels are subtle; the catalog Loader, Skeleton and Empty State ESM examples match legacy (primary loading button, "Loading content" status label, primary clear-filters action).
- Chip defaults to the selectable (clickable) behavior like legacy; the non-interactive label is now the explicit `variant: 'static'`. Active states are tone-aware — success glows green and error glows red (ring, text and background) in both canonical and legacy styles — and chip hover no longer masks the active state.
- Collapsible content uses the subtle text color (supporting-detail role) and the catalog example renders check-icon steps without default bullets, matching legacy.
- Initials avatars default to a name-derived tinted background in both the canonical builder and the legacy bridge (image avatars stay neutral).
- Catalog ESM previews center inside their example stage; full-width block previews opt out.
- Tool Call names follow the run typography (subtle, regular) instead of a darker emphasized color.
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
