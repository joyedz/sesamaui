import { escapeHTML } from './shared.mjs';

const VALID_ORIENTATIONS = ['horizontal', 'vertical'];

export function divider(options = {}) {
  const {
    orientation = 'horizontal',
    label = '',
    decorative = false,
    attributes = '',
  } = options;

  if (orientation && !VALID_ORIENTATIONS.includes(orientation)) {
    throw new TypeError(`Invalid divider orientation: ${orientation}`);
  }

  const role = decorative ? 'presentation' : 'separator';
  const isVertical = orientation === 'vertical';

  const classes = [
    'sx-divider',
    'hr',
    orientation,
    label ? 'has-label' : '',
  ].filter(Boolean).join(' ');

  const attrs = [
    'data-sui-divider',
    `class="${classes}"`,
    `role="${role}"`,
    decorative ? 'aria-hidden="true"' : '',
    !decorative && isVertical ? 'aria-orientation="vertical"' : '',
    attributes,
  ].filter(Boolean).join(' ');

  if (label !== '' && label !== undefined) {
    return `<div ${attrs}><span class="sx-divider-line" aria-hidden="true"></span><span class="sx-divider-label">${escapeHTML(label)}</span><span class="sx-divider-line" aria-hidden="true"></span></div>`;
  }

  return `<div ${attrs}></div>`;
}
