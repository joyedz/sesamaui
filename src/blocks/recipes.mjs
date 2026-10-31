import { escapeHTML, uid } from '../components/shared.mjs';
import { card } from '../components/card.mjs';
import { modal } from '../components/modal.mjs';
import { avatar } from '../components/avatar.mjs';
import { badge } from '../components/badge.mjs';
import { statusDot } from '../components/status-dot.mjs';
import { button } from '../components/button.mjs';
import { inputField } from '../components/input.mjs';
import { textarea } from '../components/textarea.mjs';
import { select } from '../components/select.mjs';
import { listRow } from '../components/list-row.mjs';
import { table } from '../components/table.mjs';
import { toolbar } from '../components/toolbar.mjs';
import { pagination } from '../components/pagination.mjs';
import { appShell } from './app-shell.mjs';
import { workspaceSidebar } from './workspace-sidebar.mjs';
import { pageHeader } from './page-header.mjs';
import { pageLayout } from './page-layout.mjs';
import { pageGrid } from './page-grid.mjs';
import { dataSection } from './data-section.mjs';
import { chartSection } from './chart-section.mjs';
import { metricCard } from './metric-card.mjs';
import { activityFeed } from './activity-feed.mjs';

/**
 * 1. Requirement Group Recipe
 * Domain recipe using Card and List Row / Tree semantics.
 */
export function requirementGroupRecipe(options = {}) {
  const {
    id = uid(),
    title = 'Requirement Group',
    description = '',
    requirements = [],
    actions = '',
    variant = 'bordered',
    classes = '',
  } = options;

  let contentHTML = '';
  if (Array.isArray(requirements) && requirements.length > 0) {
    contentHTML = `<div class="sb-requirement-items">${requirements.map((req, idx) => {
      if (typeof req === 'string') {
        return `<div class="sb-requirement-item">${req}</div>`;
      }
      const itemTitle = req.title || `Requirement ${idx + 1}`;
      const itemSubtitle = req.description || req.id || '';
      const itemStatus = req.status ? badge({ label: req.status, variant: req.status === 'done' || req.status === 'completed' ? 'green' : 'gray' }) : '';
      return listRow({
        id: req.id,
        title: itemTitle,
        subtitle: itemSubtitle,
        trailing: itemStatus || req.trailing || '',
        meta: req.priority ? badge({ label: req.priority, variant: 'blue' }) : '',
      });
    }).join('')}</div>`;
  }

  const classList = ['sb-requirement-group', 'sx-requirement-group', classes].filter(Boolean).join(' ');

  return card({
    id,
    title,
    description,
    content: contentHTML,
    actions,
    variant,
    attributes: `class="${classList}" data-sui-requirement-group`,
  });
}

/**
 * 2. Resource List Recipe
 * Domain recipe using configurable List Row or Table inside Data Section.
 */
export function resourceListRecipe(options = {}) {
  const {
    id,
    title = 'Resources',
    description = '',
    resources = [],
    layout = 'table', // 'table' | 'list'
    columns = [
      { key: 'name', label: 'Resource' },
      { key: 'type', label: 'Type' },
      { key: 'size', label: 'Size' },
      { key: 'updated', label: 'Last Modified' },
      { key: 'actions', label: '', align: 'right' },
    ],
    actions = '',
    toolbar: toolbarMarkup = '',
    pagination: paginationMarkup = '',
    classes = '',
  } = options;

  let dataMarkup = '';
  if (layout === 'table') {
    dataMarkup = table({
      columns,
      rows: resources,
    });
  } else {
    dataMarkup = `<div class="sb-resource-rows">${resources.map(res => {
      if (typeof res === 'string') return res;
      return listRow({
        id: res.id,
        title: res.name || res.title,
        subtitle: res.type ? `${res.type}${res.size ? ` • ${res.size}` : ''}` : res.description,
        meta: res.updated || '',
        trailing: res.actions || '',
      });
    }).join('')}</div>`;
  }

  const classList = ['sb-resource-list', 'sx-resource-list', classes].filter(Boolean).join(' ');

  return dataSection({
    id,
    title,
    description,
    actions,
    toolbar: toolbarMarkup,
    data: dataMarkup,
    pagination: paginationMarkup,
    classes: classList,
  });
}

/**
 * 3. Agent Card Recipe
 * Domain recipe using Card, Avatar, Badges, and Status.
 */
