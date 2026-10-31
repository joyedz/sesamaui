---
name: sesama-ui
description: Build and adjust interfaces using the modern Sesama UI design system, including agent workspaces, dashboards, forms, and chat. Reuse central ESM components and preserve their tokens, typography, states, and behavior. Use when the user requests Sesama UI or work in the sesama-ui project.
---

# Sesama UI

Build from the system's canonical ESM components and structural blocks. The source of truth is the live local library in `src/`, not a remembered screenshot or a fresh interpretation of the UI.

## Find the system first

Locate `src/index.mjs`, `src/styles/components.css`, and `src/styles/blocks.css` in the current workspace. Resolve paths from the repository root containing `package.json`; do not assume a machine-specific workspace path.

Read [runtime.md](references/runtime.md) and [page-blocks.md](references/page-blocks.md) before implementing. For dashboard content, read [content-blocks.md](references/content-blocks.md). For charts, read [charts.md](references/charts.md). For an agent/chat page, also read [agent-workspace.md](references/agent-workspace.md). Inspect the relevant component builder, CSS and controller behavior in source before using it. The sources take precedence over this skill's examples when they change.

## Modern ESM Architecture

- Import canonical builders, controllers, and runtime helpers directly from `src/index.mjs` (or relative path like `../src/index.mjs` from subdirectories).
- Component stylesheets are scoped under `:where(.sui-root)`. Ensure pages have `<body class="sui-root">` or wrap all Sesama UI elements inside a `.sui-root` container.
- Always include the required core stylesheets:
  - `src/styles/components.css` (or individual component CSS in `src/styles/components/*.css`)
  - `src/styles/blocks.css` (or individual block CSS in `src/styles/blocks/*.css`)
  - `src/styles/fonts.css` (Inter Variable and typography tokens)
- Builders are pure functions returning HTML strings. They are completely DOM-free and can be run during build time, server-side, or in browser scripts.
- Interactive components are activated via `mount(root)`. Calling `mount(document.body)` inspects the DOM, initializes controllers for all matching `[data-sui-*]` elements, and returns a session `{ refresh(), destroy() }`.

## Central components and blocks are mandatory

- Use public builders imported from `src/index.mjs`. A matching class name or similar appearance is not component reuse.
- Start application pages with `appShell`, `workspaceSidebar` (or `sidebar`), `pageHeader`, and an appropriate `pageLayout`. Use `pageGrid` and `dataSection` for reporting/data content. Do not recreate the shell, sidebar, page header, or grid in page CSS.
- Page CSS owns only task-specific content composition within those blocks. Component CSS owns typography, internal padding, radius, colors, hover/focus/selected states, icons and truncation. Do not restyle `.ti`, `.bubble`, `.sx-table`, `.sui-button`, etc. in page CSS to make a private variant.
- If a shared layout capability is needed, expose a configuration/variable centrally (e.g. `--message-width`) and use it rather than overriding internal selectors.
- Do not copy catalog helpers or private utilities. All public components and blocks are exported from `src/index.mjs`.
- Preserve established variants and actions when adding cases. Do not replace the original File Card with an upload widget or replace the Composer with a different form.

## Visual rules

- **Typography**: Inter Variable. UI 13px regular 400; parent navigation and headings medium 500; child Tree 400. Content in Message and Composer 14px/22px. Metadata generally 12px/16px. Compact badge/avatar text follows size-specific rules. Read current tokens and selectors before changing values.
- **Tokens**: Use semantic color, spacing, radius and elevation tokens. Preserve current light/dark behavior via `data-sui-theme="light|dark"`.
- **Controls**: Controls use shared subtle hover; Composer surface has no hover, its controls do. Disabled controls do not gain hover behavior.
- **Tree**: Default Tree labels use subtle text; active labels use primary text. Parent indentation and child branches come from Tree itself.
- **Icons**: Use Rune outline icons through `controlIcon`. Ellipsis additions represent action menus; grip represents drag handles.
- **Select**: Supports optional label, helper, leading icon and groups. Text-to-chevron gap is 8px. Content can grow, then shrink with ellipsis when constrained.
- No new visual direction or image-generation workflow is needed merely to assemble existing Sesama components. If asked for a separate new visual concept, clarify its relationship to the system through the user's request.

## Verify the actual page

Use the available browser against the saved standalone HTML, not just the catalog. Follow local `file://` support; use an available local browser runtime if the in-app tool cannot inspect local files. Inspect a screenshot at desktop and narrow widths. Check page errors, long names, overflow, disabled states, keyboard focus, open/close and the primary user flow.

For meaningful shared changes, run the automated verification suite:
`npm run check; npm test; npm run test:functional; npm run test:browser`
