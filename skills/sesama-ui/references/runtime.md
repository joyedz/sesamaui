# Runtime and Component Lifecycle

Sesama UI uses pure functional builders for HTML markup and a centralized controller runtime for progressive hydration, keyboard navigation, popovers, and accessibility.

## Public Module Entry Points

All public builders, components, blocks, icons, and runtime functions are exported from the single entry point:

```js
import {
  // Components
  button, iconButton, linkButton, socialButton,
  input, inputField, select, modal, table, pagination,
  badge, statusDot, avatar, label, divider, card, banner,
  emptyState, loader, skeleton, scrollArea, checkbox, radio,
  switchControl, textarea, chip, menuItem, menu, popover,
  dropdownMenu, tooltip, showToast, buttonGroup, commandPalette,
  combobox, datePicker, tagInput, tabs, breadcrumbs,
  treeItem, tree, treeSection, listRow, toolbar, collapsible,
  chart, wire, canvas, fileCard, fileAttachment,
  message, toolCall, agentRun, composer,
  // Blocks
  appShell, workspaceSidebar, sidebar, pageHeader,
  pageLayout, pageGrid, contentSection, dataSection,
  peopleList, activityFeed, metricCard, metricSummary, chartSection,
  // Runtime
  mount, registerController, controllerRegistry,
  // Utilities
  controlIcon, escapeHTML, uid
} from './src/index.mjs'; // Or '../src/index.mjs' from subdirectories
```

## Required Stylesheets and Scoping

Sesama UI CSS is scoped under `:where(.sui-root)` to prevent leaking into consumer styles and ensure total style isolation:

```html
<link rel="stylesheet" href="src/styles/fonts.css">
<link rel="stylesheet" href="src/styles/components.css">
<link rel="stylesheet" href="src/styles/blocks.css">

<body class="sui-root">
  <!-- All Sesama UI components live inside .sui-root -->
</body>
```

You can also import individual component and block stylesheets (e.g., `src/styles/components/button.css`, `src/styles/blocks/app-shell.css`).

## DOM-Free Rendering

Every builder is a pure function that returns a semantic, accessible HTML string:

```js
const html = inputField({
  id: 'user-email',
  name: 'email',
  label: 'Email address',
  placeholder: 'name@company.com',
  required: true
});
```

Because builders are pure string generators without global DOM side-effects, they can safely execute in Node.js, static site generators, server-side rendering (SSR), and browser environments.

## Hydration with `mount()`

To activate interactive behaviors (focus management, keyboard roving, native popovers, accessible dialogs, charts, and form syncing), hydrate the DOM root:

```js
import { mount } from './src/index.mjs';

// Hydrate all components inside a container or the whole document
const session = mount(document.body);

// Update parts of the DOM dynamically
document.getElementById('content-area').innerHTML = newMarkup;
session.refresh(); // Automatically discovers and binds newly added components

// Clean up listeners and observers on unmount
session.destroy();
```

### Lifecycle Semantics:
1. `mount(root)` discovers all elements inside `root` that match selectors registered in `controllerRegistry` (e.g. `[data-sui-input-field]`, `[data-sui-select]`, `dialog[data-sui-modal]`, `[data-sui-table]`).
2. Calling `mount(root)` on an already-mounted root returns the existing session (idempotent).
3. Overlapping mounts share controller ownership cleanly via reference counting.
4. `session.destroy()` destroys all controllers owned exclusively by that session and disconnects mutation observers and event listeners.
5. After `destroy()`, calling methods on destroyed controllers throws a descriptive error.

## Custom Controller Registration

New custom controllers can be registered into the shared runtime registry:

```js
import { registerController } from './src/index.mjs';

registerController('[data-custom-widget]', (element) => {
  // Initialize behavior on element
  function onClick() { /* ... */ }
  element.addEventListener('click', onClick);

  return {
    destroy() {
      element.removeEventListener('click', onClick);
    }
  };
});
```

## Form Integration and Events

Modern Sesama UI form components are backed by native elements:

- **Native form backing**: `inputField` wraps a native `<input>`, `textarea` wraps `<textarea>`, `select` maintains a synchronized hidden native `<select>`, and `switchControl` / `checkbox` sync with native checkboxes.
- **Validation**: Controllers expose `checkValidity()`, `reportValidity()`, and `setCustomValidity(message)`. They integrate natively with standard `form.checkValidity()` and `new FormData(form)`.
- **Reset handling**: Forms listening to `reset` events automatically restore initial states across all Sesama components.
- **Silent setters**: Programmatic controller calls like `inputCtrl.setValue('val')` or `selectCtrl.setValue('opt')` update the DOM silently without firing artificial change events.
- **User events**: User interactions trigger custom events that bubble:
  - `sui:change` with `detail: { name, value, ... }`
  - `sui:table:select`, `sui:table:sort`, `sui:table:rowclick`
  - `sui:modal:close` or `sui:close` with `{ reason, returnValue }`
  - `sui:tab:change` with `{ id }`
  - `sui:toast:show`, `sui:toast:dismiss`
