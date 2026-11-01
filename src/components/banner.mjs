import { escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

const VALID_TONES = ['neutral', 'informative', 'success', 'warning', 'error'];

function toneDefaultIcon(tone) {
  switch (tone) {
    case 'success':
      return 'circle-check';
    case 'error':
      return 'circle-x';
    case 'warning':
      return 'triangle-alert';
    case 'informative':
    case 'neutral':
    default:
      return 'info';
  }
}

export function banner(options = {}) {
  const opts = typeof options === 'string' ? { description: options } : options;
  const {
    title = '',
    description = '',
    tone = 'neutral',
    dismissible = false,
    actions = '',
    icon = '',
    attributes = '',
  } = opts;

  if (tone && !VALID_TONES.includes(tone)) {
    throw new TypeError(`Invalid banner tone: ${tone}`);
  }

  const role = tone === 'error' ? 'alert' : 'status';
  const effectiveIcon = icon || toneDefaultIcon(tone);
  const iconMarkup = effectiveIcon
    ? (typeof effectiveIcon === 'string' && effectiveIcon.trim().startsWith('<svg')
        ? effectiveIcon
        : controlIcon(effectiveIcon, 16))
    : '';

  const titleMarkup = title !== '' && title !== undefined ? `<b>${escapeHTML(title)}</b>` : '';
  const descMarkup = description !== '' && description !== undefined ? `<p>${escapeHTML(description)}</p>` : '';
  const actionsMarkup = actions ? `<div class="sx-banner-actions">${actions}</div>` : '';

  const dismissMarkup = dismissible
    ? `<button type="button" class="ibtn sx-banner-dismiss" data-sui-banner-dismiss data-banner-dismiss aria-label="Dismiss banner">${controlIcon('x', 14)}</button>`
    : '';

  const attrs = [
    'data-sui-banner',
    'class="sx sx-banner"',
    `data-tone="${escapeHTML(tone)}"`,
    `role="${role}"`,
    attributes,
  ].filter(Boolean).join(' ');

  return `<div ${attrs}>${iconMarkup}<div class="sx-banner-content">${titleMarkup}${descMarkup}${actionsMarkup}</div>${dismissMarkup}</div>`;
}

const mounted = new WeakMap();

export function initBanner(element) {
  if (!element?.matches) throw new TypeError('initBanner requires a DOM element');
  if (mounted.has(element)) return mounted.get(element);

  let destroyed = false;
  const dismissBtn = element.querySelector('[data-sui-banner-dismiss], [data-banner-dismiss]');

  function dismiss() {
    if (destroyed) return;
    const view = element.ownerDocument.defaultView || globalThis;
    const ev = new view.CustomEvent('sui:dismiss', { bubbles: true, cancelable: true });
    element.dispatchEvent(ev);
    if (ev.defaultPrevented) return;

    // Collapse smoothly in the browser; reduced motion or mock elements
    // without DOM geometry remove instantly.
    const reducedMotion = typeof view.matchMedia === 'function' && view.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || typeof element.classList?.add !== 'function' || typeof element.getBoundingClientRect !== 'function') {
      element.remove();
      controller.destroy();
      return;
    }

    element.style.height = `${element.getBoundingClientRect().height}px`;
    void element.offsetHeight; // reflow so the collapse transition can run
    element.classList.add('is-leaving');
    setTimeout(() => {
      element.remove();
      controller.destroy();
    }, 240);
  }

  function onClick(e) {
    if (dismissBtn && (e.target === dismissBtn || dismissBtn.contains(e.target))) {
      e.preventDefault();
      dismiss();
    }
  }

  if (dismissBtn) {
    element.addEventListener('click', onClick);
  }

  const controller = {
    element,
    get destroyed() {
      return destroyed;
    },
    dismiss,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (dismissBtn) {
        element.removeEventListener('click', onClick);
      }
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
