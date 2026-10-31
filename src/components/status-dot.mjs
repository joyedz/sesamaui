import { escapeHTML } from './shared.mjs';

const VALID_TONES = ['neutral', 'informative', 'success', 'warning', 'error', 'disabled'];

export function statusDot(options = {}) {
  const opts = typeof options === 'string' ? { tone: options } : options;
  const {
    tone = 'neutral',
    label = '',
    size = 8,
    active = false,
    attributes = '',
  } = opts;

  if (tone && !VALID_TONES.includes(tone)) throw new TypeError(`Invalid status dot tone: ${tone}`);
  const numSize = Number(size);
  if (Number.isNaN(numSize) || numSize <= 0) throw new TypeError(`Invalid status dot size: ${size}`);

  const activeClass = active ? ' is-active' : '';
  const sizeStyle = `style="--status-dot-size:${numSize}px"`;

  if (label !== '' && label !== undefined) {
    const dotAttrs = [
      'data-sui-status-dot',
      `class="sx-status-dot${activeClass}"`,
      `data-tone="${escapeHTML(tone)}"`,
      sizeStyle,
      'aria-hidden="true"',
    ].join(' ');

    const wrapperAttrs = [
      'class="sx-status-label"',
      attributes,
    ].filter(Boolean).join(' ');

    return `<span ${wrapperAttrs}><span ${dotAttrs}></span><span>${escapeHTML(label)}</span></span>`;
  }

  const dotAttrs = [
    'data-sui-status-dot',
    `class="sx-status-dot${activeClass}"`,
    `data-tone="${escapeHTML(tone)}"`,
    sizeStyle,
    'role="img"',
    `aria-label="${escapeHTML(tone)} status"`,
    attributes,
  ].filter(Boolean).join(' ');

  return `<span ${dotAttrs}></span>`;
}
