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
