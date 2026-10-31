import { escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

const VALID_TONES = ['neutral', 'informative', 'success', 'warning', 'error', 'disabled'];
const VALID_SIZES = ['sm', 'base'];

export function badge(options = {}) {
  const opts = typeof options === 'string' ? { label: options } : options;
  const {
    label = '',
    tone = 'neutral',
    size = 'sm',
    icon = '',
    attributes = '',
  } = opts;

  if (tone && !VALID_TONES.includes(tone)) throw new TypeError(`Invalid badge tone: ${tone}`);
  if (size && !VALID_SIZES.includes(size)) throw new TypeError(`Invalid badge size: ${size}`);

  const iconMarkup = icon
    ? (typeof icon === 'string' && icon.trim().startsWith('<svg') ? icon : controlIcon(icon, size === 'base' ? 14 : 12))
    : '';
  const labelMarkup = label !== '' && label !== undefined ? escapeHTML(label) : '';

  const classes = ['badge', `tone-${tone}`, size === 'base' ? 'size-base' : ''].filter(Boolean).join(' ');

  const attrs = [
    'data-sui-badge',
    `class="${classes}"`,
    attributes,
  ].filter(Boolean).join(' ');

  return `<span ${attrs}>${iconMarkup}${labelMarkup}</span>`;
}
