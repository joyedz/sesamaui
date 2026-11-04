import { applySurface, surfaceMode } from './shared.mjs';
import { escapeHTML, uid } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

const FILE_TYPE_ICONS = {
  image: 'file-image',
  document: 'file-text',
  spreadsheet: 'grid-3x3',
  presentation: 'file-text',
  video: 'video',
  audio: 'volume-2',
  archive: 'archive',
  other: 'file'
};

const EXTENSION_MAP = {
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
  svg: 'image',
  pdf: 'document',
  doc: 'document',
  docx: 'document',
  txt: 'document',
  md: 'document',
  xls: 'spreadsheet',
  xlsx: 'spreadsheet',
  csv: 'spreadsheet',
  ppt: 'presentation',
  pptx: 'presentation',
  mp4: 'video',
  mov: 'video',
  webm: 'video',
  mp3: 'audio',
  wav: 'audio',
  m4a: 'audio',
  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  tar: 'archive',
  gz: 'archive'
};

function inferType(name = '') {
  const parts = String(name).split('.');
  if (parts.length > 1) {
    const ext = parts.pop().toLowerCase();
    if (EXTENSION_MAP[ext]) return EXTENSION_MAP[ext];
  }
  return 'other';
}

/**
 * Render a file card or attachment.
 * @param {Object} options
 * @returns {string} HTML string
 */
function buildFileCard(options = {}) {
  const variant = options.variant || 'default';
  if (!['default', 'attachment'].includes(variant)) throw new TypeError(`Invalid file card variant: ${variant}`);
  const id = options.id || uid('file');
  const name = options.name || 'Untitled';
  const type = options.type || inferType(name);
  const size = options.size || '';
  const src = options.src || '';
  const iconName = options.iconName || FILE_TYPE_ICONS[type] || 'file';
  const expanded = Boolean(options.expanded);
  const removable = Boolean(options.removable);
  const classes = ['fcard', 'sx-file-card', variant === 'attachment' ? 'sx-file-attachment' : '', options.classes].filter(Boolean).join(' ');

  let actionHTML = '';
  if (removable) {
    actionHTML = `<button type="button" class="ibtn sx-file-remove" data-file-remove data-composer-remove-file aria-label="Remove ${escapeHTML(name)}">${controlIcon('x', 14)}</button>`;
  } else if (typeof options.actions === 'string') {
    actionHTML = options.actions;
  } else if (Array.isArray(options.actions) && options.actions.length > 0) {
    const actionList = options.actions.map(a => typeof a === 'string' ? a : a.label || a.name).join(',');
    actionHTML = `<button type="button" class="ibtn" data-menu="${escapeHTML(actionList)}" aria-label="File actions">${controlIcon('kebab', 16)}</button>`;
  } else {
    actionHTML = `<button type="button" class="ibtn" data-menu="Download,Copy link" aria-label="File actions">${controlIcon('kebab', 16)}</button>`;
  }

  let previewHTML = '';
  if (options.preview) {
    if (typeof options.preview === 'string' && (options.preview.startsWith('<') || options.preview.includes('</'))) {
      previewHTML = options.preview;
    } else {
      previewHTML = `<img src="${escapeHTML(options.preview)}" alt="${escapeHTML(name)}" class="sx-file-image-preview">`;
    }
  } else if (src && type === 'image') {
    previewHTML = `<img src="${escapeHTML(src)}" alt="${escapeHTML(name)}" class="sx-file-image-preview">`;
  } else {
    previewHTML = `<div class="sx-file-icon-preview">${controlIcon(iconName, 80)}</div>`;
  }

  const extraAttrs = [];
  if (options.attributes) {
    if (typeof options.attributes === 'string') {
      extraAttrs.push(options.attributes);
    } else if (typeof options.attributes === 'object') {
      for (const [k, v] of Object.entries(options.attributes)) {
        extraAttrs.push(`${k}="${escapeHTML(v)}"`);
      }
    }
  }

  return `<div class="${classes}" data-sui-file-card id="${escapeHTML(id)}" data-file-id="${escapeHTML(id)}" ${src ? `data-file-src="${escapeHTML(src)}"` : ''} data-file-type="${escapeHTML(type)}" ${extraAttrs.join(' ')}><div class="fhead sx-file-head"><button type="button" class="sx-file-open" data-file-preview aria-expanded="${expanded}" aria-label="Preview ${escapeHTML(name)}">${variant === 'attachment' ? `<span class="sx-file-visual" aria-hidden="true">${controlIcon(iconName, 24)}</span><span class="sx-file-copy"><span class="sx-file-name" title="${escapeHTML(name)}">${escapeHTML(name)}</span>${size ? `<span class="sx-file-size">${escapeHTML(size)}</span>` : ''}</span>` : `${controlIcon(iconName, 16)}<span class="sx-file-name">${escapeHTML(name)}</span>${size ? `<span class="sx-file-size sx-help">${escapeHTML(size)}</span>` : ''}`} </button>${variant === 'attachment' ? `<div class="sx-file-actions">${actionHTML}</div>` : actionHTML}</div><div class="fprev sx-file-preview" data-file-preview-body ${expanded ? '' : 'hidden'}>${previewHTML}</div></div>`;
}

