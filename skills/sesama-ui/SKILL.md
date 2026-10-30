---
name: sesama-ui
description: Build and adjust interfaces using the existing Sesama UI design system, including agent workspaces, dashboards, forms, and chat. Reuse central components and preserve their tokens, typography, states, and behavior. Use when the user requests Sesama UI or work in the sesama-ui project.
---

# Sesama UI

Build from the user's existing components. The source of truth is the live local library, not a remembered screenshot or a fresh interpretation of the UI.

## Find the system first

Locate `sesama-ui.css`, `library.js`, and `Design system.html` in the current workspace. The original project is `C:/Users/abdil/projects/sesama-ui`. Use that path only if the current project does not contain the sources. Read applicable workspace instructions. If the sources cannot be accessed, identify the missing dependency instead of inventing an equivalent library.

Read [runtime.md](references/runtime.md) and [page-blocks.md](references/page-blocks.md) before implementing. For dashboard content, read [content-blocks.md](references/content-blocks.md). For charts, read [charts.md](references/charts.md). For an agent/chat page, also read [agent-workspace.md](references/agent-workspace.md). Inspect the relevant component builder, CSS and behavior in source before using it. The sources take precedence over this skill's examples when they change.

## Central components are mandatory

- Use `SESAMA_UI` builders and existing component examples. A matching class name or similar appearance is not component reuse.
- Extend a central builder when a needed option is missing. Add or update its catalog example. Then consume it in the page. Keep changes within the user's requested scope.
- Start application pages with `SESAMA_BLOCKS.appShell`, `sidebar`, `pageHeader`, and an appropriate `pageLayout`. Use `pageGrid` and `dataSection` for reporting/data content. Do not recreate the shell, sidebar, page header, or grid in page CSS.
- Page CSS owns only task-specific content composition within those blocks. Component CSS owns typography, internal padding, radius, colors, hover/focus/selected states, icons and truncation. Do not restyle `.composer`, `.ti`, `.bubble`, `.sx-select-trigger`, etc. in page CSS to make a private variant.
- If a shared layout capability is needed, expose a configuration/variable centrally (e.g. `--message-width`) and use it rather than overriding internal selectors.
- Do not copy helper functions out of `Design system.html`. Some catalog helpers are private. `workspace-blocks.js` is the central structural block implementation; `workspace-blocks.css` is imported by `library.css`. Export a reusable helper from `library.js` if needed and have the catalog use it too.
- Preserve established variants and actions when adding cases. Do not replace the original File Card with an upload widget or replace the Composer with a different form.
- Do not invent React imports or a public package API. This system currently uses local HTML, CSS and JavaScript. Framework/API integration requires a separate request.

## Visual rules

- Inter Variable. UI 13px regular 400; parent navigation and headings medium 500; child Tree 400. Content in Message and Composer 14px/22px. Metadata generally 12px/16px. Compact badge/avatar text follows size-specific rules. Read current tokens and selectors before changing values.
- Use semantic color, spacing, radius and elevation tokens. Preserve current light/dark behavior.
- Controls use shared, subtle hover; Composer surface has no hover, its controls do. Disabled controls do not gain hover behavior.
- Default Tree labels use subtle text; active labels use primary text. Parent indentation and child branches come from Tree itself.
- Use Rune outline icons through `runeIcon`. Sesama ellipsis additions represent action menus; grip represents drag handles. Do not substitute between them.
- Select has optional label, helper, leading icon and groups. Text-to-chevron gap is 8px. Content can grow, then shrink with ellipsis when constrained. Do not force unrelated selectors to a fixed width.
- No new visual direction or image-generation workflow is needed merely to assemble existing Sesama components. If asked for a separate new visual concept, clarify its relationship to the system through the user's request.

## Verify the actual page

Use the available browser against the saved standalone HTML, not just the catalog. Follow local `file://` support; use an available local browser runtime if the in-app tool cannot inspect local files. Inspect a screenshot at desktop and narrow widths. Check page errors, long names, overflow, disabled states, keyboard focus, open/close and the primary user flow.

Compare catalog and application computed typography when they differ. Check actual loaded fonts; matching `font-family` declarations alone do not prove the same font rendered. Do not claim visual equivalence from syntax checks.

For meaningful shared changes, check at least the affected catalog and a consumer page. Do not add mirror tests for trivial styling edits. Remove temporary QA artifacts.

Clearly distinguish working local interactions from backend integrations. Report material limitations without adding approval gates for routine UI work.
