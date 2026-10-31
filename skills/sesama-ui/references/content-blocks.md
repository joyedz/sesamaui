# Dashboard and Content Blocks

Sesama UI provides structured blocks for business dashboards, analytics, user lists, and activity streams. Import these builders from `src/index.mjs`.

## Canonical Content Blocks

### `contentSection(options)`
Consistent wrapper providing standard section headers, descriptions, actions, content body, and footers:
- `title`: Section heading.
- `description`: Optional explanatory subtext.
- `actions`: Optional toolbar HTML string.
- `content`: Main body HTML.
- `footer`: Optional bottom row HTML.
- `variant`: `'plain'`, `'bordered'`, or `'divided'`.

### `dataSection(options)`
Specialized container for tabular data with integrated filters, search bars, tables, and pagination:
- `title`: Section title string.
- `description`: Optional subtitle string.
- `actions`: Optional right-aligned action buttons.
- `filters` / `toolbar`: Filter controls (e.g. `inputField` or `select`).
- `table` / `data`: Main table markup (e.g. from `table(...)`).
- `pagination`: Pagination component markup (e.g. from `pagination(...)`).
- `footer`: Optional bottom summary information.

### `metricCard(options)` and `metricSummary(options)`
Quantitative metric cards for key performance indicators (KPIs):
- `label`: Metric name (e.g. `'Total Revenue'`).
- `value`: Main formatted value string (e.g. `'$128,450'`).
- `change`: Optional change indicator `{ value: '+14.2%', tone: 'success' | 'danger' | 'neutral' }`.
- `description`: Subtitle or comparison text (e.g. `'vs last month'`).
- `icon`: Optional icon name.
- `state`: Set to `'loading'` to automatically display skeleton loaders.

Use `metricSummary({ metrics: [...] })` to render a grid row of metric cards.

### `peopleList(options)`
Renders a structured list of team members, customers, or users:
- `title`: Optional list title.
- `people`: Array of user records `[{ name, role, status, initials, avatarUrl, metadata }]`.
  - `status`: `'online'`, `'away'`, `'offline'`.
- `actions`: Optional section actions.
- `emptyMessage`: Fallback string when `people` is empty.

### `activityFeed(options)`
Chronological stream of audit logs or system events:
- `title`: Optional section title.
- `items`: Array of activity events `[{ title, description, time, timestamp, icon, user }]`.
- `emptyMessage`: Fallback text when no items exist.

## Pre-composed Recipes

Sesama UI also provides high-level recipes for common domain layouts:
- `dashboardOverviewRecipe(data)`: Pre-assembles 4 metric cards, revenue/category charts, recent activity, and orders table.
- `revenueChartRecipe(data)`: Pre-composed chart section with filters, revenue area chart, and breakdown donut chart.
- `dataWorkspaceRecipe(data)`: Full data management layout with search, selection table, and pagination.
