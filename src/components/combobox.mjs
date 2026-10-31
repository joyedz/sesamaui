import { uid, escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { positionOverlay, createDismissManager } from './overlay-helpers.mjs';

function normalizeOption(opt, index) {
  if (typeof opt === 'string') {
    return { id: `opt-${index}`, value: opt, label: opt, group: '', disabled: false };
  }
  const val = opt.value !== undefined ? String(opt.value) : (opt.label || `opt-${index}`);
  const lbl = opt.label !== undefined ? String(opt.label) : val;
  return {
    id: opt.id || `opt-${index}`,
    value: val,
    label: lbl,
    group: opt.group || '',
    disabled: Boolean(opt.disabled),
  };
}

/**
 * Pure builder for Combobox control.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function combobox(options = {}) {
  const {
    id = uid(),
    name = 'combobox',
    label = 'Project',
    value = '',
    placeholder = 'Search projects…',
    options: rawOptions = ['Website', 'Mobile app', 'Platform', 'Archived project', 'Research'],
    groups = null,
    disabled = false,
    required = false,
    invalid = false,
    helper = '',
    error = '',
    loading = false,
    clearable = true,
    attributes = '',
  } = options;

  let allOptions = [];
  if (groups && Array.isArray(groups)) {
    for (const group of groups) {
      for (const item of (group.options || [])) {
        allOptions.push({
          ...normalizeOption(item, allOptions.length),
          group: group.label || '',
        });
      }
    }
  } else if (Array.isArray(rawOptions)) {
    allOptions = rawOptions.map(normalizeOption);
  }

  const selectedOpt = allOptions.find(o => o.value === String(value));
  const displayLabel = selectedOpt ? selectedOpt.label : (value ? String(value) : '');
  const isInvalid = Boolean(invalid || error);
  const optionsJson = escapeHTML(JSON.stringify(allOptions));

  const clearBtn = clearable
    ? `<button type="button" class="sx-combo-clear ibtn" data-combo-clear aria-label="Clear ${escapeHTML(label || 'selection')}" ${!value || disabled ? 'hidden' : ''}>${controlIcon('x', 14)}</button>`
    : '';

  return `<div class="sx form-field sx-combo" data-sui-combobox data-name="${escapeHTML(name)}" data-value="${escapeHTML(value)}" data-mode="${loading ? 'loading' : 'default'}" data-sui-options="${optionsJson}" ${disabled ? 'data-disabled' : ''} ${required ? 'data-required' : ''}${attributes ? ` ${attributes}` : ''}>${label ? `<label class="form-label" for="${escapeHTML(id)}">${escapeHTML(label)}</label>` : ''}<div class="field sx-input-shell"><input id="${escapeHTML(id)}" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${escapeHTML(id)}-list" autocomplete="off" placeholder="${escapeHTML(placeholder)}" value="${escapeHTML(displayLabel)}" data-sui-combobox-input ${disabled ? 'disabled' : ''} ${isInvalid ? 'aria-invalid="true"' : ''} ${required ? 'required' : ''}>${clearBtn}</div><input data-sui-combobox-hidden type="hidden" name="${escapeHTML(name)}" value="${escapeHTML(value)}"><div id="${escapeHTML(id)}-list" class="sx-popup sx-combo-list" popover="manual" role="listbox" aria-label="${escapeHTML(label || 'Projects')}" data-sui-combobox-list></div>${isInvalid ? `<span id="${escapeHTML(id)}-error" class="form-error">${escapeHTML(error || 'Choose an available option.')}</span>` : helper ? `<span id="${escapeHTML(id)}-help" class="form-help">${escapeHTML(helper)}</span>` : ''}<span class="sx-help" data-combo-status role="status"></span></div>`;
}

const mounted = new WeakMap();

/**
 * Controller for Combobox.
 *
 * @param {HTMLElement} element
 * @returns {object} Combobox controller
 */
export function initCombobox(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  const input = element.querySelector('[data-sui-combobox-input], [role="combobox"]');
  const hiddenInput = element.querySelector('[data-sui-combobox-hidden], input[type="hidden"]');
  const list = element.querySelector('[data-sui-combobox-list], [role="listbox"]');
  const clearBtn = element.querySelector('[data-combo-clear]');
  const statusEl = element.querySelector('[data-combo-status]');

  if (!input || !list) {
    throw new TypeError('Combobox markup is incomplete');
  }

  let options = [];
  try {
    options = JSON.parse(element.dataset.suiOptions || '[]');
  } catch {
    options = [];
  }

  let currentValue = element.dataset.value || (hiddenInput ? hiddenInput.value : '');
  let initialValue = currentValue;
  let isOpen = false;
  let activeIndex = -1;
  let destroyed = false;

  const dismissManager = createDismissManager({
    popup: list,
    trigger: input,
    onDismiss: (reason) => {
      close();
    },
    onReposition: () => {
      if (isOpen) positionOverlay(input, list, 'bottom');
    },
  });

  const getVisibleOptions = () => [...list.querySelectorAll('[role="option"]')];
  const getEnabledOptions = () => getVisibleOptions().filter(o => o.getAttribute('aria-disabled') !== 'true');

  function renderList(query = '') {
    const q = query.trim().toLowerCase();

    if (element.dataset.mode === 'loading') {
      input.setAttribute('aria-busy', 'true');
      list.innerHTML = '<div class="sx-pop-content" role="status">Loading…</div>';
      if (statusEl) statusEl.textContent = 'Loading…';
      return;
    }

    input.removeAttribute('aria-busy');
    const filtered = options.filter(o => !q || o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q));

    if (filtered.length === 0) {
      list.innerHTML = '<div class="sx-pop-content">No results</div>';
      if (statusEl) statusEl.textContent = 'No results';
      updateActiveDescendant(-1);
      return;
    }

    const hasGroups = filtered.some(o => o.group);
    if (hasGroups) {
      const groups = [...new Set(filtered.map(o => o.group || ''))];
      list.innerHTML = groups.map(grp => {
        const items = filtered.filter(o => (o.group || '') === grp);
        const itemsHtml = items.map((opt, i) => {
          const isSelected = currentValue === opt.value;
          const optId = `${list.id}-${grp ? grp.replace(/\s+/g, '-') + '-' : ''}${i}`;
          return `<div role="option" id="${optId}" class="sx-menu-item" aria-selected="${isSelected}" aria-disabled="${Boolean(opt.disabled)}" data-combo-value="${escapeHTML(opt.value)}" data-combo-label="${escapeHTML(opt.label)}">${escapeHTML(opt.label)}</div>`;
        }).join('');
        if (grp) {
          return `<div role="group" aria-label="${escapeHTML(grp)}"><div class="sx-menu-label">${escapeHTML(grp)}</div>${itemsHtml}</div>`;
        }
        return itemsHtml;
      }).join('');
    } else {
      list.innerHTML = filtered.map((opt, i) => {
        const isSelected = currentValue === opt.value;
        const optId = `${list.id}-${i}`;
        return `<div role="option" id="${optId}" class="sx-menu-item" aria-selected="${isSelected}" aria-disabled="${Boolean(opt.disabled)}" data-combo-value="${escapeHTML(opt.value)}" data-combo-label="${escapeHTML(opt.label)}">${escapeHTML(opt.label)}</div>`;
      }).join('');
    }

    if (statusEl) statusEl.textContent = `${filtered.length} results`;
    updateActiveDescendant(0);
  }

  function updateActiveDescendant(newIndex) {
    const opts = getEnabledOptions();
    opts.forEach(opt => {
      opt.classList.remove('active');
    });

    if (newIndex >= 0 && newIndex < opts.length) {
      activeIndex = newIndex;
      const activeEl = opts[activeIndex];
      activeEl.classList.add('active');
      input.setAttribute('aria-activedescendant', activeEl.id);
      activeEl.scrollIntoView({ block: 'nearest' });
    } else {
      activeIndex = -1;
      input.removeAttribute('aria-activedescendant');
    }
  }

  function open() {
    if (destroyed || input.disabled) return;
    renderList(input.value);
    if (!isOpen) {
      isOpen = true;
      try { list.showPopover(); } catch {}
      input.setAttribute('aria-expanded', 'true');
      positionOverlay(input, list, 'bottom');
      dismissManager.bind();
    }
  }

  function close() {
    if (destroyed || !isOpen) return;
    isOpen = false;
    try { list.hidePopover(); } catch {}
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    dismissManager.unbind();
  }

  function commitOption(optEl) {
    if (!optEl || optEl.getAttribute('aria-disabled') === 'true') return;
    const nextVal = optEl.dataset.comboValue;
    const nextLbl = optEl.dataset.comboLabel || nextVal;
    const prevVal = currentValue;

    currentValue = nextVal;
    element.dataset.value = nextVal;
    if (hiddenInput) hiddenInput.value = nextVal;
    input.value = nextLbl;

    if (clearBtn) clearBtn.hidden = !nextVal;
    if (statusEl) statusEl.textContent = 'Selected ' + nextLbl;

    close();
    input.focus();

    if (nextVal !== prevVal) {
      element.dispatchEvent(new view.CustomEvent('sui:change', {
        bubbles: true,
        detail: { name: element.dataset.name, value: nextVal, label: nextLbl, previousValue: prevVal },
      }));
    }
  }

  function clear() {
    const prevVal = currentValue;
    currentValue = '';
    element.dataset.value = '';
    if (hiddenInput) hiddenInput.value = '';
    input.value = '';
    if (clearBtn) clearBtn.hidden = true;
    if (statusEl) statusEl.textContent = '';
    close();
    input.focus();

    element.dispatchEvent(new view.CustomEvent('sui:change', {
      bubbles: true,
      detail: { name: element.dataset.name, value: '', label: '', previousValue: prevVal },
    }));
  }

  function onInput() {
    open();
  }

  function onKeyDown(event) {
    if (destroyed || input.disabled) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        open();
      } else {
        const opts = getEnabledOptions();
        if (opts.length > 0) {
          const next = (activeIndex + 1) % opts.length;
          updateActiveDescendant(next);
        }
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        open();
      } else {
        const opts = getEnabledOptions();
        if (opts.length > 0) {
          const next = (activeIndex - 1 + opts.length) % opts.length;
          updateActiveDescendant(next);
        }
      }
    } else if (event.key === 'Enter') {
      if (isOpen) {
        event.preventDefault();
        const opts = getEnabledOptions();
        if (activeIndex >= 0 && activeIndex < opts.length) {
          commitOption(opts[activeIndex]);
        }
      }
    } else if (event.key === 'Escape') {
      if (isOpen) {
        event.preventDefault();
        close();
      }
    }
  }

  function onListClick(event) {
    if (destroyed) return;
    const optEl = event.target.closest('[role="option"]');
    if (optEl && list.contains(optEl)) {
      commitOption(optEl);
    }
  }

  function onClearClick(event) {
    if (destroyed) return;
    event.preventDefault();
    clear();
  }

  function onReset() {
    currentValue = initialValue;
    element.dataset.value = initialValue;
    if (hiddenInput) hiddenInput.value = initialValue;
    const opt = options.find(o => o.value === initialValue);
    input.value = opt ? opt.label : initialValue;
    if (clearBtn) clearBtn.hidden = !initialValue;
    close();
  }

  input.addEventListener('input', onInput);
  input.addEventListener('keydown', onKeyDown);
  list.addEventListener('click', onListClick);
  clearBtn?.addEventListener('click', onClearClick);

  const form = hiddenInput?.form || input.form || element.closest?.('form');
  form?.addEventListener?.('reset', onReset);

  const controller = {
    open,
    close,
    setValue(val, silent = false) {
      const prevVal = currentValue;
      currentValue = String(val);
      element.dataset.value = currentValue;
      if (hiddenInput) hiddenInput.value = currentValue;
      const opt = options.find(o => o.value === currentValue);
      const nextLbl = opt ? opt.label : currentValue;
      input.value = nextLbl;
      if (clearBtn) clearBtn.hidden = !currentValue;

      if (!silent && currentValue !== prevVal) {
        element.dispatchEvent(new view.CustomEvent('sui:change', {
          bubbles: true,
          detail: { name: element.dataset.name, value: currentValue, label: nextLbl, previousValue: prevVal },
        }));
      }
    },
    getValue: () => currentValue,
    getLabel() {
      const opt = options.find(o => o.value === currentValue);
      return opt ? opt.label : input.value;
    },
    setOptions(newOpts) {
      options = (newOpts || []).map(normalizeOption);
      element.dataset.suiOptions = JSON.stringify(options);
      if (isOpen) renderList(input.value);
    },
    setDisabled(disabled) {
      input.disabled = Boolean(disabled);
      if (clearBtn) clearBtn.disabled = Boolean(disabled);
      element.toggleAttribute('data-disabled', Boolean(disabled));
      if (disabled) close();
    },
    clear,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      close();
      input.removeEventListener('input', onInput);
      input.removeEventListener('keydown', onKeyDown);
      list.removeEventListener('click', onListClick);
      clearBtn?.removeEventListener('click', onClearClick);
      form?.removeEventListener('reset', onReset);
      dismissManager.unbind();
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
