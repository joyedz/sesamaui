# Application demos

Run `npm run dev`, then open http://127.0.0.1:4173. Pages and landing previews use `shared/pages.mjs`.

| Category | Pages |
| --- | --- |
| Dashboard | [Overview](dashboard/Dashboard%20overview.html), [Revenue](dashboard/Revenue%20report.html), [Orders](dashboard/Orders.html), [Customers](dashboard/Customers.html) |
| AI Agent | [Chat](ai-agent/AI%20agents%20demo.html), [Agent](ai-agent/Agents.html), [Agent Bot](ai-bot/Agent%20Bot.html) |
| Issue Workspace | [Inbox](issue/Issue%20workspace.html), [My issues](issue/My%20issues.html), [Review](issue/Reviews.html), [All issues](issue/All%20issues.html) |
| Onboarding | [Login](onboarding/Login.html) |

Dashboard URLs share one persistent app shell: navigation swaps the main content without reloading the sidebar. Direct URLs, refresh, and browser Back/Forward remain supported. Page controllers live in `dashboard/` and clean up listeners, runtime sessions, and dialogs when leaving a page. Each category lives in its own folder: `dashboard/`, `ai-agent/`, `ai-bot/`, `issue/`, `onboarding/`; shared helpers stay in `shared/`, and the Component API preview remains at the `demos/` root. Sidebar collapse, expanded branches, and workspace selection persist per category in localStorage. Theme preference is shared across demos. Revenue filters and Orders/Customers search, filters, sorting, and pagination, Issue Workspace filters and tabs, and the chat draft/route persist across refresh. Issue detail URLs use `?issue=ID`. Storage is optional; demos still work when it is unavailable. Chat responses and attachments are simulated and are not durable backend records.

The interactive Component API preview remains available directly: [Component API](Component%20API.html).

Shared components are in `src/`; the component catalog is in `site/`. The project landing page (`site/Sesama landing.html` and its assets) is local-only and gitignored — it ships with the product project, not this repo.

Agent Bot demonstrates three connected features: agent chat, assigned tasks, and agent settings. Responses, approval, and generated brief files use fictional local data. Threads, drafts, settings, tasks, route, and sidebar state persist locally; interrupted runs can retry. Scope and plan: `docs/AGENT-BOT-IMPLEMENTATION.md`. Verify with `node tests/agent-bot.cjs`.

Run `node tests/dashboard-navigation.cjs` to verify persistent Dashboard navigation, filters, history, dialogs, and direct URLs (`BROWSER=chromium|firefox|webkit`).

AI Agent New Chat uses a light/dark gradient and decorative type/erase placeholder suggestions. They stop after user editing, never change the input value, and remain static with reduced motion. Verify with `node tests/ai-new-chat.cjs`.

Animated product tour: [Sesama UI in motion](../marketing/product-demo.html) — shared components, the Orders dashboard, and the AI workspace, with chapter controls and reduced-motion support.
