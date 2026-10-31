import { uid, escapeHTML } from './shared.mjs';

export function radio(options = {}) {
  const opts = typeof options === 'string' ? { label: options } : options;
  const {
    id = uid(),
    name = '',
    value = '',
    label = '',
    description = '',
    checked = false,
    disabled = false,
    required = false,
    invalid = false,
    attributes = '',
  } = opts;

  const escId = escapeHTML(id);
  const escName = name ? escapeHTML(name) : '';
  const escValue = escapeHTML(value);
  const descId = `${escId}-description`;

  const inputAttrs = [
    `id="${escId}"`,
    'data-sui-radio-input',
    'type="radio"',
    escName ? `name="${escName}"` : '',
    escValue ? `value="${escValue}"` : '',
    checked ? 'checked' : '',
    disabled ? 'disabled' : '',
    required ? 'required' : '',
    invalid ? 'aria-invalid="true"' : '',
    description ? `aria-describedby="${descId}"` : '',
    attributes,
  ].filter(Boolean).join(' ');

  const labelMarkup = label !== '' && label !== undefined
    ? `<label for="${escId}">${escapeHTML(label)}</label>`
    : '';

  const descMarkup = description !== '' && description !== undefined
    ? `<span class="sx-help" id="${descId}">${escapeHTML(description)}</span>`
    : '';

  return `<div data-sui-radio class="sx sx-checkbox-layout"><input ${inputAttrs}>${labelMarkup}${descMarkup}</div>`;
}

const mounted = new WeakMap();

export function initRadio(element) {
  if (!element?.matches) throw new TypeError('initRadio requires a DOM element');
  const input = element.matches('input[type="radio"]') ? element : element.querySelector('input[type="radio"]');
  if (!input) throw new TypeError('Radio input element not found');

  if (mounted.has(input)) return mounted.get(input);

  let destroyed = false;

  const emit = (type, detail) => {
    input.dispatchEvent(new input.ownerDocument.defaultView.CustomEvent(`sui:${type}`, { bubbles: true, detail }));
  };

  function onChange() {
    if (destroyed) return;
    emit('change', {
      name: input.name,
      value: input.value,
      checked: input.checked,
    });
  }

  input.addEventListener('change', onChange);

  const controller = {
    element,
    control: input,
    get destroyed() {
      return destroyed;
    },
    get checked() {
      return input.checked;
    },
    get disabled() {
      return input.disabled;
    },
    get value() {
      return input.value;
    },
    get name() {
      return input.name;
    },
    setChecked(val) {
      if (destroyed) return;
      input.checked = Boolean(val);
    },
    setDisabled(val) {
      if (destroyed) return;
      input.disabled = Boolean(val);
    },
    setRequired(val) {
      if (destroyed) return;
      input.required = Boolean(val);
    },
    checkValidity() {
      return input.checkValidity();
    },
    reportValidity() {
      return input.reportValidity();
    },
    setCustomValidity(msg) {
      input.setCustomValidity(msg);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      input.removeEventListener('change', onChange);
      mounted.delete(input);
    },
  };

  mounted.set(input, controller);
  return controller;
}
