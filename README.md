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
- `src/legacy/`: classic-script runtime, blocks, charts and catalog examples.
- `src/styles/`: existing central styles, including forms, blocks and charts.
- `src/legacy/rune-icons.js` / `assets/rune-icons`: icon library and licensing.
- `skills/sesama-ui`: repository copy of the agent skill.
- `demos/`: standalone application examples and their page-specific assets.
- `docs/`: release plans, specifications and design audits.

This is the current source layout, not the final package API. Some examples and skill instructions still have legacy assumptions; see the release plan before integrating into another application.

## Module API preview

The first four implementation groups cover five catalog entries: Button, Input, Input Field, Select and Modal. They share canonical markup/styles between classic compatibility and opt-in ESM imports, with remaining parity work tracked in the [implementation plan](docs/COMPONENT-API-IMPLEMENTATION-PLAN.md). Try [Component API](demos/Component%20API.html), read the [preview contract](docs/COMPONENT-API-PREVIEW.md), and see the [accessibility report](docs/ACCESSIBILITY-REPORT.md). This is not a frozen npm API.

Current focus is working component APIs. Input and Select use native form validation/data, controller setters, disabled/required state and reset; mounts share ownership and can be torn down/remounted. Manual screen-reader review is deferred while this functional work proceeds.

Run `npm run build` after changing shared builders or `src/styles/components/*.css`; generated legacy bridges are checked by CI. Use `src/styles/components/button.css`, `field.css`, `select.css` or `modal.css` inside a `.sui-root` wrapper for independent CSS. `src/styles/components.css` aggregates only these preview families; fonts are optional.

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
