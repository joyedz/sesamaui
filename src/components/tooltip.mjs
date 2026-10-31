import { uid, escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { computePlacement } from './overlay-helpers.mjs';

/**
 * Pure builder for Tooltip.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function tooltip(options = {}) {
  const {
    id = uid(),
    content = 'Helpful information',
    placement = 'top',
    trigger = null,
    delay = 150,
    attributes = '',
  } = options;

  let triggerMarkup = '';
  if (trigger && typeof trigger === 'string') {
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
export function initTooltip(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  const trigger = element.querySelector('[data-sui-tooltip-trigger], [data-sx-tooltip], [aria-describedby]');
  const tip = element.querySelector('[role="tooltip"]');

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
      event.preventDefault();
      event.stopPropagation();
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
