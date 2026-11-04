import { applySurface, surfaceMode } from '../components/shared.mjs';
import { escapeHTML, uid } from '../components/shared.mjs';

const VALID_VARIANTS = ['plain', 'bordered', 'divided'];

/**
 * Pure functional builder for Content Section block.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
function buildContentSection(options = {}) {
  const {
    id = uid('content-section'),
    title = '',
    description = '',
    actions = '',
    content = '',
    footer = '',
    variant = 'plain',
    attributes = '',
    classes = '',
  } = options;

  if (!VALID_VARIANTS.includes(variant)) {
    throw new TypeError(`Unknown content section variant: ${variant}`);
  }

  const classList = [
    'sb-content-section',
    'sx-content-section',
    `is-${variant}`,
    `variant-${variant}`,
    classes
  ].filter(Boolean).join(' ');

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

  let headingHTML = '';
  if (title || description || actions) {
    headingHTML = `<header class="sb-content-heading"><div>${title ? `<h2>${escapeHTML(title)}</h2>` : ''}${description ? `<p>${escapeHTML(description)}</p>` : ''}</div>${actions ? `<div class="sb-content-actions">${actions}</div>` : ''}</header>`;
  }

  const footerHTML = footer ? `<footer class="sb-content-footer">${footer}</footer>` : '';

  return `<section class="${classList}" data-sui-content-section id="${escapeHTML(id)}" ${extraAttrs.join(' ')}>${headingHTML}<div class="sb-content-body">${content}</div>${footerHTML}</section>`;
}


export function contentSection(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildContentSection(...args), mode, ["@root"]);
}
