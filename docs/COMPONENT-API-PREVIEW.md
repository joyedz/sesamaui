# Component API contract

Sesama UI ships 48 component families and 20 structural blocks as pure ES Module builders with TypeScript declarations. This is an alpha: **the API may change before beta**, and manual screen-reader review is tracked separately in the [accessibility report](ACCESSIBILITY-REPORT.md).

## Maturity

All families pass the automated suites (unit, axe, keyboard, functional). Complexity varies, and the following are labeled **experimental** — expect refinements and prioritize them in manual screen-reader review:

- **Combobox** — editable query + listbox, async loading
- **Date Picker** — calendar grid, range mode
- **Command Palette** — modal listbox with dynamic filtering
- **Tree** — nested roving tabindex, folder state
- **Tag Input** — composite field with tag list

The remaining families follow simpler, well-understood contracts and are considered **stable within the alpha**; their markup and options may still change before beta.

Run `npm run dev` and open [`/demos/Component%20API.html`](../demos/Component%20API.html) to try it.

## Source layout

- `src/components/`: pure builder functions plus controllers, one module per component.
- `src/blocks/`: structural layout blocks (`appShell`, `pageGrid`, `dataSection`, …).
- `src/icons/`: the Rune icon library.
- `src/runtime.mjs`: the mount/refresh/destroy hydration runtime.
- `src/index.mjs` + `src/index.d.mts`: root exports and TypeScript declarations.
- `src/styles/`: `tokens.css` (semantic variables), `base.css` (scoped baseline), per-component and per-block stylesheets, and the `components.css` / `blocks.css` aggregates.
- `src/legacy/`: compatibility runtime for pages that still use the classic globals. New integrations should not use it.

`npm run build` regenerates the classic-script bridge and legacy stylesheets from canonical sources. Do not edit generated files by hand; CI rejects stale output.

## Usage

```js
import {
  appShell, workspaceSidebar, pageHeader, pageLayout, pageGrid,
  table, mount
} from 'sesama-ui';

container.innerHTML = appShell({
  sidebar: workspaceSidebar({ workspace: 'Acme workspace' }),
  header: pageHeader({ title: 'Overview' }),
  content: pageLayout(
    pageGrid([{ html: table({ columns, rows }), span: 12 }]),
    { variant: 'data' }
  )
});

const session = mount(container);
// After replacing component markup:
session.refresh();
// On teardown:
session.destroy();
```

Importing modules never touches `document` or `window`, so the same builders run in Node for SSR or build-time generation. ESM requires an HTTP server; do not open pages with `file://`.

## CSS isolation and theming

- A `.sui-root` wrapper (usually `<body class="sui-root">`) is required. Only token definitions apply at `:root`; resets, typography, and component rules are scoped inside the wrapper.
- Host buttons, inputs, tables, and body styles are not reset, so the system coexists with application CSS.
- Independent component stylesheets (`src/styles/components/button.css`, `field.css`, …) import their own dependencies; use them to load only what a page needs. The aggregates are `components.css` and `blocks.css`.
- Set `data-sui-theme` on the wrapper to `light`, `dark`, or `system`. Override CSS variables on the wrapper to re-theme.
- Fonts are not fetched by component styles; load `fonts.css` explicitly or set `--font-family-ui`.
- Forced colors, reduced motion, and `prefers-contrast: more` are supported centrally.

## Mount semantics

`mount` is idempotent for the same root. Overlapping roots share controller ownership: destroying one mount does not disable a component still owned by another. `refresh()` initializes new nodes, updates controller context, and disposes removed nodes, so call it after replacing a view.

Handles from `init*` functions are borrowed handles to the mount-owned instances. `destroy` is idempotent, and a destroyed controller rejects further state changes. A destroyed mount cannot be refreshed; call `mount(root)` again to start a new session.

## Form integration

Input Field, Select, Textarea, Checkbox, Radio, Combobox, Date Picker, and Tag Input participate in `FormData`, `form.checkValidity()`, `form.reportValidity()`, and `form.requestSubmit()` through real native controls. A required Combobox or Date Picker validates the committed selection, not free-typed text. Disabled controls, including those inside a disabled fieldset, are excluded; `novalidate` keeps its native meaning.

```js
const team = initSelect(container.querySelector('[data-sui-select]'));
team.setValue('engineering');   // Silent programmatic update.
team.setRequired(true);
team.setDisabled(false);
team.setCustomValidity('');     // Clear a business/server validation error.
```

Programmatic `setValue` emits no user event; user interaction emits a bubbling `sui:change` with `{name, value, previousValue}`. Form reset restores native defaults, clears custom validity and generated feedback, and closes open popups.

Runtime attributes use the `data-sui-*` prefix. Shared class names (`.btn`, `.field`, `.sx-*`) are styling hooks, not frozen public selectors.

## Trusted HTML slots

Builders escape every text option by default (`escapeHTML` covers `& < > " '`). A small set of options is **trusted application HTML** and is rendered verbatim — only pass markup you control there, never untrusted user input:

| Builder | Trusted options |
| --- | --- |
| `modal` | `content`, `actions` |
| `message` | `content`, `attachments`, `actions` |
| `card` | `header`, `content`, `footer`, `actions` |
| `banner`, `emptyState` | `actions` |
| `toolbar` | string items, `item.html` |
| `collapsible` | `content`, `trigger` (when HTML) |
| `tabs` | `tabs[].content` |
| `scrollArea`, `canvas`, `popover`, `tooltip` | `content` |
| `tree` | `actions` |
| `table` | `columns[].render()` output |
| `composer` | `attachments` (file-card markup) |
| `fileCard` | `preview` (when an HTML string), `actions` (string) |
| section blocks | `content`, `actions`, `footer`, `data`, `pagination`, `filters`, `toolbar` |
| icon options (`badge`, `label`, `chip`, `emptyState`, `banner`) | `icon` when it begins with `<svg` |

Everything else — labels, values, names, placeholders, helpers, errors, option lists, attribute values — is escaped and safe for untrusted strings. This contract is enforced by `tests/xss.test.mjs`.

## Roadmap to beta

1. ~~npm registry release~~ — done: [sesama-ui on npm](https://www.npmjs.com/package/sesama-ui), mirrored on [GitHub Packages](https://github.com/joyedz/sesamaui/pkgs/npm/%40joyedz%2Fsesama-ui).
2. Manual screen-reader review (NVDA, VoiceOver) and Safari verification, as described in the [accessibility report](ACCESSIBILITY-REPORT.md).
3. Component documentation beyond the catalog page.
