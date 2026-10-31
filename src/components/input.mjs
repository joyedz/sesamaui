import { uid, escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

export function inputField(options = {}) {
  const {
    id = uid(),
    name = '',
    label = '',
    ariaLabel = '',
    type = 'text',
    placeholder = '',
    value = '',
    autocomplete = '',
    required = false,
    disabled = false,
    readonly = false,
    invalid = false,
    helper = '',
    error = '',
    prefix = '',
    suffix = '',
    phonePrefix = false,
    size = 'base',
    passwordToggle = type === 'password',
    errorSlot = false,
  } = options;

  if (type && !['text','email','password','tel','url','search','number'].includes(type)) {
    throw new TypeError('Unsupported input type');
  }
  if (size && !['sm','base','lg'].includes(size)) {
    throw new TypeError('Invalid input size');
  }
  if (passwordToggle && !['password','text'].includes(type)) {
    throw new TypeError('Password toggle requires a text or password input');
  }

  const messageId = `${id}-message`;
  const hasMessage = Boolean(helper || error || errorSlot);
  const isInvalid = Boolean(invalid || error);
  const resolvedSize = ['sm','base','lg'].includes(size) ? size : 'base';
  const effectiveAriaLabel = ariaLabel || (!label ? (name || 'Input') : '');

  let prefixMarkup = '';
  if (prefix) {
    const isPhone = phonePrefix || type === 'tel';
    prefixMarkup = `<span class="${isPhone ? 'phone-prefix' : 'phone-prefix sx-affix'}">${escapeHTML(prefix)}</span>`;
  }

  let suffixMarkup = '';
  if (suffix) {
    suffixMarkup = `<span class="sx-affix sx-suffix">${escapeHTML(suffix)}</span>`;
  }

  let toggleMarkup = '';
  if (passwordToggle) {
    const isText = type === 'text';
    toggleMarkup = `<button type="button" class="ibtn" data-sui-password-toggle aria-pressed="${String(isText)}" aria-label="${isText ? 'Hide password' : 'Show password'}" ${disabled ? 'disabled' : ''}>${controlIcon(isText ? 'eye-off' : 'eye')}</button>`;
  }

  const labelMarkup = label
    ? `<label class="form-label" for="${escapeHTML(id)}">${escapeHTML(label)}${required ? ' <span aria-hidden="true">*</span>' : ''}</label>`
    : '';

  const inputAttrs = [
    `id="${escapeHTML(id)}"`,
    `name="${escapeHTML(name || (options.name === '' ? '' : (name ?? '')))}"`,
    `type="${escapeHTML(type)}"`,
    placeholder ? `placeholder="${escapeHTML(placeholder)}"` : 'placeholder=""',
    `value="${escapeHTML(value)}"`,
    autocomplete ? `autocomplete="${escapeHTML(autocomplete)}"` : '',
    type === 'tel' ? 'inputmode="tel"' : '',
    required ? 'required' : '',
    disabled ? 'disabled' : '',
    readonly ? 'readonly' : '',
    isInvalid ? 'aria-invalid="true"' : '',
    hasMessage ? `aria-describedby="${escapeHTML(messageId)}"` : '',
    effectiveAriaLabel ? `aria-label="${escapeHTML(effectiveAriaLabel)}"` : '',
  ].filter(Boolean).join(' ');

  const messageMarkup = hasMessage
    ? `<span class="${error || errorSlot ? 'form-error' : 'form-help'}" id="${escapeHTML(messageId)}" ${!helper && !error ? 'hidden' : ''}>${escapeHTML(error || helper)}</span>`
    : '';

  return `<div data-sui-input-field data-sui-input-type="${escapeHTML(type || 'text')}" class="form-field">${labelMarkup}<div class="field sx-input-shell sx-size-${resolvedSize}">${prefixMarkup}<input ${inputAttrs}>${suffixMarkup}${toggleMarkup}</div>${messageMarkup}</div>`;
}

export function input({id = uid(), name = '', type = 'text', value = '', placeholder = '', label = '', size = 'base', disabled = false, required = false} = {}) {
  return inputField({id, name, type, value, placeholder, size, disabled, required, label: '', ariaLabel: label || name || 'Input'})
    .replace('<input ', '<input data-sui-input ');
}

const mounted = new WeakMap();
export function initInput(element) {
  if (mounted.has(element)) return mounted.get(element);
  const toggle = element.querySelector('[data-sui-password-toggle]');
  const field = element.querySelector('input');
  if (!field) throw new TypeError('Input markup is incomplete');
  const view = field.ownerDocument.defaultView, initialType = element.dataset.suiInputType || field.type;
  let destroyed = false, form;
  const ensureActive = () => { if (destroyed) throw new Error('Input controller has been destroyed'); };
  function syncToggle() {
    if (!toggle) return;
    const visible = field.type === 'text';
    toggle.disabled = field.disabled;
    toggle.setAttribute('aria-pressed', String(visible));
    toggle.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    toggle.innerHTML = controlIcon(visible ? 'eye-off' : 'eye');
  }
  function onClick() {
    if (field.matches(':disabled')) return;
    const visible = field.type === 'password';
    field.type = visible ? 'text' : 'password';
    syncToggle();
  }
  function onReset(event) {
    queueMicrotask(() => {
      if (!destroyed && !event.defaultPrevented) {
        field.setCustomValidity('');
        if (toggle) field.type = initialType;
        syncToggle();
      }
    });
  }
  function refresh() {
    ensureActive();
    if (form !== field.form) {
      form?.removeEventListener('reset', onReset);
      form = field.form;
      form?.addEventListener('reset', onReset);
    }
    syncToggle();
    return handle;
  }
  const observer = new view.MutationObserver(() => { if (!destroyed) syncToggle(); });
  observer.observe(field, { attributes: true, attributeFilter: ['disabled', 'type'] });
  toggle?.addEventListener('click', onClick);
  const handle = {
    control: field,
    get value() { return field.value; },
    get disabled() { return field.matches(':disabled'); },
    get required() { return field.required; },
    get destroyed() { return destroyed; },
    setValue(value) { ensureActive(); field.value = String(value); },
    setDisabled(value) { ensureActive(); field.disabled = !!value; syncToggle(); },
    setRequired(value) { ensureActive(); field.required = !!value; },
    setCustomValidity(message) { ensureActive(); field.setCustomValidity(String(message)); },
    checkValidity() { ensureActive(); return field.checkValidity(); },
    reportValidity() { ensureActive(); return field.reportValidity(); },
    refresh,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      toggle?.removeEventListener('click', onClick);
      form?.removeEventListener('reset', onReset);
      observer.disconnect();
      mounted.delete(element);
    }
  };
  mounted.set(element, handle);
  refresh();
  return handle;
}
