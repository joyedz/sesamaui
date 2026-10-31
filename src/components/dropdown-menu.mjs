import { uid, escapeHTML } from './shared.mjs';
import { button } from './button.mjs';
import { menu, initMenu } from './menu.mjs';
import { positionOverlay, createDismissManager } from './overlay-helpers.mjs';

/**
 * Pure builder for Dropdown Menu.
 * Composes Button and Menu.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function dropdownMenu(options = {}) {
  const {
    id = uid(),
    trigger = 'Actions',
    items = [],
    groups = null,
    placement = 'bottom',
    ariaLabel = 'Menu',
    attributes = '',
  } = options;

  const menuId = `${id}-menu`;

  let triggerMarkup = '';
  if (typeof trigger === 'string') {
    if (trigger.includes('data-sui-dropdown-trigger') || trigger.includes('popovertarget')) {
      triggerMarkup = trigger;
    } else {
      triggerMarkup = `<button type="button" class="btn secondary" popovertarget="${escapeHTML(menuId)}" aria-haspopup="menu" aria-expanded="false" data-sui-dropdown-trigger>${escapeHTML(trigger)}</button>`;
    }
  } else if (typeof trigger === 'object') {
    const { label = 'Actions', variant = 'secondary', icon = null, ...rest } = trigger;
    const triggerAttrs = `popovertarget="${escapeHTML(menuId)}" aria-haspopup="menu" aria-expanded="false" data-sui-dropdown-trigger${rest.attributes ? ` ${rest.attributes}` : ''}`;
    triggerMarkup = button({ label, variant, icon, attributes: triggerAttrs, ...rest });
  }

  const menuMarkup = menu({
    id: menuId,
    items,
    groups,
    ariaLabel,
    attributes: 'popover="manual" data-sui-dropdown-menu-list',
  });

  return `<div data-sui-dropdown data-sui-dropdown-menu data-placement="${escapeHTML(placement)}" class="sx-dropdown"${attributes ? ` ${attributes}` : ''}>${triggerMarkup}${menuMarkup}</div>`;
}

const mounted = new WeakMap();

/**
 * Controller for Dropdown Menu.
 * Manages trigger, menu popover, positioning, outside click, surrounding scroll, and keyboard navigation.
 *
 * @param {HTMLElement} element
 * @returns {object} Dropdown Menu controller
 */
export function initDropdownMenu(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  const trigger = element.querySelector('[data-sui-dropdown-trigger], [popovertarget]');
  const menuList = element.querySelector('[data-sui-dropdown-menu-list], [role="menu"]');

  if (!trigger || !menuList) {
    throw new TypeError('Dropdown Menu markup is incomplete');
  }

  const placement = element.dataset.placement || 'bottom';
  const menuCtrl = initMenu(menuList);
  let isOpen = false;
  let destroyed = false;

  const dismissManager = createDismissManager({
    popup: menuList,
    trigger,
    onDismiss: (reason) => {
      close(reason === 'escape');
    },
    onReposition: () => {
      if (isOpen) positionOverlay(trigger, menuList, placement);
    },
  });

  function open(focusTarget = 'first') {
    if (destroyed || isOpen || trigger.disabled || trigger.matches(':disabled,[aria-disabled="true"]')) return;
    isOpen = true;
    trigger.setAttribute('aria-expanded', 'true');
    menuList.showPopover();
    positionOverlay(trigger, menuList, placement);
    dismissManager.bind();

    if (focusTarget === 'first') {
      menuCtrl.focusFirst();
    } else if (focusTarget === 'last') {
      menuCtrl.focusLast();
    }

    element.dispatchEvent(new view.CustomEvent('sui:dropdown:open', {
      bubbles: true,
      detail: { id: menuList.id, trigger, menu: menuList },
    }));
  }

  function close(focusTrigger = false) {
    if (destroyed || !isOpen) return;
    isOpen = false;
    trigger.setAttribute('aria-expanded', 'false');
    menuList.hidePopover();
    dismissManager.unbind();

    if (focusTrigger && trigger.isConnected) {
      trigger.focus({ preventScroll: true });
    }

    element.dispatchEvent(new view.CustomEvent('sui:dropdown:close', {
      bubbles: true,
      detail: { id: menuList.id, trigger, menu: menuList },
    }));
  }

  function toggle() {
    if (isOpen) close(true);
    else open('first');
  }

  function onTriggerClick(event) {
    if (destroyed) return;
    event.preventDefault();
    toggle();
  }

  function onTriggerKeyDown(event) {
    if (destroyed || trigger.disabled) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      open('first');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      open('last');
    }
  }

  function onMenuSelect(event) {
    if (destroyed) return;
    const detail = event.detail || {};
    // Emit dropdown select event
    element.dispatchEvent(new view.CustomEvent('sui:dropdown:select', {
      bubbles: true,
      detail,
    }));

    // If it's a regular action or link (not a checkbox that keeps menu open), close
    if (detail.role !== 'menuitemcheckbox') {
      close(true);
    }
  }

  function onMenuClose(event) {
    if (destroyed) return;
    close(true);
  }

  trigger.addEventListener('click', onTriggerClick);
  trigger.addEventListener('keydown', onTriggerKeyDown);
  menuList.addEventListener('sui:menu:select', onMenuSelect);
  menuList.addEventListener('sui:menu:close', onMenuClose);

  const controller = {
    open,
    close,
    toggle,
    isOpen: () => isOpen,
    selectItem: (id) => menuCtrl.selectItem(id),
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (isOpen) close();
      trigger.removeEventListener('click', onTriggerClick);
      trigger.removeEventListener('keydown', onTriggerKeyDown);
      menuList.removeEventListener('sui:menu:select', onMenuSelect);
      menuList.removeEventListener('sui:menu:close', onMenuClose);
      dismissManager.unbind();
      menuCtrl.destroy();
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
