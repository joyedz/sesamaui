/* Canonical ESM previews for the Design system catalog.
 * For every legacy variant example, the equivalent ESM builder render is
 * inserted directly below it (labelled "... (ESM)") so variants can be
 * compared one by one. Builders come from src/index.mjs with the canonical
 * stylesheets; legacy examples themselves stay untouched. */

import {
  button, iconButton, linkButton, socialButton, input, inputField, select, modal, initModal,
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
  mount, controlIcon, runeIcon, CONTROL_ICON_NAMES
} from '../src/index.mjs';

/* ---------- shared sample data ---------- */
const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({
  label,
  total: [48, 64, 58, 86, 75, 105, 96][i],
  email: [20, 28, 24, 36, 31, 45, 40][i],
  revenue: [32, 45, 39, 64, 52, 75, 68][i],
  orders: [20, 28, 24, 38, 30, 42, 35][i]
}));
const chartSeries = [
  { key: 'total', label: 'Conversations' },
  { key: 'email', label: 'Email' }
];
const revSeries = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'orders', label: 'Orders' }
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
const longList = Array.from({ length: 30 }, (_, i) => `Project ${i + 1}`);
/* Legacy Agent Run examples share one three-step script per run state. */
function agentRunSteps(state) {
  const stepState = state === 'queued' ? 'queued' : state === 'running' ? 'running' : 'completed';
  return [
    { type: 'thinking', title: 'Thinking', state: stepState, detail: 'Reviewing the request and planning which tools are needed. This is a user-facing progress summary.' },
    { type: 'tool', name: 'Run command', iconName: 'code', state: stepState, input: 'npm run test', output: state === 'completed' ? '12 tests passed. Exit code: 0' : state === 'failed' ? 'Command exited with code 1.' : '' },
    { type: 'tool', name: 'Search browser', iconName: 'search', state: stepState, input: 'Sesama UI documentation', output: state === 'completed' ? '3 sample results: Components, Installation, Usage guide.' : '' }
  ];
}

const bannerActions = () => button({ label: 'Review details', variant: 'outline', attributes: 'data-canonical-toast="Details reviewed.|success"' });
const collapsibleSteps = items => '<ul style="margin:0;padding:0 0 0 8px;list-style:none;display:grid;gap:var(--space-4)">' + items.map(s => `<li style="display:flex;align-items:center;gap:6px">${controlIcon('check', 12)}${s}</li>`).join('') + '</ul>';

const demoBlock = text => `<div style="display:grid;place-items:center;min-height:80px;background:var(--color-recessed);border-radius:var(--radius-md);color:var(--text-subtle);font-size:12px">${text}</div>`;
const row = (...nodes) => `<div class="sx-row" style="justify-content:center">${nodes.join('')}</div>`;
const sw = (on, label = 'Toggle setting', disabled = false) =>
  `<button type="button" class="sw" role="switch" aria-checked="${!!on}" data-switch aria-label="${label}"${disabled ? ' disabled' : ''}><i></i></button>`;
const ibtn = (name, attrs, ariaLabel) => iconButton(name, { ariaLabel, attributes: attrs });

/* ---------- per-variant canonical builders ----------
 * Keys must match the legacy example names exactly.
 * A "*" entry (if present) is the fallback for unmapped variant names. */
