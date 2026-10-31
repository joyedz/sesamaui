import { uid, escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

/**
 * Pure functional builder for Menu Item rows.
 * Supports action, link, check, and radio menu items.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function menuItem(options = {}) {
  const {
    id = uid(),
    label = '',
    icon = null,
    shortcut = null,
    disabled = false,
    danger = false,
    destructive = false,
    role = 'menuitem',
    checked = false,
    href = null,
    attributes = '',
  } = options;

  const isDanger = Boolean(danger || destructive);
  const classes = ['sx-menu-item', isDanger ? 'danger' : ''].filter(Boolean).join(' ');

  const isCheck = role === 'menuitemcheckbox';
  const isRadio = role === 'menuitemradio';
  const hasAriaChecked = isCheck || isRadio;

  let checkIndicator = '';
  if (isCheck) {
    checkIndicator = `<span class="sx-menu-check" aria-hidden="true">${checked ? controlIcon('check', 14) : ''}</span>`;
  } else if (isRadio) {
    checkIndicator = `<span class="sx-menu-radio" aria-hidden="true">${checked ? controlIcon('check', 14) : ''}</span>`;
  }

  let iconMarkup = '';
  if (icon) {
    iconMarkup = controlIcon(icon, 16);
  }

  const labelMarkup = `<span>${escapeHTML(label)}</span>`;
  const shortcutMarkup = shortcut ? `<kbd>${escapeHTML(shortcut)}</kbd>` : '';

  const ariaCheckedAttr = hasAriaChecked ? ` aria-checked="${Boolean(checked)}"` : '';

  if (href) {
    const disabledAttr = disabled ? ' aria-disabled="true" tabindex="-1"' : '';
    return `<a id="${escapeHTML(id)}" class="${classes}" role="${role}" href="${disabled ? '#' : escapeHTML(href)}"${disabledAttr} data-sui-menu-item data-sui-menu-id="${escapeHTML(id)}"${ariaCheckedAttr}${attributes ? ` ${attributes}` : ''}>${iconMarkup}${labelMarkup}${checkIndicator}${shortcutMarkup}</a>`;
  }

  const disabledAttr = disabled ? ' disabled aria-disabled="true"' : '';
  return `<button type="button" id="${escapeHTML(id)}" class="${classes}" role="${role}" data-sui-menu-item data-sui-menu-id="${escapeHTML(id)}"${ariaCheckedAttr}${disabledAttr}${attributes ? ` ${attributes}` : ''}>${iconMarkup}${labelMarkup}${checkIndicator}${shortcutMarkup}</button>`;
}
