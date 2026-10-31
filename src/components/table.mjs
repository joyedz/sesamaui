import { escapeHTML, uid } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

function getRowKey(row, keyProp) {
  if (typeof keyProp === 'function') return String(keyProp(row));
  if (keyProp && row && row[keyProp] !== undefined) return String(row[keyProp]);
  if (row && row.id !== undefined) return String(row.id);
  if (row && row.key !== undefined) return String(row.key);
  return '';
}

/**
 * Pure functional builder for Table.
 *
 * @param {object} [options]
 * @returns {string} HTML string
 */
export function table(options = {}) {
  const {
    id = uid('sui-table'),
    columns = [],
    rows = [],
    rowKey = 'id',
    selectionMode = 'none',
    selectedKeys: rawSelectedKeys = [],
    sortColumn = '',
    sortDirection = 'none',
    stickyHeader = true,
    compact = false,
    fixed = false,
    minWidth = 0,
    maxHeight = null,
    ariaLabel = 'Data table',
    rowAction = '',
    emptyMessage = 'No records to display.',
    attributes = '',
  } = options;

  const selectedSet = new Set(
    Array.isArray(rawSelectedKeys)
      ? rawSelectedKeys.map(String)
      : (rawSelectedKeys instanceof Set ? [...rawSelectedKeys].map(String) : [])
  );

  const normSortDirection = (sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : sortDirection) || 'none';

  const cellStyle = col => {
    const align = ['left', 'center', 'right'].includes(col.align) ? col.align : 'left';
    const widthStyle = col.width ? `width:${typeof col.width === 'number' ? `${col.width}px` : col.width};` : '';
    return `text-align:${align};${widthStyle}`;
  };

  const hasSelection = selectionMode === 'single' || selectionMode === 'multiple';

  let selectHeader = '';
  if (selectionMode === 'multiple') {
    const allSelected = rows.length > 0 && rows.every(r => selectedSet.has(getRowKey(r, rowKey)));
    selectHeader = `<th scope="col" class="sx-table-select-col"><input type="checkbox" data-table-select-all aria-label="Select all rows"${allSelected ? ' checked' : ''}></th>`;
  } else if (selectionMode === 'single') {
    selectHeader = '<th scope="col" class="sx-table-select-col"><span class="sr-only">Select</span></th>';
  }

  const thHtml = columns.map(col => {
    const label = col.label || col.header || col.key || '';
    const isSorted = sortColumn === col.key && normSortDirection !== 'none';
    const sortAttr = col.sortable ? ` aria-sort="${isSorted ? normSortDirection : 'none'}"` : '';

    let content = escapeHTML(label);
    if (col.sortable) {
      const iconName = isSorted && normSortDirection === 'ascending' ? 'chevron-up' : 'chevron-down';
      content = `<button type="button" class="sx-sort" data-table-sort="${escapeHTML(col.key)}">${content} ${controlIcon(iconName, 12)}</button>`;
    }

    return `<th scope="col" style="${cellStyle(col)}"${sortAttr}>${content}</th>`;
  }).join('');

  const theadHtml = `<thead class="${stickyHeader ? 'sticky' : ''}"><tr>${selectHeader}${thHtml}</tr></thead>`;

  let tbodyContent = '';
  if (!rows.length) {
    const totalCols = columns.length + (hasSelection ? 1 : 0);
    tbodyContent = `<tr><td colspan="${Math.max(1, totalCols)}" class="sx-empty-cell">${escapeHTML(emptyMessage)}</td></tr>`;
  } else {
    tbodyContent = rows.map((r, rowIdx) => {
      const key = getRowKey(r, rowKey) || String(rowIdx);
      const isSelected = selectedSet.has(key);
      const rowClasses = [isSelected ? 'selected' : ''].filter(Boolean).join(' ');
      const classAttr = rowClasses ? ` class="${rowClasses}"` : '';
      const actionAttr = rowAction ? ` data-table-row-action="${escapeHTML(rowAction)}" tabindex="0" role="button"` : '';

      let selectCell = '';
      if (selectionMode === 'multiple') {
        selectCell = `<td class="sx-table-select-col"><input type="checkbox" data-table-select-row data-row-key="${escapeHTML(key)}" aria-label="Select row"${isSelected ? ' checked' : ''}></td>`;
      } else if (selectionMode === 'single') {
        selectCell = `<td class="sx-table-select-col"><input type="radio" name="${escapeHTML(id)}-select" data-table-select-row data-row-key="${escapeHTML(key)}" aria-label="Select row"${isSelected ? ' checked' : ''}></td>`;
      }

      const cellsHtml = columns.map(col => {
        const val = r[col.key];
        const rendered = col.render ? col.render(val, r) : escapeHTML(val !== undefined && val !== null ? String(val) : '');
        return `<td style="${cellStyle(col)}">${rendered}</td>`;
      }).join('');

      return `<tr data-row-key="${escapeHTML(key)}"${classAttr}${actionAttr} data-row-id="${escapeHTML(key)}">${selectCell}${cellsHtml}</tr>`;
    }).join('');
  }

  const tbodyHtml = `<tbody>${tbodyContent}</tbody>`;

  const wrapClasses = ['sx-table-wrap'];
  if (compact) wrapClasses.push('compact');

  const wrapStyle = maxHeight !== null ? ` style="max-height:${typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight};"` : '';
  const tableStyle = minWidth ? ` style="min-width:${Number(minWidth)}px;"` : '';
  const tableClasses = ['sx-table', fixed ? 'fixed' : ''].filter(Boolean).join(' ');

  const configData = escapeHTML(JSON.stringify({
    rowKey: typeof rowKey === 'string' ? rowKey : 'id',
    selectionMode,
    sortColumn,
    sortDirection: normSortDirection,
    columns: columns.map(c => ({ key: c.key, sortable: Boolean(c.sortable), align: c.align, width: c.width })),
  }));

  return `<div class="${wrapClasses.join(' ')}" data-sui-table id="${escapeHTML(id)}" data-sui-table-config="${configData}"${wrapStyle}${attributes ? ` ${attributes}` : ''}><table class="${tableClasses}" aria-label="${escapeHTML(ariaLabel)}"${tableStyle}>${theadHtml}${tbodyHtml}</table></div>`;
}

