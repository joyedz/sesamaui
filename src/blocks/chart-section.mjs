import { contentSection } from './content-section.mjs';
import { metricCard } from './metric-card.mjs';

/**
 * Pure functional builder for Chart Section block.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function chartSection(options = {}) {
  const {
    id,
    title = '',
    description = '',
    actions = '',
    chart = '',
    metrics,
    summary = '',
    footer = '',
    variant = 'bordered',
    attributes = '',
    classes = '',
  } = options;

  let metricsHTML = '';
  if (Array.isArray(metrics) && metrics.length > 0) {
    metricsHTML = `<div class="sb-chart-metrics">${metrics.map(m => typeof m === 'string' ? m : metricCard(m)).join('')}</div>`;
  } else if (typeof metrics === 'string' && metrics) {
    metricsHTML = `<div class="sb-chart-metrics">${metrics}</div>`;
  }

  const summaryHTML = summary ? `<div class="sb-chart-summary">${summary}</div>` : '';
  const chartBody = `${metricsHTML}${summaryHTML}<div class="sb-chart-content">${chart}</div>`;

  const classList = ['sb-chart-section', 'sx-chart-section', classes].filter(Boolean).join(' ');

  return contentSection({
    id,
    title,
    description,
    actions,
    content: chartBody,
    footer,
    variant,
    attributes,
    classes: classList
  });
}
