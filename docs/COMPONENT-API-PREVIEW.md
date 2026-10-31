# Component API preview

This is a local migration preview, not a frozen API or an npm release. The repository is still private to npm publishing (`private: true`). Run `npm run dev` and open `/demos/Component%20API.html` to try it.

Current priority: working component APIs, form integration and lifecycle. Manual screen-reader review is deferred and does not block this development work. Automated accessibility regression checks remain enabled.

Next work is tracked in the [full implementation plan](COMPONENT-API-IMPLEMENTATION-PLAN.md) and [48-entry migration manifest](COMPONENT-API-MIGRATION.json). Current coverage is five catalog entries through four implementation groups; coverage is not a claim of complete variant parity or release readiness.

## Source layout

- `src/components/`: pure shared markup and ESM component entry points.
- `src/runtime.mjs`: explicit opt-in mount, refresh and teardown.
- `src/index.mjs` / `src/index.d.mts`: preview exports and TypeScript declarations.
- `src/styles/components/`: independent, scoped CSS for Button, Input/Input Field, Select and Modal, with shared control/icon/popup dependencies.
- `src/styles/tokens.css` and `base.css`: shared variables and an opt-in `.sui-root` baseline. `fonts.css` is an optional external-font import.
- The old `sesama-ui.css`, `forms.css`, `dashboard-components.css` and `library.css` entries remain compatible with existing pages. Other component families are not yet split into independent CSS entries.
- `src/icons/controls.mjs`: the five Rune outline glyphs required by these controls; sourced from the existing library and subject to its license.
- `src/legacy/`: the current catalog/application runtime. It retains document-wide behavior until the other component families are migrated.

`create-builders.mjs` is the single markup implementation for Button, Input Field, Select and Modal. `src/styles/components/*.css` is their canonical styling source. `npm run build` generates the classic-script bridge and `src/styles/legacy-controls.css` used by existing pages. Do not edit either generated file manually. CI rejects outdated generated output.

## Usage

```js
import {button,inputField,select,modal,initModal,mount} from './src/index.mjs';
// Individual imports also work, e.g. ./src/components/select.mjs.

container.innerHTML = inputField({
  id:'email',name:'email',label:'Email',type:'email',autocomplete:'email'
}) + select({
  name:'team',label:'Team',value:'design',
  options:[{label:'Design',value:'design'},{label:'Engineering',value:'engineering'}]
}) + button({label:'Save',type:'submit',variant:'primary',size:'base'});

const session = mount(container);
// After adding new component markup:
session.refresh();
// On application unmount:
session.destroy();
```

Importing modules does not read `document`/`window`, install listeners or render overlays. The builders can run in Node. ESM requires an HTTP server; do not open the preview using `file://`.

## Independent CSS and themes

```html
<!-- Just Button. Base + tokens are imported automatically; no chart or app-shell CSS. -->
<link rel="stylesheet" href="src/styles/components/button.css">
<div class="sui-root" data-sui-theme="light" id="example"></div>
```

Use `field.css` for Input/Input Field, `select.css` for Select, and `modal.css` for Modal. Each entry imports its required styles; a Modal containing a Select still needs `select.css` because that is application composition. Or use `src/styles/components.css` to load the four preview families together.

The `.sui-root` wrapper is required. Only the variable definitions in `tokens.css` apply at `:root`; resets, typography and component rules are scoped to `.sui-root`. Host buttons, inputs, tables and body are not reset. Preserve the wrapper around native top-layer dialogs/popovers; CSS inheritance and scoped selectors continue through their DOM ancestry.

Set `data-sui-theme` on the wrapper to `light`, `dark` or `system`. CSS variables can be overridden on the wrapper. Fonts are not fetched by the component entries. Load `fonts.css` explicitly for the current external Inter source, supply your own font, or set `--font-family-ui`.

Forced colors and reduced motion are supported. Higher-contrast control boundaries are available through the browser's `prefers-contrast: more` setting. Default subtle control boundaries still require non-text contrast review before an AA claim.

`mount` is idempotent for the same root. Overlapping roots share controller ownership: destroying one mount does not disable a component still owned by another mount. `refresh` initializes new nodes, updates controller context, and disposes removed nodes. Call it after replacing a view; DOM discovery is explicit. Controllers observe native disabled/required attributes and relevant fieldsets.

Handles returned by `initInput`, `initSelect` and `initModal` for mounted nodes are borrowed handles to the same instances. Use the owning mount's `destroy` for ordinary teardown. `destroy` is idempotent; state-changing methods on a destroyed controller reject further use. A destroyed mount cannot be refreshed; call `mount(root)` to start a new session.

