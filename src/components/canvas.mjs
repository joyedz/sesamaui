import { escapeHTML, uid } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { toolbar } from './toolbar.mjs';

function renderZoomToolbar() {
  return toolbar({
    ariaLabel: 'Canvas controls',
    variant: 'rail',
    items: [
      '<output aria-live="polite">100%</output>',
      { icon: 'minus', variant: 'raised', ariaLabel: 'Zoom out', attributes: 'data-canvas-zoom="-0.1"' },
      { icon: 'plus', variant: 'raised', ariaLabel: 'Zoom in', attributes: 'data-canvas-zoom="0.1"' },
      { icon: 'fit', variant: 'raised', ariaLabel: 'Fit to screen', attributes: 'data-canvas-zoom="fit"' }
    ]
  });
}

/**
 * Pure functional builder for Canvas.
 *
 * @param {object} [options]
 * @returns {string} HTML string
 */
export function canvas(options = {}) {
  const {
    id = uid('sui-canvas'),
    toolbar: showToolbar = true,
    content = '',
    zoom = 1,
    pan = { x: 16, y: 30 },
    minZoom = 0.25,
    maxZoom = 2,
    attributes = '',
  } = options;

  const initialZoom = Number(zoom) || 1;
  const initialPanX = Number(pan?.x ?? 16);
  const initialPanY = Number(pan?.y ?? 30);

  let toolsHtml = '';
  if (showToolbar) {
    const toolbarContent = typeof showToolbar === 'string' ? showToolbar : renderZoomToolbar();
    toolsHtml = `<div class="ds-canvas-tools sx-canvas-tools">${toolbarContent}</div>`;
  }

  const worldStyle = `transform:translate(${initialPanX}px,${initialPanY}px) scale(${initialZoom});`;
  const bgStyle = `background-position:${initialPanX}px ${initialPanY}px;background-size:${16 * initialZoom}px ${16 * initialZoom}px;`;

  return `<div class="ds-canvas sx-canvas dotted" data-sui-canvas id="${escapeHTML(id)}" data-zoom="${initialZoom}" data-pan-x="${initialPanX}" data-pan-y="${initialPanY}" data-min-zoom="${minZoom}" data-max-zoom="${maxZoom}" style="${bgStyle}"${attributes ? ` ${attributes}` : ''}><div class="ds-canvas-viewport sx-canvas-viewport" tabindex="0" role="region" aria-label="Workspace canvas. Drag background to pan, scroll to zoom, arrow keys to pan."><div class="ds-canvas-world sx-canvas-world" style="${worldStyle}">${content}</div></div>${toolsHtml}</div>`;
}

const mounted = new WeakMap();

/**
 * Controller for Canvas.
 *
 * @param {HTMLElement} element
 * @returns {object} Canvas controller
 */
