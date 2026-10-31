import { escapeHTML, uid } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

const RUN_STATES = {
  queued: 'Queued',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled'
};

/**
 * Render a Tool Call component.
 * @param {Object} options
 * @returns {string} HTML string
 */
export function toolCall(options = {}) {
  const id = options.id || uid('tool');
  const name = options.name || 'Tool call';
  const state = options.state || 'completed';
  const iconName = options.icon || options.iconName || 'code';
  const duration = options.duration || '';
  const input = options.input ?? '';
  const output = options.output ?? '';
  const error = options.error ?? '';
  const open = Boolean(options.open || options.expanded);
  const classes = ['sx-tool-call', options.classes].filter(Boolean).join(' ');

  const stateLabel = RUN_STATES[state] || RUN_STATES.completed;

  let bodyHTML = '';
  if (input) {
    const formattedInput = typeof input === 'object' ? JSON.stringify(input, null, 2) : String(input);
    bodyHTML += `<div><strong>Input</strong><pre>${escapeHTML(formattedInput)}</pre></div>`;
  }
  if (output) {
    const formattedOutput = typeof output === 'object' ? JSON.stringify(output, null, 2) : String(output);
    bodyHTML += `<div><strong>${state === 'failed' ? 'Error' : 'Output'}</strong><pre>${escapeHTML(formattedOutput)}</pre></div>`;
  } else if (error) {
    bodyHTML += `<div><strong>Error</strong><pre class="sx-tool-error">${escapeHTML(error)}</pre></div>`;
  } else if (!input) {
    bodyHTML = `<span class="sx-help">No output yet.</span>`;
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

  return `<details class="${classes}" data-sui-tool-call id="${escapeHTML(id)}" data-tool-id="${escapeHTML(id)}" data-state="${escapeHTML(state)}" ${open ? 'open' : ''} ${extraAttrs.join(' ')}><summary>${controlIcon(iconName, 14)}<span class="sx-tool-name">${escapeHTML(name)}</span><span class="sx-run-meta">${escapeHTML(stateLabel)}${duration ? ' · ' + escapeHTML(duration) : ''}</span>${controlIcon('chevron-down', 12)}</summary><div class="sx-tool-body">${bodyHTML}</div></details>`;
}

const instances = new WeakMap();

/**
 * Initialize Tool Call controller.
 * @param {HTMLElement} element
 * @returns {Object} Controller instance
 */
export function initToolCall(element) {
  if (!element) return null;
  if (instances.has(element)) return instances.get(element);

  const toolId = element.dataset.toolId || element.id || '';
  const toolName = element.querySelector('.sx-tool-name')?.textContent?.trim() || '';

  function handleToggle() {
    element.dispatchEvent(new CustomEvent('sui:tool:toggle', {
      bubbles: true,
      detail: { id: toolId, name: toolName, open: element.open }
    }));
  }

  element.addEventListener('toggle', handleToggle);

  const controller = {
    element,
    isOpen() {
      return element.open;
    },
    setOpen(open) {
      element.open = Boolean(open);
    },
    setState(state, details = {}) {
      element.dataset.state = state;
      const metaEl = element.querySelector('.sx-run-meta');
      if (metaEl) {
        const stateLabel = RUN_STATES[state] || state;
        const dur = details.duration || '';
        metaEl.textContent = `${stateLabel}${dur ? ' · ' + dur : ''}`;
      }
      if (details.output !== undefined || details.error !== undefined) {
        const bodyEl = element.querySelector('.sx-tool-body');
        if (bodyEl) {
          const out = details.output !== undefined ? details.output : details.error;
          const label = state === 'failed' ? 'Error' : 'Output';
          const preClass = state === 'failed' ? ' class="sx-tool-error"' : '';
          bodyEl.innerHTML = `<div><strong>${label}</strong><pre${preClass}>${escapeHTML(typeof out === 'object' ? JSON.stringify(out, null, 2) : String(out))}</pre></div>`;
        }
      }
    },
    destroy() {
      element.removeEventListener('toggle', handleToggle);
      instances.delete(element);
    }
  };

  instances.set(element, controller);
  return controller;
}
