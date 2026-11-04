import { escapeHTML as esc } from '../src/components/shared.mjs';

// Runnable builder examples for the Components reference. Blocks own their existing docs.
export const componentDocs = {
  'Button': ['button', "button({ label: 'Create project', variant: 'primary', icon: 'plus' })", 'Trigger an action with a clear label and an appropriate level of emphasis.'],
  'Button group': ['dropdownMenu', "dropdownMenu({ trigger: { label: 'New project', icon: 'plus', variant: 'primary' }, menuIndicator: true, items: [{ label: 'Project', icon: 'folder' }, { label: 'Folder', icon: 'folder' }] })", 'Group related actions or show a menu from a single button.'],
  'Badge': ['badge', "badge({ label: 'Draft', tone: 'neutral' })", 'Show a compact status or count.'],
  'Status dot': ['statusDot', "statusDot({ label: 'Available', tone: 'success' })", 'Pair a compact status indicator with readable text.'],
  'Avatar': ['avatar', "avatar({ name: 'Jordan Lee', size: 48, color: 'auto' })", 'Identify a person with an image or initials.'],
  'Switch': ['switchControl', "switchControl({ label: 'Notifications', checked: true })", 'Toggle a setting that takes effect immediately.'],
  'Input': ['input', "input({ ariaLabel: 'Project name', placeholder: 'Project name' })", 'Collect a single text value. Use Input Field when a visible label or helper text is needed.'],
  'Input Field': ['inputField', "inputField({ label: 'Project name', name: 'project', placeholder: 'Website redesign' })", 'Compose an input with a visible label, helper text, and validation feedback.'],
  'Chip': ['chip', "chip({ label: 'Design' })", 'Represent a compact item, filter, or selection.'],
  'Label': ['label', "label({ text: 'Project', tone: 'neutral' })", 'Annotate content using semantic tones.'],
  'Wire': ['wire', "wire({ type: 'bezier' })", 'Connect nodes in a canvas or diagram.'],
  'Divider': ['divider', 'divider()', 'Separate related groups of content.'],
  'Select': ['select', "select({ label: 'Status', name: 'status', options: ['Draft', 'Approved'], value: 'Draft' })", 'Choose one value from a defined list of options.'],
  'Tabs': ['tabs', "tabs({ ariaLabel: 'Project view', tabs: [{ label: 'Overview', content: 'Project overview.' }, { label: 'Activity', content: 'Recent activity.' }] })", 'Switch between related content panels.'],
  'Breadcrumbs': ['breadcrumbs', "breadcrumbs({ items: [{ label: 'Projects', href: '#projects' }, { label: 'Website' }] })", 'Show the current location within a hierarchy.'],
  'Tree item': ['tree, treeSection', "treeSection('Projects', tree([{ label: 'Website', icon: 'folder', children: [{ label: 'Overview', icon: 'doc' }] }]), { actionIcon: 'plus', actionLabel: 'Add project' })", 'Navigate hierarchical content with independent expansion and selection.'],
  'List row': ['listRow', "listRow({ title: 'Project overview', description: 'Updated today' })", 'Present an item with optional supporting text and trailing controls.'],
  'Card': ['card, label, iconButton', "card({ header: label({ text: 'Project' }), title: 'Website redesign', expandAction: iconButton('chevron-right', { variant: 'raised', label: 'Expand item', tooltip: 'Expand item' }) })", 'Group a resource with an optional header, body, footer, and edge action.'],
  'Toolbar': ['toolbar', "toolbar({ items: [{ label: 'Filter', icon: 'filter', variant: 'ghost' }] })", 'Group controls that act on the current view.'],
  'Message': ['message', "message({ sender: 'Jordan Lee', content: '<p>The brief is ready for review.</p>' })", 'Display a conversation message with sender information and optional actions.'],
  'Collapsible': ['collapsible', "collapsible({ trigger: 'Details', content: '<p>Additional information.</p>', open: false })", 'Show or hide supplementary content with an accessible trigger.'],
  'File card': ['fileCard', "fileCard({ name: 'motor.step', type: 'other' })", 'Display a file attachment and its available actions.'],
  'Input area': ['textarea', "textarea({ label: 'Description', placeholder: 'Add a description' })", 'Collect multiline text. Use Composer for a complete message submission interface.'],
  'Table': ['table', "table({ columns: [{ key: 'name', header: 'Name' }, { key: 'status', header: 'Status' }], rows: [{ name: 'Website redesign', status: 'Draft' }] })", 'Present structured records in rows and columns.'],
  'Toast': ['button, showToast', "button({ label: 'Show notification' })", 'Give brief feedback after an action. Notifications are created with showToast() after mounting.', "app.querySelector('button').addEventListener('click', () => showToast('Changes saved.', 'success'));"],
  'Canvas': ['canvas, card', "canvas({ content: card({ title: 'Project brief' }) })", 'Provide a pannable and zoomable workspace for application-owned content.'],
  'Modal': ['modal, button', "button({ label: 'Open dialog', attributes: 'data-open-example' }) + modal({ id: 'example-dialog', title: 'Project details', content: '<p>Review the project brief.</p>' })", 'Focus a task in a modal dialog. Open it from an explicit user action.', "app.querySelector('[data-open-example]').addEventListener('click', () => app.querySelector('dialog').showModal());"],
  'Chart': ['chart', "chart({ type: 'bar', label: 'Weekly activity', data: [{ label: 'Mon', value: 12 }, { label: 'Tue', value: 18 }], series: [{ key: 'value', label: 'Activity' }] })", 'Visualize a series with a readable label and supporting data.'],
  'Agent Run': ['agentRun', "agentRun({ title: 'Review project', state: 'completed' })", 'Show the state and progress of an agent run.'],
  'Tool Call': ['toolCall', "toolCall({ name: 'Read project', state: 'completed', output: 'Project loaded.' })", 'Show the result and state of a tool operation.'],
  'Composer': ['composer', "composer({ placeholder: 'Write a message' })", 'Compose a message with shared input and submission controls.'],
  'Scroll Area': ['scrollArea', "scrollArea({ content: '<p>Scrollable content.</p>' })", 'Constrain long content within a scrollable region.'],
  'Menu': ['menu', "menu({ ariaLabel: 'Project actions', items: [{ label: 'Edit' }, { label: 'Duplicate' }] })", 'Present a list of actions. Pair with Dropdown Menu for a complete trigger and popup.'],
  'Menu Item': ['menu', "menu({ ariaLabel: 'Project actions', items: [{ label: 'Edit', icon: 'pencil' }] })", 'Compose action rows inside a menu with optional icons, shortcuts, or selection state.'],
  'Checkbox': ['checkbox', "checkbox({ label: 'Receive project updates', name: 'updates' })", 'Choose an independent option or multiple items from a set.'],
  'Radio': ['radio', "radio({ label: 'Weekly summary', name: 'frequency', value: 'weekly' })", 'Choose one option from a group sharing the same name.'],
  'Dropdown Menu': ['dropdownMenu', "dropdownMenu({ trigger: 'Actions', items: [{ label: 'Edit' }, { label: 'Duplicate' }] })", 'Open an action menu from a button with keyboard navigation and dismissal.'],
  'Tooltip': ['tooltip, iconButton', "tooltip({ trigger: iconButton('info', { label: 'More information' }), content: 'Additional information' })", 'Show a short explanation on hover or keyboard focus. Keep essential information visible.'],
  'Banner': ['banner', "banner({ title: 'Workspace notice', description: 'Review your project settings.' })", 'Show contextual feedback within the page.'],
  'Empty State': ['emptyState', "emptyState({ title: 'No projects yet', description: 'Create a project to get started.' })", 'Explain why a region is empty and what the user can do next.'],
  'Popover': ['popover', "popover({ trigger: 'Project details', content: '<p>Additional project information.</p>' })", 'Show contextual content anchored to a trigger.'],
  'Combobox': ['combobox', "combobox({ label: 'Project', options: ['Website', 'Mobile app'] })", 'Filter and select a value from a searchable list.'],
  'Loader': ['loader', "loader({ label: 'Loading projects' })", 'Indicate an operation whose completion time is unknown.'],
  'Skeleton': ['skeleton', 'skeleton()', 'Reserve space while content is loading.'],
  'Pagination': ['pagination', 'pagination({ totalItems: 100, pageSize: 10, page: 1 })', 'Move through a paginated dataset.'],
  'Date Picker': ['datePicker', "datePicker({ label: 'Due date', name: 'dueDate' })", 'Select a date or range using an accessible calendar.'],
  'Tag Input': ['tagInput', "tagInput({ label: 'Tags', tags: ['Design'] })", 'Enter and remove a set of text values.'],
  'Command Palette': ['commandPalette, button', "button({ label: 'Open commands', attributes: 'data-open-commands' }) + commandPalette({ commands: [{ label: 'Create project' }, { label: 'Search projects' }] })", 'Search and invoke application commands.', "app.querySelector('[data-open-commands]').addEventListener('click', () => app.querySelector('dialog').showModal());"],
};

