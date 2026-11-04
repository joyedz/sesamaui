import {
      appShell,
      pageHeader,
      pageLayout,
      contentSection,
      dataSection,
      table,
      pagination,
      avatar,
      statusDot,
      select,
      iconButton,
      menu,
      initModal,
      showToast,
      controlIcon,
      escapeHTML,
      mount as mountRuntime
    } from '../../src/index.mjs';
import {
      createSalesSidebar,
      sampleCustomers,
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

    const preferences = readState('dashboard:customers');

    
    

    let query = typeof preferences.query === typeof ('') ? preferences.query : '';
    let statusFilter = typeof preferences.statusFilter === typeof ('All customers') ? preferences.statusFilter : 'All customers';
    let channel = typeof preferences.channel === typeof ('All channels') ? preferences.channel : 'All channels';
    let joined = typeof preferences.joined === typeof ('Any time') ? preferences.joined : 'Any time';
    let page = typeof preferences.page === typeof (1) ? preferences.page : 1;
    let size = typeof preferences.size === typeof (15) ? preferences.size : 15;
    let sortKey = typeof preferences.sortKey === typeof ('spent') ? preferences.sortKey : 'spent';
    let direction = typeof preferences.direction === typeof ('desc') ? preferences.direction : 'desc';
    let filtered = [];

    const statusBadge = s => statusDot({
      tone: s === 'Active' ? 'success' : s === 'New' ? 'informative' : 'neutral',
      label: s
    });

    renderShell(appShell({
      sidebar: createSalesSidebar('customers'),
      header: pageHeader({ title: 'Customers', icon: 'users' }),
      content: pageLayout('<div id="customer-toolbar"></div><div id="customer-results" style="margin-top:12px"></div>', { variant: 'data' })
    }));

    function renderFilters() {
      const menuId = 'customer-actions-menu';
      const menuHTML = menu({
        id: menuId,
        ariaLabel: 'Customer actions',
        attributes: 'popover',
        items: [
          { label: 'Export CSV', icon: 'file-down', attributes: 'data-menu-action="customers:export"' },
          { label: 'Copy link', icon: 'copy', attributes: 'data-menu-action="customers:copy"' },
          { label: 'Share', icon: 'share-2', attributes: 'data-menu-action="customers:share"' }
        ]
      });

      document.getElementById('customer-toolbar').innerHTML = contentSection({
        title: 'All customers',
        description: 'Manage customer relationships and purchase history',
        content: `
          <div class="sb-section-filters orders-filters">
            <label class="field orders-search">
              ${controlIcon('search', 16)}
              <input id="customer-search" placeholder="Search name or email…" aria-label="Search customers" value="${escapeHTML(query)}">
            </label>
            <div class="orders-filter-actions">
              ${select({
                name: 'customer-status',
                label: 'Status',
                hideLabel: true,
                value: statusFilter,
                options: ['All customers', 'Active', 'New', 'Inactive']
              })}
              ${select({
                name: 'customer-channel',
                label: 'Channel',
                hideLabel: true,
                icon: 'list-filter',
                value: channel,
                options: ['All channels', 'Website', 'Marketplace', 'Direct']
              })}
              ${select({
                name: 'customer-joined',
                label: 'Joined',
                hideLabel: true,
                icon: 'calendar',
                value: joined,
                options: ['Any time', 'Joined this quarter']
              })}
              ${iconButton({
                icon: 'kebab',
                variant: 'outline',
                size: 'base',
                attributes: `popovertarget="${menuId}" aria-haspopup="menu"`,
                accessibleLabel: 'Customer actions'
              })}
              ${menuHTML}
            </div>
          </div>
        `
      });
      mount(document.getElementById('customer-toolbar'));
    }

    function render() {
      filtered = sampleCustomers.filter(c =>
        (c.name + ' ' + c.email).toLowerCase().includes(query.toLowerCase()) &&
        (statusFilter === 'All customers' || c.status === statusFilter) &&
        (channel === 'All channels' || c.channel === channel) &&
        (joined === 'Any time' || c.joined >= '2026-07-01')
      );

      filtered.sort((a, b) => {
        const x = a[sortKey], y = b[sortKey];
        return (typeof x === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true })) * (direction === 'asc' ? 1 : -1);
      });

      page = Math.min(page, Math.max(1, Math.ceil(filtered.length / size)));

      const columns = [
        {
          key: 'name',
          header: 'Customer',
          render: (_, c) => {
            const inits = c.name.split(' ').map(n => n[0]).join('');
            const av = avatar({ name: c.name, initials: inits, size: 24 });
            return `<div class="customer-identity">${av}<div><div>${escapeHTML(c.name)}</div><span>${escapeHTML(c.email)}</span></div></div>`;
          }
        },
        { key: 'orders', header: 'Orders', align: 'right' },
        { key: 'spent', header: 'Total spent', align: 'right', render: moneyExact },
        { key: 'last', header: 'Last order' },
        { key: 'joined', header: 'Joined' },
        { key: 'status', header: 'Status', render: statusBadge },
        {
          key: 'actions',
          header: 'Actions',
          align: 'right',
          render: (_, c) => `<div class="sx-table-actions">${iconButton({ icon: 'file-text', attributes: `data-customer-details="${c.id}"`, accessibleLabel: 'View ' + c.name, tooltip: 'View ' + c.name })}</div>`
        }
      ];

      columns.forEach(c => { c.sortable = c.key !== 'actions'; });

      const paginationHTML = pagination({
        page,
        pageSize: size,
        totalItems: filtered.length,
        pageSizeOptions: [10, 15, 25, 50]
      });

      const tableHTML = table({
        label: 'Customers',
        rows: filtered.slice((page - 1) * size, page * size),
        columns,
        minWidth: 980,
        rowAction: 'customer-details',
        sortKey,
        sortDirection: direction
      });

      document.getElementById('customer-results').innerHTML = dataSection({
        title: '',
        data: tableHTML,
        pagination: paginationHTML
      });

      mount(document.getElementById('customer-results'));
    }

    renderFilters();
    render();
    mount(document.querySelector('.sb-main'));

    listen(document, 'input', e => {
      if (e.target.id === 'customer-search') {
        query = e.target.value;
        page = 1;
        render();
      }
    });

    listen(document, 'sui:pagination:change', e => {
      if (!e.target.closest?.('#customer-results')) return;
      const nextSize = Number(e.detail?.pageSize);
      if (nextSize && nextSize !== size) {
        size = nextSize;
        page = 1;
        render();
      }
    });

    listen(document, 'sui:change', e => {
      if (e.detail?.name?.startsWith('customer-')) {
        if (e.detail.name === 'customer-status') statusFilter = e.detail.value;
        if (e.detail.name === 'customer-channel') channel = e.detail.value;
        if (e.detail.name === 'customer-joined') joined = e.detail.value;
        page = 1;
        render();
      }
    });

    listen(document, 'click', e => {
      const option = e.target.closest('[data-select-value]');
      if (option) {
        const input = option.closest('[data-select-demo], [data-sui-select]')?.querySelector('input[type=hidden], select');
        if (input?.name.startsWith('customer-')) {
          setTimeout(() => {
            if (input.name === 'customer-status') statusFilter = input.value;
            if (input.name === 'customer-channel') channel = input.value;
            if (input.name === 'customer-joined') joined = input.value;
            page = 1;
            render();
          }, 0);
        }
      }

      const sort = e.target.closest('#customer-results [data-table-sort]');
      if (sort) {
        direction = sortKey === sort.dataset.tableSort && direction === 'asc' ? 'desc' : 'asc';
        sortKey = sort.dataset.tableSort;
        page = 1;
        render();
        document.querySelector('[data-table-sort="' + sortKey + '"]')?.focus({ preventScroll: true });
        return;
      }

      const paging = e.target.closest('#customer-results [data-page-step], #customer-results [data-page-number], #customer-results [data-page-number-control]');
      if (paging) {
        if (paging.hasAttribute('data-page-step')) {
          page += Number(paging.dataset.pageStep);
        } else if (paging.hasAttribute('data-page-number')) {
          page = Number(paging.dataset.pageNumber);
        }
        render();
      }

      const detail = e.target.closest('[data-customer-details]');
      if (detail) {
        showCustomer(sampleCustomers.find(c => c.id === detail.dataset.customerDetails), detail);
      }


    });

    listen(document, 'sesama:row-action', e => {
      if (e.detail.action === 'customer-details') {
        showCustomer(sampleCustomers.find(c => c.id === e.detail.key), e.target);
      }
      if (e.detail.action === 'customer-order') {
        navigate('Orders.html?order=' + encodeURIComponent(e.detail.key));
      }
    });

    function showCustomer(customer, trigger) {
      if (!customer) return;
      const dialog = document.createElement('dialog');
      dialog.className = 'ds-modal';
      dialog.dataset.size = 'lg';
      dialog.setAttribute('aria-labelledby', 'customer-title');

      const fields = [
        ['Email', escapeHTML(customer.email)],
        ['Phone', customer.phone],
        ['Joined', customer.joined],
        ['Channel', customer.channel],
        ['Status', statusBadge(customer.status)]
      ];

      const metrics = [
        ['Orders', customer.orders],
        ['Total spent', moneyExact(customer.spent)],
        ['Avg. order value', moneyExact(customer.spent / customer.orders)]
      ];

      const recent = Array.from({ length: Math.min(4, customer.orders) }, (_, i) => ({
        id: 'ORD-' + (2101 + (Number(customer.id.slice(4)) - 1001 + i) % 36),
        date: customer.last,
        total: Math.round(customer.spent / customer.orders * 100) / 100,
        status: i === 0 ? 'Processing' : 'Completed'
      }));

      const history = table({
        label: 'Customer order history',
        columns: [
          { key: 'id', header: 'Order ID' },
          { key: 'date', header: 'Date' },
          { key: 'total', header: 'Total', align: 'right', render: moneyExact },
          { key: 'status', header: 'Status', render: s => statusDot({ tone: s === 'Completed' ? 'success' : 'informative', label: s }) }
        ],
        rows: recent,
        rowAction: 'customer-order'
      });

      dialog.innerHTML = `
        <div class="sx-modal-header">
          <h2 id="customer-title">${escapeHTML(customer.name)}</h2>
          ${iconButton({ icon: 'x', classes: 'sx-modal-close', attributes: 'data-modal-close', accessibleLabel: 'Close dialog' })}
        </div>
        <div class="sx-modal-body order-detail-content">
          ${contentSection({
            title: 'Customer Details',
            content: `<div class="order-section-inset"><dl class="order-info-grid">${fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl></div>`
          })}
          ${contentSection({
            title: 'Purchase Overview',
            content: `<dl class="order-info-grid order-section-inset">${metrics.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>`
          })}
          ${contentSection({
            title: 'Recent Orders',
            content: history
          })}
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

    function exportCustomers() {
      const keys = ['id', 'name', 'email', 'orders', 'spent', 'last', 'joined', 'status', 'channel'];
      const csv = [keys.join(','), ...filtered.map(c => keys.map(k => '"' + String(c[k]).replaceAll('"', '""') + '"').join(','))].join('\r\n');
      const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'customers.csv';
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    listen(document, 'click', async e => {
      const item = e.target.closest('[data-menu-action^="customers:"]');
      if (!item) return;
      e.stopImmediatePropagation();
      item.closest('[popover]')?.hidePopover();
      const action = item.dataset.menuAction;
      if (action === 'customers:export') {
        exportCustomers();
        return;
      }
      try {
        if (action === 'customers:share' && navigator.share) {
          await navigator.share({ title: 'Customers', url: location.href });
        } else {
          await navigator.clipboard.writeText(location.href);
          showToast('Link copied.', 'success');
        }
      } catch (error) {
        if (error.name !== 'AbortError') showToast('Sharing is unavailable.');
      }
    }, true);
  
    onPersist(() => writeState('dashboard:customers', { query, statusFilter, channel, joined, page, size, sortKey, direction }));

}
