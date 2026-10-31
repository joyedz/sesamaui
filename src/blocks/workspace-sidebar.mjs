import { escapeHTML, uid } from '../components/shared.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { tree, treeSection, initTree } from '../components/tree.mjs';
import { select } from '../components/select.mjs';
import { avatar } from '../components/avatar.mjs';

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
export function workspaceSidebar(options = {}) {
  const {
    id = uid('sidebar'),
    brand = null,
    workspace = options.brand?.name || options.workspace || 'Sesama workspace',
    workspaces = DEFAULT_WORKSPACES,
    workspaceSelector = options.workspaceSelector || options.selector || '',
    navigation = [],
    groups = [],
    projects = [],
    projectActions = '',
    profile = '',
    user = null,
    profileName = options.user?.name || options.profileName || 'Nils Eller',
    profileRole = options.user?.role || options.profileRole || '',
    initials = options.user?.avatar?.fallback || options.user?.initials || options.initials || 'N',
    attributes = '',
    classes = '',
  } = options;

  const classList = [
    'sb-sidebar',
    'sx-workspace-sidebar',
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
      inline: true,
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
  const projSectionHTML = treeSection('Projects', projectsContent, typeof projectActions === 'object' ? projectActions : {});

  // Profile
  let profileHTML = profile;
  if (!profileHTML) {
    const avatarHTML = avatar({ name: profileName, initials, size: 24, color: 'auto' });
    const roleHTML = profileRole ? `<span class="sb-profile-role">${escapeHTML(profileRole)}</span>` : '';
    profileHTML = `<footer class="sb-profile"><button type="button" class="sb-profile-trigger" aria-label="Profile menu for ${escapeHTML(profileName)}">${avatarHTML}<span class="sb-profile-info"><span class="sb-profile-name">${escapeHTML(profileName)}</span>${roleHTML}</span></button><button type="button" class="ibtn" data-shell-theme aria-label="Toggle theme" title="Toggle theme">${controlIcon('sun', 16)}</button><button type="button" class="ibtn" data-sidebar-notifications aria-label="Notifications" title="Notifications">${controlIcon('bell', 16)}</button></footer>`;
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

  return `<aside class="${classList}" data-sui-workspace-sidebar id="${escapeHTML(id)}" ${extraAttrs.join(' ')}><div class="sb-sidebar-top">${brandHTML}${selectorHTML}<button type="button" class="ibtn" data-shell-toggle aria-expanded="true" aria-label="Hide sidebar" title="Hide sidebar">${controlIcon('panel-left', 16)}</button></div><nav class="sb-navigation sx-sidebar-nav" aria-label="Workspace navigation">${navHTML}${groupsHTML}</nav><div class="sb-projects sx-scroll-area"><button type="button" class="ibtn sb-projects-rail" aria-label="Projects" title="Projects">${controlIcon('kebab', 16)}</button>${projSectionHTML}</div>${profileHTML}</aside>`;
}

/**
 * Compatibility alias for Workspace Sidebar.
 */
export function sidebar(options = {}) {
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
  const treeController = initTree(element);

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
      treeController?.destroy();
      instances.delete(element);
    }
  };

  instances.set(element, controller);
  return controller;
}
