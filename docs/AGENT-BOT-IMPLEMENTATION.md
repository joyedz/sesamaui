# Agent Bot demo scope and plan

## Three main features

1. **Agent Chat**: three role-specific agents (Atlas coordinator, Scout researcher, Forge builder), independent threads, model selection, persistent drafts, staged simulated responses, stop/retry, generated brief preview/download.
2. **Tasks**: create a task, assign an agent, follow queued/running/completed states, inspect its result, approve/decline a sample change, retry failures, open its linked conversation.
3. **Agent Settings**: edit name, role, instructions, and demo model; save locally and reflect changes in navigation/chat.

Supporting behavior: persistent shell, addressable hash routes, browser history, sidebar/theme preferences, local storage, narrow screens, keyboard access, interrupted-run recovery. These support the three features rather than adding new product areas.

Excluded: channels, marketplace/integrations, workflow editor, routine scheduler/calendar, usage/billing, voice/computer use, full knowledge management, agent publishing. Existing demos are preserved. All outputs and checks use fictional sample data; no external execution.

## Implementation plan

1. Add a separate Agent Bot entry under Demo / AI Agent. Build its shell and pages using central ESM builders.
2. Add versioned local entities for agents, threads/messages, tasks, runs, and preferences. Keep routing separate from response simulation.
3. Implement contextual response scenarios: daily priorities, competitor brief, pricing change approval, generic role-aware answer, and an intentional failed-source example.
4. Connect chat, task detail, approval, settings, artifact preview/download, and recovery actions.
5. Verify main journeys, cancellation/retry, persisted drafts/settings/history, escaping, mobile overflow, theme, and browser errors. Run package check and unit tests.

## Acceptance

- Navigating among the three pages keeps the same shell/sidebar DOM nodes.
- Refresh retains route, threads, draft, model/settings, task results, sidebar, and theme. Interrupted runs become retryable rather than spinning indefinitely.
- Scout creates a useful fictional comparison and downloadable brief; Forge's proposed pricing change needs explicit demo approval.
- Stop prevents late results; failed/cancelled/interrupted work can retry without duplicating the user message.
- Task assignment determines the answering agent; opening the conversation selects its matching thread.
- User text is escaped; local demo data never becomes executable markup.
- Existing Chat and Agent directory remain available and unchanged.

## Delivered and verified

Entry: `demos/Agent Bot.html`, available under landing Demo → AI Agent → Agent Bot. Uses the central ESM runtime and shared component/block builders.

Verified: package build/check, 147 existing unit tests and 4 new scenario/recovery/API tests; Agent Bot interaction journeys in Chromium and WebKit; landing navigation in Chromium. Checked desktop, 390px and 320px layouts, light/dark, saved drafts/settings/theme/sidebar, thread history, task approval, artifact preview/download, stop/retry/interrupted work, keyboard navigation, and escaped user input. Axe found zero violations across the three default page views in light and dark; manual screen-reader review was not performed.

Small shared additions: `workspaceSidebar.projectsTitle` and File Card `--file-card-max-width`, both preserving existing defaults, with catalog examples and API notes.

## Reference layout update

Conversation and composer layouts are centered with an 880px maximum width. Each bot has ten example messages, including simulated tool runs and detailed responses composed from shared tables and banners, plus lists, source notes, and code. Examples migrate once while retaining saved chats and drafts. Structured response text is escaped; all evidence and tool output are fictional. Verified the updated Chromium journey, six scenario/recovery/rendering tests, package check, mobile overflow, and a focused axe scan of the detailed conversation.

Adapted the supplied OpenBot HTML and dark theme reference: 48px global rail, 332px agent sidebar on wide desktop (280px on smaller screens), searchable agent rows with role/preview, compact header with model picker, headerless neutral bubbles with outgoing messages on the right, and a full-width 54px compact composer. The plus button opens the scenario prompts. Mobile keeps the rail and opens the team sidebar as an overlay. Theme preference is local to Agent Bot; dark is its initial appearance.

Reverified Chromium and WebKit interaction journeys, previous AI New Chat behavior, package build/check and unit tests. The six default page/theme combinations passed the axe scan. All four new component examples are available through the live catalog.

## Right-side agent editing

Chat header Edit agent opens the App Shell detail slot instead of replacing the conversation. The panel composes central Page Header, Input, Textarea, Select, List Row, Switch and Collapsible builders. It follows the supplied reference groups and saves identity/model/response preferences locally. Close, Cancel and Escape dismiss the panel; narrow screens use the existing detail overlay layout. Supporting settings links show simulated feedback. The global Agent Settings page remains available.
