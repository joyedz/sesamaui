# Sesama UI: open-source distribution map

Status: architecture proposal and source audit, not a published package.
Audit date: 2026-10-31. Inventory: [OSS-INVENTORY.json](OSS-INVENTORY.json).
Existing pages remain the working visual reference. This document does not move or rewrite them.

## 1. Product and first-release boundary

Sesama is a vanilla, light-DOM UI kit with shared components, structural blocks, runnable application examples, and an agent skill. The skill helps coding agents build interfaces from the actual library. It is not an AI model client.

First public target: v0.1.0, preceded by a local packaging prototype and an alpha. Do not describe the current globals, private catalog helpers, or future npm paths as a stable public API yet. Reserve stability for the documented and tested release surface.

Ship these together:

- Core components and semantic CSS tokens.
- Structural blocks, imported independently from core.
- Charts, available through an optional core subpath.
- Outline icon assets and a separately importable icon renderer.
- Runnable examples and hosted documentation.
- A portable, version-matched Sesama agent skill.

Not included as services: authentication, database, Git hosting, model providers, file storage, or an agent execution backend. Example integrations remain clearly documented local simulations. No React dependency, custom elements, or Shadow DOM for v0.1.

## 2. What the current source actually contains

The live catalog currently lists 48 component families, 20 block entries, 5 foundations, and 224 outline icon entries. These are inventory counts, not a promise that every entry is a distinct public API. Several blocks are domain-specific compositions and some entries overlap.

| Current source | Destination | Required work |
| --- | --- | --- |
| sesama-ui.css | Core tokens, reset, primitive styles | Split global reset from opt-in component styles; consolidate accumulated overrides |
| library.css | Per-component CSS | Remove structural/chart imports from core; preserve size and dark-mode tokens |
| library.js | Core component modules + docs examples | Separate builders, controllers, sample data and catalog registration |
| forms.css / forms.js | Input Field and password controller | Preserve shared builder, validation slots, accessible toggle behavior |
| primitives.js | Individual controllers | Split mixed handlers; remove document-wide import-time wiring |
| dashboard-components.css / .js | Canvas, Modal and Toast modules | Split controllers; remove demo form/toast actions from runtime |
| charts.css / .js | Optional core chart subpath | Split rendering, lifecycle and examples; maintain data/config contracts |
| workspace-blocks.css / .js | Blocks package | Keep structural builders; extract Sales sidebar and dashboard sample data |
| rune-icons.js | Icon package | Generate individual icon exports; keep asset provenance and license |
| Design system.html | Documentation app | Remove private runtime builders; render examples exclusively from public exports |
| preview-motion.js | Docs/example preview utility | Exclude from runtime; remove URL-triggered preview imports in production blocks |
| landing.css / .js / Sesama landing.html | Marketing app | Keep marketing animations, GitHub placeholder and showcase embedding outside core |
| skills/sesama-ui | Agent skill artifact | Remove machine paths; document supported package/version and portable references |
| tools/verify-components.cjs | Tests, after migration | Replace host-specific paths and stale selectors; retain meaningful behavior cases |
| design-system (1).html | Internal reference archive | Do not publish as a second authoritative catalog |
| TYPOGRAPHY-AUDIT.md and implementation docs | Contributor/history docs | Mark historical statements; remove contradictions with current tokens |

At the initial audit, there was no root package.json, root project LICENSE, npm export map, portable CI setup, or Git remote. Repository setup now targets https://github.com/joyedz/sesamaui; package/distribution work remains pending. Rune icon licensing exists separately under assets/rune-icons. A previous browser smoke test is not equivalent to an accessibility audit or cross-browser certification.

### Important source-level blockers

1. library.js bundles controllers, catalog examples, sample records, and global listeners. Exporting it under multiple paths would not create genuinely independent components.
2. library.css imports blocks/chart CSS, making a minimal Input consumer pay for unrelated styles.
3. Native input defaults and broad selectors such as button, table, th, td and :focus-visible affect the host application.
4. Public globals are lexical constants in classic scripts, not a deliberate ESM/CDN namespace contract.
5. Files reference assets/brands, assets/rune-icons and sibling scripts relative to the consuming page. These break on nested app routes or CDNs.
6. builders return HTML strings. Escaping, raw HTML slots and render callbacks require an explicit trust boundary.
7. Counters/IDs, live instances, observers, listeners, object URLs, timers and popovers need clear lifecycle ownership.
8. Catalog-only functions still exist for some families. Not every catalog example is a configurable component today.
9. Browser verification currently concentrates on Chromium. Screen reader verification has not been established.
10. Brand logos and copied reference vectors must be reviewed independently of the open-source code license.

