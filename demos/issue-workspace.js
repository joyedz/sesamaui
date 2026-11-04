import {
  appShell,
  pageLayout,
  activityFeed,
  badge,
  tabs,
  collapsible,
  emptyState,
  workspaceSidebar,
  pageHeader,
  dataSection,
  table,
  pagination,
  select,
  inputField,
  button,
  iconButton,
  linkButton,
  statusDot,
  avatar as avatarBuilder,
  listRow,
  agentRun,
  composer,
  modal,
  input,
  initModal,
  showToast,
  controlIcon,
  runeIcon,
  escapeHTML,
  mount
} from '../src/index.mjs';
import { readState, writeState, preserveSidebar } from './shared/state.mjs';
preserveSidebar('issue-workspace');
const savedIssueState = readState('issue-workspace');
import { demoCategories, demoRoutes } from './shared/pages.mjs';
import { issueSeeds } from './shared/data.mjs';
import { createReferencePages } from './shared/issue-reference-pages.mjs';
const referencePages = createReferencePages();
const currentUser = 'Nils Eller';
let myIssuesTab = 'assigned';

const esc = escapeHTML;

const issues = issueSeeds.map((row, i) => ({
  id: 'SES-' + (248 + i),
  title: row[0],
  status: row[1],
  priority: row[2],
  assignee: row[3],
  label: row[4],
  project: i % 2 ? 'UI refresh' : 'Core experience',
  cycle: 'Cycle 24',
  favorite: i === 0,
  comments: [],
  description: i === 0
    ? 'Render the workspace before the full data refresh completes. Load the minimum required state first, then refresh the remaining data in the background.'
    : 'Improve ' + row[0].toLowerCase() + ' while preserving existing keyboard interactions and shared component behavior.',
  agentDone: false
}));

const extraTopics = ['Improve keyboard shortcuts', 'Fix notification badge', 'Refine empty states', 'Optimize search results', 'Update API validation', 'Improve mobile navigation', 'Audit focus indicators', 'Fix attachment preview', 'Document loading states', 'Reduce layout shifts'];
for (let index = issues.length; index < 64; index++) {
  const base = issues[index % issueSeeds.length];
  issues.push({ ...base, id: 'SES-' + (248 + index), title: extraTopics[index % extraTopics.length] + ' · ' + (Math.floor(index / extraTopics.length) + 1), favorite: false, comments: [] });
}
let listPage = 1, listPageSize = 10;
issues.forEach((issue, index) => { issue.creator = index % 3 ? 'Amelia Park' : currentUser; issue.subscribers = index % 2 ? [currentUser] : []; if (index % 4 === 0) issue.assignee = currentUser; });
const personalSamples = [
 ['SUI-1001','Separate initial workspace load from background refresh','In Review','iOS','201','Oct 9'],
 ['SUI-1002','Show refresh status without blocking navigation','In Review','Reliability','202','Oct 9'],
 ['SUI-1003','Expose loading state to workspace panels','In Review','Bug · Reliability','203','Oct 8'],
 ['SUI-1004','Keep activity timestamps stable while streaming','In Progress','Performance','204','Oct 6'],
 ['SUI-1005','Recover gracefully when an integration disconnects','In Progress','Maps','205','Oct 2'],
 ['SUI-1006','Load sidebar resources before optional previews','In Progress','Maps','','Oct 7'],
 ['SUI-1007','Deduplicate comments after a network retry','In Progress','Bug','','Oct 5'],
 ['SUI-1008','Reduce rerenders in the agent directory','Todo','Maps','','Oct 10'],
 ['SUI-1009','Remove legacy workspace event handlers','Todo','API','','Oct 9'],
 ['SUI-1010','Parallelize component accessibility checks','Todo','Performance','','Oct 9'],
 ['SUI-1011','Stabilize touch interaction smoke tests','Todo','Reliability','','Oct 4']
];
issues.forEach(issue => { if (issue.assignee === currentUser) issue.assignee = 'Amelia Park'; });
for (const [id,title,status,label,pr,updated] of personalSamples) issues.push({ ...issues[0], id,title,status,label,pr,updated,assignee:currentUser,creator:currentUser,subscribers:[currentUser],favorite:false,comments:[],description:'Review '+title.toLowerCase()+' and preserve the existing behavior.',agentDone:false });
issues[4].status = 'In Review'; issues[8].status = 'In Review';
let selected = issues[0];
let view = 'inbox';
let search = '';
let statusFilter = 'All statuses';
let activeNav = 'inbox';
let inboxFilter = 'all';
const notifications = issues.slice(0, 4).map((issue, index) => ({ id: issue.id, issue, read: index > 1, snoozed: false, text: ['Amelia assigned this issue to you', 'Sesama agent finished a review', 'Noah mentioned you in a comment', 'Priya updated the issue priority'][index], time: ['5m', '8m', '4h', '1d'][index] }));
let activeNotification = notifications[0].id;
let agentTimer;
let pageSession;