export function agentCardRecipe(options = {}) {
  const {
    id = uid(),
    name = 'AI Agent',
    role = 'Assistant',
    description = '',
    status = 'online', // 'online' | 'offline' | 'busy' | 'away'
    model = '',
    avatar: avatarOpts = {},
    capabilities = [],
    actions = '',
    variant = 'bordered',
    classes = '',
  } = options;

  const avatarMarkup = avatar({
    size: 'lg',
    fallback: name.slice(0, 2).toUpperCase(),
    ...avatarOpts,
  });

  const statusMarkup = statusDot({ status });
  const modelMarkup = model ? badge({ label: model, variant: 'gray' }) : '';
  
  let capsMarkup = '';
  if (Array.isArray(capabilities) && capabilities.length > 0) {
    capsMarkup = `<div class="sb-agent-capabilities">${capabilities.map(cap => badge({ label: cap, variant: 'blue' })).join(' ')}</div>`;
  }

  const headerMarkup = `
    <div class="sb-agent-header">
      <div class="sb-agent-avatar-wrap">
        ${avatarMarkup}
        <span class="sb-agent-status-indicator">${statusMarkup}</span>
      </div>
      <div class="sb-agent-meta">
        <h4 class="sb-agent-name">${escapeHTML(name)}</h4>
        <div class="sb-agent-sub">${escapeHTML(role)} ${modelMarkup}</div>
      </div>
    </div>
  `;

  const bodyMarkup = `
    ${description ? `<p class="sb-agent-desc">${escapeHTML(description)}</p>` : ''}
    ${capsMarkup}
  `;

  const classList = ['sb-agent-card', 'sx-agent-card', classes].filter(Boolean).join(' ');

  return card({
    id,
    header: headerMarkup,
    content: bodyMarkup,
    footer: actions,
    variant,
    attributes: `class="${classList}" data-sui-agent-card`,
  });
}

/**
 * 4. Create Skill Dialog Recipe
 * Domain recipe using Modal and Input Fields.
 */
export function createSkillDialogRecipe(options = {}) {
  const {
    id = 'create-skill-dialog',
    title = 'Create New Skill',
    description = 'Define a custom capability or MCP tool for your workspace.',
    nameId = 'skill-name',
    nameLabel = 'Skill Name',
    namePlaceholder = 'e.g., git-analytics',
    descId = 'skill-description',
    descLabel = 'Description',
    descPlaceholder = 'Explain what this skill does and when to invoke it...',
    runtimeId = 'skill-runtime',
    runtimeLabel = 'Runtime Environment',
    runtimeOptions = [
      { value: 'node', label: 'Node.js (v20+)' },
      { value: 'python', label: 'Python (3.11+)' },
      { value: 'shell', label: 'Shell Script' },
    ],
    submitLabel = 'Create Skill',
    cancelLabel = 'Cancel',
  } = options;

  const nameInput = inputField({
    id: nameId,
    label: nameLabel,
    placeholder: namePlaceholder,
    required: true,
  });

  const descInput = textarea({
    id: descId,
    label: descLabel,
    placeholder: descPlaceholder,
    rows: 3,
  });

  const runtimeSelect = `
    <div class="sui-field-group sb-recipe-field">
      <label class="sui-label" for="${escapeHTML(runtimeId)}">${escapeHTML(runtimeLabel)}</label>
      ${select({
        id: runtimeId,
        options: runtimeOptions,
      })}
    </div>
  `;

  const formContent = `
    <form class="sb-create-skill-form" method="dialog">
      ${nameInput}
      ${descInput}
      ${runtimeSelect}
    </form>
  `;

  const actions = `
    ${button({ label: cancelLabel, variant: 'outline', attributes: 'data-sui-modal-close' })}
    ${button({ label: submitLabel, variant: 'primary', type: 'submit' })}
  `;

  return modal({
    id,
    title,
    description,
    content: formContent,
    actions,
    size: 'base',
  });
}

/**
 * 5. Delete Resource Recipe
 * Domain recipe using confirmation Modal with destructive action.
 */
export function deleteResourceRecipe(options = {}) {
  const {
    id = 'delete-resource-dialog',
    title = 'Delete Resource',
    resourceName = 'this item',
    description,
    warningText,
    confirmLabel = 'Delete Resource',
    cancelLabel = 'Cancel',
    requiresKeyword = false,
    keyword = 'delete',
  } = options;

  const escName = escapeHTML(resourceName);
  const bodyText = warningText || `Are you sure you want to permanently delete <strong>${escName}</strong>? All associated configuration, history, and dependencies will be permanently removed. This action cannot be undone.`;

  let confirmationInput = '';
  if (requiresKeyword) {
    confirmationInput = `
      <div class="sb-delete-confirm-box" data-expected-keyword="${escapeHTML(keyword)}">
        <p class="sb-delete-confirm-prompt">Please type <strong>${escapeHTML(keyword)}</strong> to confirm:</p>
        ${inputField({
          id: `${id}-keyword-input`,
          placeholder: keyword,
        })}
      </div>
    `;
  }

  const contentMarkup = `
    <div class="sb-delete-resource-content">
      <p class="sb-delete-resource-warning">${bodyText}</p>
      ${confirmationInput}
    </div>
  `;

  const actions = `
    ${button({ label: cancelLabel, variant: 'outline', attributes: 'data-sui-modal-close' })}
    ${button({ label: confirmLabel, variant: 'danger', type: 'button', attributes: 'data-sui-confirm-delete' })}
  `;

  return modal({
    id,
    title,
    description,
    content: contentMarkup,
    actions,
    size: 'base',
  });
}