## 3. API decision: HTML first, optional builders, explicit controllers

Use semantic HTML/CSS plus namespaced data attributes as the component contract. Provide optional ESM HTML builders that generate the same markup. Stateful widgets get small controllers with explicit lifecycle. All three are layers of one API, not three implementations.

- Static component: class names and semantic HTML are sufficient; no JS download.
- Interactive component: opt-in controller enhances the documented markup.
- Builder: convenience for generating markup, not mandatory for consumers.
- No custom elements or Shadow DOM in v0.1. CSS custom properties can theme descendants directly; ::part() is therefore not needed. Revisit wrappers only as a separate future adapter.
- Native elements retain native semantics: links navigate, buttons act, inputs expose native values and validation.

Proposed public naming (not available until implemented):

```js
import { inputField } from '@sesama-ui/core/input-field';
import { mount } from '@sesama-ui/core/runtime';

container.innerHTML = inputField({
  id: 'email', name: 'email', label: 'Email', type: 'email',
  autocomplete: 'email', size: 'base', required: true
});
const session = mount(container);
// On application unmount:
session.destroy();
```

A per-widget entry must also work independently:

```js
import { initSelect } from '@sesama-ui/core/select';
const select = initSelect(element);
// Later:
select.destroy();
```

### Contract to freeze before alpha

| Area | Public rule |
| --- | --- |
| Component classes | Namespace with sui-; document stable root/slot hooks; nonpublic helpers may change |
| Behavior attributes | data-sui-* only; no generic data-send/data-menu collisions |
| IDs | Explicit id supported; default IDs unique across bundles/instances; instance-owned popover and tooltip IDs |
| Sizes | xs 22, sm 26, base 30, lg 34 for single-line controls; only documented sizes per component |
| Theme | data-sui-theme=light/dark/system on a root; scoped variables; existing data-mode adapted during migration |
| Controller initialization | Idempotent per element; no duplicate listeners; scoped to supplied root |
| Teardown | Removes owned listeners, timers, observers, overlays and temporary nodes; does not remove caller markup |
| State | Native inputs remain source of truth; custom widgets expose getter/setter; controlled updates never emit user-change events |
| Events | Namespaced, bubbling CustomEvents; precise detail shape; no duplicate native + synthetic event for one action |
| Rendering | Text values escaped; raw content/render callbacks are documented trusted HTML slots |
| Dynamic updates | Document refresh/update API; root mutation watching opt-in rather than unconditional full-document observers |
| SSR/import | Importing module does not read document/window or attach listeners; DOM operations begin in init/mount |
| Types | Published .d.ts for options, events, controller handles and trusted slots, even with JS source |

Proposed events to specify individually: sui:change {name,value,previousValue}, sui:open, sui:close {reason}, sui:row-action {key,action}, sui:submit {text,attachments,context}. A cancelable before-event is added only where a widget needs veto behavior; canceled events must leave state unchanged. No secrets or internal model reasoning in event payloads.

For forms: custom selectors use a real hidden input with correct name/value and form reset/disabled behavior. Checkboxes and radio inputs stay native. Composer/file attachment events pass caller-owned File objects; the controller releases only the object URLs it created. Do not destroy caller-owned URLs.

### Public versus internal

Public: documented builders/controllers, CSS tokens, stable semantic markup slots, event contracts and documented block composition.
Internal: catalog registry, install/getExamples/describe, sample data, UI business callbacks, DOM implementation helpers, screenshot code and preview animation. getExamples is documentation tooling, not an application dependency.

Do not freeze the current inconsistent casing and signatures simply because demos use them. Migrate before alpha, preserve a clearly labeled local legacy bridge during migration, then update all examples/skill to the same new public contract. No commitment to the old private globals after release.

## 4. Package and repository layout

Provisional npm names; availability/ownership has not been checked.

