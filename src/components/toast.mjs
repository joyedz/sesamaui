import { uid, escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

const mountedRegions = new WeakMap();

// Legacy compatibility entries list
if (typeof globalThis !== 'undefined' && !globalThis.dsToastEntries) {
  globalThis.dsToastEntries = [];
}

/**
 * Controller for a Toast Region container.
 * Manages queue, pause on hover/focus, and max visible items.
 *
 * @param {HTMLElement} element
 * @returns {object} Toast Region controller
 */
export function initToastRegion(element) {
  if (mountedRegions.has(element)) return mountedRegions.get(element);

  const doc = element.ownerDocument || globalThis.document;
  const view = doc?.defaultView || globalThis;
  const entries = [];
  let destroyed = false;

  function promote() {
    if (destroyed) return;
    const shown = entries.filter(e => !e.removed && e.shown).length;
    const available = Math.max(0, 3 - shown);
    const queued = entries.filter(e => !e.removed && !e.shown).slice(0, available);

    for (const entry of queued) {
      entry.shown = true;
      entry.item.hidden = false;
      entry.start();
    }
  }

  function renderEntry(entry) {
    const { item, tone, message, title } = entry;
    item.dataset.tone = tone;
    item.setAttribute('role', tone === 'error' ? 'alert' : 'status');

    const iconSlot = item.querySelector('.ds-toast-icon');
    if (iconSlot) {
      if (tone === 'loading') {
        iconSlot.innerHTML = '<span class="sx-loader" style="border-top-color:currentColor" aria-hidden="true"></span>';
      } else {
        const iconName = ({
          neutral: 'info',
          informative: 'info',
          success: 'check',
          error: 'x',
          warning: 'triangle-alert',
        })[tone] || 'info';
        iconSlot.innerHTML = controlIcon(iconName, 16);
      }
    }

    const textSlot = item.querySelector('.ds-toast-text');
    if (textSlot) {
      textSlot.innerHTML = `${title ? `<strong>${escapeHTML(title)}</strong>` : ''}<span>${escapeHTML(message)}</span>`;
    }
  }

  function addToast(options) {
    if (destroyed) return { dismiss() {}, update() {} };

    const message = options.message || '';
    const title = options.title || '';
    const tone = options.tone || 'neutral';
    const persistent = Boolean(options.persistent || options.duration === 0);
    const duration = options.duration ?? (persistent ? 0 : 3000);
    const dismissible = options.dismissible !== false;
    const action = options.action || null;

    // Duplicate check: if an active non-removed toast with identical message and tone exists, return its handle
    const existing = entries.find(e => !e.removed && e.message === message && e.tone === tone);
    if (existing) return existing.handle;

    const item = doc.createElement('div');
    item.className = 'ds-toast';
    item.dataset.tone = tone;
    item.hidden = true;
    item.setAttribute('aria-atomic', 'true');

    const iconEl = doc.createElement('span');
    iconEl.className = 'ds-toast-icon';
    iconEl.setAttribute('aria-hidden', 'true');

    const textEl = doc.createElement('span');
    textEl.className = 'ds-toast-text';

    item.append(iconEl, textEl);

    if (action && action.label) {
      const actionBtn = doc.createElement('button');
      actionBtn.type = 'button';
      actionBtn.className = 'btn ghost';
      actionBtn.textContent = action.label;
      actionBtn.onclick = () => {
        action.onClick?.();
        action.run?.();
        dismiss();
      };
      item.append(actionBtn);
    }

    if (dismissible) {
      const closeBtn = doc.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'ibtn';
      closeBtn.setAttribute('aria-label', 'Dismiss notification');
      closeBtn.innerHTML = controlIcon('x', 16);
      closeBtn.onclick = () => dismiss();
      item.append(closeBtn);
    }

    element.append(item);

    const entry = {
      message,
      title,
      tone,
      item,
      removed: false,
      shown: false,
      persistent,
      duration,
      timer: null,
      expired: false,
      isHovered: false,
      handle: null,
    };

    function schedule() {
      clearTimeout(entry.timer);
      if (!entry.persistent && entry.duration > 0) {
        entry.timer = setTimeout(() => {
          if (entry.isHovered || item.contains(doc.activeElement)) {
            entry.expired = true;
            return;
          }
          dismiss();
        }, entry.duration);
      }
    }

    function dismiss() {
      if (entry.removed) return;
      entry.removed = true;
      clearTimeout(entry.timer);
      item.remove();
      const idx = entries.indexOf(entry);
      if (idx >= 0) entries.splice(idx, 1);
      if (globalThis.dsToastEntries) {
        const gIdx = globalThis.dsToastEntries.indexOf(entry);
        if (gIdx >= 0) globalThis.dsToastEntries.splice(gIdx, 1);
      }
      promote();
    }

    item.addEventListener('pointerenter', () => {
      entry.isHovered = true;
    });

    item.addEventListener('pointerleave', () => {
      entry.isHovered = false;
      if (entry.expired && !item.contains(doc.activeElement)) {
        dismiss();
      }
    });

    item.addEventListener('focusout', () => {
      setTimeout(() => {
        if (entry.expired && !entry.isHovered && !item.contains(doc.activeElement)) {
          dismiss();
        }
      }, 0);
    });

    entry.start = schedule;
    const handle = {
      dismiss,
      update(nextMessage, nextTone = 'success', nextPersistent = false) {
        entry.message = nextMessage;
        entry.tone = nextTone;
        entry.persistent = nextPersistent;
        entry.expired = false;
        renderEntry(entry);
        if (entry.shown) schedule();
      },
    };
    entry.handle = handle;

    entries.push(entry);
    if (globalThis.dsToastEntries) {
      globalThis.dsToastEntries.push(entry);
    }

    renderEntry(entry);
    promote();
    return handle;
  }

  const controller = {
    showToast: addToast,
    getEntries: () => [...entries],
    clearAll() {
      [...entries].forEach(e => e.handle?.dismiss());
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      this.clearAll();
      mountedRegions.delete(element);
    },
  };

  mountedRegions.set(element, controller);
  return controller;
}

let defaultRegionEl = null;

function getOrCreateDefaultRegion() {
  if (defaultRegionEl && defaultRegionEl.isConnected) return defaultRegionEl;

  if (typeof document === 'undefined') return null;
  let stack = document.querySelector('.ds-toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'ds-toast-stack';
    stack.setAttribute('role', 'region');
    stack.setAttribute('aria-label', 'Notifications');
    stack.dataset.suiToastRegion = '';
    document.body.append(stack);
  }
  defaultRegionEl = stack;
  return stack;
}

/**
 * Show a toast notification.
 * Supports canonical options object as well as legacy signature (message, tone, persistent, options).
 *
 * @param {string|object} optionsOrMessage
 * @param {string} [legacyTone]
 * @param {boolean} [legacyPersistent]
 * @param {object} [legacyOptions]
 * @returns {object} Toast handle { dismiss(), update() }
 */
export function showToast(optionsOrMessage, legacyTone = 'neutral', legacyPersistent = false, legacyOptions = {}) {
  let opts = {};
  if (typeof optionsOrMessage === 'string') {
    opts = {
      message: optionsOrMessage,
      tone: legacyTone,
      persistent: legacyPersistent,
      ...legacyOptions,
    };
  } else if (optionsOrMessage && typeof optionsOrMessage === 'object') {
    opts = { ...optionsOrMessage };
  }

  const targetRegion = opts.region || getOrCreateDefaultRegion();
  if (!targetRegion) {
    // Non-browser fallback
    return { dismiss() {}, update() {} };
  }

  const regionCtrl = initToastRegion(targetRegion);
  return regionCtrl.showToast(opts);
}

// Global bridge for legacy compatibility
if (typeof globalThis !== 'undefined') {
  globalThis.dsToast = showToast;
}
