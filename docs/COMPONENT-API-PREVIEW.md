# Component API contract

Use `iconButton('star', { variant: 'favorite', pressed: true, ariaLabel: 'Remove from favorites' })` for a filled selected favorite. Applications own toggle state and accessible-label updates; `pressed: false` renders the outline state.

Input and Input Field accept `clearable: true` (default false). The clear button is hidden for empty, disabled, or readonly inputs. Clearing emits native bubbling `input` and `change` events and returns focus to the input.

Own Message instances default to a Copy action when `actions` is omitted. Pass `actions: []` to hide the default, or provide explicit actions to replace it.

Select supports `popupAlign: 'start' | 'end'` (default `'start'`). Composer's model popup uses `'end'` so its right edge follows the trigger and its content width grows leftward, constrained to the viewport.

Select accepts `popupWidth: 'trigger' | 'content'` (default `'trigger'`). Content mode sizes the popup independently of its trigger, constrained to the viewport. Composer uses content mode for repository and model selection; selection changes preserve the draft and attachments.

Sesama UI ships 48 component families and 20 structural blocks as pure ES Module builders with TypeScript declarations. This is an alpha: **the API may change before beta**, and manual screen-reader review is tracked separately in the [accessibility report](ACCESSIBILITY-REPORT.md).

## Design system reference

The Components section of `site/Design system.html` uses ESM builders exclusively. Each page includes a package import, a runnable local-module example, generated HTML for every variant, and runtime lifecycle instructions. `site/canonical-examples.mjs` owns preview factories; `site/component-docs.mjs` owns builder usage and reference copy. The Blocks section retains its existing comparison examples.

`dropdownMenu({ menuIndicator: true })` adds the single-button menu separator and trailing chevron. `card({ expandAction })` places trusted action markup on the card's trailing edge; compose it with `iconButton()` for an expandable resource preview. The consuming application supplies the expand action's behavior.

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

## Icon Button tooltips

Every `iconButton()` includes a tooltip by default, using its accessible `label`/`ariaLabel`. Set `tooltip` only to override the text and `tooltipPlacement` to change its position. Tooltip text is escaped. Call `mount(root)` to enable hover, keyboard focus, Escape dismissal, and surrounding-scroll dismissal.

The runtime gives embedded `button.ibtn[aria-label]` controls the same behavior without adding a layout wrapper. Explicit tooltip triggers and legacy tooltip triggers are excluded to avoid duplicate tooltips. After inserting controls, call `session.refresh()`; destroying the session removes generated tooltips and their listeners. Changing an embedded button's accessible label updates the text the next time its tooltip opens.

## Control sizes

Input is the size reference for single-line input controls: `sm` 26px, `base` 30px, `lg` 34px. Input Field, Select, Combobox, Date Picker, and Tag Input use the same size options and height tokens. Select no longer accepts `xs`. Textarea uses the same three size names; its multiline height follows its content and row configuration.

Button is the size reference for button-based controls: `xs` 22px, `sm` 26px, `base` 30px, `lg` 34px. Icon Button, Social Button, Button Group, and button triggers in composed controls reuse Button's size contract. Container sizing, such as a dialog width, is a separate layout option.

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
| `card` | `header`, `content`, `footer`, `actions`, `expandAction` |
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

### Popover content layout

`popover({ align: "center" })` aligns the panel with its trigger (`start` by default; also supports `end`). Host CSS can configure `--popover-width`, `--popover-max-width`, `--popover-max-height`, and `--popover-padding`; defaults retain the existing compact panel and viewport bounds. Content remains a trusted application HTML slot.


### Shared surfaces (ESM)

Builders with a visual surface accept `surface?: 'solid' | 'blur'`. Omit the option for the existing solid rendering. Invalid values throw `TypeError`. Surface is independent of `variant`, `tone`, size, disabled, selected, and focus state.

```js
composer({ surface: 'blur' });
card({ surface: 'blur', content: inputField({ label: 'Name', surface: 'solid' }) });
button({ variant: 'primary', surface: 'blur', label: 'Create project' });
select({ surface: 'blur', label: 'Team', options: ['Design', 'Engineering'] });
workspaceSidebar({ surface: 'blur', navigation });
showToast({ message: 'Saved', surface: 'blur' });
```

The shared tokens are `--surface-opacity: 78%`, `--surface-blur: 16px`, and `--surface-saturation: 140%`. The surface is applied to the painted control or panel: Input Field keeps its label outside the surface; Select applies it to both trigger and popup; Popover, Dropdown Menu, Tooltip, and Modal apply it to the overlay. Their trigger can be configured separately. Nested component surfaces do not inherit transparency. Components that intentionally have no painted background retain that presentation; icons, text, and dividers do not gain a decorative box.