```text
sesama-ui/
  packages/
    core/
      src/tokens/
      src/base/
      src/runtime/
      src/components/<component>/
        index.js
        controller.js
        styles.css
        types.d.ts
      src/charts/
      dist/                  # generated, not edited manually
      package.json
    blocks/
      src/<block>/
      package.json
    icons/
      src/<icon>.js
      svg/<icon>.svg
      LICENSE
      NOTICE
      package.json
  apps/docs/
  apps/landing/
  examples/<example>/
  skills/sesama-ui/
  tests/unit/
  tests/behavior/
  tests/a11y/
  tests/visual/
  tests/consumer/
  scripts/
  .github/workflows/
  README.md
  LICENSE
  THIRD_PARTY_NOTICES.md
  CONTRIBUTING.md
  SECURITY.md
  CHANGELOG.md
```

Prefer three packages: @sesama-ui/core, @sesama-ui/blocks, @sesama-ui/icons. Keep the initial versions synchronized. Blocks depend on a compatible core version and use its public API. Charts are optional inside core rather than a fourth initial package. Agent skill ships in repository/release ZIP, with a component manifest generated from the same version.

### Per-component imports are a release requirement

Example exports to build and verify:

```text
@sesama-ui/core/tokens.css
@sesama-ui/core/base.css
@sesama-ui/core/styles.css
@sesama-ui/core/input
@sesama-ui/core/input/styles.css
@sesama-ui/core/input-field
@sesama-ui/core/select
@sesama-ui/core/select/styles.css
@sesama-ui/core/runtime
@sesama-ui/core/charts
@sesama-ui/core/charts/styles.css
@sesama-ui/blocks/app-shell
@sesama-ui/blocks/app-shell/styles.css
@sesama-ui/icons/search
```

The package.json exports map lists allowed paths explicitly. The files allowlist includes only dist, licensing and relevant readme files. A minimal Select import must not import Composer, business demos, chart renderers or the full icon inventory. CSS is imported explicitly; component CSS does not transitively import all other components. Declare CSS side effects accurately; do not mark everything sideEffects:false and let bundlers discard required styles. The optional auto-init browser bundle is an explicit side effect and must be listed accordingly.

Publish a convenient full ESM entry and an optional classic-script bundle exposing window.Sesama. The classic auto-init entry is separate and opt-in. Both are generated from the same modules. CSS-only usage needs no runtime. Do not create a hand-maintained second CDN implementation.

### Delivery channels

- npm: versioned packages with ESM, type declarations, styles and licenses.
- jsDelivr: pinned-version files from npm; explicit CSS URLs and browser bundle/ESM URLs.
- esm.sh: pinned ESM imports, with styles loaded explicitly through a documented CSS URL.
- GitHub Release: source ZIP and ready-to-use dist ZIP, examples, skill, checksums and changelog.
- Hosted docs: matching version, API/state examples, migration notes and live demos.

All URLs use a real owned package name and an exact version after publishing. No unversioned latest in production examples. CDN testing must include subpath imports and nested page URLs. Do not publish any placeholder repository URLs or star counts as real.

## 5. Theming and CSS isolation

Keep CSS custom properties as the supported customization layer. Separate palette, semantic roles and component overrides.

- Foundation: color, type, spacing, radius, elevation, motion and control-size tokens.
- Semantic: surface/canvas/recessed, primary/secondary/placeholder text, border/control-edge, focus, accent-text, accent-fill, success/warning/error.
- Components consume semantic tokens; avoid private hardcoded dark/light colors.
- Preserve distinct accent text and accent fill tokens. A blue fill suitable behind white text is not automatically readable as text on a dark surface.
- Keep current warm-neutral Sesama light/dark personality and recent control-size decisions.
- Provide explicit light, dark and system modes. Scoped theme roots must support two themes on the same page, portals/popovers included.
- Root token file does not reset the host page. An optional reset is separately imported. Namespace generic .field/.btn/.select etc during migration.
- The default font stack does not make a network request. Offer Inter self-host instructions or an optional font stylesheet with documented font licensing.
- Respect reduced motion, forced colors, zoom and native selection/focus behavior.

Dark-mode audit work already improved text and focus tokens, but control borders were subsequently softened to 25% opacity by design. Do not claim that every such boundary meets 3:1. Audit essential control boundaries in context and agree on an accessible default; provide a documented stronger-contrast theme if the aesthetic alternative remains available. Automation on text tokens is not a whole-page WCAG certification.

## 6. Browser support