const statusIcon = status => statusDot({
  tone: status === 'Done' ? 'success' : status === 'In Progress' ? 'informative' : status === 'Todo' ? 'warning' : 'neutral',
  label: status
});

function workflowStatusIcon(status) {
  const color = status === 'In Review' || status === 'Done' ? 'var(--color-success)' : status === 'In Progress' ? 'var(--color-warning)' : 'var(--text-placeholder)';
  const fill = status === 'In Review' ? '<path d="M7 7V3.5A3.5 3.5 0 1 1 3.5 7Z" fill="currentColor"/>' : status === 'In Progress' ? '<path d="M7 3.5A3.5 3.5 0 0 1 7 10.5Z" fill="currentColor"/>' : status === 'Done' ? '<path d="M4 7l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/>' : '';
  return '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" style="color:'+color+';flex:none"><circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" stroke-width="1.5"'+(status==='Backlog'?' stroke-dasharray="2 2"':'')+'/>'+fill+'</svg>';
}

const initials = name => name.split(' ').map(n => n[0]).join('');
const avatar = name => avatarBuilder({ name, initials: initials(name), size: 24 });

function sidebar() {
  return workspaceSidebar({
    workspace: 'Sesama workspace',
    navigation: [
      { id: 'inbox', key: 'inbox', label: 'My inbox', icon: runeIcon('inbox'), selected: activeNav === 'inbox' },
      { id: 'reviews', key: 'reviews', label: 'Reviews', icon: 'code', selected: activeNav === 'reviews' },
      { id: 'my-issues', key: 'my-issues', label: 'My issues', icon: 'circle-user', selected: activeNav === 'my-issues' },
      { id: 'all-issues', key: 'all-issues', label: 'All issues', icon: 'file-text', selected: activeNav === 'all-issues' }
    ],
    groups: [
      {
        title: 'Workspace',
        items: [
          { id: 'initiatives', key: 'initiatives', label: 'Initiatives', icon: runeIcon('flag'), selected: activeNav === 'initiatives' },
          { id: 'projects', key: 'projects', label: 'Projects', icon: 'folder', selected: activeNav === 'projects' },
          { id: 'cycles', key: 'cycles', label: 'Cycles', icon: 'activity', selected: activeNav === 'cycles' },
          { id: 'views', key: 'views', label: 'Views', icon: 'grid-3x3', selected: activeNav === 'views' }
        ]
      },
      {
        title: 'Favorites',
        items: issues.filter(i => i.favorite).map(i => ({
          id: 'favorite-' + i.id.slice(4),
          key: 'favorite-' + i.id.slice(4),
          label: i.title,
          icon: 'star',
          selected: view === 'detail' && selected === i
        }))
      }
    ],
    projects: [
      {
        id: 'team-sesama',
        key: 'team-sesama',
        label: 'Sesama UI',
        icon: 'folder',
        children: [
          { id: 'team-issues', key: 'team-issues', label: 'Issues', icon: 'file-text' },
          { id: 'team-cycle', key: 'team-cycle', label: 'Active cycle', icon: 'activity' },
          { id: 'team-backlog', key: 'team-backlog', label: 'Backlog', icon: 'archive' }
        ]
      }
    ]
  });
}

function toolbar() {
  return `
    <div class="iw-toolbar">
      ${view === 'detail' ? `
        ${iconButton({ icon: 'star', variant: 'favorite', pressed: selected.favorite, attributes: 'data-iw-favorite', accessibleLabel: 'Toggle favorite' })}
        ${iconButton({ icon: 'copy', attributes: 'data-iw-copy', accessibleLabel: 'Copy issue ID' })}
        <span class="iw-count">${issues.indexOf(selected) + 1} / ${issues.length}</span>
        ${iconButton({ icon: 'chevron-left', attributes: 'data-iw-prev', accessibleLabel: 'Previous issue' })}
        ${iconButton({ icon: 'chevron-right', attributes: 'data-iw-next', accessibleLabel: 'Next issue' })}
      ` : ''}
    </div>
  `;
}

