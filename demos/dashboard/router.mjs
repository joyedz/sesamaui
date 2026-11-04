import { initAppShell, mount } from '../../src/index.mjs';
import { demoCategories } from '../shared/pages.mjs';

const pages = demoCategories.find(category => category.id === 'dashboard').pages;
const loaders = {
  overview: () => import('./overview.mjs'),
  revenue: () => import('./revenue.mjs'),
  orders: () => import('./orders.mjs'),
  customers: () => import('./customers.mjs')
};
let current;
let revision = 0;
let shellReady = false;

function routeFor(url) {
  return pages.find(page => new URL(page.href, location.href).pathname === url.pathname);
}

function renderShell(markup) {
  const shell = document.querySelector('[data-sui-app-shell]');
  if (!shell) {
    document.getElementById('app').innerHTML = markup;
    return;
  }
  const template = document.createElement('template');
  template.innerHTML = markup;
  shell.querySelector('.sb-main').replaceWith(template.content.querySelector('.sb-main'));
}

function createScope() {
  const abort = new AbortController();
  const disposers = [];
  const persisters = [];
  const timers = new Set();
  return {
    renderShell,
    navigate,
    onDispose(callback) { disposers.push(callback); },
    onPersist(callback) { persisters.push(callback); },
    defer(callback, delay) {
      const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
      timers.add(timer);
      return timer;
    },
    listen(target, type, callback, options = {}) {
      if (target === window && type === 'pagehide') { persisters.push(callback); return; }
      if (target === window && type === 'DOMContentLoaded' && document.readyState !== 'loading') {
        queueMicrotask(() => { if (!abort.signal.aborted) callback(); });
        return;
      }
      target.addEventListener(type, callback, {
        ...(typeof options === 'boolean' ? { capture: options } : options), signal: abort.signal
      });
    },
    save() { for (const callback of persisters) callback(); },
    dispose() {
      this.save();
      abort.abort();
      for (const timer of timers) clearTimeout(timer);
      for (const dialog of document.querySelectorAll('dialog')) { dialog.close(); dialog.remove(); }
      for (const callback of disposers.reverse()) callback();
    }
  };
}

async function navigate(href, { historyMode = 'push', focus = true } = {}) {
  const url = new URL(href, location.href);
  const page = routeFor(url);
  if (!page || url.origin !== location.origin) { location.href = url.href; return; }
  if (current && url.href === location.href && historyMode === 'push') return;
  const request = ++revision;
  try {
    const module = await loaders[page.id]();
    if (request !== revision) return;
    current?.dispose();
    if (historyMode === 'push') history.pushState(null, '', url);
    current = createScope();
    module.createPage(current);
    if (!shellReady) {
      initAppShell(document.querySelector('[data-sui-app-shell]'));
      mount(document.querySelector('[data-sui-workspace-sidebar]'));
      shellReady = true;
    }
    for (const item of document.querySelectorAll('[data-sui-workspace-sidebar] [data-sel]')) {
      const active = item.dataset.treeKey === page.id;
      item.classList.toggle('on', active);
      item.toggleAttribute('data-active', active);
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    }
    document.title = page.id === 'overview' ? 'Sesama · Dashboard overview' : 'Sesama · ' + (page.id === 'revenue' ? 'Revenue report' : page.label);
    const main = document.querySelector('.sb-main');
    if (focus) { main.tabIndex = -1; main.focus({ preventScroll: true }); }
  } catch (error) {
    if (request !== revision) return;
    if (historyMode === 'push') location.assign(url.href);
    else throw error;
  }
}

document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const item = event.target.closest('[data-sui-workspace-sidebar] [data-tree-key]');
  const page = item && pages.find(page => page.id === item.dataset.treeKey);
  const link = event.target.closest('a[href]');
  if (!page && (!link || link.target || link.hasAttribute('download') || !routeFor(new URL(link.href)))) return;
  const url = new URL(page?.href || link.href, location.href);
  if (url.origin !== location.origin) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  navigate(url);
}, true);
window.addEventListener('popstate', () => navigate(location.href, { historyMode: 'none' }));
window.addEventListener('pagehide', () => current?.save());

await navigate(location.href, { historyMode: 'none', focus: false });
