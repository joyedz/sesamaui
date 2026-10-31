# Sesama UI component API implementation plan

Status: ready for staged implementation. This document does not implement the remaining components or freeze their proposed API names.

Source of truth: the current catalog, canonical styles, existing application demos, and [current API contract](COMPONENT-API-PREVIEW.md). The [release plan](OPEN-SOURCE-RELEASE-PLAN.md) covers the wider distribution strategy. This document defines the execution order for finishing the component APIs.

Machine-readable scope and progress: [COMPONENT-API-MIGRATION.json](COMPONENT-API-MIGRATION.json).

## 1. Scope and baseline

The catalog has **48 component entries** and **20 block entries**. The current preview covers **5 catalog entries through 4 implementation groups**: Button, Input + Input Field, Select, and Modal. Input and Input Field are distinct catalog entries; therefore **43 entries remain legacy-only**. These numbers describe coverage, not completed migration or a stable release.

The existing preview still needs variant parity and architecture cleanup. For example, the public Button builder does not yet expose all Icon Button, Link Button and Social Button use cases already used by legacy pages. The shared markup factory also couples otherwise separate JS entry points. Both are included in P0.

The outcome is a vanilla UI kit with configurable builders, explicit controllers, independent CSS, types, working examples and reproducible tests. Every migrated component must retain Sesama's current appearance and established behavior.

Priority: **functional component APIs first**. Manual screen-reader verification is deferred at the user's request. Keep automated accessibility and keyboard checks as regression protection; do not describe those results as complete accessibility certification.

## 2. Rules for every migration

1. **One implementation.** Canonical component modules and CSS feed both ESM consumers and generated legacy compatibility. Do not maintain a second handwritten component in a demo, catalog helper or compatibility bundle.
2. **Extract before changing.** Inventory current variants, sizes, states and interactions from live source. Preserve them; record intentional corrections rather than silently dropping an old variant.
3. **Data stays configurable.** No project names, providers, conversation text, table columns, sales data or fake responses in production modules. Example data belongs to documentation or demos.
4. **Pure rendering.** Builders accept options and return escaped markup. Importing a module performs no DOM work and starts no observers, listeners, demo timers or requests.
5. **Explicit behavior.** Interactive components expose `initX(element)` and an idempotent `destroy()`. Static components do not get unnecessary controllers.
6. **Silent setters.** Programmatic updates synchronize all rendered state without emitting a duplicate user-change event. User changes emit one documented, typed event.
7. **Native forms.** Form controls participate in native values, disabled fieldsets, constraints, submit and reset. Separate presentation errors from blocking validation errors.
8. **Scoped CSS.** Components use the current semantic tokens and `.sui-root` boundary. Importing one component does not reset the host page or load charts/app-shell CSS. Fonts remain optional.
9. **Ownership and cleanup.** Respect overlapping mounts, reparenting via explicit refresh, removed nodes and immediate reopen. Remove owned listeners, timers, observers, pointer capture and overlays. Never revoke caller-owned object URLs.
10. **No redesign during extraction.** Preserve typography, dimensions, corners, icon library, spacing, subtle hover, dark mode, ellipsis and current alignment. Shared corrections belong in canonical source and must reach the catalog and consumers.

## 3. Deliverables and exit criteria

Each component migration delivers:

- A pure public builder, appropriate controller, and standalone ESM entry.
- Scoped canonical CSS and only the dependencies needed by that component.
- Type declarations for that entry's options, methods, slots and events.
- Its preserved variant/state inventory, including which options are optional.
- A compatibility adapter generated from canonical code where old pages still need it.
- Catalog examples using the public builder with example data supplied externally.
- At least one real consumer page verified after the change; use the relevant demo rather than only checking the catalog.
- Tests appropriate to risk: escaping/import and CSS isolation for static pieces; meaningful value/event/lifecycle/form tests for interactive widgets. Avoid dummy controllers and tests that merely repeat CSS declarations.

An interactive component is done for this migration when:

- Default, populated, disabled, error and loading states work where applicable; only applicable states are exposed.
- Its documented interactions and setters work, including long labels and duplicate display labels with distinct stable IDs/values.
- Form data, native validation, reset and canceled reset work where applicable.
- Mount, refresh, teardown, remount and applicable overlapping-root ownership work without duplicate handlers or leftover UI.
- Light/dark and desktop/narrow layouts preserve the current visual pattern.
- Relevant functional checks pass in Chromium, Firefox and WebKit; existing automated accessibility checks do not regress.
- The catalog and consumer do not need private component styles, catalog `getExamples`, or a parallel implementation to make it work.

