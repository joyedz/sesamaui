import { pageHeader, iconButton, button, dropdownMenu, runeIcon, controlIcon, tabs, table, dataSection, pageLayout, select, listRow, avatar, badge, escapeHTML as esc, emptyState } from '../../src/index.mjs';

const mutedBranchIcon = controlIcon('branch', 16).replace('<svg ', '<svg style="color:var(--text-placeholder)" ');
const initiatives = [
  ['Workspace foundation', '2026', 'On track', '23 / 102', 28, 0],
  ['Runtime reliability', '2026', 'On track', '41 / 193', 83, 0],
  ['Agent collaboration', '2026', 'At risk', '51 / 205', 98, 0],
  ['Context and tool orchestration', 'Q3 2026', 'Off track', '12 / 85', 12, 1],
  ['Accessible interactions', 'H1 2026', 'On track', '22 / 65', 24, 1],
  ['Responsive workspace', 'Q1 2026', 'On track', '8 / 127', 79, 0],
  ['Shared team workspaces', '2026', 'On track', '14 / 32', 22, 0],
  ['Workspace sharing rollout', 'Q2 2026', 'On track', '2 / 15', 9, 1],
  ['Interface localization', 'H2 2026', 'At risk', '4 / 18', 6, 1]
].map(([name, target, health, projects, active, depth], id) => ({ id, name, target, health, projects, active, depth, phase: id > 6 ? 'planned' : 'active' }));
const projects = [
  { name: 'Component consistency', initiative: 'Workspace foundation', mine: true, start: 0, end: 3, milestones: ['Core controls', 'Keyboard review'] },
  { name: 'Shared draft editing', initiative: 'Workspace foundation', mine: false, start: 1, end: 5, milestones: ['Team trial', 'Workspace release'] },
  { name: 'Workspace onboarding', initiative: 'Responsive workspace', mine: true, start: 0, end: 4, milestones: ['Create workspace', 'Invite teammates', 'First task'] },
  { name: 'Localized navigation', initiative: 'Shared team workspaces', mine: false, start: 2, end: 5, milestones: ['Navigation copy', 'Help content'] },
  { name: 'Guest workspace access', initiative: 'Shared team workspaces', mine: true, start: 3, end: 6, milestones: ['Beta', 'Access review'] }
];
const reviews = [
  ['Keep workspace navigation usable during refresh', 'Waiting for your review', '1h', 'needs'],
  ['Validate incoming activity events before rendering', 'Waiting for your review', '1h', 'needs'],
  ['Prevent duplicate attachment submissions', 'Waiting for your review', '2h', 'needs'],
  ['Improve contrast in workspace controls', 'In Review', '4h', 'reviewing'],
  ['Fix long project names in page headers', 'You requested changes', '1d', 'reviewing'],
  ['Clarify loading feedback for saved views', 'Completed', '2d', 'completed']
].map(([title, description, time, group], id) => ({ id, title, description, time, group, mine: id === 4 }));

