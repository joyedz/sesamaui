import {
      appShell,
      pageHeader,
      pageLayout,
      dataSection,
      contentSection,
      table,
      pagination,
      statusDot,
      select,
      iconButton,
      menu,
      initModal,
      activityFeed,
      showToast,
      controlIcon,
      escapeHTML,
      mount as mountRuntime
    } from '../../src/index.mjs';
import {
      createSalesSidebar,
      sampleOrders,
      moneyExact
    } from '../shared/data.mjs';
import { readState, writeState } from '../shared/state.mjs';

export function createPage({ renderShell, listen, onDispose, onPersist, navigate, defer }) {
  const setTimeout = defer;
  const sessions = new Set();
  function mount(root) {
    const session = mountRuntime(root);
    sessions.add(session);
    return session;
  }
  onDispose(() => { for (const session of sessions) session.destroy(); });

    const preferences = readState('dashboard:orders');

    
    

    let query = typeof preferences.query === typeof ('') ? preferences.query : '';
    let payment = typeof preferences.payment === typeof ('All payments') ? preferences.payment : 'All payments';
    let fulfillment = typeof preferences.fulfillment === typeof ('All fulfillment') ? preferences.fulfillment : 'All fulfillment';
    let channel = typeof preferences.channel === typeof ('All channels') ? preferences.channel : 'All channels';
    let period = typeof preferences.period === typeof ('All dates') ? preferences.period : 'All dates';
    let page = typeof preferences.page === typeof (1) ? preferences.page : 1;
    let size = typeof preferences.size === typeof (15) ? preferences.size : 15;
    let filtered = [];
    let sortKey = typeof preferences.sortKey === typeof ('date') ? preferences.sortKey : 'date';
    let sortDirection = typeof preferences.sortDirection === typeof ('desc') ? preferences.sortDirection : 'desc';

    renderShell(appShell({
      sidebar: createSalesSidebar('orders'),
      header: pageHeader({ title: 'Orders', icon: 'file-text' }),
      content: pageLayout('<div id="orders-toolbar"></div><div id="orders-results"></div>', { variant: 'data' })
    }));

    function status(text) {
      const tone = text === 'Paid' || text === 'Completed' ? 'success' : text === 'Pending' ? 'warning' : text === 'Refunded' ? 'error' : 'informative';
      return statusDot({ tone, label: text });
    }

    function renderFilters() {
      const menuId = 'orders-menu-actions';
      const menuHTML = menu({
        id: menuId,
        ariaLabel: 'Order actions',
        attributes: 'popover',
        items: [
          { label: 'Export CSV', icon: 'file-down', attributes: 'data-menu-action="orders:export"' },
          { label: 'Copy link', icon: 'copy', attributes: 'data-menu-action="orders:copy"' },
          { label: 'Share', icon: 'share-2', attributes: 'data-menu-action="orders:share"' }
        ]
      });

      document.getElementById('orders-toolbar').innerHTML = contentSection({
        title: 'All orders',
        description: 'Track payments, fulfillment, and order details',
        content: `
          <div class="sb-section-filters orders-filters">
            <label class="field orders-search">
              ${controlIcon('search', 16)}
              <input id="order-search" value="${escapeHTML(query)}" placeholder="Search order or customer…" aria-label="Search orders">
            </label>
            <div class="orders-filter-actions">
              ${select({
                name: 'order-payment',
                label: 'Payment status',
                hideLabel: true,
                value: payment,
                options: ['All payments', 'Paid', 'Pending', 'Refunded']
              })}
              ${select({
                name: 'order-fulfillment',
                label: 'Fulfillment',
                hideLabel: true,
                value: fulfillment,
                options: ['All fulfillment', 'Unfulfilled', 'Processing', 'Shipped', 'Completed']
              })}
              ${select({
                name: 'order-channel',
                label: 'Channel',
                hideLabel: true,
                icon: 'list-filter',
                value: channel,
                options: ['All channels', 'Website', 'Marketplace', 'Direct']
              })}
              ${select({
                name: 'order-period',
                label: 'Order date',
                hideLabel: true,
                icon: 'calendar',
                value: period,
                options: ['All dates', 'Last 7 days']
              })}
              ${iconButton({
                icon: 'kebab',
                variant: 'outline',
                size: 'base',
                attributes: `popovertarget="${menuId}" aria-haspopup="menu"`,
                accessibleLabel: 'Order actions'
              })}
              ${menuHTML}
            </div>
          </div>
        `
      });
      mount(document.getElementById('orders-toolbar'));
    }

    function render() {
      filtered = sampleOrders.filter(r =>
        (r.id + ' ' + r.customer).toLowerCase().includes(query.toLowerCase()) &&
        (payment === 'All payments' || r.payment === payment) &&
        (fulfillment === 'All fulfillment' || r.fulfillment === fulfillment) &&
        (channel === 'All channels' || r.channel === channel) &&
        (period === 'All dates' || r.date >= '2026-10-24')
      );

      filtered.sort((a, b) => {
        const x = a[sortKey], y = b[sortKey];
        const result = typeof x === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true });
        return sortDirection === 'asc' ? result : -result;
      });

      const pages = Math.max(1, Math.ceil(filtered.length / size));
      page = Math.min(page, pages);
      const rows = filtered.slice((page - 1) * size, page * size);

      const columns = [
        { key: 'id', header: 'Order ID' },
        { key: 'customer', header: 'Customer' },
        { key: 'date', header: 'Order date' },
        { key: 'channel', header: 'Channel' },
        { key: 'items', header: 'Items', align: 'right' },
        { key: 'total', header: 'Total', align: 'right', render: moneyExact },
        { key: 'payment', header: 'Payment', render: status },
        { key: 'fulfillment', header: 'Fulfillment', render: status },
        {
          key: 'actions',
          header: 'Actions',
          align: 'right',
          render: (_, r) => `<div class="sx-table-actions">${iconButton({ icon: 'file-text', attributes: `data-order-details="${r.id}"`, accessibleLabel: 'View details for ' + r.id, tooltip: 'View details for ' + r.id })}</div>`
        }
      ];

      columns.forEach(col => { col.sortable = col.key !== 'actions'; });

      const paginationHTML = pagination({
        page,
        pageSize: size,
        totalItems: filtered.length,
        pageSizeOptions: [10, 15, 25, 50]
      });

      const tableHTML = table({
        label: 'Orders',
        rows,
        columns,
        minWidth: 1080,
        rowAction: 'order-details',
        sortKey,
        sortDirection
      });

      document.getElementById('orders-results').innerHTML = '<div style="margin-top:12px">' + dataSection({
        title: '',
        description: '',
        data: tableHTML,
        pagination: paginationHTML
      }) + '</div>';

      mount(document.getElementById('orders-results'));
    }

    renderFilters();
    render();
    mount(document.querySelector('.sb-main'));

    listen(document, 'input', e => {
      if (e.target.id === 'order-search') {
        query = e.target.value;
        page = 1;
        render();
      }
    });

    listen(document, 'sui:pagination:change', e => {
      if (!e.target.closest?.('#orders-results')) return;
      const nextSize = Number(e.detail?.pageSize);
      if (nextSize && nextSize !== size) {
        size = nextSize;
        page = 1;
        render();
      }
    });

    listen(document, 'sui:change', e => {
      if (e.detail?.name?.startsWith('order-')) {
        if (e.detail.name === 'order-payment') payment = e.detail.value;
        if (e.detail.name === 'order-fulfillment') fulfillment = e.detail.value;
        if (e.detail.name === 'order-channel') channel = e.detail.value;
        if (e.detail.name === 'order-period') period = e.detail.value;
        page = 1;
        render();
      }
    });

    listen(document, 'click', event => {
      const sort = event.target.closest('#orders-results [data-table-sort]');
      if (sort) {
        const key = sort.dataset.tableSort;
        sortDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
        sortKey = key;
        page = 1;
        render();
        document.querySelector('#orders-results [data-table-sort="' + key + '"]')?.focus({ preventScroll: true });
        return;
      }

      const option = event.target.closest('[data-select-value]');
      if (option) {
        const input = option.closest('[data-select-demo], [data-sui-select]')?.querySelector('input[type=hidden], select');
        if (input?.name.startsWith('order-')) {
          setTimeout(() => {
            if (input.name === 'order-payment') payment = input.value;
            if (input.name === 'order-fulfillment') fulfillment = input.value;
            if (input.name === 'order-channel') channel = input.value;
            if (input.name === 'order-period') period = input.value;
            page = 1;
            render();
          }, 0);
        }
      }

      const paginationBtn = event.target.closest('#orders-results [data-page-step], #orders-results [data-page-number], #orders-results [data-page-number-control]');
      if (paginationBtn) {
        if (paginationBtn.hasAttribute('data-page-step')) {
          page += Number(paginationBtn.dataset.pageStep);
        } else if (paginationBtn.hasAttribute('data-page-number')) {
          page = Number(paginationBtn.dataset.pageNumber);
        }
        render();
      }

      const detail = event.target.closest('[data-order-details]');
      if (detail) {
        showOrder(sampleOrders.find(r => r.id === detail.dataset.orderDetails), detail);
      }


    });

    listen(document, 'sesama:row-action', event => {
      if (event.detail.action === 'order-details') {
        showOrder(sampleOrders.find(r => r.id === event.detail.key), event.target);
      }
    });

    function showOrder(order, trigger) {
      if (!order) return;
      const dialog = document.createElement('dialog');
      dialog.className = 'ds-modal';
      dialog.dataset.size = 'lg';
      dialog.setAttribute('aria-labelledby', 'order-detail-title');

      const subtotal = Math.round(order.total / 1.1 * 100) / 100;
      const tax = order.total - subtotal;

      const metadata = `
        <dl class="order-info-grid">
          <div><dt>Order date</dt><dd>${order.date} 13:20</dd></div>
          <div><dt>Customer</dt><dd>${escapeHTML(order.customer)}</dd></div>
          <div><dt>Channel</dt><dd>${escapeHTML(order.channel)}</dd></div>
          <div><dt>Payment</dt><dd>${status(order.payment)}</dd></div>
          <div><dt>Fulfillment</dt><dd>${status(order.fulfillment)}</dd></div>
        </dl>
      `;

      const items = table({
        label: 'Order items and payment summary',
        columns: [
          { key: 'name', header: 'Product' },
          { key: 'quantity', header: 'Qty', align: 'right', width: 48 },
          { key: 'amount', header: 'Amount', align: 'right', width: 120, render: moneyExact }
        ],
        rows: [{ id: 1, name: 'Essential cotton tee', quantity: order.items, amount: subtotal }]
      }).replace('</tbody></table>', `</tbody><tfoot><tr><td colspan="2">Subtotal</td><td>${moneyExact(subtotal)}</td></tr><tr><td colspan="2">Tax (10%)</td><td>${moneyExact(tax)}</td></tr><tr class="order-total"><td colspan="2">Total</td><td>${moneyExact(order.total)}</td></tr></tfoot></table>`);

      const activity = activityFeed({
        items: [
          { title: 'Order created', time: order.date, icon: 'file-text' },
          { title: 'Payment ' + order.payment.toLowerCase(), time: 'Payment status', icon: 'circle-check' },
          { title: 'Fulfillment: ' + order.fulfillment, time: 'Current status', icon: 'archive' }
        ]
      });

      dialog.innerHTML = `
        <div class="sx-modal-header">
          <h2 id="order-detail-title">${order.id}</h2>
          ${iconButton({ icon: 'x', classes: 'sx-modal-close', attributes: 'data-modal-close', accessibleLabel: 'Close dialog' })}
        </div>
        <div class="sx-modal-body order-detail-content">
          ${contentSection({ title: 'Order Details', content: `<div class="order-section-inset">${metadata}</div>` })}
          ${contentSection({ title: 'Items', content: items })}
          ${contentSection({ title: 'Order history', content: `<div class="order-section-inset">${activity}</div>` })}
        </div>
        <div class="actions">
          <button type="button" class="btn secondary" data-modal-close>Close</button>
        </div>
      `;

      document.body.append(dialog);
      const modalInstance = initModal(dialog);
      dialog.addEventListener('close', () => {
        modalInstance.destroy();
        dialog.remove();
      }, { once: true });
      modalInstance.open(trigger);
    }

    const requestedOrder = new URLSearchParams(location.search).get('order');
    if (requestedOrder) {
      const order = sampleOrders.find(r => r.id === requestedOrder);
      if (order) {
        listen(window, 'DOMContentLoaded', () => {
          showOrder(order, document.querySelector('#orders-results [data-row-id="' + order.id + '"]') || document.querySelector('.sb-page-header'));
        }, { once: true });
      }
    }

    function exportOrders() {
      const keys = ['id', 'customer', 'date', 'channel', 'items', 'total', 'payment', 'fulfillment'];
      const csv = [keys.join(','), ...filtered.map(r => keys.map(k => '"' + String(r[k]).replaceAll('"', '""') + '"').join(','))].join('\r\n');
      const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.csv';
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    listen(document, 'click', async event => {
      const item = event.target.closest('[data-menu-action^="orders:"]');
      if (!item) return;
      event.stopImmediatePropagation();
      item.closest('[popover]')?.hidePopover();
      if (item.dataset.menuAction === 'orders:export') {
        exportOrders();
        return;
      }
      try {
        if (item.dataset.menuAction === 'orders:share' && navigator.share) {
          await navigator.share({ title: 'Orders', url: location.href });
        } else {
          await navigator.clipboard.writeText(location.href);
          showToast('Link copied.', 'success');
        }
      } catch (error) {
        if (error.name !== 'AbortError') showToast('Sharing is unavailable.');
      }
    }, true);
  
    onPersist(() => writeState('dashboard:orders', { query, payment, fulfillment, channel, period, page, size, sortKey, sortDirection }));

}