## 4. Execution sequence

| Phase | Scope | Catalog entries | Exit output |
| --- | --- | ---: | --- |
| P0 | Existing API parity, runtime, types and icon foundations | 5 already covered | A repeatable migration pattern with genuinely independent imports |
| P1 | Primitives and feedback | 11 | Configurable presentation components and basic lifecycle helpers |
| P2 | Basic form controls | 5 | Consistent native form behavior and selection state |
| P3 | Overlays and action collections | 8 | Shared placement, collection behavior and clean open/close lifecycle |
| P4 | Advanced inputs | 3 | Search/date/tag values and validation work in normal forms |
| P5 | Navigation and structured lists | 6 | Reusable navigation without application-specific sidebar logic |
| P6 | Data and canvas | 5 | Configurable data rendering, pagination, charts and viewport interactions |
| P7 | Attachments, messaging and agents | 5 | Composable conversation UI with application-owned state |
| P8 | Structural blocks and recipes | 20 block entries | Generic blocks separated from domain examples |
| P9 | Catalog, demos and skill | No additional families | Examples use the same public modules that consumers use |
| P10 | Package and alpha distribution | No additional families | Installable, tested packages and working CDN imports |

P0–P7 cover all 48 entries exactly once. P0's existing coverage must not be counted as five newly completed components. Detailed dependencies are recorded in the migration manifest.

Execute small reviewable batches, usually one component or a tightly coupled pair. Run the relevant consumer checks before moving on. Extract shared dependencies before dependents; do not migrate all families in one large patch. Update the manifest after each completed batch.

## P0. Finish the foundation and existing preview

| Entry | Existing API | Remaining work |
| --- | --- | --- |
| Button | `button` | Complete existing Icon Button, Link Button, Social Button, loading and icon-position cases; preserve the shared size scale and primary/outline height parity. |
| Input | `input`, `initInput` | Record all supported sizes, affixes and native attributes; complete per-entry declarations and default/error/readonly/disabled parity. |
| Input Field | `inputField`, `initInput` | Keep label/helper/error optional, preserve password/phone cases, and make supported presentation versus blocking validation behavior explicit. |
| Select | `select`, `initSelect` | Preserve grouped/ungrouped, optional label/helper/icon, sizes and inline cases; retain native form backing, stable values, long-label ellipsis and the current open state. |
| Modal | `modal`, `initModal` | Verify every existing size and composition variant, locked behavior, focus/scroll handling, nested overlays, return values and immediate close/reopen. |

Shared work:

- Split the four-family markup factory into per-component pure implementations. The current factory is shared, but importing a simple Button still reaches markup for unrelated components; that is not the final per-component JS boundary.
- Split pure utilities, DOM lifecycle helpers and glyph dependencies so a static builder does not require the whole runtime.
- Generate compatibility code from the canonical modules, including CSS; verify generated output in CI.
- Define an explicit controller registry for the base runtime. Keep a convenient full-component mount as an opt-in aggregate; a small consumer must be able to import and initialize one widget directly.
- Finalize public hooks, event naming/detail types, trusted HTML slots, control sizes, update/reset policy and ownership behavior before applying them across the other families. Preserve existing `data-sui-*` hooks; document public HTML templates and provide compatibility aliases for any naming changes before alpha.
- Supply declarations for individual imports, not just `src/index.d.mts`, and type-check representative consumer imports.
- Extract individually importable Rune outline glyphs from the current canonical artwork and preserve its license. Keep the complete icon registry for the icon catalog, not as a mandatory Button dependency. Preserve the dedicated solid Stop square used only by Composer.
- Integrate optional Icon Button tooltips through the shared Tooltip controller when P3 is available; do not create a second tooltip implementation inside Button.

Checks: retain current form/lifecycle regressions, add variant-parity cases, verify direct-entry dependency graphs and type imports. This phase does not require a new visual direction or a screen-reader session.

## P1. Primitives and feedback — 11 entries

Dependencies: P0.

