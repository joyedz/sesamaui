import { escapeHTML } from './shared.mjs';

const VALID_SHAPES = ['line', 'line-short', 'round', 'card', 'fill'];

export function skeleton(options = {}) {
  const opts = typeof options === 'string' ? { shape: options } : options;
  const {
    shape = 'line',
    width,
    height,
    size,
    radius,
    count = 1,
    ariaLabel = 'Loading content',
    attributes = '',
  } = opts;

  if (shape && !VALID_SHAPES.includes(shape)) {
    throw new TypeError(`Invalid skeleton shape: ${shape}`);
  }

  const numCount = Math.max(1, Math.floor(Number(count) || 1));

  const styleParts = [];
  if (width !== undefined) styleParts.push(`--skeleton-width:${typeof width === 'number' ? `${width}px` : escapeHTML(String(width))}`);
  if (height !== undefined) styleParts.push(`--skeleton-height:${typeof height === 'number' ? `${height}px` : escapeHTML(String(height))}`);
  if (size !== undefined) styleParts.push(`--skeleton-size:${typeof size === 'number' ? `${size}px` : escapeHTML(String(size))}`);
  if (radius !== undefined) styleParts.push(`--skeleton-radius:${typeof radius === 'number' ? `${radius}px` : escapeHTML(String(radius))}`);

  const itemStyle = styleParts.length ? ` style="${styleParts.join(';')}"` : '';

  const shapeClass = shape === 'line'
    ? 'sx-skeleton'
    : shape === 'card'
      ? 'sx-skeleton card-shape'
      : `sx-skeleton ${shape}`;

  const items = Array.from({ length: numCount }, () => `<div class="${shapeClass}"${itemStyle} aria-hidden="true"></div>`).join('');

  const attrs = [
    'data-sui-skeleton',
    'class="sx-skeleton-layout"',
    'role="status"',
    'aria-busy="true"',
    `aria-label="${escapeHTML(ariaLabel)}"`,
    attributes,
  ].filter(Boolean).join(' ');

  return `<div ${attrs}>${items}</div>`;
}