## Component behavior

| Entry | Contract |
| --- | --- |
| `button(options)` | Native button, escaped text label; type, variant, size and disabled. Default is 26px `sm`; base is 30px. |
| `input(options)` | Bare input shell with an accessible label. Uses the same Input Field markup without a visible title. |
| `inputField(options)` | Label, native input, optional helper/error, phone prefix and password toggle. Base 30px; sm 26px; lg 34px. Use `ariaLabel` when omitting the visible label. An error also sets `aria-invalid`. |
| `initInput(element)` | Native `control`, value/disabled/required getters, `setValue`, `setDisabled`, `setRequired`, `setCustomValidity`, `checkValidity`, `reportValidity`, `refresh`, `destroy`. Reset restores the initial password visibility and clears custom validity. |
| `select(options)` | Shared Select appearance backed by a native select for form value and validation. Visible label and selected value are associated with the trigger. Supports `ariaLabel`, helper, error, invalid state, groups and disabled options. Values must be unique; duplicate labels are supported. |
| `initSelect(element)` | Native `control`; the same form methods as Input plus `open`/`close`. Programmatic `setValue` emits no user event. User selection emits bubbling `sui:change` with `{name,value,previousValue}`. Native change events synchronize the visible value. Arrow/Home/End, typeahead, Escape and Tab work; surrounding scroll/outside pointer dismisses. |
| `modal(options)` | Native dialog with central header, close button, body and optional actions. `title`/`description` are text. `content`/`actions` are **trusted HTML slots**. |
| `initModal(dialog)` | Returns `{open,close,destroy}`. `close(reason,returnValue)` supports an optional return value. Internal scroll resets on open; background scroll and trigger focus are restored. Emits bubbling `sui:open` and `sui:close` (`{reason,returnValue}`). Immediate close/reopen does not process a stale close event against the new session. Locked dialogs reject Escape/backdrop dismissal. |

## Form integration

Input and Select participate in `FormData`, `form.checkValidity()`, `form.reportValidity()` and `form.requestSubmit()` through their actual native controls. An omitted `name` adds no implicit form key. Disabled controls, including controls inside a disabled fieldset, are excluded by the browser. `novalidate` retains its native meaning.

```js
const team = initSelect(container.querySelector('[data-sui-select]'));
team.setValue('engineering');             // Silent programmatic update.
team.setRequired(true);
team.setDisabled(false);
team.setCustomValidity('');               // Clear a business/server validation error.
const valid = form.checkValidity();
const values = Object.fromEntries(new FormData(form));
```

Invalid Select values show the shared inline error and focus the first invalid Select trigger in that validation batch. The native browser validation bubble is replaced by this feedback. `error`/`invalid` builder options render an initial presentation state; use native constraints or `setCustomValidity(message)` when that error must block submission.

Form reset restores native default values, clears controller custom validity and generated Select feedback, conceals initially hidden passwords, and closes Select popups. Initial builder presentation such as an Input's static `error` prop remains application-owned. Canceled reset events preserve current state. Programmatic updates do not emit `sui:change`; actual option selection emits it once. When changing the native control's `.value` directly, call controller `refresh()` or dispatch a native `change` event to synchronize its visible label. Replace component markup and call mount `refresh()` when changing the option list.

These behaviors follow native [Select validation](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/checkValidity), [form reset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset), and [requestSubmit](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit) rather than intercepting the application's submit handler. No claim of complete assistive-technology support is made yet.

All runtime attributes introduced by the preview use `data-sui-*`. Existing CSS class names are shared with the legacy system and are not frozen public selectors yet. Modern consumers should not load the legacy runtime. The legacy runtime remains necessary for the other 43 catalog component entries.

## Remaining release gates

1. Continue independent CSS extraction for the remaining component families.
2. Continue event, type and update contracts for remaining widgets. Required/disabled/reset/native form integration for the four preview families is covered by `test:functional` in Chromium, Firefox and WebKit.
3. Manual screen-reader, Safari and non-text contrast review remain a deferred accessibility workstream. They are not the current functional API work gate. See [accessibility results](ACCESSIBILITY-REPORT.md); automated results are not a conformance claim.
4. Create package export maps, pack/install tests and CDN asset checks before publishing.
5. Migrate the rest of the catalog, blocks, demos and skill away from legacy globals and catalog sample builders.