| Entry | Proposed public surface | Required scope |
| --- | --- | --- |
| Badge | `badge(options)` | General semantic tones, size and optional icon; display-only status rather than selectable Chip behavior. |
| Status dot | `statusDot(options)` | Current general tones, optional label, size and active appearance; useful naming when no visible label exists. |
| Avatar | `avatar`, optional `initAvatar` | Initials/image, sizes, automatic color, selected/selectable/disabled states and failed-image fallback. Do not invent an error-status Avatar variant. |
| Label | `label(options)` | Preserve general semantic label tones; no requirement/system/function/test-case domain categories in the core defaults. |
| Divider | `divider(options)` | Current orientation and labelled cases, appropriate decorative/semantic markup. |
| Card | `card(options)` | Reusable content/header/footer/action slots and existing surfaces; no fixed project-card data. |
| Banner | `banner`, `initBanner` when dismissible | Existing tones, dismissal and optional outline actions below the text; retain the current left alignment and spacing. |
| Empty State | `emptyState(options)` | Optional title, description, icon and central Button actions; no forced illustration or domain copy. |
| Loader | `loader(options)` | Existing sizes and labels; no simulated request or completion timer. |
| Skeleton | `skeleton(options)` | Shape/size presets and component-relative dimensions, visible animation and reduced-motion fallback; no Finish loading button in production markup. |
| Scroll Area | `scrollArea`, `initScrollArea` only as needed | Thin subtle scrollbars without arrows, existing overflow behavior and optional boundary/fade helpers; explicit observer teardown. |

Verification: compare representative light/dark variants, Avatar fallback/selection, Banner dismissal, Skeleton motion, and nested Scroll Area behavior. Static components share escaping and isolated-render checks rather than receiving artificial state machines.

## P2. Basic form controls — 5 entries

Dependencies: P0–P1.

| Entry | Proposed public surface | Required scope |
| --- | --- | --- |
| Checkbox | `checkbox`, `initCheckbox` | Label, description, disabled, invalid, checked and indeterminate states. Keep the black checked surface, check/minus glyphs, consistent radius, and label-centred alignment. |
| Radio | `radio`, `initRadio` | Match Checkbox's applicable visual variants; preserve native name-based grouping without adding a mandatory Radio Group wrapper. No indeterminate/multiselect case. |
| Switch | `switchControl`, `initSwitch` | Label/description, disabled and checked states; a native form value and silent setters/reset. |
| Input area | `textarea`, `initTextarea` | Existing label/helper/error, sizes, disabled/readonly and resizing cases; auto-resize only when requested. Keep the catalog name Input area. |
| Chip | `chip`, `initChip` when interactive | Static tags, selectable filters and removable tags; distinction from Badge remains clear. Removal emits an intent/state event, not business deletion. |

Use the existing form-controller conventions. Test checked/value state, FormData, validation where applicable, disabled fieldsets, canceled reset, keyboard behavior and exactly-once user events. Check that descriptions do not move Checkbox/Radio away from label alignment and restored tags do not stretch to full width.

## P3. Overlays and action collections — 8 entries

Dependencies: P0–P2. This precedes advanced inputs and chat controls.

Extract internal placement, dismissal, focus, timer and collection-navigation helpers. Those helpers must not contain catalog data, toast demos or a complete widget registry. Native popovers must remain usable inside native dialogs.

| Entry | Proposed public surface | Required scope |
| --- | --- | --- |
| Menu Item | `menuItem(options)` | General action/link/check/radio rows, optional leading icon, trailing information and disabled/destructive states. Checkbox/Radio rows consume the actual central controls. |
| Menu | `menu`, `initMenu` | Groups, headings, separators and plain lists supplied as data; action IDs are independent of labels. No hardcoded comma-separated demo actions. |
| Popover | `popover`, `initPopover` | General trusted content, configurable trigger/placement and dismissal; preserve the Menu-aligned surface and normal focus behavior. |
| Dropdown Menu | `dropdownMenu`, `initDropdownMenu` | Compose the central Button/Menu; retain current plain/grouped/check/radio variants and close on surrounding scroll. |
| Tooltip | `tooltip`, `initTooltip` | Hover/focus and explicit feedback cases; top/bottom centered on the anchor, viewport clamping, scroll dismissal and clean movement between adjacent icons. Dispose all timers. |
| Toast | `showToast`, `initToastRegion` | General tones, optional title/action, existing compact icon treatment, auto-hide/persistent modes, duplicate/queue behavior, pause/resume and update/dismiss handles. Async outcomes come from the application. |
| Button group | `buttonGroup`, `initButtonGroup` when needed | Preserve older grouped/segmented cases plus menu and split buttons, consistent corners and shared chevrons; compose existing Button/Menu APIs. |
| Command Palette | `commandPalette`, `initCommandPalette` | Configurable commands/groups, query/filter, empty/loading state, active result, Enter/Escape and footer spacing. Use shared collection primitives with appropriate semantics; do not force menu roles onto listbox results. |

