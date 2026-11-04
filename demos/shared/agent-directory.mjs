import { pageHeader, pageLayout, pageGrid, contentSection, avatar, agentCardRecipe, button, iconButton, input, inputField, textarea, tabs, modal, initModal, emptyState, mount, escapeHTML, showToast } from '../../src/index.mjs';

const samples = [
  ['research', 'Research assistant', 'Find sources and turn findings into clear answers.', 'Compare three competitors', 'Summarize a research brief', 'Find evidence for a proposal'],
  ['coding', 'Coding assistant', 'Explore code, investigate issues, and propose changes.', 'Investigate an API error', 'Review a pull request', 'Explain this codebase'],
  ['design', 'Design reviewer', 'Review interfaces for clarity and consistency.', 'Review a dashboard layout', 'Check a form for accessibility', 'Simplify a navigation flow'],
  ['planning', 'Project planner', 'Turn goals into milestones and actionable tasks.', 'Prepare a launch checklist', 'Plan team priorities', 'Break a project into milestones'],
  ['writing', 'Writing assistant', 'Draft, rewrite, and refine everyday content.', 'Draft a project brief', 'Rewrite an announcement', 'Summarize meeting notes'],
  ['data', 'Data analyst', 'Explore datasets and explain useful patterns.', 'Analyze sales trends', 'Explain a metric change', 'Summarize a CSV file']
].map(([id, name, description, ...prompts]) => ({ id, name, description, prompts, owner: 'Sesama', mine: false }));

