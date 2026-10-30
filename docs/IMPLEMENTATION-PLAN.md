# Sesama — Implementation plan

Status: UI batches 0–6 implemented. Browser verification and scope notes are recorded in IMPLEMENTATION-STATUS.md. Public API implementation remains deferred. Specification: COMPONENT-SPEC.md.

## Delivery rules

Implement in dependency order. Complete examples, real interactions and checks for a batch before moving to the next. No public API implementation, React package, backend or authentication work in these batches. Preserve the latest user decisions for Home gallery, vertical detail pages, Rune icons, optional helper text, Avatar selected ring and Toast appearance/timing.

## Batch 0 — Establish the shared baseline

- [x] Consolidate shared tokens/primitives without changing their appearance; catalog and Login consume the same CSS.
- [x] Define warning foreground/background tokens for both themes.
- [x] Centralize overlay positioning/focus/layer conventions; unique instance IDs; consistent Rune 16px icons.
- [x] Remove misleading implemented-API claims; label proposed contracts deferred; provide actual HTML/CSS/JS snippets.
- [x] Capture visual baselines for Home, Input, Login, Modal and Toast; verify routes and record browser-access limitations.

Exit: no visual regressions to existing patterns, reusable local styles and scripts, established completion checklist.

## Batch 1 — Form and selection foundations

Components: Checkbox, Radio Group, Loader; complete Input + Field and generic Input area.

- [x] Implement promised states, sizes, optional help/error, label associations and real keyboard behavior.
- [x] Preserve Password/Phone as Input examples; keep Field separate.
- [x] Make Composer a Block composed from textarea and actions.
- [x] Update Login with shared controls and demo validation.

Exit: keyboard-only form completion works; no automatic helper copy; all states mapped separately.

## Batch 2 — Menus and anchored content

Components: Dropdown Menu, Tooltip, Popover, Combobox; complete Select, Button Group and Tabs.

- [x] Build shared popup positioning/scroll/dismiss/focus behavior, then specialize selection versus actions.
- [x] Include disabled/grouped/long options, empty search and loading cases.
- [x] Verify nested popups inside Modal, keyboard navigation, content panels and touch behavior.

Exit: menus and fields operate independently across multiple instances; active states and focus remain correct.

## Batch 3 — Feedback and overlays

Components: Banner, Empty State, Skeleton; complete Modal and Toast.

- [x] Add warning only using approved foundation tokens.
- [x] Complete modal sizes, long-content scrolling, form validation and nested popup examples.
- [x] Preserve Toast 16px no-background icon and status-colored surfaces; add actions, async updates and stack management.
- [x] Verify timer, persistent state, Undo, focus return and screen-reader status behavior.

Exit: status states communicate meaning without color alone; overlays and notifications work together.

## Batch 4 — Data presentation

Components: Pagination; complete Table and Avatar.

- [x] Real local sorting, stable checkbox selection/select-all, compact and sticky examples.
- [x] Table loading, empty and error states reuse Batch 3 components.
- [x] Pagination handles page-size and total changes.
- [x] Avatar image/fallback/group/overflow and selected state.
- [x] Build generic composed data demo: filter → table → pagination → edit modal → toast.

Exit: composition preserves data identity, handles empty/loading states and works on narrow screens.

## Batch 5 — Advanced entry and navigation

Components: Date Picker, Tag Input, Command Palette.

- [x] Implement single-date calendar with local date semantics and keyboard support.
- [x] Tag creation/removal, duplicate and max-count rules, wrapping and read-only behavior.
- [x] Search/filter/group/execute commands with scoped shortcut and modal focus handling.

Exit: calendar boundaries, tag editing and command execution work with keyboard and long content.

## Batch 6 — Complete library and handoff

- [x] Review every scoped component against COMPONENT-SPEC.md and the Sesama visual contract.
- [x] Audit gallery previews, per-variant examples, snippets, dependency notes, route aliases and search.
- [x] Check 360/768/1280px, both themes, 200% zoom and reduced motion.
- [x] Run regression checks for Login, dashboard, forms, overlays, Toast timers, icons and catalog navigation.
- [x] Record shipped examples, outstanding limitations and browser evidence in docs/IMPLEMENTATION-STATUS.md when implementation starts.
- [x] Resolve scope failures before declaring the UI library complete.

Exit: all 14 new components and 9 existing areas meet their acceptance criteria. Public APIs remain deferred.

## After these batches — API implementation

Framework and distribution decision → public contracts → typed component implementation → export/package integration → runnable API examples and compatibility checks. Plan this phase against the accepted UI, rather than treating current illustrative props as implemented.

## Verification discipline

Use focused behavior checks for each batch and a final composition pass. Existing VM rendering checks detect missing functions but cannot prove browser behavior. Record syntax, rendering, interaction and visual checks separately. Do not claim a browser pass when file:// or localhost access is blocked. Keep temporary captures outside deliverable files and clean them up after review.

## Updated Field organization

Latest user decision: Input documents the bare base control. Field documents labelled compositions, including password and phone, with optional helper/error text. Password and phone routes redirect to Field. This supersedes earlier placement under Input; the underlying native controls remain input elements.
