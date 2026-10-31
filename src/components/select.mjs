import { uid, escapeHTML, tabStops } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

export function select({
  name = '',
  label = '',
  ariaLabel = '',
  hideLabel = false,
  value = '',
  placeholder = 'Choose an option',
  options = [],
  groups,
  actions = [],
  size = 'base',
  inline = false,
  disabled = false,
  required = false,
  helper = '',
  error = '',
  invalid = false,
  icon = undefined,
} = {}) {
  if (!['sm', 'base', 'lg'].includes(size)) throw new TypeError('Invalid select size');

  const normalize = entry => typeof entry === 'string'
    ? { label: entry, value: entry }
    : { ...entry, value: String(entry.value ?? entry.label) };

  const entries = (groups ? groups.flatMap(group => group.options) : options).map(normalize);
  if (new Set(entries.map(entry => entry.value)).size !== entries.length) {
    throw new TypeError('Select values must be unique');
  }

  const chosen = entries.find(entry => entry.value === String(value));
  if (value !== '' && !chosen) throw new TypeError('Select value must match an option');

  const id = uid();
  const triggerId = `${id}-trigger`;
  const optionsId = `${id}-options`;
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const isInvalid = Boolean(invalid || error);

  const customOption = entry => {
    const isSelected = entry.value === String(value);
    const glyph = entry.icon ? controlIcon(entry.icon) : '';
    return `<button type="button" class="sx-menu-item" role="option" aria-selected="${String(isSelected)}" data-sui-option="${escapeHTML(entry.value)}" data-sui-option-label="${escapeHTML(entry.label)}" ${entry.icon ? `data-sui-option-icon="${escapeHTML(entry.icon)}"` : ''} ${entry.disabled ? 'disabled' : ''}>${glyph}<span>${escapeHTML(entry.label)}</span><span class="sx-select-check" aria-hidden="true">${controlIcon('check', 14)}</span></button>`;
  };

  let customOptions = '';
  if (groups) {
    customOptions = groups.map(group => {
      const groupOptions = group.options.map(normalize).map(customOption).join('');
      return `<div role="group" aria-label="${escapeHTML(group.label)}"><div class="sx-menu-label">${escapeHTML(group.label)}</div>${groupOptions}</div>`;
    }).join('<div class="hr" role="presentation" aria-hidden="true"></div>');
  } else {
    customOptions = entries.map(customOption).join('');
  }

  let actionsMarkup = '';
  if (actions && actions.length > 0) {
    const actionButtons = actions.map(action => {
      const actionGlyph = action.icon ? controlIcon(action.icon) : '';
      return `<button type="button" class="sx-menu-item" data-select-action="${escapeHTML(action.key)}">${actionGlyph}<span>${escapeHTML(action.label)}</span></button>`;
    }).join('');
    actionsMarkup = `<div class="hr" role="presentation" aria-hidden="true"></div>${actionButtons}`;
  }

  const nativeOption = entry => `<option value="${escapeHTML(entry.value)}" ${entry.disabled ? 'disabled' : ''} ${entry.value === String(value) ? 'selected' : ''}>${escapeHTML(entry.label)}</option>`;

  let nativeOptions = '';
  if (groups) {
    nativeOptions = groups.map(group => {
      const groupOptions = group.options.map(normalize).map(nativeOption).join('');
      return `<optgroup label="${escapeHTML(group.label)}">${groupOptions}</optgroup>`;
    }).join('');
  } else {
    nativeOptions = entries.map(nativeOption).join('');
  }

  const emptyOption = entries.some(entry => entry.value === '') ? '' : `<option value="" hidden ${!chosen ? 'selected' : ''}>${escapeHTML(placeholder)}</option>`;
  const nativeSelect = `<select data-sui-select-native class="sui-sr-only" tabindex="-1" aria-hidden="true" name="${escapeHTML(name)}" ${required ? 'required' : ''} ${disabled ? 'disabled' : ''}>${emptyOption}${nativeOptions}</select>`;

  const description = [helper ? helperId : '', isInvalid ? errorId : ''].filter(Boolean).join(' ');

  const labelElement = (label && !hideLabel)
    ? `<label class="form-label" id="${labelId}" for="${triggerId}">${escapeHTML(label)}</label>`
    : `<span id="${labelId}" class="sui-sr-only">${escapeHTML(label || ariaLabel || name || 'Select')}</span>`;

  const messagesElement = `${helper ? `<span class="form-help" id="${helperId}">${escapeHTML(helper)}</span>` : ''}<span class="form-error" id="${errorId}" data-sui-select-error aria-live="polite" ${isInvalid ? '' : 'hidden'}>${escapeHTML(error || (invalid ? 'Choose an option.' : ''))}</span>`;

  const triggerIcon = icon ? controlIcon(icon) : '';

  return `<div data-sui-select data-sui-placeholder="${escapeHTML(placeholder)}" data-sui-error-message="${escapeHTML(error || 'Choose an option.')}" ${required ? 'data-sui-required' : ''}><div class="form-field">${labelElement}<button type="button" id="${triggerId}" data-field-control class="sx-select sx-select-trigger sx-size-${size} ${inline ? 'inline' : ''}" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="${labelId} ${valueId}" aria-controls="${optionsId}" ${description ? `aria-describedby="${description}"` : ''} ${isInvalid ? `aria-invalid="true" aria-errormessage="${errorId}"` : ''} ${disabled ? 'disabled' : ''}>${triggerIcon}<span id="${valueId}" data-sui-select-label>${escapeHTML(chosen?.label || placeholder)}</span>${controlIcon('chevron-down', 16)}</button>${messagesElement}</div>${nativeSelect}<div id="${optionsId}" class="sx-popup sx-select-options" popover="manual" role="listbox" aria-label="${escapeHTML(label || ariaLabel || name || 'Select')}">${customOptions}${actionsMarkup}</div></div>`;
}

