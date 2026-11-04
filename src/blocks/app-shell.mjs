import { applySurface, surfaceMode } from '../components/shared.mjs';
import { escapeHTML, uid } from '../components/shared.mjs';

/**
 * Pure functional builder for App Shell block.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
function buildAppShell(options = {}) {
  const {
    id = uid('shell'),
    sidebar = '',
    rail = '',
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
    rail ? 'sx-shell-with-rail' : '',
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

  return `<div class="${classList}" data-sui-app-shell id="${escapeHTML(id)}" ${extraAttrs.join(' ')}>${rail ? `<nav class="sx-shell-rail" aria-label="App navigation">${rail}</nav>` : ''}${sidebar}<main class="sb-main sx-shell-main">${header}<div class="sb-page-scroll sx-scroll-area">${content}</div>${footer ? `<div class="sb-page-footer">${footer}</div>` : ''}</main>${detail ? `<aside class="sb-detail sx-scroll-area" data-shell-detail>${detail}</aside>` : ''}</div>`;
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
  let detailMotion = null;
  let finishDetailMotion = null;

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

    for (const toggleBtn of element.querySelectorAll('[data-shell-toggle]')) {
      toggleBtn.setAttribute('aria-expanded', String(!next));
      toggleBtn.setAttribute('aria-label', next ? (toggleBtn.dataset?.shellShowLabel || 'Show sidebar') : (toggleBtn.dataset?.shellHideLabel || 'Hide sidebar'));
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
      element.toggleAttribute('data-sidebar-keyboard', e.detail === 0);
      setCollapsed(!isCollapsed());
      if (e.detail !== 0) toggle.blur();
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
    if (e.target.closest('[data-sidebar-compact]')) return;
    element.removeAttribute('data-sidebar-keyboard');
    const sidebar = e.target.closest('.sb-sidebar, [data-sui-workspace-sidebar]');
    if (!sidebar || !element.contains(sidebar) || sidebar.contains(e.relatedTarget)) return;
    clearTimeout(closeTimer);
    clearTimeout(hoverTimer);
    if (isCollapsed() && !hoverReady) return;
    hoverTimer = setTimeout(() => {
        element.classList.add('is-sidebar-hovered');
        if (isCollapsed() && hoverReady) {
          element.classList.add('is-peeking');
        }
      }, 200);
  }

  function handlePointerLeave(e) {
    if (e.target.closest('[data-sidebar-compact]')) return;
    const sidebar = e.target.closest('.sb-sidebar, [data-sui-workspace-sidebar]');
    if (!sidebar || !element.contains(sidebar) || sidebar.contains(e.relatedTarget)) return;
    clearTimeout(hoverTimer);
    hoverReady = true;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      element.classList.remove('is-sidebar-hovered');
      element.classList.remove('is-peeking');
    }, 200);
  }

  function handleFocusIn(e) {
    if (e.target.closest('[data-sidebar-compact]')) return;
    const sidebar = e.target.closest('.sb-sidebar, [data-sui-workspace-sidebar]');
    if (sidebar && isCollapsed() && e.target.matches(':focus-visible') && !e.target.closest('[data-shell-toggle]')) {
      element.classList.add('is-peeking');
    }
  }

  function handleFocusOut(e) {
    if (e.target.closest('[data-sidebar-compact]')) return;
    const sidebar = e.target.closest('.sb-sidebar, [data-sui-workspace-sidebar]');
    if (!sidebar || sidebar.contains(e.relatedTarget)) return;
    if (!sidebar.matches(':hover')) setPeeking(false);
  }

  element.addEventListener('click', handleClick);
  element.addEventListener('pointerover', handlePointerEnter);
  element.addEventListener('pointerout', handlePointerLeave);
  element.addEventListener('focusin', handleFocusIn);
  element.addEventListener('focusout', handleFocusOut);

  const narrowViewport = element.ownerDocument?.defaultView?.matchMedia?.('(max-width: 760px)');
  let desktopCollapsed = isCollapsed();
  let wasNarrow = false;
  function syncViewport() {
    const narrow = Boolean(narrowViewport?.matches);
    if (narrow === wasNarrow) return;
    if (narrow) {
      desktopCollapsed = isCollapsed();
      setCollapsed(true);
    } else {
      setCollapsed(desktopCollapsed);
    }
    wasNarrow = narrow;
  }
  narrowViewport?.addEventListener?.('change', syncViewport);
  syncViewport();

  const controller = {
    element,
    isCollapsed,
    setCollapsed,
    isPeeking,
    setPeeking,
    setDetail(detailHtml, { animate = false } = {}) {
      let detailEl = element.querySelector('[data-shell-detail]');
      const interruptedStyle = detailMotion && detailEl ? element.ownerDocument.defaultView.getComputedStyle(detailEl) : null;
      const interruptedFrame = interruptedStyle ? { opacity: interruptedStyle.opacity, transform: interruptedStyle.transform } : null;
      // Settle an interrupted exit before reusing or removing its element.
      if (detailMotion) { detailMotion.cancel(); detailMotion = null; }
      finishDetailMotion?.(); finishDetailMotion = null;
      if (!detailHtml && !detailEl) return;
      if (detailHtml) {
        if (!detailEl) {
          detailEl = document.createElement('aside');
          detailEl.className = 'sb-detail sx-scroll-area';
          detailEl.dataset.shellDetail = '';
          element.append(detailEl);
        }
        detailEl.inert = false;
        detailEl.innerHTML = detailHtml;
      }
      const view = element.ownerDocument?.defaultView;
      const reduce = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (!animate || reduce || !detailEl.animate) {
        if (!detailHtml) detailEl.remove();
        return;
      }
      const style = view.getComputedStyle(element);
      const token = style.getPropertyValue(detailHtml ? '--motion-base' : '--motion-fast').trim();
      const duration = token ? parseFloat(token) * (token.endsWith('ms') ? 1 : 1000) : (detailHtml ? 200 : 140);
      const easing = style.getPropertyValue('--ease-out').trim() || 'ease-out';
      const hidden = { opacity: 0, transform: 'translateX(24px)' };
      const visible = { opacity: 1, transform: 'translateX(0)' };
      const frames = detailHtml ? [interruptedFrame || hidden, visible] : [interruptedFrame || visible, hidden];
      if (!detailHtml) detailEl.inert = true;
      detailMotion = detailEl.animate(frames, { duration, easing, fill: 'both' });
      const animation = detailMotion;
      return new Promise(resolve => {
        finishDetailMotion = resolve;
        animation.onfinish = () => {
          if (detailMotion !== animation) return;
          if (!detailHtml) detailEl.remove();
          animation.cancel(); detailMotion = null;
          finishDetailMotion = null; resolve();
        };
      });
    },
    destroy() {
      if (detailMotion) { detailMotion.cancel(); detailMotion = null; }
      finishDetailMotion?.(); finishDetailMotion = null;
      narrowViewport?.removeEventListener?.('change', syncViewport);
      clearTimeout(hoverTimer);
      clearTimeout(closeTimer);
      element.removeEventListener('click', handleClick);
      element.removeEventListener('pointerover', handlePointerEnter);
      element.removeEventListener('pointerout', handlePointerLeave);
      element.removeEventListener('focusin', handleFocusIn);
      element.removeEventListener('focusout', handleFocusOut);
      instances.delete(element);
    }
  };

  instances.set(element, controller);
  return controller;
}


export function appShell(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildAppShell(...args), mode, ["sb-app-shell", "sb-main"]);
}