Proposed policy: evergreen desktop Chrome/Edge/Firefox (current and previous major), macOS/iOS Safari (current and previous major), and current Android Chrome. Publish exact tested browser versions for every release; do not rely on the phrase evergreen alone. Playwright WebKit is a regression target, not a substitute for a real Safari/iOS check.

- Use native dialog and Popover API in the supported matrix after feature detection and behavior tests.
- Avoid requiring CSS anchor positioning for core behavior in v0.1. Use the existing JS positioner and progressively enhance positioning where supported.
- light-dark(), color-mix(), :has(), inert, focus behavior and native popover dismissal must be covered by the selected matrix.
- An unsupported browser receives a documented capability result; do not silently render unusable overlays. Polyfills, if chosen later, are opt-in with separate size/license costs.
- CDN samples are HTTP(S) applications. Local file URLs may remain convenient for demos but are not the primary integration test environment.

Before freeze, pin the browser matrix, verify the actual minimums, and resolve any feature that fails it. Do not invent minimum Safari/Firefox numbers from a generic Baseline badge.

## 7. Accessibility acceptance criteria

Target WCAG 2.2 AA for documented use. This is a target, not a current conformance claim.

Automation:

- Playwright Chromium, Firefox and WebKit behavior projects.
- axe-core via @axe-core/playwright in every interactive state, not only initial pages.
- Keyboard behavior: Tab/Shift+Tab, arrows, Home/End, Enter/Space, Escape.
- Focus restoration, scroll preservation, disabled behavior, invalid/help associations, unique IDs, form reset and values.
- Automated contrast checks for enabled text/control states in both themes; record exceptions individually and resolve failures rather than excluding selectors wholesale.
- Screenshot regression at small/medium/large viewports with fonts settled and motion controlled.
- Reduced motion, forced colors and 200%/400% zoom/reflow cases.

Manual release checks:

- NVDA + Firefox or Chrome on Windows; VoiceOver + Safari on macOS/iOS, with recorded versions and results.
- Dialog/Command Palette: focus containment, initial focus, accessible name, Escape, restore focus, nested overlay dismissal.
- Menu/Select/Combobox: expected keyboard pattern, announcements, selection state, disabled items, typeahead and input/option distinction.
- Date Picker/Range: date/grid navigation, month announcements, start/end selection and cancel/reset semantics.
- Tree: parent/child navigation, expand/collapse, focus/selection distinction and contextual action buttons.
- Charts: meaningful names, data table alternative, keyboard exploration, tooltip values and non-color-only series distinction.
- Composer/Message/Agent Run: live-region announcements without per-keystroke noise, file names/removal, thinking status, and accessible stop/send actions.
- Table: native table semantics; full-row click must not replace reachable keyboard actions or swallow nested links/buttons.

axe-core finds only a subset of accessibility problems. Passing it does not replace these manual checks.

## 8. Component promotion order

All 48 catalog families are accounted for in the inventory. Not all should receive an equally strong maturity claim on day one.

| Promotion group | Families | Exit condition |
| --- | --- | --- |
| A: foundation and static | Button (Link/Social), Icon Button as Button variant, Badge, Status dot, Avatar, Chip, Label, Divider, Card, Wire, Loader, Skeleton, Empty State | Semantic markup, tokens, responsive/forced-color states, no JS dependence where unnecessary |
| B: native forms and simple controls | Input, Input Field, Input area, Checkbox, Radio, Switch, Tabs, Breadcrumbs, Button group, Toolbar, List row, Collapsible, Scroll Area | Size parity, labels, keyboard, validation, form behavior and disabled contracts |
| C: overlays and selection | Menu, Menu Item, Dropdown Menu, Tooltip, Popover, Combobox, Select, Date Picker, Tag Input, Command Palette, Modal, Toast, Banner | Lifecycle, focus, dismissal, multiple instances, positioning and a11y tests |
| D: data and workspaces | Table, Pagination, Tree item, File card, Canvas, Chart | Consumer-defined data, independent modules, custom-cell trust, navigation/zoom and file lifecycle |
| E: agent UI | Composer, Message, Agent Run, Tool Call | User-owned network actions, deterministic events, no provider dependency, cancellation and announcements |

These are promotion/testing stages, not a plan to omit groups D/E from the product. v0.1 may label an unresolved advanced widget experimental; it must not silently appear in the stable barrel without its tests.

### Block rationalization

