<div align="center">
  <br>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/img/sesama-logo-dark.svg">
    <img src="assets/brand/sesama-logo-final.svg" alt="Sesama" width="180">
  </picture>
  <br>
  <p>A shared UI language for dashboards, AI workspaces, and everyday tools.</p>
  <p>
    <a href="https://github.com/joyedz/sesamaui/actions/workflows/source-checks.yml"><img src="https://github.com/joyedz/sesamaui/actions/workflows/source-checks.yml/badge.svg?branch=main" alt="CI status"></a>
    <a href="https://github.com/joyedz/sesamaui/releases"><img src="https://img.shields.io/github/v/release/joyedz/sesamaui?style=flat" alt="Latest release"></a>
  </p>
  <br>
</div>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/img/dashboard-dark.png">
    <img src="docs/img/dashboard-light.png" alt="Sesama Dashboard Overview with metrics and charts" width="100%">
  </picture>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/img/issue-my-inbox.png" alt="Issue Workspace My Inbox" width="100%"></td>
    <td width="50%"><img src="docs/img/ai-agent-new-chat.png" alt="AI Agent New Chat" width="100%"></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/img/agent-bot.png" alt="Agent Bot conversation" width="100%"></td>
    <td width="50%"><img src="docs/img/onboarding-login.png" alt="Sesama onboarding login screen" width="100%"></td>
  </tr>
</table>

Sesama UI is a dependency-free vanilla HTML/CSS/JavaScript design system. Every component is a pure ES Module builder that renders accessible, semantic HTML strings — in the browser, in Node.js, or at build time — and hydrates through a single `mount()` runtime with real lifecycles.

**Status: stable 0.x (`0.1.0`).** The API may still change in minor releases; experimental components are labeled. See [CHANGELOG.md](CHANGELOG.md).

## Features

- **Pure ESM builders** — every component and layout block is a tree-shakeable module; import only what you use.
- **TypeScript-ready** — complete `.d.mts` declarations for autocomplete in VS Code, Cursor, and WebStorm.
- **Render anywhere** — builders are side-effect-free and run without a DOM (SSR, SSG, build-time).
- **One hydration runtime** — `mount(root)` attaches controllers with `refresh()` and `destroy()` lifecycles.
- **Scoped CSS** — all styles are isolated under `:where(.sui-root)`, so they do not leak into or out of your application.
- **Accessible by default** — keyboard navigation, focus management, native popovers and dialogs, reduced-motion and forced-colors support; checked with axe across 12 states.
- **Light and dark themes** — semantic tokens built on `light-dark()`.
- **No runtime dependencies** — Inter ships self-hosted (OFL) and is optional.

## Installation

```sh
npm install sesama-ui
```

