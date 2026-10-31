import {
  appShell,
  workspaceSidebar,
  pageHeader,
  dataSection,
  table,
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
  initModal,
  showToast,
  controlIcon,
  escapeHTML,
  mount
} from '../src/index.mjs';
import { issueSeeds } from './shared/data.mjs';

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

let selected = issues[0];
let view = 'detail';
let search = '';
let statusFilter = 'All statuses';
let activeNav = 'favorite-248';
let agentTimer;

const statusIcon = status => statusDot({
  tone: status === 'Done' ? 'success' : status === 'In Progress' ? 'informative' : status === 'Todo' ? 'warning' : 'neutral',
  label: status
});

const initials = name => name.split(' ').map(n => n[0]).join('');
const avatar = name => avatarBuilder({ name, initials: initials(name), size: 24 });

function sidebar() {
  return workspaceSidebar({
    workspace: 'Sesama workspace',
    navigation: [
      { id: 'inbox', key: 'inbox', label: 'Inbox', icon: 'bell', selected: activeNav === 'inbox' },
      { id: 'my-issues', key: 'my-issues', label: 'My issues', icon: 'circle-user', selected: activeNav === 'my-issues' },
      { id: 'all-issues', key: 'all-issues', label: 'All issues', icon: 'file-text', selected: activeNav === 'all-issues' }
    ],
    groups: [
      {
        title: 'Workspace',
        items: [
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
      ${iconButton({ icon: 'plus', attributes: 'data-iw-new', accessibleLabel: 'New issue' })}
      ${view === 'detail' ? `
        ${iconButton({ icon: 'star', classes: selected.favorite ? 'on' : '', attributes: `data-iw-favorite aria-pressed="${selected.favorite}"`, accessibleLabel: 'Toggle favorite' })}
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
        options: ['Backlog', 'Todo', 'In Progress', 'Done']
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
        options: ['Amelia Park', 'Noah Ibarra', 'Priya Desai', 'Marcus Chen']
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
        <p class="iw-detail-note">${selected.cycle} · Oct 19 – Nov 1</p>
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
        <button class="btn secondary" data-iw-delegate>${controlIcon('sparkles', 14)} Delegate to agent</button>
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
            <div><strong>Amelia</strong> created this issue <time>2 hours ago</time></div>
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
          <div class="iw-agent-update">
            <div class="iw-agent-update-head">
              ${controlIcon('sparkles', 16)}
              <span>Sesama agent</span>
              <span>Sample run</span>
            </div>
            ${agentRun({ title: 'Reviewed the implementation', state: 'completed', duration: '12s', steps: agentSteps() })}
            <p>Found a clear path forward. Keep the initial render independent from the background refresh.</p>
          </div>
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
    (activeNav !== 'my-issues' || issue.assignee === 'Amelia Park')
  );

  return `
    <div class="iw-list-layout">
      <div class="iw-list-toolbar">
        <label class="field">
          ${controlIcon('search', 16)}
          <input aria-label="Search issues" placeholder="Search issues…" data-iw-search value="${esc(search)}">
        </label>
        <div class="sx-row">
          ${select({
            name: 'iw-filter',
            label: 'Status filter',
            hideLabel: true,
            value: statusFilter,
            options: ['All statuses', 'Backlog', 'Todo', 'In Progress', 'Done']
          })}
          <button class="btn primary" data-iw-new>${controlIcon('plus', 14)} New issue</button>
        </div>
      </div>
      ${dataSection({
        title: '',
        data: table({
          label: 'Issues',
          rowAction: 'open-issue',
          rows,
          columns: [
            { key: 'id', header: 'ID' },
            { key: 'title', header: 'Title' },
            { key: 'status', header: 'Status', render: statusIcon },
            { key: 'priority', header: 'Priority' },
            { key: 'assignee', header: 'Assignee', render: name => `<span class="iw-inline-meta">${avatar(name)}${esc(name)}</span>` }
          ],
          minWidth: 680
        }),
        footer: ''
      })}
      <p class="sx-help">${rows.length} issues</p>
    </div>
  `;
}

function render() {
  document.getElementById('issue-app').innerHTML = appShell({
    sidebar: sidebar(),
    header: pageHeader({
      title: view === 'detail' ? selected.id : activeNav === 'my-issues' ? 'My issues' : 'Issues',
      icon: 'file-text',
      actions: toolbar()
    }),
    content: view === 'detail' ? detail() : list(),
    ...(view === 'detail' ? { detail: properties() } : {})
  });

  mount(document.getElementById('issue-app'));

  const input = document.querySelector('.iw-comment-form textarea');
  if (input) {
    input.placeholder = 'Leave a comment or ask an agent…';
    input.setAttribute('aria-label', 'Write a comment');
  }
}

function openIssue(issue) {
  if (!issue) return;
  selected = issue;
  view = 'detail';
  activeNav = 'favorite-' + issue.id.slice(4);
  render();
}

function newIssue() {
  const dialog = document.createElement('dialog');
  dialog.className = 'ds-modal';
  dialog.dataset.size = 'lg';
  dialog.innerHTML = `
    <div class="sx-modal-header">
      <h2>New issue</h2>
      ${iconButton({ icon: 'x', classes: 'sx-modal-close', attributes: 'data-modal-close', accessibleLabel: 'Close dialog' })}
    </div>
    <form class="iw-new-form">
      ${inputField({ id: 'iw-new-title', label: 'Title', type: 'text', name: 'title', placeholder: 'What needs to be done?', required: true, errorSlot: true })}
      ${inputField({ id: 'iw-new-description', label: 'Description', type: 'text', name: 'description', placeholder: 'Add a little context…' })}
      <div class="actions">
        <button type="button" class="btn secondary" data-modal-close>Cancel</button>
        <button class="btn primary" type="submit">Create issue</button>
      </div>
    </form>
  `;
  dialog.setAttribute('aria-label', 'Create an issue');
  document.body.append(dialog);

  const modalInstance = initModal(dialog);

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
      favorite: false
    };
    issues.push(issue);
    modalInstance.close();
    openIssue(issue);
    showToast('Issue created.', 'success');
  });

  dialog.addEventListener('close', () => {
    modalInstance.destroy();
    dialog.remove();
  }, { once: true });

  modalInstance.open(document.activeElement);
}

render();

document.addEventListener('sesama:row-action', event => {
  if (event.detail.action === 'open-issue') {
    openIssue(issues.find(issue => issue.id === event.detail.key));
  }
});

document.addEventListener('input', event => {
  if (event.target.matches('[data-iw-search]')) {
    const position = event.target.selectionStart;
    search = event.target.value;
    render();
    const next = document.querySelector('[data-iw-search]');
    if (next) {
      next.focus({ preventScroll: true });
      next.setSelectionRange(position, position);
    }
  }
});

document.addEventListener('sui:change', event => {
  if (event.detail?.name?.startsWith('iw-')) {
    if (event.detail.name === 'iw-filter') {
      statusFilter = event.detail.value;
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

  const option = t.closest('[data-select-value]');
  if (option) {
    const input = option.closest('[data-select-demo], [data-sui-select]')?.querySelector('input[type=hidden], select');
    if (input?.name?.startsWith('iw-')) {
      setTimeout(() => {
        if (input.name === 'iw-filter') {
          statusFilter = input.value;
          render();
          return;
        }
        const key = input.name.slice(3);
        selected[key] = input.value;
        showToast('Issue updated.', 'success');
      }, 0);
    }
  }

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
      showToast('You’re all caught up.');
      return;
    }
    activeNav = key;
    view = 'list';
    statusFilter = key === 'team-backlog' ? 'Backlog' : (key === 'team-cycle' || key === 'cycles') ? 'In Progress' : 'All statuses';
    render();
  }
});

document.addEventListener('click', event => {
  const send = event.target.closest('.iw-comment-form [data-send]');
  if (!send || send.disabled) return;
  const textarea = send.closest('.composer, [data-sui-composer]')?.querySelector('textarea');
  const text = textarea?.value?.trim();
  if (!text) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  selected.comments.push(text);
  render();
  const scroll = document.querySelector('.sb-page-scroll');
  if (scroll) scroll.scrollTop = scroll.scrollHeight;
}, true);
