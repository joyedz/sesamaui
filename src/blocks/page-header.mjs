import { applySurface, surfaceMode } from '../components/shared.mjs';
import { escapeHTML, uid } from '../components/shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

/**
 * Pure functional builder for Page Header block.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
function buildPageHeader(options = {}) {
  const {
    id = uid('page-header'),
    title = 'Page',
    titleContent: customTitle = '',
    icon = 'file-text',
    description = '',
    actions = '',
    breadcrumbs = '',
    meta = '',
    attributes = '',
    classes = '',
  } = options;

  const classList = [
    'sb-page-header',
    'sx-page-header',
    classes
  ].filter(Boolean).join(' ');

  const iconMarkup = icon ? controlIcon(icon, 16) : '';

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

  const breadcrumbsHTML = breadcrumbs ? `<div class="sb-header-breadcrumbs">${breadcrumbs}</div>` : '';
  const actionsHTML = actions ? `<div class="sb-header-actions">${actions}</div>` : '';
  const metaHTML = meta ? `<div class="sb-header-meta">${meta}</div>` : '';

  const titleContent = customTitle || `<h1>${escapeHTML(title)}</h1>${description ? `<p class="sb-header-desc">${escapeHTML(description)}</p>` : ''}${metaHTML}`;

  let leftContent = '';
  if (breadcrumbs) {
    leftContent = `<div class="sb-header-content">${breadcrumbsHTML}<div class="sb-header-title">${iconMarkup}<div>${titleContent}</div></div></div>`;
  } else {
    leftContent = `<div class="sb-header-title">${iconMarkup}<div>${titleContent}</div></div>`;
  }

  return `<header class="${classList}" data-sui-page-header id="${escapeHTML(id)}" ${extraAttrs.join(' ')}>${leftContent}${actionsHTML}</header>`;
}


export function pageHeader(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildPageHeader(...args), mode, ["@root"]);
}
