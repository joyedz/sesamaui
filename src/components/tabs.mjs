import { escapeHTML, uid as uniqueId } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

const VALID_VARIANTS = new Set(['segmented', 'pill', 'line']);

/**
 * Pure functional builder for Tabs.
 *
 * @param {object} [options]
 * @returns {string} HTML string
 */
export function tabs(options = {}) {
  const {
    id = uniqueId('sui-tabs'),
    ariaLabel = 'Tabs',
    variant = 'segmented',
    tabs: rawTabs = [],
    activeTabId: userActiveTabId,
    attributes = '',
  } = options;

  const validVariant = VALID_VARIANTS.has(variant) ? variant : 'segmented';
  const tabList = Array.isArray(rawTabs) ? rawTabs : [];

  const normalizedTabs = tabList.map((t, idx) => {
    if (typeof t === 'string') {
      return { id: `tab-${idx}`, label: t, icon: '', disabled: false, content: '' };
    }
    return {
      id: t.id ? String(t.id) : `tab-${idx}`,
      label: t.label || '',
      icon: t.icon || '',
      disabled: Boolean(t.disabled),
      content: t.content || '',
    };
  });

  const firstEnabled = normalizedTabs.find(t => !t.disabled);
  const activeId = userActiveTabId !== undefined
    ? String(userActiveTabId)
    : (firstEnabled ? firstEnabled.id : (normalizedTabs[0]?.id || ''));

  const tablistClass = validVariant === 'segmented' ? 'seg' : validVariant === 'pill' ? 'pill' : 'line';

  const buttonsHtml = normalizedTabs.map(t => {
    const isSelected = t.id === activeId;
    const tabBtnId = `${id}-tab-${t.id}`;
    const panelId = `${id}-panel-${t.id}`;
    const iconHtml = t.icon ? `<span class="sx-tab-icon" aria-hidden="true">${controlIcon(t.icon, 14)}</span>` : '';
    const disabledAttr = t.disabled ? ' disabled aria-disabled="true"' : '';
    const selectedClass = isSelected ? ' on' : '';

    return `<button type="button" role="tab" id="${escapeHTML(tabBtnId)}" class="sx-tab${selectedClass}" aria-controls="${escapeHTML(panelId)}" aria-selected="${isSelected ? 'true' : 'false'}" tabindex="${isSelected ? '0' : '-1'}" data-tab-id="${escapeHTML(t.id)}"${disabledAttr}>${iconHtml}<span class="sx-tab-label">${escapeHTML(t.label)}</span></button>`;
  }).join('');

  const panelsHtml = normalizedTabs.map(t => {
    const isSelected = t.id === activeId;
    const tabBtnId = `${id}-tab-${t.id}`;
    const panelId = `${id}-panel-${t.id}`;
    const hiddenAttr = isSelected ? '' : ' hidden';

    return `<div role="tabpanel" id="${escapeHTML(panelId)}" aria-labelledby="${escapeHTML(tabBtnId)}" tabindex="0" class="sx-tabpanel" data-panel-id="${escapeHTML(t.id)}"${hiddenAttr}>${t.content}</div>`;
  }).join('');

  return `<div class="sx-tabs sx-tabs-${validVariant}" data-sui-tabs data-variant="${validVariant}" id="${escapeHTML(id)}"${attributes ? ` ${attributes}` : ''}><div class="sx-tablist ${tablistClass}" role="tablist" aria-label="${escapeHTML(ariaLabel)}">${buttonsHtml}</div><div class="sx-tabpanels">${panelsHtml}</div></div>`;
}

const mounted = new WeakMap();

/**
 * Controller for Tabs.
 *
 * @param {HTMLElement} element
 * @returns {object} Tabs controller
 */
export function initTabs(element) {
  if (mounted.has(element)) return mounted.get(element);

  const view = element.ownerDocument?.defaultView || globalThis;
  const tablist = element.querySelector('[role="tablist"]');
  if (!tablist) {
    throw new TypeError('Tabs markup is incomplete: missing tablist');
  }

  const getTabs = () => [...tablist.querySelectorAll('[role="tab"]')];
  const getEnabledTabs = () => getTabs().filter(t => !t.disabled && t.getAttribute('aria-disabled') !== 'true');
  const getPanels = () => [...element.querySelectorAll(':scope > .sx-tabpanels > [role="tabpanel"], [role="tabpanel"]')];

  let currentActiveId = element.querySelector('[role="tab"][aria-selected="true"]')?.dataset.tabId || '';
  let destroyed = false;

  function activateTab(tabEl, shouldFocus = false) {
    if (destroyed || !tabEl || tabEl.disabled || tabEl.getAttribute('aria-disabled') === 'true') return;

    const previousId = currentActiveId;
    const newId = tabEl.dataset.tabId;
    if (newId === previousId) return;

    currentActiveId = newId;

    const allTabs = getTabs();
    for (const t of allTabs) {
      const isSelected = t === tabEl;
      t.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      t.tabIndex = isSelected ? 0 : -1;
      t.classList.toggle('on', isSelected);
    }

    const allPanels = getPanels();
    for (const p of allPanels) {
      const isMatching = p.dataset.panelId === newId || p.getAttribute('aria-labelledby') === tabEl.id;
      p.hidden = !isMatching;
    }

    if (shouldFocus) {
      tabEl.focus();
    }

    element.dispatchEvent(new view.CustomEvent('sui:tab:change', {
      bubbles: true,
      detail: { id: newId, previousId },
    }));
  }

  function onTabClick(event) {
    const tabEl = event.target.closest('[role="tab"]');
    if (!tabEl || !tablist.contains(tabEl)) return;
    activateTab(tabEl, false);
  }

  function onTabKeyDown(event) {
    const tabEl = event.target.closest('[role="tab"]');
    if (!tabEl || !tablist.contains(tabEl)) return;

    const enabled = getEnabledTabs();
    if (!enabled.length) return;

    const idx = enabled.indexOf(tabEl);
    if (idx === -1) return;

    let targetIdx = -1;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        targetIdx = (idx + 1) % enabled.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        targetIdx = (idx - 1 + enabled.length) % enabled.length;
        break;
      case 'Home':
        event.preventDefault();
        targetIdx = 0;
        break;
      case 'End':
        event.preventDefault();
        targetIdx = enabled.length - 1;
        break;
      default:
        return;
    }

    if (targetIdx >= 0 && enabled[targetIdx]) {
      activateTab(enabled[targetIdx], true);
    }
  }

  tablist.addEventListener('click', onTabClick);
  tablist.addEventListener('keydown', onTabKeyDown);

  const controller = {
    setActiveTab(id) {
      const tabEl = getTabs().find(t => t.dataset.tabId === String(id));
      if (tabEl) {
        activateTab(tabEl, false);
      }
    },
    getActiveTab() {
      return currentActiveId;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      tablist.removeEventListener('click', onTabClick);
      tablist.removeEventListener('keydown', onTabKeyDown);
      mounted.delete(element);
    },
  };

  mounted.set(element, controller);
  return controller;
}
