import { escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

const VALID_TONES = ['neutral', 'informative', 'success', 'warning', 'error'];
const VALID_VARIANTS = ['static', 'selectable', 'removable'];

export function chip(options = {}) {
  const opts = typeof options === 'string' ? { label: options } : options;
  const {
    label = '',
    tone = 'neutral',
    variant: userVariant,
    selected = false,
    disabled = false,
    icon = '',
    removable = false,
    attributes = '',
  } = opts;

  let variant = userVariant;
  if (!variant) {
    if (removable) variant = 'removable';
    else if (selected) variant = 'selectable';
    else variant = 'static';
  }

  if (tone && !VALID_TONES.includes(tone)) throw new TypeError(`Invalid chip tone: ${tone}`);
  if (variant && !VALID_VARIANTS.includes(variant)) throw new TypeError(`Invalid chip variant: ${variant}`);

  const iconMarkup = icon
    ? (typeof icon === 'string' && icon.trim().startsWith('<svg') ? icon : controlIcon(icon, 14))
    : '';

  const labelMarkup = label !== '' && label !== undefined ? `<span>${escapeHTML(label)}</span>` : '';

  if (variant === 'selectable') {
    const classes = ['chip', `tone-${tone}`, selected ? 'selected' : ''].filter(Boolean).join(' ');
    const attrs = [
      'data-sui-chip',
      'type="button"',
      `class="${classes}"`,
      'data-sui-chip-select',
      `aria-pressed="${Boolean(selected)}"`,
      disabled ? 'disabled' : '',
      attributes,
    ].filter(Boolean).join(' ');

    return `<button ${attrs}>${iconMarkup}${labelMarkup}</button>`;
  }

  if (variant === 'removable') {
    const classes = ['chip', `tone-${tone}`].filter(Boolean).join(' ');
    const attrs = [
      'data-sui-chip',
      `class="${classes}"`,
      'data-sui-chip-removable',
      attributes,
    ].filter(Boolean).join(' ');

    const removeBtn = `<button type="button" class="ibtn sx-chip-remove" data-sui-chip-remove data-chip-remove aria-label="Remove ${escapeHTML(label)} tag" ${disabled ? 'disabled' : ''}>${controlIcon('x', 12)}</button>`;

    return `<span ${attrs}>${iconMarkup}${labelMarkup}${removeBtn}</span>`;
  }

  const classes = ['chip', `tone-${tone}`].filter(Boolean).join(' ');
  const attrs = [
    'data-sui-chip',
    `class="${classes}"`,
    attributes,
  ].filter(Boolean).join(' ');

  return `<span ${attrs}>${iconMarkup}${labelMarkup}</span>`;
}

const mounted = new WeakMap();

export function initChip(element) {
  if (!element?.matches) throw new TypeError('initChip requires a DOM element');
  if (mounted.has(element)) return mounted.get(element);

  let destroyed = false;
  const isSelectable = element.hasAttribute('data-sui-chip-select') || element.hasAttribute('aria-pressed');
  const removeBtn = element.querySelector('[data-sui-chip-remove], [data-chip-remove]');
  const labelText = element.querySelector('span')?.textContent || '';

  const emit = (type, detail) => {
    element.dispatchEvent(new element.ownerDocument.defaultView.CustomEvent(`sui:${type}`, { bubbles: true, detail }));
  };

  function onClick(e) {
    if (destroyed || element.disabled) return;
    if (isSelectable) {
      const next = element.getAttribute('aria-pressed') !== 'true';
      element.setAttribute('aria-pressed', String(next));
      element.classList.toggle('selected', next);
      emit('change', { label: labelText, selected: next });
      return;
    }

    if (removeBtn && (e.target === removeBtn || removeBtn.contains(e.target))) {
      e.preventDefault();
      emit('remove', { label: labelText });
    }
  }

  element.addEventListener('click', onClick);

  const controller = {
    element,
    get destroyed() {
      return destroyed;
    },
    get selected() {
      return element.getAttribute('aria-pressed') === 'true';
    },
    setSelected(val) {
      if (!isSelectable || destroyed) return;
      const boolVal = Boolean(val);
      element.setAttribute('aria-pressed', String(boolVal));
      element.classList.toggle('selected', boolVal);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      element.removeEventListener('click', onClick);
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
