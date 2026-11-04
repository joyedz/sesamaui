import { analysisBlocks, addSampleConversations } from './sample-conversations.mjs';
export const models = ['Balanced', 'Fast', 'Thorough'];
export const recoverable = ['failed', 'cancelled', 'interrupted'];
export const active = ['queued', 'running'];
export const brief = `# Competitor pricing brief\n\nFictional sample data for the Sesama Agent Bot demo.\n\n| Team plan | Monthly price per seat | Evidence |\n| --- | --- | --- |\n| Northstar | $24 | Sample pricing sheet |\n| Orbit | $29 | Sample change log: +$5 |\n| Sesama Launch | $22 proposed | Sample launch plan |\n\nRecommendation: keep the proposed $22 price and explain shared workspace limits clearly. One source is unavailable and remains unverified. No real websites were queried.\n`;
export function initialState() {
  return addSampleConversations({
    version: 1, route: '#chat/atlas/main-atlas', collapsed: false, filter: 'all',
    agents: [
      { id: 'atlas', name: 'Atlas', role: 'Team lead', icon: 'sparkles', model: 'Balanced', instructions: 'Turn requests into clear priorities. Explain owners and next steps.' },
      { id: 'scout', name: 'Scout', role: 'Researcher', icon: 'search', model: 'Thorough', instructions: 'Compare the sample sources. Label missing evidence and include a concise recommendation.' },
      { id: 'forge', name: 'Forge', role: 'Builder', icon: 'code', model: 'Fast', instructions: 'Propose the smallest useful change. Ask for approval before applying sample changes.' }
    ],
    threads: ['atlas', 'scout', 'forge'].map(agentId => ({
      id: 'main-' + agentId, agentId, title: 'Launch workspace', draft: '', scroll: null,
      messages: [{ id: 'seed-request-' + agentId, role: 'user', text: ({ atlas: 'Morning! What needs me today?', scout: 'What changed in the competitor pricing brief?', forge: 'What is ready for pricing review?' })[agentId] }, { id: 'welcome-' + agentId, role: 'agent', text: ({ atlas: 'Three things need you today:\n\n1. Review Forge’s proposed pricing update.\n2. Read Scout’s competitor brief.\n3. Pick the launch day once both are reviewed.', scout: 'I can compare the fictional competitor pricing and prepare a brief you can preview and download.', forge: 'I can prepare a sample pricing change and show you what needs approval.' })[agentId] }]
    })), tasks: [], runs: []
  });
}
export function recoverState(saved) {
  const seed = initialState();
  if (!saved || saved.version !== 1 || !Array.isArray(saved.agents) || !Array.isArray(saved.threads) || !Array.isArray(saved.runs) || !Array.isArray(saved.tasks)) return seed;
  for (const thread of saved.threads) {
    if (thread.messages.length === 1 && thread.messages[0].id === 'welcome-' + thread.agentId) {
      thread.messages = seed.threads.find(t => t.agentId === thread.agentId)?.messages || thread.messages;
    }
  }
  for (const run of saved.runs) if (active.includes(run.state)) run.state = 'interrupted';
  return addSampleConversations(saved);
}
export function responseFor(agent, prompt, retry = false) {
  const text = prompt.toLowerCase();
  if (/fail|unavailable|error/.test(text) && !retry) return { state: 'failed', text: 'The sample source could not be reached. Your request is saved. Retry to use the cached sample brief.' };
  if (agent.id === 'scout' || /research|competitor|brief/.test(text)) return {
    state: 'completed', artifact: true, blocks: analysisBlocks('scout'),
    text: 'I compared three fictional team plans:\n\n• Northstar: $24 per seat / month.\n• Orbit: $29 per seat / month, up $5 in the sample change log.\n• Sesama Launch: $22 proposed per seat / month.\n\nRecommendation: keep the proposed $22 price and clarify the shared workspace limits. One unavailable sample source is marked unverified in the brief.'
  };
  if (agent.id === 'forge' && /pricing|update|change|build|implement/.test(text)) return {
    state: 'approval', blocks: analysisBlocks('forge'), text: 'The sample pricing change is ready for review:\n\n• Set the Team plan to $22 per seat / month.\n• Read displayed limits from the sample plan contract.\n• Check the sample pricing examples for consistency.\n\nApprove to apply this change to the demo dataset. No repository or external service will be changed.'
  };
  if (agent.id === 'atlas') return { state: 'completed', blocks: analysisBlocks('atlas'), text: 'Here is the launch plan:\n\n1. Scout: prepare the competitor pricing brief.\n2. Forge: prepare the pricing update for your approval.\n3. You: review both results before choosing the launch date.\n\nStart with the pricing brief. You can assign it to Scout from Tasks and follow the result there.' };
  return { state: 'completed', text: `${agent.name} reviewed your request: “${prompt}”\n\nSuggested approach:\n1. Confirm the expected result and the sample inputs.\n2. Make the smallest change that meets the request.\n3. Review the result before applying it.\n\nThis is a local simulation using the launch workspace sample data.` };
}
