# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Sesama UI is a dependency-free vanilla HTML/CSS/JavaScript design system (npm package `sesama-ui`, alpha). Every component is a pure ES Module "builder" function that returns accessible HTML strings — DOM-free, safe for SSR/build-time — hydrated by a single `mount()` runtime. Requires Node.js >= 22. There is no bundler or transpiler; the source modules are shipped directly to consumers.

## Commands

```sh
npm run dev            # Static server at http://127.0.0.1:4173 (ESM needs HTTP; never open pages via file://)
npm run check          # CI gate: legacy build freshness + node --check over all JS files
npm run build          # Regenerate legacy bridge and legacy CSS (only after editing canonical sources)
npm test               # Unit tests via node --test: API contract, CSS scoping, consumer, packaging, XSS
npm run test:browser   # Playwright smoke tests (BROWSER=chromium|firefox|webkit, default chromium)
npm run test:a11y      # axe-core across 12 states (light/dark, 320px reflow, forced colors)
npm run test:keyboard  # Keyboard navigation suites
npm run test:functional # Interaction suites
npx playwright install chromium firefox webkit  # One-time browser install for the Playwright suites
```

Run a single test file or test by name:

```sh
node --test tests/api.test.mjs
node --test --test-name-pattern="escape" tests/api.test.mjs
```

CI (`.github/workflows/source-checks.yml`) runs `npm run check` + `npm test` on Node 22/24, and all four Playwright suites on a chromium/firefox/webkit matrix.

## Architecture

### Builder → markup → `mount()` pipeline

- **Builders** (`src/components/*.mjs`, `src/blocks/*.mjs`): pure, side-effect-free functions returning HTML strings. Importing a module must never touch `document` or `window` (asserted by `tests/api.test.mjs`). Builders validate options (throw `TypeError` on invalid enums) and escape all text options by default via `escapeHTML` (`src/components/shared.mjs`).
- **Controllers** (`initX` factories exported alongside builders): attach interactive behavior to elements matching `[data-sui-*]` attributes and return handles with `destroy()`, `refresh()`, and state APIs (e.g. `setValue`, `setDisabled`).
- **Runtime** (`src/runtime.mjs`): `controllerRegistry` maps `[data-sui-*]` selectors to controllers. `mount(root)` scans the DOM, initializes matching controllers, and returns a session `{ refresh(), destroy() }`. `mount` is idempotent per root, overlapping roots share controller ownership, and `session.refresh()` must be called after replacing markup. New interactive components must register their selector/controller pair in `controllerRegistry`.
- **Blocks** (`src/blocks/`): structural layouts (`appShell`, `workspaceSidebar`, `pageHeader`, `pageLayout`, `pageGrid`, `dataSection`, …) plus domain recipes in `recipes.mjs` that compose components into full pages.
- **Icons** (`src/icons/`): Rune outline icon library; `controlIcon(name, size)` renders SVGs.

### CSS: scoping and theming

- All component/block rules are scoped under `:where(.sui-root)` (zero specificity inflation); pages must set `<body class="sui-root">` or wrap content in a `.sui-root` container. Only token definitions apply at `:root`.
- `src/styles/tokens.css` defines semantic variables; light/dark theming uses `light-dark()` tokens driven by `data-sui-theme="light|dark|system"` on the wrapper.
- Per-component stylesheets live in `src/styles/components/*.css` and `src/styles/blocks/*.css` (with `@import` dependencies); `components.css` and `blocks.css` are the aggregates.

### Generated files — never hand-edit

`npm run build` generates compatibility artifacts from canonical sources; `npm run check` fails if they are stale:
- `src/legacy/component-builders.js` ← generated from `src/components/create-builders.mjs` (classic `SESAMA_UI`/`SESAMA_BLOCKS` global bridge)
- `src/styles/legacy-controls.css` ← generated from `src/styles/components/{button,icon-button,field,select,popup,modal,control}.css` (rewrites `:where(.sui-root)` scoping to `:root`)

`src/legacy/` exists only for pages still using the pre-release globals; new integrations use the ESM entry points.

### Public API surface

- `src/index.mjs` is the root export. Per-component subpaths (`sesama-ui/button`, `sesama-ui/blocks`, `sesama-ui/icons`, `sesama-ui/css/*.css`) come from the `exports` map in `package.json` with matching `.d.mts` type declarations. When adding or renaming a component, update: the component module, `src/index.mjs` + `src/index.d.mts`, the `package.json` exports map, and the per-component `.d.mts`.
- Shared class names (`.btn`, `.field`, `.sx-*`) are styling hooks, not public API. Runtime attributes use the `data-sui-*` prefix.

### Trusted HTML slots

Builders escape every text option by default. A documented set of options (e.g. `modal` `content`/`actions`, `card` `header`/`content`/`footer`, `table.columns[].render()` output — full list in `docs/COMPONENT-API-PREVIEW.md`) is rendered verbatim as trusted application HTML; only pass markup you control there, never untrusted user input. This contract is enforced by `tests/xss.test.mjs`.

### Pages, tests, and docs

- `site/Design system.html` — component catalog; `demos/*.html` — standalone app examples consuming `src/` directly; `demos/Component API.html` — interactive API preview.
- `tests/*.test.mjs` — Node unit tests without a DOM; `tests/*.cjs` — Playwright suites, each spawning `tools/serve.mjs` on its own default port (overridable via `TEST_PORT`), driving fixtures from `tests/fixtures/`.
- `skills/sesama-ui/` — the agent skill for building UI with this system; `references/` holds per-domain guides (runtime, page blocks, content blocks, charts, agent workspace).
- `docs/` — API contract (`COMPONENT-API-PREVIEW.md`), architecture notes (`ALPHA-RELEASE.md`), accessibility report.

## Conventions

- Do not restyle component internals (`.sui-button`, `.ti`, `.bubble`, `.sx-table`, …) in page or demo CSS to make private variants. Extend the central builder/CSS instead, and expose shared layout capabilities as configuration variables (e.g. `--message-width`) rather than overriding internal selectors.
- Preserve established variants, states, and behaviors when adding cases; verify changes in light and dark themes and at narrow widths.
- Document packaging, API, and accessibility changes in `CHANGELOG.md`. Do not claim axe, screen-reader, or cross-browser results that were not actually run.
- Alpha status: the API may change before beta. Experimental components are Combobox, Date Picker, Command Palette, Tree, and Tag Input.
