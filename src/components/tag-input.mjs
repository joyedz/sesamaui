import { uid, escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

function renderTag(text, locked = false) {
  const removeBtn = locked
    ? ''
    : `<button type="button" class="ibtn" data-tag-remove aria-label="Remove ${escapeHTML(text)}">${controlIcon('x', 12)}</button>`;
  return `<span class="sx-tag" data-tag-value="${escapeHTML(text)}"><span>${escapeHTML(text)}</span>${removeBtn}</span>`;
}

/**
 * Pure builder for Tag Input control.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function tagInput(options = {}) {
  const {
    id = uid(),
    name = 'tags',
    label = 'Tags',
    tags = [],
    placeholder = 'Add a tag…',
    maxTags = 10,
    disabled = false,
    readonly = false,
    invalid = false,
    helper = '',
    error = '',
    attributes = '',
  } = options;

  const isInvalid = Boolean(invalid || error);
  const tagList = Array.isArray(tags) ? tags : [];
  const tagsHtml = tagList.map(t => renderTag(t, disabled || readonly)).join('');
  const tagsJson = escapeHTML(JSON.stringify(tagList));

  return `<div class="sx form-field sx-tag-input" data-sui-tag-input data-tag-demo data-name="${escapeHTML(name)}" data-max="${Number(maxTags)}" data-initial-tags="${tagsJson}" ${disabled ? 'data-disabled' : ''} ${readonly ? 'data-readonly' : ''}${attributes ? ` ${attributes}` : ''}>${label ? `<label class="form-label" for="${escapeHTML(id)}">${escapeHTML(label)}</label>` : ''}<div class="sx-tagbox" data-tagbox data-max="${Number(maxTags)}" ${disabled ? 'data-disabled' : ''} ${readonly ? 'data-readonly' : ''} ${isInvalid ? 'aria-invalid="true"' : ''}>${tagsHtml}<input id="${escapeHTML(id)}" aria-describedby="${escapeHTML(id)}-status" aria-label="${escapeHTML(label || 'Add tag')}" placeholder="${escapeHTML(placeholder)}" ${disabled ? 'disabled' : ''} ${readonly ? 'readonly' : ''} data-sui-tag-input-field></div><input data-sui-tag-input-hidden type="hidden" name="${escapeHTML(name)}" value="${escapeHTML(tagList.join(','))}"><span id="${escapeHTML(id)}-status" class="${isInvalid ? 'form-error' : 'sx-help'}" role="status" data-tag-status>${escapeHTML(error || helper || 'Press Enter to add a tag.')}</span></div>`;
}

const mounted = new WeakMap();

/**
 * Controller for Tag Input.
 *
 * @param {HTMLElement} element
 * @returns {object} Tag Input controller
 */
export function initTagInput(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  const tagbox = element.querySelector('[data-tagbox]');
  const input = element.querySelector('[data-sui-tag-input-field]') || element.querySelector('input:not([type="hidden"])');
  const hiddenInput = element.querySelector('[data-sui-tag-input-hidden], input[type="hidden"]');
  const statusEl = element.querySelector('[data-tag-status], [role="status"]');

  if (!tagbox || !input) {
    throw new TypeError('Tag Input markup is incomplete');
  }

  let initialTags = [];
  try {
    initialTags = JSON.parse(element.dataset.initialTags || '[]');
  } catch {
    initialTags = [];
  }

  let tags = [...initialTags];
  const maxTags = Number(element.dataset.max || tagbox.dataset.max || 10);
  let destroyed = false;

  function syncHidden() {
    if (hiddenInput) {
      hiddenInput.value = tags.join(',');
    }
  }

  function addTag(text) {
    if (destroyed || input.disabled || input.readOnly) return false;
    const value = text.trim().replace(/,$/, '');
    if (!value) return false;

    if (tags.some(t => t.toLowerCase() === value.toLowerCase())) {
      if (statusEl) statusEl.textContent = 'This tag already exists.';
      return false;
    }

    if (tags.length >= maxTags) {
      if (statusEl) statusEl.textContent = 'Maximum number of tags reached.';
      return false;
    }

    tags.push(value);
    input.insertAdjacentHTML('beforebegin', renderTag(value, input.disabled || input.readOnly));
    syncHidden();
    input.value = '';
    if (statusEl) statusEl.textContent = 'Added ' + value;

    element.dispatchEvent(new view.CustomEvent('sui:change', {
      bubbles: true,
      detail: { name: element.dataset.name, tags: [...tags], added: value },
    }));
    return true;
  }

  function removeTag(value) {
    if (destroyed || input.disabled || input.readOnly) return false;
    const idx = tags.findIndex(t => t.toLowerCase() === value.toLowerCase());
    if (idx === -1) return false;

    const removed = tags.splice(idx, 1)[0];
    const tagEls = tagbox.querySelectorAll('.sx-tag');
    for (const el of tagEls) {
      if (el.dataset.tagValue === removed || el.querySelector('span')?.textContent === removed) {
        el.remove();
        break;
      }
    }

    syncHidden();
    if (statusEl) statusEl.textContent = 'Tag removed.';
    input.focus();

    element.dispatchEvent(new view.CustomEvent('sui:change', {
      bubbles: true,
      detail: { name: element.dataset.name, tags: [...tags], removed },
    }));
    return true;
  }

  function onKeyDown(event) {
    if (destroyed || input.disabled || input.readOnly || event.isComposing) return;

    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag(input.value);
    } else if (event.key === 'Backspace' && !input.value && tags.length > 0) {
      const lastBtn = tagbox.querySelector('.sx-tag:last-of-type button');
      if (lastBtn) {
        lastBtn.focus();
      } else {
        removeTag(tags[tags.length - 1]);
      }
    }
  }

  function onClick(event) {
    if (destroyed || input.disabled || input.readOnly) return;
    const removeBtn = event.target.closest('[data-tag-remove]');
    if (removeBtn && tagbox.contains(removeBtn)) {
      event.preventDefault();
      const tagEl = removeBtn.closest('.sx-tag');
      const val = tagEl.dataset.tagValue || tagEl.querySelector('span')?.textContent;
      if (val) removeTag(val);
    }
  }

  function onReset() {
    tags = [...initialTags];
    tagbox.querySelectorAll('.sx-tag').forEach(n => n.remove());
    for (const t of tags) {
      input.insertAdjacentHTML('beforebegin', renderTag(t, input.disabled || input.readOnly));
    }
    syncHidden();
    input.value = '';
    if (statusEl) statusEl.textContent = '';
  }

  input.addEventListener('keydown', onKeyDown);
  tagbox.addEventListener('click', onClick);

  const form = hiddenInput?.form || input.form || element.closest?.('form');
  form?.addEventListener?.('reset', onReset);

  const controller = {
    addTag,
    removeTag,
    getTags: () => [...tags],
    setTags(newTags) {
      tags = [];
      tagbox.querySelectorAll('.sx-tag').forEach(n => n.remove());
      for (const t of newTags) {
        addTag(t);
      }
      syncHidden();
    },
    clear() {
      tags = [];
      tagbox.querySelectorAll('.sx-tag').forEach(n => n.remove());
      syncHidden();
      input.value = '';
      if (statusEl) statusEl.textContent = '';
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      input.removeEventListener('keydown', onKeyDown);
      tagbox.removeEventListener('click', onClick);
      form?.removeEventListener('reset', onReset);
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
