import { escapeHTML, uid } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

function renderPaginationNumbers(currentPage, totalPages) {
  const pages = Math.max(1, totalPages);
  const rawIndices = [1, currentPage - 1, currentPage, currentPage + 1, pages]
    .filter(n => n >= 1 && n <= pages);
  const indices = [...new Set(rawIndices)].sort((a, b) => a - b);

  return indices.map((n, i) => {
    const ellipsis = (i > 0 && n - indices[i - 1] > 1)
      ? '<span class="sx-page-ellipsis" aria-hidden="true">…</span>'
      : '';
    const isCurrent = n === currentPage;
    const currentAttr = isCurrent ? ' aria-current="page"' : '';
    const activeClass = isCurrent ? ' on' : '';
    return `${ellipsis}<button type="button" class="btn secondary${activeClass}" data-page-number-control data-page-number="${n}" aria-label="Page ${n}"${currentAttr}>${n}</button>`;
  }).join('');
}

/**
 * Pure functional builder for Pagination.
 *
 * @param {object} [options]
 * @returns {string} HTML string
 */
export function pagination(options = {}) {
  const {
    page = 1,
    pageSize = 10,
    totalItems = 0,
    pageSizeOptions = [5, 10, 20, 50],
    showSummary = true,
    summaryText,
    ariaLabel = 'Pagination',
    attributes = '',
  } = options;

  const validTotal = Math.max(0, Number(totalItems) || 0);
  const validSize = Math.max(1, Number(pageSize) || 10);
  const totalPages = Math.max(1, Math.ceil(validTotal / validSize));
  const currentPage = Math.max(1, Math.min(totalPages, Number(page) || 1));

  let sizeSelectHtml = '';
  if (Array.isArray(pageSizeOptions) && pageSizeOptions.length > 0) {
    const opts = [...new Set([...pageSizeOptions, validSize])].sort((a, b) => a - b);
    const optionsHtml = opts.map(n => `<option value="${n}"${n === validSize ? ' selected' : ''}>${n}</option>`).join('');
    sizeSelectHtml = `<label class="sx-row"><span>Rows</span><span class="sx-pagination-size"><select class="sx-select" data-page-size aria-label="Rows per page">${optionsHtml}</select>${controlIcon('chevron-down', 12)}</span></label>`;
  }

  let summaryHtml = '';
  if (showSummary) {
    let summaryContent = '';
    if (typeof summaryText === 'function') {
      summaryContent = escapeHTML(summaryText(currentPage, totalPages, validTotal));
    } else if (typeof summaryText === 'string') {
      summaryContent = escapeHTML(summaryText);
    } else {
      summaryContent = `Page ${currentPage} of ${totalPages} · ${validTotal} items`;
    }
    summaryHtml = `<span class="sx-page-summary" data-page-summary>${summaryContent}</span>`;
  }

  const prevDisabled = currentPage <= 1 ? ' disabled' : '';
  const nextDisabled = currentPage >= totalPages ? ' disabled' : '';
  const numbersHtml = renderPaginationNumbers(currentPage, totalPages);

  const configData = escapeHTML(JSON.stringify({
    page: currentPage,
    pageSize: validSize,
    totalItems: validTotal,
    totalPages,
  }));

  return `<nav class="sx-pagination" aria-label="${escapeHTML(ariaLabel)}" data-sui-pagination data-sui-pagination-config="${configData}"${attributes ? ` ${attributes}` : ''}><div class="sx-pagination-info">${sizeSelectHtml}${summaryHtml}</div><div class="sx-pagination-controls"><button type="button" class="btn secondary" data-page-step="-1" aria-label="Previous page"${prevDisabled}>Previous</button><span class="sx-pagination-numbers" data-pagination-numbers>${numbersHtml}</span><button type="button" class="btn secondary" data-page-step="1" aria-label="Next page"${nextDisabled}>Next</button></div></nav>`;
}

const mounted = new WeakMap();

/**
 * Controller for Pagination.
 *
 * @param {HTMLElement} element
 * @returns {object} Pagination controller
 */
export function initPagination(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  let destroyed = false;

  let config = {};
  try {
    config = JSON.parse(element.dataset.suiPaginationConfig || '{}');
  } catch {
    config = {};
  }

  let currentPage = Number(config.page) || 1;
  let currentSize = Number(config.pageSize) || 10;
  let currentTotal = Number(config.totalItems) || 0;

  function getTotalPages() {
    return Math.max(1, Math.ceil(currentTotal / currentSize));
  }

  function updateUI() {
    const totalPages = getTotalPages();
    currentPage = Math.max(1, Math.min(totalPages, currentPage));

    // Update buttons
    const prevBtn = element.querySelector('[data-page-step="-1"]');
    if (prevBtn) prevBtn.disabled = currentPage <= 1;

    const nextBtn = element.querySelector('[data-page-step="1"]');
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

    const numbersContainer = element.querySelector('[data-pagination-numbers]');
    if (numbersContainer) {
      numbersContainer.innerHTML = renderPaginationNumbers(currentPage, totalPages);
    }

    const summaryEl = element.querySelector('[data-page-summary]');
    if (summaryEl) {
      summaryEl.textContent = `Page ${currentPage} of ${totalPages} · ${currentTotal} items`;
    }

    const selectEl = element.querySelector('[data-page-size]');
    if (selectEl && Number(selectEl.value) !== currentSize) {
      selectEl.value = String(currentSize);
    }

    element.dataset.suiPaginationConfig = JSON.stringify({
      page: currentPage,
      pageSize: currentSize,
      totalItems: currentTotal,
      totalPages,
    });
  }

  function emitChange() {
    element.dispatchEvent(new view.CustomEvent('sui:pagination:change', {
      bubbles: true,
      detail: {
        page: currentPage,
        pageSize: currentSize,
        totalItems: currentTotal,
      },
    }));
  }

  function onClick(event) {
    if (destroyed) return;

    const stepBtn = event.target.closest('[data-page-step]');
    if (stepBtn && element.contains(stepBtn)) {
      event.preventDefault();
      const step = Number(stepBtn.dataset.pageStep);
      const totalPages = getTotalPages();
      const nextPage = currentPage + step;
      if (nextPage >= 1 && nextPage <= totalPages) {
        currentPage = nextPage;
        updateUI();
        emitChange();
      }
      return;
    }

    const numBtn = event.target.closest('[data-page-number]');
    if (numBtn && element.contains(numBtn)) {
      event.preventDefault();
      const targetPage = Number(numBtn.dataset.pageNumber);
      if (targetPage !== currentPage) {
        currentPage = targetPage;
        updateUI();
        emitChange();
      }
    }
  }

  function onChange(event) {
    if (destroyed) return;
    const select = event.target.closest('[data-page-size]');
    if (select && element.contains(select)) {
      const newSize = Number(select.value);
      if (newSize && newSize !== currentSize) {
        currentSize = newSize;
        currentPage = 1;
        updateUI();
        emitChange();
      }
    }
  }

  element.addEventListener('click', onClick);
  element.addEventListener('change', onChange);

  const controller = {
    setPage(p) {
      currentPage = Number(p) || 1;
      updateUI();
    },
    getPage() {
      return currentPage;
    },
    setPageSize(s) {
      currentSize = Math.max(1, Number(s) || 10);
      currentPage = 1;
      updateUI();
    },
    getPageSize() {
      return currentSize;
    },
    setTotal(t) {
      currentTotal = Math.max(0, Number(t) || 0);
      updateUI();
    },
    getTotal() {
      return currentTotal;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      element.removeEventListener('click', onClick);
      element.removeEventListener('change', onChange);
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