export function componentUsage(name, packageImport = false) {
  const [imports, expression, , after = ''] = componentDocs[name];
  const source = packageImport ? 'sesama-ui' : '../src/index.mjs';
  return `import { ${imports}, mount } from '${source}';\n\nconst app = document.getElementById('app');\napp.innerHTML = ${expression};\nconst session = mount(app);${after ? '\n' + after : ''}\n\n// After replacing markup: session.refresh();\n// When removing the view: session.destroy();`;
}

export function runnableComponent(name) {
  return `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>${name} example</title>\n  <link rel="stylesheet" href="../src/styles/fonts.css">\n  <link rel="stylesheet" href="../src/styles/components.css">\n</head>\n<body class="sui-root" data-sui-theme="system">\n  <div id="app"></div>\n  <script type="module">\n${componentUsage(name)}\n  </script>\n</body>\n</html>`;
}

export function renderComponentDocumentation(name, examples) {
  const [imports, , purpose] = componentDocs[name] || [];
  if (!imports || !examples.length) throw new Error(`Incomplete Component documentation: ${name}`);
  document.getElementById('title').textContent = name;
  document.getElementById('sub').textContent = purpose;
  document.getElementById('grid').innerHTML = `<article class="reading" data-component-reference="esm">
    <section><h3>When to use</h3><p>${esc(purpose)}</p></section>
    <section><h3>Usage</h3><p>Import the builder from <code>sesama-ui</code>, render its HTML inside <code>.sui-root</code>, and call <code>mount()</code> to initialize interactions.</p><pre class="imp">${esc(componentUsage(name, true))}</pre><details><summary>Show runnable HTML</summary><pre class="imp">${esc(runnableComponent(name))}</pre></details></section>
    <section><h3>Variants and states</h3><p>All previews below use the ESM component builders. Expand Rendered HTML to inspect the generated markup; use the builder API to create or update instances.</p></section>
    ${examples.map((e, i) => `<section class="variant-example" data-example-source="esm" id="example-${i}"><h3>${esc(e.name)}</h3><div class="stage">${e.html}</div><details><summary>Rendered HTML</summary><pre class="imp">${esc(e.code.replace(/></g, '>\n<'))}</pre></details></section>`).join('')}
    ${['Input', 'Input Field', 'Select', 'Combobox', 'Date Picker', 'Tag Input', 'Input area'].includes(name) ? '<section><h3>Control sizes</h3><p>Use the Input size scale: Small 26px, Base 30px, Large 34px. Available size options are <code>sm</code>, <code>base</code>, and <code>lg</code>. Multiline inputs grow with their content and row configuration.</p></section>' : ['Button', 'Button group', 'Dropdown Menu', 'Toolbar'].includes(name) ? '<section><h3>Button sizes</h3><p>Button controls use the main Button scale: XS 22px, Small 26px, Base 30px, Large 34px. Pass <code>xs</code>, <code>sm</code>, <code>base</code>, or <code>lg</code> to the button or trigger. Toolbar container spacing is separate from item sizes.</p></section>' : ''}
    ${name === 'Button' ? '<section><h3>Icon Button tooltips</h3><p>Every Icon Button includes a tooltip using its accessible label. Set <code>label</code> or <code>ariaLabel</code> to name the action; no tooltip opt-in is needed. Use <code>tooltip</code> only to override the text. After <code>mount()</code>, tooltips appear on hover and keyboard focus and dismiss with Escape or surrounding scroll. Embedded icon buttons inherit the same interaction.</p></section>' : ''}
    <section><h3>Implementation notes</h3><p>Load <code>sesama-ui/css/fonts.css</code> and <code>sesama-ui/css/components.css</code>, or the local stylesheets shown in the runnable example. Serve local modules over HTTP.</p><p>Builders return HTML strings without accessing the DOM. Call <code>session.refresh()</code> after replacing markup and <code>session.destroy()</code> when removing the view. Event handlers and application integrations belong to the consuming page; catalog demo actions illustrate local behavior.</p><p>Preserve accessible labels, keyboard interaction, focus states, and semantic tokens. Text options are escaped; HTML content slots accept trusted application markup.</p><p>See the <a href="#component-api-reference">component API reference</a> for options, events, and trusted HTML slots.</p></section>
  </article>`;
}
