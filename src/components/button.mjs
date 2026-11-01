import { escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

const VALID_VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'dashed', 'destructive', 'secondary-destructive'];
const VALID_SIZES = ['xs', 'sm', 'base', 'lg'];
const VALID_TYPES = ['button', 'submit', 'reset'];

export function button(options = {}) {
  const opts = typeof options === 'string' ? { label: options } : options;
  const {
    label = '',
    id = '',
    type = 'button',
    variant = 'secondary',
    size = 'sm',
    disabled = false,
    loading = false,
    icon = '',
    iconPosition = 'start',
    attributes = '',
    ariaLabel = '',
  } = opts;

  if (!VALID_TYPES.includes(type)) throw new TypeError('Invalid button type');
  if (!VALID_VARIANTS.includes(variant)) throw new TypeError('Invalid button variant');
  if (!VALID_SIZES.includes(size)) throw new TypeError('Invalid button size');
  if (iconPosition && !['start', 'end'].includes(iconPosition)) throw new TypeError('Invalid icon position');

  const isDisabled = Boolean(disabled || loading);
  const isBusy = Boolean(loading);

  const spinnerMarkup = isBusy ? '<span class="spinner" aria-hidden="true"></span>' : '';
  const iconMarkup = icon ? controlIcon(icon, size === 'xs' ? 12 : 16) : '';
  const labelMarkup = label !== '' && label !== undefined ? escapeHTML(label) : '';

  let content = '';
  if (iconPosition === 'end') {
    content = `${spinnerMarkup}${labelMarkup}${iconMarkup}`;
  } else {
    content = `${spinnerMarkup}${iconMarkup}${labelMarkup}`;
  }

  const attrs = [
    'data-sui-button',
    `type="${escapeHTML(type)}"`,
    id ? `id="${escapeHTML(id)}"` : '',
    ariaLabel ? `aria-label="${escapeHTML(ariaLabel)}"` : '',
    `class="btn ${variant} ${size}"`,
    isDisabled ? 'disabled' : '',
    isBusy ? 'aria-busy="true"' : '',
    attributes || '',
  ].filter(Boolean).join(' ');

  return `<button ${attrs}>${content}</button>`;
}

export function iconButton(nameOrOptions, options = {}, attributesArg = '', labelArg = '') {
  let name = '';
  let label = '';
  let variant = '';
  let size = '';
  let disabled = false;
  let pressed;
  let attributes = '';
  let classesOpt = '';
  let id = '';

  if (typeof nameOrOptions === 'object' && nameOrOptions !== null) {
    name = nameOrOptions.name || nameOrOptions.icon || '';
    label = nameOrOptions.label || nameOrOptions.ariaLabel || nameOrOptions.accessibleLabel || name;
    variant = nameOrOptions.variant || '';
    size = nameOrOptions.size || '';
    disabled = Boolean(nameOrOptions.disabled);
    pressed = nameOrOptions.pressed ?? nameOrOptions.ariaPressed;
    attributes = nameOrOptions.attributes || '';
    classesOpt = nameOrOptions.classes || nameOrOptions.class || '';
    id = nameOrOptions.id || '';
  } else if (typeof options === 'string') {
    name = nameOrOptions;
    // Positional signature: iconButton(name, variant, attributes, label)
    variant = options;
    attributes = attributesArg;
    label = labelArg || name;
  } else {
    name = nameOrOptions;
    // Options object: iconButton(name, options)
    label = options.label || options.ariaLabel || options.accessibleLabel || name;
    variant = options.variant || '';
    size = options.size || '';
    disabled = Boolean(options.disabled);
    pressed = options.pressed ?? options.ariaPressed;
    attributes = options.attributes || '';
    classesOpt = options.classes || options.class || '';
    id = options.id || '';
  }

  if (size && !VALID_SIZES.includes(size)) throw new TypeError('Invalid icon button size');

  const classes = ['ibtn', variant, size ? `size-${size}` : '', classesOpt].filter(Boolean).join(' ');
  const iconSize = size === 'lg' ? 18 : 16;
  const iconMarkup = controlIcon(name, iconSize);

  const attrs = [
    'type="button"',
    'data-sui-icon-button',
    id ? `id="${escapeHTML(id)}"` : '',
    `class="${classes}"`,
    `aria-label="${escapeHTML(label)}"`,
    disabled ? 'disabled' : '',
    pressed !== undefined ? `aria-pressed="${String(Boolean(pressed))}"` : '',
    attributes,
  ].filter(Boolean).join(' ');

  return `<button ${attrs}>${iconMarkup}</button>`;
}

