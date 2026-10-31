# Sesama — Component specification

Status: specification ready for UI implementation. API implementation follows after UI acceptance.

## Scope and source of truth

This specification covers 14 new components and 9 existing component areas identified in the Kumo comparison. Sesama tokens, existing controls, and the user decisions below are authoritative. Kumo is a reference for completeness and interaction patterns, not a replacement visual system.

Current implementation: static HTML, CSS, and JavaScript. Deliver interactive local examples and actual HTML usage snippets. Do not present proposed React imports or prop tables as implemented functionality. Public component APIs, React wrappers, package exports, backend services, authentication, and data fetching are deferred. Local state and event handlers required to demonstrate the UI are in scope.

## Visual contract

- Typeface: Inter; body/UI 12/16 at weight 420/500, content body 13/20, caption 11/15, page title 18/24 at 500. No new display typography.
- Surfaces: canvas for the page, base for controls and floating surfaces, recessed for secondary regions. Hairline borders; no decorative gradients or new palettes.
- Colors come from semantic CSS tokens. Preserve light-dark() and data-mode behavior. New warning tokens must be defined once at foundation level and checked in both modes before warning components ship.
- Control heights: xs 20, sm 24, base 28, lg 32px; default base for form controls. Dense desktop chrome may use sm. On touch layouts expand hit regions to at least 44px without changing icon proportions.
- Spacing scale: 2, 4, 6, 8, 12, 16, 24px. Label/control gap 6, helper/error gap 6, form group gap 16, overlay content padding 24 (16 on narrow screens).
- Radius: xs 4, sm 6, md 8, lg 12, xl 16px. Controls sm/md, popup md, modal lg. Elevation: ring for controls, float for popups, dialog for modal/Toast.
- Icons: official local Rune assets, outline by default. Standard UI glyph 16px; compact chrome 14px where already established. Solid is an explicit documented choice. No background disc around Toast icons.
- Focus: existing brand focus ring. Disabled controls remain distinguishable and cannot activate. Semantic tone and disabled/selected/loading are separate concepts; do not apply success/error variants to Avatar.
- Text, values, and examples in generic components use neutral product concepts such as Projects, Name, Email, Design. Engineering terminology belongs in composed Blocks.

## Documentation contract

Home remains a responsive gallery of square cells separated by thin hairlines. Each cell shows a component name and one or two representative examples. Full documentation is a vertical reading column, up to 760px, with no side-by-side section cards.

Every component page has: purpose; when to use; anatomy; examples mapped individually by variant/state; live preview; exact HTML/CSS/JS dependencies for that preview; keyboard behavior; accessibility; limitations. Helper text is optional and appears only when explicitly provided. Errors appear only when invalid. Do not bundle helper copy automatically into password or phone inputs.

Until the API phase, replace misleading API Reference sections with Implementation notes or mark proposed contracts clearly as deferred. Existing demonstration code that only emits a toast must be identified as a demo action.

Each example must have unique IDs, accessible names, and the same markup as its usage snippet. Direct hashes, reload, Back/Forward, and sidebar active state must work for every page. Keep legacy routes as aliases when renaming or merging components.

## Shared behavior

- Form values survive normal interaction; optional descriptions and errors are associated through aria-describedby. Required is represented semantically, not only by an asterisk.
- Menus/selects/popovers position within the viewport, support scrolling, close correctly, and return focus to the trigger. Layering must work when opened inside Modal.
- Native interactive elements first. Keyboard-only users must complete every demo. No click-only divs or spans. Color never carries state alone.
- Honor reduced motion. Avoid focus theft, animation-only status, invisible clipping, and background scrolling beneath a modal.
- Breakpoint checks: 360, 768, and 1280px; long labels, long values, 200% zoom, light and dark. Tables/canvas may scroll within their own region; the page must not overflow horizontally.

## New components

### Checkbox

- Anatomy: Checkbox control, label, optional description/error.
- Variants and states: Unchecked, checked, indeterminate; enabled/disabled; invalid.
- Behavior: Space toggles; label activates control; mixed state resolves to checked. Parent select-all reflects child selection.
- Accessibility: Native checkbox; indeterminate property and accessible mixed state; label association.
- Acceptance: Select-all demo moves correctly among all three states; disabled options never change.

### Radio Group

- Anatomy: Group legend, radio, option label, optional description/error.
- Variants and states: Unselected/selected; disabled option/group; invalid group; vertical/horizontal layout.
- Behavior: Exactly one choice; arrow keys move within group, Space selects; Tab enters/leaves group.
- Accessibility: fieldset/legend and native shared-name radio inputs.
- Acceptance: Keyboard changes one selection and submitting yields one group value.

