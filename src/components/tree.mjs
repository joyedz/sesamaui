import { applySurface, surfaceMode } from './shared.mjs';
import { escapeHTML, uid as uniqueId } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { iconButton } from './button.mjs';

/**
 * Pure functional builder for a single Tree Item.
 *
 * @param {object} options
 * @returns {string} HTML string
 */
function buildTreeItem(options = {}) {
  const id = options.id || options.key || uniqueId('ti');
  const label = options.label !== undefined ? options.label : (options.n || '');
  const iconName = options.icon !== undefined ? options.icon : options.i;
  const rawChildren = options.children || options.k;
  const children = Array.isArray(rawChildren) ? rawChildren : null;
  const content = options.content || '';
  const section = options.layout === 'section';
  if (options.layout && !['default', 'section'].includes(options.layout)) throw new TypeError('Invalid tree item layout');
  const isFolder = Boolean((children && children.length > 0) || content);
  const isExpanded = options.expanded !== undefined
    ? Boolean(options.expanded)
    : (options.o !== undefined ? options.o !== 0 : true);
  const isActive = Boolean(options.active || options.selected);
  const isLoading = Boolean(options.loading);
  const actions = options.actions || '';
  const attributes = options.attributes || '';

  const iconHtml = (iconName === false || iconName === null)
    ? ''
    : `<span class="c">${controlIcon(iconName || 'file-text', 14)}</span>`;

  const chevronHtml = isFolder && !section
    ? `<span class="sx-tree-chevron" aria-hidden="true">${controlIcon('chevron-down', 12)}</span>`
    : '';

  const labelHtml = `<span class="sx-tree-label">${escapeHTML(label)}</span>`;

  let buttonHtml = '';
  if (isFolder) {
    // Folders do not receive active page styling unless explicitly active
    const activeClass = (section ? ' sx-tree-section-item' : '') + (isActive ? ' on' : '');
    const activeAttr = isActive ? ' data-active="true" aria-current="page"' : '';
    buttonHtml = `<button type="button" class="ti${activeClass}" data-fold data-tree-id="${escapeHTML(id)}" aria-expanded="${isExpanded ? 'true' : 'false'}" data-tree-key="${escapeHTML(id)}"${activeAttr}${attributes ? ` ${attributes}` : ''}>${section ? labelHtml + iconHtml : chevronHtml + iconHtml + labelHtml}</button>`;
  } else {
    const activeClass = isActive ? ' on' : '';
    const activeAttr = isActive ? ' data-active="true" aria-current="page"' : '';
    buttonHtml = `<button type="button" class="ti${activeClass}" data-sel data-tree-id="${escapeHTML(id)}" data-tree-key="${escapeHTML(id)}"${activeAttr}${attributes ? ` ${attributes}` : ''}>${chevronHtml}${iconHtml}${labelHtml}</button>`;
  }

  let rowHtml = buttonHtml;
  if (actions || isLoading) {
    const loaderHtml = isLoading
      ? `<span class="sx-tree-loader" role="status" aria-label="Loading ${escapeHTML(label)}"><span class="sx-loader" aria-hidden="true" style="--loader-size:14px"></span></span>`
      : '';
    const actionsHtml = actions ? `<span class="sx-tree-actions">${actions}</span>` : '';
    rowHtml = `<div class="sx-tree-action-row">${buttonHtml}${actionsHtml}${loaderHtml}</div>`;
  }

  if (isFolder) {
    const branchHtml = content || children.map(c => treeItem(c)).join('');
    // Collapsed/expanded is an attribute (not hidden) so the branch height can
    // animate with the shared Collapsible motion tokens.
    return `${rowHtml}<div class="br${section ? ' sx-tree-section-branch' : ''}"${section ? ' role="group"' : ''} data-branch data-branch-for="${escapeHTML(id)}"${isExpanded ? ' data-open' : ''}><i></i><div>${branchHtml}</div></div>`;
  }

  return rowHtml;
}

/**
 * Pure functional builder for Tree collection.
 *
 * @param {object|Array} options
 * @returns {string} HTML string
 */
function buildTree(options = {}) {
  let items = [];
  let ariaLabel = 'Navigation tree';
  let attributes = '';

  if (Array.isArray(options)) {
    items = options;
  } else if (options && typeof options === 'object') {
    items = Array.isArray(options.items) ? options.items : [];
    if (options.ariaLabel) ariaLabel = options.ariaLabel;
    if (options.attributes) attributes = options.attributes;
  }

  const itemsHtml = items.map(item => treeItem(item)).join('');
  return `<div class="sx-tree" role="tree" aria-label="${escapeHTML(ariaLabel)}" data-sui-tree${attributes ? ` ${attributes}` : ''}>${itemsHtml}</div>`;
}

/**
 * Section wrapper for Tree navigation.
 *
 * @param {string|object} titleOrOptions
 * @param {string} [content]
 * @param {object} [options]
 * @returns {string} HTML string
 */
function buildTreeSection(titleOrOptions, content = '', options = {}) {
  let title = '';
  let body = content;
  let actionHtml = '';

  if (typeof titleOrOptions === 'object' && titleOrOptions !== null) {
    title = titleOrOptions.title || '';
    body = titleOrOptions.content || '';
    actionHtml = titleOrOptions.action || '';
  } else {
    title = String(titleOrOptions || '');
    if (options.actionIcon) {
      const label = options.actionLabel || `${title} action`;
      const attrs = options.actionAttributes || '';
      actionHtml = iconButton(options.actionIcon, { label, attributes: attrs });
    } else if (options.action) {
      actionHtml = options.action;
    }
  }

  return `<section class="sx-tree-section"><div class="sx-tree-section-header"><h2 class="sx-tree-section-title">${escapeHTML(title)}</h2>${actionHtml}</div><div class="sx-tree-section-content">${body}</div></section>`;
}

