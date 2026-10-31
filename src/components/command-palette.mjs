import { uid, escapeHTML } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

function normalizeCommand(cmd, idx) {
  if (typeof cmd === 'string') {
    return { id: `cmd-${idx}`, label: cmd, name: cmd, group: 'Commands' };
  }
  const label = cmd.label || cmd.name || `Command ${idx + 1}`;
  return {
    id: cmd.id || `cmd-${idx}`,
    label,
    name: label,
    icon: cmd.icon || null,
    shortcut: cmd.shortcut || null,
    group: cmd.group || 'Commands',
    action: cmd.action || label,
    disabled: Boolean(cmd.disabled),
  };
}

/**
 * Pure builder for Command Palette dialog.
 *
 * @param {object} [options]
 * @returns {string} HTML markup
 */
export function commandPalette(options = {}) {
  const {
    id = uid(),
    title = 'Commands',
    placeholder = 'Search commands…',
    value = '',
    commands = [],
    groups = null,
    emptyText = 'No commands found.',
    attributes = '',
  } = options;

  let allCommands = [];
  if (groups && Array.isArray(groups)) {
    for (const group of groups) {
      for (const item of (group.commands || group.items || [])) {
        allCommands.push({
          ...normalizeCommand(item, allCommands.length),
          group: group.label || group.name || 'Commands',
        });
      }
    }
  } else if (Array.isArray(commands)) {
    allCommands = commands.map(normalizeCommand);
  }

  function renderList(cmdList) {
    if (cmdList.length === 0) {
      return `<p role="status" class="sx-command-empty">${escapeHTML(emptyText)}</p>`;
    }
    const groupNames = [...new Set(cmdList.map(c => c.group))];
    return groupNames.map(group => {
      const items = cmdList.filter(c => c.group === group);
      const itemsMarkup = items.map((c, i) => {
        const optionId = `${escapeHTML(id)}-${escapeHTML(c.id || i)}`;
        const iconSlot = c.icon ? controlIcon(c.icon, 16) : '';
        const shortcutSlot = c.shortcut ? `<kbd>${escapeHTML(c.shortcut)}</kbd>` : '';
        const disabledAttr = c.disabled ? ' aria-disabled="true"' : '';
        return `<div role="option" id="${optionId}" class="sx-menu-item" aria-selected="false"${disabledAttr} data-sui-command-id="${escapeHTML(c.id)}" data-command-action="${escapeHTML(c.action)}">${iconSlot}<span>${escapeHTML(c.label)}</span>${shortcutSlot}</div>`;
      }).join('');
      return `<div role="group" aria-label="${escapeHTML(group)}"><div class="sx-menu-label">${escapeHTML(group)}</div>${itemsMarkup}</div>`;
    }).join('');
  }

  const initialResults = renderList(allCommands.filter(c => !value || c.label.toLowerCase().includes(value.toLowerCase())));
  const commandsJson = escapeHTML(JSON.stringify(allCommands));

  return `<dialog id="${escapeHTML(id)}" class="ds-modal sx-command" data-sui-command-palette data-command data-empty-text="${escapeHTML(emptyText)}" data-sui-commands="${commandsJson}" aria-labelledby="${escapeHTML(id)}-title"${attributes ? ` ${attributes}` : ''}><h2 id="${escapeHTML(id)}-title">${escapeHTML(title)}</h2><div class="field"><input role="combobox" aria-label="${escapeHTML(placeholder)}" aria-controls="${escapeHTML(id)}-results" aria-expanded="true" aria-autocomplete="list" autofocus data-command-search data-sui-command-input placeholder="${escapeHTML(placeholder)}" value="${escapeHTML(value)}"></div><div id="${escapeHTML(id)}-results" class="sx-command-results" role="listbox" aria-label="${escapeHTML(title)}" data-sui-command-results>${initialResults}</div><p class="sx-help">↑ ↓ to navigate · Enter to run · Escape to close</p><div class="actions"><button type="button" class="btn secondary" data-command-close data-sui-command-close>Close</button></div></dialog>`;
}

const mounted = new WeakMap();

/**
 * Controller for Command Palette dialog.
 * Handles search filtering, keyboard navigation, activation, and focus restoration.
 *
 * @param {HTMLDialogElement} dialog
 * @returns {object} Command Palette controller
 */