### Dropdown Menu

- Anatomy: Trigger, popup, items, optional icons/shortcuts, group labels and separators.
- Variants and states: Default/danger/disabled item; checkbox and radio items; plain/icon trigger.
- Behavior: Arrows navigate, Home/End jump, typeahead, Enter/Space activate; Escape/outside dismiss. Disabled items cannot activate.
- Accessibility: Menu roles and state; visible focus; focus returns to trigger.
- Acceptance: Menu opened inside Modal remains visible and operable; danger action is distinguishable without color alone.

### Tooltip

- Anatomy: Trigger plus short explanatory popup.
- Variants and states: Top/right/bottom/left, wrapped text, disabled-control wrapper example.
- Behavior: Shows on hover and keyboard focus; Escape dismisses; popup remains available while hovered. No interactive content.
- Accessibility: aria-describedby; trigger retains accessible name without tooltip.
- Acceptance: All placements avoid clipping; touch access does not depend solely on hover.

### Banner

- Anatomy: Status icon, message, optional title, action and close control.
- Variants and states: Neutral/informative/success/warning/error; dismissible or persistent; with/without action.
- Behavior: Inline and persistent until dismissed or condition changes; links/buttons remain operable.
- Accessibility: Appropriate status or alert for dynamic messages; no repeated announcements on re-render.
- Acceptance: Long message wraps, actions fit narrow screens, dismissal affects only its own banner.

### Empty State

- Anatomy: Optional Rune icon, title, description, optional primary/secondary action.
- Variants and states: No data; no search results; failed load; compact/full region.
- Behavior: Action can create item, clear search, or retry using local demo state.
- Accessibility: Logical heading; decorative icon hidden; controls have specific names.
- Acceptance: Each scenario has distinct helpful copy and an action that visibly changes demo state.

### Popover

- Anatomy: Trigger, anchored content, optional heading, close and action controls.
- Variants and states: Default; form/filter content; placements; scrollable content.
- Behavior: Click opens; Escape/outside closes; focus enters content and returns to trigger. Non-modal unless explicitly specified.
- Accessibility: Trigger expanded state and controls association; popup named if dialog-like.
- Acceptance: Input controls work without accidental dismissal; popup stays inside viewport and works inside Modal.

### Combobox

- Anatomy: Field, editable search input, popup list, options, clear control, status.
- Variants and states: Single selection; empty query/results; disabled option; invalid/disabled field; loading; long list.
- Behavior: Search filters options; arrows navigate; Enter commits; Escape closes; clear removes selection. Multi-select deferred to a later extension.
- Accessibility: Combobox/listbox roles, expanded state, active descendant and selection; announce no-results/loading appropriately.
- Acceptance: Typing and keyboard selection work; displayed label matches committed selection; filtering does not lose input focus.

### Loader

- Anatomy: Spinner with optional label.
- Variants and states: 16/24/32px; inline/button/region use; with/without visible label.
- Behavior: Indicates ongoing work without claiming progress; does not replace readable button action name.
- Accessibility: Status text or accessible label and aria-busy region; reduced-motion alternative.
- Acceptance: No layout jump when button becomes busy; label remains available with motion disabled.

### Skeleton

- Anatomy: Noninteractive loading placeholder matching final content geometry.
- Variants and states: Text single/multiple lines; avatar; card; table row.
- Behavior: Loading replacement without fake controls; transitions to actual content in demo.
- Accessibility: Skeleton shapes hidden from accessibility tree; containing region exposes loading state.
- Acceptance: Content placement remains stable when loaded; reduced motion disables shimmer.

### Pagination

- Anatomy: Previous/next, page buttons, ellipsis, optional count and page-size selector.
- Variants and states: First/middle/last page; one page; compact mobile; disabled; optional page size.
- Behavior: Switch local table/list page; clamp page after total/page-size change; ellipsis is not clickable.
- Accessibility: Navigation label, current-page state, explicit page button labels.
- Acceptance: No out-of-range navigation; first/last disabled correctly; mobile keeps current and adjacent navigation.

### Date Picker

- Anatomy: Field, calendar trigger, month navigation, weekday headings, date grid, optional clear.
- Variants and states: Single date; empty/selected/today; disabled dates; min/max; error; disabled; optional clear.
- Behavior: Select commits a local calendar date; arrows move by day/week; Home/End by week; PageUp/Down by month; Escape closes. Range/time selection deferred.
- Accessibility: Calendar grid labels, full-date names, separate today and selected semantics; label/error association.
- Acceptance: Leap year and month boundaries work; min/max cannot be selected; no UTC shift of selected local date.