/**
 * 6. Dashboard Overview Recipe
 * Complete demo/page recipe composed from PageLayout, PageHeader, PageGrid, MetricCards, etc.
 */
export function dashboardOverviewRecipe(options = {}) {
  const {
    title = 'Dashboard Overview',
    description = 'High-level summary of your workspace performance and activity.',
    headerActions = '',
    metrics = [],
    chart = '',
    activity = '',
    table: tableMarkup = '',
    classes = '',
  } = options;

  const header = pageHeader({
    title,
    description,
    actions: headerActions,
  });

  const metricCards = Array.isArray(metrics)
    ? metrics.map(m => typeof m === 'string' ? m : metricCard(m)).join('')
    : (metrics || '');

  const metricGrid = metricCards
    ? pageGrid({ columns: 4, content: metricCards, classes: 'sb-overview-metrics' })
    : '';

  const mainGrid = pageGrid({
    columns: 3,
    content: `
      <div class="sb-grid-span-2">${chart}</div>
      <div class="sb-grid-span-1">${activity}</div>
    `,
    classes: 'sb-overview-main-grid',
  });

  const fullContent = `
    <div class="sb-dashboard-overview ${classes}">
      ${metricGrid}
      ${mainGrid}
      ${tableMarkup ? `<div class="sb-overview-table">${tableMarkup}</div>` : ''}
    </div>
  `;

  return pageLayout({
    header,
    content: fullContent,
  });
}

/**
 * 7. Revenue Chart Recipe
 * Revenue-specific recipe using Chart Section, MetricCards, and Chart.
 */
export function revenueChartRecipe(options = {}) {
  const {
    id = 'revenue-chart-section',
    title = 'Revenue Overview',
    description = 'Gross revenue, net margins, and monthly recurring revenue.',
    actions = '',
    metrics = [
      { label: 'Total Revenue', value: '$124,592', change: '+14.2%', trend: 'up' },
      { label: 'MRR', value: '$48,200', change: '+8.1%', trend: 'up' },
      { label: 'Net Profit', value: '$32,180', change: '+4.5%', trend: 'up' },
    ],
    chart = '',
    summary = 'Compared to the previous 30-day period. Revenue is trending up by 14.2%.',
    footer = '',
    classes = '',
  } = options;

  return chartSection({
    id,
    title,
    description,
    actions,
    metrics,
    summary,
    chart,
    footer,
    classes: ['sb-revenue-chart', classes].filter(Boolean).join(' '),
  });
}

/**
 * 8. Data Workspace Recipe
 * Complete demo/page recipe composed from AppShell, WorkspaceSidebar, PageHeader, Toolbar, and DataSection.
 */
export function dataWorkspaceRecipe(options = {}) {
  const {
    brand = { name: 'Data Cloud', badge: 'v2.0' },
    navigation = [],
    projects = [],
    user = { name: 'Admin', role: 'Data Engineer' },
    title = 'Workspace Datasets',
    description = 'Explore, filter, and export real-time workspace dataset records.',
    toolbar: customToolbar = '',
    table: tableMarkup = '',
    pagination: paginationMarkup = '',
    classes = '',
  } = options;

  const sidebar = workspaceSidebar({
    brand,
    navigation,
    projects,
    user,
  });

  const header = pageHeader({
    title,
    description,
  });

  const dataSec = dataSection({
    toolbar: customToolbar || toolbar({
      items: [
        `<input type="search" class="sui-input sx-search" placeholder="Filter datasets..." style="max-width:240px;" />`,
        button({ label: 'Export CSV', variant: 'outline', size: 'sm' }),
        button({ label: 'New Dataset', variant: 'primary', size: 'sm' }),
      ],
    }),
    data: tableMarkup,
    pagination: paginationMarkup,
  });

  const page = pageLayout({
    header,
    content: dataSec,
    classes: ['sb-data-workspace-page', classes].filter(Boolean).join(' '),
  });

  return appShell({
    sidebar,
    content: page,
  });
}
