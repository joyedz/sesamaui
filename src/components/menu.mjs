import { uid, escapeHTML } from './shared.mjs';
import { menuItem } from './menu-item.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { getNextFocusableIndex, positionOverlay } from './overlay-helpers.mjs';

/**
 * Pure builder for menu collections.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function menu(options = {}) {
  const {
    id = uid(),
    ariaLabel = 'Menu',
    items = [],
    groups = null,
    attributes = '',
  } = options;

  function renderItem(item) {
    if (!item) return '';
    if (typeof item === 'string') {
      if (item.trim().startsWith('<')) return item;
      return menuItem({ label: item });
    }
    if (item.type === 'separator') {
      return '<div class="hr" role="separator" aria-hidden="true"></div>';
    }
    if (item.type === 'group') {
      const groupItems = (item.items || []).map(renderItem).join('');
      return `<div role="group" aria-label="${escapeHTML(item.label || '')}"><div class="sx-menu-label">${escapeHTML(item.label || '')}</div>${groupItems}</div>`;
    }
    return menuItem(item);
  }

  let content = '';
  if (groups && Array.isArray(groups)) {
    content = groups.map((group, index) => {
      const sep = index > 0 ? '<div class="hr" role="separator" aria-hidden="true"></div>' : '';
      const groupItems = (group.items || []).map(renderItem).join('');
      return `${sep}<div role="group" aria-label="${escapeHTML(group.label || '')}"><div class="sx-menu-label">${escapeHTML(group.label || '')}</div>${groupItems}</div>`;
    }).join('');
  } else if (Array.isArray(items)) {
    content = items.map(renderItem).join('');
  }

  return `<div id="${escapeHTML(id)}" class="sx-popup sx-menu-list" role="menu" aria-label="${escapeHTML(ariaLabel)}" data-sui-menu${attributes ? ` ${attributes}` : ''}>${content}</div>`;
}

const mounted = new WeakMap();

/**
 * Controller for menu collections.
 * Handles keyboard navigation, selection, check/radio state, and event dispatch.
 *
 * @param {HTMLElement} element
 * @returns {object} Menu controller
 */