const mounted = new WeakMap();

/**
 * Controller for Table.
 *
 * @param {HTMLElement} element
 * @returns {object} Table controller
 */
export function initTable(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  const tableEl = element.querySelector('table');
  if (!tableEl) {
    throw new TypeError('Table markup is incomplete: missing <table>');
  }

  let config = {};
  try {
    config = JSON.parse(element.dataset.suiTableConfig || '{}');
  } catch {
    config = {};
  }

  const selectionMode = config.selectionMode || 'none';
  let sortColumn = config.sortColumn || '';
  let sortDirection = config.sortDirection || 'none';
  let selectedKeys = new Set(
    [...element.querySelectorAll('[data-table-select-row]')].filter(input => input.checked).map(input => input.dataset.rowKey)
  );
  let rowsData = [];
  let destroyed = false;

  function syncSelectionUI() {
    const rowInputs = element.querySelectorAll('[data-table-select-row]');
    for (const inp of rowInputs) {
      const isSelected = selectedKeys.has(inp.dataset.rowKey);
      inp.checked = isSelected;
      inp.closest('tr')?.classList.toggle('selected', isSelected);
    }

    const selectAll = element.querySelector('[data-table-select-all]');
    if (selectAll) {
      const total = rowInputs.length;
      const count = selectedKeys.size;
      selectAll.checked = total > 0 && count === total;
      selectAll.indeterminate = count > 0 && count < total;
    }
  }

  function emitSelection() {
    const selectedArray = [...selectedKeys];
    element.dispatchEvent(new view.CustomEvent('sui:table:select', {
      bubbles: true,
      detail: {
        selectedKeys: selectedArray,
        selectedRows: rowsData.filter(r => selectedKeys.has(getRowKey(r, config.rowKey))),
      },
    }));
  }

  function onSelectAllChange(event) {
    const target = event.target;
    if (target.checked) {
      const rowInputs = element.querySelectorAll('[data-table-select-row]');
      for (const inp of rowInputs) {
        if (inp.dataset.rowKey) selectedKeys.add(inp.dataset.rowKey);
      }
    } else {
      selectedKeys.clear();
    }
    syncSelectionUI();
    emitSelection();
  }

  function onRowSelectChange(event) {
    const target = event.target;
    const key = target.dataset.rowKey;
    if (!key) return;

    if (selectionMode === 'single') {
      selectedKeys.clear();
      if (target.checked) selectedKeys.add(key);
    } else {
      if (target.checked) selectedKeys.add(key);
      else selectedKeys.delete(key);
    }
    syncSelectionUI();
    emitSelection();
  }

  function onTableClick(event) {
    if (destroyed) return;

    // Check if clicking sort button
    const sortBtn = event.target.closest('[data-table-sort]');
    if (sortBtn && element.contains(sortBtn)) {
      event.preventDefault();
      const colKey = sortBtn.dataset.tableSort;
      let nextDir = 'ascending';
      if (sortColumn === colKey) {
        if (sortDirection === 'ascending') nextDir = 'descending';
        else if (sortDirection === 'descending') nextDir = 'none';
        else nextDir = 'ascending';
      }
      setSort(colKey, nextDir);
      return;
    }

    // Check if clicking row action
    const row = event.target.closest('[data-table-row-action]');
    if (row && element.contains(row)) {
      if (event.target.closest('button, a, input, select, textarea, [data-menu], .sx-table-actions, [role="button"]:not([data-table-row-action])')) {
        return;
      }
      const key = row.dataset.rowKey;
      const action = row.dataset.tableRowAction;
      const rowObj = rowsData.find(r => getRowKey(r, config.rowKey) === key) || null;

      element.dispatchEvent(new view.CustomEvent('sui:table:rowclick', {
        bubbles: true,
        detail: { rowKey: key, row: rowObj, action },
      }));
      element.dispatchEvent(new view.CustomEvent('sesama:row-action', {
        bubbles: true,
        detail: { action, key, row: rowObj },
      }));
    }
  }

  function setSort(colKey, direction) {
    sortColumn = colKey;
    sortDirection = direction;

    const headers = element.querySelectorAll('th[data-table-sort], th:has([data-table-sort])');
    for (const th of headers) {
      const btn = th.querySelector('[data-table-sort]') || (th.hasAttribute('data-table-sort') ? th : null);
      if (btn && btn.dataset.tableSort === colKey && direction !== 'none') {
        th.setAttribute('aria-sort', direction);
      } else {
        th.setAttribute('aria-sort', 'none');
      }
    }

    // If client rows exist, sort them
    if (rowsData.length > 0 && direction !== 'none') {
      rowsData.sort((a, b) => {
        const valA = a[colKey];
        const valB = b[colKey];
        const numA = Number(valA);
        const numB = Number(valB);

        let cmp = 0;
        if (!isNaN(numA) && !isNaN(numB)) {
          cmp = numA - numB;
        } else {
          cmp = String(valA || '').localeCompare(String(valB || ''));
        }
        return direction === 'descending' ? -cmp : cmp;
      });
    }

    element.dispatchEvent(new view.CustomEvent('sui:table:sort', {
      bubbles: true,
      detail: { column: colKey, direction },
    }));
  }

  element.addEventListener('click', onTableClick);
  element.addEventListener('change', event => {
    if (event.target.matches('[data-table-select-all]')) {
      onSelectAllChange(event);
    } else if (event.target.matches('[data-table-select-row]')) {
      onRowSelectChange(event);
    }
  });

  const controller = {
    setRows(newRows) {
      rowsData = Array.isArray(newRows) ? [...newRows] : [];
    },
    getRows() {
      return [...rowsData];
    },
    setSelection(keys) {
      selectedKeys = new Set(Array.isArray(keys) ? keys.map(String) : []);
      syncSelectionUI();
    },
    getSelection() {
      return [...selectedKeys];
    },
    getSelectedRows() {
      return rowsData.filter(r => selectedKeys.has(getRowKey(r, config.rowKey)));
    },
    setSort(col, dir) {
      setSort(col, dir);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      element.removeEventListener('click', onTableClick);
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
