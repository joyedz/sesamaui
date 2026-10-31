import { escapeHTML } from './shared.mjs';
import { button, iconButton } from './button.mjs';

const VALID_ORIENTATIONS = new Set(['horizontal', 'vertical']);
const VALID_SIZES = new Set(['sm', 'base']);

function renderToolbarItem(item, orientation) {
  if (typeof item === 'string') {
    if (item === 'separator' || item === '|') {
      return `<div class="sx-toolbar-separator" role="separator" aria-orientation="${orientation === 'vertical' ? 'horizontal' : 'vertical'}"></div>`;
    }
    return item;
  }

  if (!item || typeof item !== 'object') return '';

  if (item.type === 'separator') {
    return `<div class="sx-toolbar-separator" role="separator" aria-orientation="${orientation === 'vertical' ? 'horizontal' : 'vertical'}"></div>`;
  }

  if (item.type === 'group' && Array.isArray(item.items)) {
    const groupAttrs = item.ariaLabel ? ` aria-label="${escapeHTML(item.ariaLabel)}"` : '';
    const groupItems = item.items.map(subItem => renderToolbarItem(subItem, orientation)).join('');
    return `<div class="sx-toolbar-group" role="group"${groupAttrs}>${groupItems}</div>`;
  }

  if (item.html) {
    return item.html;
  }

  if (item.icon && !item.label) {
    return iconButton(item.icon, item);
  }

  if (item.label) {
    return button(item);
  }

  return '';
}

/**
 * Pure functional builder for Toolbar.
 *
 * @param {object} [options]
 * @returns {string} HTML string
 */
export function toolbar(options = {}) {
  const {
    ariaLabel = 'Toolbar',
    items: rawItems = [],
    orientation = 'horizontal',
    size = 'base',
    attributes = '',
  } = options;

  const validOrientation = VALID_ORIENTATIONS.has(orientation) ? orientation : 'horizontal';
  const validSize = VALID_SIZES.has(size) ? size : 'base';
  const items = Array.isArray(rawItems) ? rawItems : [];

  const itemsHtml = items.map(item => renderToolbarItem(item, validOrientation)).join('');

  return `<div role="toolbar" class="sx-toolbar sx-toolbar-${validOrientation} sx-toolbar-${validSize}" aria-label="${escapeHTML(ariaLabel)}" aria-orientation="${validOrientation}" data-sui-toolbar${attributes ? ` ${attributes}` : ''}>${itemsHtml}</div>`;
}