Component styles remain usable through individual CSS entry points. Existing semantic background colors are preserved through transparency, including primary and danger fills. Unsupported backdrop filters, forced colors, and reduced-transparency preferences fall back to opaque surfaces. Use blur over a visible backdrop; it has little effect over a flat color. Keep large overlapping blurred layers limited.

The catalog includes Solid / Blur comparisons and AI Agent New Chat uses a blurred Composer. Verify the behavior with `node tests/surfaces.cjs` (`BROWSER=chromium|firefox|webkit`).

Workspace Sidebar: `projectsTitle` customizes the secondary navigation heading (default `Projects`), for example `workspaceSidebar({ projectsTitle: "Your team", projects: agentNavigation })`.

File Card supports `--file-card-max-width` (default `250px`) on its containing layout for readable wide document previews.

### Conversation workspace options

- `appShell({ rail })`: trusted global navigation HTML, alongside the persistent workspace sidebar.
- `workspaceSidebar({ variant: 'conversation' })`: compact workspace bar and flat conversation navigation. Default remains `default`.
- `composer({ compact: true, showContext: false, showModel: false, leading })`: single-row message bar; `leading` is trusted application HTML. These options are independent, and default Composer behavior is preserved.
- `message({ appearance: 'bubble', role: 'user', own: true })`: neutral outgoing bubble; the same appearance on an agent gives an incoming bubble. Default appearance is unchanged.
- Host layout variables: `--shell-sidebar-width`, `--shell-gap`, `--shell-padding`, `--shell-main-radius`, `--shell-main-shadow`, `--shell-footer-padding`, `--page-header-padding`, `--page-header-min-height`, `--composer-max-width`, `--avatar-radius`, `--message-bubble-max-width`, `--list-row-padding`, `--list-row-min-height`, and `--list-row-description-white-space`.

Never pass untrusted text as `rail` or `leading`; escape text inside those trusted slots.

`workspaceSidebar({ variant: "compact", navigation, profile })` renders permanent icon navigation using the collapsed Tree geometry. It has no expansion trigger; App Shell excludes it from hover/focus peek. Give icon-only Tree items an accessible `aria-label`.

List Row `titleBadge` renders escaped badge text beside the title. The description uses the full copy width. `--list-row-copy-gap` and `--list-row-title-weight` configure layout/typography without overriding row internals. Empty Workspace Sidebar `projectsTitle` with no actions omits its empty heading.

Tree items support `layout: "section"` for trailing folder icons and flush branch content. `content` is a trusted HTML branch slot for rich rows; escape application text before using it. Default child-item behavior remains unchanged.

Page Header `titleContent` is a trusted HTML replacement for its default heading area (supply an accessible heading when needed). Tabs `panelId` binds tab buttons to a shared application-managed panel and omits generated per-tab panels. Handle `sui:tab:change` to update that panel and its `aria-labelledby`.

Tabs items accept trusted HTML `leading` (such as an Avatar builder result), taking priority over `icon`. Escape any application text inside this slot. Avatar supports `--avatar-background` (default semantic recessed surface); transparent image assets can use `transparent` on their containing layout.

`inputField({ type: "search", icon: "search", placeholder: "Search", ariaLabel: "Search agents" })` adds a decorative leading control icon. `input` supports the same `icon` option.

Agent Run supports `--agent-run-margin` (default `0 0 12px`). Bubbled Message supports `--message-bubble-width` (default `auto`) for shared-width response groups. Configure these on the containing layout.


File Card: `variant: "default" | "attachment"` defaults to `default`. The attachment variant stacks name and size beside a file visual; the existing trusted `actions` slot supplies trailing controls. Preview behavior and the default card remain unchanged.

Message: application-managed nested conversations can pass `attributes: { "data-message-latest": "true" | "false" }` to control which agent action row remains visible. Without this attribute, sibling-based latest-message detection is preserved.

List Row layout: `--list-row-gap` controls leading/content spacing (default 12px). `--list-row-padding` also applies to plain rows, preserving the default 6px 0 when unset.

Workspace Sidebar `headerAction` is a trusted HTML slot replacing the default collapse button. Conversation header actions use `data-sidebar-header-action` to retain compact sizing.

App Shell detail slot accepts layout variables `--shell-detail-width` (300px default) and `--shell-detail-padding` (16px default), including responsive overlay sizing.

App Shell controller: `setDetail(html, { animate: true })` opts into right-panel slide/fade entry or exit and returns a completion Promise. Omit `animate` for immediate behavior. Reduced motion skips the positional animation.
