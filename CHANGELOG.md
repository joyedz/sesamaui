# Changelog

## [0.1.0] - 2026-11-04

- Modal focus fix: opening a dialog no longer lands focus on the header close button (whose icon-button tooltip would pop every time). `showModal()` is followed by an explicit focus move — `[autofocus]` target first, then the first control that is not the close button, then the dialog element itself. Existing defaults are unchanged for dialogs with an `autofocus` target.

First stable release — the `-alpha` suffix is dropped from the package version, and `npm publish` now tags `latest`. Pre-releases: [0.1.0-alpha.2](#0100-alpha2---2026-10-31), [0.1.0-alpha.1](#0100-alpha1---2026-10-31). While on 0.x, minor versions may still carry breaking changes; experimental components are labeled in the README, and the manual screen-reader review remains scheduled before 1.0 (see [docs/RELEASE.md](docs/RELEASE.md)).

- `npm run dev` now serves a generated index at `/` listing every demo by category plus the component catalog and Component API preview links (scanned from `demos/` at request time). The project landing page is untracked (`site/Sesama landing.html` and its assets are gitignored); the browser smoke suite skips missing pages so CI works without it.

- Reorganize `demos/` into category folders — `dashboard/`, `ai-agent/`, `ai-bot/` (formerly `agent-bot/`), `issue/`, `onboarding/` — with the Component API preview staying at the root; the standalone Workspace demo is removed. Demo routes in `shared/pages.mjs`, cross-page links, test paths, and docs are updated to match.

- Issue Workspace demo keeps its App Shell and sidebar mounted across view changes: switching menus, opening issues, and tab/filter changes now swap only the main column (selection updates in place), removing the per-menu sidebar reload. The four category pages (Inbox, My issues, Review, All issues) also switch in page via `?page=` URLs instead of full page loads, with Back/Forward restoring the right section.

- AI Agent demo opens the agent directory as an in-page overlay on both the chat and directory pages — 'All agents', 'New chat', and starting an agent no longer trigger full page loads, so the sidebar never reloads when switching menus.

- Slim the design system catalog's App Shell example down to sidebar + header only, dropping the inner page layout/table composition so the preview focuses on the shell itself. App Shell height becomes configurable via `--shell-height` (default `100dvh`), fixing the preview overflowing its 420px stage.

- Fix flaky axe color-contrast false positives in the accessibility suite: modal/popup entry opacity fades were still running when axe sampled colors (fg and bg both composited through partial opacity, e.g. 4.18:1 instead of the real ~6:1). The suite now waits for open overlays to reach settled opacity (plus `animate: false`) before auditing.

- **Breaking:** remove the seven unused domain recipes — `requirementGroupRecipe`, `resourceListRecipe`, `createSkillDialogRecipe`, `deleteResourceRecipe`, `dashboardOverviewRecipe`, `revenueChartRecipe`, and `dataWorkspaceRecipe`. Compose the same layouts from the structural/content blocks instead. `agentCardRecipe` remains; the design system catalog drops the corresponding block entries and their example pages.

- Add a Compact rail example to the design system catalog's Workspace Sidebar page, rendered by the canonical `workspaceSidebar` builder with `variant: 'compact'` and icon-button rail navigation (the pattern used by Agent Bot).

- Design system catalog Blocks pages now render their examples exclusively from the canonical ESM builders (`src/blocks/*`), replacing the previous legacy-first previews with appended ESM comparisons. Legacy examples remain only as a fallback for block entries without a canonical example map.

- Standardize the five automatic avatar palettes across ESM and legacy demos. Initials use paired foreground and background colors for each theme, with a thin tinted edge to distinguish the avatar from hovered or selected rows.

- Cap Agent Bot conversation and composer layouts at 880px. Add ten-message example conversations for each agent with sample tool runs, comparison tables, code, evidence gaps, and source notes. Existing saved chats/drafts are retained; examples migrate once. Live simulated replies use the same structured response renderer with escaped text.

- Keep Agent Bot run details and responses in one compact turn: 8px spacing, matching run/bubble widths, and artifacts after the response. Add shared `--agent-run-margin` and `--message-bubble-width` layout variables while preserving component defaults.

- Agent sidebar search fills the navigation width, uses the placeholder Search, and includes the shared search icon. Input/Input Field accepts an optional leading `icon`; sidebar navigation removes the standalone form's width cap.

- Add original transparent 3D bot portraits for Atlas, Forge, and Scout in Agent Bot's sidebar, primary tabs, and settings. Tabs accepts a trusted `leading` slot for central Avatar markup; Avatar exposes `--avatar-background` while preserving existing defaults.

- Replace Agent Bot's Launch workspace selector with persistent chat tabs in the header. A plus button beside the pill tabs opens a new chat; new chat tabs use a symmetric left/right fork icon; existing threads/drafts stay available. Page Header supports trusted `titleContent`; Tabs can reference an application-managed shared `panelId`.

- Agent sidebar groups now use shared Tree section folders with trailing folder icons, flush search alignment, expand/collapse, and locally saved group state. Tree supports optional section layout and trusted rich branch content; default tree items are unchanged.

- Tighten Agent Bot sidebar spacing, remove the empty secondary-section heading, and align role badges beside agent names so message previews retain their width. List Row supports escaped `titleBadge` text and copy-gap/title-weight layout variables; existing row defaults are preserved.

- Agent Bot's left navigation now consumes Workspace Sidebar `variant: 'compact'`: permanent collapsed Tree geometry, no expand control or hover/focus expansion. The adjacent agent list remains a separate panel; mobile opens it from the conversation header.

- Align Agent Bot with the supplied conversation workspace reference: persistent icon rail, wide agent sidebar with message previews and search, dark neutral surfaces, compact header/model picker, incoming/outgoing message bubbles, and a full-width compact composer. Keep the three-feature scope and saved work.
- Add optional App Shell `rail`, Workspace Sidebar `variant: 'conversation'`, Composer `compact` / `showContext` / `showModel` / trusted `leading` slot, and Message `appearance: 'bubble'`. Existing defaults stay unchanged. Shared shell/header, avatar-radius, and list-row layout variables support the composition centrally.
- Popover resolves its explicit content panel before nested tooltip popovers, so an Icon Button trigger can retain its tooltip without opening the wrong panel.

- Add a separate ESM Agent Bot demo with persistent agent chat, tasks, and settings. Include staged local responses, cancellation/retry/interrupted-run recovery, sample pricing approval, and brief preview/download. Register it in the landing Demo menu while preserving the existing AI demos.

- Workspace Sidebar accepts `projectsTitle` to label its secondary navigation section (default: Projects); Agent Bot uses Your team. Existing sidebar defaults are preserved.

- File Card exposes `--file-card-max-width` (default 250px) so document previews can use their container width without page-level component overrides.

- Adapt supplied Linear references into Issue Workspace: personal issue tabs and status groups, Reviews split view, initiative hierarchy table, and Projects roadmap with filters. Use central Sesama controls, a consistent current user, and shared issue detail structure. Keep review/code and roadmap data local to the demo.

- App Shell automatically collapses its sidebar at viewport widths of 760px or less, restores the prior desktop state when widening, and retains manual toggle access on narrow screens.

- Add My inbox to Issue Workspace with Rune inbox icon, All/Unread/Snoozed tabs, local notification selection, issue preview, read state, and manual snooze/restore actions.

- Align Issue Workspace with central ESM controls and modal builders, clearable search, favorite appearance, and Composer send events. Recreate runtime sessions safely after render, preserve shell collapse, remove obsolete Select handlers and component CSS overrides, and include new-issue assignees in Select options.

- Refine sidebar rail/preview/pinned motion with 200ms transitions, delayed label reveal, stable sidebar positioning and 16px navigation glyphs. Hover previews do not shift main content; keyboard toggles and reduced motion stay immediate.

- Update canonical logo and sidebar symbol from the supplied Sesama SVG. Preserve workspace-selector space in collapsed sidebars so navigation icons retain their vertical positions.

- Workspace Sidebar places its toggle in the top logo position. The Sesama mark switches to hide/expand on sidebar hover or keyboard focus; touch devices show the toggle directly.

- Fix Workspace Sidebar initializing a second delegated Tree controller around nested trees, which toggled project branches twice under mount().

- Icon Button adds a `favorite` appearance using existing `pressed` state: selected stars fill with current color. Add interactive off/on/disabled examples under Button → Toggle / Favorite and adopt it in All agents.

- Replace repetitive sample runs in the AI Agent demo with plain chat responses and specialized research/coding activity examples. Activity is explicitly simulated and elapsed time is measured rather than hardcoded.

- Re-measure Tabs indicators when a hidden container becomes visible. All agents no longer autofocuses search and restores Agent Card information with right-aligned actions.

- Reserve clear-button space inside Input so showing or hiding X does not change field dimensions.

- Input and Input Field support `clearable: true`, with an accessible clear button that appears for editable nonempty values, emits input/change, and restores input focus. Enable it for Search agents.

- Tabs line variant gains a shared sliding underline using transform and existing motion tokens; keyboard navigation and reduced-motion preferences switch immediately.

- Refine All agents with a single-line page header, content-level description and creation action, simpler central Card composition, and an in-shell agent creation form.

- Add a local All agents directory to the AI Agent demo with search, favorites, ownership filters, agent details, prompt drafts, creation, and Start chat. Align Agent Card recipe typography with semantic tokens and keep its avatar status indicator compact.

- Migrate the AI Agent demo shell and workspace sidebar to central ESM blocks, sharing collapse, hover, theme, profile, and project navigation styling with other demos.

- Tighten Message content-to-actions spacing to the component's standard 8px gap.

- Own Message instances now default to a Copy action; explicit `actions` override it and `actions: []` hides it. The agent demo consumes this central default.

- Composer model triggers now fit their label without ellipsis, while repository labels can shrink. Narrow toolbars wrap controls to retain complete model names.

- Select adds `popupAlign: 'start' | 'end'`; Composer model menus align to the trigger's right edge and grow leftward within viewport bounds.

- Apply compact, shrinkable trigger sizing to Composer repository selection, matching model selection while keeping content-sized popups.


- Clarify Composer's default context selector as a repository branch using `sesama-ui / main` and a descriptive accessible label.

- Soften Composer placeholder color in light and dark themes to distinguish it from entered text.

- Tighten Message action rows by removing the extra button gap and soften idle icon color; preserve control targets and hover/focus feedback.

- Message actions use a quieter semantic icon color, retain 14px glyphs, and use the standard small control size (26px) with clear hover and keyboard-focus color.

- Message: use 12px content-to-actions and embedded-details spacing. On desktop, reveal actions on hover or keyboard focus, retaining the latest sibling agent response's actions. Touch controls remain visible and action rows retain their space.

- Fix agent Message bubbles to fill their configured message width, including short responses.

All notable changes to the Sesama UI project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Icon Button tooltips are now automatic and use the accessible action label. Embedded icon buttons receive the same tooltip behavior through the mount runtime without layout wrappers. Explicit Tooltip composition overrides the automatic tooltip without duplication.
- Input controls share Input's `sm`/`base`/`lg` size contract (26/30/34px). Select no longer accepts XS; Combobox now supports all three Input sizes. Type declarations and catalog documentation follow the same contract. Icon Button XS now matches the main Button's 22px size and 12px glyph.
- Components catalog now uses ESM as its only reference, with package imports, runnable module examples, rendered markup, and lifecycle documentation for all 48 families. Removed legacy Component preview definitions and comparison suffixes; Blocks retain their existing examples and documentation.

### Added
- Dropdown Menu `menuIndicator` adds the separator and trailing chevron used by the single menu-button pattern. Card `expandAction` provides a trusted HTML slot centered on the trailing edge, matching the expandable resource card.
- Full Rune icon set is now available as canonical ESM: `runeIcon(name, size)` + `RUNE_ICON_NAMES` (224 glyphs, generated from `assets/rune-icons` via `tools/build-rune-icons.mjs`, hooked into `npm run build`/`check`) — opt-in import (`sesama-ui/icons/rune-icons`) so component consumers keep the 36KB curated control set (`controlIcon`, 56 glyphs + 28 aliases, now exposing `CONTROL_ICON_NAMES`).
- Blocks retain equivalent "(ESM)" examples below their legacy variants, built with canonical builders from `src/index.mjs` (`site/canonical-examples.mjs`). The Icons page now shows both sets: Basic (control icons) and Full (Rune set), with a shared search.

### Fixed
- File Card motion no longer creates a temporary scrollbar in catalog preview stages. Generated icon tooltips are hosted at the nearest system root so component header styles cannot override their label color or truncate it.
- File Card reveals its frame and preview together using a reversible transform/clip timeline, with faster exit, immediate keyboard/programmatic changes, reduced-motion support, and animation cleanup on destroy. STEP examples consistently use `motor.step`.
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
- Agent Run, Tool Call and thinking steps animate their expansion: the details content slides open/closed (200ms ease-out, `interpolate-size` + `::details-content` where supported, instant fallback elsewhere); reduced motion toggles instantly.
- Banner dismissal collapses smoothly (fade + height collapse, 200ms) instead of vanishing instantly and jumping the content below; reduced motion fades only, and the legacy global handler no longer instant-removes canonical banners.
- Input area no longer renders a double focus outline (the shell stays silent while the textarea's own border carries the focus state) and its scrollbar uses the shared thin treatment like the other scrollables.
- Scroll Area (and every shared scrollbar) no longer shows the classic native arrow buttons at the scrollbar ends: all treatments (scroll area, popup, popover options, textarea, command palette, legacy group) now use pure `::-webkit-scrollbar` styling with the button pseudo hidden — setting `scrollbar-width`/`scrollbar-color` alongside would make Chromium render its native scrollbar (arrow buttons on Windows) instead. Firefox falls back to its own compact scrollbars, which have no arrows.
- Input vs Input Field documentation deduplicated by concern (shadcn's Input-vs-Form split): the Input page owns control variants (type, sizes, prefix/suffix, disabled, read only, invalid border) and the Input Field page owns composition variants only (label wiring, helper, required, error message, password toggle, phone prefix) — repeated control-state variants removed from the Field page, and the Input page ESM examples render as bare label-less controls (sizes ladder mirrors the legacy help-text labels).
- Icon button: the Square example now shows the clear look (the plain default, like every row/toolbar kebab) and Raised gets its own example — the three surfaces (clear, raised, outline) are each demonstrated.
- Chip defaults to the selectable (clickable) behavior like legacy; the non-interactive label is now the explicit `variant: 'static'`. Active states are tone-aware — success glows green and error glows red (ring, text and background) in both canonical and legacy styles — and chip hover no longer masks the active state.
- Collapsible content uses the subtle text color (supporting-detail role) and the catalog example renders check-icon steps without default bullets, matching legacy.
- Initials avatars default to a name-derived tinted background in both the canonical builder and the legacy bridge (image avatars stay neutral).
- Catalog ESM previews center inside their example stage; full-width block previews opt out.
- Tool Call names follow the run typography (subtle, regular) instead of a darker emphasized color.
- Removed native browser tooltips (`title` attributes) from Sidebar, Composer, Message and File Card controls; accessible names remain via `aria-label`.
- People List rows use the plain appearance (no card background inside bordered sections).
- Chart hover info is placed beside the hovered point, bar top or donut segment instead of covering it; donut segments highlight on hover.
- AI agents demo sidebar collapse keeps main content visible and animates like the dashboard app shell.
- Message sender names are optional for every role: a message without `sender` renders no header, including agent messages (previously agent messages always showed the 'Sesama Agent' identity header). The catalog AI-agent examples and the AI agents demo pass the identity explicitly.
- Message builder no longer throws when an agent message omits `sender` (`options.sender?.name` fallback to 'Sesama Agent'). The TypeError crashed every AI-agent ESM catalog example — response, thinking, streaming and tool result now render their (ESM) pairs.
- Tabs get their signature motion: a sliding active indicator (`.sx-tab-thumb`) glides between tabs in the segmented and pill lists (the tab's own colors keep transitioning; reduced motion jumps instantly) and the panel fade consolidates on the base motion duration. Stale unmatched Tabs example keys removed.
- Tag Input gains a `size` option (`sm` / `base` / `lg`) using the Input Field control heights (26/30/34px); the catalog shows a Sizes example (legacy and ESM).
- Icon button gains a `tooltip` option (with `tooltipPlacement`): the button is wrapped in the canonical Tooltip pattern (`sx-tooltip-wrap` + hover/focus popover) so sighted users get the text the screen reader hears — wired in the catalog icon-button examples and the Orders/Customers row actions; tooltips now show on any component or demo that opts in, not only the Tooltip page (mount initializes them everywhere).
- Tree Item (ESM) expand/collapse was dead in the catalog: the legacy global fold handler double-toggled canonical trees (the controller collapsed the branch, the document handler re-expanded it). The legacy handler now skips trees owned by `[data-sui-tree]`, and branch expansion is standardized on the Collapsible motion: the branch height slides open/closed on the shared motion tokens (`interpolate-size`, instant fallback) with opacity/visibility, keyboard navigation skips collapsed branches, and reduced motion toggles instantly.
- Switch gains an `ariaLabel` option for the bare-switch pattern (no visible label, named via aria-label like the legacy demo) — the catalog Switch ESM examples drop their visible labels that collided in the narrow stage.
- Table header row is transparent by default (no opaque title bar; `stickyHeader` is opt-in for the sticky opaque header) while keeping the ESM typography and colors; gains a `stickyFirstColumn` option (pinned first column with `sticky-left` cells and separate borders, legacy parity); and the catalog Table ESM examples mirror the legacy variant set — default, with actions (Edit + kebab menu), compact, selection (checkboxes), fixed layout, sticky header (25 rows), sticky column, table-shaped loading skeleton, empty state and error state (stale unmatched keys removed).
- Skeleton builder supports mixed-shape compositions: `items` renders several shapes (per-item width/height/size/radius; nested arrays become side-by-side rows) under ONE status region, and `bare: true` emits raw shape divs for app-level compositions that own the status wrapper. The catalog Skeleton ESM examples align with legacy: text (two lines + short tail), single round avatar, card, table rows of full+short lines, fill inside a sized container, and the custom-dimensions profile (round avatar beside two lines) — the previous examples invented extra shapes or lost the profile/a11y composition.
- Select gains a `loading` state (disabled trigger with `aria-busy` and a 'Loading projects…' value, like the legacy demo) and the `xs` size (control-size tokens ladder xs 22 / sm 26 / base 30 / lg 34 now render real height differences); the catalog Select ESM examples align with the legacy set — same 'Project' label, 'Choose project' placeholder, default options with the disabled 'Archived project' entry, grouped Design/Engineering structure, 40-option long list, and the four-step Sizes ladder (stale unmatched keys removed, missing `loading` pair added).
- Pagination rows-per-page selector uses the canonical Select pattern (`.sx-select-trigger` + listbox popover with the shared menu surface, selected checkmark, full keyboard navigation and scroll repositioning) instead of a bare native `<select>`; the native select survives only as the hidden form value slot, `setPageSize()` stays in sync with the trigger, and `sui:pagination:change` (with `pageSize`) replaces the old `[data-page-size]` change hook for integrations.
- Modal gains a `bodyScroll` option: with `bodyScroll: true` only the title and action footer stay fixed while the body scrolls inside (`.sx-modal-body-scroll`, max-height 45dvh) instead of the whole dialog scrolling the title away — the catalog long content example (legacy and ESM) demonstrates it.
- Modal anatomy normalized to one shape: the description is always the first child of `.sx-modal-body` (previously a sibling `<p>` between header and body in dialogs without bodyScroll). Visual position is unchanged; consumers keying on `dialog > p` should query `.sx-modal-body` instead (alpha API note).
- Pagination rows dropdown sizes to its option content (number + selected checkmark with their 8px gap, ~54px) instead of inheriting the shared 180px popup `min-width` — scoped to the pagination selector only, still left-aligned with the field.
- Modal scroll lock no longer drifts the page behind an open dialog: the lock targets the viewport (`html:has(dialog[open])`) with `scrollbar-gutter: stable` instead of also hiding `body` overflow — the scrollbar disappearing no longer reflows the page, and sticky sidebars (catalog nav, app shells) keep their anchor while a modal is open.
- Catalog Modal ESM examples mirror the legacy anatomy ("Project details" + description + Cancel/Confirm footer) instead of a bare title, so size variants and composition variants (Select, Popover, Combobox, Dropdown) show the complete dialog.
- Agent Run and Tool Call blocks in Message examples sit the standard 8px below the profile header: the catalog's usage-code disclosure spacing (`margin-top: 12px`) no longer leaks onto component `<details>` inside example stages.
- Message action icons sit in the message's flush left column (the sender avatar edge, like the agent response reference) at a consistent position in every variant instead of drifting between the message edge and the bubble text edge; outgoing rows mirror this on the right edge (legacy gets the same treatment).
- Agent message content sits the standard 8px below the name row: the transparent agent bubble no longer adds its own top padding on top of the message grid gap, which doubled the visual spacing (legacy gets the same fix).
- Message AI-agent ESM examples match legacy: the response example keeps the legacy intro sentence before the step list, the streaming example includes the Start/Stop demo controls (the example root carries the legacy `data-agent-message` hook so the demo handler finds it), the tool result example mirrors the legacy two-step run and full summary, and builder action events (`sui:message:copy`, `sui:message:retry`, `sui:message:action`) surface demo toasts like the legacy tooltips.
- Catalog pages opened directly via a component hash now render the ESM comparison examples immediately: the canonical module repaints detail pages on load (previously only the Icons page repainted), so the (ESM) pairs no longer appear only after navigating away and back.

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

### Demo navigation and preferences

- Configure Pages and landing previews through four categories in `demos/shared/pages.mjs`.
- Connect separate Dashboard, AI Agent, Issue Workspace, and Onboarding pages through shared navigation; retain previous reference URLs.
- Persist category sidebar collapse/branches, reporting filters, issue filters/tabs, and chat draft/route with optional localStorage.

- Preserve the original Sales/Revenue layouts and restore Sales, Team, and Projects sidebar examples; placeholder items do not navigate or show notifications.

- Remove the Sales reporting demo and its entry from the Dashboard demo menu.

- Keep the Dashboard shell and sidebar mounted when navigating Overview, Revenue, Orders, and Customers. Swap only the main content; preserve direct URLs, refresh, and browser history.
- Dispose page listeners, controllers, and dialogs on navigation; remember Orders/Customers filters and pagination.

- Update the ESM login demo to the final Sesama logo used on the landing page, with an accessible home link and theme-aware color.

- Open landing navigation on mouse hover; present Demo in category columns with native navigation links. Preserve touch tap, keyboard access, Escape, and outside dismissal.
- Add Popover `align` (`start`, `center`, `end`) and shared size/padding CSS variables for wider content panels, retaining existing defaults.

- Keep legacy overlay handlers from repositioning ESM Popovers, and place overlays using their final layout size during entry transitions so panels stay within the viewport.

- Use brand-colored text and icons for hover/keyboard focus in landing dropdown links, through the shared List Row `--list-row-hover-color` token.

- Match landing dropdown descriptions to the brand hover color and use a 6% brand background via shared List Row hover tokens.

- Retry catalog statistics through an iframe handshake to prevent empty counts when the catalog loads before the landing module.
- Correct shared Switch label spacing to accommodate its 32px control.


- Keep landing statistics as simple cards without hover previews and match their 8px outer corner radius to the following section.

- Increase Composer corner radius to 24px across ESM and legacy consumers, configurable via `--composer-radius`.

- Add a theme-aware pastel gradient to AI Agent New Chat and cycle typed/erased placeholder suggestions until the user edits. Suggestions never enter the draft, pause in the background, and remain static with reduced motion.

- Refine New Chat to a blue-to-white gradient that reaches the page surface at 75% from the bottom, leaving the upper quarter plain.

### Shared solid and blur surfaces

- Add the optional `surface: 'solid' | 'blur'` contract and exported `Surface` type to ESM component/block options; preserve default builder markup and component variants/states.
- Share opacity, blur, and saturation tokens; keep nested surfaces independent and fall back to solid for unsupported blur, forced colors, and reduced transparency.
- Add catalog comparisons and use a blurred Composer on AI Agent New Chat.
- Extend API, visual-interaction, and theme checks for the shared surface behavior.

- Keep decorative tooltips from consuming Escape intended for their enclosing modal/menu; preserve one-press modal dismissal and focus restoration.

- Reserve vertical focus-ring space around AI Agent Composer, prevent its wrapper from shrinking, and allow New Chat to scroll on short screens instead of clipping controls.

- Add an opt-in File Card `attachment` variant with stacked filename/size, a larger file visual, and compact trailing actions. Agent Bot attachments use it inside message bubbles with preview, download, and open actions.

- Agent Bot reading/composer width is capped at 1200px. Message actions appear on hover/focus, with explicit latest-agent-message visibility for grouped run layouts; outgoing messages include copy actions.

- Compact Agent Bot list vertical padding and avatar/text spacing using shared List Row gap/padding variables; avatar sizes are preserved.

- Set the shared dark-theme `--color-base` token to `#101010`; Agent Bot inherits the global base token.

- Workspace Sidebar accepts trusted `headerAction` HTML to replace its default collapse control. Agent Bot shows an example Add agent (+) action beside the workspace selector.

- Modal backdrops use a shared neutral dark `--color-overlay` token in both themes, avoiding a white veil in dark mode.

- Agent Bot Edit Agent opens the App Shell right detail panel, retaining chat route/draft. Reference-style identity, Brain/Knows/Does/Rules and notification groups reuse shared fields, selects, rows, switches, collapsibles and header. Preferences save locally; supporting links remain simulated. App Shell exposes `--shell-detail-width` and `--shell-detail-padding` with unchanged defaults.

- Agent settings content uses Sesama Scroll Area. App Shell `setDetail(html, { animate: true })` supports interruptible slide/fade entry and exit with shared motion tokens, reduced-motion handling, and immediate default behavior.

- Bot rows expose a shared context menu on right-click or Shift+F10. Agent settings edits the targeted bot without switching chat; Delete agent shows simulated success feedback and preserves demo bots.

- Curate shared dark-theme toast colors with muted status surfaces, brighter semantic icons, readable neutral text and a subtle edge. Light-theme toast colors and all interactions remain unchanged.