function propertyFields() {
  return `
    <div class="iw-property-list">
      ${select({
        name: 'iw-status',
        label: 'Status',
        value: selected.status,
        options: ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done']
      })}
      ${select({
        name: 'iw-priority',
        label: 'Priority',
        value: selected.priority,
        options: ['Low', 'Medium', 'High', 'Urgent']
      })}
      ${select({
        name: 'iw-assignee',
        label: 'Assignee',
        icon: 'circle-user',
        value: selected.assignee,
        options: ['Amelia Park', 'Noah Ibarra', 'Priya Desai', 'Marcus Chen', 'Nils Eller']
      })}
    </div>
  `;
}

function agentSteps() {
  return [
    { type: 'thinking', title: 'Reviewing the issue', detail: 'Read the issue description and identify the affected startup flow.', state: 'completed' },
    { type: 'tool', name: 'Search project files', iconName: 'search', state: 'completed', input: 'workspace initialization', output: 'Found the startup loader and state synchronization files.', duration: '2s' },
    { type: 'tool', name: 'Run checks', iconName: 'file-text', state: 'completed', input: 'Startup and navigation checks', output: 'All checks passed.', duration: '3s' }
  ];
}

function properties() {
  return `
    <div class="iw-detail">
      <section>
        <h2>Properties</h2>
        ${propertyFields()}
      </section>
      <section>
        <h2>Labels</h2>
        <div class="iw-detail-labels">
          <span class="badge tone-informative">${esc(selected.label)}</span>
          <span class="badge tone-neutral">Web</span>
        </div>
      </section>
      <section>
        <h2>Project</h2>
        ${listRow({ title: selected.project, leading: controlIcon('folder', 14) })}
        <p class="iw-detail-note" style="margin-top:var(--space-12)">${selected.cycle} · Oct 19 – Nov 1</p>
      </section>
      <section>
        <h2>Agent</h2>
        <div class="iw-agent-status">
          ${controlIcon('sparkles', 16)}
          <span class="iw-agent-name">Sesama agent</span>
          <span class="iw-agent-model">Code review</span>
        </div>
        <p class="iw-detail-note">Delegate a focused task and review its progress here.</p>
        ${selected.agentDone ? `
          <div class="iw-agent-result">
            ${statusIcon('Done')}
            <p>Implementation prepared for review.</p>
            <div class="iw-file-list">
              <div>${controlIcon('file-text', 14)} workspace-loader.js</div>
              <div>${controlIcon('file-text', 14)} startup-state.js</div>
            </div>
          </div>
        ` : ''}
      </section>
    </div>
  `;
}

