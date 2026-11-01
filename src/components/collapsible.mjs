import { escapeHTML, uid as uniqueId } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

/**
 * Pure functional builder for Collapsible.
 *
 * @param {object} [options]
 * @returns {string} HTML string
 */
export function collapsible(options = {}) {
  const {
    id = uniqueId('sui-collapsible'),
    trigger = 'Details',
    content = '',
    open = false,
    attributes = '',
  } = options;

  const isOpen = Boolean(open);
  const contentId = `${id}-content`;
  const chevronHtml = `<span class="sx-collapsible-chevron" aria-hidden="true">${controlIcon('chevron-down', 12)}</span>`;
  const triggerHtml = typeof trigger === 'string' && trigger.trim().startsWith('<')
    ? trigger
    : `<span class="sx-collapsible-trigger-text">${escapeHTML(trigger)}</span>`;

  return `<div class="sx-collapsible" data-sui-collapsible id="${escapeHTML(id)}" data-open="${isOpen ? 'true' : 'false'}"${attributes ? ` ${attributes}` : ''}><button type="button" class="sx-collapsible-trigger btn ghost" data-collapsible-trigger aria-expanded="${isOpen ? 'true' : 'false'}" aria-controls="${escapeHTML(contentId)}">${triggerHtml}${chevronHtml}</button><div id="${escapeHTML(contentId)}" class="sx-collapsible-content" data-collapsible-content${isOpen ? '' : ' hidden'}><div class="sx-collapsible-inner">${content}</div></div></div>`;
}

const mounted = new WeakMap();

/**
 * Controller for Collapsible.
 *
 * @param {HTMLElement} element
 * @returns {object} Collapsible controller
 */
export function initCollapsible(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  const trigger = element.querySelector('[data-collapsible-trigger]');
  const content = element.querySelector('[data-collapsible-content]');

  if (!trigger || !content) {
    throw new TypeError('Collapsible markup is incomplete: missing trigger or content');
  }

  let isOpen = trigger.getAttribute('aria-expanded') === 'true' || element.dataset.open === 'true';
  let isAnimating = false;
  let animTimer = null;
  let destroyed = false;

  function finishTransition() {
    isAnimating = false;
    if (animTimer) {
      clearTimeout(animTimer);
      animTimer = null;
    }
    content.style.height = '';
    content.style.transition = '';
    content.removeEventListener('transitionend', onTransitionEnd);
  }

  function onTransitionEnd(e) {
    if (e.target !== content || e.propertyName !== 'height') return;
    finishTransition();
    if (!isOpen) {
      content.hidden = true;
    }
  }

  function setOpen(shouldOpen) {
    if (destroyed) return;
    if (shouldOpen === isOpen && !isAnimating) return;

    isOpen = Boolean(shouldOpen);
    finishTransition();

    element.dataset.open = String(isOpen);
    trigger.setAttribute('aria-expanded', String(isOpen));

    const reducedMotion = typeof view.matchMedia === 'function'
      ? view.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    // In non-browser or reduced-motion environments, switch immediately
    if (reducedMotion || !content.style || typeof content.getBoundingClientRect !== 'function') {
      content.hidden = !isOpen;
      element.dispatchEvent(new view.CustomEvent('sui:collapsible:toggle', {
        bubbles: true,
        detail: { open: isOpen },
      }));
      return;
    }

    isAnimating = true;
    content.addEventListener('transitionend', onTransitionEnd);

    if (isOpen) {
      content.hidden = false;
      const height = content.scrollHeight || 0;
      content.style.height = '0px';

      // Force reflow
      void content.offsetHeight;

      content.style.transition = 'height var(--motion-base) var(--ease-out)';
      content.style.height = `${height}px`;

      animTimer = setTimeout(() => {
        finishTransition();
      }, 250);
    } else {
      const height = content.scrollHeight || 0;
      content.style.height = `${height}px`;

      // Force reflow
      void content.offsetHeight;

      content.style.transition = 'height var(--motion-base) var(--ease-out)';
      content.style.height = '0px';

      animTimer = setTimeout(() => {
        finishTransition();
        content.hidden = true;
      }, 250);
    }

    element.dispatchEvent(new view.CustomEvent('sui:collapsible:toggle', {
      bubbles: true,
      detail: { open: isOpen },
    }));
  }

  function onTriggerClick(event) {
    event.preventDefault();
    setOpen(!isOpen);
  }

  trigger.addEventListener('click', onTriggerClick);

  const controller = {
    setOpen(openState) {
      setOpen(openState);
    },
    toggle() {
      setOpen(!isOpen);
    },
    isOpen() {
      return isOpen;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      finishTransition();
      trigger.removeEventListener('click', onTriggerClick);
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
