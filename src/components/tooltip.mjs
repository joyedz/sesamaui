import { applySurface, surfaceMode } from './shared.mjs';
import { uid, escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { computePlacement } from './overlay-helpers.mjs';

/**
 * Pure builder for Tooltip.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
function buildTooltip(options = {}) {
  const {
    id = uid(),
    content = 'Helpful information',
    placement = 'top',
    trigger: initialTrigger = null,
    delay = 150,
    attributes = '',
  } = options;

  let trigger = initialTrigger;
  let triggerMarkup = '';
  if (trigger && typeof trigger === 'string') {
    // An explicit Tooltip overrides an Icon Button's automatic tooltip rather
    // than nesting two tooltip triggers around the same action.
    if (trigger.startsWith('<span class="sx-tooltip-wrap"') && trigger.includes('data-sui-icon-button')) {
      const button = trigger.match(/<button\b[\s\S]*?<\/button>/)?.[0];
      const previousId = trigger.match(/<span id="([^"]+)" class="sx-tooltip"/)?.[1];
      if (button) {
        trigger = button.replace(/ data-sui-tooltip-trigger/g, '').replace(/ aria-describedby="([^"]*)"/, (_, ids) => {
          const remaining = ids.split(/\s+/).filter(value => value !== previousId).join(' ');
          return remaining ? ` aria-describedby="${remaining}"` : '';
        });
      }
    }
    if (trigger.includes('aria-describedby')) {
      triggerMarkup = trigger.replace(/aria-describedby="([^"]*)"/, `aria-describedby="$1 ${escapeHTML(id)}" data-sui-tooltip-trigger`);
    } else {
      triggerMarkup = trigger.replace(/>/, ` aria-describedby="${escapeHTML(id)}" data-sui-tooltip-trigger>`);
    }
  } else {
    triggerMarkup = `<button type="button" class="ibtn raised" aria-label="Help" aria-describedby="${escapeHTML(id)}" data-sui-tooltip-trigger data-sx-tooltip="${escapeHTML(id)}">${controlIcon('info')}</button>`;
  }

  const tooltipMarkup = `<span id="${escapeHTML(id)}" class="sx-tooltip" role="tooltip" popover="manual" data-side="${escapeHTML(placement)}">${content}</span>`;

  return `<span class="sx-tooltip-wrap" data-sui-tooltip data-placement="${escapeHTML(placement)}" data-delay="${Number(delay)}"${attributes ? ` ${attributes}` : ''}>${triggerMarkup}${tooltipMarkup}</span>`;
}

let lastTooltipHideTime = 0;
const mounted = new WeakMap();

/**
 * Controller for Tooltip.
 * Manages hover, focus, explicit timers, viewport clamping, and adjacent icon transitions.
 *
 * @param {HTMLElement} element
 * @returns {object} Tooltip controller
 */
export function initTooltip(element, options = {}) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  const trigger = options.trigger || element.querySelector('[data-sui-tooltip-trigger], [data-sx-tooltip], [aria-describedby]');
  const tip = options.tip || element.querySelector('[role="tooltip"]');

  if (!trigger || !tip) {
    throw new TypeError('Tooltip markup is incomplete');
  }

  const placement = element.dataset.placement || tip.dataset.side || 'top';
  const delay = Number(element.dataset.delay) || 150;

  let showTimer = null;
  let hideTimer = null;
  let isVisible = false;
  let destroyed = false;

  function position() {
    if (!trigger || !tip) return;
    const { left, top, placement: actual } = computePlacement(trigger, tip, placement, {
      gap: 6,
      align: 'center',
      clamp: true,
    });
    tip.style.position = 'fixed';
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    tip.dataset.side = actual;
  }

  function show(immediate = false) {
    if (destroyed) return;
    clearTimeout(hideTimer);
    clearTimeout(showTimer);

    const now = Date.now();
    const isAdjacent = now - lastTooltipHideTime < 300;

    if (immediate || isAdjacent || delay <= 0) {
      doShow();
    } else {
      showTimer = setTimeout(doShow, delay);
    }
  }

  function doShow() {
    if (destroyed || isVisible) return;
    if (options.fromLabel || element.hasAttribute?.('data-sui-tooltip-from-label')) {
      tip.textContent = trigger.getAttribute('aria-label') || '';
    }
    // Dismiss any other open tooltips
    const openTips = element.ownerDocument?.querySelectorAll?.('[role="tooltip"]:popover-open') || [];
    for (const other of openTips) {
      if (other !== tip) {
        try { other.hidePopover(); } catch {}
      }
    }

    try {
      tip.showPopover();
      isVisible = true;
      position();
      bindDismissListeners();
      element.dispatchEvent(new view.CustomEvent('sui:tooltip:show', { bubbles: true, detail: { id: tip.id } }));
    } catch {}
  }

  function hide(immediate = false) {
    if (destroyed) return;
    clearTimeout(showTimer);
    clearTimeout(hideTimer);

    if (immediate) {
      doHide();
    } else {
      hideTimer = setTimeout(doHide, 100);
    }
  }

  function doHide() {
    if (destroyed || !isVisible) return;
    try {
      tip.hidePopover();
      isVisible = false;
      lastTooltipHideTime = Date.now();
      unbindDismissListeners();
      element.dispatchEvent(new view.CustomEvent('sui:tooltip:hide', { bubbles: true, detail: { id: tip.id } }));
    } catch {}
  }

  function onPointerEnter() {
    show();
  }

  function onPointerLeave() {
    hide();
  }

  function onFocusIn() {
    show(true);
  }

  function onFocusOut() {
    hide(true);
  }

  function onKeyDown(event) {
    if (event.key === 'Escape' && isVisible) {
      // A decorative tooltip must not swallow the enclosing dialog/menu's Escape.
      hide(true);
    }
  }

  function onScroll() {
    if (isVisible) {
      hide(true);
    }
  }

  function bindDismissListeners() {
    if (typeof view?.addEventListener === 'function') {
      view.addEventListener('scroll', onScroll, { capture: true, passive: true });
    }
    if (typeof element.ownerDocument?.addEventListener === 'function') {
      element.ownerDocument.addEventListener('keydown', onKeyDown, true);
    }
  }

  function unbindDismissListeners() {
    if (typeof view?.removeEventListener === 'function') {
      view.removeEventListener('scroll', onScroll, true);
    }
    if (typeof element.ownerDocument?.removeEventListener === 'function') {
      element.ownerDocument.removeEventListener('keydown', onKeyDown, true);
    }
  }

  trigger.addEventListener('pointerenter', onPointerEnter);
  trigger.addEventListener('pointerleave', onPointerLeave);
  trigger.addEventListener('focus', onFocusIn);
  trigger.addEventListener('blur', onFocusOut);

  const controller = {
    show: () => show(true),
    hide: () => hide(true),
    isVisible: () => isVisible,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      if (isVisible) doHide();
      trigger.removeEventListener('pointerenter', onPointerEnter);
      trigger.removeEventListener('pointerleave', onPointerLeave);
      trigger.removeEventListener('focus', onFocusIn);
      trigger.removeEventListener('blur', onFocusOut);
      unbindDismissListeners();
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}


// Composite controls often need to keep the icon button as a direct child for
// layout. Attach the same tooltip controller without introducing a wrapper.
export function initIconButtonTooltip(button) {
  const tip = button.ownerDocument.createElement('span');
  tip.id = uid();
  tip.className = 'sx-tooltip';
  tip.setAttribute('role', 'tooltip');
  tip.setAttribute('popover', 'manual');
  tip.dataset.side = 'top';
  tip.textContent = button.getAttribute('aria-label') || '';
  // Keep the popup outside component header/text selectors while preserving scope.
  const host = button.closest('.sui-root') || button.parentElement;
  host.append(tip);
  const describedBy = (button.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
  button.setAttribute('aria-describedby', [...describedBy, tip.id].join(' '));
  const controller = initTooltip(button, { trigger: button, tip, fromLabel: true });
  let destroyed = false;
  return {
    ...controller,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      controller.destroy();
      const remaining = (button.getAttribute('aria-describedby') || '').split(/\s+/).filter(id => id && id !== tip.id);
      if (remaining.length) button.setAttribute('aria-describedby', remaining.join(' '));
      else button.removeAttribute('aria-describedby');
      tip.remove();
    },
  };
}


export function tooltip(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildTooltip(...args), mode, ["sx-tooltip"]);
}
