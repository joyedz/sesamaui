// Control families inherit the size contracts of Input and Button.
export const INPUT_SIZES = Object.freeze(['sm', 'base', 'lg']);
export const BUTTON_SIZES = Object.freeze(['xs', ...INPUT_SIZES]);

let serial = 0;
// DOM access starts in controllers, never during module import.
const prefix = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
export const uid = () => `sui-${prefix}-${++serial}`;
export const escapeHTML = value => String(value).replace(/[&<>"']/g,
  c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function elementRoot(root, selector) {
  return [...(root.matches?.(selector) ? [root] : []), ...root.querySelectorAll(selector)];
}

export function tabStops(root) {
  return [...root.querySelectorAll('button,a[href],input,select,textarea,[tabindex],summary,[contenteditable="true"]')]
    .filter(node => !node.matches(':disabled') && node.tabIndex >= 0 && !node.closest('[hidden],[inert]') && node.getClientRects().length && node.ownerDocument.defaultView.getComputedStyle(node).visibility !== 'hidden')
    .map((node, index) => ({node, index, order: node.tabIndex > 0 ? node.tabIndex : Infinity}))
    .sort((a, b) => a.order - b.order || a.index - b.index)
    .map(item => item.node);
}


/** Optional visual surface on a builder's own painted elements (SSR safe). */
export function surfaceMode(args) {
  const options = args.find(value => value && typeof value === 'object' && !Array.isArray(value));
  const mode = options?.surface;
  if (mode !== undefined && mode !== 'solid' && mode !== 'blur') throw new TypeError('Invalid surface: expected solid or blur');
  return mode;
}

export function applySurface(markup, mode, targets = ['@root']) {
  if (mode === undefined) return markup;
  const pending = new Set(targets);
  // Match complete opening tags, including quoted > characters in attributes.
  return markup.replace(/<[a-zA-Z][\w:-]*(?:[^>"']|"[^"]*"|'[^']*')*>/g, tag => {
    if (!pending.size) return tag;
    const name = tag.match(/^<([\w:-]+)/)[1].toLowerCase();
    const classes = (tag.match(/\bclass\s*=\s*(["'])(.*?)\1/)?.[2] || '').split(/\s+/);
    const target = [...pending].find(target => target === '@root' || target.split('|').some(part => part === '@' + name || classes.includes(part)));
    if (!target) return tag;
    pending.delete(target);
    // A composed builder may already have explicitly configured this surface.
    if (/\bdata-sui-surface=/.test(tag)) return tag;
    tag = tag.replace(/^<([\w:-]+)/, `<$1 data-sui-surface="${mode}"`);
    // Preserve builder-selected inline colors (for example, Avatar colors).
    return tag.replace(/\bstyle="([^"]*)"/, (_, style) => `style="${style.replace(/(background(?:-color)?\s*:)\s*([^;]+)/g,
      (match, property, color) => /^(?:var\(|#|rgb|hsl|light-dark\()/i.test(color.trim()) ? `${property}color-mix(in srgb, ${color} var(--sui-surface-opacity, 100%), transparent)` : match)}"`);
  });
}
