# Runtime and component reuse

## Files and order

Link `sesama-ui.css`, `forms.css`, `dashboard-components.css`, `library.css` in that order. Load `rune-icons.js` before `library.js`, then load `workspace-blocks.js` and `charts.js` synchronously before using `SESAMA_BLOCKS`. `library.css` imports `workspace-blocks.css`; copy that file too when moving dependencies. Load `forms.js`, `dashboard-components.js`, and `primitives.js` with defer. Keep assets relative to the library files. The starter in `assets/page.html` assumes it is saved beside those sources; change paths or copy the required dependency folders for another project. Never ship unresolved absolute machine paths as public URLs.

`SESAMA_UI` is a classic-script lexical global, not necessarily a `window` property. Call it from a later script. Inspect its current return/export list.

## Verified central entry points

```js
const toNode = html => {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};
const getExample = (component, variant) => {
  const examples = SESAMA_UI.getExamples(component);
  const found = examples?.find(e => e.name === variant);
  if (!found) throw new Error(`Missing ${component} / ${variant}`);
  return found.html;
};
```

Example names are case-sensitive and can change. Inspect the registry first. Use setters/textContent to supply user data; do not interpolate unescaped names into HTML.

- `SESAMA_UI.iconButton(icon, variant, attributes, accessibleLabel)` renders the same Icon Button used by the catalog.
- `SESAMA_UI.select(variant, config)` supports `label`, `name`, `hideLabel`, `inline`, `icon`, `value`, `options`, `groups`. Options can be strings or `{label, icon}`. Groups are `{label, options}`. Inspect current implementation for supported fields.
- `SESAMA_UI.tree(nodes)` uses `{n, i, key, k, o, selected}`. `k` is a child array; `o:0` starts collapsed; `i:false` omits the icon. Keys render as `data-tree-key`. Attach application behavior by delegation. Shared handlers own expand/collapse and selection.
- `SESAMA_UI.treeSection(title, html, {actionIcon, actionLabel, actionAttributes})`: inline section heading, no background, optional trailing Icon Button. Use it for Projects + Add project.
- `SESAMA_UI.fileAttachment({name, iconName, src, type, removable})`: shared File Card. `src` may be a local Blob URL; type is image/video/audio/pdf/text/other. Preview expands inline. Unsupported formats display a fallback icon. Revoke Blob URLs when the owning draft/chat is actually disposed, not while another view still uses them.
- `SESAMA_UI.getExamples(name)` returns `{name, html, description, code}`. Composer Empty/Ready/Thinking and Message cases are useful starting instances. Some examples (e.g. Modal Form) may still depend on catalog-only helpers: inspect and centralize instead of calling every registry blindly in a standalone app.
- `dsOpenModal(dialog, trigger)` handles reset of internal scroll and restoration of background scroll. Use the shared Modal header/body/actions classes and `data-modal-close`.
- `dsToast(message, tone)` uses the central Toast. Inspect its options before adding title/actions or async updates.

`SESAMA_UI.install` populates the documentation catalog; consumers generally do not need it.

## Main component choices

Use Input for bare controls, Input Field for label/password/phone composition. Use Menu/Menu Item for actions and grouped menus; Select is for choosing values. Use File Card for attachments, Scroll Area for overflow, Tooltip for action feedback, Toast for brief app notifications. Do not simulate integrations with misleading completed states.

Menu, Select, Popover and Tooltip use native popovers styled by Sesama. Preserve their accessibility and keyboard behavior. Dropdown/tooltips dismiss on surrounding scroll while internal menu scroll remains usable.
