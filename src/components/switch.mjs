import { uid, escapeHTML } from './shared.mjs';

export function switchControl(options = {}) {
  const opts = typeof options === 'string' ? { label: options } : options;
  const {
    id = uid(),
    name = '',
    value = 'on',
    label = '',
    description = '',
    checked = false,
    disabled = false,
    required = false,
    attributes = '',
  } = opts;

  const escId = escapeHTML(id);
  const escName = name ? escapeHTML(name) : '';
  const escValue = escapeHTML(value);
  const descId = `${escId}-description`;

  const btnAttrs = [
    `id="${escId}"`,
    'data-sui-switch-control',
    'type="button"',
    'role="switch"',
    'class="sw"',
    `aria-checked="${Boolean(checked)}"`,
    disabled ? 'disabled' : '',
    required ? 'aria-required="true"' : '',
    description ? `aria-describedby="${descId}"` : '',
    attributes,
  ].filter(Boolean).join(' ');

  const inputAttrs = [
    'type="checkbox"',
    'data-sui-switch-input',
    escName ? `name="${escName}"` : '',
    `value="${escValue}"`,
    checked ? 'checked' : '',
    disabled ? 'disabled' : '',
    required ? 'required' : '',
    'style="display:none"',
    'tabindex="-1"',
    'aria-hidden="true"',
  ].filter(Boolean).join(' ');

  const labelMarkup = label !== '' && label !== undefined
    ? `<label for="${escId}">${escapeHTML(label)}</label>`
    : '';

  const descMarkup = description !== '' && description !== undefined
    ? `<span class="sx-help" id="${descId}">${escapeHTML(description)}</span>`
    : '';

  return `<div data-sui-switch class="sx sx-switch-layout sx-checkbox-layout"><button ${btnAttrs}><i></i></button><input ${inputAttrs}>${labelMarkup}${descMarkup}</div>`;
}

const mounted = new WeakMap();

export function initSwitch(element) {
  if (!element?.matches) throw new TypeError('initSwitch requires a DOM element');
  const btn = element.matches('button[role="switch"]') ? element : element.querySelector('button[role="switch"]');
  if (!btn) throw new TypeError('Switch control button not found');

  if (mounted.has(btn)) return mounted.get(btn);

  let destroyed = false;
  const root = btn.closest('[data-sui-switch]') || element;
  const hiddenInput = root.querySelector('input[data-sui-switch-input]');

  const emit = (type, detail) => {
    btn.dispatchEvent(new btn.ownerDocument.defaultView.CustomEvent(`sui:${type}`, { bubbles: true, detail }));
  };

  function toggle() {
    if (destroyed || btn.disabled) return;
    const current = btn.getAttribute('aria-checked') === 'true';
    const next = !current;
    btn.setAttribute('aria-checked', String(next));
    if (hiddenInput) {
      hiddenInput.checked = next;
    }
    emit('change', {
      name: hiddenInput?.name || '',
      checked: next,
      value: next ? (hiddenInput?.value || 'on') : '',
    });
  }

  function onClick(e) {
    if (e.target === btn || btn.contains(e.target)) {
      e.preventDefault();
      toggle();
    }
  }

  function onKeyDown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  }

  function onReset() {
    btn.ownerDocument.defaultView.setTimeout?.(() => {
      if (destroyed) return;
      const next = hiddenInput ? hiddenInput.checked : false;
      btn.setAttribute('aria-checked', String(next));
    }, 0);
  }

  btn.addEventListener('click', onClick);
  btn.addEventListener('keydown', onKeyDown);
  if (hiddenInput?.form) hiddenInput.form.addEventListener('reset', onReset);

  const controller = {
    element: root,
    control: btn,
    get destroyed() {
      return destroyed;
    },
    get checked() {
      return btn.getAttribute('aria-checked') === 'true';
    },
    get disabled() {
      return btn.disabled;
    },
    get value() {
      return hiddenInput ? hiddenInput.value : 'on';
    },
    get name() {
      return hiddenInput ? hiddenInput.name : '';
    },
    setChecked(val) {
      if (destroyed) return;
      const boolVal = Boolean(val);
      btn.setAttribute('aria-checked', String(boolVal));
      if (hiddenInput) hiddenInput.checked = boolVal;
    },
    setDisabled(val) {
      if (destroyed) return;
      const boolVal = Boolean(val);
      btn.disabled = boolVal;
      if (hiddenInput) hiddenInput.disabled = boolVal;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      btn.removeEventListener('click', onClick);
      btn.removeEventListener('keydown', onKeyDown);
      if (hiddenInput?.form) hiddenInput.form.removeEventListener('reset', onReset);
      mounted.delete(btn);
    },
  };

  mounted.set(btn, controller);
  return controller;
}