### Tag Input

- Anatomy: Field containing removable tags, text input, optional help/error.
- Variants and states: Empty/populated; disabled/read-only; invalid; max tags; duplicate entry handling.
- Behavior: Enter or explicit separator commits; Backspace on empty input targets last tag; removal via named button; reject duplicates with feedback.
- Accessibility: Tags and remove controls named; additions/removals announced; text input remains reachable.
- Acceptance: Long tags wrap or truncate accessibly; removing one preserves others; disabled/read-only cannot mutate.

### Command Palette

- Anatomy: Modal search, grouped command results, optional shortcut hints, empty state.
- Variants and states: Default/filtered/empty; disabled command; grouped commands.
- Behavior: Open using button or scoped Ctrl/Cmd+K; arrows choose, Enter runs local demo action, Escape closes; ignore shortcut where inappropriate.
- Accessibility: Named modal, input/result association, focus containment and return.
- Acceptance: Search and execution work without mouse; nested/global shortcuts do not break text entry.

## Existing components to complete

### Input + Field

- Purpose: Keep password and phone under Input; Field is the label/control/help/error composition.
- Variants and states: Sizes xs/sm/base/lg; text/email/password/tel/number/url; leading/trailing icon; optional prefix/suffix; empty/filled/disabled/read-only/invalid; optional helper.
- Behavior: Password toggle preserves value and caret/focus, updates accessible state; phone uses tel keyboard and optional fixed prefix, does not claim international validation. Field ties label, help and error to the input.
- Acceptance: Show label and bare-input cases, all sizes, prefix/suffix, optional help, required, invalid, password toggle and phone; copy-pasted snippet reproduces each example.

### Select

- Purpose: Select a known option; searchable lists use Combobox.
- Variants and states: All four sizes; placeholder; selected; invalid; disabled; loading; grouped options; disabled options; long scrolling list; optional Field help/error.
- Behavior: Arrow navigation, typeahead, Enter/Space commit, Escape close; focus returns; disabled/loading cannot commit. Multiple selection is a named later milestone after Checkbox and basic Select are stable.
- Acceptance: Keyboard commit updates displayed selection; required-empty differs from placeholder; group labels are not selectable; popup stays visible inside Modal.

### Modal

- Purpose: Keep Modal as the public documentation name; Dialog is its underlying semantic behavior.
- Variants and states: sm 288px, base 400px (existing Sesama), lg 512px, xl 768px; basic/confirmation/form; long content; optional close button; dismissible/explicit-confirmation.
- Behavior: Focus contained; Escape/backdrop close by default; explicit confirmation can disable backdrop dismissal. Form validates before close; save shows local result. Scroll modal body, keep actions reachable, preserve nested popup interaction.
- Acceptance: Cancel restores focus and saves nothing; Enter submits valid form; invalid form remains open; background does not scroll; test Select/Popover inside Modal.

### Table

- Purpose: Use semantic table elements and local data for demos.
- Variants and states: Default/compact; selected rows; checkbox selection/select-all; sticky header/left/right column; fixed widths; loading/empty/error; sortable.
- Behavior: Replace reverse-order demo with real ascending/descending sort and aria-sort. Pagination operates on local data. Selection identity survives sorting. Resizing is a later milestone with keyboard alternative if included.
- Acceptance: Mixed select-all works; sticky cells do not overlap incorrectly; empty/loading states align with columns; sorting affects actual values and preserves selected identities.

### Toast

- Purpose: Preserve latest user-approved Sesama appearance.
- Variants and states: Neutral contrast surface; informative blue; success green; error red; add warning after warning token is defined. All icons Rune 16px with no icon background. Optional title/description/action; auto-dismiss/persistent; async loading→success/error.
- Behavior: Default 3000ms auto-hide; persistent stays until closed. No hover pause by default (user preference). Add configurable timeout, action such as Undo, updating same notification, duplicate prevention and capped stack (3 visible, overflow queued). Focus inside toast must not be unexpectedly removed: defer expiry until focus leaves.
- Acceptance: X retains inherited readable color on hover in both themes; timer and persistence work; async update reuses one item; Undo visibly restores local demo state; timers cleaned after manual dismissal.

### Tabs

- Purpose: Tabs switch associated content; navigation links remain links.
- Variants and states: Segmented/pill; with optional icon; disabled tab; long labels; overflow on small screens.
- Behavior: Exactly one active tab/panel; roving tabindex; Left/Right and Home/End; use Enter/Space for manual activation when content changes are expensive.
- Acceptance: aria-selected and panel visibility stay synchronized; disabled tabs cannot activate; keyboard-only demo reaches content.

