import { escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

export function emptyState(options = {}) {
  const opts = typeof options === 'string' ? { title: options } : options;
  const {
    title = '',
    description = '',
    icon = '',
    actions = '',
    compact = false,
    attributes = '',
  } = opts;

  const iconMarkup = icon
    ? (typeof icon === 'string' && icon.trim().startsWith('<svg') ? icon : controlIcon(icon, 28))
    : '';

  const titleMarkup = title !== '' && title !== undefined ? `<b>${escapeHTML(title)}</b>` : '';
  const descMarkup = description !== '' && description !== undefined ? `<p class="sx-help">${escapeHTML(description)}</p>` : '';
  const actionsMarkup = actions ? `<div class="sx-empty-actions">${actions}</div>` : '';

  const classes = ['sx', 'sx-empty', compact ? 'compact' : ''].filter(Boolean).join(' ');

  const attrs = [
    'data-sui-empty-state',
    `class="${classes}"`,
    attributes,
  ].filter(Boolean).join(' ');

  return `<div ${attrs}>${iconMarkup}${titleMarkup}${descMarkup}${actionsMarkup}</div>`;
}
