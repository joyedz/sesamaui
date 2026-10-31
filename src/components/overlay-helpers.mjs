/**
 * Shared overlay helpers for positioning, dismissal, timers and collection navigation.
 * Native popovers remain usable inside native dialogs.
 */

export function computePlacement(trigger, popup, placement = 'bottom', options = {}) {
  const { gap = 4, align = 'start', clamp = true } = options;
  if (!trigger || !popup) return { left: 0, top: 0, placement };

  const view = trigger.ownerDocument?.defaultView || globalThis;
  const winWidth = view.innerWidth || 1024;
  const winHeight = view.innerHeight || 768;

  const r = trigger.getBoundingClientRect();
  const p = popup.getBoundingClientRect();

  const spaceBelow = winHeight - r.bottom;
  const spaceAbove = r.top;
  const spaceLeft = r.left;
  const spaceRight = winWidth - r.right;

  let actualPlacement = placement;
  if (placement === 'auto') {
    actualPlacement = spaceBelow < p.height && spaceAbove > spaceBelow ? 'top' : 'bottom';
  }

  let top = r.bottom + gap;
  let left = r.left;

  if (actualPlacement === 'top') {
    top = r.top - p.height - gap;
    if (top < 8 && spaceBelow > spaceAbove) {
      top = r.bottom + gap;
      actualPlacement = 'bottom';
    }
  } else if (actualPlacement === 'bottom') {
    top = r.bottom + gap;
    if (top + p.height > winHeight - 8 && spaceAbove > spaceBelow) {
      top = r.top - p.height - gap;
      actualPlacement = 'top';
    }
  } else if (actualPlacement === 'left') {
    left = r.left - p.width - gap;
    top = align === 'center' ? r.top + (r.height - p.height) / 2 : r.top;
    if (left < 8 && spaceRight > spaceLeft) {
      left = r.right + gap;
      actualPlacement = 'right';
    }
  } else if (actualPlacement === 'right') {
    left = r.right + gap;
    top = align === 'center' ? r.top + (r.height - p.height) / 2 : r.top;
    if (left + p.width > winWidth - 8 && spaceLeft > spaceRight) {
      left = r.left - p.width - gap;
      actualPlacement = 'left';
    }
  }

  if (actualPlacement === 'top' || actualPlacement === 'bottom') {
    if (align === 'center') {
      left = r.left + (r.width - p.width) / 2;
    } else if (align === 'end') {
      left = r.right - p.width;
    } else {
      left = r.left;
    }
  }

  if (clamp) {
    left = Math.max(8, Math.min(left, winWidth - p.width - 8));
    top = Math.max(8, Math.min(top, winHeight - p.height - 8));
  }

  return { left, top, placement: actualPlacement };
}

export function positionOverlay(trigger, popup, placement = 'bottom', options = {}) {
  const { matchWidth = false, ...placementOpts } = options;
  const { left, top, placement: actualPlacement } = computePlacement(trigger, popup, placement, placementOpts);

  popup.style.position = 'fixed';
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
  popup.style.margin = '0';
  if (matchWidth) {
    popup.style.width = `${trigger.getBoundingClientRect().width}px`;
  }
  popup.dataset.placement = actualPlacement;
  return { left, top, placement: actualPlacement };
}

export function createDismissManager({
  popup,
  trigger,
  onDismiss,
  additionalNodes = [],
  closeOnScroll = true,
  onReposition = null,
}) {
  let bound = false;
  const view = popup?.ownerDocument?.defaultView || globalThis;
  const doc = popup?.ownerDocument || globalThis.document;

  const isInside = target => {
    if (!target || !(target instanceof (view.Node || Object))) return false;
    if (popup && popup.contains(target)) return true;
    if (trigger && trigger.contains(target)) return true;
    for (const node of additionalNodes) {
      if (node && node.contains(target)) return true;
    }
    return false;
  };

  const handlePointerDown = event => {
    if (!isInside(event.target)) {
      onDismiss?.('pointer', event);
    }
  };

  const handleScroll = event => {
    if (isInside(event.target)) {
      if (typeof onReposition === 'function') onReposition();
    } else if (closeOnScroll) {
      onDismiss?.('scroll', event);
    }
  };

  const handleResize = () => {
    if (typeof onReposition === 'function') {
      onReposition();
    } else {
      onDismiss?.('resize');
    }
  };

  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onDismiss?.('escape', event);
    }
  };

  return {
    bind() {
      if (bound || !doc) return;
      bound = true;
      if (typeof doc?.addEventListener === 'function') {
        doc.addEventListener('pointerdown', handlePointerDown, true);
        doc.addEventListener('keydown', handleKeyDown, true);
      }
      if (typeof view?.addEventListener === 'function') {
        view.addEventListener('scroll', handleScroll, { capture: true, passive: true });
        view.addEventListener('resize', handleResize, { passive: true });
      }
    },
    unbind() {
      if (!bound || !doc) return;
      bound = false;
      if (typeof doc?.removeEventListener === 'function') {
        doc.removeEventListener('pointerdown', handlePointerDown, true);
        doc.removeEventListener('keydown', handleKeyDown, true);
      }
      if (typeof view?.removeEventListener === 'function') {
        view.removeEventListener('scroll', handleScroll, true);
        view.removeEventListener('resize', handleResize);
      }
    },
    isBound() {
      return bound;
    },
  };
}

export function getNextFocusableIndex(items, currentIndex, direction, loop = true) {
  if (!items || items.length === 0) return -1;
  const total = items.length;
  let idx = currentIndex;

  for (let i = 0; i < total; i++) {
    idx = (idx + direction + total) % total;
    const item = items[idx];
    if (item && !item.disabled && !item.matches?.(':disabled,[aria-disabled="true"]')) {
      return idx;
    }
    if (!loop && ((direction > 0 && idx === total - 1) || (direction < 0 && idx === 0))) {
      break;
    }
  }
  return -1;
}