Promote structural/generic blocks: App Shell, Workspace Sidebar, Page Header, Page Layout, Page Grid, Data Section, Content Section, Metric Card/Metric Summary, Chart Section, People List and Activity Feed.

Review overlaps before API freeze: Sidebar vs Workspace Sidebar; old Revenue Chart vs generic Chart Section; Data workspace vs composed Data Section.

Keep domain/template entries in examples: Requirement group, Resource list, Agent card, Create skill dialog, Delete resource, Dashboard Overview, the Sales sidebar helper and domain-specific dashboard data. Their useful generic children can be public independently. A displayed count of 20 current blocks must be recomputed when this split changes.

## 9. Runnable example map

| Existing page | Proposed path | Role |
| --- | --- | --- |
| Login.html | examples/auth/login/ | Form/social/recovery UI; no real authentication |
| Dashboard overview.html | examples/dashboard/overview/ | Composition, metrics, charts, activity and custom table columns |
| Revenue report.html | examples/dashboard/revenue/ | Filters, responsive compact metrics, charts and exports |
| Orders.html | examples/commerce/orders/ | Search/sort/page, row actions and detail modal |
| Customers.html | examples/commerce/customers/ | Identity rows, detail and cross-page orders |
| AI agents demo.html | examples/agent/workspace/ | Chat/project state, attachments, composer and agent progress |
| Issue workspace.html + JS/CSS | examples/issues/ | Issue navigation, properties, activity and agent delegation simulation |
| Workspace demo.html | examples/data-workspace/ | Data-table behaviors; reconcile duplicates before promotion |
| Sales reporting.html | examples/reporting/ | Review overlap with overview/revenue |
| Requirements dashboard.html | examples/requirements/ | Audit legacy code/dependencies before advertising as a public example |
| Sesama landing.html + JS/CSS | apps/landing/ | Marketing only |
| Design system.html | apps/docs/ | Component API, variants, states and foundations |

Examples can have page-owned data/layout logic, but never private visual overrides for central component anatomy. Replace catalog getExamples calls with public builders before release. Use relative/static-server routes that work from a clean checkout; verify deep links. Keep all demonstration records synthetic.

## 10. Agent skill as a versioned first-class artifact

- Ship SKILL.md, portable references and starter files tied to the same release as packages.
- Discover the consumer project and installed package/version. Do not assume a Windows username, directory, local runtime or absolute skill path.
- Generate a compact component manifest listing public names, imports, styles, options, events, dependencies and maturity.
- Clearly separate design rules from application-specific demo data.
- Include a minimal HTML starter, app-shell starter and dashboard/agent starter, all tested against the tarball.
- Include instructions for installing/using the skill, without requiring a particular model provider.
- Test representative agent prompts: login, custom-column order list, AI workspace, dashboard. Review actual reuse and absence of private restyling, not only screenshot resemblance.
- Add a compatibility header in the skill and migration instructions when APIs change.

## 11. Licensing, source hygiene and security

Recommended project license: MIT for original code/docs/examples, pending owner choice before publishing. Do not silently assign ownership of third-party work. Retain Apache-2.0/NOTICE obligations for Rune assets as applicable; verify the exact upstream source and version. Audit custom Sesama icon additions separately.

Inventory font and social/model-logo provenance. The GitHub mark currently originated from a locally authored inline path; replace/verify against an authoritative permitted asset before release. Several AI logos were extracted from supplied reference markup, so their provenance and trademark usage are not yet release-cleared. They need not ship in the core package; marketing-only marks belong in separately documented assets. Remove unavailable third-party reference images.

Review HTML slots, URL protocols, event attributes and render callbacks. Ordinary strings are escaped; raw HTML accepts trusted developer content only. Provide safe text alternatives and warn in API docs against injecting untrusted output into HTML slots. Keep runtime free of eval/new Function and hidden network calls. Audit sample URLs and prohibit javascript: links. No external Google Font import in the default bundle.

Before publishing: secret scan, personal path scan, private fixture review, dependency/license inventory, and npm pack file review. Keep build/test screenshots, pasted HTML references, caches and local configuration out of tarballs. Record only actual links; the GitHub repository is https://github.com/joyedz/sesamaui; npm namespace ownership remains unverified.

## 12. Implementation sequence and reviewable deliverables

### Phase 0 — baseline and contract (next)

