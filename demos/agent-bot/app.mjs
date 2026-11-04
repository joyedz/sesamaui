import { agentSettingsPanel } from './settings-panel.mjs';
import { renderMessageContent } from './responses.mjs';
import {
  appShell, initAppShell, workspaceSidebar, tree, pageHeader, pageLayout,
  button, iconButton, avatar, card, inputField, textarea, select, listRow, popover, tabs, runeIcon,
  message, composer, initComposer, agentRun, fileCard, emptyState,
  menu, initMenu, modal, initModal, mount, escapeHTML as esc, showToast
} from '../../src/index.mjs';
import { readState, writeState } from '../shared/state.mjs';
import { models, recoverState, responseFor, recoverable, active, brief } from './model.mjs';

// Reset on the next page load, after the previous page has saved its state.
const demoURL = new URL(location.href);
if (demoURL.searchParams.get('reset') === '1') {
  try { localStorage.removeItem('sesama:demo:v1:agent-bot'); } catch { /* Storage may be unavailable. */ }
  demoURL.searchParams.delete('reset');
  demoURL.hash = '#chat/atlas/main-atlas';
  history.replaceState(null, '', demoURL);
}
const state = recoverState(readState('agent-bot', null));
const timers = new Map();
const id = prefix => prefix + '-' + crypto.randomUUID();
const agentById = key => state.agents.find(agent => agent.id === key) || state.agents[0];
const threadById = key => state.threads.find(thread => thread.id === key);
const agentImages = { atlas: '/assets/agent-bot/atlas-v1.png', forge: '/assets/agent-bot/forge-v1.png', scout: '/assets/agent-bot/scout-v1.png' };
const agentAvatar = (agent, size) => '<span class="bot-avatar">' + avatar({ name: agent.name, initials: agent.name.slice(0, 1), image: agentImages[agent.id], size }) + '</span>';

const save = () => writeState('agent-bot', state);
const action = (key, label, variant = 'secondary', size = 'sm') => button({ id: key, label, variant, size });
const options = models.map(value => ({ value, label: value + ' · demo' }));
const statusLabel = value => ({ completed: 'Completed', approval: 'Needs approval', interrupted: 'Interrupted', cancelled: 'Stopped' })[value] || value[0].toUpperCase() + value.slice(1);
const theme = state.theme || 'dark';
document.documentElement.dataset.suiTheme = theme;
document.documentElement.dataset.mode = theme;
document.body.dataset.suiTheme = theme;

function railButton(key, icon, label) {
  return iconButton(icon, { label, variant: 'ghost', size: 'lg', tooltipPlacement: 'right', attributes: `data-bot-nav="${key}" data-tree-key="bot-${key}"` });
}
function exampleRailButton(icon, label) {
  return iconButton(icon, { label, variant: 'ghost', size: 'lg', tooltipPlacement: 'right', attributes: 'data-demo-placeholder' });
}
function navigation() {
  return workspaceSidebar({ id: 'bot-compact-sidebar', variant: 'compact',
    navigation: '<div class="bot-rail-top">' +
      railButton('chat', 'sparkles', 'Agent chat') +
      exampleRailButton('share-2', 'Workflows') +
      exampleRailButton(runeIcon('clipboard-list', 18), 'Tasks') +
      exampleRailButton(runeIcon('chart-area', 18), 'Usage') +
      exampleRailButton('ellipsis-horizontal', 'More') + '</div>',
    profile: exampleRailButton(runeIcon('shopping-bag', 18), 'Marketplace') +
      exampleRailButton(runeIcon('circle-question-mark', 18), 'Help') +
      iconButton('sun', { label: 'Toggle theme', size: 'lg', tooltipPlacement: 'right', attributes: 'data-shell-theme' }) + railButton('settings', 'settings', 'Agent settings')
  });
}
function agentRows(agents) {
  return agents.map(agent => {
    const thread = state.threads.find(t => t.agentId === agent.id);
    const latest = [...thread.messages].reverse().find(m => m.role === 'agent');
    return listRow({ variant: 'navigation', appearance: 'plain', title: agent.name, titleBadge: agent.role,
      description: latest?.text.split('\n')[0] || agent.role,
      leading: agentAvatar(agent, 56),
      trailing: '', href: '#chat/' + agent.id + '/' + thread.id,
      attributes: `role="treeitem" data-bot-agent="${agent.id}" data-tree-key="bot-agent-${agent.id}"`
    });
  }).join('');
}
function agentNavigation() {
  return ['Launch', 'Research'].map(label => {
    const key = label.toLowerCase();
    return '<section class="bot-agent-group">' + tree({ ariaLabel: label + ' agents', items: [{
      id: 'bot-group-' + key, label, icon: 'folder', layout: 'section',
      expanded: state.agentGroups?.[key] !== false,
      content: '<div class="bot-agent-list">' + agentRows(state.agents.filter(agent => key === 'research' ? agent.id === 'scout' : agent.id !== 'scout')) + '</div>',
      attributes: 'role="treeitem"'
    }] }) + '</section>';
  }).join('');
}

