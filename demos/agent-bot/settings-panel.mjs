import { pageHeader, inputField, textarea, select, listRow, iconButton, button, collapsible, switchControl, runeIcon, escapeHTML as esc } from '../../src/index.mjs';

export function agentSettingsPanel(agent, avatarHTML, models) {
  const row = (title, icon, trailing) => listRow({ appearance: 'plain', title, leading: runeIcon(icon, 16), trailing: '<div class="bot-setting-control">' + trailing + '</div>' });
  const choice = (name, value, values) => select({ name, ariaLabel: name.replaceAll('-', ' '), inline: true, value, options: values.map(value => ({ value, label: value })) });
  const link = (title, icon, value = '') => listRow({ variant: 'navigation', appearance: 'plain', title, leading: runeIcon(icon, 16), trailing: '<span class="bot-setting-value">' + esc(value) + '</span>' + runeIcon('chevron-right', 14), href: '#agent-setting', attributes: 'data-agent-setting="' + esc(title) + '"' });
  const section = (title, content) => '<section class="bot-settings-group"><h3 class="bot-muted">' + esc(title) + '</h3>' + content + '</section>';
  return '<div class="bot-settings-panel">' + pageHeader({ title: 'Agent settings', icon: '', actions: iconButton('x', { label: 'Close agent settings', attributes: 'id="bot-close-settings"' }) }) +
    '<div class="bot-settings-content sx-scroll-area"><form id="bot-panel-form" class="bot-stack">' +
    '<div class="bot-settings-avatar">' + avatarHTML + '</div>' +
    inputField({ name: 'agent-name', label: 'Name', value: agent.name, required: true }) +
    inputField({ name: 'agent-role', label: 'Title', value: agent.role, required: true }) +
    textarea({ name: 'agent-description', label: 'Description', value: agent.description || '', placeholder: 'What does this agent help with?', rows: 2 }) +
    section('Brain', row('Model', 'sparkles', choice('agent-model', agent.model, models)) +
      row('Reasoning', 'sparkles', choice('agent-reasoning', agent.reasoning || 'High', ['Low', 'Medium', 'High'])) +
      row('Backup models', 'layers-2', choice('agent-backup', agent.backup || 'Ask first', ['Ask first', 'Automatic', 'Off'])) +
      link('Provider settings', 'settings') +
      row('Compact replies', 'file-text', switchControl({ name: 'agent-compact', ariaLabel: 'Compact replies', checked: !!agent.compact })) +
      row('Reply format', 'file-text', choice('agent-format', agent.format || 'Automatic', ['Automatic', 'Markdown', 'Plain text']))) +
    section('Knows', collapsible({ trigger: 'Instructions', content: textarea({ name: 'agent-instructions', ariaLabel: 'Instructions', label: 'Instructions', value: agent.instructions, rows: 5, required: true }) }) +
      link('Memories', 'sparkles', '0 saved') + link('Skills', 'sparkles', '0 assigned') + link('Files', 'file-text', '0 B') + link('Tables', 'grid-2x2', '6 tables')) +
    section('Does', link('Routines', 'clock', '0 configured') + link('Usage', 'chart-bar') + link('Publish agent', 'share-2')) +
    section('Rules', link('Permissions', 'shield', 'Full access') + link('Folders', 'folder-closed', 'All files') + link('Advanced', 'sliders-horizontal')) +
    section('Notifications', row('Notify me', 'bell', choice('agent-notifications', agent.notifications || 'All activity', ['All activity', 'Mentions only', 'Nothing'])) + '<p class="bot-muted">Demo preferences are saved locally. Responses and integrations are simulated.</p>') +
    '</form></div><div class="bot-settings-footer">' + button({ label: 'Cancel', attributes: 'id="bot-cancel-settings"' }) + button({ label: 'Save changes', variant: 'primary', type: 'submit', attributes: 'form="bot-panel-form"' }) + '</div></div>';
}