Verification: outside click, internal scrolling versus surrounding scrolling, Escape, resize, nested overlays, repeated open/close, disabled actions, clipped content, anchor removal and teardown. Cover the previous stuck-tooltip and adjacent-icon regression. Test Toast timers deterministically rather than waiting for long real-time delays.

## P4. Advanced inputs — 3 entries

Dependencies: P0–P3.

| Entry | Proposed public surface | Required scope |
| --- | --- | --- |
| Combobox | `combobox`, `initCombobox` | Query text and selected value are separate; stable IDs/values, groups, disabled/empty/loading states, keyboard and native form integration. Search/data loading is supplied by the caller. |
| Date Picker | `datePicker`, `initDatePicker` | Existing single/range cases, direct field opening and inline Clear only after selection. Filled text stays primary. Date-only values use documented strings; formatting/locale does not silently shift dates through time zones. |
| Tag Input | `tagInput`, `initTagInput` | Empty/populated/max-tags, add/remove, disabled/error, keyboard, native form values/reset and configurable limits. Reuse Chip; populated tags must not inflate the form height unexpectedly. |

Record the form-value encoding for ranges and multiple tags before implementation. Preserve current features first; do not silently add free-text, multi-select or async network behavior to a widget that does not currently support it. Test clear/reset/canceled reset, invalid values, duplicate labels and external option updates.

## P5. Navigation and structured lists — 6 entries

Dependencies: P0–P3; basic selection controls must be available before selection rows are migrated.

| Entry | Proposed public surface | Required scope |
| --- | --- | --- |
| Tabs | `tabs`, `initTabs` | Configurable stable tab/panel IDs, active/disabled state, keyboard and programmatic activation; no forced application routing. |
| Breadcrumbs | `breadcrumbs(options)` | Links, current item, optional icons and existing collapsed cases; preserve native link navigation. |
| Tree item | `treeItem`, `tree`, `treeSection`, `initTree` | Configurable nested rows, expand/collapse, active page, hover-only actions, loading, section heading/action and text ellipsis. Preserve parent/child typography and indentation. Folder expansion does not get the active-page background. |
| List row | `listRow(options)` | Plain/no-surface case, leading icon/avatar, title/description, metadata, badge, action and selection compositions. Do not create nested interactive elements inside a row button. |
| Toolbar | `toolbar(options)` | Central Button/Icon Button groups and separators; arbitrary supplied actions. Canvas uses this Toolbar rather than owning another toolbar implementation. |
| Collapsible | `collapsible`, `initCollapsible` | Controlled/open defaults, trigger/content association, current motion, reduced motion and safe repeated toggles/unmount. |

Verification: nested Tree interactions, long names, active page versus open folder, compact action spacing, native links, disabled rows and programmatic navigation. Selected routes and persistent expansion data belong to the application, supplied through stable keys or a storage adapter.

## P6. Data and canvas — 5 entries

Dependencies: P0–P3 and P5.

| Entry | Proposed public surface | Required scope |
| --- | --- | --- |
| Table | `table`, `initTable` | Caller-defined `columns`, `rows`, `rowKey`, cell formatting, alignment, selection, sorting and row/actions. Client versus externally managed sort is explicit. No new package component for each page's column set. |
| Pagination | `pagination`, `initPagination` | Basic standalone and data-summary cases, controlled page/page-size, bounds/reset and silent setters. Preserve left metadata/right navigation, square page buttons and current control heights. |
| Chart | `chart`, `initChart` | Existing line/area/bar/thin bar/donut and available variants; datasets, labels, axes/formatters and updates supplied by data. Keep the current vanilla renderer. |
| Wire | `wire(options)` | Configurable existing SVG connection cases, endpoints/style from data; no new graph/layout engine. |
| Canvas | `canvas`, `initCanvas` | Dotted default, pan/zoom/fit, content and viewport setters, pointer capture/cancellation and central Toolbar actions. Do not restore the removed plain variant. |

Table requirements: full available width; consistent row spacing; stable header/value alignment; numeric sort; row click and keyboard activation; nested action buttons do not also trigger the row. Column definitions stay fully configurable. Keep horizontal scrolling inside the table region rather than scrolling the section title, and prevent action menus from being clipped by that region. Table must not require Pagination for a static data display.

