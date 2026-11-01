import { uid, escapeHTML } from './shared.mjs';
import { button } from './button.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { menu } from './menu.mjs';
import { initDropdownMenu } from './dropdown-menu.mjs';

/**
 * Pure builder for Button Group and Split Buttons.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function buttonGroup(options = {}) {
  const {
    id = uid(),
    buttons = [],
    split = false,
    menu: splitMenu = null,
    variant = 'secondary',
    size = 'sm',
    attributes = '',
  } = options;

  const menuId = `${id}-menu`;

  function renderBtn(btn, index) {
    if (!btn) return '';
    if (typeof btn === 'string') {
      if (btn.trim().startsWith('<')) return btn;
      return button({ label: btn, variant, size });
    }
    return button({ variant, size, ...btn });
  }

  let buttonsContent = '';
  let menuContent = '';

  if (split) {
    const mainBtn = buttons[0] || { label: 'Action' };
    const mainBtnMarkup = renderBtn(mainBtn, 0);
    const triggerAttrs = `popovertarget="${escapeHTML(menuId)}" aria-label="More actions" aria-haspopup="menu" aria-expanded="false" data-sui-dropdown-trigger data-sui-button-group-split-trigger`;
    const chevronBtn = button({
      label: '',
      icon: controlIcon('chevron-down', 16),
      variant,
      size,
      attributes: triggerAttrs,
    });
    buttonsContent = `${mainBtnMarkup}${chevronBtn}`;

    const menuItems = splitMenu?.items || (splitMenu?.groups ? null : [
      { label: 'Action 1' },
      { label: 'Action 2' },
    ]);
    const menuGroups = splitMenu?.groups || null;

    menuContent = menu({
      id: menuId,
      items: menuItems,
      groups: menuGroups,
      ariaLabel: splitMenu?.ariaLabel || 'More actions',
      attributes: 'popover="manual" data-sui-dropdown-menu-list data-sui-button-group-split-menu',
    });
  } else {
    buttonsContent = buttons.map(renderBtn).join('');
  }

  return `<div class="sx-row" data-sui-button-group-wrapper${attributes ? ` ${attributes}` : ''}><div id="${escapeHTML(id)}" class="sx-button-group" data-sui-button-group role="group">${buttonsContent}</div>${menuContent}</div>`;
}

const mounted = new WeakMap();

/**
 * Controller for Button Group.
 * Coordinates split dropdown triggers if present.
 *
 * @param {HTMLElement} element
 * @returns {object} Button Group controller
 */
export function initButtonGroup(element) {
  if (mounted.has(element)) return mounted.get(element);

  let dropdownCtrl = null;
  const splitTrigger = element.querySelector('[data-sui-button-group-split-trigger]');
  const splitMenu = element.querySelector('[data-sui-button-group-split-menu]');

  if (splitTrigger && splitMenu) {
    dropdownCtrl = initDropdownMenu(element);
  }

  const controller = {
    destroy() {
      dropdownCtrl?.destroy();
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