const mounted = new WeakMap();

/**
 * Controller for Tree.
 *
 * @param {HTMLElement} element
 * @returns {object} Tree controller
 */
export function initTree(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  let destroyed = false;

  function findBranch(buttonEl) {
    const parentRow = buttonEl.closest('.sx-tree-action-row');
    const target = parentRow || buttonEl;
    let next = target.nextElementSibling;
    while (next) {
      if (next.hasAttribute('data-branch')) return next;
      next = next.nextElementSibling;
    }
    return null;
  }

  function getVisibleButtons() {
    return [...element.querySelectorAll('button.ti')].filter(btn => {
      const branch = btn.closest('[data-branch]');
      if (!branch) return true;
      let curr = branch;
      while (curr && curr !== element) {
        if (!curr.hasAttribute('data-open') || curr.hidden || curr.style.display === 'none') return false;
        curr = curr.parentElement?.closest('[data-branch]');
      }
      return true;
    });
  }

  function toggleFolder(buttonEl, forceState = null) {
    if (destroyed || !buttonEl || !buttonEl.hasAttribute('data-fold')) return;

    const id = buttonEl.dataset.treeId;
    const branch = findBranch(buttonEl);
    if (!branch) return;

    const currentState = buttonEl.getAttribute('aria-expanded') === 'true';
    const nextState = forceState !== null ? forceState : !currentState;

    buttonEl.setAttribute('aria-expanded', String(nextState));
    branch.toggleAttribute('data-open', nextState);

    element.dispatchEvent(new view.CustomEvent('sui:tree:toggle', {
      bubbles: true,
      detail: { id, expanded: nextState },
    }));
  }

  function selectItem(buttonEl) {
    if (destroyed || !buttonEl) return;

    const allButtons = element.querySelectorAll('button.ti');
    for (const b of allButtons) {
      b.classList.remove('on');
      b.removeAttribute('data-active');
      b.removeAttribute('aria-current');
    }

    buttonEl.classList.add('on');
    buttonEl.dataset.active = 'true';
    buttonEl.setAttribute('aria-current', 'page');

    element.dispatchEvent(new view.CustomEvent('sui:tree:select', {
      bubbles: true,
      detail: { id: buttonEl.dataset.treeId, item: buttonEl },
    }));
  }

  function onClick(event) {
    const btn = event.target.closest('button.ti');
    if (!btn || !element.contains(btn)) return;

    if (btn.hasAttribute('data-fold')) {
      toggleFolder(btn);
    } else {
      selectItem(btn);
    }
  }

  function onKeyDown(event) {
    const btn = event.target.closest('button.ti');
    if (!btn || !element.contains(btn)) return;

    const visible = getVisibleButtons();
    const idx = visible.indexOf(btn);
    if (idx === -1) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (idx < visible.length - 1) visible[idx + 1].focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (idx > 0) visible[idx - 1].focus();
        break;
      case 'ArrowRight':
        if (btn.hasAttribute('data-fold')) {
          event.preventDefault();
          const isExpanded = btn.getAttribute('aria-expanded') === 'true';
          if (!isExpanded) {
            toggleFolder(btn, true);
          } else {
            const branch = findBranch(btn);
            const firstChild = branch?.querySelector('button.ti');
            if (firstChild) firstChild.focus();
          }
        }
        break;
      case 'ArrowLeft':
        if (btn.hasAttribute('data-fold') && btn.getAttribute('aria-expanded') === 'true') {
          event.preventDefault();
          toggleFolder(btn, false);
        } else {
          const parentBranch = btn.closest('[data-branch]');
          if (parentBranch) {
            event.preventDefault();
            let prev = parentBranch.previousElementSibling;
            while (prev) {
              const prevBtn = prev.matches('button.ti') ? prev : prev.querySelector('button.ti');
              if (prevBtn && prevBtn.hasAttribute('data-fold')) {
                prevBtn.focus();
                break;
              }
              prev = prev.previousElementSibling;
            }
          }
        }
        break;
      case 'Home':
        event.preventDefault();
        if (visible.length) visible[0].focus();
        break;
      case 'End':
        event.preventDefault();
        if (visible.length) visible[visible.length - 1].focus();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (btn.hasAttribute('data-fold')) {
          toggleFolder(btn);
        } else {
          selectItem(btn);
        }
        break;
      default:
        break;
    }
  }

  element.addEventListener('click', onClick);
  element.addEventListener('keydown', onKeyDown);

  const controller = {
    expand(id) {
      const btn = element.querySelector(`button.ti[data-tree-id="${id}"]`);
      if (btn && btn.hasAttribute('data-fold')) toggleFolder(btn, true);
    },
    collapse(id) {
      const btn = element.querySelector(`button.ti[data-tree-id="${id}"]`);
      if (btn && btn.hasAttribute('data-fold')) toggleFolder(btn, false);
    },
    toggle(id) {
      const btn = element.querySelector(`button.ti[data-tree-id="${id}"]`);
      if (btn && btn.hasAttribute('data-fold')) toggleFolder(btn);
    },
    select(id) {
      const btn = element.querySelector(`button.ti[data-tree-id="${id}"]`);
      if (btn) selectItem(btn);
    },
    getSelected() {
      const activeBtn = element.querySelector('button.ti.on, button.ti[data-active="true"]');
      return activeBtn ? activeBtn.dataset.treeId : null;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      element.removeEventListener('click', onClick);
      element.removeEventListener('keydown', onKeyDown);
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}


export function treeItem(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildTreeItem(...args), mode, ["@root"]);
}

export function tree(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildTree(...args), mode, ["@root"]);
}

export function treeSection(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildTreeSection(...args), mode, ["@root"]);
}
