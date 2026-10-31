import { escapeHTML, uid } from '../components/shared.mjs';

const VALID_TONES = ['success', 'error', 'neutral'];

/**
 * Pure functional builder for Metric Summary helper.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function metricSummary(options = {}) {
  // If passed an array of metrics or summary container options
  if (Array.isArray(options.metrics)) {
    const { columns = 3, metrics = [], classes = '' } = options;
    const colsClass = columns ? ` cols-${columns}` : '';
    const classList = ['sb-metric-summary-grid', 'sx-metric-summary-grid', colsClass, classes].filter(Boolean).join(' ');
    return `<div class="${classList}" data-sui-metric-summary>${metrics.map(m => typeof m === 'string' ? m : metricCard(m)).join('')}</div>`;
  }

  const {
    value = '—',
    change = '',
    description = change ? 'vs previous period' : '',
    tone = 'neutral',
    trend,
    size = 'default'
  } = options;

  let effectiveTone = tone;
  if (!tone || tone === 'neutral') {
    if (trend === 'up') effectiveTone = 'success';
    else if (trend === 'down') effectiveTone = 'error';
  }
  const validTone = VALID_TONES.includes(effectiveTone) ? effectiveTone : 'neutral';
  const isCompact = size === 'compact';
  const trendClass = trend ? ` trend-${trend}` : '';

  let comparisonHTML = '';
  if (change || description) {
    comparisonHTML = `<div class="sb-metric-comparison${trendClass}">${change ? `<span class="sb-metric-change" data-tone="${validTone}">${escapeHTML(change)}</span>` : ''}${description ? `<span class="sx-help">${escapeHTML(description)}</span>` : ''}</div>`;
  }

  return `<div class="sb-metric-summary sx-metric-summary${isCompact ? ' is-compact' : ''}${trendClass}"><div class="sb-metric-value">${escapeHTML(value)}</div>${comparisonHTML}</div>`;
}

/**
 * Pure functional builder for Metric Card block.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function metricCard(options = {}) {
  const {
    id = uid('metric'),
    label = '',
    value = '—',
    change = '',
    description = change ? 'vs previous period' : '',
    tone = 'neutral',
    trend,
    badge = '',
    footer = '',
    state = 'ready',
    size = 'default',
    attributes = '',
    classes = '',
  } = options;

  const isCompact = size === 'compact';
  const trendClass = trend ? ` trend-${trend}` : '';
  const classList = [
    'sb-metric',
    'sx-metric-card',
    isCompact ? 'is-compact' : '',
    trendClass,
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

  const badgeHTML = badge ? `<span class="sb-metric-badge badge">${escapeHTML(badge)}</span>` : '';
  const headerHTML = `<div class="sb-metric-header"><h2>${escapeHTML(label)}</h2>${badgeHTML}</div>`;

  const contentHTML = state === 'loading'
    ? '<div class="sb-metric-loading" role="status" aria-label="Loading metric"><div class="sx-skeleton fill" style="height:24px"></div></div>'
    : metricSummary({ value, change, description, tone, trend, size });

  const footerHTML = footer ? `<div class="sb-metric-footer">${footer}</div>` : '';

  return `<section class="${classList}" data-sui-metric-card id="${escapeHTML(id)}" ${state === 'loading' ? 'aria-busy="true"' : ''} ${extraAttrs.join(' ')}>${headerHTML}${contentHTML}${footerHTML}</section>`;
}
