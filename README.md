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
| Login | [Login.html](Login.html) |
| Dashboard | [Dashboard overview.html](Dashboard%20overview.html) |
| Revenue | [Revenue report.html](Revenue%20report.html) |
| Orders | [Orders.html](Orders.html) |
| Customers | [Customers.html](Customers.html) |
| AI workspace | [AI agents demo.html](AI%20agents%20demo.html) |
| Issue workspace | [Issue workspace.html](Issue%20workspace.html) |

Example authentication, model responses and agent execution are local demonstrations, not connected backend services.

## Source map

- `sesama-ui.css`: design tokens and primitive styles.
- `library.js` / `library.css`: shared component builders, variants and behavior.
- `forms.*` / `dashboard-components.*` / `primitives.js`: form and interaction implementations.
- `workspace-blocks.*`: shared app shells and page composition.
- `charts.*`: vanilla chart renderer and interactions.
- `rune-icons.js` / `assets/rune-icons`: icon library and licensing.
- `skills/sesama-ui`: repository copy of the agent skill.

This is the current source layout, not the final package API. Some examples and skill instructions still have legacy assumptions; see the release plan before integrating into another application.

## Checks and roadmap

```sh
npm run check
```

This checks JavaScript syntax only. It is not a replacement for browser, accessibility or visual tests. The legacy `tools/verify-components.cjs` is retained for migration and is not the release test suite.

- [Open-source release plan](docs/OPEN-SOURCE-RELEASE-PLAN.md)
- [Current catalog inventory](docs/OSS-INVENTORY.json)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Third-party notices and asset review](THIRD_PARTY_NOTICES.md)

## License

Original Sesama code and documentation are licensed under [MIT](LICENSE). Third-party icons and trademarks retain their own terms; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The MIT license does not relicense third-party brand artwork.

Designed by [zihni.design](https://zihni.design).
