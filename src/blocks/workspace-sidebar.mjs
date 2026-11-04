import { applySurface, surfaceMode } from '../components/shared.mjs';
import { escapeHTML, uid } from '../components/shared.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { tree, treeSection, initTree } from '../components/tree.mjs';
import { select } from '../components/select.mjs';
import { avatar } from '../components/avatar.mjs';

const sidebarSymbol = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 363 315" fill="none" aria-hidden="true" focusable="false">
<path d="M340.11 56.1444C377.218 114.629 336.221 207.139 248.542 262.77C160.863 318.401 59.7028 316.087 22.5951 257.602C-14.5126 199.117 26.4837 106.608 114.163 50.9768C201.842 -4.65419 303.002 -2.34058 340.11 56.1444Z" stroke-width="16" stroke="currentColor" />

<path d="M336.242 86.4448C366.393 133.965 327.821 212.468 250.09 261.787C172.359 311.107 84.9037 312.565 54.753 265.045C24.6024 217.525 63.174 139.021 140.905 89.7023C218.636 40.3832 306.092 38.9248 336.242 86.4448Z" stroke-width="16" stroke="currentColor" />

<path d="M328.923 120.549C351.713 156.469 317.903 218.761 253.406 259.684C188.909 300.606 118.149 304.661 95.3584 268.742C72.5681 232.822 106.378 170.53 170.875 129.608C235.372 88.6854 306.133 84.6298 328.923 120.549Z" stroke-width="16" stroke="currentColor" />
</svg>`;

const DEFAULT_WORKSPACES = [
  { label: 'Sesama workspace', icon: 'folder' },
  { label: 'Personal workspace', icon: 'circle-user' },
  { label: 'Design team', icon: 'users' }
];

/**
 * Pure functional builder for Workspace Sidebar.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
function buildWorkspaceSidebar(options = {}) {
  const {
    id = uid('sidebar'),
    variant = 'default',
    brand = null,
    workspace = options.brand?.name || options.workspace || 'Sesama workspace',
    workspaces = DEFAULT_WORKSPACES,
    workspaceSelector = options.workspaceSelector || options.selector || '',
    navigation = [],
    groups = [],
    projects = [],
    projectsTitle = 'Projects',
    projectActions = '',
    profile = '',
    user = null,
    profileName = options.user?.name || options.profileName || 'Nils Eller',
    profileRole = options.user?.role || options.profileRole || '',
    initials = options.user?.avatar?.fallback || options.user?.initials || options.initials || 'N',
    attributes = '',
    classes = '',
  } = options;

  if (!['default', 'conversation', 'compact'].includes(variant)) throw new TypeError(`Invalid sidebar variant: ${variant}`);
  const classList = [
    'sb-sidebar',
    'sx-workspace-sidebar',
    variant === 'conversation' ? 'sx-sidebar-conversation' : '',
    classes
  ].filter(Boolean).join(' ');

  let brandHTML = '';
  if (brand) {
    const brandName = typeof brand === 'string' ? brand : (brand.name || '');
    const brandBadge = brand.badge ? `<span class="badge sm">${escapeHTML(brand.badge)}</span>` : '';
    brandHTML = `<div class="sb-brand"><span class="sb-brand-name">${escapeHTML(brandName)}</span>${brandBadge}</div>`;
  }

  // Workspace selector
  let selectorHTML = workspaceSelector;
  if (!selectorHTML) {
    const allWorkspaces = Array.isArray(workspaces) ? [...workspaces] : DEFAULT_WORKSPACES;
    const exists = allWorkspaces.some(w => (typeof w === 'string' ? w : w.label) === workspace);
    if (!exists && workspace) {
      allWorkspaces.unshift({ label: workspace, icon: 'folder' });
    }
    const curIcon = allWorkspaces.find(w => (typeof w === 'string' ? w : w.label) === workspace)?.icon || 'folder';
    selectorHTML = select({
      name: 'workspace',
      ariaLabel: 'Workspace',
      size: 'lg',
      icon: curIcon,
      value: workspace,
      groups: [{ label: 'Your workspaces', options: allWorkspaces }],
      actions: [{ key: 'create-workspace', label: 'Create workspace', icon: 'plus' }]
    });
  }

  // Navigation content
  let navHTML = '';
  if (Array.isArray(navigation) && navigation.length > 0) {
    navHTML = tree(navigation);
  } else if (typeof navigation === 'string') {
    navHTML = navigation;
  }

  // Groups
  let groupsHTML = '';
  if (Array.isArray(groups) && groups.length > 0) {
    groupsHTML = groups.map(g => {
      const itemsContent = Array.isArray(g.items) ? tree(g.items) : (g.items || '');
      return treeSection(g.title || '', itemsContent);
    }).join('');
  }

  // Projects
  const projectsContent = Array.isArray(projects) ? tree(projects) : (projects || '');
  const projSectionHTML = projectsTitle === '' && !projectActions
    ? `<section class="sx-tree-section">${projectsContent}</section>`
    : treeSection(projectsTitle, projectsContent, typeof projectActions === 'object' ? projectActions : {});

  // Profile
  let profileHTML = profile;
  if (!profileHTML) {
    const avatarHTML = avatar({ name: profileName, initials, size: 24, color: 'auto' });
    const roleHTML = profileRole ? `<span class="sb-profile-role">${escapeHTML(profileRole)}</span>` : '';
    profileHTML = `<footer class="sb-profile"><button type="button" class="sb-profile-trigger" aria-label="Profile menu for ${escapeHTML(profileName)}">${avatarHTML}<span class="sb-profile-info"><span class="sb-profile-name">${escapeHTML(profileName)}</span>${roleHTML}</span></button><button type="button" class="ibtn" data-shell-theme aria-label="Toggle theme">${controlIcon('sun', 16)}</button><button type="button" class="ibtn" data-sidebar-notifications aria-label="Notifications">${controlIcon('bell', 16)}</button></footer>`;
  }

  const extraAttrs = [];
  if (attributes) {
    if (typeof attributes === 'string') {
      extraAttrs.push(attributes);
    } else if (typeof attributes === 'object') {
      for (const [k, v] of Object.entries(attributes)) {
        extraAttrs.push(`${k}="${escapeHTML(v)}"`);
      }
    }
  }

  if (variant === 'compact') {
    return `<aside class="${classList} sx-sidebar-compact" data-sui-workspace-sidebar data-sidebar-compact id="${escapeHTML(id)}" ${extraAttrs.join(' ')}><div class="sb-compact-brand" aria-hidden="true">${sidebarSymbol}</div><nav class="sb-navigation sx-sidebar-nav" aria-label="Workspace navigation">${navHTML}${groupsHTML}</nav><div class="sb-compact-footer">${profile || ''}</div></aside>`;
  }

  return `<aside class="${classList}" data-sui-workspace-sidebar id="${escapeHTML(id)}" ${extraAttrs.join(' ')}><div class="sb-sidebar-top">${brandHTML}${options.headerAction !== undefined ? options.headerAction : `<button type="button" class="ibtn" data-shell-toggle aria-expanded="true" aria-label="Hide sidebar"><span class="sb-sidebar-logo">${sidebarSymbol}</span><span class="sb-sidebar-toggle-icon">${controlIcon('panel-left', 16)}</span></button>`}${selectorHTML}</div><nav class="sb-navigation sx-sidebar-nav" aria-label="Workspace navigation">${navHTML}${groupsHTML}</nav><div class="sb-projects sx-scroll-area"><button type="button" class="ibtn sb-projects-rail" aria-label="${escapeHTML(projectsTitle)}">${controlIcon('kebab', 16)}</button>${projSectionHTML}</div>${profileHTML}</aside>`;
}

/**
 * Compatibility alias for Workspace Sidebar.
 */
function buildSidebar(options = {}) {
  return workspaceSidebar(options);
}

const instances = new WeakMap();

/**
 * Initialize Workspace Sidebar controller.
 *
 * @param {HTMLElement} element
 * @returns {object|null} Controller instance
 */
export function initWorkspaceSidebar(element) {
  if (!element) return null;
  if (instances.has(element)) return instances.get(element);

  // Initialize tree controller if tree is present
  const treeControllers = [...element.querySelectorAll('[data-sui-tree]')].map(root => initTree(root));

  function handleClick(e) {
    const item = e.target.closest('[data-tree-key]');
    if (item && !item.hasAttribute('data-fold')) {
      const key = item.dataset.treeKey;
      const label = item.textContent?.trim() || '';
      element.dispatchEvent(new CustomEvent('sui:sidebar:select', {
        bubbles: true,
        detail: { key, label }
      }));
    }

    const railBtn = e.target.closest('.sb-projects-rail');
    if (railBtn) {
      const shell = element.closest('.sb-app-shell, [data-sui-app-shell]');
      if (shell) {
        shell.classList.remove('is-collapsed');
        shell.querySelector('[data-shell-toggle]')?.setAttribute('aria-expanded', 'true');
      }
    }
  }

  element.addEventListener('click', handleClick);

  const controller = {
    element,
    destroy() {
      element.removeEventListener('click', handleClick);
      treeControllers.forEach(controller => controller.destroy());
      instances.delete(element);
    }
  };

  instances.set(element, controller);
  return controller;
}


export function workspaceSidebar(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildWorkspaceSidebar(...args), mode, ["sb-sidebar"]);
}

export function sidebar(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildSidebar(...args), mode, ["sb-sidebar"]);
}
