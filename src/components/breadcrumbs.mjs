import { escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

function renderSeparator(separator = 'chevron-right') {
  if (typeof separator === 'string' && separator.trim().startsWith('<svg')) {
    return separator;
  }
  try {
    return controlIcon(separator, 12);
  } catch {
    return escapeHTML(separator);
  }
}

/**
 * Pure functional builder for Breadcrumbs.
 *
 * @param {object} [options]
 * @returns {string} HTML string
 */
export function breadcrumbs(options = {}) {
  const {
    items: rawItems = [],
    separator = 'chevron-right',
    maxItems,
    ariaLabel = 'Breadcrumbs',
    attributes = '',
  } = options;

  const items = Array.isArray(rawItems) ? rawItems : [];
  if (!items.length) {
    return `<nav aria-label="${escapeHTML(ariaLabel)}" class="sx-breadcrumbs-nav" data-sui-breadcrumbs${attributes ? ` ${attributes}` : ''}><ol class="sx-breadcrumbs"></ol></nav>`;
  }

  const sepMarkup = `<li class="sx-breadcrumb-separator" aria-hidden="true" role="presentation">${renderSeparator(separator)}</li>`;

  let displayItems = items;
  let hasCollapsed = false;

  if (typeof maxItems === 'number' && maxItems > 1 && items.length > maxItems) {
    hasCollapsed = true;
    const head = items.slice(0, 1);
    const tailCount = maxItems - 1;
    const tail = items.slice(items.length - tailCount);
    displayItems = { head, tail };
  }

  function renderItem(item, isLast) {
    const isCurrent = Boolean(item.current || (!item.href && isLast));
    const iconHtml = item.icon ? `<span class="sx-breadcrumb-icon" aria-hidden="true">${controlIcon(item.icon, 14)}</span>` : '';
    const labelHtml = escapeHTML(item.label || '');

    if (isCurrent) {
      return `<li class="sx-breadcrumb-item"><span class="sx-breadcrumb-current" aria-current="page">${iconHtml}${labelHtml}</span></li>`;
    }
    if (item.href) {
      return `<li class="sx-breadcrumb-item"><a href="${escapeHTML(item.href)}" class="sx-breadcrumb-link">${iconHtml}${labelHtml}</a></li>`;
    }
    return `<li class="sx-breadcrumb-item"><span class="sx-breadcrumb-text">${iconHtml}${labelHtml}</span></li>`;
  }

  let listHtml = '';
  if (hasCollapsed) {
    const { head, tail } = displayItems;
    const headHtml = head.map(item => renderItem(item, false)).join(sepMarkup);
    const tailHtml = tail.map((item, idx) => renderItem(item, idx === tail.length - 1)).join(sepMarkup);
    const ellipsisHtml = `<li class="sx-breadcrumb-item"><button type="button" class="sx-breadcrumb-ellipsis" aria-label="Show more breadcrumbs">…</button></li>`;
    listHtml = `${headHtml}${sepMarkup}${ellipsisHtml}${sepMarkup}${tailHtml}`;
  } else {
    listHtml = items.map((item, idx) => renderItem(item, idx === items.length - 1)).join(sepMarkup);
  }

  return `<nav aria-label="${escapeHTML(ariaLabel)}" class="sx-breadcrumbs-nav" data-sui-breadcrumbs${attributes ? ` ${attributes}` : ''}><ol class="sx-breadcrumbs">${listHtml}</ol></nav>`;
}
