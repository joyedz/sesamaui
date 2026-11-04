import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, recoverState, responseFor } from '../demos/ai-bot/model.mjs';
import { renderMessageContent } from '../demos/ai-bot/responses.mjs';
import { workspaceSidebar, appShell, composer, message, tabs, pageHeader } from '../src/index.mjs';

test('Agent Bot recovers interrupted work without losing saved conversation and approval', () => {
  const state = initialState();
  state.threads[0].draft = 'Keep my request';
  state.runs.push({ state: 'running' }, { state: 'queued' }, { state: 'approval' }, { state: 'completed' });
  const restored = recoverState(state);
  assert.deepEqual(restored.runs.slice(-4).map(run => run.state), ['interrupted', 'interrupted', 'approval', 'completed']);
  assert.equal(restored.threads[0].draft, 'Keep my request');
});
test('Example conversations migrate once and retain user messages and drafts', () => {
  const state = initialState();
  delete state.conversationExamplesVersion;
  state.runs = [];
  state.threads.forEach(thread => { thread.messages = thread.messages.filter(item => !item.id.startsWith('example-')); });
  state.threads[0].messages.push({ id: 'actual-request', role: 'user', text: 'My own request' });
  state.threads[0].draft = 'My draft';
  recoverState(state);
  const count = state.threads[0].messages.length;
  recoverState(state);
  assert.equal(state.threads[0].messages.length, count);
  assert.equal(state.threads[0].draft, 'My draft');
  assert.ok(state.threads[0].messages.some(item => item.id === 'actual-request'));
  assert.ok(state.threads.every(thread => thread.messages.length >= 10));
});
test('Structured responses escape text in code, tables, lists, and callouts', () => {
  const text = '<img src=x onerror=alert(1)>';
  const html = renderMessageContent({ blocks: [
    { type: 'code', language: text, text }, { type: 'table', columns: [text], rows: [[text]] },
    { type: 'list', items: [text] }, { type: 'callout', title: text, text }
  ] });
  assert.doesNotMatch(html, /<img\b/);
  assert.match(html, /&lt;img/);
});
test('Agent Bot scenarios produce artifacts, explicit approval, and retryable failures', () => {
  const { agents } = initialState();
  assert.equal(responseFor(agents[1], 'Compare pricing').artifact, true);
  assert.equal(responseFor(agents[2], 'Update pricing').state, 'approval');
  assert.equal(responseFor(agents[1], 'source failure').state, 'failed');
  assert.equal(responseFor(agents[1], 'source failure', true).state, 'completed');
});
test('Workspace sidebar supports escaped secondary section labels and preserves default', () => {
  assert.match(workspaceSidebar(), />Projects<\/h2>/);
  assert.match(workspaceSidebar({ projectsTitle: 'Team <example>' }), />Team &lt;example&gt;<\/h2>/);
});
test('Conversation primitives preserve defaults and expose opt-in layout', () => {
  const sharedTabs = tabs({ panelId: 'shared-chat-panel', tabs: ['Atlas'] });
  assert.match(sharedTabs, /aria-controls="shared-chat-panel"/);
  assert.doesNotMatch(sharedTabs, /role="tabpanel"/);
  assert.match(tabs({ tabs: [{ label: 'Atlas', leading: '<span data-avatar-demo>Portrait</span>' }] }), /<span data-avatar-demo>Portrait<\/span>/);
  assert.match(pageHeader({ titleContent: '<span>Application tabs</span>' }), /<span>Application tabs<\/span>/);
  assert.match(appShell({ rail: '<button>Agents</button>' }), /sx-shell-rail/);
  assert.doesNotMatch(appShell(), /class="sx-shell-rail"/);
  assert.match(workspaceSidebar({ variant: 'conversation' }), /sx-sidebar-conversation/);
  const compactSidebar = workspaceSidebar({ variant: 'compact' });
  assert.match(compactSidebar, /data-sidebar-compact/);
  assert.doesNotMatch(compactSidebar, /data-shell-toggle|sb-projects-rail/);
  assert.throws(() => workspaceSidebar({ variant: 'invented' }), TypeError);
  const compact = composer({ compact: true, showContext: false, showModel: false, leading: '<button>Prompts</button>' });
  assert.match(compact, /sx-composer-compact/);
  assert.match(compact, /rows="1"/);
  assert.match(compact, /<button>Prompts<\/button>/);
  assert.doesNotMatch(compact, /name="context"|name="model"/);
  assert.match(composer(), /rows="2"/);
  assert.match(message({ appearance: 'bubble', own: true, role: 'user' }), /sx-message-bubbled/);
  assert.throws(() => message({ appearance: 'invented' }), TypeError);
});
