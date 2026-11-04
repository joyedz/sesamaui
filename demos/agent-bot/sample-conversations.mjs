/** Fictional launch-workspace fixtures; no external tools or sources are contacted. */
export function analysisBlocks(agentId) {
  if (agentId === 'forge') return [
    { type: 'heading', text: 'Proposed pricing change' },
    { type: 'paragraph', text: 'Use one sample contract for the displayed price and workspace limits. This keeps the pricing page and plan comparison consistent.' },
    { type: 'code', language: 'json', text: '{\n  "plan": "Team",\n  "monthlyPricePerSeat": 22,\n  "sharedProjects": 20,\n  "source": "sample-plan-contract"\n}' },
    { type: 'heading', text: 'Sample verification' },
    { type: 'table', columns: ['Scenario', 'Expected result', 'Review'], rows: [['Monthly plan', '$22 per seat', 'Ready'], ['Plan limits', 'Read from shared contract', 'Ready'], ['Existing subscribers', 'No automatic price change', 'Needs owner review']] },
    { type: 'callout', tone: 'warning', title: 'Approval required', text: 'This is a proposed demo change. Review the price and existing-subscriber policy before approving. No code or external service has been changed.' },
    { type: 'paragraph', text: 'Next step: approve the proposal or ask me to revise a specific field. I will retain the current sample plan until you decide.' }
  ];
  if (agentId === 'atlas') return [
    { type: 'heading', text: 'Launch readiness brief' },
    { type: 'paragraph', text: 'The sample launch is close to ready. Research is available, the pricing proposal needs a decision, and the final launch date remains yours to choose.' },
    { type: 'table', columns: ['Workstream', 'Owner', 'Next action'], rows: [['Pricing evidence', 'Scout', 'Review the brief'], ['Pricing update', 'Forge', 'Request approval'], ['Launch decision', 'You', 'Confirm after reviews']] },
    { type: 'heading', text: 'Recommended order' },
    { type: 'list', items: ['Check the evidence gap in Scout’s brief.', 'Review Forge’s sample contract and subscriber policy.', 'Approve or revise the proposal, then confirm the launch date.'] },
    { type: 'callout', tone: 'informative', title: 'Decision still open', text: 'A completed research task does not approve a pricing change. Keep the launch decision separate until the owner has reviewed it.' },
    { type: 'sources', items: ['Sample competitor pricing brief', 'Sample plan contract', 'Fictional launch checklist'] }
  ];
  return [
    { type: 'heading', text: 'Competitor pricing analysis' },
    { type: 'paragraph', text: 'I compared three fictional team plans and checked their assumptions against the sample pricing sheet and change log. Our proposed plan is the lowest-priced option in this small dataset; price alone does not establish equivalent value.' },
    { type: 'table', columns: ['Team plan', 'Price / seat', 'Evidence'], rows: [['Northstar', '$24 / month', 'Sample sheet [1]'], ['Orbit', '$29 / month', 'Sample change log [2]'], ['Sesama Launch', '$22 proposed', 'Sample contract [3]']] },
    { type: 'heading', text: 'What changed' },
    { type: 'list', items: ['Orbit increased its sample team price by $5 per seat.', 'The proposed Sesama plan is $2 below Northstar and $7 below Orbit.', 'Billing periods, workspace limits, and support need separate comparison before making a value claim.'] },
    { type: 'callout', tone: 'warning', title: 'One source remains unverified', text: 'The supplemental sample support-policy page is unavailable. I excluded that claim from the recommendation and kept the evidence gap visible.' },
    { type: 'heading', text: 'Recommendation' },
    { type: 'paragraph', text: 'Keep the proposed $22 price for review. Explain the shared-project limit clearly and avoid promising matching support until that evidence is confirmed. Ask Forge to prepare the smallest change, then request owner approval.' },
    { type: 'sources', items: ['[1] Fictional pricing-sheet.csv — three sample plans', '[2] Fictional orbit-changelog.md — sample $5 increase', '[3] Fictional plan-contract.json — proposed Sesama price and limits'] }
  ];
}

export function addSampleConversations(state) {
  if (state.conversationExamplesVersion === 1) return state;
  for (const agent of state.agents) {
    const thread = state.threads.find(item => item.id === 'main-' + agent.id);
    if (!thread) continue;
    const exchanges = [
      ['Can you outline how you will approach this?', 'I’ll review the fictional launch inputs, separate confirmed sample facts from assumptions, then explain the decision that still needs you.'],
      ['Which assumptions should we be careful about?', 'The sample prices use monthly billing per seat. Support, plan limits, taxes, and existing-subscriber terms are separate assumptions. I won’t treat an unavailable source as confirmed.'],
      ['How does this affect the rest of the team?', agent.id === 'atlas' ? 'Scout owns the evidence, Forge owns the proposed change, and you own the approval. Each handoff should carry the source and the unresolved question.' : agent.id === 'forge' ? 'Scout’s evidence informs the proposal. Atlas keeps the checklist aligned. I’ll wait for owner approval before applying the demo change.' : 'Forge can use the comparison to prepare a proposal. Atlas can track the review, but the pricing decision stays with you.'],
      ['Give me the detailed analysis, sources, and next steps.', 'Here is the detailed review of our fictional launch workspace.']
    ];
    exchanges.forEach(([prompt, answer], index) => {
      const prefix = 'example-' + agent.id + '-' + index;
      const request = { id: prefix + '-request', role: 'user', text: prompt };
      const response = { id: prefix + '-answer', role: 'agent', text: answer, ...(index === 3 ? { blocks: analysisBlocks(agent.id) } : {}) };
      if (!thread.messages.some(item => item.id === request.id)) thread.messages.push(request, response);
      if ((index === 0 || index === 3) && !state.runs.some(item => item.id === prefix + '-run')) state.runs.push({
        id: prefix + '-run', threadId: thread.id, userMessageId: request.id, resultMessageId: response.id,
        prompt, state: 'completed', stage: 2, attempt: 0, instructions: agent.instructions,
        artifact: agent.id === 'scout' && index === 3,
        steps: [
          { type: 'tool', name: 'Read sample launch inputs', state: 'completed', input: 'Fictional workspace fixtures', output: 'Sample plan contract, pricing sheet, and launch checklist reviewed.' },
          { type: 'tool', name: 'Check sample evidence', state: 'completed', output: 'Confirmed fixture values; supplemental support-policy claim left unverified.' },
          { type: 'progress', title: 'Prepare recommendation and next steps', state: 'completed' }
        ]
      });
    });
  }
  state.conversationExamplesVersion = 1;
  return state;
}