### Avatar

- Purpose: Represents identity and optional selection, not success/error status.
- Variants and states: Initials/image; image-failure fallback; 16/24/32px; interactive/unselected/selected/disabled; group with overflow count.
- Behavior: Preserve selected ring. Images fall back to initials; group overflow opens a local list. Selection toggles only for interactive avatars.
- Acceptance: No semantic error/success avatar variants; broken image does not leak broken-image UI; selected state is announced with aria-pressed; disabled prevents mutation.

### Input area

- Purpose: Separate generic textarea from domain-specific message composer.
- Variants and states: Bare textarea; Field wrapper; optional help/error; disabled/read-only; empty/filled; auto-resize with max height; optional character count/limit.
- Behavior: Enter inserts newline; never sends by default. Explicit send button belongs in Composer Block; optional shortcut must be documented. Respect IME composition; preserve whitespace.
- Acceptance: Textarea works independently of chat; helper absent unless provided; count/limit match actual value; no page jump while growing.

### Button + Button Group

- Purpose: Preserve current Button appearance and correct the group taxonomy while adding menus.
- Variants and states: Existing styles/sizes/shapes/loading/disabled/title retained. Add true connected Button Group and split-button examples; menu trigger uses Dropdown Menu.
- Behavior: Correct action/link semantics; loading prevents duplicate actions; keyboard/focus and connected border seams remain consistent.
- Acceptance: Existing examples keep working; group is not merely a single menu button; icon-only buttons retain labels.

## Architecture and integration

Consolidate shared tokens and UI primitives in sesama-ui.css, and link the catalog and demo pages to the same source. Preserve standalone file:// operation with local script files and bundled Rune SVG data; no runtime CDN dependencies for controls or icons. Fonts keep the existing local fallback.

Use small component-scoped JS modules for state and behavior. Keep form helpers in forms.css/js; evolve dashboard-components.css/js for overlays, notifications and canvas. Separate new selection, menu and data-control modules as needed. Avoid new global click handlers that unintentionally catch unrelated component demos. Give every instance its own IDs, trigger relationship, timers and cleanup.

Keep catalog metadata and live examples synchronized. Usage code must include required stylesheet/script dependencies and must not advertise unimplemented React components. Existing draft API tables can remain only if clearly labeled Proposed API — deferred. The API phase begins after the UI scope below is complete.

Update demos/Login.html to use shared Input/Field/Button without changing authentication scope. Create one generic local demo combining filtering, Table, Pagination, Empty/Skeleton and Modal to exercise composition. Keep demos/Requirements dashboard.html usable and adopt shared fixes only where appropriate. Canvas and Wire stay available; do not add domain semantics to generic components.

## Completion and regression gates

For every component: mapped examples for every promised variant/state; accurate snippets; working local behavior; keyboard and accessible-name checks; both themes; mobile/desktop; no horizontal page overflow; no console errors; no interference between multiple demo instances. Visual review checks typography, density, alignment, icon size, token usage, focus and hover contrast against existing Sesama Input/Button/Modal.

Runtime checks must cover direct page hashes, reload, browser navigation, all catalog routes, delegated handlers, actual timers, nested overlays, form invalid/valid submit, Select commits, table selection/sorting/pagination and Date Picker boundaries. Syntax or mocked HTML generation alone is not a browser interaction pass. Record which checks actually ran and any blocked visual/browser checks.

## Deferred API phase

After UI completion: decide framework/distribution; finalize controlled/uncontrolled contracts and names; implement public props/events, typed exports and package boundaries; replace proposed examples with actual runnable imports; add public API compatibility tests; wire backend integrations only under separate authorization. No API implementation is part of the current batches.

## References

- Sesama source: Design system.html, sesama-ui.css, forms.css/js, dashboard-components.css/js, rune-icons.js.
- Kumo catalog: https://kumo-ui.com/
- Input: https://kumo-ui.com/components/input/
- Select: https://kumo-ui.com/components/select/
- Dialog: https://kumo-ui.com/components/dialog/
- Table: https://kumo-ui.com/components/table/
- Toast: https://kumo-ui.com/components/toast/

Reference features are adapted to Sesama's tokens and approved patterns. Sizes or behavior in this specification are Sesama decisions unless explicitly described as source behavior.

## Updated Field organization

Latest user decision: Input documents the bare base control. Field documents labelled compositions, including password and phone, with optional helper/error text. Password and phone routes redirect to Field. This supersedes earlier placement under Input; the underlying native controls remain input elements.
