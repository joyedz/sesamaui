import { typingPlaceholder } from '../shared/typing-placeholder.mjs';
import { readState, writeState, preserveSidebar } from '../shared/state.mjs';
preserveSidebar('ai-agent');
const aiState = readState('ai-agent');
const directoryPage = document.body.dataset.page === 'agents';

    import {
      appShell,
      workspaceSidebar,
      message,
      composer as composerBuilder,
      agentRun,
      fileCard,
      tree,
      treeSection,
      select,
      iconButton,
      button,
      inputField,
      avatar,
      initModal,
      initComposer,
      showToast,
      controlIcon,
      escapeHTML,
      mount
    } from '../../src/index.mjs';
    import { aiAgentConversations } from '../shared/data.mjs';
    import { createAgentDirectory } from '../shared/agent-directory.mjs';

    const glyph = (name, size = 16) => controlIcon(name, size);

    document.querySelectorAll('[data-icon]').forEach(n => {
      n.innerHTML = glyph(n.dataset.icon || 'chat', 16);
    });
    document.getElementById('close-detail').innerHTML = glyph('x', 14);

    const oldApp = document.querySelector('.agent-app');
    const main = oldApp.querySelector('.agent-main');
    main.classList.add('sb-main', 'sx-shell-main');
    const detailPanel = oldApp.querySelector('.agent-detail');
    const shellTemplate = document.createElement('template');
    shellTemplate.innerHTML = appShell({
      sidebar: workspaceSidebar({
        id: 'sidebar',
        navigation: '<div id="new-chat-navigation"></div>',
        projects: '<nav class="agent-nav" id="history"></nav>',
        projectActions: { actionIcon: 'plus', actionLabel: 'Add project', actionAttributes: 'id="add-project"' }
      })
    });
    const sidebarApp = shellTemplate.content.firstElementChild;
    sidebarApp.querySelector('.sb-main').replaceWith(main);
    sidebarApp.append(detailPanel);
    oldApp.replaceWith(sidebarApp);
    const sidebar = document.getElementById('sidebar');
    sidebar.querySelector('[data-sidebar-notifications]').setAttribute('data-toast', 'No new notifications.');
    document.addEventListener('click', event => {
      const toast = event.target.closest('[data-toast]');
      if (toast) showToast(toast.dataset.toast, 'informative');
    });

    document.addEventListener('sui:message:action', event => {
      const action = event.detail?.action || '';
      if (action === 'regenerate') showToast('Regenerate response · simulated demo.', 'informative');
      if (action === 'helpful') showToast('Feedback recorded. Thank you!', 'success');
    });

    const thread = document.getElementById('thread');
    const chat = document.getElementById('chat');

    document.getElementById('new-chat-navigation').innerHTML = tree([
      { id: 'new-chat', key: 'new-chat', label: 'New chat', icon: 'plus' },
      { id: 'search-chats', key: 'search-chats', label: 'Search conversations', icon: 'search' },
      { id: 'all-agents', key: 'all-agents', label: 'All agents', icon: 'sparkles' },
      { id: 'workspace-files', key: 'workspace-files', label: 'Workspace files', icon: 'folder' }
    ]);

    document.querySelector('[data-tree-key="new-chat"]')?.setAttribute('id', 'new-chat');

    document.getElementById('new-chat-navigation').addEventListener('click', event => {
      const item = event.target.closest('[data-tree-key]');
      if (!item || item.dataset.treeKey === 'new-chat') return;
      if (item.dataset.treeKey === 'all-agents') {
        setRoute('#agents');
        agentDirectory.open();
        return;
      }
      if (item.dataset.treeKey === 'search-chats') {
        let search = document.getElementById('chat-search');
        if (!search) {
          const wrapper = document.createElement('label');
          wrapper.className = 'field';
          wrapper.style.width = '100%';
          wrapper.innerHTML = '<input id="chat-search" aria-label="Search conversations" placeholder="Search conversations…">';
          document.getElementById('history').before(wrapper);
          search = wrapper.querySelector('input');
          search.addEventListener('input', () => {
            document.querySelectorAll('#history [data-tree-key]').forEach(row => {
              row.hidden = !row.textContent.toLowerCase().includes(search.value.toLowerCase());
            });
          });
        }
        search.focus();
        return;
      }
      showToast('Workspace files · demo');
    });

    function outgoing(text, files = []) {
      document.querySelector('.agent-main').classList.remove('is-new-chat');
      document.getElementById('greeting').hidden = true;

      const attachmentsHTML = files.map(card => {
        return fileCard({
          name: card.name || 'document',
          type: card.type || 'text',
          src: card.src || ''
        });
      }).join('');

      const msgHTML = message({
        role: 'user',
        own: true,
        content: escapeHTML(text),
        attachments: attachmentsHTML
      });

      const t = document.createElement('template');
      t.innerHTML = msgHTML.trim();
      const node = t.content.firstElementChild;
      thread.append(node);
      mount(node);
    }

    let selectedAgent = null;
    function scenarioActivity(key, question) {
      const scenarios = {
        'history-office': [
          ['Review team workload', 'Read the example priorities and dependencies supplied in this scenario.'],
          ['Draft a weekly plan', 'Group the example tasks by priority and day.']
        ],
        'history-coding': [
          ['Inspect API contract', 'Review an illustrative endpoint and request lifecycle. No files were accessed.'],
          ['Plan the integration', 'Outline validation, job status, cancellation, and response handling. No code was executed.']
        ],
        'history-design': [
          ['Review interface patterns', 'Compare navigation, messages, and composer against the example design checklist.'],
          ['Prepare review notes', 'Summarize illustrative consistency and accessibility observations. No automated audit was run.']
        ],
        'website-coding': [
          ['Inspect layout structure', 'Review a hypothetical landing page layout. No repository was accessed.'],
          ['Suggest responsive fixes', 'Prepare example layout adjustments. No files were modified.']
        ]
      };
      return (scenarios[key] || []).map(([name, output], index) => ({
        type: 'tool', name, iconName: index ? 'file' : 'search', state: 'completed',
        input: index ? 'Use the example findings from the previous step.' : question,
        output: 'Demo scenario: ' + output
      }));
    }
    function demoActivity(prompt) {
      if (!['research', 'coding'].includes(selectedAgent?.id)) return [];
      return selectedAgent.id === 'research'
        ? [{ type: 'tool', name: 'Search reference material', iconName: 'search', state: 'completed', input: prompt, output: 'Illustrative search activity. No external search was executed.' }, { type: 'tool', name: 'Summarize findings', iconName: 'file', state: 'completed', output: 'Example summary prepared from demo content; no sources were retrieved.' }]
        : [{ type: 'tool', name: 'Inspect project files', iconName: 'code', state: 'completed', input: prompt, output: 'Illustrative file inspection. No repository files were accessed.' }, { type: 'tool', name: 'Prepare suggested changes', iconName: 'file', state: 'completed', output: 'Example implementation guidance; no commands ran and no files changed.' }];
    }
    function answer(text, steps = [], elapsed = '', runTitle = 'Completed task') {
      const runHTML = steps.length ? agentRun({
        title: `${runTitle} · ${steps.length} steps${elapsed ? ' · ' + elapsed : ''}`,
        state: 'completed', steps
      }) : '';

      const msgHTML = message({
        role: 'agent',
        content: runHTML + escapeHTML(text),
        actions: [
          { action: 'copy', icon: 'copy', label: 'Copy response' },
          { action: 'regenerate', icon: 'refresh-cw', label: 'Regenerate response' },
          { action: 'helpful', icon: 'thumbs-up', label: 'Helpful response' }
        ]
      });

      const t = document.createElement('template');
      t.innerHTML = msgHTML.trim();
      const node = t.content.firstElementChild;
      thread.append(node);
      mount(node);
    }

    outgoing('Summarize the project brief and suggest next steps.');
    answer('The brief outlines the main goals and scope. Next, confirm priorities, assign milestone owners, and agree on a timeline. Validate the scope first to keep implementation focused.');

    document.getElementById('compose').innerHTML = composerBuilder({
      surface: 'blur',
      placeholder: 'Ask a question or assign a task…',
      contextOptions: ['sesama-ui / main', 'sesama-ui / feature/agent-workspace'],
      contextValue: 'sesama-ui / main'
    });

    const composerEl = document.getElementById('compose').querySelector('.composer, [data-sui-composer]');
    let pending, thinkingNode;
    const composerController = initComposer(composerEl);
    function resetSend() { composerController.setState('empty'); }
    composerEl.addEventListener('sui:composer:stop', () => {
      clearTimeout(pending);
      thinkingNode?.remove();
      resetSend();
      showToast('Response stopped.');
    });
    composerEl.addEventListener('sui:composer:send', event => {
      const steps = demoActivity(event.detail.text);
      const startedAt = performance.now();
      outgoing(event.detail.text, event.detail.attachments);
      composerController.setState('thinking');
      const template = document.createElement('template');
      template.innerHTML = steps.length ? message({ role: 'agent', content: agentRun({ title: selectedAgent?.id === 'research' ? 'Reviewing reference material…' : 'Preparing implementation guidance…', state: 'running', steps: steps.map(step => ({ ...step, state: 'running', output: '' })) }) }) : message({ role: 'agent', status: 'thinking' });
      thinkingNode = template.content.firstElementChild;
      thread.append(thinkingNode);
      mount(thinkingNode);
      chat.scrollTop = chat.scrollHeight;
      clearTimeout(pending);
      pending = setTimeout(() => {
        thinkingNode?.remove();
        answer(steps.length ? 'This is a simulated walkthrough. Share the relevant files or context to explore how this task could be approached.' : 'I have received your request. This response is simulated.', steps, ((performance.now() - startedAt) / 1000).toFixed(1) + 's', selectedAgent?.id === 'research' ? 'Summarized reference material' : 'Prepared implementation guidance');
        resetSend();
        chat.scrollTop = chat.scrollHeight;
      }, 1500);
    });
    function updateChatFade() {
      chat.classList.toggle('has-scroll-above', chat.scrollTop > 2);
      chat.classList.toggle('has-scroll-below', chat.scrollHeight - chat.clientHeight - chat.scrollTop > 2);
    }
    chat.addEventListener('scroll', updateChatFade, { passive: true });
    new ResizeObserver(updateChatFade).observe(chat);
    new MutationObserver(() => requestAnimationFrame(updateChatFade)).observe(thread, { childList: true, subtree: true });

    const conversationViews = new Map();
    let activeConversation = null;

    function openConversation(key, title) {
      selectedAgent = null;
      setRoute('#chat/' + encodeURIComponent(key));
      agentDirectory.close();
      document.querySelector('.agent-main').classList.remove('is-new-chat');
      document.getElementById('greeting').hidden = true;
      clearTimeout(pending);
      thinkingNode?.remove();
      if (activeConversation) conversationViews.set(activeConversation, [...thread.childNodes]);
      thread.replaceChildren();
      activeConversation = key;
      resetSend();
      if (conversationViews.has(key)) {
        thread.append(...conversationViews.get(key));
      } else {
        let firstResponse = true;
        let responseIndex = 0;
        for (const [question, response] of aiAgentConversations[key] || []) {
          outgoing(question);
          const designRuns = {
            4: ['Reviewed composer interactions', 'Inspect input and toolbar states', 'Compare empty, ready, and thinking states in the example Composer.', 'Review send and stop behavior', 'Outline keyboard submission, cancellation, and attachment handling.'],
            7: ['Reviewed conversation scrolling', 'Check scroll boundaries', 'Inspect the example header, composer, and final-message placement.', 'Review reading position', 'Outline edge fades and menu dismissal without moving older messages.'],
            10: ['Prepared design review checklist', 'Consolidate review findings', 'Group the example observations into layout, controls, and accessibility.', 'Define verification steps', 'Prepare desktop, mobile, keyboard, and reduced-motion checks. These checks have not been executed.']
          };
          const scenario = key === 'history-design' ? designRuns[responseIndex] : null;
          const steps = scenario ? [1, 3].map(index => ({ type: 'tool', name: scenario[index], iconName: 'file', state: 'completed', input: question, output: 'Example review: ' + scenario[index + 1] })) : firstResponse ? scenarioActivity(key, question) : [];
          answer(response, steps, '', scenario?.[0] || ({ 'history-office': 'Reviewed team priorities', 'history-coding': 'Planned API integration', 'history-design': 'Reviewed interface patterns', 'website-coding': 'Reviewed responsive layout' })[key]);
          firstResponse = false;
          responseIndex++;
        }
      }
      document.getElementById('agent-name').textContent = title;
      chat.scrollTop = chat.scrollHeight;
    }

    const history = document.getElementById('history');
    history.innerHTML = tree([
      {
        id: 'project-sesama',
        key: 'project-sesama',
        label: 'Sesama workspace',
        icon: 'folder',
        children: [
          { id: 'history-office', key: 'history-office', label: 'Plan team priorities this week', icon: false },
          { id: 'history-coding', key: 'history-coding', label: 'Connect the agent to our API', icon: false },
          { id: 'history-design', key: 'history-design', label: 'Review the design system · long conversation', icon: false }
        ]
      },
      {
        id: 'project-website',
        key: 'project-website',
        label: 'Website launch',
        icon: 'folder',
        expanded: false,
        children: [
          { id: 'website-office', key: 'website-office', label: 'Prepare the launch checklist', icon: false },
          { id: 'website-coding', key: 'website-coding', label: 'Fix the landing page layout', icon: false },
          { id: 'website-design', key: 'website-design', label: 'Explore homepage ideas', icon: false }
        ]
      },
      {
        id: 'project-tools',
        key: 'project-tools',
        label: 'Internal tools',
        icon: 'folder',
        expanded: false,
        children: [
          { id: 'tools-office', key: 'tools-office', label: 'Summarize operations requirements', icon: false },
          { id: 'tools-coding', key: 'tools-coding', label: 'Add table filters', icon: false },
          { id: 'tools-design', key: 'tools-design', label: 'Simplify the dashboard', icon: false }
        ]
      }
    ]);

    history.addEventListener('click', event => {
      const item = event.target.closest('[data-tree-key]');
      if (!item || item.hasAttribute('data-fold')) return;
      openConversation(item.dataset.treeKey, item.textContent.trim());
    });

    document.getElementById('add-project').onclick = event => {
      const trigger = event.currentTarget;
      const dialog = document.createElement('dialog');
      dialog.className = 'ds-modal';
      dialog.setAttribute('aria-labelledby', 'add-project-title');
      dialog.innerHTML = `
        <div class="sx-modal-header">
          <h2 id="add-project-title">New project</h2>
          ${iconButton({ icon: 'x', classes: 'sx-modal-close', attributes: 'data-modal-close', accessibleLabel: 'Close dialog' })}
        </div>
        <form>
          <div style="display:grid;gap:16px;padding:16px 0;">
            ${inputField({ id: 'project-name', label: 'Project name', placeholder: 'Project name', required: true })}
          </div>
          <div class="actions">
            <button type="button" class="btn secondary" data-modal-close>Cancel</button>
            <button class="btn primary" type="submit">Create project</button>
          </div>
        </form>
      `;
      document.body.append(dialog);
      const modalInstance = initModal(dialog);

      dialog.querySelector('form').onsubmit = e => {
        e.preventDefault();
        const name = dialog.querySelector('input').value.trim();
        if (!name) return;
        history.insertAdjacentHTML('beforeend', tree([{ id: 'project-' + Date.now(), label: name, icon: 'folder', children: [] }]));
        pageSession.refresh();
        modalInstance.close();
        showToast('Project created.', 'success');
      };

      dialog.addEventListener('close', () => {
        modalInstance.destroy();
        dialog.remove();
      }, { once: true });

      modalInstance.open(trigger);
    };

    document.getElementById('new-chat').onclick = () => {
      selectedAgent = null;
      setRoute('#chat/new');
      agentDirectory.close();
      document.querySelector('#greeting h1').textContent = 'Let’s think it through.';
      clearTimeout(pending);
      thinkingNode?.remove();
      if (activeConversation) conversationViews.set(activeConversation, [...thread.childNodes]);
      activeConversation = null;
      thread.replaceChildren();
      document.getElementById('agent-name').textContent = 'New chat';
      document.querySelector('.agent-main').classList.add('is-new-chat');
      document.getElementById('greeting').hidden = false;
      const textarea = composerEl.querySelector('textarea');
      if (textarea) {
        textarea.value = '';
        textarea.style.height = 'auto';
        resetSend();
        textarea.focus();
      }
    };

    const detail = document.getElementById('detail');
    const detailTrigger = document.getElementById('run-detail');
    if (detailTrigger) {
      detailTrigger.onclick = () => {
        detail.hidden = !detail.hidden;
        sidebarApp.classList.toggle('has-details', !detail.hidden);
        detailTrigger.setAttribute('aria-expanded', String(!detail.hidden));
      };
    }
    document.getElementById('close-detail').onclick = () => {
      detail.hidden = true;
      sidebarApp.classList.remove('has-details');
      detailTrigger?.setAttribute('aria-expanded', 'false');
    };

    const pageSession = mount(document.body);
    const agentDirectory = createAgentDirectory({
      main: document.querySelector('.agent-main'),
      onStart(agent, prompt) {
        const previousRestoring = restoringRoute;
        restoringRoute = true;
        document.getElementById('new-chat').click();
        restoringRoute = previousRestoring;
        setRoute('#agent/' + encodeURIComponent(agent.id));
        selectedAgent = agent;
        document.getElementById('agent-name').textContent = agent.name;
        document.querySelector('#greeting h1').textContent = `How can ${agent.name} help?`;
        composerController.setValue(prompt);
        composerController.focus();
      }
    });
    let restoringRoute = false;
    function setRoute(hash) {
      if (!restoringRoute && location.hash !== hash) window.history.pushState(null, '', hash);
    }
    function restoreRoute() {
      restoringRoute = true;
      try {
        const hash = location.hash;
        if (hash === '#agents') {
          document.querySelector('[data-tree-key="all-agents"]').click();
        } else if (hash === '#chat/new') {
          document.getElementById('new-chat').click();
        } else if (hash.startsWith('#agent/')) {
          agentDirectory.startById(decodeURIComponent(hash.slice(7)));
        } else if (hash.startsWith('#chat/')) {
          const key = decodeURIComponent(hash.slice(6));
          const item = [...document.querySelectorAll('#history [data-tree-key]')].find(node => node.dataset.treeKey === key);
          if (item) openConversation(key, item.textContent.trim());
        }
      } catch { /* Ignore malformed or obsolete demo links. */ }
      finally { restoringRoute = false; }
    }
    window.addEventListener('popstate', restoreRoute);
    if (!location.hash) window.history.replaceState(null, '', directoryPage ? '#agents' : (typeof aiState.route === 'string' && aiState.route !== '#agents' ? aiState.route : '#chat/new'));
    restoreRoute();
  
    if (!directoryPage && typeof aiState.draft === 'string') composerController.setValue(aiState.draft);
    function saveAIState() {
      if (directoryPage) return;
      aiState.draft = composerEl.querySelector('textarea')?.value || '';
      if (!directoryPage) aiState.route = location.hash;
      writeState('ai-agent', aiState);
    }
    document.addEventListener('input', saveAIState);
    window.addEventListener('pagehide', saveAIState);

    if (!directoryPage) typingPlaceholder(composerEl.querySelector('textarea'), {
      phrases: [
        'Deep research about the future of work...',
        'Build a landing page for my new idea...',
        'Turn my notes into a clear project plan...',
        'Review my code and suggest improvements...',
        'Help me prepare our next product launch...',
        'Summarize this report and find key insights...'
      ],
      active: () => location.hash === '#chat/new' && document.querySelector('.agent-main').classList.contains('is-new-chat'),
      observe: [document.querySelector('.agent-main'), composerEl]
    });