const canonical = {
  'Button': {
    'primary': () => row(button({ label: 'Primary', variant: 'primary' }), button({ label: 'Create project', variant: 'primary', icon: 'plus' })),
    'secondary': () => row(button({ label: 'Secondary' }), button({ label: 'Save changes' })),
    'outline': () => button({ label: 'Outline', variant: 'outline' }),
    'ghost': () => button({ label: 'Ghost', variant: 'ghost' }),
    'dashed': () => button({ label: 'Dashed', variant: 'dashed', icon: 'plus' }),
    'destructive': () => button({ label: 'Delete', variant: 'destructive' }),
    'secondary-destructive': () => button({ label: 'secondary-destructive', variant: 'secondary-destructive' }),
    'Social': () => row(socialButton('google'), socialButton('github')),
    'Link': () => row(
      linkButton('View details', { href: '#' }),
      linkButton('Create account', { tone: 'brand' }),
      linkButton('Learn more', { iconName: 'arrow-up-right' }),
      linkButton('Unavailable', { disabled: true })
    ),
    'Sizes': () => row(
      button({ label: 'XS', size: 'xs' }), button({ label: 'SM' }),
      button({ label: 'BASE', size: 'base' }), button({ label: 'LG', size: 'lg' })
    ) + row(
      button({ label: 'XS', size: 'xs', icon: 'plus' }), button({ label: 'SM', size: 'sm', icon: 'plus' }),
      button({ label: 'BASE', size: 'base', icon: 'plus' }), button({ label: 'LG', size: 'lg', icon: 'plus' })
    ),
    'With icon': () => button({ label: 'Create project', icon: 'plus' }),
    'Square icon button': () => iconButton('plus', { ariaLabel: 'Add requirement', attributes: 'aria-pressed="false"' }),
    'Raised icon button': () => iconButton('plus', { variant: 'raised', ariaLabel: 'Add requirement', attributes: 'aria-pressed="false"' }),
    'Outline icon button': () => row(
      iconButton('kebab', { variant: 'outline size-base', ariaLabel: 'More actions' }),
      iconButton('plus', { variant: 'outline size-base', ariaLabel: 'Add item' }),
      iconButton('kebab', { variant: 'outline size-base', ariaLabel: 'More actions unavailable', disabled: true })
    ),
    'Icon button sizes': () => row(
      iconButton('kebab', { size: 'sm', ariaLabel: 'Small action' }),
      iconButton('kebab', { size: 'base', ariaLabel: 'Base action' }),
      iconButton('kebab', { size: 'lg', ariaLabel: 'Large action' })
    ),
    'Circle icon button': () => iconButton('search', { variant: 'raised circle', ariaLabel: 'Search requirements' }),
    'Loading': () => button({ label: 'Saving…', loading: true }),
    'Disabled': () => button({ label: 'Save changes', disabled: true }),
    'With title': () => button({ label: 'Create project', icon: 'plus', attributes: 'title="Create a new requirement"' })
  },

  'Button group': {
    'Menu button / primary': () => dropdownMenu({
      trigger: { label: 'New project', variant: 'primary', icon: 'plus' },
      ariaLabel: 'Create resource',
      items: [{ label: 'From template', icon: 'copy' }, { label: 'Blank project', icon: 'plus' }]
    }),
    'Menu button / secondary': () => dropdownMenu({
      trigger: { label: 'New requirement', icon: 'plus' },
      ariaLabel: 'Create resource',
      items: [{ label: 'Requirement', icon: 'file-text' }, { label: 'Folder', icon: 'folder' }, { type: 'separator' }, { label: 'Import', icon: 'import' }]
    }),
    'Connected group': () => buttonGroup({ buttons: ['Day', 'Week', 'Month'] }),
    'Split button': () => buttonGroup({ split: true, buttons: [{ label: 'Create project' }] })
  },

  'Badge': {
    'neutral': () => badge({ label: 'Draft' }),
    'informative': () => badge({ label: 'New', tone: 'informative' }),
    'success': () => badge({ label: 'Completed', tone: 'success' }),
    'error': () => badge({ label: 'Failed', tone: 'error' }),
    'disabled': () => badge({ label: 'Unavailable', tone: 'disabled' })
  },

  'Status dot': {
    'Enabled': () => statusDot({ tone: 'success', label: 'Enabled' }),
    'Disabled': () => statusDot({ tone: 'neutral', label: 'Disabled' }),
    'Neutral': () => statusDot({ tone: 'neutral', label: 'Neutral' }),
    'Informative': () => statusDot({ tone: 'informative', label: 'In progress' }),
    'Success': () => statusDot({ tone: 'success', label: 'Published' }),
    'Warning': () => statusDot({ tone: 'warning', label: 'In review' }),
    'Error': () => statusDot({ tone: 'error', label: 'Failed' }),
    'Dot only': () => row(
      statusDot({ tone: 'neutral' }), statusDot({ tone: 'informative' }),
      statusDot({ tone: 'success' }), statusDot({ tone: 'warning' }),
      statusDot({ tone: 'error' }), statusDot({ tone: 'disabled' })
    ),
    'Sizes': () => row(statusDot({ tone: 'neutral', label: '6px', size: 6 }), statusDot({ tone: 'neutral', label: '8px', size: 8 }), statusDot({ tone: 'neutral', label: '10px', size: 10 })),
    'Presence': () => row(statusDot({ tone: 'success', label: 'Online' }), statusDot({ tone: 'warning', label: 'Away' }), statusDot({ tone: 'error', label: 'Busy' }), statusDot({ tone: 'neutral', label: 'Offline' })),
    'Activity': () => statusDot({ tone: 'informative', label: 'In progress', size: 8, active: true }),
    'With metadata': () => row(statusDot({ tone: 'success', label: 'Available' }), '<span class="sx-help">Updated just now</span>')
  },

  'Avatar': {
    '16px': () => avatar({ name: 'Jordan Lee', initials: 'JL', size: 16 }),
    '24px': () => avatar({ name: 'Jordan Lee', initials: 'JL', size: 24, color: 'auto' }),
    '32px': () => avatar({ name: 'Jordan Lee', initials: 'JL', size: 32, color: 'auto' }),
    'selectable': () => avatar({ name: 'Jordan Lee', initials: 'JL', size: 24, selectable: true }),
    'selected': () => avatar({ name: 'Jordan Lee', initials: 'JL', size: 24, selected: true }),
    'disabled': () => avatar({ name: 'Jordan Lee', initials: 'JL', size: 24, disabled: true }),
    'image': () => avatar({ name: 'Jordan Lee', initials: 'JL', size: 24, image: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="#dfe1ea"/><circle cx="16" cy="12" r="6" fill="#667085"/><path d="M4 32a12 12 0 0 1 24 0" fill="#667085"/></svg>') }),
    'broken image': () => avatar({ name: 'Jordan Lee', initials: 'JL', size: 24, image: 'data:image/png;base64,invalid' }),
    'Group with overflow': () => `<div class="sx-avatar-group">${avatar({ name: 'Amelia Park', size: 24 })}${avatar({ name: 'Noah Ibarra', size: 24 })}${avatar({ name: 'Priya Desai', size: 24 })}${popover({ trigger: { label: '+3', size: 'sm' }, ariaLabel: 'Show 3 more members', content: '<div class="sx-pop-content"><div>Alex Morgan</div><div>Sam Rivera</div><div>Taylor Kim</div></div>' })}</div>`
  },

  'Switch': {
    'On': () => switchControl({ label: 'Notifications', checked: true }),
    'Off': () => switchControl({ label: 'Notifications' }),
    'Disabled': () => switchControl({ label: 'Notifications', checked: true, disabled: true })
  },

  'Input': {
    'Text / default': () => inputField({ label: '', ariaLabel: 'Project name', placeholder: 'Project name' }),
    'Filled': () => inputField({ label: '', ariaLabel: 'Project name', value: 'Website redesign' }),
    'Disabled': () => inputField({ label: '', ariaLabel: 'Project name', placeholder: 'Project name', disabled: true }),
    'Invalid': () => inputField({ label: '', ariaLabel: 'Project name', invalid: true }),
    'Sizes': () => `<div class="sx-stack">${['sm', 'base', 'lg'].map(size => `<div class="sx-stack"><span class="sx-help">${{ sm: 'Small · 26px', base: 'Base · 30px', lg: 'Large · 34px' }[size]}</span>${inputField({ label: '', ariaLabel: `Project name ${size}`, size, placeholder: 'Project name' })}</div>`).join('')}</div>`,
    'Type: text': () => inputField({ label: '', ariaLabel: 'Project name', placeholder: 'Project name' }),
    'Type: email': () => inputField({ label: '', ariaLabel: 'Email', type: 'email', placeholder: 'name@example.com' }),
    'Type: number': () => inputField({ label: '', ariaLabel: 'Count', type: 'number', placeholder: '5' }),
    'Type: url': () => inputField({ label: '', ariaLabel: 'Website', type: 'url', placeholder: 'https://example.com' }),
    'Prefix and suffix': () => inputField({ label: '', ariaLabel: 'Website', name: 'website', prefix: 'https://', suffix: '.com' })
  },

  'Input Field': {
    'default': () => inputField({ label: 'Email', name: 'email', type: 'email', placeholder: 'name@example.com' }),
    'helper': () => inputField({ label: 'Email', name: 'email', type: 'email', placeholder: 'name@example.com', helper: 'We will use this address to contact you.' }),
    'required': () => inputField({ label: 'Email', name: 'email', type: 'email', placeholder: 'name@example.com', required: true }),
    'invalid': () => inputField({ label: 'Email', name: 'email', type: 'email', placeholder: 'name@example.com', invalid: true, error: 'Check this value and try again.' }),
    'Password / default': () => inputField({ label: 'Password', name: 'password', type: 'password', passwordToggle: true }),
    'Password / invalid': () => inputField({ label: 'Password', name: 'password', type: 'password', passwordToggle: true, invalid: true, error: 'Use at least 8 characters.' }),
    'Phone / country prefix': () => inputField({ label: 'Phone number', name: 'phone', type: 'tel', phonePrefix: true, prefix: '+62', placeholder: '812 3456 7890' })
  },

  'Chip': {
    'default': () => chip({ label: 'Design' }),
    'selected': () => chip({ label: 'Design', selected: true }),
    'with icon': () => chip({ label: 'Design', icon: 'folder' }),
    'disabled': () => chip({ label: 'Design', selected: true, disabled: true }),
    'removable': () => chip({ label: 'Design', removable: true }),
    'informative': () => chip({ label: 'Design', tone: 'informative' }),
    'success': () => chip({ label: 'Design', tone: 'success' }),
    'error': () => chip({ label: 'Design', tone: 'error' })
  },

  'Label': {
    'neutral': () => label({ text: 'System', tone: 'neutral' }),
    'informative': () => label({ text: 'Requirement', tone: 'brand' }),
    'success': () => label({ text: 'Approved', tone: 'success' }),
    'error': () => label({ text: 'Rejected', tone: 'error' }),
    'disabled': () => label({ text: 'Archived', tone: 'subtle' })
  },

  'Wire': {
    'bezier': () => wire({ type: 'bezier' }),
    'step': () => wire({ type: 'step' })
  },

  'Divider': {
    'Horizontal': () => divider({ attributes: 'style="width:220px"' }),
    'With label': () => divider({ label: 'Section', attributes: 'style="width:220px"' }),
    'Vertical': () => divider({ orientation: 'vertical', attributes: 'style="height:48px"' })
  },

  'Select': {
    'Input Field': () => select({ name: 'base', ariaLabel: 'Base', value: 'Base', icon: 'branch', options: ['Base', 'Review', 'Approved'] }),
    'Inline': () => select({ name: 'inline', ariaLabel: 'Base', value: 'Base', options: ['Base', 'Review'], inline: true, hideLabel: true }),
    'Disabled': () => select({ name: 'disabled', ariaLabel: 'Base', value: 'Base', options: ['Base', 'Review'], disabled: true }),
    'default': () => select({ name: 'team', label: 'Team', value: 'Design team', options: ['Design team', 'Engineering'] }),
    'with icon': () => select({ name: 'team', label: 'Team', value: 'Design team', icon: 'users', options: ['Design team', 'Engineering'] }),
    'without label': () => select({ name: 'team', ariaLabel: 'Team', hideLabel: true, value: 'Design team', icon: 'users', options: ['Design team', 'Engineering'] }),
    'inline': () => select({ name: 'inline', ariaLabel: 'Base', hideLabel: true, inline: true, value: 'Base', icon: 'branch', options: ['Base', 'feature/torque-420'] }),
    'description': () => select({ name: 'described', label: 'Team', value: 'Design team', options: ['Design team', 'Engineering'], helper: 'Choose the team that owns this project.' }),
    'invalid': () => select({ name: 'invalid', label: 'Team', invalid: true, options: ['Design team', 'Engineering'] }),
    'disabled': () => select({ name: 'disabled', label: 'Team', value: 'Design team', options: ['Design team', 'Engineering'], disabled: true }),
    'grouped': () => select({
      name: 'grouped', label: 'Environment', value: 'Production',
      groups: [{ label: 'Environments', options: ['Production', 'Staging'] }, { label: 'Local', options: ['Development'] }]
    }),
    'with footer action': () => select({
      name: 'footer', label: 'Design', value: 'Design',
      groups: [{ label: 'Options', options: [{ label: 'Design', icon: 'image' }, { label: 'Personal', icon: 'circle-user' }] }],
      actions: [{ key: 'add-option', label: 'Create new', icon: 'plus' }]
    }),
    'long list': () => select({ name: 'long', label: 'Project', value: 'Project 1', options: longList }),
    'Sizes': () => row(
      select({ name: 'sm', ariaLabel: 'Small', size: 'sm', value: 'Base', options: ['Base'] }),
      select({ name: 'base', ariaLabel: 'Base size', value: 'Base', options: ['Base'] }),
      select({ name: 'lg', ariaLabel: 'Large', size: 'lg', value: 'Base', options: ['Base'] })
    )
  },

  'Tabs': {
    'Segmented': () => tabs({ ariaLabel: 'Project view', variant: 'segmented', tabs: [{ label: 'Table', content: 'Requirements table.' }, { label: 'Tree', content: 'Requirements tree.' }, { label: 'Reader', content: 'Reading view.' }] }),
    'Pill': () => tabs({ ariaLabel: 'Workspace view', variant: 'pill', tabs: [{ label: 'Agent', content: 'Agent workspace.' }, { label: 'Automations', content: 'Automation rules.' }] }),
    'segmented': () => tabs({ ariaLabel: 'Project view', variant: 'segmented', tabs: [{ label: 'Overview', content: 'Project overview and summary.' }, { label: 'Activity', content: 'Recent project activity.' }, { label: 'Settings', content: 'Project preferences.' }] }),
    'pill': () => tabs({ ariaLabel: 'Workspace view', variant: 'pill', tabs: [{ label: 'Agent', content: 'Agent workspace.' }, { label: 'Automations', content: 'Automation rules.' }] }),
    'disabled tab': () => tabs({ ariaLabel: 'Project view', tabs: [{ label: 'Overview', content: 'Overview panel.' }, { label: 'Settings', disabled: true }] })
  },

  'Breadcrumbs': {
    'With icons': () => breadcrumbs({ items: [{ label: 'Systems', href: '#', icon: 'folder' }, { label: 'Projects', href: '#', icon: 'doc' }, { label: 'Electric motor', current: true }] }),
    'Plain': () => breadcrumbs({ items: [{ label: 'Workspace', href: '#' }, { label: 'Systems', href: '#' }, { label: 'Powertrain', current: true }] })
  },

  'Tree item': {
    'Section header with action': () => treeSection('Projects', tree([{ label: 'Website launch', icon: 'folder' }]), { actionIcon: 'plus', actionLabel: 'Add project', actionAttributes: 'aria-label="Add project"' }),
    'Navigation': () => tree([
      { label: 'Dashboard', icon: 'home' }, { label: 'Projects', icon: 'folder' }, { label: 'Documents', icon: 'doc' },
      { label: 'Activity', icon: 'bell' }, { label: 'Team', icon: 'users' }, { label: 'Settings', icon: 'settings' }
    ]),
    'With icon': () => tree([{ label: 'Projects', icon: 'folder' }]),
    'Nested / expanded': () => tree([{ label: 'Projects', icon: 'folder', children: [{ label: 'Website', icon: 'doc' }] }]),
    'Three levels': () => tree([{ label: 'Projects', icon: 'folder', children: [{ label: 'Website', icon: 'folder', children: [{ label: 'Overview', icon: 'doc' }, { label: 'Guidelines', icon: 'doc' }] }, { label: 'Mobile app', icon: 'folder' }] }]),
    'Collapsed': () => tree([{ label: 'Projects', icon: 'folder', expanded: false, children: [{ label: 'Website', icon: 'folder', children: [{ label: 'Overview', icon: 'doc' }] }] }]),
    'With hover actions': () => tree([
      { label: 'Projects', icon: 'folder', actions: ibtn('plus', '', 'Add to Projects') + ibtn('kebab', '', 'Actions for Projects') },
      { label: 'Documents', icon: 'doc', actions: ibtn('plus', '', 'Add to Documents') + ibtn('kebab', '', 'Actions for Documents') }
    ]),
    'With loading': () => tree([{ label: 'Documents', icon: 'doc', loading: true }]),
    'Selected': () => tree([{ label: 'Projects', icon: 'folder', selected: true }])
  },

  'List row': {
    'Enabled with switch': () => listRow({ title: 'Requirements writing', trailing: sw(true, 'Requirements writing') }),
    'Disabled with switch': () => listRow({ title: 'Requirements writing', disabled: true, trailing: sw(false, 'Requirements writing', true) }),
    'Without switch': () => listRow({ title: 'Requirements writing' }),
    'Plain / inline': () => listRow({ variant: 'plain', title: 'Project overview' }),
    'Basic': () => listRow({ title: 'Project overview' }),
    'With description': () => listRow({ title: 'Project overview', description: 'Keep your project information in one place.' }),
    'With icon': () => listRow({ title: 'Project overview', leading: 'file-text' }),
    'With avatar': () => listRow({ title: 'Jordan Lee', description: 'Product designer', leading: avatar({ name: 'Jordan Lee', initials: 'JL', size: 28 }) }),
    'With metadata': () => listRow({ title: 'Project overview', trailing: '<span class="sx-help">Updated today</span>' }),
    'With badge': () => listRow({ title: 'Project overview', trailing: badge({ label: 'Draft' }) }),
    'Navigation': () => listRow({ variant: 'navigation', title: 'Project settings', href: '#' }),
    'With action': () => listRow({ title: 'Project overview', trailing: dropdownMenu({ trigger: { label: '', variant: 'ghost', icon: 'kebab', ariaLabel: 'Item actions' }, ariaLabel: 'Item actions', items: [{ label: 'Edit', icon: 'pencil' }, { label: 'Duplicate', icon: 'copy' }, { label: 'Delete', icon: 'trash', danger: true }] }) }),
    'With switch': () => listRow({ title: 'Email notifications', trailing: sw(true, 'Email notifications') }),
    'With checkbox': () => listRow({ variant: 'checkbox', title: 'Website' }),
    'With radio': () => listRow({ variant: 'radio', title: 'Website' }),
    'Disabled': () => listRow({ variant: 'navigation', title: 'Project settings', disabled: true })
  },

  'Card': {
    'Framed': () => card({ title: 'Website redesign', description: 'Plan and track the next release.', actions: button({ label: 'Open', variant: 'secondary' }), attributes: 'style="max-width:300px"' }),
    'Bare': () => card({ title: 'Website redesign', attributes: 'style="max-width:300px"' }),
    'Selected': () => card({ title: 'Website redesign', description: 'Plan and track the next release.', selected: true, attributes: 'style="max-width:300px"' }),
    'Expandable': () => card({ title: 'Website redesign', actions: ibtn('chevron-right', '', 'Expand item') }),
    'With status': () => card({ title: 'Website redesign', content: badge({ label: 'Draft' }), attributes: 'style="max-width:300px"' })
  },

  'Toolbar': {
    'Actions': () => toolbar({ variant: 'rail', items: [{ label: 'Fields', variant: 'ghost', icon: 'fields' }, { label: 'Filter', variant: 'ghost', icon: 'filter' }] }),
    'Vertical zoom controls': () => toolbar({
      orientation: 'vertical',
      variant: 'rail',
      items: [
        '<output aria-live="polite">100%</output>',
        { icon: 'minus', variant: 'raised', ariaLabel: 'Zoom out', attributes: 'data-canvas-zoom="-0.1"' },
        { icon: 'plus', variant: 'raised', ariaLabel: 'Zoom in', attributes: 'data-canvas-zoom="0.1"' },
        { icon: 'fit', variant: 'raised', ariaLabel: 'Fit to screen', attributes: 'data-canvas-zoom="fit"' }
      ]
    }),
    'Horizontal zoom controls': () => toolbar({
      variant: 'rail',
      items: [
        '<output aria-live="polite">100%</output>',
        { icon: 'minus', variant: 'raised', ariaLabel: 'Zoom out', attributes: 'data-canvas-zoom="-0.1"' },
        { icon: 'plus', variant: 'raised', ariaLabel: 'Zoom in', attributes: 'data-canvas-zoom="0.1"' },
        { icon: 'fit', variant: 'raised', ariaLabel: 'Fit to screen', attributes: 'data-canvas-zoom="fit"' }
      ]
    })
  },

  'Message': {
    'User': () => message({ content: '<p>The peak motor torque requirement changed to 420 Nm. Update the downstream requirements and regenerate the motor housing.</p>' }),
    'Basic': () => message({ content: '<p>The project brief is ready. Please review the latest changes.</p>' }),
    'With sender': () => message({ sender: 'Jordan Lee', time: '10:30', content: '<p>The project brief is ready. Please review the latest changes.</p>' }),
    'Incoming': () => message({ sender: 'Jordan Lee', time: '10:30', content: '<p>The project brief is ready. Please review the latest changes.</p>' }),
    'Sender / outgoing': () => message({ role: 'user', own: true, status: 'sent', time: '10:31', content: '<p>Reviewed — the scope looks good to send.</p>' }),
    'Sender with attachment': () => message({ role: 'user', own: true, status: 'sent', content: '<p>Brief attached for review.</p>', attachments: fileCard({ name: 'Project brief.pdf', type: 'document' }) }),
    'Comment / without bubble': () => message({ role: 'comment', sender: 'Jordan Lee', content: '<p>Concurrency looks fine after the fix.</p>' }),
    'With attachment': () => message({ content: '<p>Latest draw attached.</p>', attachments: fileCard({ name: 'motor.step', type: 'other' }) }),
    'With reply': () => message({ quote: { name: 'Alex Morgan', text: 'Is the project brief ready?' }, content: '<p>Yes — sending it now.</p>' }),
    'With actions': () => message({ content: '<p>Ready for review.</p>', actions: [{ action: 'reply', icon: 'chat', label: 'Reply' }, { action: 'copy', icon: 'copy', label: 'Copy message' }] }),
    'Sending': () => message({ role: 'user', own: true, status: 'sending', content: '<p>Sending the updated brief…</p>' }),
    'Failed': () => message({ role: 'user', own: true, status: 'failed', content: '<p>This message could not be sent.</p>' }),
    'Deleted': () => message({ role: 'user', status: 'deleted', content: '' }),
    'AI agent response': () => message({
      role: 'agent',
      content: '<p>I reviewed the project brief. Next steps: confirm scope, assign owners, and validate the timeline.</p>',
      actions: [{ action: 'copy', icon: 'copy', label: 'Copy response' }, { action: 'helpful', icon: 'thumbs-up', label: 'Helpful response' }]
    }),
    'AI agent thinking': () => message({ role: 'agent', status: 'thinking' }),
    'AI agent streaming': () => message({ role: 'agent', content: '<p>Reviewing the requirements…</p>' }),
    'AI agent tool result': () => message({
      role: 'agent',
      content: agentRun({
        title: 'Document research', state: 'completed',
        steps: [{ type: 'tool', name: 'Search documents', iconName: 'search', state: 'completed', input: 'Project brief', output: '3 sample documents found.' }]
      }) + '<div data-message-content><p>Found the brief and two related documents.</p></div>'
    })
  },

  'Collapsible': {
    'Collapsed': () => collapsible({ trigger: 'Execution plan', content: collapsibleSteps(['Update Peak Motor Torque to 420 Nm', 'Propagate to child requirements']) }),
    'Expanded': () => collapsible({ trigger: 'Execution plan', open: true, content: collapsibleSteps(['Update Peak Motor Torque to 420 Nm', 'Propagate to child requirements', 'Regenerate motor housing CAD']) })
  },

  'File card': {
    'With preview': () => fileCard({ name: 'MTR-HSG-4200-R02.step', type: 'other', expanded: true, preview: `<div class="sx-file-icon-preview">${controlIcon('box', 80)}</div>` }),
    'Without preview': () => fileCard({ name: 'motor.step', type: 'other' }),
    'Image': () => fileCard({ name: 'landscape.png', type: 'image', src: '/assets/file-preview.svg' }),
    'Document': () => fileCard({ name: 'Project brief.pdf', type: 'document' }),
    'Spreadsheet': () => fileCard({ name: 'Budget.xlsx', type: 'spreadsheet' }),
    'Presentation': () => fileCard({ name: 'Project overview.pptx', type: 'presentation' }),
    'Video': () => fileCard({ name: 'Product walkthrough.mp4', type: 'video' }),
    'Audio': () => fileCard({ name: 'Interview recording.mp3', type: 'audio' }),
    'Archive': () => fileCard({ name: 'Project assets.zip', type: 'archive' }),
    'Other': () => fileCard({ name: 'Model.step', type: 'other' })
  },

  'Input area': {
    'Empty': () => textarea({ label: 'Comment', placeholder: 'Leave a comment or tag @flow', rows: 2 }),
    'Ready to send': () => textarea({ label: 'Comment', value: 'Please review the latest project changes.', rows: 2 }),
    'default': () => textarea({ label: 'Description', placeholder: 'Describe your project…' }),
    'filled': () => textarea({ label: 'Description', value: 'Plan the next website release.' }),
    'helper': () => textarea({ label: 'Description', helper: 'A short description helps your team.' }),
    'invalid': () => textarea({ label: 'Description', invalid: true, error: 'Enter a description.' }),
    'disabled': () => textarea({ label: 'Description', disabled: true }),
    'read only': () => textarea({ label: 'Description', value: 'Plan the next website release.', readonly: true }),
    'auto resize': () => textarea({ label: 'Description', autoResize: true, placeholder: 'Describe your project…' }),
    'character limit': () => textarea({ label: 'Description', maxLength: 120, placeholder: 'Describe your project…' })
  },

  'Table': {
    'Default': () => table({ label: 'Requirements', columns: tableColumns.slice(0, 2), rows: tableRows }),
    'Sortable': () => table({ label: 'Requirements', columns: [{ key: 'name', header: 'Name', sortable: true }, { key: 'status', header: 'Status' }], rows: tableRows, sortKey: 'name' }),
    'Selectable': () => table({
      label: 'Requirements',
      columns: [{ key: 'name', header: 'Name' }, { key: 'status', header: 'Status' }],
      rows: tableRows,
      rowAction: 'open'
    }),
    'default': () => table({ label: 'Requirements', columns: tableColumns.slice(0, 2), rows: tableRows }),
    'with actions': () => table({
      label: 'Requirements',
      columns: [...tableColumns.slice(0, 2), { key: 'actions', header: 'Actions', align: 'right', render: (_, r) => `<div class="sx-table-actions">${button({ label: 'Edit', variant: 'ghost', attributes: `aria-label="Edit ${r.name}"` })}</div>` }],
      rows: tableRows
    }),
    'compact': () => table({ label: 'Requirements', columns: tableColumns.slice(0, 2), rows: tableRows }),
    'selection': () => table({
      label: 'Requirements',
      columns: [{ key: 'name', header: 'Name' }, { key: 'status', header: 'Status' }],
      rows: tableRows
    }),
    'sticky header': () => table({ label: 'Requirements', columns: tableColumns, rows: tableRows, maxHeight: 200 }),
    'loading': () => skeleton({ shape: 'line', count: 3 }),
    'empty': () => table({ label: 'Requirements', columns: tableColumns, rows: [] }),
    'error': () => emptyState({ title: 'Projects could not load', description: 'Please try loading the list again.', icon: 'circle-x', actions: button({ label: 'Retry', variant: 'primary' }) })
  },

  'Toast': {
    'neutral': () => `<button type="button" class="btn secondary" data-canonical-toast="Project changes saved.|neutral">Show neutral toast</button>`,
    'informative': () => `<button type="button" class="btn secondary" data-canonical-toast="Your export is ready.|informative">Show informative toast</button>`,
    'success': () => `<button type="button" class="btn secondary" data-canonical-toast="Changes saved successfully.|success">Show success toast</button>`,
    'warning': () => `<button type="button" class="btn secondary" data-canonical-toast="Review the settings before continuing.|warning">Show warning toast</button>`,
    'error': () => `<button type="button" class="btn secondary" data-canonical-toast="Unable to save changes. Try again.|error">Show error toast</button>`,
    'Persistent': () => `<button type="button" class="btn secondary" data-canonical-toast="Review required.|informative|persistent">Show persistent toast</button>`,
    'Title and description': () => `<button type="button" class="btn secondary" data-canonical-toast-json='${JSON.stringify({ message: 'Your project is ready for review.', tone: 'success', title: 'Saved' })}'>Show detailed toast</button>`
  },

  'Canvas': {
    'Dotted (default)': () => canvas({
      content: card({ header: label({ text: 'Project' }), title: 'Project brief' }) +
        controlIcon('chevron-right', 16) +
        card({ header: label({ text: 'Project' }), title: 'Design review', selected: true })
    }),
    'Empty': () => canvas({ content: '<span style="color:var(--text-placeholder);font-size:12px">Add an item to start your workspace.</span>' })
  },

  'Modal': {
    'Form': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-form">Open form modal</button>` +
      modal({
        id: 'canonical-modal-form', title: 'Edit details',
        description: 'Update the name below, then save your changes.',
        content: inputField({ label: 'Name', name: 'modal-name', value: 'Website redesign', required: true }),
        actions: button({ label: 'Cancel', variant: 'secondary', attributes: 'data-modal-close' }) + button({ label: 'Save changes', variant: 'primary' })
      }),
    'default': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal">Open default modal</button>` +
      modal({ id: 'canonical-modal', title: 'Save changes?', description: 'Save the changes you have made to this item.' }),
    'confirmation': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-confirm">Open confirmation modal</button>` +
      modal({
        id: 'canonical-modal-confirm', title: 'Confirm this action?',
        description: 'Review your changes before continuing.',
        actions: button({ label: 'Cancel', variant: 'secondary', attributes: 'data-modal-close' }) + button({ label: 'Confirm', variant: 'primary' })
      }),
    'form': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-form">Open form modal</button>` +
      modal({
        id: 'canonical-modal-form', title: 'Edit details',
        description: 'Update the name below, then save your changes.',
        content: inputField({ label: 'Name', name: 'modal-name', value: 'Website redesign', required: true }),
        actions: button({ label: 'Cancel', variant: 'secondary', attributes: 'data-modal-close' }) + button({ label: 'Save changes', variant: 'primary' })
      }),
    'sm': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-sm">Open small modal</button>` + modal({ id: 'canonical-modal-sm', title: 'Small modal', size: 'sm' }),
    'base': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-base">Open base modal</button>` + modal({ id: 'canonical-modal-base', title: 'Base modal' }),
    'lg': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-lg">Open large modal</button>` + modal({ id: 'canonical-modal-lg', title: 'Large modal', size: 'lg' }),
    'xl': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-xl">Open extra large modal</button>` + modal({ id: 'canonical-modal-xl', title: 'Extra large modal', size: 'xl' }),
    'long content': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-long">Open long content modal</button>` +
      modal({ id: 'canonical-modal-long', title: 'Long content', content: Array.from({ length: 10 }, (_, i) => `<p>Section ${i + 1}: review the project scope and delivery milestones.</p>`).join('') }),
    'locked confirmation': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-locked">Open locked confirmation</button>` +
      modal({ id: 'canonical-modal-locked', title: 'Confirm changes', locked: true, actions: button({ label: 'Confirm', variant: 'primary', attributes: 'data-modal-close' }) }),
    'with Select': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-select">Open modal with Select</button>` +
      modal({ id: 'canonical-modal-select', title: 'Project details', content: select({ name: 'modal-team', label: 'Team', value: 'Design team', options: ['Design team', 'Engineering'] }) }),
    'with Popover': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-pop">Open modal with Popover</button>` +
      modal({ id: 'canonical-modal-pop', title: 'Project details', content: popover({ trigger: 'Filter options', content: '<div class="sx-pop-content"><span class="sx-help">Interactive panel.</span></div>' }) }),
    'with Combobox': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-combo">Open modal with Combobox</button>` +
      modal({ id: 'canonical-modal-combo', title: 'Project details', content: combobox({ label: 'Project' }) }),
    'with Dropdown': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-modal-dropdown">Open modal with Dropdown</button>` +
      modal({ id: 'canonical-modal-dropdown', title: 'Project details', content: dropdownMenu({ trigger: 'Actions', items: [{ label: 'Edit', icon: 'pencil' }, { label: 'Delete', icon: 'trash', danger: true }] }) })
  },

  'Agent Run': {
    'queued': () => agentRun({ title: 'Agent run', state: 'queued', steps: agentRunSteps('queued') }),
    'running': () => agentRun({ title: 'Working on your request', state: 'running', open: true, steps: agentRunSteps('running') }),
    'completed': () => agentRun({ title: 'Agent run', state: 'completed', duration: '12s', steps: agentRunSteps('completed') }),
    'failed': () => agentRun({ title: 'Agent run', state: 'failed', steps: agentRunSteps('failed') }),
    'cancelled': () => agentRun({ title: 'Agent run', state: 'cancelled', steps: agentRunSteps('cancelled') })
  },

  'Tool Call': {
    'queued': () => toolCall({ name: 'Search documents', state: 'queued', input: 'Project brief' }),
    'running': () => toolCall({ name: 'Search documents', state: 'running', input: 'Project brief', open: true }),
    'completed': () => toolCall({ name: 'Search documents', state: 'completed', open: true, input: 'Project brief', output: '3 matching documents.' }),
    'failed': () => toolCall({ name: 'Search documents', state: 'failed', open: true, input: 'Project brief', output: 'Search service is unavailable.' }),
    'cancelled': () => toolCall({ name: 'Search documents', state: 'cancelled', input: 'Project brief' })
  },

  'Composer': {
    'empty': () => composer({ placeholder: 'Write a message or tag @flow' }),
    'Empty': () => composer({ placeholder: 'Write a message or tag @flow' }),
    'ready': () => composer({ placeholder: 'Write a message or tag @flow', value: 'Please review the latest project changes.' }),
    'Ready': () => composer({ placeholder: 'Write a message or tag @flow', value: 'Please review the latest project changes.' }),
    'thinking': () => composer({ placeholder: 'Write a message or tag @flow', state: 'thinking' }),
    'Thinking': () => composer({ placeholder: 'Write a message or tag @flow', state: 'thinking' })
  },

  'Scroll Area': {
    'Vertical': () => scrollArea({ ariaLabel: 'Scrollable project list', attributes: 'style="height:180px"', content: Array.from({ length: 12 }, (_, i) => `<div style="padding:8px 12px;border-bottom:1px solid var(--color-hairline)">Project ${i + 1}</div>`).join('') }),
    'Horizontal': () => scrollArea({ ariaLabel: 'Scrollable cards', orientation: 'horizontal', attributes: 'style="height:120px"', content: `<div style="display:flex;gap:8px;width:max-content;padding:8px">${Array.from({ length: 8 }, (_, i) => `<div style="display:grid;place-items:center;width:140px;height:80px;background:var(--color-recessed);border-radius:var(--radius-sm)">Card ${i + 1}</div>`).join('')}</div>` }),
    'Both directions': () => scrollArea({ ariaLabel: 'Scrollable data grid', orientation: 'both', attributes: 'style="height:180px"', content: `<div style="width:900px">${Array.from({ length: 12 }, (_, i) => `<div style="padding:8px 12px;border-bottom:1px solid var(--color-hairline)">Row ${i + 1} · Project overview</div>`).join('')}</div>` }),
    'No overflow': () => scrollArea({ ariaLabel: 'Short content', attributes: 'style="height:100px"', content: '<div style="padding:12px">All content fits in this area.</div>' })
  },

  'Menu': {
    'plain': () => menu({ ariaLabel: 'Project actions', items: [{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Delete' }] }),
    'default': () => menu({ ariaLabel: 'Project actions', items: [{ label: 'Edit', icon: 'pencil' }, { label: 'Duplicate', icon: 'copy' }, { type: 'separator' }, { label: 'Delete', icon: 'trash', danger: true }] }),
    'grouped': () => menu({ ariaLabel: 'Project actions', groups: [{ label: 'Project', items: [{ label: 'Edit', icon: 'pencil' }, { label: 'Duplicate', icon: 'copy' }] }, { label: 'Manage', items: [{ label: 'Delete', icon: 'trash', danger: true }] }] }),
    'without icons': () => menu({ ariaLabel: 'Project actions', items: [{ label: 'Edit' }, { label: 'Duplicate' }, { type: 'separator' }, { label: 'Delete', danger: true }] }),
    'shortcuts': () => menu({ ariaLabel: 'Project actions', items: [{ label: 'Edit', shortcut: 'Enter' }, { label: 'Duplicate', shortcut: 'D' }, { type: 'separator' }, { label: 'Delete', shortcut: 'Delete', danger: true }] }),
    'selection': () => menu({ ariaLabel: 'Visibility', groups: [{ label: 'Show', items: [{ label: 'Show sidebar', role: 'menuitemcheckbox', checked: true }] }, { label: 'Visibility', items: [{ label: 'Show archived', role: 'menuitemcheckbox', control: 'checkbox' }, { label: 'Show completed', role: 'menuitemcheckbox', control: 'checkbox', checked: true }] }, { label: 'Density', items: [{ label: 'Compact view', role: 'menuitemradio', control: 'radio', checked: true }, { label: 'Comfortable view', role: 'menuitemradio', control: 'radio' }] }] }),
    'long list': () => menu({ ariaLabel: 'Projects', items: longList.map(n => ({ label: n, icon: 'folder' })) })
  },

  'Menu Item': {
    'Text only': () => menu({ ariaLabel: 'Text item', items: [{ label: 'Edit' }] }),
    'With icon': () => menu({ ariaLabel: 'Icon item', items: [{ label: 'Edit', icon: 'pencil' }] }),
    'Disabled': () => menu({ ariaLabel: 'Disabled item', items: [{ label: 'Move to workspace', disabled: true }] }),
    'Danger': () => menu({ ariaLabel: 'Danger item', items: [{ label: 'Delete', danger: true }] }),
    'Shortcut': () => menu({ ariaLabel: 'Shortcut item', items: [{ label: 'Duplicate', shortcut: 'D' }] }),
    'Checkbox and radio': () => menu({ ariaLabel: 'Selection items', groups: [{ label: 'Checkmark', items: [{ label: 'Show sidebar', role: 'menuitemcheckbox', checked: true }] }, { label: 'Checkbox', items: [{ label: 'Show archived', role: 'menuitemcheckbox', control: 'checkbox' }, { label: 'Show completed', role: 'menuitemcheckbox', control: 'checkbox', checked: true }] }, { label: 'Radio', items: [{ label: 'Compact view', role: 'menuitemradio', control: 'radio', checked: true }, { label: 'Comfortable view', role: 'menuitemradio', control: 'radio' }] }] })
  },

  'Checkbox': {
    'Basic checkbox': () => checkbox({ label: 'Receive project updates' }),
    'Disabled checkbox': () => checkbox({ label: 'Receive project updates', disabled: true }),
    'Invalid checkbox': () => checkbox({ label: 'Receive project updates', invalid: true }),
    'Checkbox with label and description': () => checkbox({ label: 'Receive project updates', description: 'Optional email notifications.' }),
    'Check all / indeterminate': () => checkbox({ label: 'Select all projects', indeterminate: true })
  },

  'Radio': {
    'Basic radio': () => radio({ label: 'Receive project updates', name: 'frequency' }),
    'Disabled radio': () => radio({ label: 'Receive project updates', name: 'frequency', disabled: true }),
    'Invalid radio': () => radio({ label: 'Receive project updates', name: 'frequency', invalid: true }),
    'Radio with label and description': () => radio({ label: 'Receive project updates', name: 'frequency', description: 'Weekly summary email.' })
  },

  'Dropdown Menu': {
    'plain': () => dropdownMenu({ trigger: 'Actions', items: [{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Delete' }] }),
    'default': () => dropdownMenu({ trigger: 'Actions', items: [{ label: 'Edit', icon: 'pencil' }, { label: 'Duplicate', icon: 'copy' }, { type: 'separator' }, { label: 'Delete', icon: 'trash', danger: true }] }),
    'grouped': () => dropdownMenu({ trigger: 'Actions', groups: [{ label: 'Project', items: [{ label: 'Edit', icon: 'pencil' }] }, { label: 'Manage', items: [{ label: 'Archive', icon: 'archive' }] }] }),
    'without icons': () => dropdownMenu({ trigger: 'Actions', items: [{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Delete', danger: true }] }),
    'shortcuts': () => dropdownMenu({ trigger: 'Actions', items: [{ label: 'Edit', shortcut: 'Enter' }, { label: 'Duplicate', shortcut: 'D' }] }),
    'icon trigger': () => dropdownMenu({ trigger: { label: '', icon: 'plus', ariaLabel: 'Create resource' }, items: [{ label: 'New project', icon: 'folder' }] }),
    'selection': () => dropdownMenu({ trigger: 'View', ariaLabel: 'Visibility', groups: [{ label: 'Show', items: [{ label: 'Show sidebar', role: 'menuitemcheckbox', checked: true }] }, { label: 'Visibility', items: [{ label: 'Show archived', role: 'menuitemcheckbox', control: 'checkbox' }, { label: 'Show completed', role: 'menuitemcheckbox', control: 'checkbox', checked: true }] }, { label: 'Density', items: [{ label: 'Compact view', role: 'menuitemradio', control: 'radio', checked: true }, { label: 'Comfortable view', role: 'menuitemradio', control: 'radio' }] }] }),
    'long list': () => dropdownMenu({ trigger: 'Projects', items: longList.map(n => ({ label: n, icon: 'folder' })) })
  },

  'Tooltip': {
    'top': () => tooltip({ placement: 'top', content: 'Helpful information about this setting.' }),
    'right': () => tooltip({ placement: 'right', content: 'Helpful information about this setting.' }),
    'bottom': () => tooltip({ placement: 'bottom', content: 'Helpful information about this setting.' }),
    'left': () => tooltip({ placement: 'left', content: 'Helpful information about this setting.' }),
    'Disabled control wrapper': () => tooltip({ trigger: '<span tabindex="0" role="button" aria-label="Save unavailable" style="display:inline-flex"><button type="button" class="btn secondary" disabled>Save</button></span>', content: 'Complete the required fields first.' })
  },

  'Banner': {
    'neutral': () => banner({ title: 'Workspace notice', description: 'You can continue working or review the details.', actions: bannerActions(), dismissible: true }),
    'informative': () => banner({ title: 'New update available', description: 'You can continue working or review the details.', tone: 'informative', actions: bannerActions(), dismissible: true }),
    'success': () => banner({ title: 'Changes saved', description: 'Your workspace is up to date.', tone: 'success', actions: bannerActions(), dismissible: true }),
    'warning': () => banner({ title: 'Review your settings', description: 'Some settings need attention before saving.', tone: 'warning', actions: bannerActions(), dismissible: true }),
    'error': () => banner({ title: 'Unable to save changes', description: 'Check your connection and try again.', tone: 'error', actions: bannerActions(), dismissible: true }),
    'Without action': () => banner({ title: 'Workspace notice', description: 'You can continue working or review the details.', dismissible: true }),
    'Message only / persistent': () => banner({ description: 'Workspace settings have changed.' })
  },

  'Empty State': {
    'no data': () => emptyState({ title: 'No projects yet', description: 'Create your first project to get started.', icon: 'folder', actions: button({ label: 'Create project', variant: 'primary' }) }),
    'no results': () => emptyState({ title: 'No matching projects', description: 'Try a different search or clear your filters.', icon: 'folder', actions: button({ label: 'Clear filters', variant: 'primary' }) }),
    'error': () => emptyState({ title: 'Projects could not load', description: 'Please try loading the list again.', icon: 'circle-x', actions: button({ label: 'Retry', variant: 'primary' }) }),
    'Compact': () => emptyState({ title: 'No projects yet', description: 'Create your first project to get started.', icon: 'folder', compact: true, actions: button({ label: 'Create project', variant: 'primary' }) })
  },

  'Popover': {
    'default': () => popover({
    trigger: 'Filter options',
    content: '<div class="sx-popover-header">Filter projects</div>' +
      '<div class="sx-popover-body">' + inputField({ label: 'Project name', name: 'popover-project', placeholder: 'Search projects' }) + '</div>' +
      '<div class="sx-popover-footer">' + button({ label: 'Apply filters', variant: 'outline', attributes: 'data-canonical-toast="Filters applied.|success"' }) + '</div>'
  }),
'scrollable': () => popover({
    trigger: 'Filter options',
    content: '<div class="sx-popover-header">Filter projects</div>' +
      '<div class="sx-popover-body"><div class="sx-popover-options">' +
      Array.from({ length: 12 }, (_, i) => `<label class="sx-choice"><input type="checkbox">Category ${i + 1}</label>`).join('') +
      '</div></div>' +
      '<div class="sx-popover-footer">' + button({ label: 'Apply filters', variant: 'outline', attributes: 'data-canonical-toast="Filters applied.|success"' }) + '</div>'
  })
  },

  'Combobox': {
    'default': () => combobox({ label: 'Project' }),
    'disabled': () => combobox({ label: 'Project', disabled: true }),
    'invalid': () => combobox({ label: 'Project', invalid: true }),
    'loading': () => combobox({ label: 'Project', loading: true }),
    'long list': () => combobox({ label: 'Project', options: longList })
  },

  'Loader': {
    '16px': () => loader({ size: 16 }),
    '24px': () => loader({ size: 24 }),
    '32px': () => loader({ size: 32 }),
    'Accessible label only': () => loader({ size: 16, showLabel: false, label: 'Loading content' }),
    'Button': () => button({ label: 'Saving…', loading: true, variant: 'primary' })
  },

  'Skeleton': {
    'text': () => `<div class="sx-stack" aria-busy="true"><span class="sx-help" role="status">Loading content</span>${skeleton({ shape: 'line', count: 3 })}</div>`,
    'avatar': () => `<div class="sx-stack" aria-busy="true"><span class="sx-help" role="status">Loading content</span><div class="sx-row">${skeleton({ shape: 'round', size: 32 })}${skeleton({ shape: 'line', width: '40%' })}</div></div>`,
    'card': () => `<div class="sx-stack" aria-busy="true"><span class="sx-help" role="status">Loading content</span>${skeleton({ shape: 'card' })}</div>`,
    'table': () => `<div class="sx-stack" aria-busy="true"><span class="sx-help" role="status">Loading content</span>${skeleton({ shape: 'line', count: 3 })}</div>`,
    'Fill component container': () => `<div style="width:100%;height:160px;border-radius:var(--radius-md)">${skeleton({ shape: 'fill' })}</div>`,
    'Custom dimensions': () => `<div class="sx-row"><div style="width:45%">${skeleton({ shape: 'line', height: 16 })}</div></div>`
  },

  'Pagination': {
    'Basic': () => pagination({ page: 1, pageSize: 5, totalItems: 25 }),
    'With local data': () => pagination({ page: 2, pageSize: 5, totalItems: 25 }),
    'Single page': () => pagination({ page: 1, pageSize: 5, totalItems: 3 })
  },

  'Date Picker': {
    'default': () => datePicker({ label: 'Due date' }),
    'selected': () => datePicker({ label: 'Due date', value: '2026-11-04' }),
    'range': () => datePicker({ label: 'Date range', mode: 'range' }),
    'min and max': () => datePicker({ label: 'Due date', min: '2026-10-31', max: '2026-11-30' }),
    'invalid': () => datePicker({ label: 'Due date', invalid: true, error: 'Choose a due date.' }),
    'disabled': () => datePicker({ label: 'Due date', disabled: true }),
    'Sizes': () => `<div class="sx-stack">${['sm', 'base', 'lg'].map(size => `<div class="sx-stack"><span class="sx-help">${{ sm: 'Small · 26px', base: 'Base · 30px', lg: 'Large · 34px' }[size]}</span>${datePicker({ label: '', size })}</div>`).join('')}</div>`
  },

  'Tag Input': {
    'default': () => tagInput({ label: 'Tags' }),
    'populated': () => tagInput({ label: 'Tags', tags: ['Design', 'Review'] }),
    'max tags': () => tagInput({ label: 'Tags', tags: ['Design', 'Review'], maxTags: 2 }),
    'read only': () => tagInput({ label: 'Tags', tags: ['Design', 'Review'], readonly: true }),
    'disabled': () => tagInput({ label: 'Tags', tags: ['Design', 'Review'], disabled: true }),
    'invalid': () => tagInput({ label: 'Tags', invalid: true, error: 'A valid tag is required.' })
  },

  'Command Palette': {
    'default': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-commands">Open commands</button>` +
      commandPalette({
        id: 'canonical-commands',
        commands: [
          { label: 'Create project', group: 'Projects' },
          { label: 'Open projects', group: 'Projects' },
          { label: 'Toggle theme', group: 'Preferences' }
        ]
      }),
    'no results': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-commands-empty">Open commands</button>` +
      commandPalette({ id: 'canonical-commands-empty', value: 'unknown', commands: [{ label: 'Create project', group: 'Projects' }] })
  },

  'Chart': {
    'line': () => chart({ type: 'line', label: 'Line chart', data: chartData, series: revSeries, height: 200 }),
    'area': () => chart({ type: 'area', label: 'Area chart', data: chartData, series: revSeries, height: 200 }),
    'bar': () => chart({ type: 'bar', label: 'Bar chart', data: chartData, series: revSeries, height: 200 }),
    'stacked bar': () => chart({ type: 'stacked bar', label: 'Stacked bar chart', data: chartData, series: revSeries, height: 200 }),
    'donut': () => chart({ type: 'donut', label: 'Donut chart', data: chartData.slice(0, 3), series: [revSeries[0]], height: 200 }),
    'Thin bar': () => chart({ type: 'bar', barSize: 'thin', label: 'Thin bar chart', data: chartData, series: revSeries, height: 200 }),
    'loading': () => chart({ state: 'loading', data: chartData, series: revSeries }),
    'empty': () => chart({ state: 'ready', data: [], series: revSeries }),
    'error': () => chart({ state: 'error', data: chartData, series: revSeries, errorMessage: 'Unable to load chart.' })
  }
};

/* Blocks keyed by their catalog example names. */
const blockSamples = {
  'Activity Feed': {
    'Recent updates': () => activityFeed({ items: activities }),
    'Empty': () => activityFeed({})
  },
  'Agent card': {
    'Default': () => agentCardRecipe({
      name: 'Regulatory Agent', role: 'Assistant',
      description: 'You are an experienced systems engineer focused on reliability and compliance.',
      capabilities: ['Requirements', 'Naming conventions'],
      actions: button({ label: 'Run Agent', variant: 'primary' })
    })
  },
  'App Shell': {
    'Workspace': () => `<div style="height:420px">${appShell({
      sidebar: workspaceSidebar({
        navigation: [{ label: 'Overview', icon: 'home', key: 'overview', selected: true }, { label: 'Reports', icon: 'grid-3x3', key: 'reports' }],
        projects: [{ label: 'Website launch', icon: 'folder', children: [{ label: 'Review launch checklist', icon: false }] }]
      }),
      header: pageHeader({ title: 'Reports', icon: 'grid-3x3' }),
      content: pageLayout(dataSection({ title: 'Products', description: 'Sample data', data: table({ label: 'Products', columns: tableColumns, rows: tableRows }) }), { variant: 'data' })
    })}</div>`
  },
  'Chart Section': {
    'With filter and footer': () => chartSection({
      title: 'Weekly performance',
      description: 'Revenue and orders over the last seven days',
      actions: select({ name: 'period', ariaLabel: 'Period', value: 'Last 7 days', options: ['Last 7 days', 'Last 30 days'] }),
      chart: chart({ type: 'area', label: 'Weekly performance', data: chartData, series: revSeries, height: 220 }),
      footer: '<span class="sx-help">Sample data · period selector is a layout example.</span>',
      variant: 'bordered'
    })
  },
  'Content Section': {
    'plain': () => contentSection({ title: 'Section title', description: 'Optional description', content: demoBlock('Content slot') }),
    'bordered': () => contentSection({ title: 'Section title', description: 'Optional description', content: demoBlock('Content slot'), variant: 'bordered' }),
    'divided': () => contentSection({ title: 'Section title', description: 'Optional description', content: demoBlock('Content slot'), variant: 'divided' })
  },
  'Create skill dialog': {
    'Default': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-skill-dialog">Open create skill dialog</button>` +
      createSkillDialogRecipe({ id: 'canonical-skill-dialog' })
  },
  'Dashboard Overview': {
    'Dashboard template': () => dashboardOverviewRecipe({
      metrics: [
        { label: 'Open queue', value: '38', change: '−12.4%', tone: 'success' },
        { label: 'Active conversations', value: '126', change: '+5.2%', tone: 'neutral' },
        { label: 'Median first reply', value: '4.1m', change: '−8.0%', tone: 'success' },
        { label: 'Customer satisfaction', value: '94%', change: '+1.1%', tone: 'success' }
      ],
      chart: chartSection({ title: 'Conversation volume', chart: chart({ type: 'area', label: 'Conversation volume', data: chartData, series: chartSeries, height: 220 }), variant: 'bordered' }),
      activity: contentSection({ title: 'Recent activity', content: activityFeed({ items: activities }), variant: 'bordered' }),
      table: dataSection({ title: 'Recent projects', data: table({ label: 'Projects', columns: tableColumns, rows: tableRows }) })
    })
  },
  'Data Section': {
    'Full-width table': () => dataSection({
      title: 'Best-selling products',
      description: 'Revenue by product',
      actions: button({ label: 'Export', variant: 'outline' }),
      table: table({ label: 'Products', columns: tableColumns, rows: tableRows })
    })
  },
  'Data workspace': {
    'Projects': () => `<div style="height:420px">${dataWorkspaceRecipe({
      navigation: [{ label: 'Overview', icon: 'home', key: 'overview', selected: true }],
      projects: [{ label: 'Website launch', icon: 'folder', children: [{ label: 'Review checklist', icon: false }] }],
      table: table({ label: 'Datasets', columns: tableColumns, rows: tableRows })
    })}</div>`
  },
  'Delete resource': {
    'Default': () => `<button type="button" class="btn secondary" data-canonical-open="canonical-delete-dialog">Open delete dialog</button>` +
      deleteResourceRecipe({ id: 'canonical-delete-dialog', resourceName: 'ARP-475A Compliance' })
  },
  'Metric Card': {
    'Summary without card': () => metricSummary({ value: '$28,450', change: '+12.4%', description: 'vs last month', tone: 'success' }),
    'Compact': () => metricCard({ label: 'Net revenue', value: '$28,450', change: '+13.6%', tone: 'success', size: 'compact' }),
    'Positive change': () => metricCard({ label: 'Net revenue', value: '$28,450', change: '+13.6%', tone: 'success' }),
    'Negative change': () => metricCard({ label: 'Customer satisfaction', value: '89%', change: '−2.1%', tone: 'error' }),
    'Neutral': () => metricCard({ label: 'Active projects', value: '24' }),
    'Loading': () => metricCard({ label: 'Net revenue', state: 'loading' })
  },
  'Page Grid': {
    'Responsive dashboard': () => pageGrid({
      items: [
        { html: demoBlock('Metric · 3/12'), span: 3 },
        { html: demoBlock('Metric · 3/12'), span: 3 },
        { html: demoBlock('Metric · 3/12'), span: 3 },
        { html: demoBlock('Metric · 3/12'), span: 3 },
        { html: demoBlock('Main chart · 8/12'), span: 8 },
        { html: demoBlock('Breakdown · 4/12'), span: 4 }
      ]
    })
  },
  'Page Header': {
    'Icon and title': () => pageHeader({ title: 'Sales reports', icon: 'grid-3x3' }),
    'With actions': () => pageHeader({ title: 'Sales reports', icon: 'grid-3x3', actions: button({ label: 'Export', variant: 'secondary' }) })
  },
  'Page Layout': {
    'dashboard': () => pageLayout(demoBlock('Dashboard layout'), { variant: 'dashboard' }),
    'data': () => pageLayout(demoBlock('Data layout'), { variant: 'data' }),
    'conversation': () => pageLayout(demoBlock('Conversation layout'), { variant: 'conversation' })
  },
  'People List': {
    'Team members': () => peopleList({ people: team }),
    'Empty': () => peopleList({})
  },
  'Requirement group': {
    'Default': () => requirementGroupRecipe({
      requirements: [
        { title: 'Peak Wheel Power', description: 'ARP-475A', status: 'In review' },
        { title: 'Mass of Powertrain', description: 'Design constraint', status: 'Draft', priority: 'High' }
      ]
    })
  },
  'Resource list': {
    'Default': () => resourceListRecipe({
      title: 'Resources',
      layout: 'list',
      resources: [
        { name: 'Website launch', type: 'Project', updated: 'Oct 24, 2026' },
        { name: 'Mobile app', type: 'Project', updated: 'Oct 25, 2026' }
      ]
    })
  },
  'Revenue Chart': {
    'Daily revenue': () => revenueChartRecipe({
      chart: chart({ type: 'line', label: 'Revenue overview', data: chartData, series: revSeries, height: 220 })
    })
  },
  'Workspace Sidebar': {
    'Workspace navigation': () => workspaceSidebar({
      navigation: [{ label: 'Overview', icon: 'home', key: 'overview', selected: true }, { label: 'Reports', icon: 'grid-3x3', key: 'reports' }],
      projects: [{ label: 'Website launch', icon: 'folder', children: [{ label: 'Review launch checklist', icon: false }] }]
    })
  }
};

Object.assign(canonical, blockSamples);

/* Component previews center inside the stage; full-width blocks opt out. */
const FULL_WIDTH = new Set(['App Shell', 'Data workspace', 'Dashboard Overview', 'Page Grid', 'Data Section', 'Chart Section', 'Revenue Chart', 'Content Section', 'Resource list', 'Metric Card']);
const wrap = html => `<div class="sui-root" style="width:100%">${html}</div>`;

/* Interactive canonical previews need the runtime; rehydrate after each paint. */
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
      if (btn.dataset.canonicalToastJson) {
        try { showToast(JSON.parse(btn.dataset.canonicalToastJson)); } catch {}
        return;
      }
      const [text, tone, persistent] = btn.dataset.canonicalToast.split('|');
      showToast(text, tone || 'success', persistent === 'persistent');
    });
  });
}

const stageStyle = document.createElement('style');
stageStyle.textContent = '.stage .sui-root{display:grid;justify-items:center}.stage .sui-root.is-full{display:block}';
document.head.append(stageStyle);

const originalExamples = window.componentExamples;
if (typeof originalExamples === 'function') {
  window.componentExamples = function componentExamplesWithCanonical(x) {
    const base = originalExamples(x);
    const map = canonical[x[1]];
    if (!map) return base;
    const out = [];
    for (const entry of base) {
      out.push(entry);
      const factory = map[entry.name] || map['*'];
      if (!factory) continue;
      try {
        const html = factory();
        if (!html) continue;
        out.push({
          name: entry.name + ' (ESM)',
          html: `<div class="sui-root${FULL_WIDTH.has(x[1]) ? ' is-full' : ''}" style="width:100%">${html}</div>`,
          description: 'Equivalent variant rendered by the canonical ESM builder (src/index.mjs).',
          code: html
        });
      } catch (error) {
        console.warn('[canonical-examples] ESM preview unavailable for ' + x[1] + ' / ' + entry.name, error);
      }
    }
    return out;
  };
}

window.CANONICAL_CONTROL_ICONS = CONTROL_ICON_NAMES;
if (document.querySelector('#icon-basic-loading')) window.paint();

const originalPaint = window.paint;
if (typeof originalPaint === 'function') {
  window.paint = function paintWithCanonical() {
    const result = originalPaint();
    hydrate();
    return result;
  };
}

hydrate();
