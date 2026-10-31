import { escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

const VALID_TONES = ['default', 'neutral', 'brand', 'success', 'warning', 'error', 'subtle'];
const VALID_SIZES = ['sm', 'base'];

export function label(options = {}) {
  const opts = typeof options === 'string' ? { text: options } : options;
  const {
    text = '',
    tone = 'default',
    size = 'sm',
    icon = '',
    attributes = '',
  } = opts;

  if (tone && !VALID_TONES.includes(tone)) throw new TypeError(`Invalid label tone: ${tone}`);
  if (size && !VALID_SIZES.includes(size)) throw new TypeError(`Invalid label size: ${size}`);

  const iconMarkup = icon
    ? (typeof icon === 'string' && icon.trim().startsWith('<svg') ? icon : controlIcon(icon, size === 'base' ? 14 : 12))
    : '';
  const textMarkup = text !== '' && text !== undefined ? escapeHTML(text) : '';

  const classes = ['sx-label', 'tl', `tone-${tone}`, size === 'base' ? 'size-base' : ''].filter(Boolean).join(' ');

  const attrs = [
    'data-sui-label',
    `class="${classes}"`,
    attributes,
  ].filter(Boolean).join(' ');

  return `<span ${attrs}>${iconMarkup}${textMarkup}</span>`;
}
