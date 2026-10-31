import { uid, escapeHTML } from './shared.mjs';

const VALID_SIZES = ['sm', 'base', 'lg'];

export function textarea(options = {}) {
  const opts = typeof options === 'string' ? { label: options } : options;
  const {
    id = uid(),
    name = '',
    label = '',
    value = '',
    placeholder = '',
    rows = 3,
    helper = '',
    error = '',
    invalid = false,
    disabled = false,
    readonly = false,
    required = false,
    size = 'base',
    maxLength,
    autoResize = false,
    attributes = '',
  } = opts;

  if (size && !VALID_SIZES.includes(size)) {
    throw new TypeError(`Invalid textarea size: ${size}`);
  }

  const escId = escapeHTML(id);
  const escName = name ? escapeHTML(name) : '';
  const messageId = `${escId}-message`;
  const counterId = `${escId}-counter`;
  const hasMessage = Boolean(helper || error);
  const numRows = Number(rows) || 3;

  const describedBy = [
    hasMessage ? messageId : '',
    maxLength ? counterId : '',
  ].filter(Boolean).join(' ');

  const taAttrs = [
    `id="${escId}"`,
    'data-sui-textarea',
    'class="sx-textarea"',
    escName ? `name="${escName}"` : '',
    `rows="${numRows}"`,
    placeholder ? `placeholder="${escapeHTML(placeholder)}"` : '',
    disabled ? 'disabled' : '',
    readonly ? 'readonly' : '',
    required ? 'required' : '',
    invalid || error ? 'aria-invalid="true"' : '',
    maxLength ? `maxlength="${Number(maxLength)}"` : '',
    maxLength ? 'data-count' : '',
    autoResize ? 'data-autoresize' : '',
    describedBy ? `aria-describedby="${describedBy}"` : '',
    attributes,
  ].filter(Boolean).join(' ');

  const labelMarkup = label !== '' && label !== undefined
    ? `<label class="form-label" for="${escId}">${escapeHTML(label)}${required ? ' <span aria-hidden="true">*</span>' : ''}</label>`
    : '';

  const counterMarkup = maxLength !== undefined
    ? `<output class="sx-counter" id="${counterId}" aria-live="polite">${String(value).length} / ${Number(maxLength)}</output>`
    : '';

  const messageMarkup = hasMessage
    ? `<span class="${error ? 'form-error' : 'form-help'}" id="${messageId}">${escapeHTML(error || helper)}</span>`
    : '';

  return `<div data-sui-textarea-field class="form-field sx-textarea-field">${labelMarkup}<div class="field sx-input-shell sx-textarea-shell sx-size-${size}"><textarea ${taAttrs}>${escapeHTML(value)}</textarea></div>${counterMarkup}${messageMarkup}</div>`;
}

const mounted = new WeakMap();

export function initTextarea(element) {
  if (!element?.matches) throw new TypeError('initTextarea requires a DOM element');
  const ta = element.matches('textarea') ? element : element.querySelector('textarea');
  if (!ta) throw new TypeError('Textarea element not found');

  if (mounted.has(ta)) return mounted.get(ta);

  let destroyed = false;
  const root = ta.closest('[data-sui-textarea-field]') || element;
  const counter = root.querySelector?.('.sx-counter');
  const isAutoResize = ta.hasAttribute('data-autoresize');
  const maxLength = ta.getAttribute('maxlength') ? Number(ta.getAttribute('maxlength')) : null;

  function adjustHeight() {
    if (!isAutoResize || destroyed) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }

  function updateCounter() {
    if (!counter || maxLength === null || destroyed) return;
    counter.textContent = `${ta.value.length} / ${maxLength}`;
  }

  const emit = (type, detail) => {
    ta.dispatchEvent(new ta.ownerDocument.defaultView.CustomEvent(`sui:${type}`, { bubbles: true, detail }));
  };

  function onInput() {
    adjustHeight();
    updateCounter();
  }

  function onChange() {
    if (destroyed) return;
    emit('change', {
      name: ta.name,
      value: ta.value,
    });
  }

  function onReset() {
    ta.ownerDocument.defaultView.setTimeout?.(() => {
      if (destroyed) return;
      adjustHeight();
      updateCounter();
    }, 0);
  }

  ta.addEventListener('input', onInput);
  ta.addEventListener('change', onChange);
  if (ta.form) ta.form.addEventListener('reset', onReset);

  adjustHeight();
  updateCounter();

  const controller = {
    element: root,
    control: ta,
    get destroyed() {
      return destroyed;
    },
    get value() {
      return ta.value;
    },
    get name() {
      return ta.name;
    },
    get disabled() {
      return ta.disabled;
    },
    get required() {
      return ta.required;
    },
    setValue(val) {
      if (destroyed) return;
      ta.value = String(val ?? '');
      adjustHeight();
      updateCounter();
    },
    setDisabled(val) {
      if (destroyed) return;
      ta.disabled = Boolean(val);
    },
    setRequired(val) {
      if (destroyed) return;
      ta.required = Boolean(val);
    },
    checkValidity() {
      return ta.checkValidity();
    },
    reportValidity() {
      return ta.reportValidity();
    },
    setCustomValidity(msg) {
      ta.setCustomValidity(msg);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      ta.removeEventListener('input', onInput);
      ta.removeEventListener('change', onChange);
      if (ta.form) ta.form.removeEventListener('reset', onReset);
      mounted.delete(ta);
    },
  };

  mounted.set(ta, controller);
  return controller;
}
