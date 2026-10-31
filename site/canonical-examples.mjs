/* Canonical ESM previews for the Design system catalog.
 * Appends one "Canonical (ESM)" example to every catalog entry, rendered by
 * the builders from src/index.mjs with the canonical stylesheets. Legacy
 * examples stay untouched above each one for side-by-side comparison. */

import {
  button, iconButton, input, inputField, select, modal, initModal,
  badge, statusDot, avatar, label, divider, card, banner, emptyState,
  loader, skeleton, scrollArea, checkbox, radio, switchControl, textarea,
  chip, menu, popover, dropdownMenu, tooltip, showToast,
  buttonGroup, commandPalette, initCommandPalette, combobox, datePicker,
  tagInput, tabs, breadcrumbs, tree, treeSection, listRow, toolbar,
  collapsible, table, pagination, chart, wire, canvas, fileCard,
  message, toolCall, agentRun, composer,
  appShell, workspaceSidebar, pageHeader, pageLayout, pageGrid,
  contentSection, dataSection, peopleList, activityFeed,
  metricCard, metricSummary, chartSection,
  requirementGroupRecipe, resourceListRecipe, agentCardRecipe,
  createSkillDialogRecipe, deleteResourceRecipe, dashboardOverviewRecipe,
  revenueChartRecipe, dataWorkspaceRecipe,
  mount
} from '../src/index.mjs';

const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({
  label,
  total: [48, 64, 58, 86, 75, 105, 96][i],
  email: [20, 28, 24, 36, 31, 45, 40][i]
}));
const chartSeries = [
  { key: 'total', label: 'Conversations' },
  { key: 'email', label: 'Email' }
];
const team = [
  { name: 'Amelia Park', status: 'Online', metadata: '9 assigned' },
  { name: 'Noah Ibarra', status: 'Online', metadata: '7 assigned' },
  { name: 'Priya Desai', status: 'Away', metadata: '4 assigned' },
  { name: 'Marcus Chen', status: 'Online', metadata: '11 assigned' }
];
const activities = [
  { title: 'A support request was resolved', time: '12 minutes ago', icon: 'circle-check' },
  { title: 'A conversation was escalated', time: '28 minutes ago', icon: 'chat' },
  { title: 'The project brief was updated', time: '1 hour ago', icon: 'file-text' }
];
const tableRows = [
  { id: 1, name: 'Website launch', status: 'Active', owner: 'Amelia Park' },
  { id: 2, name: 'Mobile app', status: 'Draft', owner: 'Noah Ibarra' },
  { id: 3, name: 'Design system', status: 'Active', owner: 'Priya Desai' }
];
const tableColumns = [
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status' },
  { key: 'owner', header: 'Owner' }
];
const demoBlock = text => `<div style="display:grid;place-items:center;min-height:80px;background:var(--color-recessed);border-radius:var(--radius-md);color:var(--text-subtle);font-size:12px">${text}</div>`;
const row = (...nodes) => `<div class="sx-row" style="justify-content:center">${nodes.join('')}</div>`;