export function createReferencePages() {
  const state = { initiatives: 'active', projects: 'all', initiative: 'All initiatives', reviews: 'for-me', reviewPanel: 'diff', selectedReview: 0, favoriteReviews: new Set(), subscribedReviews: new Set(), reviewedFiles: new Set() };
  const tab = (id, active, items) => tabs({ id, variant: 'pill', activeTabId: active, tabs: items.map(([id, label]) => ({ id, label })) });

  function initiativesBody() {
    const rows = initiatives.filter(row => state.initiatives === 'all' || row.phase === state.initiatives);
    return dataSection({ title: '', table: table({ label: 'Initiatives', rows, columns: [
      { key: 'name', header: 'Name', render: (value, row) => `<span style="padding-inline-start:${row.depth * 20}px">${esc(value)}</span>` },
      { key: 'target', header: 'Target' }, { key: 'health', header: 'Health', render: value => badge({ label: value, tone: value === 'On track' ? 'success' : 'neutral' }) },
      { key: 'projects', header: 'Projects' }, { key: 'active', header: 'Active projects' }, { key: 'phase', header: 'Activity', render: () => '—' }
    ] }) });
  }
  function projectsBody() {
    const rows = projects.filter(row => (state.projects !== 'mine' || row.mine) && (state.initiative === 'All initiatives' || row.initiative === state.initiative));
    return '<h2 class="iw-reference-heading">Roadmap timeline</h2><div class="iw-roadmap" role="region" aria-label="Project roadmap" tabindex="0"><div class="iw-roadmap-inner"><div class="iw-roadmap-row iw-roadmap-months"><span>Projects</span>' + ['SEP','OCT','NOV','DEC','JAN','FEB','MAR'].map(month => '<span>'+month+'</span>').join('') + '</div>' + rows.map(row => '<div class="iw-roadmap-row"><span>'+esc(row.name)+'</span><div class="iw-roadmap-track"><div class="iw-roadmap-bar" style="grid-column:'+ (row.start + 1) + ' / '+(row.end + 2)+'">'+row.milestones.map(label => '<span>◇ '+esc(label)+'</span>').join('')+'</div></div></div>').join('') + '</div></div>';
  }
  function currentReview() {
    const rows = reviews.filter(row => state.reviews !== 'created' || row.mine);
    return { rows, current: rows.find(row => row.id === state.selectedReview) || rows[0] };
  }
  function reviewsList() {
    const { rows, current } = currentReview();
    const headings = [['needs','Needs your review'],['reviewing',"You’re reviewing"],['completed','Completed']];
    return headings.map(([key, title]) => { const items = rows.filter(row => row.group === key); return items.length ? '<section><h2 class="iw-reference-heading">'+title+' <span class="sx-help">'+items.length+'</span></h2>'+items.map(row => listRow({ variant: 'navigation', appearance: 'plain', title: row.title, description: row.description, leading: mutedBranchIcon, trailing: '<span class="sx-help">'+row.time+'</span>', href: '#review-'+row.id, attributes: 'data-iw-review="'+row.id+'"'+(current?.id === row.id ? ' aria-current="true"' : '') })).join('')+'</section>' : ''; }).join('');
  }
  function reviewHeader() {
    const { current } = currentReview();
    const reviewId = current?.id === 0 ? 'SUI-410' : 'SUI-' + (411 + current.id);
    return pageHeader({title:reviewId+' · '+current.title,icon:mutedBranchIcon,actions:'<span class="sx-help">'+(current.id===0?'+7 −1':'')+'</span>'+iconButton({icon:'star',variant:'favorite',pressed:state.favoriteReviews.has(current.id),accessibleLabel:'Favorite review',attributes:'data-iw-review-favorite'})+iconButton({icon:'bell',pressed:state.subscribedReviews.has(current.id),accessibleLabel:state.subscribedReviews.has(current.id)?'Unsubscribe':'Subscribe',attributes:'data-iw-review-subscribe'})});
  }
  function reviewPaneBody() {
    const { current } = currentReview();
    const lines = [
 ['1',"import { loadWorkspace, refreshActivity } from './workspace-api.mjs';",''],
 ['2',"import { renderShell } from './workspace-view.mjs';",''],
 ['3','', ''],
 ['4','export async function openWorkspace(id) {',''],
 ['−','  const workspace = await loadWorkspace(id, { includeActivity: true });','remove'],
 ['5','  const workspace = await loadWorkspace(id);','add'],
 ['6','  renderShell(workspace);',''],
 ['7','', ''],
 ['8','  try {','add'],
 ['9','    const activity = await refreshActivity(id);','add'],
 ['10',"    renderShell({ ...workspace, activity, refreshState: 'ready' });",'add'],
 ['11','  } catch {','add'],
 ['12',"    renderShell({ ...workspace, refreshState: 'retry' });",'add'],
 ['13','  }','add'],
 ['14','}', '']
];
    const diff = '<div class="iw-review-file"><div><span>WorkspaceShell.mjs</span><div class="sx-help">sesama-workspace/src/WorkspaceShell.mjs</div></div><div class="sx-row"><span class="sx-help">+7 −1</span>' + button({label:state.reviewedFiles.has(current.id)?'Reviewed':'Mark reviewed',variant:'secondary',attributes:'data-iw-review-reviewed aria-pressed="'+state.reviewedFiles.has(current.id)+'"'}) + '</div></div><div class="iw-review-code" tabindex="0" role="region" aria-label="WorkspaceShell.mjs code diff">' + lines.map(([number,code,kind])=>'<div class="iw-code-line '+(kind?'iw-code-'+kind:'')+'"><span class="iw-code-number">'+number+'</span><code>'+esc(code)+'</code></div>').join('') + '</div>';
    const panels = { diff: current?.id === 0 ? diff : emptyState({ title: 'No diff attached', description: 'This sample review has no code attachment.', icon: 'code' }), activity: '<p class="sx-help">Noah requested a review · 1h ago</p>', guide: '<p class="sx-help">Check that navigation renders before activity refresh completes, and that refresh errors leave the workspace usable.</p>', preview: emptyState({ title: 'Preview unavailable', description: 'This example contains a code diff only.', icon: 'code' }) };
    return '<div class="iw-review-panel" data-empty="'+(state.reviewPanel==='preview'||(state.reviewPanel==='diff'&&current.id!==0))+'">'+panels[state.reviewPanel]+'</div>';
  }
  function reviewPane() {
    return reviewHeader() + '<div class="iw-review-content">' + tab('iw-review-panel-tabs',state.reviewPanel,[['activity','Activity'],['guide','Guide'],['diff','Diff'],['preview','Preview']]) + '<div id="iw-review-pane-body">' + reviewPaneBody() + '</div></div>';
  }
  function reviewsBody() {
    return '<div class="iw-reference-stack iw-review-list">'+tab('iw-reviews-tabs',state.reviews,[['for-me','For me'],['created','Created']])+'<div id="iw-reviews-body" class="iw-reference-stack">'+reviewsList()+'</div></div><section class="iw-review-pane"><div id="iw-review-pane">'+reviewPane()+'</div></section>';
  }
  function render(name) {
    if (name === 'initiatives') {
      return pageLayout(tab('iw-initiatives-tabs', state.initiatives, [['active','Active'],['planned','Planned'],['all','All initiatives']]) + '<div id="iw-initiatives-body">' + initiativesBody() + '</div>', { variant: 'data' });
    }
    if (name === 'projects') {
      return pageLayout('<div class="iw-reference-stack"><div class="iw-reference-toolbar">' + tab('iw-projects-tabs', state.projects, [['all','All projects'],['mine','My projects']]) + select({ name: 'iw-project-initiative', ariaLabel: 'Initiative', value: state.initiative, options: ['All initiatives','Workspace foundation','Responsive workspace','Shared team workspaces'] }) + '</div><div id="iw-projects-body">' + projectsBody() + '</div></div>', { variant: 'data' });
    }
    if (name === 'reviews') {
      return '<div class="iw-reviews-grid">' + reviewsBody() + '</div>';
    }
    return '';
  }
  // Tab switches patch only the tab-dependent bodies — the tablists stay
  // mounted so the sliding indicator keeps its glide animation.
  function bodyFor(id) {
    if (id === 'iw-initiatives-tabs') return [{ container: 'iw-initiatives-body', html: initiativesBody() }];
    if (id === 'iw-projects-tabs') return [{ container: 'iw-projects-body', html: projectsBody() }];
    if (id === 'iw-reviews-tabs') return [{ container: 'iw-reviews-body', html: reviewsList() }, { container: 'iw-review-pane', html: reviewPane() }];
    if (id === 'iw-review-panel-tabs') return [{ container: 'iw-review-pane-body', html: reviewPaneBody() }];
    return null;
  }
  return { render, state, action(name) { const rows = reviews.filter(row => state.reviews !== 'created' || row.mine); const current = rows.find(row => row.id === state.selectedReview) || rows[0]; const collection = name === 'favorite' ? state.favoriteReviews : name === 'subscribe' ? state.subscribedReviews : state.reviewedFiles; collection.has(current.id) ? collection.delete(current.id) : collection.add(current.id); }, change(id, value) { const keys = { 'iw-initiatives-tabs':'initiatives', 'iw-projects-tabs':'projects', 'iw-reviews-tabs':'reviews', 'iw-review-panel-tabs':'reviewPanel' }; if (!keys[id]) return false; state[keys[id]] = value; return bodyFor(id) || true; } };
}
