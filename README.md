# Sesama UI

A shared UI language for dashboards, AI workspaces, and everyday tools.

**Status: pre-release.** This repository contains the working vanilla HTML/CSS/JavaScript system, its catalog, application examples, and an agent skill. Modular packages and the stable public API are being prepared. There is no published npm/CDN release yet.

## Run locally

Requires Node.js 22 or later. No dependency installation is needed for the current static demo server.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Use the local server for asset loading and browser integrations rather than opening HTML files directly.

## Explore

| Page | Source |
| --- | --- |
| Landing | [Sesama landing.html](Sesama%20landing.html) |
| Component catalog | [Design system.html](Design%20system.html) |
| Login | [demos/Login.html](demos/Login.html) |
| Dashboard | [demos/Dashboard overview.html](demos/Dashboard%20overview.html) |
| Revenue | [demos/Revenue report.html](demos/Revenue%20report.html) |
| Orders | [demos/Orders.html](demos/Orders.html) |
| Customers | [demos/Customers.html](demos/Customers.html) |
| AI workspace | [demos/AI agents demo.html](demos/AI%20agents%20demo.html) |
| Issue workspace | [demos/Issue workspace.html](demos/Issue%20workspace.html) |

Example authentication, model responses and agent execution are local demonstrations, not connected backend services.

## Source map

- `src/styles/sesama-ui.css`: design tokens and primitive styles.
- `src/legacy/library.js` / `src/styles/library.css`: shared component builders, variants and behavior.
- `src/components/`: shared pure builders and opt-in component modules.
- `src/blocks/`: structural layout blocks (app shell, sidebar, page grid, data sections).
- `src/icons/`: Rune icon library and licensing.
- `src/runtime.mjs`: mount/hydration runtime with lifecycle controllers.
- `src/legacy/`: classic-script compatibility runtime and catalog examples.
- `src/styles/`: existing central styles, including forms, blocks and charts.
- `src/legacy/rune-icons.js` / `assets/rune-icons`: icon library and licensing.
- `skills/sesama-ui`: repository copy of the agent skill.
- `demos/`: standalone application examples and their page-specific assets.
- `docs/`: release plans, specifications and design audits.

This is the current source layout, not the final package API. Some examples and skill instructions still have legacy assumptions; see the release plan before integrating into another application.

## Component library (ESM)

The full migration is complete: 48 component families and 20 structural blocks ship as pure ESM builders with `.d.mts` type declarations — see the [alpha release guide](docs/ALPHA-RELEASE.md) for the full inventory and [usage examples](demos/README.md).

```js
import { appShell, table, mount } from 'sesama-ui';
import { datePicker } from 'sesama-ui/date-picker';
import 'sesama-ui/css/components.css';
```

Every builder renders server-side without a DOM, and `mount(root)` attaches controllers with `refresh()`/`destroy()` lifecycle. Input Field and Select participate in native form validation with controller setters, disabled/required state and reset.

Try [Component API](demos/Component%20API.html), read the [preview contract](docs/COMPONENT-API-PREVIEW.md), and see the [accessibility report](docs/ACCESSIBILITY-REPORT.md). The API is stable for this alpha but not yet published to npm/CDN.

Run `npm run build` after changing shared builders or `src/styles/components/*.css`; generated legacy bridges are checked by CI. Any component stylesheet under `src/styles/components/` (e.g. `button.css`, `field.css`) can be used independently inside a `.sui-root` wrapper; `src/styles/components.css` and `src/styles/blocks.css` are the aggregates, and fonts are optional.

## Migration & audit

The repository completed its migration from the legacy monolith (global `window.SESAMA_*` runtimes loaded via sequential `<script>` tags) to the current modular ESM system. Per-change details live in the [changelog](CHANGELOG.md); the phased component inventory is in the [alpha release guide](docs/ALPHA-RELEASE.md).

All application demos were rebuilt on the public ESM builders and audited against the preserved `demos-legacy/` reference (2026-10-31):

- **Visual parity** — computed styles (typography, spacing, colors, gaps) and rendered geometry compared per component across all 10 demo pages; page heights identical, fonts loading identically.
- **Responsive** — no horizontal overflow at 390, 600, 760, 761, 1000, 1100, 1101, or 1440px on any page.
- **Runtime** — zero page or console errors across every demo.
- **Intentional deviations** from legacy values, kept for WCAG AA contrast and enforced by the axe suite: `--text-placeholder` at alpha `.59` and `--color-danger-text` for form errors. Message and Composer content also uses the new 14px/22px body size.
- **Focus/overlay correctness** — composer focus ring renders on the card (not the textarea), and every popup (select, menu, popover, dropdown, date picker, combobox, composer attach) is positioned by its controller with flip and dismissal handling.

## Checks and roadmap

```sh
npm ci
npm run check
npm test
```

`check` verifies JavaScript syntax and generated-source consistency; `test` covers the pure API contract and CSS dependency/scope checks. The legacy `tools/verify-components.cjs` is retained for migration and is not the release test suite.

Install test browsers with `npx playwright install chromium firefox webkit`. Run `npm run test:functional`, `npm run test:browser`, `npm run test:keyboard` and `npm run test:a11y`; set `BROWSER` to `chromium`, `firefox` or `webkit`. CI runs the same matrix. These checks do not constitute a screen-reader or accessibility certification.

- [Open-source release plan](docs/OPEN-SOURCE-RELEASE-PLAN.md)
- [Component API implementation plan](docs/COMPONENT-API-IMPLEMENTATION-PLAN.md)
- [Per-component migration tracker](docs/COMPONENT-API-MIGRATION.json)
- [Current catalog inventory](docs/OSS-INVENTORY.json)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Third-party notices and asset review](THIRD_PARTY_NOTICES.md)

## License

Original Sesama code and documentation are licensed under [MIT](LICENSE). Third-party icons and trademarks retain their own terms; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The MIT license does not relicense third-party brand artwork.

Designed by [zihni.design](https://zihni.design).
