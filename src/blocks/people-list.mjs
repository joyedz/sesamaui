import { escapeHTML, uid } from '../components/shared.mjs';
import { listRow } from '../components/list-row.mjs';
import { avatar } from '../components/avatar.mjs';
import { statusDot } from '../components/status-dot.mjs';

/**
 * Pure functional builder for People List block.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function peopleList(options = {}) {
  const {
    id = uid('people-list'),
    title = '',
    count,
    people = [],
    emptyMessage = options.emptyText || 'No team members to display.',
    attributes = '',
    classes = '',
  } = options;

  const classList = [
    'sb-people-list',
    'sx-people-list',
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

  const titleCount = typeof count === 'number' ? ` (${count})` : '';
  const headerHTML = title ? `<div class="sb-people-list-header"><h3 class="sb-people-list-title">${escapeHTML(title)}${titleCount}</h3></div>` : '';

  if (!Array.isArray(people) || people.length === 0) {
    return `<div class="${classList}" data-sui-people-list id="${escapeHTML(id)}" ${extraAttrs.join(' ')}>${headerHTML}<p class="sx-help">${escapeHTML(emptyMessage)}</p></div>`;
  }

  const itemsHTML = people.map(person => {
    const name = person.name || 'Member';
    const initials = person.initials || name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const status = person.status || 'Offline';
    const lowerStatus = status.toLowerCase();
    const statusTone = lowerStatus === 'online' ? 'success' : lowerStatus === 'busy' || lowerStatus === 'away' ? 'warning' : 'neutral';

    const subtitleParts = [person.role, person.email].filter(Boolean);
    const subtitle = subtitleParts.join(' • ');

    const descHTML = subtitle
      ? `${escapeHTML(subtitle)} • ${statusDot({ tone: statusTone, label: status })}`
      : statusDot({ tone: statusTone, label: status });

    const rowHTML = listRow({
      variant: 'plain',
      title: name,
      leading: avatar({ name, initials, size: 28, src: person.avatar?.src || (typeof person.avatar === 'string' ? person.avatar : undefined) }),
      descriptionHTML: descHTML,
      trailing: person.actions || (person.metadata ? `<span class="sx-help">${escapeHTML(person.metadata)}</span>` : '')
    });

    return `<li>${rowHTML}</li>`;
  }).join('');

  return `<div class="${classList}" data-sui-people-list id="${escapeHTML(id)}" ${extraAttrs.join(' ')}>${headerHTML}<ul class="sb-people-list-items">${itemsHTML}</ul></div>`;
}
