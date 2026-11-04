import { initSelect } from '../../src/components/select.mjs';
/** Versioned demo preferences. Storage may be unavailable in private contexts. */
export function readState(key, fallback = {}) {
  try { const value = JSON.parse(localStorage.getItem('sesama:demo:v1:' + key)); return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback; } catch { return fallback; }
}
export function writeState(key, value) {
  try { localStorage.setItem('sesama:demo:v1:' + key, JSON.stringify(value)); } catch { /* The demo remains usable without storage. */ }
}
export function preserveSidebar(category) {
  const state = readState('sidebar:' + category);
  const appearance = readState('appearance');
  if (['light','dark','system'].includes(appearance.theme)) { document.documentElement.dataset.suiTheme = appearance.theme; document.documentElement.dataset.mode = appearance.theme; }
  let applying = false;
  function restore() {
    applying = true;
    document.querySelectorAll('[data-sui-app-shell]').forEach(shell => {
      if (typeof state.collapsed === 'boolean') {
        shell.classList.toggle('is-collapsed', state.collapsed);
        const button = shell.querySelector('[data-shell-toggle]');
        button?.setAttribute('aria-expanded', String(!state.collapsed));
        button?.setAttribute('aria-label', state.collapsed ? 'Show sidebar' : 'Hide sidebar');
      }
      const workspace = shell.querySelector('[data-sui-workspace-sidebar] [name=workspace]');
      if (typeof state.workspace === 'string' && workspace && workspace.value !== state.workspace && [...workspace.options].some(option => option.value === state.workspace)) initSelect(workspace.closest('[data-sui-select]')).setValue(state.workspace);
      shell.querySelectorAll('[data-sui-workspace-sidebar] [data-fold]').forEach(button => {
        const expanded = state.branches?.[button.dataset.treeKey];
        if (typeof expanded !== 'boolean') return;
        button.setAttribute('aria-expanded', String(expanded));
        const row = button.closest('.sx-tree-action-row') || button;
        row.nextElementSibling?.toggleAttribute('data-open', expanded);
      });
    });
    applying = false;
  }
  document.addEventListener('sui:shell:toggle', event => {
    if (applying) return;
    state.collapsed = event.detail.collapsed; writeState('sidebar:' + category, state);
  });
  document.addEventListener('sui:tree:toggle', event => {
    if (!event.target.closest('[data-sui-workspace-sidebar]')) return;
    state.branches = { ...state.branches, [event.detail.id]: event.detail.expanded };
    writeState('sidebar:' + category, state);
  });
  document.addEventListener('sui:shell:theme', event => writeState('appearance', { theme: event.detail.theme }));
  document.addEventListener('sui:change', event => {
    if (applying || event.detail.name !== 'workspace') return;
    state.workspace = event.detail.value; writeState('sidebar:' + category, state);
  });
  new MutationObserver(restore).observe(document.body, { childList: true, subtree: true });
  restore();
}