document.getElementById('bot-app').innerHTML = appShell({
  id: 'bot-shell', collapsed: state.collapsed, rail: navigation(),
  sidebar: workspaceSidebar({ id: 'bot-sidebar', variant: 'conversation', workspace: 'Agent Bot',
    headerAction: iconButton('plus', { label: 'Add agent', attributes: 'data-sidebar-header-action id="bot-add-agent"' }),
    workspaceSelector: select({ name: 'workspace', ariaLabel: 'Workspace', inline: true, size: 'lg', icon: 'folder', value: state.workspace || 'Sesama workspace', groups: [{ label: 'Your workspaces', options: [{ label: 'Sesama workspace', icon: 'folder' }, { label: 'Personal workspace', icon: 'circle-user' }, { label: 'Design team', icon: 'users' }] }] }),
    navigation: inputField({ name: 'bot-search', type: 'search', ariaLabel: 'Search agents', placeholder: 'Search', icon: 'search' }),
    projectsTitle: '', projects: '<div id="bot-agent-nav">' + agentNavigation() + '</div>',
    projectActions: '', profile: '<footer class="bot-sidebar-footer"><span class="bot-muted">3 agents · Local workspace</span></footer>'
  }), header: '<div id="bot-header"></div>', content: '<div id="bot-view"></div>',
  footer: '<div class="bot-compose" id="bot-compose"></div>'
});
const shell = document.getElementById('bot-shell');
const addAgentHost = document.createElement('div');
addAgentHost.innerHTML = modal({ id: 'bot-add-agent-dialog', title: 'Add agent', description: 'Try adding an agent to this demo workspace.', content: '<form id="bot-add-agent-form" class="bot-stack">' + inputField({ name: 'name', label: 'Agent name', required: true, attributes: 'maxlength="80"' }) + inputField({ name: 'role', label: 'Agent role', required: true }) + textarea({ name: 'instructions', label: 'Agent instructions', rows: 3, required: true }) + select({ name: 'model', label: 'Model', value: models[0], options }) + button({ label: 'Add agent', variant: 'primary', type: 'submit' }) + '</form>' });
document.body.append(addAgentHost);
mount(addAgentHost);
const addAgentDialog = initModal(document.getElementById('bot-add-agent-dialog'));
addAgentHost.addEventListener('submit', event => {
  if (event.target.id !== 'bot-add-agent-form') return;
  event.preventDefault();
  const data = new FormData(event.target);
  const name = String(data.get('name') || '').trim();
  const role = String(data.get('role') || '').trim();
  const instructions = String(data.get('instructions') || '').trim();
  if (!name || !role || !instructions) return;
  addAgentDialog.close();
  event.target.reset();
  showToast('Success add agent', 'success');
});

function ignoreExampleNavigation(event) {
  if (!event.target.closest('[data-demo-placeholder]')) return;
  if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
  event.preventDefault(); event.stopPropagation();
}
shell.addEventListener('click', ignoreExampleNavigation, true);
shell.addEventListener('click', event => {
  const item = event.target.closest('[data-agent-setting]');
  if (!item) return;
  event.preventDefault();
  showToast(item.dataset.agentSetting + ' � simulated demo.', 'informative');
});
shell.addEventListener('keydown', ignoreExampleNavigation, true);
shell.addEventListener('keydown', event => {
  if (event.key === 'Escape' && shell.querySelector('[data-shell-detail]')) { closeAgentPanel(true, false); event.stopPropagation(); return; }
  if (event.key === 'Escape' && innerWidth <= 760 && !shell.classList.contains('is-collapsed')) {
    initAppShell(shell).setCollapsed(true);
    header.querySelector('[data-shell-toggle]')?.focus();
  }
});