const mounted = new WeakMap();
const invalidBatches = new WeakSet();

export function initSelect(element) {
  if (mounted.has(element)) return mounted.get(element);
  const trigger = element.querySelector('.sx-select-trigger');
  const popup = element.querySelector('[popover]');
  const control = element.querySelector('[data-sui-select-native]');
  const label = element.querySelector('[data-sui-select-label]');
  if (!trigger || !popup || !control || !label) throw new TypeError('Select markup is incomplete');
  const view = element.ownerDocument.defaultView;
  const errorNode = element.querySelector('[data-sui-select-error]');
  const helperNode = element.querySelector('.form-help');
  const placeholder = element.dataset.suiPlaceholder || 'Choose an option';
  let form, open = false, search = '', searchTimer, destroyed = false, previousValue = control.value;
  const enabledOptions = () => [...popup.querySelectorAll('[data-sui-option]:not(:disabled)')];
  const findOption = value => [...popup.querySelectorAll('[data-sui-option]')].find(node => node.dataset.suiOption === String(value));
  const ensureActive = () => { if (destroyed) throw new Error('Select controller has been destroyed'); };
  const emit = (name, detail) => element.dispatchEvent(new view.CustomEvent(`sui:${name}`, { bubbles: true, detail }));

  function clearFeedback() {
    trigger.removeAttribute('aria-invalid');
    trigger.removeAttribute('aria-errormessage');
    if (errorNode) errorNode.hidden = true;
    if (helperNode) trigger.setAttribute('aria-describedby', helperNode.id);
    else trigger.removeAttribute('aria-describedby');
  }
  function showFeedback() {
    trigger.setAttribute('aria-invalid', 'true');
    if (!errorNode) return;
    errorNode.hidden = false;
    errorNode.textContent = control.validity.customError ? control.validationMessage : element.dataset.suiErrorMessage || control.validationMessage;
    trigger.setAttribute('aria-errormessage', errorNode.id);
    trigger.setAttribute('aria-describedby', [helperNode?.id, errorNode.id].filter(Boolean).join(' '));
  }
  function syncValue(clear = false) {
    const item = findOption(control.value);
    label.textContent = item?.dataset.suiOptionLabel || placeholder;
    popup.querySelectorAll('[data-sui-option]').forEach(node => node.setAttribute('aria-selected', String(node === item)));
    if (clear && control.validity.valid) clearFeedback();
  }
  function syncState() {
    trigger.disabled = control.disabled;
    element.toggleAttribute('data-sui-required', control.required);
    if (control.matches(':disabled')) { close(); clearFeedback(); }
  }
  function observeContext() {
    observer.disconnect();
    observer.observe(control, { attributes: true, attributeFilter: ['disabled', 'required', 'name'] });
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'FIELDSET') observer.observe(parent, { attributes: true, attributeFilter: ['disabled'] });
    }
    if (form !== control.form) {
      form?.removeEventListener('reset', onReset);
      form = control.form;
      form?.addEventListener('reset', onReset);
    }
  }
  function position() {
    const r = trigger.getBoundingClientRect();
    const spaceBelow = view.innerHeight - r.bottom;
    const spaceAbove = r.top;
    const needed = Math.min(240, popup.scrollHeight || 180);
    const placeAbove = spaceBelow < needed && spaceAbove > spaceBelow;
    popup.style.position = 'fixed';
    popup.style.left = `${Math.max(8, Math.min(r.left, view.innerWidth - r.width - 8))}px`;
    popup.style.width = `${r.width}px`;
    popup.style.top = placeAbove ? 'auto' : `${r.bottom + 4}px`;
    popup.style.bottom = placeAbove ? `${view.innerHeight - r.top + 4}px` : 'auto';
    popup.dataset.placement = placeAbove ? 'top' : 'bottom';
  }
  function openPopup(focusLast = false) {
    if (open || control.matches(':disabled')) return;
    open = true;
    trigger.setAttribute('aria-expanded', 'true');
    popup.showPopover();
    position();
    const options = enabledOptions();
    const current = findOption(control.value);
    const target = (current && !current.disabled) ? current : (focusLast ? options.at(-1) : options[0]);
    target?.focus({ preventScroll: true });
    view.addEventListener('scroll', onScroll, { capture: true, passive: true });
    view.addEventListener('resize', position);
    element.ownerDocument.addEventListener('pointerdown', onPointer, true);
  }
  function close(focusTrigger = false) {
    if (!open) return;
    open = false;
    trigger.setAttribute('aria-expanded', 'false');
    try { popup.hidePopover(); } catch {}
    view.removeEventListener('scroll', onScroll, true);
    view.removeEventListener('resize', position);
    element.ownerDocument.removeEventListener('pointerdown', onPointer, true);
    if (focusTrigger && trigger.isConnected) trigger.focus({ preventScroll: true });
  }
  function selectItem(node, user = false) {
    if (!node || node.disabled) return;
    const next = node.dataset.suiOption;
    control.value = next;
    syncValue(true);
    close(true);
    if (user && next !== previousValue) {
      const prev = previousValue;
      previousValue = next;
      emit('change', { name: control.name, value: next, previousValue: prev });
    }
  }
  function onScroll(event) {
    if (!event.target || !(event.target instanceof view.Node) || !popup.contains(event.target)) close();
    else position();
  }
  function onPointer(event) {
    if (!event.target || !(event.target instanceof view.Node) || (!element.contains(event.target) && !popup.contains(event.target))) close();
  }
  function onReset(event) {
    queueMicrotask(() => {
      if (!destroyed && !event.defaultPrevented) {
        control.setCustomValidity('');
        syncValue();
        clearFeedback();
        close();
        previousValue = control.value;
      }
    });
  }
  function onInvalid(event) {
    event.preventDefault();
    showFeedback();
    const formEl = control.form;
    if (formEl && !invalidBatches.has(formEl)) {
      invalidBatches.add(formEl);
      queueMicrotask(() => {
        invalidBatches.delete(formEl);
        const firstInvalid = formEl.querySelector(':invalid');
        if (firstInvalid === control) trigger.focus();
      });
    }
  }
  function onTriggerKey(event) {
    if (control.matches(':disabled')) return;
    if (event.key === 'ArrowDown' || (event.altKey && event.key === 'ArrowDown')) {
      event.preventDefault(); openPopup();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault(); openPopup(true);
    } else if (['Enter', ' '].includes(event.key)) {
      event.preventDefault(); if (open) close(true); else openPopup();
    }
  }
  function onListKey(event) {
    const options = enabledOptions();
    if (!options.length) return;
    const index = options.indexOf(element.ownerDocument.activeElement);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      (options[index + 1] || options[0]).focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      (options[index - 1] || options.at(-1)).focus();
    } else if (event.key === 'Home') {
      event.preventDefault(); options[0].focus();
    } else if (event.key === 'End') {
      event.preventDefault(); options.at(-1).focus();
    } else if (['Enter', ' '].includes(event.key)) {
      event.preventDefault(); selectItem(element.ownerDocument.activeElement, true);
    } else if (event.key === 'Escape') {
      event.preventDefault(); close(true);
    } else if (event.key === 'Tab') {
      if (event.shiftKey) {
        event.preventDefault();
        close();
        const stops = tabStops(element.ownerDocument.body);
        const index = stops.indexOf(trigger);
        const prev = stops[index - 1];
        if (prev) prev.focus();
        else trigger.focus();
      } else {
        close();
      }
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      clearTimeout(searchTimer);
      search += event.key.toLowerCase();
      searchTimer = setTimeout(() => { search = ''; }, 450);
      const match = options.find(node => node.dataset.suiOptionLabel?.toLowerCase().startsWith(search));
      match?.focus();
    }
  }
  function onAction(event) {
    const action = event.target.closest('[data-select-action]');
    if (action) { close(true); emit('action', { key: action.dataset.selectAction }); }
  }

  function onTriggerClick() { if (destroyed) return; if (open) close(true); else openPopup(); }
  function onOptionClick(event) {
    const option = event.target.closest('[data-sui-option]');
    if (option) selectItem(option, true);
  }
  function onPopupToggle(event) {
    if (event.newState === 'closed') close();
  }

  const observer = new view.MutationObserver(syncState);
  trigger.addEventListener('click', onTriggerClick);
  trigger.addEventListener('keydown', onTriggerKey);
  popup.addEventListener('keydown', onListKey);
  popup.addEventListener('click', onOptionClick);
  popup.addEventListener('click', onAction);
  popup.addEventListener('toggle', onPopupToggle);
  function onNativeChange() {
    const next = control.value;
    syncValue(true);
    if (next !== previousValue) {
      const prev = previousValue;
      previousValue = next;
      emit('change', { name: control.name, value: next, previousValue: prev });
    }
  }
  control.addEventListener('invalid', onInvalid);
  control.addEventListener('change', onNativeChange);

  observeContext();
  syncState();
  syncValue();

  const handle = {
    control,
    get value() { return control.value; },
    get disabled() { return control.matches(':disabled'); },
    get required() { return control.required; },
    get destroyed() { return destroyed; },
    setValue(value) {
      ensureActive();
      const stringValue = String(value);
      if (stringValue !== '' && !findOption(stringValue)) throw new TypeError('Select value must match an option');
      control.value = stringValue;
      syncValue(true);
      previousValue = control.value;
    },
    setDisabled(value) {
      ensureActive();
      control.disabled = !!value;
      syncState();
    },
    setRequired(value) {
      ensureActive();
      control.required = !!value;
      syncState();
    },
    setCustomValidity(message) {
      ensureActive();
      control.setCustomValidity(String(message));
      if (message) showFeedback(); else clearFeedback();
    },
    checkValidity() { ensureActive(); return control.checkValidity(); },
    reportValidity() { ensureActive(); return control.reportValidity(); },
    open: openPopup,
    close,
    refresh() {
      ensureActive();
      observeContext();
      syncState();
      syncValue();
      return handle;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      close();
      observer.disconnect();
      trigger.removeEventListener('click', onTriggerClick);
      trigger.removeEventListener('keydown', onTriggerKey);
      popup.removeEventListener('keydown', onListKey);
      popup.removeEventListener('click', onOptionClick);
      popup.removeEventListener('click', onAction);
      popup.removeEventListener('toggle', onPopupToggle);
      control.removeEventListener('invalid', onInvalid);
      control.removeEventListener('change', onNativeChange);
      form?.removeEventListener('reset', onReset);
      mounted.delete(element);
    }
  };
  mounted.set(element, handle);
  return handle;
}
