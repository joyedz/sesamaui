import { uid, escapeHTML, tabStops } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

// content/actions are trusted application HTML slots. Text options are escaped.
export function modal({
  id = uid(),
  title = 'Dialog',
  description = '',
  content = '',
  actions = '',
  size = 'base',
  locked = false
} = {}) {
  const modalSize = ['sm', 'base', 'lg', 'xl'].includes(size) ? size : 'base';
  const escId = escapeHTML(id);
  const escTitle = escapeHTML(title);
  const escDesc = description ? escapeHTML(description) : '';

  return `<dialog id="${escId}" data-sui-modal class="ds-modal" data-size="${modalSize}" ${locked ? 'data-locked' : ''} aria-labelledby="${escId}-title" ${description ? `aria-describedby="${escId}-description"` : ''}><div class="sx-modal-header"><h2 id="${escId}-title">${escTitle}</h2><button type="button" class="ibtn sx-modal-close" data-sui-modal-close aria-label="Close dialog">${controlIcon('x')}</button></div>${description ? `<p id="${escId}-description">${escDesc}</p>` : ''}<div class="sx-modal-body">${content}</div>${actions ? `<div class="actions">${actions}</div>` : ''}</dialog>`;
}

const mounted = new WeakMap();
export function initModal(dialog) {
  if (mounted.has(dialog)) return mounted.get(dialog);
  if (dialog.tagName !== 'DIALOG') throw new TypeError('Modal requires a dialog element');
  let session, destroyed = false;
  const emit = (name, detail) => dialog.dispatchEvent(new dialog.ownerDocument.defaultView.CustomEvent(`sui:${name}`, { bubbles: true, detail }));
  const restore = () => {
    if (!session) return;
    for (const [node, left, top] of session.scrolls) if (node.isConnected) node.scrollTo({ left, top, behavior: 'instant' });
    dialog.ownerDocument.defaultView.scrollTo({ left: session.x, top: session.y, behavior: 'instant' });
  };
  function finish(why) {
    dialog.querySelectorAll('[aria-expanded="true"]').forEach(node => node.setAttribute('aria-expanded', 'false'));
    dialog.querySelectorAll('[popover]').forEach(node => { if (node.matches(':popover-open')) node.hidePopover(); });
    if (!session) return;
    if (session.trigger?.isConnected) session.trigger.focus({ preventScroll: true });
    restore();
    session = undefined;
    const returnValue = dialog.returnValue;
    reason = '';
    emit('close', { reason: why, returnValue });
  }
  function onClose() {
    // A queued close event from an earlier session must not close a newly opened one.
    if (!dialog.open) finish(reason || 'native');
  }
  let reason = '';
  function close(why = 'programmatic', returnValue = '') {
    if (destroyed) return;
    if (dialog.open) {
      reason = why;
      dialog.close(String(returnValue));
      finish(why);
    } else {
      finish(reason || why);
    }
  }
  function onClick(event) {
    if (event.target.closest('[data-sui-modal-close], [data-modal-close]')) close('action');
    if (event.target !== dialog || dialog.hasAttribute('data-locked')) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close('backdrop');
  }
  function onCancel(event) {
    if (dialog.hasAttribute('data-locked')) event.preventDefault();
    else reason = 'escape';
  }
  function onKey(event) {
    if (event.key !== 'Tab' || !dialog.open) return;
    const items = tabStops(dialog);
    if (!items.length) { event.preventDefault(); return; }
    const active = dialog.ownerDocument.activeElement, first = items[0], last = items.at(-1);
    if (event.shiftKey && active === first) {
      event.preventDefault(); last.focus({ preventScroll: true });
    } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
      event.preventDefault(); first.focus({ preventScroll: true });
    }
  }
  dialog.addEventListener('click', onClick);
  dialog.addEventListener('close', onClose);
  dialog.addEventListener('cancel', onCancel);
  dialog.addEventListener('keydown', onKey);
  const handle = {
    get destroyed() { return destroyed; },
    open(trigger = dialog.ownerDocument.activeElement) {
      if (destroyed) throw new Error('Modal controller has been destroyed');
      if (dialog.open) return;
      if (session) finish(reason || 'native');
      const view = dialog.ownerDocument.defaultView, scrolls = [];
      for (let node = trigger?.parentElement; node; node = node.parentElement) scrolls.push([node, node.scrollLeft, node.scrollTop]);
      session = { trigger, scrolls, x: view.scrollX, y: view.scrollY };
      dialog.returnValue = '';
      try { dialog.showModal(); } catch (error) { session = undefined; throw error; }
      dialog.scrollTop = 0;
      dialog.querySelectorAll('.sx-modal-body').forEach(node => { node.scrollTop = 0; });
      restore();
      emit('open', {});
    },
    close,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (dialog.open) dialog.close();
      finish('destroy');
      dialog.removeEventListener('click', onClick);
      dialog.removeEventListener('close', onClose);
      dialog.removeEventListener('cancel', onCancel);
      dialog.removeEventListener('keydown', onKey);
      mounted.delete(dialog);
    }
  };
  mounted.set(dialog, handle);
  return handle;
}
