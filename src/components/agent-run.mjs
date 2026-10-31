import { escapeHTML, uid } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { toolCall, initToolCall } from './tool-call.mjs';

const RUN_STATES = {
  queued: 'Queued',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled'
};

function runStateIcon(state) {
  if (state === 'running') {
    return '<span class="sx-loader" style="--loader-size:14px" aria-hidden="true"></span>';
  }
  if (state === 'failed') return controlIcon('circle-x', 14);
  if (state === 'completed') return controlIcon('circle-check', 14);
  if (state === 'cancelled') return controlIcon('circle-stop', 14);
  return controlIcon('clock', 14);
}

function renderStep(step, fallbackState = 'completed') {
  if (!step) return '';
  if (step.type === 'tool') {
    return toolCall(step);
  }
  if (step.type === 'thinking') {
    const state = step.state || 'completed';
    const stateLabel = RUN_STATES[state] || state;
    const icon = state === 'running'
      ? '<span class="sx-loader" style="--loader-size:14px" aria-hidden="true"></span>'
      : controlIcon('sparkles', 14);
    const open = Boolean(step.open);
    const detail = step.detail || step.description || 'Preparing a response based on the request and available context.';
    return `<details class="sx-thinking-step" ${open ? 'open' : ''}><summary>${icon}<span>${escapeHTML(step.title || 'Thinking')}</span><span class="sx-run-meta">${escapeHTML(stateLabel)}</span>${controlIcon('chevron-down', 12)}</summary><div class="sx-thinking-detail">${escapeHTML(detail)}</div></details>`;
  }
  // Progress or default step
  const state = step.state || fallbackState;
  return `<div class="sx-run-step">${runStateIcon(state)}<span>${escapeHTML(step.title || '')}</span></div>`;
}

/**
 * Render an Agent Run component.
 * @param {Object} options
 * @returns {string} HTML string
 */
export function agentRun(options = {}) {
  const id = options.id || uid('run');
  const title = options.title || 'Agent run';
  const state = options.state || 'completed';
  const duration = options.duration || '';
  const open = Boolean(options.open);
  const steps = Array.isArray(options.steps) ? options.steps : [];
  const classes = ['sx-agent-run', options.classes].filter(Boolean).join(' ');

  const stateLabel = RUN_STATES[state] || RUN_STATES.completed;

  let stepsHTML = '';
  if (steps.length > 0) {
    stepsHTML = steps.map(s => renderStep(s, state)).join('');
  } else {
    stepsHTML = '<span class="sx-help">No steps recorded.</span>';
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

  return `<details class="${classes}" data-sui-agent-run id="${escapeHTML(id)}" data-run-id="${escapeHTML(id)}" data-state="${escapeHTML(state)}" ${open ? 'open' : ''} ${extraAttrs.join(' ')}><summary><span>${escapeHTML(title)}</span><span class="sx-run-meta">${escapeHTML(stateLabel)}${duration ? ' · ' + escapeHTML(duration) : ''}</span>${controlIcon('chevron-down', 12)}</summary><div class="sx-run-steps">${stepsHTML}</div></details>`;
}

const instances = new WeakMap();

/**
 * Initialize Agent Run controller.
 * @param {HTMLElement} element
 * @returns {Object} Controller instance
 */
export function initAgentRun(element) {
  if (!element) return null;
  if (instances.has(element)) return instances.get(element);

  const runId = element.dataset.runId || element.id || '';
  const runTitle = element.querySelector(':scope > summary > span:first-child')?.textContent?.trim() || '';

  const toolControllers = [];
  function initChildTools() {
    toolControllers.forEach(tc => tc.destroy());
    toolControllers.length = 0;
    element.querySelectorAll('[data-sui-tool-call]').forEach(tcEl => {
      const tc = initToolCall(tcEl);
      if (tc) toolControllers.push(tc);
    });
  }
  initChildTools();

  function handleToggle(e) {
    if (e.target !== element) return;
    element.dispatchEvent(new CustomEvent('sui:run:toggle', {
      bubbles: true,
      detail: { id: runId, title: runTitle, open: element.open }
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
    setState(state, duration = '') {
      element.dataset.state = state;
      const metaEl = element.querySelector(':scope > summary > .sx-run-meta');
      if (metaEl) {
        const stateLabel = RUN_STATES[state] || state;
        metaEl.textContent = `${stateLabel}${duration ? ' · ' + duration : ''}`;
      }
    },
    setSteps(steps = []) {
      const stepsContainer = element.querySelector('.sx-run-steps');
      if (stepsContainer) {
        if (steps.length > 0) {
          const currentState = element.dataset.state || 'completed';
          stepsContainer.innerHTML = steps.map(s => renderStep(s, currentState)).join('');
        } else {
          stepsContainer.innerHTML = '<span class="sx-help">No steps recorded.</span>';
        }
        initChildTools();
      }
    },
    destroy() {
      element.removeEventListener('toggle', handleToggle);
      toolControllers.forEach(tc => tc.destroy());
      instances.delete(element);
    }
  };

  instances.set(element, controller);
  return controller;
}
