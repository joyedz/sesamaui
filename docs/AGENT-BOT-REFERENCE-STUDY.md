# Agent Bot demo — reference study

Reference: [OpenBot app preview](https://openbot.run/app-preview). Inspected through the live interface on 4 November 2026. This document separates observed behavior from the proposed Sesama demo. It is a specification, not an implemented demo.

## Observed product structure

OpenBot is a persistent team workspace. Agents have identities, independent conversations, models, knowledge, permissions, routines, and work outputs. A channel gathers messages from several agents. Tasks and routines expose work outside the chat.

The desktop shell has a narrow global navigation rail, an approximately 280px agent sidebar, the conversation/content area, and an optional resizable right panel. Global destinations include Agents, Workflows, Tasks, Usage, Marketplace, and Settings. More exposes Routines and Schedule, with pin controls. A server menu and back/forward controls sit above the agent list.

The sidebar groups agents and channels in folders. Launch contains the launch channel, Atlas (team lead), Forge (builder), and Pulse (signals); Research contains Scout. Rows show avatar, name, role, recent message, time, and selection. Global search offers All, Agents, Channels, Messages, and Routines filters.

## Pages and flows inspected

| Area | Observed interface and behavior | Coverage |
| --- | --- | --- |
| Agent chat | Per-agent messages, model/effort picker, New thread, thread switcher, side panel, composer, context meter | Opened Atlas, Forge, Scout; sent a message to Forge |
| Message actions | Copy, reaction, reply, branch into a new thread; time and sender information | Controls inspected; branch/reaction mutations not exercised |
| New thread | Opens an empty thread tab while keeping the main chat accessible; first message names the thread; working state becomes an answer | Created and completed a mock Atlas thread |
| Channel | Multiple named agents post updates in one conversation; channel settings replaces agent settings | Opened launch and read its multi-agent conversation |
| New agent | Color/face selectors, name, purpose, model, suggestions, Create agent | Opened form and model picker; did not submit creation |
| Model picker | Provider tabs, readiness/version information, model search/list, effort selector, Add provider | Opened picker; provider connections not changed |
| Composer | Add image, use skill, add context, side question, voice; send/stop; Enter versus Shift+Enter | Inspected add menu and sent text; no microphone or file upload |
| Context | Full percentage, used/capacity tokens, breakdown by source, compact at 90%, Compact now, New chat | Opened breakdown; compaction not executed |
| Trace | Step tree, search, duration, cost, tokens, model/tool call counts, errors, replay and speed | Opened trace from the sent Forge message |
| Side panel | Add panes, tabs, maximize control, resize splitter; Files, Agent settings, Voice entry points | Opened settings and attachment preview |
| Instructions | AGENTS.md location, editor action, always-follow rules | Opened instruction page |
| Memories | Empty state, Add memory, textarea, save/cancel | Opened add form, cancelled |
| Skills | Assigned skill modal, All/Enabled tabs, create skill, add from marketplace | Opened assigned-skills modal |
| Files | Agent setting lists storage; message attachment has preview/download/open actions | Scout attachment preview opened; preview unavailable in this fixture |
| Tables | Modal listing record sets, record counts, ownership explanation, delete actions | Opened list; no deletion |
| Agent routines | Empty/list view; routine editor has active, name, schedule/webhook, frequency/days/time, instruction, limit/catch-up behavior, test run, history | Opened editor; no routine execution |
| Agent rules | Access selector, Computer Use and local scripts switches; separate folders and advanced entry points | Opened Permissions; no permissions changed |
| Tasks | Task composer, assignee, Waiting → Working → Needs you/Answered; detail thread, follow-up, Open in chat, Archive | Submitted task and inspected completed result |
| Routines | Agent delegation diagram, connected steps, schedule nodes, prompts, outputs, recent runs, run details, zoom, agent-assisted editing entry | Opened Atlas routine diagram with a completed seeded run |
| Workflows | Empty canvas, trigger, node picker, select/pan/draw/note/shapes/text tools, zoom/fit/minimap | Added a mock trigger and opened node picker; did not run connected workflow |
| Schedule | Day/Week/Month, week navigation, timezone, completed/active runs, upcoming runs, links to agent/routine | Opened Week and read seeded events |
| Usage | Agent/metric/period filters, provider totals, daily trend, exact daily-data action, token totals, Model/Agent/Day breakdown | Opened dashboard; read agent table and totals |
| Marketplace Apps | Categories, search, installed apps, details, connect, custom app | Opened catalog and GitHub detail; no external connection |
| Marketplace Agents | Featured templates, categories, source filters, skills/routines counts, add actions | Opened catalog |
| Marketplace Skills | Source filters, own-skills empty state, categories, verified labels, add to agents/create | Opened catalog |
| Settings | Search and ten sections; see below | Opened all ten section pages; native/account actions not executed |

The preview's displayed model labels are fixture content. They are not a verified current provider catalog and should not become a hardcoded claim about available models in Sesama.

### Workspace settings inventory

- General: theme, transparent window, language, UI scale, logo color, send shortcut, show agent steps, external-link target, launch behavior, restore workspace, analytics.
- Agents: per-agent/default behavior, local scripts, proactive chats, plan-first behavior, steering/queueing, background-process list.
- Profile: activity heatmap, usage statistics, providers/models, teammates, account and active sessions.
- Notifications: server and agent scope, All/Needs me/Nothing, mute, desktop notification, preview, sounds.
- Voice: local/cloud dictation model, language, read-aloud model, voice/speed, compatible server setup.
- Dynamic Island: status, idle state, displays, haptics, server visibility, dimensions.
- Computer Use: native screen-recording and accessibility permission status.
- Billing: license, plans, payment-failed state, invoices, renewal/server actions.
- Mobile Connect: devices, last activity, one-time/permanent connection entry points.
- Updates: version/track, download, restart-when-idle, update policy.

## Actual simulation results

1. Forge chat input: “Show me a summary of the changes and what I should review.”
   The preview returned: “Mock reply from Forge: I received … and added it to the working context.” The turn exposed a trace summary of 2 steps, 1 failed, 6s. Its trace showed thinking, gathering information, search, changes, and answer, with metric totals and replay controls. These are mock displays, not evidence of real tool execution.
2. Task input assigned to Atlas: “Prepare a concise competitor pricing brief for our launch.”
   The task moved from Waiting to Working (“Reviewing the task…”) to Needs you (“Answered”). Opening it showed the original request and a generic mock completion. Follow-up input, archive, and open-in-chat were available.
3. New Atlas thread: “Plan our Friday launch and delegate research to Scout.”
   The draft became a named tab, showed a working activity and Stop action, then returned a generic mock task completion. A real delegation was not demonstrated by this request.
4. Seeded collaboration: the launch channel had separate Atlas, Pulse, and Scout updates. The seeded routine graph showed Atlas branching to Scout and Pulse, then Scout to Forge, with prompts and output per step.
5. Artifact: Scout's existing competitor brief had a file card and right-panel preview. The preview reported “Preview unavailable”; download/open remained available. A successful markdown preview was not verified.

## Visual observations and Sesama adaptation

Observed: dark neutral canvas, subtly lighter inset surfaces and bubbles, fine separators, compact navigation, restrained typography, rounded panels/composer, colored character avatars as strong identity anchors. User bubbles align right; agent replies align left. Hover reveals compact action toolbars. Opening the detail panel narrows the conversation and preserves the surrounding shell.

Adaptation: retain Sesama typography, brand blue, semantic light/dark tokens, Rune icons, component radii and focus/disabled states. Use shared avatar/icon configurations for agent identity. Solid is the default; blur can be an explicit composer/panel surface option where contrast remains clear. The existing AI Chat and Agent directory demos remain separate and unchanged by this study.

The Agent Bot should be a new demo entry. Within it, preserve one shell across content navigation, with addressable routes for conversations, task detail, workflow, routine, usage, integrations, and settings. Do not place every page's content into one long screen.

## Proposed connected demo scenario

Use one coherent fictional product-launch dataset. Each agent's answer and output must match its role and earlier results. All actions stay local to the demo.

| Step | User action | Simulated response/output | Next interaction |
| --- | --- | --- | --- |
| 1 | Ask Atlas “What needs me today?” | Three concrete items: pricing PR, competitor brief, launch approval | Open task, Scout chat, or approval |
| 2 | Ask Scout to compare pricing | Read brief → compare 3 fictional vendors → produce source-labelled table and `competitor-brief.md` | Open real local markdown preview; download generated file |
| 3 | Ask Forge to update pricing | Inspect sample data → propose change → wait for demo approval | Approve/decline; show sample diff and checks |
| 4 | Retry a failed source lookup | One simulated source fails; preserve successful work and explain missing evidence | Retry switches only failed step to running/success |
| 5 | Ask Atlas to coordinate launch | Create linked tasks for Scout/Forge/Pulse; show delegation trace | Open each task without losing original thread |
| 6 | Post a plan to the demo channel | Atlas posts owners; Scout adds findings; Pulse adds signals | Reply to a named message and open sender chat |
| 7 | Create a daily launch routine | Name, assignee, schedule, instruction, active state | Test run updates history and calendar |
| 8 | Build a workflow | Trigger → Scout → approval → Forge → output | Run shows node states, approval pause, final output |
| 9 | Connect a sample integration | Local dialog explains sample access; simulated connecting/connected/error states | Connected badge updates tools available to agent |
| 10 | Review usage | Costs/tokens derived from seeded + local completed runs | Filter by agent/day/model; chart and table agree |

Suggested response text for Scout: “I compared the three sample team plans. Northstar is $24/seat, Orbit is $29/seat, and our proposed plan is $22/seat. Orbit changed by $5 in the sample brief. I marked one unavailable source as unverified.” Use fictional names and explicitly sample sources, not fabricated claims about real vendors.

Suggested Atlas result: “Scout owns the pricing comparison, Forge owns the pricing change, and Pulse owns the launch update. The launch remains pending until you approve the pricing change.” Keep approvals and task states connected across all views.

### Simulation behavior requirements

- Explicit state machine: queued → running → awaiting approval / succeeded / failed / cancelled. Tasks may surface completed answers under Needs you until reviewed/archived.
- Deterministic intent handling for seeded scenarios; helpful role-aware fallback for arbitrary text. Escape all user input and render only controlled application markup in trusted slots.
- Show short staged activities, then a useful structured result, not a generic acknowledgement. Keep steps accessible and respect reduced motion.
- Stop cancels pending work; retry resumes the failed attempt; no late answer may leak into another agent/thread after navigation.
- Refresh restores stored runs; interrupted work should resume from timestamps or become clearly interrupted with Resume/Retry. Never leave a permanent spinner.
- Keep per-thread messages, draft, attachments, reply target, selected model, and scroll position. Appending a response should not pull someone away from older content they are reading.
- Store versioned local entities and relationships: agents, folders, channels, threads, messages, tasks, runs/steps, artifacts, routines, workflow graph, mock integrations, and UI preferences.
- Persist selected route, active agent/thread, sidebar state, panel tabs/width, theme, filters, and canvas pan/zoom. Handle disabled/unavailable storage gracefully.
- Simulated connections do not ask for real secrets, launch OAuth, or call third-party tools. Generated downloads contain demo content only.
- Provide an intentional Reset demo action scoped to this demo's storage, separate from normal refresh/navigation.

## Existing Sesama components to reuse

| Product piece | Existing central builders |
| --- | --- |
| Shell / navigation / detail panel | `appShell`, `workspaceSidebar`, `tree`, `treeSection`, `pageHeader`, `pageLayout` |
| Agent rows / settings lists | `avatar`, `listRow`, `badge`, `statusDot`, `card`, `contentSection` |
| Conversation / activity | `message`, `composer`, `agentRun`, `toolCall`, `fileCard`, `fileAttachment` |
| Pickers / action menus / search | `select`, `combobox`, `dropdownMenu`, `popover`, `commandPalette` |
| Forms / confirmation / preferences | `inputField`, `textarea`, `switchControl`, `checkbox`, `radio`, `modal`, `tabs` |
| Tasks / routine history / usage | `dataSection`, `table`, `metricCard`, `chartSection`, `chart`, `emptyState` |
| Workflow / delegation graph | `canvas`, `wire`, existing cards and tool-call states |

Confirmed source capabilities: Canvas controller exposes pan, zoom, and fit; AgentRun supports thinking/tool/progress steps; AppShell accepts detail content and exposes sidebar collapse. These primitives do not by themselves supply a complete workflow editor, scheduler, trace replay, or resizable panel controller.

Shared additions to evaluate during implementation: reusable splitter/panel width control, graph node/port editing and keyboard alternatives, schedule calendar layout, trace explorer with metric summary/replay, context breakdown. Extend central components where a missing reusable capability is required, with types/catalog examples and consumer checks. Application simulation, entity relationships, route handling, and scheduling policies belong in the demo modules.

## Implementation sequence and acceptance

1. Agent Bot shell, navigation/state, agent chat, new thread, reply/branch/reaction, model/context pickers, useful simulated answers, stop/retry, artifact preview.
2. Tasks, channel collaboration, agent creation/settings, instructions/memories/skills/files, mock integration state.
3. Routines, schedule, workflow/delegation canvas, run trace, usage data.
4. Responsive/keyboard verification, light/dark, narrow layout, refresh/back/forward, long content, empty/error/approval/interrupted states.

Each functional menu should produce a coherent page, panel, form, or local action. Keep the rail/sidebar node identity through navigation. On narrow screens, allow navigation/detail drawers without crushing the chat, and return focus to their trigger when closed. Do not expose desktop-only OS settings as fake working browser permissions.

Acceptance journeys: launch scenario from chat through approval and artifact; task through completion and follow-up; routine creation through test/history/calendar; workflow through approval and output; cancelled/failed run through retry; refresh and browser history on nested routes with all state intact. Use meaningful interaction/browser checks for those journeys, plus existing package gates for central API/CSS changes.

## Boundaries of this inspection

All main app destinations, all ten workspace-settings sections, and the listed agent subflows were opened. This is not an exhaustive test of every control or native integration. OAuth, billing, account/session changes, permissions, native software/download/update execution, microphone, publishing, and destructive actions were not exercised. Workflow connections/run, trace replay, month/day calendar interactions, refresh persistence, and full responsive/keyboard behavior of the reference remain unverified. Treat them as implementation requirements to validate locally, not as proven reference behavior.
