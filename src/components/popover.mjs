import { uid, escapeHTML } from './shared.mjs';
import { button } from './button.mjs';
import { positionOverlay, createDismissManager } from './overlay-helpers.mjs';

/**
 * Pure builder for Popover overlay.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function popover(options = {}) {
  const {
    id = uid(),
    trigger = 'Open',
    content = '',
    placement = 'bottom',
    ariaLabel = 'Dialog',
    attributes = '',
  } = options;

  let triggerMarkup = '';
  if (typeof trigger === 'string') {
    if (trigger.includes('data-sui-popover-trigger') || trigger.includes('popovertarget')) {
      triggerMarkup = trigger;
    } else {
      triggerMarkup = `<button type="button" class="btn secondary" popovertarget="${escapeHTML(id)}" aria-haspopup="dialog" aria-expanded="false" data-sui-popover-trigger>${escapeHTML(trigger)}</button>`;
    }
  } else if (typeof trigger === 'object') {
    const { label = 'Open', variant = 'secondary', icon = null, ...rest } = trigger;
    const triggerAttrs = `popovertarget="${escapeHTML(id)}" aria-haspopup="dialog" aria-expanded="false" data-sui-popover-trigger${rest.attributes ? ` ${rest.attributes}` : ''}`;
    triggerMarkup = button({ label, variant, icon, attributes: triggerAttrs, ...rest });
  }

  return `<div data-sui-popover data-placement="${escapeHTML(placement)}" class="sx-popover-wrapper"${attributes ? ` ${attributes}` : ''}>${triggerMarkup}<div id="${escapeHTML(id)}" class="sx-popup sx-popover-panel" popover="manual" data-sx-popup role="dialog" aria-label="${escapeHTML(ariaLabel)}" data-sui-popover-content>${content}</div></div>`;
}

const mounted = new WeakMap();

/**
 * Controller for Popover overlay.
 * Handles open, close, toggle, positioning, outside click and surrounding scroll dismissal.
 *
 * @param {HTMLElement} element
 * @returns {object} Popover controller
 */
export function initPopover(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  const trigger = element.querySelector('[data-sui-popover-trigger], [popovertarget]');
  const popup = element.querySelector('[data-sui-popover-content], [popover]');

  if (!trigger || !popup) {
    throw new TypeError('Popover markup is incomplete');
  }

  const placement = element.dataset.placement || popup.dataset.placement || 'bottom';
  let isOpen = false;
  let destroyed = false;

  const dismissManager = createDismissManager({
    popup,
    trigger,
    onDismiss: (reason) => {
      close(reason === 'escape');
    },
    onReposition: () => {
      if (isOpen) positionOverlay(trigger, popup, placement);
    },
  });

  function open() {
    if (destroyed || isOpen || trigger.disabled || trigger.matches(':disabled,[aria-disabled="true"]')) return;
    isOpen = true;
    trigger.setAttribute('aria-expanded', 'true');
    popup.showPopover();
    positionOverlay(trigger, popup, placement);
    dismissManager.bind();

    element.dispatchEvent(new view.CustomEvent('sui:popover:open', {
      bubbles: true,
      detail: { id: popup.id, trigger, popup },
    }));
  }

  function close(focusTrigger = false) {
    if (destroyed || !isOpen) return;
    isOpen = false;
    trigger.setAttribute('aria-expanded', 'false');
    popup.hidePopover();
    dismissManager.unbind();

    if (focusTrigger && trigger.isConnected) {
      trigger.focus({ preventScroll: true });
    }

    element.dispatchEvent(new view.CustomEvent('sui:popover:close', {
      bubbles: true,
      detail: { id: popup.id, trigger, popup },
    }));
  }

  function toggle() {
    if (isOpen) close(true);
    else open();
  }

  function onTriggerClick(event) {
    if (destroyed) return;
    event.preventDefault();
    toggle();
  }

  trigger.addEventListener('click', onTriggerClick);

  const controller = {
    open,
    close,
    toggle,
    isOpen: () => isOpen,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (isOpen) close();
      trigger.removeEventListener('click', onTriggerClick);
      dismissManager.unbind();
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
