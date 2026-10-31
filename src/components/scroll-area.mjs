import { escapeHTML } from './shared.mjs';

const VALID_ORIENTATIONS = ['vertical', 'horizontal', 'both'];

export function scrollArea(options = {}) {
  const {
    content = '',
    orientation = 'vertical',
    tabindex = 0,
    ariaLabel = '',
    attributes = '',
  } = options;

  if (orientation && !VALID_ORIENTATIONS.includes(orientation)) {
    throw new TypeError(`Invalid scroll area orientation: ${orientation}`);
  }

  const classes = ['sx-scroll-area', `orientation-${orientation}`].filter(Boolean).join(' ');

  const attrs = [
    'data-sui-scroll-area',
    `class="${classes}"`,
    'role="region"',
    tabindex !== null && tabindex !== undefined ? `tabindex="${tabindex}"` : '',
    ariaLabel ? `aria-label="${escapeHTML(ariaLabel)}"` : '',
    attributes,
  ].filter(Boolean).join(' ');

  return `<div ${attrs}>${content}</div>`;
}

const mounted = new WeakMap();

export function initScrollArea(element) {
  if (!element?.matches) throw new TypeError('initScrollArea requires a DOM element');
  if (mounted.has(element)) return mounted.get(element);

  let destroyed = false;

  function update() {
    if (destroyed) return;
    const isAtTop = element.scrollTop <= 0;
    const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 1;
    const isAtLeft = element.scrollLeft <= 0;
    const isAtRight = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;

    element.toggleAttribute('data-at-top', isAtTop);
    element.toggleAttribute('data-at-bottom', isAtBottom);
    element.toggleAttribute('data-at-start', isAtLeft);
    element.toggleAttribute('data-at-end', isAtRight);
  }

  element.addEventListener('scroll', update, { passive: true });
  update();

  const controller = {
    element,
    get destroyed() {
      return destroyed;
    },
    update,
    scrollTo(options) {
      if (destroyed) return;
      element.scrollTo(options);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      element.removeEventListener('scroll', update);
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