const samples = {
  'Button': () => row(
    button({ label: 'Primary', variant: 'primary' }),
    button({ label: 'Secondary' }),
    button({ label: 'Outline', variant: 'outline' }),
    button({ label: 'Ghost', variant: 'ghost' }),
    iconButton('plus', { variant: 'raised', ariaLabel: 'Add' })
  ),
  'Button group': () => row(
    buttonGroup({ buttons: ['Day', 'Week', 'Month'] }),
    buttonGroup({ split: true, buttons: [{ label: 'Create project' }] })
  ),
  'Badge': () => row(
    badge({ label: 'Draft' }),
    badge({ label: 'New', tone: 'informative' }),
    badge({ label: 'Completed', tone: 'success' }),
    badge({ label: 'Failed', tone: 'error' })
  ),
  'Status dot': () => row(
    statusDot({ tone: 'success', label: 'Online' }),
    statusDot({ tone: 'warning', label: 'Away' }),
    statusDot({ tone: 'error', label: 'Busy' }),
    statusDot({ tone: 'neutral', label: 'Offline' })
  ),
  'Avatar': () => row(
    avatar({ name: 'Jordan Lee', initials: 'JL', size: 16 }),
    avatar({ name: 'Jordan Lee', initials: 'JL', size: 24, color: 'auto' }),
    avatar({ name: 'Jordan Lee', initials: 'JL', size: 32, color: 'auto' })
  ),
  'Switch': () => row(
    switchControl({ label: 'Notifications', checked: true }),
    switchControl({ label: 'Disabled', disabled: true })
  ),
  'Input': () => inputField({ label: 'Search', name: 'search', placeholder: 'Search projects…' }),
  'Input Field': () => inputField({
    label: 'Email', name: 'email', type: 'email', placeholder: 'name@example.com',
    helper: 'We will use this address to contact you.'
  }),
  'Chip': () => row(
    chip({ label: 'Design', icon: 'folder' }),
    chip({ label: 'Selected', selected: true }),
    chip({ label: 'Removable', removable: true })
  ),
  'Label': () => row(
    label({ text: 'System', tone: 'neutral' }),
    label({ text: 'Requirement', tone: 'brand' }),
    label({ text: 'Approved', tone: 'success' })
  ),
  'Wire': () => row(wire({ type: 'bezier' }), wire({ type: 'step' })),
  'Divider': () => divider({ label: 'Section' }),
  'Select': () => select({
    name: 'team', ariaLabel: 'Team', value: 'Design team', icon: 'users',
    options: ['Design team', 'Engineering', 'Product']
  }),
  'Tabs': () => tabs({
    ariaLabel: 'Project view',
    tabs: [
      { label: 'Overview', content: 'Project overview and summary.' },
      { label: 'Activity', content: 'Recent project activity.' },
      { label: 'Settings', content: 'Project preferences.' }
    ]
  }),
  'Breadcrumbs': () => breadcrumbs({
    items: [
      { label: 'Systems', href: '#', icon: 'folder' },
      { label: 'Powertrain', href: '#' },
      { label: 'Electric motor', current: true }
    ]
  }),
  'Tree item': () => tree([
    { label: 'Projects', icon: 'folder', children: [
      { label: 'Website launch', icon: 'folder', children: [{ label: 'Review checklist', icon: false }] },
      { label: 'Mobile app', icon: 'folder', expanded: false, children: [{ label: 'Fix layout', icon: false }] }
    ] }
  ]),
  'List row': () => listRow({
    title: 'Jordan Lee',
    description: 'Product designer',
    leading: avatar({ name: 'Jordan Lee', initials: 'JL', size: 28 }),
    trailing: statusDot({ tone: 'success', label: 'Online' })
  }),
  'Card': () => card({
    title: 'Website redesign',
    description: 'Plan and track the next release.',
    actions: button({ label: 'Open', variant: 'secondary' })
  }),
  'Toolbar': () => toolbar({
    items: [
      { label: 'Fields', variant: 'ghost' },
      { label: 'Filter', variant: 'ghost' },
      'separator',
      { icon: 'plus', ariaLabel: 'Add item' }
    ]
  }),
  'Message': () => message({
    role: 'agent',
    sender: 'Sesama Agent',
    content: '<p>I reviewed the project brief. Here are the next steps: confirm scope, assign owners, and validate the timeline.</p>',
    actions: [
      { action: 'copy', icon: 'copy', label: 'Copy response' },
      { action: 'regenerate', icon: 'refresh-cw', label: 'Regenerate response' },
      { action: 'helpful', icon: 'thumbs-up', label: 'Helpful response' }
    ]
  }),
  'Collapsible': () => collapsible({
    trigger: 'Execution plan',
    open: true,
    content: '<ul style="margin:0;padding-left:20px"><li>Update Peak Motor Torque to 420 Nm</li><li>Propagate to child requirements</li></ul>'
  }),
  'File card': () => fileCard({ name: 'MTR-HSG-4200-R02.step', type: 'other' }),
  'Input area': () => textarea({ label: 'Description', placeholder: 'Describe your project…' }),
  'Table': () => table({ label: 'Requirements', columns: tableColumns, rows: tableRows }),
  'Toast': () => `<button type="button" class="btn secondary" data-canonical-toast="Project changes saved.">Show success toast</button><button type="button" class="btn secondary" data-canonical-toast="Review the settings before continuing.|warning">Show warning toast</button>`,
  'Canvas': () => canvas({ content: card({ title: 'Project brief' }) }),
  'Modal': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal">Open modal</button>` +
    modal({
      id: 'canonical-modal',
      title: 'Project details',
      description: 'Review the project information before continuing.',
      content: inputField({ label: 'Name', name: 'project-name', value: 'Website redesign' }),
      actions: button({ label: 'Cancel', variant: 'secondary', attributes: 'data-modal-close' }) +
        button({ label: 'Confirm', variant: 'primary' })
    }),
  'Agent Run': () => agentRun({
    title: 'Research completed',
    state: 'completed',
    duration: '12s',
    open: true,
    steps: [
      { type: 'thinking', title: 'Thinking', state: 'completed', detail: 'Reviewing the request and planning which tools are needed.' },
      { type: 'tool', name: 'Run command', iconName: 'code', state: 'completed', input: 'npm run test', output: '12 tests passed. Exit code: 0' }
    ]
  }),
  'Tool Call': () => toolCall({
    name: 'Search documents', state: 'completed', open: true,
    input: 'Project brief', output: '3 matching documents.'
  }),
  'Composer': () => composer({
    placeholder: 'Write a message or tag @flow',
    contextOptions: ['Base', 'feature/torque-420'],
    contextValue: 'Base'
  }),
  'Scroll Area': () => scrollArea({
    ariaLabel: 'Scrollable project list',
    attributes: 'style="height:180px"',
    content: Array.from({ length: 12 }, (_, i) => `<div style="padding:8px 12px;border-bottom:1px solid var(--color-hairline)">Project ${i + 1}</div>`).join('')
  }),
  'Menu': () => menu({
    ariaLabel: 'Project actions',
    items: [
      { label: 'Edit', icon: 'pencil' },
      { label: 'Duplicate', icon: 'copy' },
      { type: 'separator' },
      { label: 'Delete', icon: 'trash', danger: true }
    ]
  }),
  'Menu Item': () => menu({
    ariaLabel: 'Menu items',
    items: [
      { label: 'Plain item' },
      { label: 'Disabled item', disabled: true },
      { label: 'Danger item', danger: true },
      { label: 'Checked item', role: 'menuitemcheckbox', checked: true }
    ]
  }),
  'Checkbox': () => row(
    checkbox({ label: 'Receive project updates' }),
    checkbox({ label: 'Disabled', disabled: true })
  ),
  'Radio': () => row(
    radio({ label: 'Weekly', name: 'frequency', checked: true }),
    radio({ label: 'Monthly', name: 'frequency' })
  ),
  'Dropdown Menu': () => dropdownMenu({
    trigger: 'Actions',
    items: [
      { label: 'Edit', icon: 'pencil' },
      { label: 'Duplicate', icon: 'copy' },
      { type: 'separator' },
      { label: 'Delete', icon: 'trash', danger: true }
    ]
  }),
  'Tooltip': () => tooltip({ content: 'Helpful information about this setting.' }),
  'Banner': () => banner({
    title: 'New update available',
    description: 'You can continue working or review the details.',
    tone: 'informative',
    dismissible: true
  }),
  'Empty State': () => emptyState({
    title: 'No projects yet',
    description: 'Create your first project to get started.',
    icon: 'folder',
    actions: button({ label: 'Create project', variant: 'primary' })
  }),
  'Popover': () => popover({
    trigger: 'Filter options',
    content: '<div class="sx-pop-content"><span class="sx-help">Interactive panel content goes here.</span></div>'
  }),
  'Combobox': () => combobox({ label: 'Project' }),
  'Loader': () => row(loader({ size: 16 }), loader({ size: 24 }), loader({ size: 32 })),
  'Skeleton': () => `<div class="sx-stack">${skeleton({ shape: 'line', count: 2 })}${skeleton({ shape: 'round', size: 32 })}</div>`,
  'Pagination': () => pagination({ page: 2, pageSize: 5, totalItems: 25 }),
  'Date Picker': () => datePicker({ label: 'Due date' }),
  'Tag Input': () => tagInput({ label: 'Tags', tags: ['Design', 'Review'] }),
  'Command Palette': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-commands">Open commands</button>` +
    commandPalette({
      id: 'canonical-commands',
      commands: [
        { label: 'Create project', group: 'Projects' },
        { label: 'Open projects', group: 'Projects' },
        { label: 'Toggle theme', group: 'Preferences' }
      ]
    }),
  'Chart': () => row(
    chart({ type: 'line', label: 'Line chart', data: chartData, series: chartSeries, height: 200 }),
    chart({ type: 'donut', label: 'Donut chart', data: [{ label: 'Direct', value: 44 }, { label: 'Email', value: 36 }, { label: 'Social', value: 20 }], series: [{ key: 'total', label: 'Conversations' }], height: 200 })
  )
};

