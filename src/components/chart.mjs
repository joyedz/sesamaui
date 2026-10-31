import { escapeHTML, uid } from './shared.mjs';

const PALETTE = [
  'var(--color-chart-primary, #0066cc)',
  'var(--color-type-tc, #8e44ad)',
  'var(--color-type-fn, #2980b9)',
  'var(--color-type-sys, #e67e22)',
  'var(--color-success, #27ae60)',
];

function compactNum(n) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

function formatVal(config, n) {
  if (typeof config.formatValue === 'function') {
    return config.formatValue(n);
  }
  if (config.formatValue === 'currency') {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: config.currency || 'USD',
      maximumFractionDigits: 0,
    }).format(n);
  }
  if (config.formatValue === 'percent') {
    return `${n}%`;
  }
  return compactNum(n);
}

function getVal(row, key) {
  const n = Number(row[key]);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function arcPath(cx, cy, r, start, end) {
  const point = t => [cx + Math.cos(t * Math.PI * 2 - Math.PI / 2) * r, cy + Math.sin(t * Math.PI * 2 - Math.PI / 2) * r];
  const a = point(start);
  const z = point(end);
  if (end - start >= 0.999999) {
    const mid = point(start + 0.5);
    return `M${a} A${r},${r} 0 1 1 ${mid} A${r},${r} 0 1 1 ${a}`;
  }
  return `M${a} A${r},${r} 0 ${end - start > 0.5 ? 1 : 0} 1 ${z}`;
}

export function renderChartSVG(config, width = 480) {
  const c = {
    type: 'line',
    label: 'Chart',
    data: [],
    series: [],
    height: 240,
    ...config,
  };

  const data = c.data || [];
  const allSeries = (c.series || []).map((s, i) => ({
    ...s,
    color: s.color === 'var(--color-brand)' ? 'var(--color-chart-primary, #0066cc)' : s.color || PALETTE[i % PALETTE.length],
  }));

  if (c.state === 'loading') {
    return '<div class="sc-state" role="status" aria-label="Loading chart"><div class="sx-skeleton fill" aria-hidden="true"></div></div>';
  }
  if (c.state === 'error') {
    return `<div class="sc-state" role="status">${escapeHTML(c.errorMessage || 'Unable to load chart.')}</div>`;
  }
  if (!data.length || !allSeries.length) {
    return '<div class="sc-state" role="status">No data available.</div>';
  }

  const w = Math.max(220, width);
  const h = Math.max(140, Number(c.height) || 240);
  const L = 48;
  const R = 12;
  const T = 12;
  const B = 32;
  const pw = Math.max(1, w - L - R);
  const ph = h - T - B;

  const sums = data.map(row => allSeries.reduce((n, s) => n + getVal(row, s.key), 0));
  const rawMax = Math.max(
    1,
    ...data.flatMap(row => allSeries.map(s => getVal(row, s.key))),
    ...(c.type === 'stacked bar' ? sums : [])
  );

  const step = Math.pow(10, Math.floor(Math.log10(rawMax))) / 2;
  const max = Math.ceil(rawMax / step) * step;

  const getX = i => (['bar', 'thin-bar', 'stacked bar'].includes(c.type)
    ? L + (pw / data.length) * (i + 0.5)
    : L + (data.length === 1 ? pw / 2 : (i * pw) / (data.length - 1)));

  const getY = n => T + ph - (n / max) * ph;

  let svg = `<svg class="sc-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHTML(c.label)}"><title>${escapeHTML(c.label)}</title>`;

  if (c.type === 'donut') {
    const s = allSeries[0];
    const total = s ? data.reduce((n, row) => n + getVal(row, s.key), 0) : 0;
    const r = Math.min(h / 2 - 24, w / 2 - 20);
    const cx = w / 2;
    const cy = h / 2;
    const C = 2 * Math.PI * r;
    let offset = 0;

    if (total) {
      data.forEach((row, i) => {
        const n = getVal(row, s.key);
        const portion = (n / total) * C;
        svg += `<path data-sc-segment="${i}" d="${arcPath(cx, cy, r, offset / C, (offset + portion) / C)}" fill="none" stroke="${PALETTE[i % PALETTE.length]}" stroke-width="24" pointer-events="stroke"><title>${escapeHTML(row.label)}: ${escapeHTML(formatVal(c, n))}</title></path>`;
        offset += portion;
      });
      svg += `<circle cx="${cx}" cy="${cy}" r="${r - 24}" fill="var(--color-base)"/><text x="${cx}" y="${cy}" text-anchor="middle" class="sc-total">${escapeHTML(formatVal(c, total))}</text><text x="${cx}" y="${cy + 22}" text-anchor="middle">Total</text>`;
    } else {
      svg += `<text x="${cx}" y="${cy}" text-anchor="middle">No values to display</text>`;
    }
  } else {
    // Grid lines
    for (let i = 0; i <= 4; i++) {
      const n = (max * i) / 4;
      const yy = getY(n);
      svg += `<line x1="${L}" x2="${w - R}" y1="${yy}" y2="${yy}" class="sc-grid"/><text x="${L - 8}" y="${yy + 4}" text-anchor="end">${escapeHTML(compactNum(n))}</text>`;
    }

    // X-axis labels
    const labelEvery = data.length <= 4 ? 1 : Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(pw / 64))));
    data.forEach((row, i) => {
      if (i % labelEvery === 0 || i === data.length - 1) {
        const anchor = ['bar', 'thin-bar', 'stacked bar'].includes(c.type)
          ? 'middle'
          : i === data.length - 1 ? 'end' : i === 0 ? 'start' : 'middle';
        svg += `<text x="${getX(i)}" y="${h - 8}" text-anchor="${anchor}">${escapeHTML(row.label)}</text>`;
      }
    });

    if (['line', 'area'].includes(c.type)) {
      allSeries.forEach(s => {
        const points = data.map((row, i) => [getX(i), getY(getVal(row, s.key))]);
        const path = points.map(([xx, yy], i) => (i ? 'L' : 'M') + xx + ' ' + yy).join(' ');
        if (c.type === 'area') {
          svg += `<path d="${path} L${getX(data.length - 1)} ${getY(0)} L${getX(0)} ${getY(0)} Z" fill="${escapeHTML(s.color)}" opacity="0.12"/>`;
        }
        svg += `<path d="${path}" fill="none" stroke="${escapeHTML(s.color)}" stroke-width="2" stroke-linejoin="round"/>`;
        if (data.length === 1) {
          svg += `<circle cx="${points[0][0]}" cy="${points[0][1]}" r="3" fill="${escapeHTML(s.color)}"/>`;
        }
      });
    } else {
      // Bar types
      const isThin = c.type === 'thin-bar' || c.barSize === 'thin';
      const group = pw / data.length;
      const bw = Math.min(isThin ? 12 : 36, (group * 0.68) / Math.max(1, c.type === 'stacked bar' ? 1 : allSeries.length));

      data.forEach((row, i) => {
        let base = 0;
        allSeries.forEach((s, j) => {
          const n = getVal(row, s.key);
          const xx = L + group * (i + 0.5) + (c.type === 'stacked bar' ? 0 : (j - (allSeries.length - 1) / 2) * bw) - bw / 2 + 1;
          const yy = getY(c.type === 'stacked bar' ? base + n : n);
          const barHeight = Math.max(0, (n / max) * ph);
          svg += `<rect data-sc-index="${i}" data-sc-series="${escapeHTML(s.key)}" x="${xx}" y="${yy}" width="${Math.max(1, bw - 2)}" height="${barHeight}" rx="${isThin ? 5 : 2}" fill="${escapeHTML(s.color)}"/>`;
          base += n;
        });
      });
    }

    if (['line', 'area'].includes(c.type)) {
      svg += '<g class="sc-hover-dots">' + data.map((row, i) => allSeries.map(s =>
        `<circle data-sc-dot="${i}" cx="${getX(i)}" cy="${getY(getVal(row, s.key))}" r="4" fill="${escapeHTML(s.color)}" stroke="var(--color-base)" stroke-width="2" visibility="hidden"/>`
      ).join('')).join('') + '</g>';
    }
  }

  svg += '</svg>';
  return svg;
}

