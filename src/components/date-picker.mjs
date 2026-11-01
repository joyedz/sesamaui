import { uid, escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { positionOverlay, createDismissManager } from './overlay-helpers.mjs';

function localISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseISO(str) {
  if (!str || typeof str !== 'string') return null;
  const parts = str.trim().split('-');
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return new Date(y, m, d);
}

/**
 * Pure builder for Date Picker control.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function datePicker(options = {}) {
  const {
    id = uid(),
    name = 'date',
    label = 'Date',
    value = '',
    mode = 'single',
    min = '',
    max = '',
    placeholder = '',
    disabled = false,
    required = false,
    invalid = false,
    helper = '',
    error = '',
    size = 'base',
    attributes = '',
  } = options;

  if (size && !['sm', 'base', 'lg'].includes(size)) {
    throw new TypeError('Invalid date picker size');
  }

  const isRange = mode === 'range';
  const defaultPlaceholder = isRange ? 'Choose date range' : 'Choose date';
  const displayPlaceholder = placeholder || defaultPlaceholder;
  const displayValue = value || displayPlaceholder;
  const isInvalid = Boolean(invalid || error);

  const clearBtn = `<button type="button" class="ibtn" data-date-clear aria-label="Clear ${isRange ? 'date range' : 'date'}" ${value && !disabled ? '' : 'hidden'}>${controlIcon('x', 14)}</button>`;

  return `<div class="form-field sx-date-picker" data-sui-date-picker data-date-mode="${escapeHTML(mode)}" data-name="${escapeHTML(name)}" data-value="${escapeHTML(value)}" data-min="${escapeHTML(min)}" data-max="${escapeHTML(max)}"${attributes ? ` ${attributes}` : ''}>${label ? `<label class="form-label" for="${escapeHTML(id)}">${escapeHTML(label)}</label>` : ''}<div class="field sx-date-field sx-size-${size} ${isInvalid ? 'invalid' : ''}"><button id="${escapeHTML(id)}" type="button" class="sx-date-trigger" data-date-trigger popovertarget="${escapeHTML(id)}-calendar" aria-haspopup="dialog" aria-expanded="false" aria-label="${escapeHTML(label || defaultPlaceholder)}" ${disabled ? 'disabled' : ''} ${isInvalid ? 'aria-invalid="true"' : ''}><span data-date-display class="${value ? '' : 'sx-muted'}">${escapeHTML(displayValue)}</span></button>${clearBtn}</div><input data-sui-date-hidden type="text" class="sui-sr-only" tabindex="-1" aria-hidden="true" name="${escapeHTML(name)}" value="${escapeHTML(value)}" ${required ? 'required' : ''}><div id="${escapeHTML(id)}-calendar" class="sx-popup sx-calendar" popover="manual" data-sx-popup role="dialog" aria-label="${escapeHTML(label || 'Calendar')}"><div data-calendar-content></div></div><span id="${escapeHTML(id)}-status" class="${isInvalid ? 'form-error' : 'sx-help'}" role="status" data-date-status>${escapeHTML(error || helper || '')}</span></div>`;
}

const mounted = new WeakMap();

/**
 * Controller for Date Picker.
 *
 * @param {HTMLElement} element
 * @returns {object} Date Picker controller
 */
export function initDatePicker(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  const trigger = element.querySelector('[data-date-trigger]');
  const hiddenInput = element.querySelector('[data-sui-date-hidden]');
  const calendarPopup = element.querySelector('[data-sx-popup], .sx-calendar');
  const calendarContent = element.querySelector('[data-calendar-content]');
  const displaySpan = element.querySelector('[data-date-display]');
  const clearBtn = element.querySelector('[data-date-clear]');

  if (!trigger || !calendarPopup || !calendarContent) {
    throw new TypeError('Date Picker markup is incomplete');
  }

  const isRange = element.dataset.dateMode === 'range';
  let currentValue = element.dataset.value || (hiddenInput ? hiddenInput.value : '');
  let initialValue = currentValue;

  let rangeStart = '';
  let rangeEnd = '';
  if (isRange && currentValue) {
    const parts = currentValue.split('–').map(s => s.trim());
    rangeStart = parts[0] || '';
    rangeEnd = parts[1] || '';
  }

  let min = element.dataset.min || '';
  let max = element.dataset.max || '';

  const initialDate = parseISO(isRange ? rangeStart : currentValue) || new Date();
  let viewYear = initialDate.getFullYear();
  let viewMonth = initialDate.getMonth();
  let isOpen = false;
  let destroyed = false;

  const dismissManager = createDismissManager({
    popup: calendarPopup,
    trigger,
    onDismiss: () => {
      close();
    },
    onReposition: () => {
      if (isOpen) positionOverlay(trigger, calendarPopup, 'bottom');
    },
  });

  function renderCalendar(focusISO = null) {
    const today = localISO(new Date());
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const viewDate = new Date(viewYear, viewMonth, 1);
    const heading = viewDate.toLocaleDateString('en', { month: 'long', year: 'numeric' });

    const cells = Array.from({ length: firstDay }, () => '<span role="gridcell" aria-disabled="true"></span>');

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day);
      const iso = localISO(d);
      const isSelected = isRange
        ? (iso === rangeStart || iso === rangeEnd)
        : (iso === currentValue);
      const isInRange = isRange && rangeStart && rangeEnd && (iso > rangeStart && iso < rangeEnd);
      const isCurrentDate = iso === today;
      const isDisabled = (min && iso < min) || (max && iso > max);
      const isFocused = iso === (focusISO || (isRange ? rangeStart : currentValue) || today);

      cells.push(`<button type="button" role="gridcell" data-date-value="${iso}" aria-label="${d.toLocaleDateString('en', { dateStyle: 'full' })}" aria-selected="${isSelected}" ${isInRange ? 'data-in-range' : ''} ${isCurrentDate ? 'aria-current="date"' : ''} ${isDisabled ? 'disabled' : ''} tabindex="${isFocused ? 0 : -1}">${day}</button>`);
    }

    while (cells.length % 7) {
      cells.push('<span role="gridcell" aria-disabled="true"></span>');
    }

    const rows = [];
    for (let i = 0; i < cells.length; i += 7) {
      rows.push(`<div role="row">${cells.slice(i, i + 7).join('')}</div>`);
    }

    calendarContent.innerHTML = `<div class="sx-calendar-header"><button type="button" class="btn ghost" data-month-step="-1" aria-label="Previous month">${controlIcon('chevron-left', 16)}</button><strong aria-live="polite">${heading}</strong><button type="button" class="btn ghost" data-month-step="1" aria-label="Next month">${controlIcon('chevron-right', 16)}</button></div><div class="sx-calendar-grid" role="grid" aria-label="${heading}"><div role="row">${['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => `<span class="sx-weekday" role="columnheader">${w}</span>`).join('')}</div>${rows.join('')}</div>`;

    let focusTarget = calendarContent.querySelector(`[data-date-value="${focusISO || (isRange ? rangeStart : currentValue) || today}"]:not(:disabled)`);
    if (!focusTarget) focusTarget = calendarContent.querySelector('[data-date-value]:not(:disabled)');
    if (focusTarget) focusTarget.tabIndex = 0;
  }

  function updateDisplay() {
    const defaultPlaceholder = isRange ? 'Choose date range' : 'Choose date';
    const text = isRange
      ? (rangeStart ? `${rangeStart} – ${rangeEnd || 'Choose end date'}` : '')
      : currentValue;

    if (displaySpan) {
      displaySpan.textContent = text || defaultPlaceholder;
      displaySpan.classList.toggle('sx-muted', !text);
    }
    if (clearBtn) {
      clearBtn.hidden = !text;
    }
    if (hiddenInput) {
      hiddenInput.value = isRange ? (rangeStart && rangeEnd ? `${rangeStart} – ${rangeEnd}` : '') : currentValue;
    }
    element.dataset.value = hiddenInput ? hiddenInput.value : '';
  }

  function open() {
    if (destroyed || trigger.disabled) return;
    renderCalendar();
    if (!isOpen) {
      isOpen = true;
      try { calendarPopup.showPopover(); } catch {}
      trigger.setAttribute('aria-expanded', 'true');
      positionOverlay(trigger, calendarPopup, 'bottom');
      dismissManager.bind();

      const focusTarget = calendarContent.querySelector('[tabindex="0"]');
      focusTarget?.focus();
    }
  }

  function close() {
    if (destroyed || !isOpen) return;
    isOpen = false;
    try { calendarPopup.hidePopover(); } catch {}
    trigger.setAttribute('aria-expanded', 'false');
    dismissManager.unbind();
    if (trigger.isConnected) trigger.focus();
  }

  function selectDate(iso) {
    if (isRange) {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        rangeStart = iso;
        rangeEnd = '';
        renderCalendar(iso);
        updateDisplay();
      } else {
        if (iso < rangeStart) {
          rangeEnd = rangeStart;
          rangeStart = iso;
        } else {
          rangeEnd = iso;
        }
        updateDisplay();
        renderCalendar(rangeEnd);
        close();

        element.dispatchEvent(new view.CustomEvent('sui:change', {
          bubbles: true,
          detail: {
            name: element.dataset.name,
            value: `${rangeStart} – ${rangeEnd}`,
            rangeStart,
            rangeEnd,
          },
        }));
      }
    } else {
      currentValue = iso;
      updateDisplay();
      close();

      element.dispatchEvent(new view.CustomEvent('sui:change', {
        bubbles: true,
        detail: { name: element.dataset.name, value: iso },
      }));
    }
  }

  function clear() {
    currentValue = '';
    rangeStart = '';
    rangeEnd = '';
    updateDisplay();
    close();

    element.dispatchEvent(new view.CustomEvent('sui:change', {
      bubbles: true,
      detail: { name: element.dataset.name, value: '' },
    }));
  }

  function onTriggerClick(event) {
    if (destroyed) return;
    event.preventDefault();
    if (isOpen) close();
    else open();
  }

  function onCalendarClick(event) {
    if (destroyed) return;
    const stepBtn = event.target.closest('[data-month-step]');
    if (stepBtn) {
      event.preventDefault();
      const step = parseInt(stepBtn.dataset.monthStep, 10);
      viewMonth += step;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear -= 1;
      } else if (viewMonth > 11) {
        viewMonth = 0;
        viewYear += 1;
      }
      renderCalendar();
      return;
    }

    const dayBtn = event.target.closest('[data-date-value]:not(:disabled)');
    if (dayBtn) {
      event.preventDefault();
      selectDate(dayBtn.dataset.dateValue);
    }
  }

  function onClearClick(event) {
    if (destroyed) return;
    event.preventDefault();
    clear();
  }

  function onCalendarKeyDown(event) {
    if (destroyed) return;
    const dayBtn = event.target.closest('[data-date-value]');
    if (!dayBtn) return;

    const currentIso = dayBtn.dataset.dateValue;
    const curDate = parseISO(currentIso);
    if (!curDate) return;

    let targetDate = null;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      targetDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      targetDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      targetDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - 7);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      targetDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 7);
    } else if (event.key === 'PageUp') {
      event.preventDefault();
      targetDate = new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate());
    } else if (event.key === 'PageDown') {
      event.preventDefault();
      targetDate = new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate());
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectDate(currentIso);
      return;
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (targetDate) {
      const nextIso = localISO(targetDate);
      if (targetDate.getMonth() !== viewMonth || targetDate.getFullYear() !== viewYear) {
        viewYear = targetDate.getFullYear();
        viewMonth = targetDate.getMonth();
        renderCalendar(nextIso);
      }
      const nextBtn = calendarContent.querySelector(`[data-date-value="${nextIso}"]:not(:disabled)`);
      if (nextBtn) {
        calendarContent.querySelectorAll('[data-date-value]').forEach(b => { b.tabIndex = -1; });
        nextBtn.tabIndex = 0;
        nextBtn.focus();
      }
    }
  }

  function onReset() {
    currentValue = initialValue;
    if (isRange && currentValue) {
      const parts = currentValue.split('–').map(s => s.trim());
      rangeStart = parts[0] || '';
      rangeEnd = parts[1] || '';
    } else {
      rangeStart = '';
      rangeEnd = '';
    }
    updateDisplay();
    close();
  }

  trigger.addEventListener('click', onTriggerClick);
  calendarPopup.addEventListener('click', onCalendarClick);
  calendarPopup.addEventListener('keydown', onCalendarKeyDown);
  clearBtn?.addEventListener('click', onClearClick);

  const form = hiddenInput?.form || trigger.form || element.closest?.('form');
  form?.addEventListener?.('reset', onReset);

  const controller = {
    open,
    close,
    setValue(val, silent = false) {
      const prev = currentValue;
      currentValue = val || '';
      if (isRange && currentValue) {
        const parts = currentValue.split('–').map(s => s.trim());
        rangeStart = parts[0] || '';
        rangeEnd = parts[1] || '';
      } else {
        rangeStart = '';
        rangeEnd = '';
      }
      updateDisplay();

      if (!silent && currentValue !== prev) {
        element.dispatchEvent(new view.CustomEvent('sui:change', {
          bubbles: true,
          detail: { name: element.dataset.name, value: currentValue },
        }));
      }
    },
    getValue: () => (hiddenInput ? hiddenInput.value : currentValue),
    clear,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      close();
      trigger.removeEventListener('click', onTriggerClick);
      calendarPopup.removeEventListener('click', onCalendarClick);
      calendarPopup.removeEventListener('keydown', onCalendarKeyDown);
      clearBtn?.removeEventListener('click', onClearClick);
      form?.removeEventListener('reset', onReset);
      dismissManager.unbind();
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
