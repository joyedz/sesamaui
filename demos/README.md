# Application demos

Run `npm run dev`, then open http://127.0.0.1:4173. Pages and landing previews use `shared/pages.mjs`.

| Category | Pages |
| --- | --- |
| Dashboard | [Overview](Dashboard%20overview.html), [Revenue](Revenue%20report.html), [Orders](Orders.html), [Customers](Customers.html) |
| AI Agent | [Chat](AI%20agents%20demo.html), [Agent](Agents.html), [Agent Bot](Agent%20Bot.html) |
| Issue Workspace | [Inbox](Issue%20workspace.html), [My issues](My%20issues.html), [Review](Reviews.html), [All issues](All%20issues.html) |
| Onboarding | [Login](Login.html) |

Dashboard URLs share one persistent app shell: navigation swaps the main content without reloading the sidebar. Direct URLs, refresh, and browser Back/Forward remain supported. Page controllers live in `dashboard/` and clean up listeners, runtime sessions, and dialogs when leaving a page. Other categories retain their individual page documents. Sidebar collapse, expanded branches, and workspace selection persist per category in localStorage. Theme preference is shared across demos. Revenue filters and Orders/Customers search, filters, sorting, and pagination, Issue Workspace filters and tabs, and the chat draft/route persist across refresh. Issue detail URLs use `?issue=ID`. Storage is optional; demos still work when it is unavailable. Chat responses and attachments are simulated and are not durable backend records.

Additional reference demos remain available directly: [Workspace](Workspace%20demo.html), and [Component API](Component%20API.html).

Shared components are in `src/`; the catalog and landing page are in `site/`.

Agent Bot demonstrates three connected features: agent chat, assigned tasks, and agent settings. Responses, approval, and generated brief files use fictional local data. Threads, drafts, settings, tasks, route, and sidebar state persist locally; interrupted runs can retry. Scope and plan: `docs/AGENT-BOT-IMPLEMENTATION.md`. Verify with `node tests/agent-bot.cjs`.

Run `node tests/dashboard-navigation.cjs` to verify persistent Dashboard navigation, filters, history, dialogs, and direct URLs (`BROWSER=chromium|firefox|webkit`).

AI Agent New Chat uses a light/dark gradient and decorative type/erase placeholder suggestions. They stop after user editing, never change the input value, and remain static with reduced motion. Verify with `node tests/ai-new-chat.cjs`.

Animated product tour: [Sesama UI in motion](../marketing/product-demo.html) — shared components, the Orders dashboard, and the AI workspace, with chapter controls and reduced-motion support.