/**
 * Static legend + collapsible data table shared by chart() and initChart().
 *
 * @param {object} config
 * @param {Set<string>} hidden
 * @returns {string} HTML markup
 */
function buildChartExtras(config, hidden) {
  const data = config.data || [];
  const allSeries = (config.series || []).map((s, i) => ({
    ...s,
    color: s.color === 'var(--color-brand)' ? 'var(--color-chart-primary, #0066cc)' : s.color || PALETTE[i % PALETTE.length],
  }));
  if (config.state || !data.length || !allSeries.length) return '';

  let legend = '<div class="sc-legend">';
  if (config.type === 'donut') {
    data.forEach((row, i) => {
      legend += `<span><i style="background:${PALETTE[i % PALETTE.length]}"></i>${escapeHTML(row.label)}</span>`;
    });
  } else {
    allSeries.forEach(s => {
      legend += `<button type="button" class="sc-legend-toggle" aria-pressed="${hidden.has(s.key) ? 'false' : 'true'}" data-legend-key="${escapeHTML(s.key)}"><i style="background:${escapeHTML(s.color)}"></i>${escapeHTML(s.label || s.key)}</button>`;
    });
  }
  legend += '</div>';

  let table = '<details class="sc-data"><summary>View data</summary><div class="sx-scroll-area"><table class="sx-table"><thead><tr><th>Label</th>';
  table += allSeries.map(s => `<th>${escapeHTML(s.label || s.key)}</th>`).join('');
  table += '</tr></thead><tbody>';
  table += data.map(row => `<tr><td>${escapeHTML(row.label)}</td>${allSeries.map(s => `<td>${escapeHTML(formatVal(config, getVal(row, s.key)))}</td>`).join('')}</tr>`).join('');
  table += '</tbody></table></div></details>';

  return legend + table;
}