function detail() {
  return `
    <article class="iw-content">
      <div class="iw-issue-id">${selected.id} · ${esc(selected.project)}</div>
      <h1 class="iw-title">${esc(selected.title)}</h1>
      <p class="iw-description">${esc(selected.description)}</p>
      <details class="iw-mobile-properties">
        <summary>Issue properties</summary>
        ${propertyFields()}
      </details>
      <div class="iw-issue-actions">
        ${button({ label: 'Delegate to agent', variant: 'secondary', icon: 'sparkles', attributes: 'data-iw-delegate' })}
        ${linkButton({ label: 'Copy issue ID', icon: 'copy', attributes: 'data-iw-copy' })}
      </div>
      <section aria-labelledby="activity-title">
        <div class="iw-section-heading">
          <h2 id="activity-title">Activity</h2>
          <span>Today</span>
        </div>
        <div class="iw-activity">
          <div class="iw-event">
            ${controlIcon('plus', 14)}
            <div><strong>${esc(selected.creator || currentUser)}</strong> created this issue <time>2 hours ago</time></div>
          </div>
          <div class="iw-event">
            ${controlIcon('grid-3x3', 14)}
            <div><strong>Sesama</strong> added the label <span class="badge tone-informative">${esc(selected.label)}</span><time>2 hours ago</time></div>
          </div>
          <div class="iw-comment">
            ${avatar('Amelia Park')}
            <div>
              <div class="iw-comment-heading"><strong>Amelia Park</strong><time>1 hour ago</time></div>
              <p class="iw-comment-body">${selected.id === 'SES-248' ? 'The workspace currently waits for the entire refresh. We should show the UI as soon as the essential state is ready.' : 'Let’s keep this focused and use the existing design system wherever possible.'}</p>
            </div>
          </div>
          <div class="iw-comment">
            ${avatar('Noah Ibarra')}
            <div>
              <div class="iw-comment-heading"><strong>Noah Ibarra</strong><time>32 minutes ago</time></div>
              <p class="iw-comment-body">I’ll check the interaction states. We should cover keyboard navigation and loading as part of this.</p>
            </div>
          </div>
          ${selected.id === 'SES-248' || selected.agentDone ? `<div class="iw-agent-update">
            <div class="iw-agent-update-head">
              ${controlIcon('sparkles', 16)}
              <span>Sesama agent</span>
              <span>Sample run</span>
            </div>
            ${agentRun({ title: 'Reviewed the implementation', state: 'completed', duration: '12s', steps: agentSteps() })}
            <p>Found a clear path forward. Keep the initial render independent from the background refresh.</p>
          </div>` : ''}
          ${selected.comments.map(c => `
            <div class="iw-comment">
              ${avatar('Nils Eller')}
              <div>
                <div class="iw-comment-heading"><strong>Nils Eller</strong><time>Just now</time></div>
                <p class="iw-comment-body">${esc(c)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
      <div class="iw-comment-form" aria-label="Add a comment">
        ${composer({ placeholder: 'Leave a comment or ask an agent…' })}
      </div>
    </article>
  `;
}

function list() {
  const rows = issues.filter(issue =>
    (issue.title + ' ' + issue.id).toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'All statuses' || issue.status === statusFilter) &&
    (activeNav !== 'my-issues' || (myIssuesTab === 'assigned' ? issue.assignee === currentUser : myIssuesTab === 'created' ? issue.creator === currentUser : myIssuesTab === 'subscribed' ? issue.subscribers.includes(currentUser) : issue.comments.length > 0 || issue.creator === currentUser))
  );

  listPage = Math.min(listPage, Math.max(1, Math.ceil(rows.length / listPageSize)));
  const pageRows = rows.slice((listPage - 1) * listPageSize, listPage * listPageSize);
  if (activeNav === 'my-issues') return pageLayout('<div class="iw-reference-stack"><div class="iw-personal-toolbar">' + tabs({ id: 'iw-my-issues-tabs', variant: 'pill', activeTabId: myIssuesTab, tabs: [{id:'assigned',label:'Assigned'},{id:'created',label:'Created'},{id:'subscribed',label:'Subscribed'},{id:'activity',label:'Activity'}] }) + '<div class="sx-row">' + iconButton({icon:'filter',accessibleLabel:'Filter issues',attributes:'data-iw-my-filter'}) + iconButton({icon:'fields',accessibleLabel:'Display options',attributes:'data-iw-my-display'}) + iconButton({icon:'activity',accessibleLabel:'Insights',attributes:'data-iw-my-insights'}) + '</div></div>' + ['In Review','In Progress','Todo','Backlog','Done'].map(status => {
    const group = rows.filter(issue => issue.status === status);
    return group.length ? collapsible({id:'iw-group-'+status.replaceAll(' ','-'),open:true,trigger:'<span class="sx-row">'+workflowStatusIcon(status)+'<span>'+esc(status)+'</span>'+'<span class="sx-help">'+group.length+'</span></span>',content:group.map(issue=>listRow({variant:'navigation',appearance:'plain',title:issue.id+'  '+issue.title,leading:workflowStatusIcon(status),trailing:'<span class="iw-personal-meta">'+(issue.pr?'<span class="sx-help">#'+esc(issue.pr)+'</span>':'')+badge({label:issue.label})+avatar(issue.assignee)+'<span class="sx-help">'+esc(issue.updated||'Today')+'</span></span>',href:'#issue-'+issue.id,attributes:'data-iw-open="'+issue.id+'"'})).join('')}) : '';
  }).join('') + (rows.length ? '' : emptyState({title:'No issues',description:'No issues in this view.',icon:'file-text'})) + '</div>', {variant:'data'});
  return `
    <div class="iw-list-layout">
      <div class="iw-list-toolbar">
        ${input({ id: 'iw-search', type: 'search', ariaLabel: 'Search issues', placeholder: 'Search issues…', value: search, clearable: true })}
        <div class="sx-row">
          ${select({
            name: 'iw-filter',
            label: 'Status filter',
            hideLabel: true,
            value: statusFilter,
            options: ['All statuses', 'Backlog', 'Todo', 'In Progress', 'In Review', 'Done']
          })}
          ${button({ label: 'New issue', variant: 'primary', icon: 'plus', attributes: 'data-iw-new' })}
        </div>
      </div>
      ${dataSection({
        title: '',
        data: table({
          label: 'Issues',
          rowAction: 'open-issue',
          rows: pageRows,
          columns: [
            { key: 'id', header: 'ID' },
            { key: 'title', header: 'Title' },
            { key: 'status', header: 'Status', render: statusIcon },
            { key: 'priority', header: 'Priority' },
            { key: 'assignee', header: 'Assignee', render: name => `<span class="iw-inline-meta">${avatar(name)}${esc(name)}</span>` }
          ],
          minWidth: 680
        }),
        pagination: pagination({ page: listPage, pageSize: listPageSize, totalItems: rows.length, pageSizeOptions: [10, 20, 50], ariaLabel: 'Issue pages' })
      })}
    </div>
  `;
}

function inbox() {
  const visible = notifications.filter(item => inboxFilter === 'snoozed' ? item.snoozed : !item.snoozed && (inboxFilter !== 'unread' || !item.read));
  const current = visible.find(item => item.id === activeNotification);
  if (current) selected = current.issue;
  const rows = visible.map(item => '<div class="iw-inbox-item" data-selected="' + (item.id === activeNotification) + '">' + listRow({
    variant: 'navigation', appearance: 'plain', title: item.issue.id + ' · ' + item.issue.title, description: item.text,
    leading: avatarBuilder({ name: item.issue.assignee, size: 32, color: 'auto' }),
    trailing: '<span class="iw-inbox-meta">' + (!item.read ? statusDot({ tone: 'informative', size: 6 }) : '') + '<span class="sx-help">' + item.time + '</span></span>',
    href: '#inbox-' + item.id, attributes: 'data-iw-notification="' + item.id + '"' + (item.id === activeNotification ? ' aria-current="true"' : '')
  }) + '</div>').join('');
  const preview = current ? pageHeader({ title: selected.id + ' · ' + selected.title, icon: 'file-text', actions:
    iconButton({icon:'star',variant:'favorite',pressed:selected.favorite,accessibleLabel:'Toggle favorite',attributes:'data-iw-favorite'}) +
    iconButton({icon:current.read?runeIcon('mail'):'check',accessibleLabel:current.read?'Mark unread':'Mark read',attributes:'data-iw-inbox-read'}) +
    iconButton({icon:'clock',accessibleLabel:current.snoozed?'Move to inbox':'Snooze',attributes:'data-iw-inbox-snooze'})
  }) + detail() : '<div class="iw-inbox-empty">' + emptyState({title:visible.length?'Select a notification':'You’re all caught up',description:visible.length?'Choose an update to review its issue.':'No notifications in this view.',icon:runeIcon('inbox')}) + '</div>';
  return '<div class="iw-inbox-grid"><section class="iw-inbox-list" aria-label="Inbox notifications">' + tabs({id:'iw-inbox-tabs',variant:'pill',activeTabId:inboxFilter,tabs:[{id:'all',label:'All'},{id:'unread',label:'Unread'},{id:'snoozed',label:'Snoozed'}]}) + '<div class="iw-inbox-items">' + (rows || emptyState({title:'No notifications',icon:runeIcon('inbox'),compact:true})) + '</div></section><section class="iw-inbox-preview" aria-label="Issue preview">' + preview + '</section></div>';
}

let shellMounted = false;
let favoritesSignature = '';

function headerMarkup() {
  return pageHeader({
    title: ['reviews','initiatives','projects'].includes(view) ? ({reviews:'Reviews',initiatives:'Initiatives',projects:'Projects'})[view] : view === 'inbox' ? 'My inbox' : view === 'detail' ? selected.id : activeNav === 'my-issues' ? 'My issues' : 'Issues',
    icon: view === 'inbox' ? runeIcon('inbox') : 'file-text',
    actions: toolbar()
  });
}

function contentMarkup() {
  return ['reviews','initiatives','projects'].includes(view) ? referencePages.render(view) : view === 'inbox' ? inbox() : view === 'detail' ? detail() : list();
}

function updateNavSelection() {
  document.querySelectorAll('#issue-app [data-sui-workspace-sidebar] [data-sel]').forEach(item => {
    const key = item.dataset.treeKey;
    const active = key === activeNav || (view === 'detail' && selected && key === 'favorite-' + selected.id.slice(4));
    item.classList.toggle('on', active);
    if (active) { item.setAttribute('data-active', 'true'); item.setAttribute('aria-current', 'page'); }
    else { item.removeAttribute('data-active'); item.removeAttribute('aria-current'); }
  });
}

function render() {
  saveIssueState();
  const signature = issues.filter(issue => issue.favorite).map(issue => issue.id).join(',');
  if (!shellMounted) {
    // The shell and sidebar mount once; view changes swap only the main column,
    // so switching menus never reloads the sidebar.
    document.getElementById('issue-app').innerHTML = appShell({
      sidebar: sidebar(),
      header: headerMarkup(),
      content: contentMarkup(),
      ...(view === 'detail' ? { detail: properties() } : {})
    });
    shellMounted = true;
    favoritesSignature = signature;
  } else {
    if (signature !== favoritesSignature) {
      // Favorites changed: rebuild only the sidebar element, keeping the shell.
      const template = document.createElement('template');
      template.innerHTML = sidebar();
      document.querySelector('#issue-app [data-sui-workspace-sidebar]').replaceWith(template.content.firstElementChild);
      favoritesSignature = signature;
    }
    const shell = document.querySelector('#issue-app [data-sui-app-shell]');
    const template = document.createElement('template');
    template.innerHTML = `<main class="sb-main sx-shell-main">${headerMarkup()}<div class="sb-page-scroll sx-scroll-area">${contentMarkup()}</div></main>${view === 'detail' ? `<aside class="sb-detail sx-scroll-area" data-shell-detail>${properties()}</aside>` : ''}`;
    shell.querySelector('.sb-main').replaceWith(template.content.querySelector('.sb-main'));
    const detail = template.content.querySelector('.sb-detail');
    const existingDetail = shell.querySelector('.sb-detail');
    if (detail && existingDetail) existingDetail.replaceWith(detail);
    else if (detail) shell.append(detail);
    else existingDetail?.remove();
  }
  pageSession = mount(document.getElementById('issue-app'));
  pageSession.refresh();
  updateNavSelection();
  const input = document.querySelector('.iw-comment-form textarea');
  if (input) {
    input.placeholder = 'Leave a comment or ask an agent…';
    input.setAttribute('aria-label', 'Write a comment');
  }
}

function openIssue(issue) {
  if (!issue) return;
  selected = issue;
  history.pushState(null, '', '?issue=' + encodeURIComponent(issue.id));
  view = 'detail';
  activeNav = 'favorite-' + issue.id.slice(4);
  render();
}

function newIssue() {
  const template = document.createElement('template');
  template.innerHTML = modal({ title: 'New issue', size: 'lg', content: '<form id="iw-create-form" class="iw-new-form">' +
    inputField({ id: 'iw-new-title', label: 'Title', name: 'title', placeholder: 'What needs to be done?', required: true, errorSlot: true }) +
    inputField({ id: 'iw-new-description', label: 'Description', name: 'description', placeholder: 'Add a little context…' }) + '</form>',
    actions: button({ label: 'Cancel', variant: 'secondary', attributes: 'data-sui-modal-close' }) + button({ label: 'Create issue', variant: 'primary', type: 'submit', attributes: 'form="iw-create-form"' })
  });
  const dialog = template.content.firstElementChild;
  dialog.querySelector('[name=title]').setAttribute('autofocus', '');
  document.body.append(dialog);

  const modalInstance = initModal(dialog);
  const dialogSession = mount(dialog);

  dialog.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const title = dialog.querySelector('[name=title]');
    if (!title.value.trim()) {
      title.setAttribute('aria-invalid', 'true');
      const error = dialog.querySelector('#iw-new-title-message');
      if (error) {
        error.hidden = false;
        error.textContent = 'Enter an issue title.';
      }
      title.focus();
      return;
    }
    const issue = {
      id: 'SES-' + (248 + issues.length),
      title: title.value.trim(),
      description: dialog.querySelector('[name=description]').value.trim() || 'Add more context as the issue develops.',
      status: 'Todo',
      priority: 'Medium',
      assignee: 'Nils Eller',
      project: 'Core experience',
      cycle: 'Cycle 24',
      label: 'Feature',
      comments: [],
      favorite: false, creator: currentUser, subscribers: [currentUser]
    };
    issues.push(issue);
    modalInstance.close();
    openIssue(issue);
    showToast('Issue created.', 'success');
  });

  dialog.addEventListener('close', () => {
    dialogSession.destroy();
    modalInstance.destroy();
    dialog.remove();
  }, { once: true });

  modalInstance.open(document.activeElement);
}

const issueRoutes = new Set(demoCategories.find(category => category.id === 'issue-workspace').pages.map(page => page.id));
const initialIssuePage = document.body.dataset.page || 'inbox';
activeNav = initialIssuePage;
view = ['inbox', 'reviews'].includes(activeNav) ? activeNav : 'list';
if (['assigned','created','subscribed','activity'].includes(savedIssueState.myIssuesTab)) myIssuesTab = savedIssueState.myIssuesTab;
if (['all','unread','snoozed'].includes(savedIssueState.inboxFilter)) inboxFilter = savedIssueState.inboxFilter;
if (typeof savedIssueState.search === 'string') search = savedIssueState.search;
if (['All statuses','Backlog','Todo','In Progress','In Review','Done'].includes(savedIssueState.statusFilter)) statusFilter = savedIssueState.statusFilter;
if ([10,25,50].includes(savedIssueState.listPageSize)) listPageSize = savedIssueState.listPageSize;
if (Number.isInteger(savedIssueState.listPage) && savedIssueState.listPage > 0) listPage = savedIssueState.listPage;
const selectedId = new URLSearchParams(location.search).get('issue');
if (selectedId && issues.some(issue => issue.id === selectedId)) { selected = issues.find(issue => issue.id === selectedId); view = 'detail'; }
document.addEventListener('click', event => {
  const key = event.target.closest('[data-tree-key]')?.dataset.treeKey;
  if (issueRoutes.has(key) && key === initialIssuePage && location.search) history.pushState(null, '', location.pathname);
  if (issueRoutes.has(key) && key !== initialIssuePage) {
    event.preventDefault(); event.stopImmediatePropagation();
    saveIssueState(); location.href = demoRoutes[key];
  }
}, true);
function saveIssueState() {
  writeState('issue-workspace', { myIssuesTab, inboxFilter, search, statusFilter, listPage, listPageSize });
}
window.addEventListener('pagehide', saveIssueState);

render();

document.addEventListener('sesama:row-action', event => {
  if (event.detail.action === 'open-issue') {
    openIssue(issues.find(issue => issue.id === event.detail.key));
  }
});

document.addEventListener('input', event => {
  if (event.target.matches('#iw-search')) {
    const position = event.target.selectionStart;
    search = event.target.value;
    listPage = 1;
    render();
    const next = document.querySelector('#iw-search');
    if (next) {
      next.focus({ preventScroll: true });
      next.setSelectionRange(position, position);
    }
  }
});

document.addEventListener('sui:change', event => {
  if (event.detail?.name?.startsWith('iw-') && event.detail.name !== 'iw-project-initiative') {
    if (event.detail.name === 'iw-filter') {
      statusFilter = event.detail.value;
      listPage = 1;
      render();
      return;
    }
    const key = event.detail.name.slice(3);
    selected[key] = event.detail.value;
    showToast('Issue updated.', 'success');
  }
});

document.addEventListener('click', event => {
  const t = event.target;

  if (t.closest('[data-iw-new]')) newIssue();
  if (t.closest('[data-iw-favorite]')) {
    selected.favorite = !selected.favorite;
    render();
  }
  if (t.closest('[data-iw-copy]')) {
    navigator.clipboard.writeText(selected.id)
      .then(() => showToast('Issue ID copied.', 'success'))
      .catch(() => showToast(selected.id));
  }
  if (t.closest('[data-iw-prev]')) {
    openIssue(issues[(issues.indexOf(selected) + issues.length - 1) % issues.length]);
  }
  if (t.closest('[data-iw-next]')) {
    openIssue(issues[(issues.indexOf(selected) + 1) % issues.length]);
  }
  if (t.closest('[data-iw-delegate]')) {
    const btn = t.closest('[data-iw-delegate]');
    btn.disabled = true;
    btn.textContent = 'Working…';
    const issue = selected;
    showToast('Agent demo started.');
    clearTimeout(agentTimer);
    agentTimer = setTimeout(() => {
      issue.agentDone = true;
      issue.status = 'In Progress';
      if (selected === issue) render();
      showToast('Agent result ready to review.', 'success');
    }, 1800);
  }

  const key = t.closest('[data-tree-key]')?.dataset.treeKey;
  if (key && !t.closest('[data-fold]')) {
    if (key.startsWith('favorite-')) {
      openIssue(issues.find(issue => issue.id === 'SES-' + key.slice(9)));
      return;
    }
    if (key === 'inbox') {
      activeNav = 'inbox'; view = 'inbox'; render();
      return;
    }
    if (['reviews','initiatives','projects'].includes(key)) { activeNav = key; view = key; render(); return; }
    activeNav = key;
    listPage = 1;
    view = 'list';
    statusFilter = key === 'team-backlog' ? 'Backlog' : (key === 'team-cycle' || key === 'cycles') ? 'In Progress' : 'All statuses';
    render();
  }
});

document.addEventListener('sui:composer:send', event => {
  if (!event.target.closest('.iw-comment-form')) return;
  const text = event.detail.text;
  if (!text) return;
  selected.comments.push(text);
  queueMicrotask(() => {
    render();
    const scroll = document.querySelector('.sb-page-scroll');
    if (scroll) scroll.scrollTop = scroll.scrollHeight;
  });
});

document.addEventListener('sui:tab:change', event => { if (event.target.id !== 'iw-inbox-tabs') return; inboxFilter = event.detail.id; render(); document.querySelector('#iw-inbox-tabs [aria-selected="true"]')?.focus(); });
document.addEventListener('click', event => {
  const row = event.target.closest('[data-iw-notification]');
  if (row) { event.preventDefault(); activeNotification = row.dataset.iwNotification; notifications.find(item => item.id === activeNotification).read = true; render(); return; }
  const item = notifications.find(item => item.id === activeNotification);
  if (!item || view !== 'inbox') return;
  if (event.target.closest('[data-iw-inbox-read]')) { item.read = !item.read; render(); }
  if (event.target.closest('[data-iw-inbox-snooze]')) { item.snoozed = !item.snoozed; render(); }
});

document.addEventListener('sui:pagination:change', event => {
  if (!event.target.closest('.iw-list-layout')) return;
  listPage = event.detail.page;
  listPageSize = event.detail.pageSize;
  queueMicrotask(() => { render(); document.querySelector('.sb-page-scroll')?.scrollTo({ top: 0 }); });
});

document.addEventListener('sui:tab:change', event => { if (event.target.id === 'iw-my-issues-tabs') { myIssuesTab = event.detail.id; render(); } else if (referencePages.change(event.target.id, event.detail.id)) render(); });
document.addEventListener('sui:change', event => { if (event.detail?.name === 'iw-project-initiative') { referencePages.state.initiative = event.detail.value; render(); } });
document.addEventListener('click', event => { const row = event.target.closest('[data-iw-review]'); if (!row) return; event.preventDefault(); referencePages.state.selectedReview = Number(row.dataset.iwReview); render(); });

document.addEventListener('click', event => {
  const row=event.target.closest('[data-iw-open]');
  if(row){event.preventDefault();openIssue(issues.find(issue=>issue.id===row.dataset.iwOpen));return;}
  const filter=event.target.closest('[data-iw-my-filter]');
  const display=event.target.closest('[data-iw-my-display]');
  const insights=event.target.closest('[data-iw-my-insights]');
  if(!filter&&!display&&!insights)return;
  const template=document.createElement('template');
  template.innerHTML=modal({title:filter?'Filter issues':display?'Display options':'Insights',content:filter?select({name:'iw-filter',label:'Status',value:statusFilter,options:['All statuses','Backlog','Todo','In Progress','In Review','Done']}):display?'<p>Issues are grouped by status, with labels, linked pull requests, assignees, and dates.</p>':'<p>'+issues.filter(issue=>issue.assignee===currentUser).length+' issues assigned to you.</p>'});
  const dialog=template.content.firstElementChild;document.body.append(dialog);const controller=initModal(dialog),session=mount(dialog);
  dialog.querySelector('h2').setAttribute('tabindex','-1');dialog.querySelector('h2').setAttribute('autofocus','');
  dialog.addEventListener('sui:change',()=>controller.close());dialog.addEventListener('close',()=>{session.destroy();controller.destroy();dialog.remove();},{once:true});controller.open(filter||display||insights);
});

document.addEventListener('click', event => { for (const action of ['favorite','subscribe','reviewed']) { if (event.target.closest('[data-iw-review-'+action+']')) { referencePages.action(action); render(); break; } } });
document.addEventListener('click', event => {
  const item = event.target.closest('[data-tree-key]');
  if (!item || !['initiatives', 'projects', 'cycles', 'views'].includes(item.dataset.treeKey)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
}, true);
window.addEventListener('popstate', () => { const id = new URLSearchParams(location.search).get('issue'); const issue = issues.find(item => item.id === id); selected = issue || selected; activeNav = initialIssuePage; view = issue ? 'detail' : ['inbox','reviews'].includes(initialIssuePage) ? initialIssuePage : 'list'; render(); });