const view = document.getElementById('bot-view');
const header = document.getElementById('bot-header');
const composeSlot = document.getElementById('bot-compose');
const scroller = shell.querySelector('.sb-page-scroll');
function updateScrollFade() {
  const chat = current?.page === 'chat';
  scroller.classList.toggle('bot-chat-scroll', chat);
  scroller.classList.toggle('has-scroll-above', chat && scroller.scrollTop > 2);
  scroller.classList.toggle('has-scroll-below', chat && scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop > 2);
}
let session = mount(shell);
initAppShell(shell).setCollapsed(shell.classList.contains('is-collapsed'));
let current = null;
let composerControl = null;
let settingsAgentId = null;
let settingsTrigger = null;
let settingsPanelVersion = 0;
const agentMenuHost = document.createElement('div');
agentMenuHost.innerHTML = menu({ id: 'bot-agent-context-menu', ariaLabel: 'Agent actions', attributes: 'popover="auto"', items: [
  { id: 'context-agent-settings', label: 'Agent settings', icon: 'settings' },
  { type: 'separator' },
  { id: 'context-delete-agent', label: 'Delete agent', icon: 'trash', danger: true }
] });
document.body.append(agentMenuHost);
const agentContextMenu = document.getElementById('bot-agent-context-menu');
const agentMenuControl = initMenu(agentContextMenu);
let contextAgentRow = null;
function showAgentMenu(event, row, keyboard = false) {
  event.preventDefault();
  contextAgentRow = row;
  const bounds = row.getBoundingClientRect();
  agentContextMenu.showPopover();
  const x = keyboard ? bounds.left : event.clientX;
  const y = keyboard ? bounds.bottom : event.clientY;
  agentContextMenu.style.left = Math.max(8, Math.min(x, innerWidth - agentContextMenu.offsetWidth - 8)) + 'px';
  agentContextMenu.style.top = Math.max(8, Math.min(y, innerHeight - agentContextMenu.offsetHeight - 8)) + 'px';
  agentMenuControl.focusFirst();
}
shell.addEventListener('contextmenu', event => {
  const row = event.target.closest('[data-bot-agent]');
  if (row) showAgentMenu(event, row);
});
shell.addEventListener('keydown', event => {
  const row = event.target.closest('[data-bot-agent]');
  if (row && (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10'))) showAgentMenu(event, row, true);
});
agentContextMenu.addEventListener('sui:menu:close', event => {
  agentContextMenu.hidePopover();
  if (event.detail.key === 'Escape') contextAgentRow?.focus();
});
agentContextMenu.addEventListener('sui:menu:select', event => {
  const row = contextAgentRow;
  const agent = state.agents.find(item => item.id === row?.dataset.botAgent);
  agentContextMenu.hidePopover();
  if (!agent) return;
  if (event.detail.id === 'context-agent-settings') openAgentPanel(row, false, agent);
  if (event.detail.id === 'context-delete-agent') {
    showToast('Success delete agent', 'success');
    row?.focus();
  }
});

function closeAgentPanel(restoreFocus = true, animate = restoreFocus) {
  const panel = shell.querySelector('[data-shell-detail]');
  if (!panel) return;
  const version = ++settingsPanelVersion;
  settingsAgentId = null;
  const complete = () => {
    if (version !== settingsPanelVersion) return;
    const editButton = header.querySelector('#bot-edit-agent');
    if (editButton) editButton.disabled = false;
    session.refresh();
    if (restoreFocus && settingsTrigger?.isConnected) settingsTrigger.focus({ preventScroll: true });
    updateScrollFade();
  };
  const result = initAppShell(shell).setDetail('', { animate });
  if (result) result.then(complete); else complete();
}
function openAgentPanel(trigger, animate = true, agent = current.agent) {
  closeAgentPanel(false);
  settingsPanelVersion++;
  settingsTrigger = trigger;
  settingsAgentId = agent.id;
  const editButton = header.querySelector('#bot-edit-agent');
  if (editButton) editButton.disabled = true;
  initAppShell(shell).setDetail(agentSettingsPanel(agent, agentAvatar(agent, 100), models), { animate });
  const panel = shell.querySelector('[data-shell-detail]');
  panel.setAttribute('role', 'region'); panel.setAttribute('aria-label', 'Agent settings');
  session.refresh();
  const heading = panel.querySelector('h1,h2');
  heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true });
}
function savePanelAgent(form) {
  if (!form.reportValidity()) return;
  const data = new FormData(form), agent = agentById(settingsAgentId);
  const name = String(data.get('agent-name') || '').trim();
  const role = String(data.get('agent-role') || '').trim();
  const instructions = String(data.get('agent-instructions') || '').trim();
  if (!name || !role || !instructions) { showToast('Fill in name, title, and instructions.', 'informative'); return; }
  Object.assign(agent, { name: name.slice(0, 80), role: role.slice(0, 100), instructions: instructions.slice(0, 4000), description: String(data.get('agent-description') || '').slice(0, 1000), model: data.get('agent-model'), reasoning: data.get('agent-reasoning'), backup: data.get('agent-backup'), format: data.get('agent-format'), compact: data.has('agent-compact'), notifications: data.get('agent-notifications') });
  closeAgentPanel(false);
  document.getElementById('bot-agent-nav').innerHTML = agentNavigation();
  save(); render(false, true); showToast('Agent settings saved.', 'success');
  header.querySelector('#bot-edit-agent')?.focus({ preventScroll: true });
}


