# Application Structure: Page Blocks

Modern Sesama UI provides canonical layout and page assembly blocks exported directly from `src/index.mjs`. Use these blocks to structure all application interfaces, maintaining consistent responsive behaviors, rail collapsing, spacing, and header alignments.

## Canonical Starting Point

```js
import {
  appShell,
  workspaceSidebar,
  pageHeader,
  pageLayout,
  pageGrid,
  dataSection,
  table,
  mount
} from './src/index.mjs';

const app = document.getElementById('app');

app.innerHTML = appShell({
  sidebar: workspaceSidebar({
    brand: { name: 'Acme Workspace', badge: 'v2' },
    navigation: [
      { id: 'overview', label: 'Overview', icon: 'folder', active: true },
      { id: 'reports', label: 'Reports', icon: 'file-text' }
    ],
    projects: [
      {
        id: 'website',
        label: 'Website Launch',
        items: [
          { id: 'homepage', label: 'Homepage Review', active: true },
          { id: 'analytics', label: 'Tracking Setup' }
        ]
      }
    ],
    user: { name: 'Alex Rivera', initials: 'AR' }
  }),
  header: pageHeader({
    title: 'Project Initiatives',
    icon: 'folder'
  }),
  content: pageLayout(
    pageGrid([
      {
        html: dataSection({
          title: 'Active Initiatives',
          table: table({
            columns: [
              { key: 'name', label: 'Initiative' },
              { key: 'status', label: 'Status' }
            ],
            rows: [
              { id: '1', name: 'Design System Migration', status: 'Complete' }
            ]
          })
        }),
        span: 12
      }
    ]),
    { variant: 'dashboard' }
  )
});

mount(app);
```

## Block Responsibilities and Options

### `appShell(options)`
Provides the desktop/tablet viewport canvas with inset content panels and optional collapsible sidebar rail:
- `sidebar`: HTML string for the left workspace navigation.
- `header`: HTML string for the top page bar.
- `content`: HTML string for the main view panel with independent scroll.
- `footer`: Optional HTML string for bottom bars or floating composer.
- `detail`: Optional HTML string for a right-hand detail drawer (300px width).
- `collapsed`: Boolean flag for initial sidebar rail state.
- `theme`: Optional theme preset (`'light'` or `'dark'`).

### `workspaceSidebar(options)` (alias: `sidebar`)
Comprehensive workspace navigation supporting brand branding, workspace switching, tree navigation, and project sections:
- `brand`: `{ name, badge, logo }`.
- `selector`: HTML string for workspace switcher (e.g. `select(...)`).
- `navigation`: Array of items `[{ id, label, icon, active, count }]`.
- `projects`: Array of project groups `[{ id, label, items: [{ id, label, active }] }]`.
- `user`: `{ name, role, initials, avatarUrl }`.
- `collapseToggle`: Boolean or custom toggle button options.
- `themeToggle`: Boolean or custom theme toggle options.

### `pageHeader(options)`
Standard header bar with breadcrumbs/title, badges, and action toolbars:
- `title`: Primary page heading string.
- `subtitle`: Optional descriptive string below title.
- `icon`: Optional Rune icon identifier.
- `badge`: Optional badge HTML string.
- `actions`: Optional toolbar HTML string (e.g. buttons, dropdowns).

### `pageLayout(content, options)`
Provides responsive horizontal and vertical constraints for page content:
- `variant`:
  - `'default'`: Standard bounded layout.
  - `'dashboard'`: 1440px max-width container with responsive side gutters.
  - `'data'`: Full-width responsive container (ideal for wide tables).
  - `'conversation'`: Centered 768px reading column (ideal for chat and AI workflows).
- `compact`: Boolean flag reducing padding from 24px to 16px.

### `pageGrid(items, options)`
Responsive 12-column CSS grid system:
- `items`: Array of items `[{ html, span, tablet, mobile }]`.
  - Full-width table/data: `span: 12, tablet: 6`.
  - Four metrics row: `span: 3, tablet: 3`.
  - Split chart / breakdown: `span: 8` and `span: 4`.
- `columns`: Total columns (defaults to 12).
- `compact`: Boolean flag reducing column gap from 16px to 8px.
