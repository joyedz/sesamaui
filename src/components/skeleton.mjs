import { applySurface, surfaceMode } from './shared.mjs';
import { escapeHTML } from './shared.mjs';

const VALID_SHAPES = ['line', 'line-short', 'round', 'card', 'fill'];

function shapeDiv(entry) {
  const spec = typeof entry === 'string' ? { shape: entry } : entry;
  if (!spec || !VALID_SHAPES.includes(spec.shape)) {
    throw new TypeError(`Invalid skeleton shape: ${spec && spec.shape}`);
  }
  const styleParts = [];
  if (spec.width !== undefined) styleParts.push(`--skeleton-width:${typeof spec.width === 'number' ? `${spec.width}px` : escapeHTML(String(spec.width))}`);
  if (spec.height !== undefined) styleParts.push(`--skeleton-height:${typeof spec.height === 'number' ? `${spec.height}px` : escapeHTML(String(spec.height))}`);
  if (spec.size !== undefined) styleParts.push(`--skeleton-size:${typeof spec.size === 'number' ? `${spec.size}px` : escapeHTML(String(spec.size))}`);
  if (spec.radius !== undefined) styleParts.push(`--skeleton-radius:${typeof spec.radius === 'number' ? `${spec.radius}px` : escapeHTML(String(spec.radius))}`);

  const style = styleParts.length ? ` style="${styleParts.join(';')}"` : '';
  const shapeClass = spec.shape === 'line'
    ? 'sx-skeleton'
    : spec.shape === 'card'
      ? 'sx-skeleton card-shape'
      : `sx-skeleton ${spec.shape}`;

  return `<div class="${shapeClass}"${style} aria-hidden="true"></div>`;
}

function buildSkeleton(options = {}) {
  const opts = typeof options === 'string' ? { shape: options } : options;
  const {
    shape = 'line',
    width,
    height,
    size,
    radius,
    count = 1,
    items,
    bare = false,
    ariaLabel = 'Loading content',
    attributes = '',
  } = opts;

  if (shape && !VALID_SHAPES.includes(shape)) {
    throw new TypeError(`Invalid skeleton shape: ${shape}`);
  }

  const numCount = Math.max(1, Math.floor(Number(count) || 1));

  let content;
  if (Array.isArray(items) && items.length) {
    // Mixed shapes under ONE status region. A nested array renders its entries
    // side by side in a shared row.
    content = items.map(entry => Array.isArray(entry) ? `<div class="sx-row">${entry.map(shapeDiv).join('')}</div>` : shapeDiv(entry)).join('');
  } else {
    content = Array.from({ length: numCount }, () => shapeDiv({ shape, width, height, size, radius })).join('');
  }

  // Bare mode emits the raw shape divs only, for app-level compositions that
  // own the status wrapper (e.g. an avatar beside a stack of lines).
  if (bare) return content;

  const attrs = [
    'data-sui-skeleton',
    'class="sx-skeleton-layout"',
    'role="status"',
    'aria-busy="true"',
    `aria-label="${escapeHTML(ariaLabel)}"`,
    attributes,
  ].filter(Boolean).join(' ');

  return `<div ${attrs}>${content}</div>`;
}


export function skeleton(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildSkeleton(...args), mode, ["@root"]);
}
