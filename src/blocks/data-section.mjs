import { contentSection } from './content-section.mjs';

/**
 * Pure functional builder for Data Section block.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function dataSection(options = {}) {
  const {
    id,
    title = 'Records',
    description = '',
    actions = '',
    filters = '',
    toolbar = '',
    table = '',
    data = '',
    pagination = '',
    footer = '',
    variant = 'plain',
    attributes = '',
    classes = '',
  } = options;

  const activeToolbar = toolbar || filters;
  const toolbarHTML = activeToolbar ? `<div class="sb-section-filters">${activeToolbar}</div>` : '';
  const dataContent = data || table;
  const bodyHTML = `${toolbarHTML}<div class="sb-data-content">${dataContent}</div>`;

  let footerHTML = '';
  if (pagination && footer) {
    footerHTML = `<div class="sb-data-pagination">${pagination}</div><div class="sb-data-footer-info">${footer}</div>`;
  } else if (pagination) {
    footerHTML = `<div class="sb-data-pagination">${pagination}</div>`;
  } else if (footer) {
    footerHTML = footer;
  }

  const classList = ['sb-data-section', 'sx-data-section', classes].filter(Boolean).join(' ');

  const mergedAttrs = [
    'data-sui-data-section',
    typeof attributes === 'string' ? attributes : '',
  ].filter(Boolean).join(' ');

  const markup = contentSection({
    id,
    title,
    description,
    actions,
    content: bodyHTML,
    footer: footerHTML,
    variant,
    attributes: mergedAttrs,
    classes: classList
  });

  return markup.replace('class="sb-content-footer"', 'class="sb-content-footer sb-pagination-footer"');
}
