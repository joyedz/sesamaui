import { escapeHTML } from './shared.mjs';

const SIZE_PRESETS = {
  sm: 16,
  base: 24,
  lg: 32,
};

function resolveLoaderSize(size) {
  if (typeof size === 'number') {
    if (Number.isNaN(size) || size <= 0) throw new TypeError(`Invalid loader size: ${size}`);
    return size;
  }
  if (typeof size === 'string') {
    if (SIZE_PRESETS[size]) return SIZE_PRESETS[size];
    const parsed = Number(size);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }
  throw new TypeError(`Invalid loader size preset: ${size}`);
}

export function loader(options = {}) {
  const opts = typeof options === 'number'
    ? { size: options }
    : typeof options === 'string' && SIZE_PRESETS[options]
      ? { size: options }
      : options;

  const {
    size = 'sm',
    label = 'Loading…',
    showLabel = true,
    attributes = '',
  } = opts;

  const numSize = resolveLoaderSize(size);
  const sizeStyle = `style="--loader-size:${numSize}px"`;

  if (showLabel) {
    const attrs = [
      'data-sui-loader',
      'class="sx-row sx-loader-wrap"',
      'role="status"',
      attributes,
    ].filter(Boolean).join(' ');

    return `<span ${attrs}><span class="sx-loader" aria-hidden="true" ${sizeStyle}></span><span>${escapeHTML(label)}</span></span>`;
  }

  const attrs = [
    'data-sui-loader',
    'class="sx-loader"',
    'role="status"',
    `aria-label="${escapeHTML(label)}"`,
    sizeStyle,
    attributes,
  ].filter(Boolean).join(' ');

  return `<span ${attrs}></span>`;
}