Chart requirements: preserve line/area appearance, line-point hover, active-bar highlighting/dimming, donut interaction and label/data synchronization. Tooltip placement must not cover the active point/bar. Dispose resize observers and tooltip state; no import-time document watcher. Integer tick formatting remains configurable.

Verification: no rows, many rows, long cells, numeric/string sorts, custom columns, selected rows, pagination bounds, narrow containers, nested dialogs, chart updates/resizes and Canvas unmount during an active drag. Use Orders/Customers/Revenue and the Canvas catalog as actual consumers.

## P7. Attachments, messaging and agents — 5 entries

Dependencies: P0–P5. Migrate dependencies before Composer: File Card, message actions, tool/run details, then Composer.

| Entry | Proposed public surface | Required scope |
| --- | --- | --- |
| File card | `fileCard`, `initFileCard` | General file metadata/types, optional supplied preview, inline expand/collapse on title/icon, removable/actions cases and existing fallback. Preserve existing action behavior. |
| Message | `message`, `initMessage` when interactive | User/agent/comment, pending/failed/deleted/reply, attachments and actions supplied through configuration. Preserve user bubble colors, plain agent response, typography and icon-only actions except text Retry. |
| Tool Call | `toolCall`, `initToolCall` | Configurable operation, state, input/output/error details, duration and expanded state. No real command/browser execution. |
| Agent Run | `agentRun`, `initAgentRun` | Run summary, typed thinking/tool/progress steps, state updates and current compact spacing. Keep thinking text shimmer and details behavior. |
| Composer | `composer`, `initComposer` | Text, attachments, context/model selections, menu groups, mic action, send, thinking and Stop state; external data and callbacks own the integration. |

File Card: stable attachment IDs, duplicate filenames, multiple attachments with the current vertical Message spacing, preview fallback, and caller-owned versus component-created object URL cleanup. Preview remains inline; do not replace it with a Modal.

Composer: reuse Input area, Button/Icon Button, Menu, Select, File Card and Toast; no copied controls. Preserve current auto-expansion, existing newline/send behavior, four-column attachment previews, truncation and 8px text/chevron spacing. Provider/model/repository lists are caller data, not hardcoded runtime defaults. Thinking switches Send to the dedicated Stop control. Sending/stopping/mic/app/plugin/MCP actions emit intents; they do not start simulated integrations in core.

Message/Agent: keep reusable action IDs and typed status updates. Tool information is operation input/output and public progress, not hidden model reasoning. Demo reply generation, timers, transcripts and agent histories move to the example application.

Verification: draft edits, empty send, attachments without text, duplicate filenames, removal, repeated submit/stop, thinking transitions, runtime data updates, copy/retry intents, long messages and cleanup during an in-flight application-owned update. Verify the real AI agents demo, including its centered conversation and composer layout.

## P8. Structural blocks and domain recipes

There are 20 block catalog entries. Retain **11 canonical generic block APIs**, one legacy alias entry, and **8 example recipes**. A domain recipe may still be documented in the catalog, but does not become a business-specific runtime export.

| Current entry | Destination |
| --- | --- |
| App Shell | Generic `appShell` plus explicit shell controller |
| Workspace Sidebar | Generic `workspaceSidebar`, configurable navigation/profile/footer slots |
| Sidebar | Compatibility alias to Workspace Sidebar, not a second implementation |
| Page header | Generic `pageHeader` |
| Page Layout | Generic `pageLayout` |
| Page Grid | Generic `pageGrid` |
| Data Section | Generic `dataSection` |
| Content Section | Generic `contentSection` |
| People List | Generic `peopleList`, composed from List Row/Avatar |
| Activity Feed | Generic `activityFeed` |
| Metric Card | Generic `metricCard` and a shared metric summary helper |
| Chart Section | Generic `chartSection` |
| Requirement group | Domain recipe using Tree/List Row/Card |
| Resource list | Domain recipe using configurable List Row/Table |
| Agent card | Domain recipe using Card/Avatar/actions |
| Create skill dialog | Domain recipe using Modal/Input Field |
| Delete resource | Domain recipe using confirmation Modal |
| Dashboard Overview | Complete demo/page recipe |
| Revenue Chart | Revenue-specific recipe using Chart Section and data |
| Data workspace | Complete demo/page recipe |

Shell/Sidebar must preserve: shared width and responsive behavior; workspace selector composition; project section action; folder/page state distinction; child indentation; collapsed icon rail; delayed hover expansion without moving conversation content; profile/avatar/menu/theme/notification composition. Business navigation labels and records stay outside the block package.

