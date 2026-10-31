import { escapeHTML, uid } from '../components/shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

/**
 * Pure functional builder for Activity Feed block.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function activityFeed(options = {}) {
  const {
    id = uid('activity-feed'),
    title = '',
    items = options.activities || [],
    emptyMessage = 'No recent activity.',
    attributes = '',
    classes = '',
  } = options;

  const classList = [
    'sb-activity-feed',
    'sx-activity-feed',
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

  const titleHTML = title ? `<div class="sb-activity-feed-header"><h3>${escapeHTML(title)}</h3></div>` : '';

  if (!Array.isArray(items) || items.length === 0) {
    return `<div class="${classList}" data-sui-activity-feed id="${escapeHTML(id)}" ${extraAttrs.join(' ')}>${titleHTML}<p class="sx-help">${escapeHTML(emptyMessage)}</p></div>`;
  }

  const itemsHTML = items.map(item => {
    const icon = item.icon || (item.status === 'error' ? 'alert-triangle' : 'check');
    const timeVal = item.timestamp || item.time || '';
    const timeHTML = timeVal
      ? `<time ${item.datetime ? `datetime="${escapeHTML(item.datetime)}"` : ''}>${escapeHTML(timeVal)}</time>`
      : '';

    const actionsHTML = item.actions ? `<div class="sb-activity-actions">${item.actions}</div>` : '';

    return `<li><span class="sb-activity-icon">${controlIcon(icon, 16)}</span><div class="sb-activity-content"><div><span>${escapeHTML(item.title || '')}</span>${timeHTML}</div>${item.description ? `<p class="sb-activity-desc">${escapeHTML(item.description)}</p>` : ''}${actionsHTML}</div></li>`;
  }).join('');

  return `<div class="${classList}" data-sui-activity-feed id="${escapeHTML(id)}" ${extraAttrs.join(' ')}>${titleHTML}<ol class="sb-activity-items">${itemsHTML}</ol></div>`;
}