/** Local demo directory; no external services or simulated installation state. */
export function createAgentDirectory({ main, onStart }) {
  const agents = samples.map(agent => ({ ...agent }));
  const favorites = new Set();
  const storageKey = 'sesama-agent-directory-v1';
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved) {
      for (const agent of saved.agents || []) {
        if (typeof agent.id === 'string' && /^custom-/.test(agent.id) && typeof agent.name === 'string' && typeof agent.description === 'string' && Array.isArray(agent.prompts) && agent.prompts.every(prompt => typeof prompt === 'string')) agents.push({ ...agent, mine: true, owner: 'You' });
      }
      for (const id of saved.favorites || []) if (agents.some(agent => agent.id === id)) favorites.add(id);
    }
  } catch { /* Storage may be unavailable or contain obsolete demo data. */ }
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify({ agents: agents.filter(agent => agent.mine), favorites: [...favorites] })); } catch { /* Keep session behavior when storage is unavailable. */ }
  }
  let query = '', filter = 'all', serial = 0;

  const host = document.createElement('section');
  host.hidden = true;
  host.className = 'agent-directory';
  host.style.cssText = 'flex:1;min-height:0;overflow:auto;flex-direction:column';
  host.setAttribute('aria-label', 'Agent directory');
  main.append(host);
  host.innerHTML = pageHeader({ title: 'All agents', icon: 'sparkles', actions: '<div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:nowrap;width:clamp(220px,32vw,420px)">' + input({ id: 'agent-search', clearable: true, placeholder: 'Search agents…', ariaLabel: 'Search agents', type: 'search' }) + button({ label: 'Create agent', variant: 'primary', icon: 'plus', attributes: 'data-create-agent' }) + '</div>' }) + pageLayout(
    '<div style="display:grid;grid-template-rows:auto 1fr;gap:16px;flex:1">' +
    tabs({ id: 'agent-filters', variant: 'line', tabs: [{ id: 'all', label: 'All' }, { id: 'favorites', label: 'Favorites' }, { id: 'mine', label: 'Created by me' }] }) +
    '<div id="agent-results" aria-live="polite"></div></div>', { variant: 'dashboard' });
  const session = mount(host);
  const results = host.querySelector('#agent-results');
  const layout = host.querySelector('.sb-page-layout');
  layout.style.cssText = 'flex:1;display:flex;flex-direction:column';

  function render() {
    const shown = agents.filter(agent => (filter !== 'favorites' || favorites.has(agent.id)) && (filter !== 'mine' || agent.mine) && `${agent.name} ${agent.description}`.toLowerCase().includes(query.toLowerCase()));
    results.style.cssText = shown.length ? '' : 'display:grid;justify-items:center;align-content:start;padding-top:clamp(48px,12vh,120px);min-height:240px';
    results.innerHTML = shown.length ? pageGrid(shown.map(agent => ({ span: 4, tablet: 3, html: agentCardRecipe({
      headerActions: iconButton({ icon: 'star', variant: 'favorite', pressed: favorites.has(agent.id), accessibleLabel: `${favorites.has(agent.id) ? 'Unfavorite' : 'Favorite'} ${agent.name}`, attributes: `data-agent-favorite="${agent.id}"` }),
      name: agent.name, role: `By ${agent.owner}`, description: agent.description,
      actions: '<div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;width:100%">' + button({ label: 'Details', variant: 'ghost', attributes: `data-agent-details="${agent.id}"` }) + button({ label: 'Start chat', variant: 'secondary', attributes: `data-agent-start="${agent.id}"` }) + '</div>'
    }) }))) : emptyState({ title: 'No agents found', description: 'Try another search or filter.', icon: 'search' });
    session.refresh();
  }

  function openDialog(markup, trigger, wire) {
    const template = document.createElement('template');
    template.innerHTML = markup;
    const dialog = template.content.firstElementChild;
    document.body.append(dialog);
    const controller = initModal(dialog), dialogSession = mount(dialog);
    dialog.addEventListener('close', () => { dialogSession.destroy(); controller.destroy(); dialog.remove(); trigger?.isConnected && trigger.focus(); }, { once: true });
    wire?.(dialog, controller);
    controller.open(trigger);
  }

  function start(agent, prompt = '') {
    close();
    onStart(agent, prompt);
  }

  function details(agent, trigger) {
    openDialog(modal({ title: agent.name, size: 'lg', content:
      '<div style="display:grid;gap:16px">' +
      '<div style="display:flex;align-items:center;gap:12px">' + avatar({ name: agent.name, size: 40, color: 'auto' }) + `<div style="display:grid;gap:4px"><span>${escapeHTML(agent.description)}</span><span class="sx-help">By ${escapeHTML(agent.owner)}</span></div></div>` +
      contentSection({ title: 'Try a prompt', content: '<div style="display:grid;gap:8px">' + agent.prompts.map((prompt, i) => button({ label: prompt, variant: 'secondary', size: 'base', attributes: `data-prompt="${i}"` })).join('') + '</div>' }) +
      contentSection({ title: 'Knowledge & tools', description: 'Uses the context and files you provide in chat. Tool activity and responses are simulated in this demo.' }) + '</div>',
      actions: button({ label: 'Close', variant: 'secondary', attributes: 'data-sui-modal-close' }) + button({ label: 'Start chat', variant: 'primary', attributes: 'data-start-detail' })
    }), trigger, (dialog, controller) => {
      const title = dialog.querySelector('.sx-modal-header h2');
      title.setAttribute('tabindex', '-1');
      title.setAttribute('autofocus', '');
      dialog.addEventListener('click', event => {
        const prompt = event.target.closest('[data-prompt]');
        if (!prompt && !event.target.closest('[data-start-detail]')) return;
        controller.close();
        start(agent, prompt ? agent.prompts[Number(prompt.dataset.prompt)] : '');
      });
    });
  }

  function create(trigger) {
    openDialog(modal({ title: 'Create agent', description: 'Give your assistant a name and purpose.', content: '<form id="agent-create-form" style="display:grid;gap:16px">' +
      inputField({ id: 'new-agent-name', name: 'name', label: 'Name', required: true, placeholder: 'e.g. Release assistant' }) +
      textarea({ name: 'description', label: 'Purpose', required: true, placeholder: 'What should this agent help with?' }) + '</form>',
      actions: button({ label: 'Cancel', variant: 'secondary', attributes: 'data-sui-modal-close' }) + button({ label: 'Create agent', variant: 'primary', type: 'submit', attributes: 'type="submit" form="agent-create-form"' })
    }), trigger, (dialog, controller) => {
      dialog.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget), name = String(data.get('name')).trim(), description = String(data.get('description')).trim();
        if (!name || !description) return;
        agents.unshift({ id: `custom-${Date.now()}-${++serial}`, name, description, mine: true, owner: 'You', prompts: ['Help me get started', 'Make an action plan', 'Review my draft'] });
        save();
        query = ''; host.querySelector('#agent-search').value = '';
        controller.close(); render(); showToast('Demo agent created for this session.', 'success');
      });
      dialog.querySelector('#new-agent-name').setAttribute('autofocus', '');
    });
  }

  host.querySelector('#agent-search').addEventListener('input', event => { query = event.target.value; render(); });
  host.addEventListener('sui:tab:change', event => { filter = event.detail.id; render(); });
  host.addEventListener('click', event => {
    const target = event.target.closest('[data-create-agent], [data-agent-start], [data-agent-details], [data-agent-favorite]');
    if (!target) return;
    if (target.hasAttribute('data-create-agent')) return create(target);
    const id = target.dataset.agentStart || target.dataset.agentDetails || target.dataset.agentFavorite;
    const agent = agents.find(item => item.id === id);
    if (!agent) return;
    if (target.hasAttribute('data-agent-start')) return start(agent);
    if (target.hasAttribute('data-agent-details')) return details(agent, target);
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    save();
    render();
    results.querySelector(`[data-agent-favorite="${id}"]`)?.focus();
  });

  function close() {

    host.hidden = true;
    for (const child of main.children) if (child !== host) child.hidden = false;
  }
  render();
  return {
    startById(id) { const agent = agents.find(item => item.id === id); if (agent) start(agent); else this.open(); },
    open() { for (const child of main.children) child.hidden = child !== host; host.hidden = false; },
    close
  };
}
