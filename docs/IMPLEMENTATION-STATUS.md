# Sesama — UI implementation status

UI scope implemented. Public framework APIs, React wrappers, package exports and backend integrations remain deferred, as requested.

## Delivered

New components: Checkbox, Radio Group, Dropdown Menu, Tooltip, Banner, Empty State, Popover, Combobox, Loader, Skeleton, Pagination, Date Picker, Tag Input and Command Palette.

Completed existing areas: Input + Field, Select, Modal, Table, Toast, Tabs, Avatar, Input area and Button Group. Added Composer and Data workspace Blocks and a standalone demos/Workspace demo.html. Login uses the same shared primitive and form styles.

- Selection: native checkbox/radio behavior, mixed select-all, disabled and invalid examples.
- Menus and overlays: native popovers/dialogs, viewport-aware positioning, keyboard navigation, focus restoration, tooltip focus/hover and disabled wrapper, nested Popover/Combobox/Dropdown/Select in Modal.
- Form controls: common size scale, appropriate input types, optional prefix/suffix/help/error, password visibility, phone examples, optional descriptions, standalone textarea, character count and auto-resize. Password and phone remain Input examples.
- Feedback: semantic Banner colors, persistent and dismissible patterns, Empty State actions, actual skeleton-to-content transition, loaders with reduced-motion support.
- Data: real sorting, selection by row identity, mixed select-all, compact/fixed/sticky examples, pagination and page sizes. The generic workspace combines filtering, table selection, pagination, edit form and Toast feedback using local data.
- Advanced input: single local-date calendar with min/max and leap-year support; tag addition/removal/duplicate/limit handling; grouped command filtering and execution with a scoped keyboard shortcut.
- Toast: user-approved 16px Rune glyphs without icon backgrounds; tone-colored Toast surfaces; readable close hover; 3000ms default timeout; persistent/loading state; title/description; Undo; async updates; duplicate prevention; three visible items with queued overflow. Focused notifications defer expiry until focus leaves; hover does not pause.
- Avatar: initials, image, broken-image fallback, 16/24/32px, interactive selection and overflow group. No success/error Avatar tones. Noninteractive avatars do not create needless button tab stops.
- Documentation: Home gallery retained; vertical component details; purpose/anatomy/keyboard guidance; separate variant previews and exact HTML snippets; shared dependency notes. Removed unimplemented React imports and public API reference tables from the UI.

## Files and ownership

| File | Responsibility |
|---|---|
| sesama-ui.css | Existing Sesama tokens and shared control/component styles |
| forms.css / forms.js | Field composition and password visibility |
| dashboard-components.css / dashboard-components.js | Canvas, modal actions and notification lifecycle |
| library.css / library.js | Added UI states, 14 new components, completed existing examples, local composition behavior |
| primitives.js | Reusable behavior for original controls, menus, switches, selection, sorting, composers |
| rune-icons.js / assets/rune-icons | Bundled official Rune outline/solid assets |
| Design system.html | Catalog, documentation and hash navigation |
| demos/Workspace demo.html | Standalone generic project workspace |
| demos/Login.html | Existing login demonstration using shared primitives |
| tools/verify-components.cjs | Repeatable real-Chromium interaction checks |

Scripts and assets work from file://. No development server or runtime icon CDN is required. Google Fonts retains the existing system-font fallback.

## Verification evidence

- All 63 catalog routes rendered without uncaught JavaScript errors in actual Chrome headless.
- 30 browser scenarios passed using tools/verify-components.cjs: selection, menus, tooltip, popover, combobox, banner, empty/skeleton, tabs, textarea, invalid/valid modal form, nested popover/combobox, sorting/selection identity, pagination, composed filter/edit, tags, date keyboard/leap-year/min-max, command execution, Avatar fallback/selection, Toast timing/persistence/Undo/queue/focused expiry, Login, legacy controls, direct routes/reload/history, unique IDs, themes and viewport behavior.
- Responsive sweep: 63 routes at 360/768/1280px in light and dark, 378 measurements. Six narrow-layout issues appeared on Icons and two Structure pages; fixed wrapping/scroll containment and rechecked those pages in both themes. No remaining page overflow in those checks.
- Reduced-motion loader animation was disabled as expected. A 200% CSS zoom simulation on Input remained within the viewport; this is a layout simulation, not an OS magnification or assistive-technology audit.
- Focused Toast check confirmed 16px icon boxes and inherited close-button hover text color for all five tones in both themes. Solid semantic backgrounds use separate readable foreground/background tokens.
- Screenshots visually reviewed: Checkbox documentation, Modal, composed Table documentation, standalone workspace, dark Home gallery and mobile Login. Checked the existing Inter scale, compact control geometry, base/canvas contrast, hairline borders, token spacing, icon alignment and preserved single-column documentation.
- Temporary QA screenshots and raw reports were removed after review. The browser test script recreates its .qa output directory when run.

Browser/IAB access to the user's local file had previously been blocked. This implementation used the bundled Playwright package with installed Chrome for actual local browser verification. No automated screen-reader or comprehensive WCAG conformance audit is claimed.

## Explicit deferred extensions

Public APIs and distribution are the next phase. Multiple-selection Select, date ranges/time selection, and resizable Table columns were already specified as later/optional extensions and are not represented as implemented. Phone examples use native tel entry and a fixed optional country prefix; international-number parsing is not implemented. Authentication and network requests remain outside scope.

## Running the checks

Run `node tools/verify-components.cjs` from the workspace. The script uses the installed Codex Playwright bundle and Chrome; PLAYWRIGHT_PATH and CHROME_PATH can override their paths. It checks local UI behavior and does not contact a backend.

## Updated Field organization

Latest user decision: Input documents the bare base control. Field documents labelled compositions, including password and phone, with optional helper/error text. Password and phone routes redirect to Field. This supersedes earlier placement under Input; the underlying native controls remain input elements.
