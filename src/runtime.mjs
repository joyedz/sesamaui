import { initInput } from './components/input.mjs';
import { initSelect } from './components/select.mjs';
import { initModal } from './components/modal.mjs';
import { initBanner } from './components/banner.mjs';
import { initAvatar } from './components/avatar.mjs';
import { initScrollArea } from './components/scroll-area.mjs';
import { initCheckbox } from './components/checkbox.mjs';
import { initRadio } from './components/radio.mjs';
import { initSwitch } from './components/switch.mjs';
import { initTextarea } from './components/textarea.mjs';
import { initChip } from './components/chip.mjs';
import { initMenu } from './components/menu.mjs';
import { initPopover } from './components/popover.mjs';
import { initDropdownMenu } from './components/dropdown-menu.mjs';
import { initTooltip } from './components/tooltip.mjs';
import { initToastRegion } from './components/toast.mjs';
import { initButtonGroup } from './components/button-group.mjs';
import { initCommandPalette } from './components/command-palette.mjs';
import { initCombobox } from './components/combobox.mjs';
import { initDatePicker } from './components/date-picker.mjs';
import { initTagInput } from './components/tag-input.mjs';
import { initTabs } from './components/tabs.mjs';
import { initTree } from './components/tree.mjs';
import { initCollapsible } from './components/collapsible.mjs';
import { initTable } from './components/table.mjs';
import { initPagination } from './components/pagination.mjs';
import { initChart } from './components/chart.mjs';
import { initCanvas } from './components/canvas.mjs';
import { initFileCard } from './components/file-card.mjs';
import { initMessage } from './components/message.mjs';
import { initToolCall } from './components/tool-call.mjs';
import { initAgentRun } from './components/agent-run.mjs';
import { initComposer } from './components/composer.mjs';
import { initAppShell } from './blocks/app-shell.mjs';
import { initWorkspaceSidebar } from './blocks/workspace-sidebar.mjs';
import { elementRoot } from './components/shared.mjs';

export const controllerRegistry = new Map([
  ['[data-sui-input-field]', initInput],
  ['[data-sui-select]', initSelect],
  ['dialog[data-sui-modal]', initModal],
  ['[data-sui-banner]', initBanner],
  ['[data-sui-avatar]', initAvatar],
  ['[data-sui-scroll-area]', initScrollArea],
  ['[data-sui-checkbox]', initCheckbox],
  ['[data-sui-radio]', initRadio],
  ['[data-sui-switch]', initSwitch],
  ['[data-sui-textarea-field]', initTextarea],
  ['[data-sui-chip]', initChip],
  ['[data-sui-menu]', initMenu],
  ['[data-sui-popover]', initPopover],
  ['[data-sui-dropdown-menu]', initDropdownMenu],
  ['[data-sui-tooltip]', initTooltip],
  ['[data-sui-toast-region]', initToastRegion],
  ['[data-sui-button-group-wrapper]', initButtonGroup],
  ['dialog[data-sui-command-palette]', initCommandPalette],
  ['[data-sui-combobox]', initCombobox],
  ['[data-sui-date-picker]', initDatePicker],
  ['[data-sui-tag-input]', initTagInput],
  ['[data-sui-tabs]', initTabs],
  ['[data-sui-tree]', initTree],
  ['[data-sui-collapsible]', initCollapsible],
  ['[data-sui-table]', initTable],
  ['[data-sui-pagination]', initPagination],
  ['[data-sui-chart]', initChart],
  ['[data-sui-canvas]', initCanvas],
  ['[data-sui-file-card]', initFileCard],
  ['[data-sui-message]', initMessage],
  ['[data-sui-tool-call]', initToolCall],
  ['[data-sui-agent-run]', initAgentRun],
  ['[data-sui-composer]', initComposer],
  ['[data-sui-app-shell]', initAppShell],
  ['[data-sui-workspace-sidebar]', initWorkspaceSidebar],
]);

export function registerController(selector, init) {
  if (typeof selector !== 'string' || typeof init !== 'function') {
    throw new TypeError('Invalid controller registration');
  }
  controllerRegistry.set(selector, init);
}

const sessions = new WeakMap();
const controllers = new WeakMap();

export function mount(root) {
  if (!root?.querySelectorAll) throw new TypeError('mount requires a DOM root');
  if (sessions.has(root)) return sessions.get(root);
  const owned = new Map();
  let destroyed = false;
  function release(element, record) {
    record.owners.delete(session);
    if (!record.owners.size) {
      record.handle.destroy();
      controllers.delete(element);
    }
    owned.delete(element);
  }
  const session = {
    refresh() {
      if (destroyed) throw new Error('Mount session has been destroyed');
      for (const [element, record] of owned) {
        if (!root.contains(element) && element !== root) release(element, record);
      }
      for (const [selector, init] of controllerRegistry) {
        for (const element of elementRoot(root, selector)) {
          const alreadyOwned = owned.has(element);
          let record = controllers.get(element);
          if (!record) {
            record = { handle: init(element), owners: new Set() };
            controllers.set(element, record);
          } else if (record.handle.destroyed) {
            record.handle = init(element);
          }
          record.owners.add(session);
          owned.set(element, record);
          if (alreadyOwned) record.handle.refresh?.();
        }
      }
      return session;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      for (const [element, record] of owned) release(element, record);
      sessions.delete(root);
    }
  };
  sessions.set(root, session);
  return session.refresh();
}