export function initMenu(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  let destroyed = false;

  const getItems = () => [...element.querySelectorAll('[data-sui-menu-item]')];
  const getEnabledItems = () => getItems().filter(el => !el.disabled && !el.matches(':disabled,[aria-disabled="true"]'));

  function activateItem(itemEl) {
    if (!itemEl || itemEl.disabled || itemEl.matches(':disabled,[aria-disabled="true"]')) return;

    const role = itemEl.getAttribute('role');
    const id = itemEl.dataset.suiMenuId || itemEl.id;
    const label = itemEl.querySelector('span')?.textContent || itemEl.textContent.trim();
    let checked = undefined;

    if (role === 'menuitemcheckbox') {
      const current = itemEl.getAttribute('aria-checked') === 'true';
      checked = !current;
      itemEl.setAttribute('aria-checked', String(checked));
      const checkSlot = itemEl.querySelector('.sx-menu-check');
      if (checkSlot) {
        checkSlot.innerHTML = checked ? controlIcon('check', 14) : '';
      }
    } else if (role === 'menuitemradio') {
      checked = true;
      const group = itemEl.closest('[role="group"]') || element;
      group.querySelectorAll('[role="menuitemradio"]').forEach(sibling => {
        sibling.setAttribute('aria-checked', 'false');
        const radioSlot = sibling.querySelector('.sx-menu-radio');
        if (radioSlot) radioSlot.innerHTML = '';
      });
      itemEl.setAttribute('aria-checked', 'true');
      const radioSlot = itemEl.querySelector('.sx-menu-radio');
      if (radioSlot) radioSlot.innerHTML = controlIcon('check', 14);
    }

    element.dispatchEvent(new view.CustomEvent('sui:menu:select', {
      bubbles: true,
      detail: { id, label, role, checked, element: itemEl },
    }));

    if (role !== 'menuitemcheckbox' && element.hasAttribute?.('popover') && element.matches?.(':popover-open')) {
      try { element.hidePopover(); } catch {}
    }
  }

  function onKeyDown(event) {
    if (destroyed) return;
    const enabled = getEnabledItems();
    if (enabled.length === 0) return;

    const activeEl = element.ownerDocument?.activeElement;
    const currentIndex = enabled.indexOf(activeEl);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIdx = getNextFocusableIndex(enabled, currentIndex, 1);
      if (nextIdx >= 0) enabled[nextIdx].focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const nextIdx = getNextFocusableIndex(enabled, currentIndex, -1);
      if (nextIdx >= 0) enabled[nextIdx].focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      enabled[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      enabled[enabled.length - 1]?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (activeEl && element.contains(activeEl)) {
        event.preventDefault();
        activateItem(activeEl);
      }
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      element.dispatchEvent(new view.CustomEvent('sui:menu:close', {
        bubbles: true,
        detail: { key: event.key },
      }));
    }
  }

  function onClick(event) {
    if (destroyed) return;
    const itemEl = event.target.closest('[data-sui-menu-item]');
    if (itemEl && element.contains(itemEl)) {
      activateItem(itemEl);
    }
  }

  function onToggle(event) {
    if (destroyed) return;
    const trigger = element.ownerDocument?.querySelector(`[popovertarget="${element.id}"]`);
    if (trigger) trigger.setAttribute('aria-expanded', String(event.newState === 'open'));
    if (event.newState === 'open') {
      if (trigger && !element.closest?.('[data-sui-dropdown]')) {
        positionOverlay(trigger, element, 'bottom', { gap: 6 });
      }
      const first = getEnabledItems()[0];
      first?.focus({ preventScroll: true });
      view.addEventListener?.('scroll', onScroll, { capture: true, passive: true });
      view.addEventListener?.('resize', onResize, { passive: true });
    } else {
      view.removeEventListener?.('scroll', onScroll, true);
      view.removeEventListener?.('resize', onResize);
    }
  }

  function onScroll(event) {
    if (destroyed || !element.matches?.(':popover-open')) return;
    if (!event.target || !(event.target instanceof (view.Node || Object)) || element.contains(event.target)) return;
    if (element.closest?.('[data-sui-dropdown]')) return; // dropdown controller owns repositioning
    const trigger = element.ownerDocument?.querySelector(`[popovertarget="${element.id}"]`);
    if (trigger) positionOverlay(trigger, element, 'bottom', { gap: 6 });
  }

  function onResize() {
    if (destroyed || !element.matches?.(':popover-open')) return;
    const trigger = element.ownerDocument?.querySelector(`[popovertarget="${element.id}"]`);
    if (trigger && !element.closest?.('[data-sui-dropdown]')) positionOverlay(trigger, element, 'bottom', { gap: 6 });
  }

  if (element.hasAttribute?.('popover')) {
    element.addEventListener?.('toggle', onToggle);
  }

  element.addEventListener('keydown', onKeyDown);
  element.addEventListener('click', onClick);

  const controller = {
    getItems,
    getActiveItem() {
      const active = element.ownerDocument?.activeElement;
      return active && element.contains(active) ? active : null;
    },
    selectItem(target) {
      const itemEl = typeof target === 'string'
        ? element.querySelector(`[data-sui-menu-id="${target}"], #${target}`)
        : target;
      if (itemEl) activateItem(itemEl);
    },
    focusFirst() {
      const enabled = getEnabledItems();
      enabled[0]?.focus({ preventScroll: true });
    },
    focusLast() {
      const enabled = getEnabledItems();
      enabled[enabled.length - 1]?.focus({ preventScroll: true });
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (element.hasAttribute?.('popover')) {
        element.removeEventListener?.('toggle', onToggle);
        view.removeEventListener?.('scroll', onScroll, true);
        view.removeEventListener?.('resize', onResize);
      }
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('click', onClick);
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