function route() {
  const parts = location.hash.slice(1).split('/');
  const page = ['chat', 'settings'].includes(parts[0]) ? parts[0] : 'chat';
  const agent = agentById(parts[0] === 'tasks' ? state.lastAgent : parts[1]);
  const thread = page === 'chat' && parts[0] !== 'tasks' ? threadById(parts[2]) : null;
  if (parts[0] === 'tasks') history.replaceState(null, '', '#chat/' + agent.id + '/' + state.threads.find(t => t.agentId === agent.id).id);
  return { page, agent: thread ? agentById(thread.agentId) : agent,
    thread: thread || state.threads.find(t => t.agentId === agent.id) };
}
function rememberPosition() {
  if (current?.page === 'chat' && current.thread) current.thread.scroll = scroller.scrollTop;
}
function go(hash) {
  rememberPosition();
  if (location.hash !== hash) history.pushState(null, '', hash);
  render(true);
}
function announce(text) { document.getElementById('bot-status').textContent = text; }
function setNavigation() {
  shell.querySelectorAll('[data-tree-key]').forEach(node => {
    const key = node.dataset.treeKey;
    const selected = key === 'bot-' + current.page || (current.page === 'chat' && key === 'bot-agent-' + current.agent.id);
    node.classList.toggle('on', selected);
    node.dataset.active = String(selected);
    if (node.hasAttribute('data-bot-nav')) node.setAttribute('aria-pressed', String(selected));
    if (selected) node.setAttribute('aria-current', 'page'); else node.removeAttribute('aria-current');
  });
}
function titleActions() {
  return '<div class="bot-model-picker">' + select({ name: 'bot-header-model', ariaLabel: 'Choose model', inline: true, value: current.agent.model, options }) + '</div>' + iconButton('settings', { label: 'Edit agent settings', attributes: 'id="bot-edit-agent"' });
}
function runsFor(thread) { return state.runs.filter(run => run.threadId === thread.id); }
function attachmentMarkup(run) {
  if (!run?.artifact || run.state !== 'completed') return '';
  return '<div class="bot-output">' + fileCard({ id: 'file-' + run.id, name: 'competitor-brief.md', variant: 'attachment', type: 'document', size: '1 KB',
    preview: '<pre class="bot-preview">' + esc(brief) + '</pre>', actions: iconButton(runeIcon('arrow-down-to-line', 16), { label: 'Download brief', attributes: 'id="download-' + run.id + '"' }) + iconButton('arrow-up-right', { label: 'Open competitor-brief.md', attributes: 'id="open-file-' + run.id + '"' }) }) + '</div>';
}
function runMarkup(run, resultHTML = '') {
  const running = active.includes(run.state);
  const stepState = running ? 'running' : run.state === 'completed' || run.state === 'approval' ? 'completed' : run.state === 'failed' ? 'failed' : 'cancelled';
  const progress = ['Reviewing the request', 'Preparing the sample result', 'Checking the next steps'];
  let html = agentRun({ id: 'trace-' + run.id, title: running ? progress[run.stage || 0] : 'Response details', state: stepState, open: false,
    steps: run.steps || [{ type: 'thinking', title: 'Working guidance', detail: run.instructions || agentById(threadById(run.threadId).agentId).instructions, state: 'completed' }, ...progress.map((title, index) => ({ type: 'progress', title,
      state: running ? index < run.stage ? 'completed' : index === run.stage ? 'running' : 'queued' : stepState }))]
  });
  html += resultHTML;
  if (recoverable.includes(run.state)) html += '<div class="bot-row">' + action('retry-' + run.id, 'Retry response') + '<p class="bot-muted">' + esc(run.error || 'Work stopped before a result was saved.') + '</p></div>';
  if (running) html += '<div>' + action('stop-' + run.id, 'Stop work') + '</div>';
  if (run.state === 'approval') html += '<div class="bot-row">' + action('approve-' + run.id, 'Approve sample change', 'primary') + action('decline-' + run.id, 'Decline') + '</div>';
  if (!resultHTML) html += attachmentMarkup(run);
  return '<div class="bot-stack" data-run-id="' + esc(run.id) + '">' + html + '</div>';
}
function threadMarkup(thread) {
  const runs = runsFor(thread);
  const latestAgentMessage = [...thread.messages].reverse().find(item => item.role === 'agent');
  const renderMessage = item => message({ id: item.id, role: item.role, own: item.role === 'user', appearance: 'bubble',
    content: renderMessageContent(item), attachments: attachmentMarkup(runs.find(run => run.resultMessageId === item.id)),
    attributes: { 'data-message-latest': String(item.id === latestAgentMessage?.id) },
    actions: item.role === 'user' ? [{ label: 'Copy message', action: 'copy', icon: 'copy' }] : [
      { label: 'Copy response', action: 'copy', icon: 'copy' },
      { label: 'Regenerate response', action: 'regenerate', icon: 'refresh-cw' },
      { label: 'Helpful response', action: 'helpful', icon: 'thumbs-up' }
    ] });
  let html = '';
  for (let index = 0; index < thread.messages.length; index++) {
    const item = thread.messages[index];
    html += renderMessage(item);
    const run = runs.find(run => run.userMessageId === item.id);
    if (!run) continue;
    let responses = '';
    while (thread.messages[index + 1]?.role === 'agent') responses += renderMessage(thread.messages[++index]);
    html += '<div class="bot-agent-turn">' + runMarkup(run, responses) + '</div>';
  }
  return html;
}
function renderChat() {
  const { agent, thread } = current;
  const running = runsFor(thread).find(run => active.includes(run.state));
  state.openThreads = [...new Set([...(state.openThreads || []), thread.id])];
  const openThreads = state.openThreads.map(threadById).filter(item => item?.agentId === agent.id);
  const tabBar = tabs({ id: 'bot-chat-tabs', ariaLabel: 'Open chats', variant: 'pill', panelId: 'bot-view', activeTabId: thread.id,
    tabs: openThreads.map(item => ({ id: item.id, label: item.id.startsWith('main-') ? agent.name : item.title === 'New conversation' ? 'New chat' : item.title, leading: item.id.startsWith('main-') ? agentAvatar(agent, 18) : '', icon: item.id.startsWith('main-') ? '' : 'fork' })) });
  header.innerHTML = pageHeader({ title: agent.name, icon: '', titleContent: '<h1 class="sui-sr-only">' + esc(agent.name) + '</h1><div class="bot-tab-bar"><div class="bot-header-tabs">' + tabBar + '</div>' + iconButton('plus', { label: 'New thread', attributes: 'id="bot-new-thread"' }) + '</div>', actions: titleActions() });
  view.setAttribute('role', 'tabpanel');
  view.setAttribute('aria-labelledby', 'bot-chat-tabs-tab-' + thread.id);
  view.innerHTML = pageLayout({ variant: 'conversation', classes: 'bot-conversation-layout', content: '<div class="bot-stack"><p class="bot-date">Today</p>' +
    '<div class="bot-thread" id="bot-thread" role="log" aria-live="off" aria-label="Conversation messages">' + threadMarkup(thread) + '</div></div>' });
  composeSlot.innerHTML = composer({ id: 'bot-composer', placeholder: 'Message ' + agent.name + '…', value: thread.draft,
    compact: true, showMic: false, showAttach: false, showContext: false, showModel: false,
    leading: popover({ id: 'bot-prompt-menu', ariaLabel: 'Prompt suggestions', trigger: iconButton('plus', { label: 'Choose a prompt', attributes: 'data-sui-popover-trigger popovertarget="bot-prompt-menu" aria-haspopup="dialog" aria-expanded="false"' }), content: '<div class="bot-stack">' + action('prompt-priorities', 'Today’s priorities', 'ghost') + action('prompt-research', 'Compare competitor pricing', 'ghost') + action('prompt-change', 'Prepare pricing update', 'ghost') + '</div>' }),
    state: running ? 'thinking' : thread.draft ? 'ready' : 'empty' });
  const field = composeSlot.querySelector('textarea');
  field.setAttribute('aria-label', 'Message ' + agent.name);
}
function renderSettings() {
  const agent = current.agent;
  header.innerHTML = pageHeader({ title: 'Agent settings', description: 'Shape how your sample agent works.', icon: 'settings', actions: action('bot-back-chat', 'Open chat') });
  view.innerHTML = pageLayout({ content: '<div class="bot-stack bot-form">' + select({ name: 'bot-settings-agent', label: 'Agent', value: agent.id, options: state.agents.map(a => ({ value: a.id, label: a.name })) }) +
    card({ header: '<div class="bot-agent-identity">' + agentAvatar(agent, 64) + '<div><strong>' + esc(agent.name) + '</strong><p class="bot-muted">' + esc(agent.role) + '</p></div></div>', title: 'Identity & behavior', description: 'Saved locally for this demo. Model choices are simulation presets.', content: '<form id="bot-settings-form" class="bot-stack">' +
      inputField({ name: 'agent-name', id: 'bot-name', label: 'Name', value: agent.name, required: true }) +
      inputField({ name: 'agent-role', id: 'bot-role', label: 'Role', value: agent.role, required: true }) +
      textarea({ name: 'agent-instructions', label: 'Instructions', value: agent.instructions, rows: 5, required: true }) +
      select({ name: 'agent-model', label: 'Model preset', value: agent.model, options }) +
      '<div class="bot-row">' + action('bot-save-agent', 'Save changes', 'primary') + '</div></form>' }) + '</div>' });
}
function render(focus = false, keepScroll = false) {
  const previousScroll = scroller.scrollTop;
  closeAgentPanel(false);
  composerControl?.destroy(); composerControl = null;
  current = route();
  state.route = location.hash;
  state.lastAgent = current.agent.id;
  composeSlot.parentElement.hidden = current.page !== 'chat';
  view.removeAttribute('role'); view.removeAttribute('aria-labelledby');
  if (current.page === 'chat') renderChat();
  else { composeSlot.innerHTML = ''; renderSettings(); }
  header.querySelector('header')?.insertAdjacentHTML('afterbegin', '<div class="bot-team-toggle">' + iconButton('panel-left', { label: shell.classList.contains('is-collapsed') ? 'Show bot panel' : 'Hide bot panel', attributes: 'data-shell-toggle data-shell-show-label="Show bot panel" data-shell-hide-label="Hide bot panel"' }) + '</div>');
  session.refresh();
  if (current.page === 'chat') composerControl = initComposer(document.getElementById('bot-composer'));
  setNavigation(); save();
  if (current.page === 'chat') header.querySelector('[role="tab"][aria-selected="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  if (keepScroll) scroller.scrollTop = previousScroll;
  else scroller.scrollTop = current.page === 'chat' ? current.thread.scroll ?? scroller.scrollHeight : 0;
  updateScrollFade();
  if (focus) {
    const heading = header.querySelector('h1, h2');
    heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true });
  }
}
function newThread(agent, title = 'New conversation') {
  const thread = { id: id('thread'), agentId: agent.id, title, messages: [], draft: '', scroll: null };
  state.threads.push(thread); save(); return thread;
}
function updateVisible(run) {
  if (current.page === 'chat' && current.thread.id === run.threadId) {
    const nearBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 100;
    document.getElementById('bot-thread').innerHTML = threadMarkup(current.thread);
    session.refresh();
    composerControl?.setState(active.includes(run.state) ? 'thinking' : current.thread.draft ? 'ready' : 'empty');
    if (nearBottom) scroller.scrollTop = scroller.scrollHeight;
  }
}
function stopTimer(run) { clearTimeout(timers.get(run.id)); timers.delete(run.id); }
function advance(run) {
  if (!active.includes(run.state)) return;
  run.state = 'running'; run.stage = Math.min((run.stage ?? -1) + 1, 2); save(); updateVisible(run);
  timers.set(run.id, setTimeout(() => {
    if (run.stage < 2) { advance(run); return; }
    const thread = threadById(run.threadId);
    const agent = agentById(thread.agentId);
    const result = responseFor(agent, run.prompt, run.attempt > 0);
    run.state = result.state; run.artifact = !!result.artifact; stopTimer(run);
    if (result.state === 'failed') run.error = result.text;
    else {
      const msg = { id: id('message'), role: 'agent', text: result.text, ...(result.blocks ? { blocks: result.blocks } : {}) };
      thread.messages.push(msg); run.resultMessageId = msg.id;
    }
    save(); updateVisible(run); announce(agent.name + ': ' + statusLabel(run.state));
  }, run.model === 'Fast' ? 350 : run.model === 'Thorough' ? 850 : 650));
}
function startRun(thread, prompt) {
  if (runsFor(thread).some(run => active.includes(run.state) || run.state === 'approval')) { showToast('Finish or review the current request first.', 'informative'); return; }
  const user = { id: id('message'), role: 'user', text: prompt };
  thread.messages.push(user); thread.draft = ''; thread.scroll = null;
  if (thread.title === 'New conversation') thread.title = prompt.slice(0, 70);
  const run = { id: id('run'), threadId: thread.id, userMessageId: user.id, prompt, model: agentById(thread.agentId).model, instructions: agentById(thread.agentId).instructions, state: 'queued', stage: -1, attempt: 0 };
  state.runs.push(run);
  save(); advance(run); return run;
}
function settleApproval(run, approved) {
  if (run.state !== 'approval') return;
  run.state = approved ? 'completed' : 'declined';
  const thread = threadById(run.threadId);
  const result = { id: id('message'), role: 'agent', text: approved ? 'Approved. The demo plan now uses $22 per seat / month. The sample pricing examples are consistent. No external files or services were modified.' : 'The sample change was declined. The demo plan stays unchanged.' };
  if (approved) state.samplePrice = 22;
  thread.messages.push(result); run.resultMessageId = result.id;
  save(); render(); announce(approved ? 'Sample change approved.' : 'Sample change declined.');
}
shell.addEventListener('sui:message:action', event => {
  if (current.page !== 'chat') return;
  const { action, id: messageId } = event.detail;
  const thread = current.thread;
  const index = thread.messages.findIndex(item => item.id === messageId);
  if (index < 0) return;
  if (action === 'helpful') {
    thread.messages[index].helpful = !thread.messages[index].helpful;
    save();
    const button = event.target.querySelector('[data-message-action="helpful"]');
    button?.setAttribute('aria-pressed', String(thread.messages[index].helpful));
    showToast(thread.messages[index].helpful ? 'Feedback saved for this demo.' : 'Feedback removed.', 'informative');
  }
  if (action === 'regenerate') {
    const request = thread.messages.slice(0, index).reverse().find(item => item.role === 'user');
    if (request && startRun(thread, request.text)) render();
  }
});
shell.addEventListener('sui:composer:send', event => {
  if (current.page !== 'chat') return;
  const text = event.detail.text.trim();
  if (!text) return;
  // The central controller finishes clearing the original field before rendering its replacement.
  const thread = current.thread;
  queueMicrotask(() => { if (!startRun(thread, text)) thread.draft = text; render(); scroller.scrollTop = scroller.scrollHeight; composerControl?.focus(); });
});
shell.addEventListener('sui:composer:stop', () => {
  const run = runsFor(current.thread).find(r => active.includes(r.state));
  if (!run) return;
  stopTimer(run); run.state = 'cancelled'; save(); render(); announce('Response stopped.');
});
shell.addEventListener('input', event => {
  if (event.target.name === 'bot-search') {
    const query = event.target.value.toLowerCase();
    shell.querySelectorAll('[data-bot-agent]').forEach(row => { row.hidden = !row.textContent.toLowerCase().includes(query); });
  }
  if (event.target.matches('#bot-composer textarea')) { current.thread.draft = event.target.value; save(); }
});
function choose(name, value, source) {
  if (name === 'workspace') { state.workspace = value; save(); }
  if (name === 'bot-thread') go('#chat/' + threadById(value).agentId + '/' + value);
  if (name === 'bot-settings-agent') go('#settings/' + value);
  if (name === 'bot-header-model' || (source.closest('#bot-composer') && name === 'model')) { current.agent.model = value; save(); }
}
shell.addEventListener('change', event => choose(event.target.name, event.target.value, event.target));
shell.addEventListener('sui:change', event => choose(event.detail.name, event.detail.value, event.target));
shell.addEventListener('sui:shell:toggle', event => { state.collapsed = event.detail.collapsed; save(); });
shell.addEventListener('sui:shell:theme', event => { document.body.dataset.suiTheme = event.detail.theme; state.theme = event.detail.theme; save(); });
shell.addEventListener('submit', event => {
  if (event.target.id === 'bot-panel-form') { event.preventDefault(); savePanelAgent(event.target); }
  if (event.target.id === 'bot-settings-form') { event.preventDefault(); saveAgent(event.target); }
});
function saveAgent(form) {
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get('agent-name')).trim(), role = String(data.get('agent-role')).trim(), instructions = String(data.get('agent-instructions')).trim();
  if (!name || !role || !instructions) { showToast('Fill in name, role, and instructions.', 'informative'); return; }
  Object.assign(current.agent, { name: name.slice(0, 80), role: role.slice(0, 100), instructions: instructions.slice(0, 4000), model: data.get('agent-model') });
  document.getElementById('bot-agent-nav').innerHTML = agentNavigation();
  save(); render(); showToast('Agent settings saved.', 'success');
}
shell.addEventListener('sui:tab:change', event => {
  if (event.target.id !== 'bot-chat-tabs') return;
  const thread = threadById(event.detail.id);
  if (!thread || thread.id === current.thread.id) return;
  go('#chat/' + thread.agentId + '/' + thread.id);
  header.querySelector('[role="tab"][aria-selected="true"]')?.focus({ preventScroll: true });
});
shell.addEventListener('sui:tree:toggle', event => {
  const key = event.detail.id.replace('bot-group-', '');
  if (!['launch', 'research'].includes(key)) return;
  state.agentGroups = { ...state.agentGroups, [key]: event.detail.expanded }; save();
});
shell.addEventListener('sui:tree:select', event => {
  const treeKey = event.detail.id;
  if (treeKey?.startsWith('bot-agent-')) { const a = agentById(treeKey.slice(10)); go('#chat/' + a.id + '/' + state.threads.find(t => t.agentId === a.id).id); return; }
  if (treeKey === 'bot-chat') go('#chat/' + current.agent.id + '/' + state.threads.find(t => t.agentId === current.agent.id).id);
  if (treeKey === 'bot-settings') go('#settings/' + current.agent.id);
});
shell.addEventListener('click', event => {
  const destination = event.target.closest('[data-bot-nav]')?.dataset.botNav;
  if (destination === 'chat') go('#chat/' + current.agent.id + '/' + state.threads.find(t => t.agentId === current.agent.id).id);
  if (destination === 'settings') go('#settings/' + current.agent.id);
  const routeLink = event.target.closest('a[href^="#"]');
  if (routeLink && !event.ctrlKey && !event.metaKey && !event.shiftKey) { event.preventDefault(); go(routeLink.getAttribute('href')); return; }
  const key = event.target.closest('button[id]')?.id;
  if (key === 'bot-add-agent') {
    addAgentDialog.open(event.target.closest('button'));
    document.querySelector('#bot-add-agent-form input[name="name"]')?.focus({ preventScroll: true });
    return;
  }
  if (!key) return;
  if (key === 'bot-new-thread') { const thread = newThread(current.agent); go('#chat/' + current.agent.id + '/' + thread.id); }
  if (key === 'bot-edit-agent') { openAgentPanel(event.target.closest('button'), event.detail !== 0); return; }
  if (key === 'bot-close-settings' || key === 'bot-cancel-settings') { closeAgentPanel(true, event.detail !== 0); return; }
  if (key === 'bot-back-chat') go('#chat/' + current.agent.id + '/' + state.threads.find(t => t.agentId === current.agent.id).id);
  if (key === 'bot-save-agent') saveAgent(document.getElementById('bot-settings-form'));
  const prompts = { 'prompt-priorities': ['atlas', 'What needs me today?'], 'prompt-research': ['scout', 'Compare competitor pricing and prepare a brief.'], 'prompt-change': ['forge', 'Prepare the pricing update for review.'] };
  if (prompts[key]) { const [agentId, prompt] = prompts[key]; const thread = newThread(agentById(agentId)); startRun(thread, prompt); go('#chat/' + agentId + '/' + thread.id); }
  const run = state.runs.find(r => ['retry-', 'approve-', 'decline-', 'download-', 'open-file-', 'stop-'].some(prefix => key === prefix + r.id));
  if (!run) return;
  if (key.startsWith('stop-') && active.includes(run.state)) { stopTimer(run); run.state = 'cancelled'; save(); updateVisible(run); announce('Work stopped.'); }
  if (key.startsWith('retry-') && recoverable.includes(run.state)) { run.attempt++; run.stage = -1; run.error = ''; run.state = 'queued'; advance(run); }
  if (key.startsWith('approve-')) settleApproval(run, true);
  if (key.startsWith('decline-')) settleApproval(run, false);
  if (key.startsWith('open-file-')) {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  if (key.startsWith('download-')) {
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'competitor-brief.md'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});
scroller.addEventListener('scroll', () => { rememberPosition(); updateScrollFade(); });
const scrollFadeObserver = new ResizeObserver(updateScrollFade);
scrollFadeObserver.observe(scroller);
scrollFadeObserver.observe(view);
window.addEventListener('resize', () => { header.querySelector('[role="tab"][aria-selected="true"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); });
window.addEventListener('hashchange', () => { rememberPosition(); render(true); });
window.addEventListener('pagehide', () => { rememberPosition(); save(); });
if (!location.hash) history.replaceState(null, '', state.route || '#chat/atlas/main-atlas');
render();
