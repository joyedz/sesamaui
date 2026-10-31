# Sesama UI v0.1.0-alpha.1 Release Guide

Sesama UI `0.1.0-alpha.1` marks the completed migration of all 48 design system components and 20 structural blocks from legacy monolithic global scripts into a modern, tree-shakeable, pure ECMAScript Module (ESM) system with full TypeScript type declarations and scoped CSS isolation.

---

## 1. Architectural Highlights

- **Pure Functional Markup Builders**: Every component and block builder is a pure, side-effect-free function returning semantic, accessible HTML strings. Builders execute seamlessly in Node.js, static site generators, and browser environments without requiring a DOM.
- **Progressive Hydration Runtime (`mount`)**: Interactive behaviors (focus management, keyboard roving, native popovers, accessible dialog traps, SVG chart resizing, form reset syncing) are progressively attached via `mount(root)`. Each mount session supports `.refresh()` for dynamic DOM updates and `.destroy()` for clean resource teardown.
- **Strict CSS Isolation (`:where(.sui-root)`)**: Component and block stylesheets are scoped under `:where(.sui-root)` with zero specificity inflation. Consumer application styles remain unaffected, while Sesama components maintain exact visual tokens, typography, and elevation.
- **Complete TypeScript Declarations**: Root declarations (`src/index.d.mts`) and per-component declarations (`.d.mts` for all 48 components, 12 block modules, icons, and runtime) provide full autocomplete and type safety.
- **Flexible Package Export Map**: Direct support for root imports (`sesama-ui`), subpath component imports (`sesama-ui/button`, `sesama-ui/table`), blocks (`sesama-ui/blocks`), icons (`sesama-ui/icons`), and CSS stylesheets (`sesama-ui/css/components.css`).

---

## 2. Component Migration Summary (P0–P7)

All 48 component families are fully migrated and verified with unit, CSS, and functional test coverage:

| Phase | Component Family | Canonical Public Exports | Subpath Import |
| :--- | :--- | :--- | :--- |
| **P0** | **Button** | `button`, `iconButton`, `linkButton`, `socialButton` | `sesama-ui/button` |
| | **Input** | `input`, `initInput` | `sesama-ui/input` |
| | **Input Field** | `inputField`, `initInput` | `sesama-ui/input-field` |
| | **Select** | `select`, `initSelect` | `sesama-ui/select` |
| | **Modal** | `modal`, `initModal` | `sesama-ui/modal` |
| **P1** | **Badge** | `badge` | `sesama-ui/badge` |
| | **Status Dot** | `statusDot` | `sesama-ui/status-dot` |
| | **Avatar** | `avatar`, `initAvatar` | `sesama-ui/avatar` |
| | **Label** | `label` | `sesama-ui/label` |
| | **Divider** | `divider` | `sesama-ui/divider` |
| | **Card** | `card` | `sesama-ui/card` |
| | **Banner** | `banner`, `initBanner` | `sesama-ui/banner` |
| | **Empty State** | `emptyState` | `sesama-ui/empty-state` |
| | **Loader** | `loader` | `sesama-ui/loader` |
| | **Skeleton** | `skeleton` | `sesama-ui/skeleton` |
| | **Scroll Area** | `scrollArea`, `initScrollArea` | `sesama-ui/scroll-area` |
| **P2** | **Checkbox** | `checkbox`, `initCheckbox` | `sesama-ui/checkbox` |
| | **Radio** | `radio`, `initRadio` | `sesama-ui/radio` |
| | **Switch** | `switchControl`, `initSwitch` | `sesama-ui/switch` |
| | **Input Area** | `textarea`, `initTextarea` | `sesama-ui/textarea` |
| | **Chip** | `chip`, `initChip` | `sesama-ui/chip` |
| **P3** | **Menu Item** | `menuItem` | `sesama-ui/menu-item` |
| | **Menu** | `menu`, `initMenu` | `sesama-ui/menu` |
| | **Popover** | `popover`, `initPopover` | `sesama-ui/popover` |
| | **Dropdown Menu** | `dropdownMenu`, `initDropdownMenu` | `sesama-ui/dropdown-menu` |
| | **Tooltip** | `tooltip`, `initTooltip` | `sesama-ui/tooltip` |
| | **Toast** | `showToast`, `initToastRegion` | `sesama-ui/toast` |
| | **Button Group** | `buttonGroup`, `initButtonGroup` | `sesama-ui/button-group` |
| | **Command Palette**| `commandPalette`, `initCommandPalette` | `sesama-ui/command-palette` |
| **P4** | **Combobox** | `combobox`, `initCombobox` | `sesama-ui/combobox` |
| | **Date Picker** | `datePicker`, `initDatePicker` | `sesama-ui/date-picker` |
| | **Tag Input** | `tagInput`, `initTagInput` | `sesama-ui/tag-input` |
| | **Tabs** | `tabs`, `initTabs` | `sesama-ui/tabs` |
| | **Breadcrumbs** | `breadcrumbs` | `sesama-ui/breadcrumbs` |
| **P5** | **Tree** | `tree`, `treeItem`, `treeSection`, `initTree` | `sesama-ui/tree` |
| | **List Row** | `listRow` | `sesama-ui/list-row` |
| | **Toolbar** | `toolbar` | `sesama-ui/toolbar` |
| | **Collapsible** | `collapsible`, `initCollapsible` | `sesama-ui/collapsible` |
| | **Table** | `table`, `initTable` | `sesama-ui/table` |
| | **Pagination** | `pagination`, `initPagination` | `sesama-ui/pagination` |
| **P6** | **Chart** | `chart`, `initChart` | `sesama-ui/chart` |
| | **Wire** | `wire` | `sesama-ui/wire` |
| | **Canvas** | `canvas`, `initCanvas` | `sesama-ui/canvas` |
| **P7** | **File Card** | `fileCard`, `fileAttachment`, `initFileCard` | `sesama-ui/file-card` |
| | **Message** | `message`, `initMessage` | `sesama-ui/message` |
| | **Tool Call** | `toolCall`, `initToolCall` | `sesama-ui/tool-call` |
| | **Agent Run** | `agentRun`, `initAgentRun` | `sesama-ui/agent-run` |
| | **Composer** | `composer`, `initComposer` | `sesama-ui/composer` |