export function linkButton(labelOrOptions = '', options = {}) {
  let label = '';
  let opts = options;
  if (typeof labelOrOptions === 'object' && labelOrOptions !== null) {
    label = labelOrOptions.label || '';
    opts = labelOrOptions;
  } else {
    label = labelOrOptions;
  }

  const {
    href = '',
    tone = 'default',
    disabled = false,
    iconName = '',
    icon = iconName,
    iconPosition = 'end',
    attributes = '',
    id = '',
  } = opts;

  if (tone && !['default', 'brand'].includes(tone)) throw new TypeError('Invalid link button tone');
  if (iconPosition && !['start', 'end'].includes(iconPosition)) throw new TypeError('Invalid icon position');

  const glyph = icon ? controlIcon(icon, 14) : '';
  const labelMarkup = `<span>${escapeHTML(label)}</span>`;
  const content = iconPosition === 'start' ? `${glyph}${labelMarkup}` : `${labelMarkup}${glyph}`;
  const classes = `btn link${tone === 'brand' ? ' link-brand' : ''}`;

  if (href) {
    const linkAttrs = [
      'data-sui-link-button',
      id ? `id="${escapeHTML(id)}"` : '',
      `class="${classes}"`,
      disabled ? 'aria-disabled="true" tabindex="-1"' : `href="${escapeHTML(href)}"`,
      attributes,
    ].filter(Boolean).join(' ');
    return `<a ${linkAttrs}>${content}</a>`;
  }

  const btnAttrs = [
    'type="button"',
    'data-sui-link-button',
    id ? `id="${escapeHTML(id)}"` : '',
    `class="${classes}"`,
    disabled ? 'disabled' : '',
    attributes,
  ].filter(Boolean).join(' ');
  return `<button ${btnAttrs}>${content}</button>`;
}

const SOCIAL_PROVIDERS = {
  google: {
    name: 'Google',
    svg: '<svg class="sx-social-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="16" height="16" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.04 46.98 31.9 46.98 24.55Z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19Z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/></svg>',
  },
  github: {
    name: 'GitHub',
    svg: '<svg class="sx-social-logo is-monochrome" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.01-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.64 0c2.15-1.46 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.98.72.78 1.16 1.78 1.16 3.01 0 4.32-2.63 5.27-5.14 5.55.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z"/></svg>',
  },
};

export function socialButton(providerOrOptions, options = {}) {
  let provider = '';
  let opts = options;
  if (typeof providerOrOptions === 'object' && providerOrOptions !== null) {
    provider = providerOrOptions.provider;
    opts = providerOrOptions;
  } else {
    provider = providerOrOptions;
  }

  const info = SOCIAL_PROVIDERS[provider];
  if (!info) throw new TypeError('Unsupported social provider: ' + provider);

  const {
    label = 'Continue with ' + info.name,
    size = 'base',
    disabled = false,
    attributes = '',
  } = opts;

  if (size && !VALID_SIZES.includes(size)) throw new TypeError('Invalid button size');

  const attrs = [
    'type="button"',
    'data-sui-social-button',
    `class="btn social ${size}"`,
    disabled ? 'disabled' : '',
    attributes,
  ].filter(Boolean).join(' ');

  return `<button ${attrs}>${info.svg}<span>${escapeHTML(label)}</span></button>`;
}