export function initCanvas(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  const viewport = element.querySelector('.sx-canvas-viewport, .ds-canvas-viewport');
  const world = element.querySelector('.sx-canvas-world, .ds-canvas-world');

  if (!viewport || !world) {
    throw new TypeError('Canvas markup is incomplete: missing viewport or world');
  }

  let zoom = Number(element.dataset.zoom) || 1;
  let panX = Number(element.dataset.panX ?? 16);
  let panY = Number(element.dataset.panY ?? 30);
  const minZoom = Number(element.dataset.minZoom) || 0.25;
  const maxZoom = Number(element.dataset.maxZoom) || 2;
  let destroyed = false;
  let activeDrag = null;

  function paint() {
    if (destroyed) return;
    world.style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`;

    const output = element.querySelector('output');
    if (output) {
      output.textContent = `${Math.round(zoom * 100)}%`;
    }

    element.style.backgroundPosition = `${panX}px ${panY}px`;
    element.style.backgroundSize = `${16 * zoom}px ${16 * zoom}px`;

    element.dataset.zoom = String(zoom);
    element.dataset.panX = String(panX);
    element.dataset.panY = String(panY);

    element.dispatchEvent(new view.CustomEvent('sui:canvas:change', {
      bubbles: true,
      detail: { zoom, pan: { x: panX, y: panY } },
    }));
  }

  function applyZoom(change, point = null) {
    const oldZoom = zoom;
    let newZoom = zoom;

    const vpWidth = viewport.clientWidth || 440;
    const vpHeight = viewport.clientHeight || 180;

    if (change === 'fit') {
      const worldW = world.scrollWidth || 440;
      const worldH = world.scrollHeight || 180;
      newZoom = Math.max(minZoom, Math.min(1.5, (vpWidth - 32) / worldW, (vpHeight - 32) / worldH));
      panX = (vpWidth - worldW * newZoom) / 2;
      panY = (vpHeight - worldH * newZoom) / 2;
    } else {
      newZoom = Math.max(minZoom, Math.min(maxZoom, oldZoom + Number(change)));
      const px = point?.x ?? vpWidth / 2;
      const py = point?.y ?? vpHeight / 2;
      panX = px - ((px - panX) * newZoom) / oldZoom;
      panY = py - ((py - panY) * newZoom) / oldZoom;
    }

    zoom = newZoom;
    paint();
  }

  function onPointerDown(event) {
    if (destroyed || event.button !== 0) return;
    if (event.target.closest('button, input, select, textarea, a, [role="button"], .sx-canvas-tools')) return;

    activeDrag = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      initPanX: panX,
      initPanY: panY,
    };

    if (typeof viewport.setPointerCapture === 'function') {
      try {
        viewport.setPointerCapture(event.pointerId);
      } catch {}
    }
    viewport.classList.add('dragging');
  }

  function onPointerMove(event) {
    if (!activeDrag || event.pointerId !== activeDrag.id) return;
    panX = activeDrag.initPanX + (event.clientX - activeDrag.startX);
    panY = activeDrag.initPanY + (event.clientY - activeDrag.startY);
    paint();
  }

  function onPointerEnd(event) {
    if (activeDrag && event.pointerId === activeDrag.id) {
      activeDrag = null;
      viewport.classList.remove('dragging');
      if (typeof viewport.releasePointerCapture === 'function') {
        try {
          viewport.releasePointerCapture(event.pointerId);
        } catch {}
      }
    }
  }

  function onWheel(event) {
    if (destroyed) return;
    event.preventDefault();
    const rect = viewport.getBoundingClientRect?.() || { left: 0, top: 0 };
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const delta = event.deltaY < 0 ? 0.1 : -0.1;
    applyZoom(delta, point);
  }

  function onKeyDown(event) {
    if (destroyed) return;
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        panY += 20;
        paint();
        break;
      case 'ArrowDown':
        event.preventDefault();
        panY -= 20;
        paint();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        panX += 20;
        paint();
        break;
      case 'ArrowRight':
        event.preventDefault();
        panX -= 20;
        paint();
        break;
      case '+':
      case '=':
        event.preventDefault();
        applyZoom(0.1);
        break;
      case '-':
        event.preventDefault();
        applyZoom(-0.1);
        break;
      case '0':
        event.preventDefault();
        zoom = 1;
        panX = 16;
        panY = 30;
        paint();
        break;
      default:
        break;
    }
  }

  function onClick(event) {
    if (destroyed) return;
    const btn = event.target.closest('[data-canvas-zoom]');
    if (btn && element.contains(btn)) {
      event.preventDefault();
      applyZoom(btn.dataset.canvasZoom);
    }
  }

  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', onPointerEnd);
  viewport.addEventListener('pointercancel', onPointerEnd);
  viewport.addEventListener('wheel', onWheel, { passive: false });
  viewport.addEventListener('keydown', onKeyDown);
  element.addEventListener('click', onClick);

  const controller = {
    setZoom(newZoom, centerPoint = null) {
      const targetZoom = Math.max(minZoom, Math.min(maxZoom, Number(newZoom) || 1));
      applyZoom(targetZoom - zoom, centerPoint);
    },
    getZoom() {
      return zoom;
    },
    setPan(newPan) {
      if (newPan?.x !== undefined) panX = Number(newPan.x);
      if (newPan?.y !== undefined) panY = Number(newPan.y);
      paint();
    },
    getPan() {
      return { x: panX, y: panY };
    },
    fitToContent() {
      applyZoom('fit');
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', onPointerEnd);
      viewport.removeEventListener('pointercancel', onPointerEnd);
      viewport.removeEventListener('wheel', onWheel);
      viewport.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('click', onClick);
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