const blockSamples = {
  'Activity Feed': () => activityFeed({ items: activities }),
  'Agent card': () => agentCardRecipe({
    name: 'Regulatory Agent',
    role: 'Assistant',
    description: 'You are an experienced systems engineer focused on reliability and compliance.',
    capabilities: ['Requirements', 'Naming conventions']
  }),
  'App Shell': () => `<div style="height:420px">${appShell({
    sidebar: workspaceSidebar({
      navigation: [
        { label: 'Overview', icon: 'home', key: 'overview', selected: true },
        { label: 'Reports', icon: 'grid-3x3', key: 'reports' }
      ],
      projects: [
        { label: 'Website launch', icon: 'folder', children: [{ label: 'Review launch checklist', icon: false }] }
      ]
    }),
    header: pageHeader({ title: 'Reports', icon: 'grid-3x3' }),
    content: pageLayout(dataSection({ title: 'Products', description: 'Sample data', data: table({ label: 'Products', columns: tableColumns, rows: tableRows }) }), { variant: 'data' })
  })}</div>`,
  'Chart Section': () => chartSection({
    title: 'Weekly performance',
    description: 'Revenue and orders over the last seven days',
    chart: chart({ type: 'area', label: 'Weekly performance', data: chartData, series: chartSeries, height: 220 }),
    variant: 'bordered'
  }),
  'Content Section': () => contentSection({
    title: 'Section title',
    description: 'Optional description',
    content: demoBlock('Content slot'),
    variant: 'bordered'
  }),
  'Create skill dialog': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-skill-dialog">Open create skill dialog</button>` +
    createSkillDialogRecipe({ id: 'canonical-skill-dialog' }),
  'Dashboard Overview': () => dashboardOverviewRecipe({
    metrics: [
      { label: 'Open queue', value: '38', change: '−12.4%', tone: 'success' },
      { label: 'Active conversations', value: '126', change: '+5.2%', tone: 'neutral' }
    ]
  }),
  'Data Section': () => dataSection({
    title: 'Best-selling products',
    description: 'Revenue by product',
    data: table({ label: 'Products', columns: tableColumns, rows: tableRows })
  }),
  'Data workspace': () => `<div style="height:420px">${dataWorkspaceRecipe({
    navigation: [{ label: 'Overview', icon: 'home', key: 'overview', selected: true }],
    projects: [{ label: 'Website launch', icon: 'folder', children: [{ label: 'Review checklist', icon: false }] }],
    table: table({ label: 'Datasets', columns: tableColumns, rows: tableRows })
  })}</div>`,
  'Delete resource': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-delete-dialog">Open delete dialog</button>` +
    deleteResourceRecipe({ id: 'canonical-delete-dialog', resourceName: 'ARP-475A Compliance' }),
  'Metric Card': () => row(
    metricCard({ label: 'Net revenue', value: '$28,450', change: '+13.6%', tone: 'success' }),
    metricSummary({ value: '$28,450', change: '+12.4%', description: 'vs last month', tone: 'success' })
  ),
  'Page Grid': () => pageGrid({
    items: [
      { html: demoBlock('Metric · 3/12'), span: 3 },
      { html: demoBlock('Metric · 3/12'), span: 3 },
      { html: demoBlock('Main chart · 8/12'), span: 8 },
      { html: demoBlock('Breakdown · 4/12'), span: 4 }
    ]
  }),
  'Page Header': () => pageHeader({ title: 'Sales reports', icon: 'grid-3x3' }),
  'Page Layout': () => row(
    pageLayout(demoBlock('Dashboard layout'), { variant: 'dashboard' }),
    pageLayout(demoBlock('Conversation layout'), { variant: 'conversation' })
  ),
  'People List': () => peopleList({ people: team }),
  'Requirement group': () => requirementGroupRecipe({
    requirements: [
      { title: 'Peak Wheel Power', description: 'ARP-475A' },
      { title: 'Mass of Powertrain', description: 'Design constraint' }
    ]
  }),
  'Resource list': () => resourceListRecipe({
    title: 'Resources',
    layout: 'list',
    resources: [
      { name: 'Website launch', type: 'Project', updated: 'Oct 24, 2026' },
      { name: 'Mobile app', type: 'Project', updated: 'Oct 25, 2026' }
    ]
  }),
  'Revenue Chart': () => revenueChartRecipe({
    chart: chart({ type: 'line', label: 'Revenue overview', data: chartData, series: chartSeries, height: 220 })
  }),
  'Workspace Sidebar': () => workspaceSidebar({
    navigation: [
      { label: 'Overview', icon: 'home', key: 'overview', selected: true },
      { label: 'Reports', icon: 'grid-3x3', key: 'reports' }
    ],
    projects: [
      { label: 'Website launch', icon: 'folder', children: [{ label: 'Review launch checklist', icon: false }] }
    ]
  })
};

