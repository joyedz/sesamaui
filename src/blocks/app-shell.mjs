import { escapeHTML, uid } from '../components/shared.mjs';

/**
 * Pure functional builder for App Shell block.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function appShell(options = {}) {
  const {
    id = uid('shell'),
    sidebar = '',
    header = '',
    content = '',
    footer = '',
    detail = '',
    collapsed = false,
    attributes = '',
    classes = '',
  } = options;

  const classList = [
    'sb-app-shell',
    'sx-app-shell',
    collapsed ? 'is-collapsed' : '',
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

  return `<div class="${classList}" data-sui-app-shell id="${escapeHTML(id)}" ${extraAttrs.join(' ')}>${sidebar}<main class="sb-main sx-shell-main">${header}<div class="sb-page-scroll sx-scroll-area">${content}</div>${footer ? `<div class="sb-page-footer">${footer}</div>` : ''}</main>${detail ? `<aside class="sb-detail sx-scroll-area" data-shell-detail>${detail}</aside>` : ''}</div>`;
}

const instances = new WeakMap();

/**
 * Initialize App Shell controller.
 *
 * @param {HTMLElement} element
 * @returns {object|null} Controller instance
 */
export function initAppShell(element) {
  if (!element) return null;
  if (instances.has(element)) return instances.get(element);

  let hoverTimer = null;
  let closeTimer = null;
  let hoverReady = true;

  function isCollapsed() {
    return element.classList.contains('is-collapsed');
  }

  function isPeeking() {
    return element.classList.contains('is-peeking');
  }

  function setCollapsed(val) {
    clearTimeout(hoverTimer);
    clearTimeout(closeTimer);
    const next = Boolean(val);
    element.classList.toggle('is-collapsed', next);
    element.classList.remove('is-peeking');
    hoverReady = !next;

    const toggleBtn = element.querySelector('[data-shell-toggle]');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', String(!next));
      toggleBtn.setAttribute('aria-label', next ? 'Show sidebar' : 'Hide sidebar');
    }

    element.dispatchEvent(new CustomEvent('sui:shell:toggle', {
      bubbles: true,
      detail: { collapsed: next }
    }));
  }

  function setPeeking(val) {
    clearTimeout(hoverTimer);
    clearTimeout(closeTimer);
    element.classList.toggle('is-peeking', Boolean(val));
  }

  function handleClick(e) {
    const toggle = e.target.closest('[data-shell-toggle]');
    if (toggle) {
      setCollapsed(!isCollapsed());
      toggle.blur();
      return;
    }

    const themeBtn = e.target.closest('[data-shell-theme]');
    if (themeBtn) {
      const doc = element.ownerDocument?.documentElement || globalThis.document?.documentElement;
      if (doc) {
        const curMode = doc.dataset.suiTheme || doc.dataset.mode;
        const isDark = curMode === 'dark';
        const nextMode = isDark ? 'light' : 'dark';
        doc.dataset.suiTheme = nextMode;
        doc.dataset.mode = nextMode;

        element.dispatchEvent(new CustomEvent('sui:shell:theme', {
          bubbles: true,
          detail: { theme: nextMode }
        }));
      }
      return;
    }
  }

  function handlePointerEnter(e) {
    const sidebar = e.target.closest('.sb-sidebar, [data-sui-workspace-sidebar]');
    if (!sidebar || !element.contains(sidebar) || sidebar.contains(e.relatedTarget)) return;
    clearTimeout(closeTimer);
    if (isCollapsed()) {
      hoverTimer = setTimeout(() => {
        if (isCollapsed()) {
          element.classList.add('is-peeking');
        }
      }, 200);
    }
  }

  function handlePointerLeave(e) {
    const sidebar = e.target.closest('.sb-sidebar, [data-sui-workspace-sidebar]');
    if (!sidebar || !element.contains(sidebar) || sidebar.contains(e.relatedTarget)) return;
    clearTimeout(hoverTimer);
    if (isPeeking()) {
      closeTimer = setTimeout(() => {
        element.classList.remove('is-peeking');
      }, 200);
    }
  }

  function handleFocusIn(e) {
    const sidebar = e.target.closest('.sb-sidebar, [data-sui-workspace-sidebar]');
    if (sidebar && isCollapsed() && !e.target.closest('[data-shell-toggle]')) {
      element.classList.add('is-peeking');
    }
  }

  element.addEventListener('click', handleClick);
  element.addEventListener('pointerover', handlePointerEnter);
  element.addEventListener('pointerout', handlePointerLeave);
  element.addEventListener('focusin', handleFocusIn);

  const controller = {
    element,
    isCollapsed,
    setCollapsed,
    isPeeking,
    setPeeking,
    setDetail(detailHtml) {
      let detailEl = element.querySelector('[data-shell-detail]');
      if (!detailHtml) {
        detailEl?.remove();
      } else {
        if (!detailEl) {
          detailEl = document.createElement('aside');
          detailEl.className = 'sb-detail sx-scroll-area';
          detailEl.dataset.shellDetail = '';
          element.append(detailEl);
        }
        detailEl.innerHTML = detailHtml;
      }
    },
    destroy() {
      clearTimeout(hoverTimer);
      clearTimeout(closeTimer);
      element.removeEventListener('click', handleClick);
      element.removeEventListener('pointerover', handlePointerEnter);
      element.removeEventListener('pointerout', handlePointerLeave);
      element.removeEventListener('focusin', handleFocusIn);
      instances.delete(element);
    }
  };

  instances.set(element, controller);
  return controller;
}
