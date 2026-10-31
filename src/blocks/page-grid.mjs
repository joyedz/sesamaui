import { escapeHTML, uid } from '../components/shared.mjs';

/**
 * Pure functional builder for Page Grid block.
 *
 * @param {Array<object>|object|string} [items]
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function pageGrid(items = [], options = {}) {
  let opts = {};
  let itemList = [];
  let rawContent = '';

  if (Array.isArray(items)) {
    itemList = items;
    opts = options || {};
  } else if (typeof items === 'object' && items !== null) {
    opts = items;
    if (Array.isArray(opts.items)) {
      itemList = opts.items;
    } else {
      rawContent = opts.content || '';
    }
  } else if (typeof items === 'string') {
    rawContent = items;
    opts = options || {};
  }

  const columns = opts.columns ? `cols-${opts.columns}` : '';
  const gap = opts.gap ? `gap-${opts.gap}` : '';
  const compact = Boolean(opts.compact);
  const id = opts.id || uid('grid');
  const classes = opts.classes || '';

  const classList = [
    'sb-page-grid',
    'sx-page-grid',
    columns,
    gap,
    compact ? 'is-compact' : '',
    classes
  ].filter(Boolean).join(' ');

  const extraAttrs = [];
  if (opts.attributes) {
    if (typeof opts.attributes === 'string') {
      extraAttrs.push(opts.attributes);
    } else if (typeof opts.attributes === 'object') {
      for (const [k, v] of Object.entries(opts.attributes)) {
        extraAttrs.push(`${k}="${escapeHTML(v)}"`);
      }
    }
  }

  let bodyHTML = rawContent;
  if (itemList.length > 0) {
    bodyHTML = itemList.map(item => {
      if (typeof item === 'string') return `<div class="sb-grid-item">${item}</div>`;
      const html = item.html || item.content || '';
      const span = item.span ? Math.max(1, Math.min(12, Number(item.span) || 12)) : '';
      const tablet = item.tablet ? Math.max(1, Math.min(6, Number(item.tablet) || 6)) : '';
      const style = [
        span ? `--sb-span:${span};` : '',
        tablet ? `--sb-tablet:${tablet};` : ''
      ].filter(Boolean).join('');
      return `<div class="sb-grid-item"${style ? ` style="${style}"` : ''}>${html}</div>`;
    }).join('');
  }

  return `<div class="${classList}" data-sui-page-grid id="${escapeHTML(id)}" ${extraAttrs.join(' ')}>${bodyHTML}</div>`;
}