Grid/page structure must be data-driven: full-width versus centered content, column spans by breakpoint, equal-height row composition and bounded inner table overflow. Do not encode Revenue's six metrics or Orders' columns as universal grid defaults.

Use a shared demo navigation configuration for related sales pages so active routes, project branches and state persistence match across Overview/Revenue/Orders/Customers. Use the same generic block API for the agent workspace with its own configuration.

## P9. Catalog, demos and portable skill

Most catalog migration happens alongside each component; this phase removes remaining mixed-runtime consumers and verifies the complete system.

1. Catalog examples call public builders with external sample data. `getExamples`, `install`, registry entries and fake interactions remain documentation tooling, not runtime dependencies.
2. Replace legacy scripts in Login, Issue Workspace, AI agents, Dashboard Overview, Revenue, Orders, Customers and the generic Workspace demo with public components/blocks. Reconcile overlapping Sales/Requirements examples before advertising them as public starters.
3. Landing showcase embeds the updated catalog/demos without implementing private component variants or importing preview animation into production core.
4. Move shared demo data/navigation into `demos/shared/`; keep component state/visual behavior in canonical modules.
5. Update the repository skill and starter together: supported entry points, required CSS, `.sui-root`, lifecycle, form/events, grid/shell/sidebar examples and per-component imports. Remove machine-specific paths and catalog sample-builder shortcuts from application guidance.
6. Add a clean consumer exercise: build a small page from the documented API and skill without reading private helpers. It must reproduce the shared shell, configurable table and form behavior without copied component CSS.

Checks: all internal links/assets, nested-route loading, light/dark, desktop/narrow, no undefined globals, no legacy scripts on migrated pages, and no duplicate UI controller wiring. Preserve demo-local data/interaction state while replacing component implementation.

## P10. Packaging and alpha

Follow the distribution map with provisional core/blocks/icons packages; final npm names depend on ownership and are not assumed available.

- Build package output from canonical source; do not hand-copy maintained source into two package trees. Make the final source-to-package mapping explicit before moving files again.
- Supply root and per-component JS/CSS/types exports, optional charts/blocks and per-icon entries. A Button-only consumer must not import all 48 families, all icons, charts or demo data.
- Produce package tarballs and install them into a clean consumer outside the source tree. Validate type resolution, DOM-free import, mount/unmount, forms and assets from installed packages.
- Verify browser ESM/CDN loading at nested URLs. Resolve assets relative to module/style URLs; no workspace paths or assumptions that consumers host an `assets` folder at the document root.
- Include original-code MIT licensing and required Rune attribution. Keep demo brand/logo provenance separate from reusable icon distribution.
- Remove `private` only on actual distributable package manifests when publication is intentionally performed. Repository preparation is not npm publication.
- Write alpha documentation and changelog; freeze only the documented, tested surface. Maintain compatibility notes for the preview API and public HTML templates.

Alpha is ready when the 48-entry migration, generic blocks, catalog/demo consumers and clean package-install checks meet the defined functional exit criteria. Deferred screen-reader work remains documented; do not attach a blanket AA claim to the alpha.

## 5. How progress is recorded

Use the migration manifest statuses as evidence-backed progress:

- `legacy_only`: no public modular implementation yet.
- `api_preview_partial`: public API exists but not all parity/packaging criteria are complete.
- `in_progress`: a migration batch is actively being implemented.
- `implemented`: canonical public code, CSS and types exist; verification/consumer migration still pending.
- `verified`: relevant variant, behavior, consumer and browser checks passed with recorded evidence.

A phase is completed only after its entries meet their exit criteria. A wrapper around the entire legacy library, a new catalog screenshot, or a builder returning a hardcoded example does not count as a migrated API. Keep proposed export names in this plan distinct from available exports in `src/index.mjs`.

## 6. First implementation batch

Begin with P0, rather than adding another large family immediately:

1. Record Button/Input/Input Field/Select/Modal variant parity against the live catalog.
2. Separate per-component pure markup and small utility/icon imports; generate the legacy bridge from the resulting canonical graph.
3. Complete Button's Icon/Link/Social public variants and the current Input/Select option gaps.
4. Finalize direct-entry declarations and explicit runtime registration.
5. Run current functional/browser/CSS checks, add targeted parity/type/import checks, and verify Login plus the API preview/catalog.

Then start P1 with Badge, Status Dot and Label as a small static extraction batch, before moving to interactive Avatar/Banner/Scroll Area behavior.