---

## 3. Structural Blocks & Domain Recipes (Phase P8)

Importable from `sesama-ui/blocks` or root `sesama-ui`:

- **Structural Layouts**:
  - `appShell`: Viewport canvas with collapsible rail navigation, header, independent panel scroll, and optional right drawer.
  - `workspaceSidebar` (alias `sidebar`): Workspace switcher, tree navigation, project groups, and user profile.
  - `pageHeader`: Page title, subtitle, breadcrumb indicators, badges, and action toolbars.
  - `pageLayout`: Responsive reading containers (`'default'`, `'dashboard'`, `'data'`, `'conversation'`).
  - `pageGrid`: 12-column responsive layout grid with breakpoint folding.
- **Content Blocks**:
  - `contentSection`: Consistent section headers, descriptions, and action toolbars.
  - `dataSection`: Integrated tabular container with filter bars, search fields, table slot, and pagination.
  - `metricCard` & `metricSummary`: KPI metric summary blocks with comparison trends and skeleton states.
  - `peopleList`: User directories with avatars, status dots, and metadata.
  - `activityFeed`: Chronological audit logs and event streams.
  - `chartSection`: Quantitative visualization wrapper with responsive SVG charts and filter slots.
- **Domain Recipes**:
  - `dashboardOverviewRecipe`, `revenueChartRecipe`, `dataWorkspaceRecipe`, `requirementGroupRecipe`, `resourceListRecipe`, `agentCardRecipe`, `createSkillDialogRecipe`, `deleteResourceRecipe`.

---

## 4. Consumer Quick Start

### 1. HTML Setup with CSS Scoping
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

### 2. JavaScript / ESM Usage
```javascript
import {
  appShell,
  workspaceSidebar,
  pageHeader,
  pageLayout,
  pageGrid,
  dataSection,
  table,
  button,
  statusDot,
  mount
} from 'sesama-ui';

const root = document.getElementById('app');

root.innerHTML = appShell({
  sidebar: workspaceSidebar({
    brand: { name: 'Acme Workspace' },
    navigation: [{ id: 'dashboard', label: 'Dashboard', icon: 'folder', active: true }]
  }),
  header: pageHeader({ title: 'System Overview' }),
  content: pageLayout(
    pageGrid([
      {
        html: dataSection({
          title: 'Active Nodes',
          table: table({
            columns: [{ key: 'node', label: 'Node' }, { key: 'status', label: 'Status' }],
            rows: [{ id: '1', node: 'node-us-east', status: statusDot({ status: 'success', label: 'Healthy' }) }]
          })
        }),
        span: 12
      }
    ]),
    { variant: 'dashboard' }
  )
});

// Hydrate interactive controllers
const session = mount(root);
```

---

## 5. Accessibility Status & Verification

- **Automated Verification**: Automated tests with `axe-core` across 12 distinct component states, contrast themes (light and dark), 320px mobile reflow, forced colors, and reduced motion pass with **0 violations**.
- **Keyboard Navigation**: Full keyboard navigation verified across all interactive widgets (Tab stops, Enter/Space activation, Esc popup dismissal, Left/Right/Home/End chart navigation, Arrow-key menu and tree roving tabindex, dialog focus trapping).
- **Screen Reader Review Note**: While automated structural and ARIA checks pass cleanly, comprehensive manual testing with assistive technologies (NVDA, VoiceOver, JAWS) remains documented as deferred and will be conducted during beta hardening. No blanket WCAG AA certification is claimed for this alpha release.

---

## 6. Compatibility & Legacy Bridge

For projects transitioning from the pre-release global runtime (`SESAMA_UI` and `SESAMA_BLOCKS`), compatibility build tools are provided:
- `tools/build-legacy-bridge.mjs`: Generates backward-compatible global wrappers from modern canonical modules.
- `tools/build-legacy-css.mjs`: Builds legacy monolithic stylesheets while keeping modern component CSS strictly isolated.