const canonical = { ...samples, ...blockSamples };
const wrap = html => `<div class="sui-root" style="width:100%">${html}</div>`;

// Interactive canonical previews need the runtime; rehydrate after each paint.
function hydrate() {
  // Keep the toast region inside a .sui-root wrapper so canonical styles apply.
  if (!document.querySelector('#canonical-toast-host')) {
    const host = document.createElement('div');
    host.id = 'canonical-toast-host';
    host.className = 'sui-root';
    host.setAttribute('style', 'position:fixed;inset:auto;z-index:80');
    document.body.append(host);
    const stack = document.createElement('div');
    stack.className = 'ds-toast-stack';
    stack.setAttribute('role', 'region');
    stack.setAttribute('aria-label', 'Notifications');
    stack.dataset.suiToastRegion = '';
    host.append(stack);
  }

  try { mount(document.body).refresh(); } catch {}

  document.querySelectorAll('[data-canonical-open]').forEach(btn => {
    if (btn.dataset.canonicalWired) return;
    btn.dataset.canonicalWired = '1';
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.canonicalOpen);
      if (!target) return;
      try {
        if (target.matches('[data-sui-command-palette]')) initCommandPalette(target).open(btn);
        else if (target.matches('[data-sui-modal]')) initModal(target).open(btn);
      } catch {}
    });
  });

  document.querySelectorAll('[data-canonical-toast]').forEach(btn => {
    if (btn.dataset.canonicalWired) return;
    btn.dataset.canonicalWired = '1';
    btn.addEventListener('click', () => {
      const [text, tone] = btn.dataset.canonicalToast.split('|');
      showToast(text, tone || 'success');
    });
  });
}

const originalExamples = window.componentExamples;
if (typeof originalExamples === 'function') {
  window.componentExamples = function componentExamplesWithCanonical(x) {
    const base = originalExamples(x);
    const factory = canonical[x[1]];
    if (!factory) return base;
    try {
      const html = factory();
      if (!html) return base;
      return base.concat([{
        name: 'Canonical (ESM)',
        html: wrap(html),
        description: 'Rendered by the canonical ESM builder (src/index.mjs) with the canonical stylesheets — compare against the legacy examples above.',
        code: html
      }]);
    } catch (error) {
      console.warn('[canonical-examples] Preview unavailable for ' + x[1], error);
      return base;
    }
  };
}

const originalPaint = window.paint;
if (typeof originalPaint === 'function') {
  window.paint = function paintWithCanonical() {
    const result = originalPaint();
    hydrate();
    return result;
  };
}

hydrate();
