import * as UI from '../src/index.mjs';

const factories = {
  'Button': surface => UI.button({ label: 'Create project', surface }),
  'Icon Button': surface => UI.iconButton('plus', { variant: 'raised', surface, label: 'Add item' }),
  'Input': surface => UI.input({ ariaLabel: 'Project name', placeholder: 'Website refresh', surface }),
  'Input Field': surface => UI.inputField({ label: 'Project name', placeholder: 'Website refresh', surface }),
  'Select': surface => UI.select({ label: 'Team', options: ['Design', 'Engineering'], value: 'Design', surface }),
  'Input area': surface => UI.textarea({ label: 'Description', placeholder: 'Share some context…', surface }),
  'Card': surface => UI.card({ title: 'Project overview', description: 'A shared surface for your content.', surface }),
  'Composer': surface => UI.composer({ placeholder: 'Ask a question or assign a task…', surface }),
  'Avatar': surface => UI.avatar({ name: 'Amelia Park', size: 40, surface }),
  'Badge': surface => UI.badge({ label: 'In progress', surface }),
  'Chip': surface => UI.chip({ label: 'Design', surface }),
  'Checkbox': surface => UI.checkbox({ label: 'Keep me updated', surface }),
  'Radio': surface => UI.radio({ label: 'Design team', name: 'surface-radio-' + surface, surface }),
  'Switch': surface => UI.switchControl({ label: 'Notifications', surface }),
  'List row': surface => UI.listRow({ title: 'Website refresh', description: 'Updated just now', leading: 'folder', surface }),
  'Combobox': surface => UI.combobox({ label: 'Project', options: ['Website', 'Mobile app'], surface }),
  'Date Picker': surface => UI.datePicker({ label: 'Due date', surface }),
  'Tag Input': surface => UI.tagInput({ label: 'Labels', tags: ['Design'], surface }),
  'Banner': surface => UI.banner({ title: 'Ready for review', description: 'Your changes have been saved.', surface }),
  'File card': surface => UI.fileCard({ name: 'Project brief.pdf', type: 'other', surface }),
  'Tool Call': surface => UI.toolCall({ name: 'Read project brief', state: 'completed', surface }),
  'Agent Run': surface => UI.agentRun({ title: 'Review project scope', state: 'completed', surface }),
  'Message': surface => UI.message({ role: 'user', own: true, content: 'Help me plan our next launch.', surface }),
  'Popover': surface => UI.popover({ trigger: 'Open ' + surface + ' panel', content: '<div class="sx-pop-content">A shared contextual surface.</div>', surface }),
  'Dropdown Menu': surface => UI.dropdownMenu({ trigger: surface + ' actions', items: [{ label: 'Edit', icon: 'pencil' }, { label: 'Duplicate', icon: 'copy' }], surface }),
  'Tooltip': surface => UI.tooltip({ content: 'A shared tooltip surface', surface }),
  'Modal': surface => {
    const id = UI.uid();
    return UI.button({ label: 'Open ' + surface + ' dialog', attributes: `data-canonical-open="${id}"` }) + UI.modal({ id, title: 'Project details', content: '<p>Review the project before continuing.</p>', surface });
  },
  'Table': surface => UI.table({ columns: [{ key: 'name', header: 'Project' }, { key: 'status', header: 'Status' }], rows: [{ id: 1, name: 'Website', status: 'Active' }], surface })
};

export function surfaceExamples(name) {
  const factory = factories[name];
  if (!factory) return [];
  return [{
    name: 'Surface · Solid / Blur',
    html: `<div class="sui-root surface-comparison" data-surface-comparison="${UI.escapeHTML(name)}">${['solid', 'blur'].map(surface =>
      `<section class="surface-comparison-stage"><span class="surface-comparison-label">${surface === 'solid' ? 'Solid' : 'Blur'}</span>${factory(surface)}</section>`).join('')}</div>`,
    code: `// Use on any builder with a visual surface.\n// The existing component variant and tone are preserved.\ncomposer({ surface: 'solid' });\ncomposer({ surface: 'blur' });\n// Shared tokens: --surface-opacity, --surface-blur, --surface-saturation`
  }];
}