- Capture current approved pages and theme states as reference fixtures.
- Document all public builders versus catalog-only helpers using the inventory.
- Finalize API naming, module contract, tokens, maturity levels and browser policy.
- Choose license, GitHub repository and package namespace. These are publish prerequisites, not blockers for local preparation.
- Deliver: ADRs, API manifest, normalized component map, browser matrix and frozen visual baseline.

### Phase 1 — prove distribution with one vertical slice

Use Button, Input Field, Select and Modal as a packaging spike. Include tokens, styles, explicit mount/destroy, one icon dependency, one form and one overlay. They expose the hard problems earlier than a Button-only package.

- Build ESM and browser bundles from the same source.
- npm pack into a fresh consumer fixture, not workspace symlinks.
- Verify root and per-component imports, assets under nested URLs, two themes, repeated mounts and teardown.
- Verify import in Node does not access DOM. Browser packages need no runtime framework dependency.
- Deliver: local alpha tarballs and a minimal npm/CDN-equivalent static consumer. No public publish yet.

### Phase 2 — migrate the component families

- Extract groups A–E incrementally; preserve behavior and visual comparisons.
- Consolidate CSS once each component is moved. Do not append another layer of permanent override files.
- Replace all private globals and getExamples in consumer examples.
- Introduce a documented legacy adapter only during this migration.
- Deliver: modular components, per-component types/styles and behavior coverage.

### Phase 3 — blocks, examples, docs and skill

- Build generic blocks from public imports; move domain compositions into examples.
- Move docs/landing to their own apps and preserve shared live previews.
- Reconcile every size/theme label against generated tokens.
- Generate component manifest and portable skill references.
- Deliver: clean-checkout docs/examples, version-matched skill and onboarding guide.

### Phase 4 — release candidate

- Run the browser matrix, open/closed/invalid/disabled state a11y scans, manual keyboard and screen-reader checks.
- Run visual regressions in both themes and mobile/desktop widths.
- Validate npm pack content, licenses, assets and consumer examples.
- Deliver: release checklist with evidence, known limitations, changelog and migration policy.

### Phase 5 — public distribution

- Create the user-owned repository and publish the reviewed sources/license.
- Publish scoped npm packages under an owned namespace, preferably with trusted publishing/provenance and required account protections.
- Verify actual versioned jsDelivr/esm.sh URLs after registry availability; provide release ZIP and hosted docs.
- Update landing links and real GitHub counter only after repository exists.
- Deliver: v0.1.0 with support/contribution/security guidance.

## 13. Release gates

The first public release is ready only when:

- No application imports internal catalog helpers or unexported files.
- Per-component imports do not load unrelated components, listeners or icon catalogs.
- Controller mount/destroy works repeatedly with multiple instances and dynamic removal.
- Public options/events/types/styles are documented and tested together.
- Light/dark themes and intended control-size parity pass visual checks.
- Required accessibility tests pass; manual checks are recorded; remaining limitations are disclosed per widget.
- All supported browsers pass the agreed matrix; real Safari/iOS checks are recorded.
- A clean project can install the actual packed artifacts and run without repo-specific absolute paths.
- Native browser ESM and classic CDN consumption both work with explicit styles and correctly resolved assets.
- Licenses, notices, attribution, package ownership and publish allowlist are resolved.
- Skill produces working interfaces from published imports and contains no machine-specific assumptions.

## 14. Versioning and support policy

Use semver from the first public tag. For v0.x, breaking changes require an announced minor version, migration notes and a deliberate review; patch releases do not break documented contracts. Do not treat semver's pre-1.0 flexibility as permission for surprise breakage. Before 1.0, publish deprecation windows and a stable/experimental support table.

Breaking changes include class/slot removal, token renaming, data-attribute/event changes, option default changes affecting behavior, controller lifecycle changes, removed import paths and raised browser minimums. A visually small change can still be a functional breaking change.

## Technical sources consulted

- npm package fields and publish file selection: https://docs.npmjs.com/cli/v11/configuring-npm/package-json/
- Node package exports and subpaths: https://nodejs.org/api/packages.html
- jsDelivr delivery: https://www.jsdelivr.com/documentation
- esm.sh module imports: https://esm.sh/
- axe-core capabilities and limitations: https://github.com/dequelabs/axe-core
- Popover API: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
- CSS light-dark(): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark
- CSS position-anchor: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-anchor

These references informed the proposed architecture. No external package, repository, CDN artifact or certification has been created by this audit.
