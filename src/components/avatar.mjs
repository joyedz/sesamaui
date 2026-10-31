import { escapeHTML } from './shared.mjs';

const SIZE_PRESETS = {
  sm: 16,
  base: 24,
  lg: 32,
};

const AUTO_TONES = [
  'var(--color-brand)',
  'var(--color-type-fn)',
  'var(--color-type-tc)',
  'var(--color-type-sys)',
  'var(--color-success)',
];

function deriveInitials(name) {
  if (!name) return 'JL';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function resolveSize(size) {
  if (typeof size === 'number') {
    if (Number.isNaN(size) || size <= 0) throw new TypeError(`Invalid avatar size: ${size}`);
    return size;
  }
  if (typeof size === 'string') {
    if (SIZE_PRESETS[size]) return SIZE_PRESETS[size];
    const parsed = Number(size);
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
  }
  throw new TypeError(`Invalid avatar size preset: ${size}`);
}

export function avatar(options = {}) {
  const opts = typeof options === 'string' ? { initials: options } : options;
  const {
    name = '',
    initials = '',
    image = '',
    size = 'base',
    tone = '',
    color = '',
    selectable = false,
    selected = false,
    disabled = false,
    attributes = '',
  } = opts;

  const numSize = resolveSize(size);
  const effectiveInitials = initials || deriveInitials(name);
  const effectiveName = name || initials || 'Avatar';

  const isInteractive = Boolean(selectable || selected || disabled);
  const tag = isInteractive ? 'button' : 'span';

  const styleParts = [
    `width:${numSize}px`,
    `height:${numSize}px`,
    `font-size:${numSize <= 16 ? 8 : numSize <= 24 ? 12 : 14}px`,
  ];

  const colorMode = color || tone;
  if (colorMode === 'auto') {
    const hash = [...(name || 'Jordan Lee')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
    const chosen = AUTO_TONES[hash % AUTO_TONES.length];
    styleParts.push(`background:color-mix(in srgb,${chosen} 14%,var(--color-base))`);
    styleParts.push(`color:${chosen}`);
  } else if (colorMode) {
    styleParts.push(`background:color-mix(in srgb,${escapeHTML(colorMode)} 14%,var(--color-base))`);
    styleParts.push(`color:${escapeHTML(colorMode)}`);
  }

  const classes = ['sx-avatar', selected ? 'selected' : ''].filter(Boolean).join(' ');

  const attrs = [
    'data-sui-avatar',
    isInteractive ? 'type="button"' : 'role="img"',
    `class="${classes}"`,
    `style="${styleParts.join(';')}"`,
    isInteractive && disabled ? 'disabled' : '',
    isInteractive ? `aria-pressed="${Boolean(selected)}"` : '',
    selectable || selected ? 'data-sui-avatar-toggle' : '',
    `aria-label="${selectable || selected ? 'Select ' : ''}${escapeHTML(effectiveName)}"`,
    attributes,
  ].filter(Boolean).join(' ');

  const imgMarkup = image ? `<img src="${escapeHTML(image)}" alt="" data-sui-avatar-image data-avatar-image>` : '';
  const fallbackMarkup = `<span class="sx-avatar-fallback">${escapeHTML(effectiveInitials)}</span>`;

  return `<${tag} ${attrs}>${fallbackMarkup}${imgMarkup}</${tag}>`;
}

const mounted = new WeakMap();

export function initAvatar(element) {
  if (!element?.matches) throw new TypeError('initAvatar requires a DOM element');
  if (mounted.has(element)) return mounted.get(element);

  let destroyed = false;
  const emit = (type, detail) => {
    element.dispatchEvent(new element.ownerDocument.defaultView.CustomEvent(`sui:${type}`, { bubbles: true, detail }));
  };

  const img = element.querySelector('img[data-sui-avatar-image], img[data-avatar-image], img');
  function onError() {
    if (img) img.hidden = true;
  }

  if (img) {
    if (img.complete && img.naturalWidth === 0) {
      img.hidden = true;
    } else {
      img.addEventListener('error', onError);
    }
  }

  function onClick() {
    if (destroyed || element.disabled) return;
    if (element.hasAttribute('aria-pressed') || element.hasAttribute('data-sui-avatar-toggle')) {
      const next = element.getAttribute('aria-pressed') !== 'true';
      element.setAttribute('aria-pressed', String(next));
      element.classList.toggle('selected', next);
      emit('change', { selected: next });
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
    setSelected(value) {
      if (destroyed) return;
      const boolVal = Boolean(value);
      element.setAttribute('aria-pressed', String(boolVal));
      element.classList.toggle('selected', boolVal);
    },
    refresh() {
      if (img && img.complete && img.naturalWidth === 0) {
        img.hidden = true;
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (img) img.removeEventListener('error', onError);
      element.removeEventListener('click', onClick);
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