/**
 * Convenience wrapper for file attachment.
 */
function buildFileAttachment(options = {}) {
  return fileCard(options);
}

const instances = new WeakMap();

/**
 * Initialize file card controller.
 * @param {HTMLElement} element
 * @returns {Object} Controller instance
 */
export function initFileCard(element) {
  if (!element) return null;
  if (instances.has(element)) return instances.get(element);

  const previewBtn = element.querySelector('[data-file-preview]');
  const previewBody = element.querySelector('[data-file-preview-body]');
  const removeBtn = element.querySelector('[data-file-remove]');

  const fileId = element.dataset.fileId || element.id || '';
  const fileName = previewBtn?.querySelector('.sx-file-name')?.textContent?.trim() || '';

  function isExpanded() {
    return previewBtn?.getAttribute('aria-expanded') === 'true';
  }

  const view = element.ownerDocument?.defaultView || globalThis;
  let motion = null;
  let openDuration = 200;
  let closeDuration = 140;
  let destroyed = false;

  function settlePreview() {
    if (motion) {
      motion.onfinish = null;
      motion.cancel();
      motion = null;
    }
    if (!previewBody) return;
    if (isExpanded()) previewBody.removeAttribute('hidden');
    else previewBody.setAttribute('hidden', '');
  }

  function toggle(expand, animate = false) {
    if (destroyed) return;
    const next = typeof expand === 'boolean' ? expand : !isExpanded();
    previewBtn?.setAttribute('aria-expanded', String(next));
    const reduced = view.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!animate || reduced || !previewBody || typeof element.animate !== 'function') {
      settlePreview();
    } else if (motion) {
      // Reverse the same timeline from its current visual position.
      motion.playbackRate = next ? 1 : -openDuration / closeDuration;
      motion.play();
    } else {
      const style = view.getComputedStyle(element);
      const milliseconds = (token, fallback) => {
        const value = style.getPropertyValue(token).trim();
        return value ? Math.max(0, parseFloat(value) * (value.endsWith('ms') ? 1 : 1000)) : fallback;
      };
      openDuration = milliseconds('--motion-base', 200);
      closeDuration = milliseconds('--motion-fast', 140);
      if (!openDuration || !closeDuration) {
        settlePreview();
      } else {
        // Measure both endpoints once. During playback, only the visual reveal
        // and position animate; text, icons, and the page avoid per-frame layout.
        previewBody.setAttribute('hidden', '');
        const collapsed = element.getBoundingClientRect();
        previewBody.removeAttribute('hidden');
        const expanded = element.getBoundingClientRect();
        const inset = Math.max(0, expanded.height - collapsed.height);
        const offset = collapsed.top - expanded.top;
        const radius = style.borderRadius;
        motion = element.animate([
          { transform: `translateY(${offset}px)`, clipPath: `inset(-2px -2px ${inset - 2}px -2px round ${radius})` },
          { transform: 'translateY(0px)', clipPath: `inset(-2px round ${radius})` }
        ], { duration: openDuration, easing: style.getPropertyValue('--ease-out').trim(), fill: 'both' });
        motion.onfinish = settlePreview;
        if (!next) {
          motion.currentTime = openDuration;
          motion.playbackRate = -openDuration / closeDuration;
        }
      }
    }
    element.dispatchEvent(new view.CustomEvent('sui:file:toggle', {
      bubbles: true,
      detail: { id: fileId, name: fileName, expanded: next }
    }));
  }

  function handlePreviewClick(e) {
    e.preventDefault();
    // Native keyboard clicks have detail=0 and must respond immediately.
    toggle(undefined, e.detail > 0);
  }

  function handleRemoveClick(e) {
    e.preventDefault();
    e.stopPropagation();
    element.dispatchEvent(new CustomEvent('sui:file:remove', {
      bubbles: true,
      detail: { id: fileId, name: fileName }
    }));
  }

  if (previewBtn) {
    previewBtn.addEventListener('click', handlePreviewClick);
  }
  if (removeBtn) {
    removeBtn.addEventListener('click', handleRemoveClick);
  }

  const controller = {
    element,
    isExpanded,
    toggle,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      settlePreview();
      if (previewBtn) previewBtn.removeEventListener('click', handlePreviewClick);
      if (removeBtn) removeBtn.removeEventListener('click', handleRemoveClick);
      instances.delete(element);
    }
  };

  instances.set(element, controller);
  return controller;
}


export function fileCard(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildFileCard(...args), mode, ["@root"]);
}

export function fileAttachment(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildFileAttachment(...args), mode, ["@root"]);
}