/**
 * Pure functional builder for Chart.
 *
 * @param {object} [options]
 * @returns {string} HTML string
 */
export function chart(options = {}) {
  const {
    id = uid('sui-chart'),
    height = 240,
    attributes = '',
    ...rest
  } = options;

  const validHeight = Math.max(140, Number(height) || 240);
  const config = { height: validHeight, ...rest };
  const initialSvg = renderChartSVG(config);
  const extras = buildChartExtras(config, new Set());
  const configData = escapeHTML(JSON.stringify(config));

  return `<div class="sc-chart" data-sui-chart id="${escapeHTML(id)}" data-chart-config="${configData}" style="--sc-height:${validHeight}px;"${attributes ? ` ${attributes}` : ''}>${initialSvg}${extras}</div>`;
}

const mounted = new WeakMap();

/**
 * Controller for Chart.
 *
 * @param {HTMLElement} element
 * @returns {object} Chart controller
 */
export function initChart(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  let destroyed = false;

  let config = {};
  try {
    config = JSON.parse(element.dataset.chartConfig || '{}');
  } catch {
    config = {};
  }

  let resizeObserver = null;
  const hiddenSeries = new Set();

  function render() {
    if (destroyed) return;
    const width = element.clientWidth || 480;
    const visibleConfig = { ...config, series: (config.series || []).filter(s => !hiddenSeries.has(s.key)) };
    const svgHtml = renderChartSVG(visibleConfig, width);
    const extras = buildChartExtras(visibleConfig, hiddenSeries);
    element.innerHTML = svgHtml + extras;
    buildInteractiveTargets(visibleConfig);
    wireLegend();
  }

  function wireLegend() {
    element.querySelectorAll('.sc-legend-toggle').forEach(buttonEl => {
      buttonEl.addEventListener('click', () => {
        const key = buttonEl.dataset.legendKey;
        if (hiddenSeries.has(key)) hiddenSeries.delete(key);
        else if ((config.series || []).length - hiddenSeries.size > 1) hiddenSeries.add(key);
        render();
      });
    });
  }

  function buildInteractiveTargets(activeConfig = config) {
    if (destroyed || config.state === 'loading' || config.state === 'error') return;
    const data = activeConfig.data || [];
    if (!data.length) return;

    const overlay = element.ownerDocument?.createElement('div') || { className: '', append() {} };
    overlay.className = 'sc-targets';

    const tip = element.ownerDocument?.createElement('div') || { className: '', setAttribute() {}, style: {} };
    tip.className = 'sc-tooltip';
    tip.setAttribute('role', 'status');
    tip.hidden = true;

    if (element.append) {
      element.append(overlay, tip);
    }

    const allSeries = activeConfig.series || [];
    const width = element.clientWidth || 480;
    const height = Math.max(140, Number(config.height) || 240);
    const L = 48;
    const R = 12;
    const T = 12;
    const B = 32;
    const pw = Math.max(1, width - L - R);
    const ph = height - T - B;

    data.forEach((row, index) => {
      const button = element.ownerDocument?.createElement('button');
      if (!button) return;
      button.type = 'button';
      button.className = 'sc-target';

      const xPos = ['bar', 'thin-bar', 'stacked bar'].includes(config.type)
        ? L + (pw / data.length) * (index + 0.5)
        : L + (data.length === 1 ? pw / 2 : (index * pw) / (data.length - 1));

      button.style.left = `${xPos}px`;
      button.style.top = `${T + ph / 2}px`;
      button.style.width = `${Math.max(20, pw / data.length)}px`;
      button.style.height = `${ph}px`;

      const values = allSeries.map((s, j) => ({
        label: s.label || s.key,
        value: getVal(row, s.key),
        color: s.color || PALETTE[j % PALETTE.length],
      }));

      const show = () => {
        // Highlight segments / dots / bars
        element.querySelectorAll('[data-sc-dot]').forEach(d => {
          d.setAttribute('visibility', Number(d.dataset.scDot) === index ? 'visible' : 'hidden');
        });
        element.querySelectorAll('[data-sc-index]').forEach(b => {
          b.style.opacity = Number(b.dataset.scIndex) === index ? '1' : '0.25';
        });

        tip.innerHTML = `<strong>${escapeHTML(row.label)}</strong>` + values.map(v =>
          `<span><i style="background:${escapeHTML(v.color)}"></i>${escapeHTML(v.label)}<b>${escapeHTML(formatVal(config, v.value))}</b></span>`
        ).join('');

        tip.hidden = false;
        tip.style.left = `${Math.min(width - 150, Math.max(8, xPos - 70))}px`;
        tip.style.top = `${Math.max(8, T)}px`;

        element.dispatchEvent(new view.CustomEvent('sui:chart:hover', {
          bubbles: true,
          detail: { index, label: row.label, values },
        }));
      };

      const hide = () => {
        element.querySelectorAll('[data-sc-dot]').forEach(d => d.setAttribute('visibility', 'hidden'));
        element.querySelectorAll('[data-sc-index]').forEach(b => { b.style.opacity = '1'; });
        tip.hidden = true;
      };

      button.addEventListener('mouseenter', show);
      button.addEventListener('focus', show);
      button.addEventListener('mouseleave', hide);
      button.addEventListener('blur', hide);
      button.addEventListener('click', () => {
        element.dispatchEvent(new view.CustomEvent('sui:chart:select', {
          bubbles: true,
          detail: { index, label: row.label, values },
        }));
      });

      overlay.append(button);
    });
  }

  render();

  if (typeof view.ResizeObserver === 'function') {
    let prevWidth = element.clientWidth;
    resizeObserver = new view.ResizeObserver(entries => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        if (Math.abs(newWidth - prevWidth) > 8) {
          prevWidth = newWidth;
          render();
        }
      }
    });
    resizeObserver.observe(element);
  }

  const controller = {
    setData(newData) {
      config.data = Array.isArray(newData) ? [...newData] : [];
      render();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      element.innerHTML = '';
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
