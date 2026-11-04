import { runeIcon, appShell, workspaceSidebar, iconButton, composer, message, listRow, avatar, tree, tabs, pageHeader, uid, inputField, fileCard } from '../src/index.mjs';

function tabExamples() {
  const leading = tabs({
    ariaLabel: 'Project members',
    variant: 'pill',
    tabs: [
      { label: 'Amelia', leading: avatar({ name: 'Amelia Park', size: 18 }), content: 'Amelia Park · Product design' },
      { label: 'Noah', leading: avatar({ name: 'Noah Ibarra', size: 18 }), content: 'Noah Ibarra · Engineering' },
      { label: 'Team', leading: runeIcon('users', 16), content: 'Two members on this project.' }
    ]
  });
  const id = uid('project-preview');
  const panelId = id + '-content';
  const shared = `<div data-example-shared-tabs>${tabs({
    id, panelId, ariaLabel: 'Project details', variant: 'pill',
    tabs: [{ id: 'summary', label: 'Summary', icon: 'file-text' }, { id: 'activity', label: 'Activity', icon: 'clock' }]
  })}<div id="${panelId}" role="tabpanel" aria-labelledby="${id}-tab-summary" tabindex="0" style="padding:16px">
    <div data-example-tab-content="summary"><strong>Website launch</strong><p>Design is ready for review. Engineering starts on Monday.</p></div>
    <div data-example-tab-content="activity" hidden><strong>Recent activity</strong><p>Amelia submitted the homepage for review.</p></div>
  </div></div>`;
  return [['Tabs with leading content', leading], ['Tabs with a shared panel', shared]].map(([name, html]) => ({
    name, html: `<div class="sui-root is-full" style="width:100%">${html}</div>`, code: html
  }));
}

export function conversationExamples(name) {
  if (name === 'Tabs') return tabExamples();
  let html = '';
  if (name === 'Page Header') {
    const key = uid('shared-chat');
    const tabBar = tabs({ id: key, panelId: key + '-content', ariaLabel: 'Open chats', tabs: [{ id: 'atlas', label: 'Atlas', leading: avatar({ name: 'Atlas', size: 18, image: '/assets/agent-bot/atlas-v1.png' }) }] });
    html = pageHeader({ icon: '', titleContent: '<h1 class="sui-sr-only">Atlas</h1>' + tabBar }) + '<div id="' + key + '-content" role="tabpanel" aria-labelledby="' + key + '-tab-atlas" style="padding:16px">Application-managed conversation content.</div>';
  }

  if (name === 'File Card') html = fileCard({ variant: 'attachment', name: 'social-drafts.md', size: '4 KB', actions: iconButton(runeIcon('arrow-down-to-line', 16), { label: 'Download social-drafts.md' }) + iconButton('arrow-up-right', { label: 'Open social-drafts.md' }) });
  if (name === 'Avatar') html = '<div style="display:flex;gap:16px;--avatar-background:transparent;--avatar-radius:0">' + ['atlas', 'forge', 'scout'].map(id => avatar({ name: id, size: 48, image: '/assets/agent-bot/' + id + '-v1.png' })).join('') + '</div>';
  if (name === 'Tree') html = tree({ items: [{ id: 'section-launch', label: 'Launch', icon: 'folder', layout: 'section', content: listRow({ title: 'Atlas', titleBadge: 'Team lead', description: 'The launch brief is ready.', attributes: 'role="treeitem"' }), attributes: 'role="treeitem"' }] });
  if (name === 'Input Field') html = inputField({ type: 'search', ariaLabel: 'Search', placeholder: 'Search', icon: 'search' });
  if (name === 'Composer') html = composer({ compact: true, showContext: false, showModel: false, showAttach: false, showMic: false, placeholder: 'Message your agent…' });
  if (name === 'Message') html = '<div style="display:grid;gap:24px;--message-width:100%">' + message({ role: 'user', own: true, appearance: 'bubble', content: 'What needs me today?' }) + message({ role: 'agent', appearance: 'bubble', content: 'Review the pricing update and the competitor brief.' }) + '</div>';
  if (name === 'Workspace Sidebar') html = '<div style="height:420px;width:300px">' + workspaceSidebar({ variant: 'conversation', workspace: 'Agent workspace', projectsTitle: 'Your team', projects: listRow({ variant: 'navigation', appearance: 'plain', title: 'Atlas', titleBadge: 'Team lead', description: 'Your launch brief is ready.', leading: avatar({ name: 'Atlas', size: 32 }), href: '#atlas' }) }) + '</div>';
  if (name === 'App Shell') html = '<div style="height:400px;width:100%;overflow:hidden">' + appShell({ attributes: 'style="height:400px;--shell-sidebar-width:240px"', rail: iconButton('sparkles', { label: 'Agents' }), sidebar: workspaceSidebar({ workspace: 'Agent workspace' }), content: '<p style="padding:24px">Persistent global rail and workspace navigation.</p>' }) + '</div>';
  if (!html) return [];
  const examples = [{ name: 'Conversation workspace', html: '<div class="sui-root" style="width:100%">' + html + '</div>', code: html }];
  if (name === 'Workspace Sidebar') {
    const compact = workspaceSidebar({ variant: 'compact', navigation: tree([{ id: 'compact-chat', label: 'Chats', icon: 'chat', attributes: 'role="treeitem" aria-label="Chats"' }, { id: 'compact-tasks', label: 'Tasks', icon: 'check', attributes: 'role="treeitem" aria-label="Tasks"' }]) });
    examples.push({ name: 'Compact only', html: '<div class="sui-root" style="height:280px;width:48px">' + compact + '</div>', code: compact });
  }
  if (name === 'App Shell') {
    const detail = appShell({ attributes: 'style="height:440px;--shell-detail-width:360px;--shell-detail-padding:0px"', sidebar: workspaceSidebar({ workspace: 'Agent workspace' }), content: '<p style="padding:24px">The conversation stays visible while editing.</p>', detail: pageHeader({ title: 'Agent settings', icon: '' }) + '<div style="padding:16px">' + inputField({ label: 'Name', value: 'Scout' }) + '</div>' });
    examples.push({ name: 'Configurable detail panel', html: '<div class="sui-root" style="height:440px;width:100%;overflow:hidden">' + detail + '</div>', code: detail });
  }
  return examples;
}
