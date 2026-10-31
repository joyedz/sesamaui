import { escapeHTML, uid } from '../components/shared.mjs';

const VALID_VARIANTS = ['dashboard', 'data', 'conversation', 'default'];

/**
 * Pure functional builder for Page Layout block.
 *
 * @param {string|object} [content]
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function pageLayout(content = '', options = {}) {
  let opts = {};
  let mainContent = '';

  if (typeof content === 'object' && content !== null) {
    opts = content;
    mainContent = opts.content || '';
  } else {
    opts = options || {};
    mainContent = typeof content === 'string' ? content : (opts.content || '');
  }

  const variant = opts.variant || 'dashboard';
  if (!VALID_VARIANTS.includes(variant)) {
    throw new TypeError(`Unknown page layout variant: ${variant}`);
  }

  const width = opts.width || '';
  const compact = Boolean(opts.compact);
  const id = opts.id || uid('layout');
  const classes = opts.classes || '';

  const classList = [
    'sb-page-layout',
    'sx-page-layout',
    `sb-layout-${variant}`,
    width ? `layout-${width}` : '',
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

  let bodyHTML = mainContent;
  if (opts.header || opts.sidebar || opts.footer) {
    const headerHTML = opts.header ? `<div class="sb-layout-header">${opts.header}</div>` : '';
    const sidebarHTML = opts.sidebar ? `<div class="sb-layout-sidebar">${opts.sidebar}</div>` : '';
    const footerHTML = opts.footer ? `<div class="sb-layout-footer">${opts.footer}</div>` : '';
    bodyHTML = `${headerHTML}<div class="sb-layout-body">${sidebarHTML}<div class="sb-layout-main">${mainContent}</div></div>${footerHTML}`;
  }

  return `<div class="${classList}" data-sui-page-layout data-layout-variant="${escapeHTML(variant)}" id="${escapeHTML(id)}" ${extraAttrs.join(' ')}>${bodyHTML}</div>`;
}
