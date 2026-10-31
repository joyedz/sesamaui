/**
 * Pure functional builder for Wire connections.
 *
 * @param {string|object} [options]
 * @returns {string} SVG string
 */
import { escapeHTML } from './shared.mjs';
export function wire(options = {}) {
  let config = {};
  if (typeof options === 'string') {
    config = { type: options };
  } else if (options && typeof options === 'object') {
    config = options;
  }

  const {
    type = 'bezier',
    variant = type,
    from = { x: 12, y: 20 },
    to = { x: 228, y: 60 },
    width = 240,
    height = 80,
    showEndpoints = true,
    endpointRadius = 3,
    strokeWidth = 1,
    color = '',
    attributes = '',
  } = config;

  const validVariant = ['bezier', 'step', 'straight', 'dashed'].includes(variant) ? variant : 'bezier';
  const fromX = Number(from.x) || 0;
  const fromY = Number(from.y) || 0;
  const toX = Number(to.x) || 0;
  const toY = Number(to.y) || 0;

  const midX = (fromX + toX) / 2;

  let d = '';
  if (validVariant === 'step') {
    d = `M${fromX} ${fromY} H${midX} V${toY} H${toX}`;
  } else if (validVariant === 'straight') {
    d = `M${fromX} ${fromY} L${toX} ${toY}`;
  } else {
    // bezier and dashed
    d = `M${fromX} ${fromY} C${midX} ${fromY} ${midX} ${toY} ${toX} ${toY}`;
  }

  const isDashed = validVariant === 'dashed';
  const classes = ['wires', 'sx-wire', isDashed ? 'dashed' : ''].filter(Boolean).join(' ');

  const strokeAttr = color ? ` stroke="${escapeHTML(color)}"` : '';
  const strokeWidthAttr = strokeWidth !== 1 ? ` stroke-width="${Number(strokeWidth) || 1}"` : '';

  let endpointsHtml = '';
  if (showEndpoints) {
    endpointsHtml = `<circle cx="${fromX}" cy="${fromY}" r="${endpointRadius}"/><circle cx="${toX}" cy="${toY}" r="${endpointRadius}"/>`;
  }

  return `<svg class="${classes}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" data-sui-wire${attributes ? ` ${attributes}` : ''}><path d="${d}"${strokeAttr}${strokeWidthAttr}/>${endpointsHtml}</svg>`;
}
