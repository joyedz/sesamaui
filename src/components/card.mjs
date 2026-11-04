import { applySurface, surfaceMode } from './shared.mjs';
import { escapeHTML } from './shared.mjs';

const VALID_VARIANTS = ['default', 'flat', 'bordered', 'recessed'];

function buildCard(options = {}) {
  const {
    header = '',
    title = '',
    description = '',
    content = '',
    footer = '',
    actions = '',
    expandAction = '',
    variant = 'default',
    selected = false,
    attributes = '',
    classes = '',
  } = options;

  if (variant && !VALID_VARIANTS.includes(variant)) {
    throw new TypeError(`Invalid card variant: ${variant}`);
  }

  const isBare = !header;
  const classList = [
    'card',
    'sx-card',
    `variant-${variant}`,
    selected ? 'on' : '',
    isBare ? 'bare' : '',
    classes,
  ].filter(Boolean).join(' ');

  const attrs = [
    'data-sui-card',
    `class="${classList}"`,
    attributes,
  ].filter(Boolean).join(' ');

  const headerMarkup = header ? `<div class="ch sx-card-header">${header}</div>` : '';
  const titleMarkup = title !== '' && title !== undefined ? `<h3 class="sx-card-title">${escapeHTML(title)}</h3>` : '';
  const descMarkup = description !== '' && description !== undefined ? `<p class="hint sx-card-description">${escapeHTML(description)}</p>` : '';
  const bodyInner = `${titleMarkup}${descMarkup}${content || ''}`;
  const bodyMarkup = bodyInner ? `<div class="cb sx-card-body">${bodyInner}</div>` : '';

  let footerInner = '';
  if (footer || actions) {
    const actionsMarkup = actions ? `<div class="actions sx-card-actions">${actions}</div>` : '';
    footerInner = `<div class="cf sx-card-footer">${footer || ''}${actionsMarkup}</div>`;
  }

  return `<div ${attrs}>${headerMarkup}${bodyMarkup}${footerInner}${expandAction ? `<div class="sx-card-expand">${expandAction}</div>` : ''}</div>`;
}


export function card(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildCard(...args), mode, ["@root"]);
}