export function initCommandPalette(dialog) {
  if (mounted.has(dialog)) return mounted.get(dialog);

  const view = dialog.ownerDocument?.defaultView || globalThis;
  const input = dialog.querySelector('[data-sui-command-input], [data-command-search], input');
  const resultsContainer = dialog.querySelector('[data-sui-command-results], [role="listbox"]');
  const emptyText = dialog.dataset.emptyText || 'No commands found.';

  let rawCommands = [];
  try {
    rawCommands = JSON.parse(dialog.dataset.suiCommands || '[]');
  } catch {
    rawCommands = [];
  }

  let previousTrigger = null;
  let destroyed = false;
  let activeIndex = -1;

  const getVisibleOptions = () => [...resultsContainer.querySelectorAll('[role="option"]')];
  const getEnabledOptions = () => getVisibleOptions().filter(el => !el.matches('[aria-disabled="true"]'));

  function updateActiveDescendant(newIndex) {
    const options = getEnabledOptions();
    options.forEach(opt => {
      opt.classList.remove('active');
      opt.setAttribute('aria-selected', 'false');
    });

    if (newIndex >= 0 && newIndex < options.length) {
      activeIndex = newIndex;
      const activeEl = options[activeIndex];
      activeEl.classList.add('active');
      activeEl.setAttribute('aria-selected', 'true');
      input?.setAttribute('aria-activedescendant', activeEl.id);
      activeEl.scrollIntoView({ block: 'nearest' });
    } else {
      activeIndex = -1;
      input?.removeAttribute('aria-activedescendant');
    }
  }

  function filter(query = '') {
    const q = query.trim().toLowerCase();
    const found = rawCommands.filter(c => !q || c.label.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));

    if (found.length === 0) {
      resultsContainer.innerHTML = `<p role="status" class="sx-command-empty">${escapeHTML(emptyText)}</p>`;
      updateActiveDescendant(-1);
      return;
    }

    const groupNames = [...new Set(found.map(c => c.group))];
    resultsContainer.innerHTML = groupNames.map(group => {
      const items = found.filter(c => c.group === group);
      const itemsMarkup = items.map((c, i) => {
        const optionId = `${escapeHTML(dialog.id)}-${escapeHTML(c.id || group.replace(/\s+/g, '-'))}-${i}`;
        const iconSlot = c.icon ? controlIcon(c.icon, 16) : '';
        const shortcutSlot = c.shortcut ? `<kbd>${escapeHTML(c.shortcut)}</kbd>` : '';
        const disabledAttr = c.disabled ? ' aria-disabled="true"' : '';
        return `<div role="option" id="${optionId}" class="sx-menu-item" aria-selected="false"${disabledAttr} data-sui-command-id="${escapeHTML(c.id)}" data-command-action="${escapeHTML(c.action)}">${iconSlot}<span>${escapeHTML(c.label)}</span>${shortcutSlot}</div>`;
      }).join('');
      return `<div role="group" aria-label="${escapeHTML(group)}"><div class="sx-menu-label">${escapeHTML(group)}</div>${itemsMarkup}</div>`;
    }).join('');

    updateActiveDescendant(0);
  }

  function executeOption(optionEl) {
    if (!optionEl || optionEl.matches('[aria-disabled="true"]')) return;
    const cmdId = optionEl.dataset.suiCommandId;
    const action = optionEl.dataset.commandAction;
    const label = optionEl.querySelector('span')?.textContent || optionEl.textContent.trim();
    const command = rawCommands.find(c => c.id === cmdId) || { id: cmdId, label, action };

    dialog.dispatchEvent(new view.CustomEvent('sui:command:select', {
      bubbles: true,
      detail: { id: cmdId, command, action },
    }));

    close();
  }

  function open(trigger = null) {
    if (destroyed) return;
    previousTrigger = trigger || dialog.ownerDocument?.activeElement;
    if (!dialog.open) {
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute('open', '');
      }
    }
    filter(input ? input.value : '');
    input?.focus();
    dialog.dispatchEvent(new view.CustomEvent('sui:command:open', { bubbles: true }));
  }

  function close() {
    if (destroyed) return;
    if (dialog.open) {
      try {
        dialog.close();
      } catch {
        dialog.removeAttribute('open');
      }
    }
    if (previousTrigger && previousTrigger.isConnected && typeof previousTrigger.focus === 'function') {
      previousTrigger.focus({ preventScroll: true });
    }
    dialog.dispatchEvent(new view.CustomEvent('sui:command:close', { bubbles: true }));
  }

  function onInput() {
    filter(input?.value || '');
  }

  function onKeyDown(event) {
    if (destroyed) return;
    const enabled = getEnabledOptions();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (enabled.length > 0) {
        const next = (activeIndex + 1) % enabled.length;
        updateActiveDescendant(next);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (enabled.length > 0) {
        const next = (activeIndex - 1 + enabled.length) % enabled.length;
        updateActiveDescendant(next);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < enabled.length) {
        executeOption(enabled[activeIndex]);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }

  function onClick(event) {
    if (destroyed) return;
    const optionEl = event.target.closest('[role="option"]');
    if (optionEl && resultsContainer.contains(optionEl)) {
      executeOption(optionEl);
      return;
    }
    if (event.target.closest('[data-command-close], [data-sui-command-close]')) {
      close();
    }
  }

  input?.addEventListener('input', onInput);
  dialog.addEventListener('keydown', onKeyDown);
  dialog.addEventListener('click', onClick);

  // Auto-connect any page triggers targeting this dialog
  const doc = dialog.ownerDocument || globalThis.document;
  const onDocClick = event => {
    const trigger = event.target.closest?.(`[data-command-open="${dialog.id}"]`);
    if (trigger) {
      open(trigger);
    }
  };
  doc?.addEventListener('click', onDocClick);

  // Initialize active descendant
  updateActiveDescendant(0);

  const controller = {
    open,
    close,
    filter,
    getVisibleCommands() {
      return getVisibleOptions().map(opt => ({
        id: opt.dataset.suiCommandId,
        action: opt.dataset.commandAction,
        label: opt.querySelector('span')?.textContent || opt.textContent.trim(),
      }));
    },
    getActiveCommand() {
      const enabled = getEnabledOptions();
      if (activeIndex >= 0 && activeIndex < enabled.length) {
        const opt = enabled[activeIndex];
        return {
          id: opt.dataset.suiCommandId,
          action: opt.dataset.commandAction,
          label: opt.querySelector('span')?.textContent || opt.textContent.trim(),
        };
      }
      return null;
    },
    executeActive() {
      const enabled = getEnabledOptions();
      if (activeIndex >= 0 && activeIndex < enabled.length) {
        executeOption(enabled[activeIndex]);
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      input?.removeEventListener('input', onInput);
      dialog.removeEventListener('keydown', onKeyDown);
      dialog.removeEventListener('click', onClick);
      doc?.removeEventListener('click', onDocClick);
      mounted.delete(dialog);
    },
  };

  mounted.set(dialog, controller);
  return controller;
}