Published on [npm](https://www.npmjs.com/package/sesama-ui) and mirrored on [GitHub Packages](https://github.com/joyedz/sesamaui/pkgs/npm/%40joyedz%2Fsesama-ui) (`@joyedz/sesama-ui`).

## Quick start

Link the stylesheets and opt your application root into the system:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="node_modules/sesama-ui/src/styles/fonts.css">
  <link rel="stylesheet" href="node_modules/sesama-ui/src/styles/components.css">
  <link rel="stylesheet" href="node_modules/sesama-ui/src/styles/blocks.css">
</head>
<body class="sui-root">
  <div id="app"></div>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

Compose components as data, then hydrate once:

```js
import { appShell, workspaceSidebar, pageHeader, pageLayout, table, mount } from 'sesama-ui';

document.getElementById('app').innerHTML = appShell({
  sidebar: workspaceSidebar({
    workspace: 'Acme workspace',
    navigation: [{ label: 'Overview', icon: 'home', active: true }]
  }),
  header: pageHeader({ title: 'Overview', icon: 'grid-3x3' }),
  content: pageLayout(table({
    columns: [
      { key: 'name', header: 'Name' },
      { key: 'status', header: 'Status' }
    ],
    rows: [{ id: 1, name: 'First record', status: 'Active' }]
  }), { variant: 'data' })
});

mount(document.body);
```

Import subpaths to keep bundles small:

```js
import { datePicker } from 'sesama-ui/date-picker';
import { dataSection } from 'sesama-ui/blocks';
import 'sesama-ui/css/components.css';
```

## Components

**48 component families** across six groups:

| Group | Components |
| --- | --- |
| Actions | Button, Icon Button, Link Button, Social Button, Button Group |
| Forms | Input Field, Select, Textarea, Checkbox, Radio, Switch, Combobox, Date Picker, Tag Input, Label |
| Overlays | Modal, Menu, Menu Item, Popover, Dropdown Menu, Tooltip, Toast, Command Palette |
| Display | Badge, Status Dot, Avatar, Divider, Card, Banner, Empty State, Loader, Skeleton, Chip |
| Navigation | Tabs, Breadcrumbs, Tree, List Row, Toolbar, Collapsible, Pagination |
| Data and AI | Table, Chart, Wire, Canvas, File Card, Message, Tool Call, Agent Run, Composer |

**11 structural blocks** compose them into application layouts: `appShell`, `workspaceSidebar`, `pageHeader`, `pageLayout`, `pageGrid`, `contentSection`, `dataSection`, `metricCard` / `metricSummary`, `peopleList`, `activityFeed`, `chartSection`, plus the `agentCardRecipe` domain recipe.

Complex widgets — Combobox, Date Picker, Command Palette, Tree, Tag Input — are labeled **experimental** and are prioritized for manual screen-reader review; the rest are stable within 0.x. Maturity details live in the [API contract](docs/COMPONENT-API-PREVIEW.md).

Browse every component, variant, and state in the [component catalog](site/Design%20system.html), or try the [Component API preview](demos/Component%20API.html).

## Solid and blur surfaces

ESM builders with a background accept `surface: 'solid' | 'blur'`. Solid remains the default. This option preserves the existing variant/tone and interaction states; nested components keep their own surface.

```js
composer({ surface: 'blur' });
card({ surface: 'blur', content: inputField({ label: 'Name', surface: 'solid' }) });
```

Tune `--surface-opacity` (78%), `--surface-blur` (16px), and `--surface-saturation` (140%). Forced colors and reduced transparency use solid surfaces. See the catalog's **Surface · Solid / Blur** examples and [surface API details](docs/COMPONENT-API-PREVIEW.md#shared-surfaces-esm).

## Demos

Standalone application examples built with the library:

| Page | Source |
| --- | --- |
| Login | [demos/onboarding/Login.html](demos/onboarding/Login.html) |
| Dashboard | [demos/dashboard/Dashboard overview.html](demos/dashboard/Dashboard%20overview.html) |
| Revenue | [demos/dashboard/Revenue report.html](demos/dashboard/Revenue%20report.html) |
| Orders | [demos/dashboard/Orders.html](demos/dashboard/Orders.html) |
| Customers | [demos/dashboard/Customers.html](demos/dashboard/Customers.html) |
| AI workspace | [demos/ai-agent/AI agents demo.html](demos/ai-agent/AI%20agents%20demo.html) |
| Agent directory | [demos/ai-agent/Agents.html](demos/ai-agent/Agents.html) |
| Agent Bot | [demos/ai-bot/Agent Bot.html](demos/ai-bot/Agent%20Bot.html) |
| Issue workspace | [demos/issue/Issue workspace.html](demos/issue/Issue%20workspace.html) |
| My issues | [demos/issue/My issues.html](demos/issue/My%20issues.html) |
| Review | [demos/issue/Reviews.html](demos/issue/Reviews.html) |
| All issues | [demos/issue/All issues.html](demos/issue/All%20issues.html) |

Run `npm run dev` and open http://127.0.0.1:4173 for an index page linking every demo and the catalog. More examples are indexed in [demos/README.md](demos/README.md). Authentication, model responses, and agent execution in the demos are local simulations, not connected services.

## Documentation

- [Release guide](docs/RELEASE.md) — component inventory and architecture
- [Component API contract](docs/COMPONENT-API-PREVIEW.md)
- [Accessibility report](docs/ACCESSIBILITY-REPORT.md)
- [Changelog](CHANGELOG.md)

## Development

Requires Node.js 22 or later.

```sh
npm install
npm run dev               # static server with a demo index at http://127.0.0.1:4173
npm run check             # syntax and generated-source consistency
npm test                  # unit: API contract, CSS scoping, consumer, packaging
npx playwright install chromium firefox webkit
npm run test:browser      # cross-engine smoke tests
npm run test:a11y         # axe across 12 states (light/dark, reflow, forced colors)
npm run test:keyboard     # keyboard navigation
npm run test:functional   # interaction suites
```

Project layout: `src/components/` (component builders), `src/blocks/` (layout blocks), `src/icons/` (icon library), `src/runtime.mjs` (mount runtime), `src/styles/` (tokens, base, component and block stylesheets), `demos/` (application examples grouped by category folders), `skills/sesama-ui/` (agent skill).

Automated checks cover structure, contrast, and interaction. Manual screen-reader review is planned before the 1.0 release and is not claimed by these suites.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). To report a security issue, see [SECURITY.md](SECURITY.md).

## License

Original Sesama code and documentation are licensed under [MIT](LICENSE). Third-party icons and trademarks retain their own terms; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and [NOTICE](NOTICE).

Designed by [zihni.design](https://zihni.design).
