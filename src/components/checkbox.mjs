import { uid, escapeHTML } from './shared.mjs';

export function checkbox(options = {}) {
  const opts = typeof options === 'string' ? { label: options } : options;
  const {
    id = uid(),
    name = '',
    value = 'on',
    label = '',
    description = '',
    checked = false,
    indeterminate = false,
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
    'data-sui-checkbox-input',
    'type="checkbox"',
    escName ? `name="${escName}"` : '',
    `value="${escValue}"`,
    checked ? 'checked' : '',
    indeterminate ? 'data-indeterminate="true"' : '',
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

  return `<div data-sui-checkbox class="sx sx-checkbox-layout"><input ${inputAttrs}>${labelMarkup}${descMarkup}</div>`;
}

const mounted = new WeakMap();

export function initCheckbox(element) {
  if (!element?.matches) throw new TypeError('initCheckbox requires a DOM element');
  const input = element.matches('input[type="checkbox"]') ? element : element.querySelector('input[type="checkbox"]');
  if (!input) throw new TypeError('Checkbox input element not found');

  if (mounted.has(input)) return mounted.get(input);

  let destroyed = false;
  const initialIndeterminate = input.hasAttribute('data-indeterminate');
  input.indeterminate = initialIndeterminate;

  const emit = (type, detail) => {
    input.dispatchEvent(new input.ownerDocument.defaultView.CustomEvent(`sui:${type}`, { bubbles: true, detail }));
  };

  function onChange() {
    if (destroyed) return;
    input.indeterminate = false;
    input.removeAttribute('data-indeterminate');
    emit('change', {
      name: input.name,
      checked: input.checked,
      indeterminate: input.indeterminate,
    });
  }

  function onReset() {
    input.ownerDocument.defaultView.setTimeout?.(() => {
      if (destroyed) return;
      if (initialIndeterminate) {
        input.indeterminate = true;
        input.setAttribute('data-indeterminate', 'true');
      } else {
        input.indeterminate = false;
        input.removeAttribute('data-indeterminate');
      }
    }, 0);
  }

  input.addEventListener('change', onChange);
  if (input.form) input.form.addEventListener('reset', onReset);

  const controller = {
    element,
    control: input,
    get destroyed() {
      return destroyed;
    },
    get checked() {
      return input.checked;
    },
    get indeterminate() {
      return input.indeterminate;
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
      input.indeterminate = false;
      input.removeAttribute('data-indeterminate');
    },
    setIndeterminate(val) {
      if (destroyed) return;
      const boolVal = Boolean(val);
      input.indeterminate = boolVal;
      if (boolVal) input.setAttribute('data-indeterminate', 'true');
      else input.removeAttribute('data-indeterminate');
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
      if (input.form) input.form.removeEventListener('reset', onReset);
      mounted.delete(input);
    },
  };

  mounted.set(input, controller);
  return controller;
}
