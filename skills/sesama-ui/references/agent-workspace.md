# Agent/workspace assembly

## Reference hierarchy

`Requirements dashboard.html` supplies Sesama workspace structure: canvas background, inset panels, small gaps/radii, concise toolbar, navigation tree and optional detail panel. `AI agents demo.html` is a current integration example, not a new design system. Prefer its working flow over its accumulated local CSS. User requests apply to their component scope: a ChatGPT-like Composer request is not authorization to make the entire app a ChatGPT clone.

## Sidebar

The current agent demo uses a 240px sidebar. Workspace is central Select inline, with icon choices, a titled group and a separated Create workspace action at the bottom. Group selection must update label, icon, hidden value, selected background and checkmark together.

New chat and other navigation use Tree, not bespoke buttons. Projects use `treeSection` with Add project. Project -> conversations is two levels; conversation children have no icons and natural titles, ellipsis and regular 400 weight. Do not add another history level without a request. Profile/avatar and theme/notification actions sit at the bottom.

Collapsed sidebar is an icon rail; Projects uses horizontal ellipsis. Hover waits 200ms to open and exit waits 200ms to close. Cancel pending close on re-entry and pending open on exit. Explicit Hide closes immediately even while hovered. Overlay expansion has no floating shadow and must not shift chat, Composer or page title. Respect reduced motion. Test actual main-panel bounds; changing a grid child to fixed positioning can accidentally place the main page in the narrow rail column.

## Chat and Composer

- New chat has one centered greeting title, currently “Let’s think it through.”, then Composer and the demo note as one vertically centered group. First send returns Composer to the bottom.
- Conversation and Composer share a comfortable centered width, about 720px content. Configure `--message-width:100%` on the conversation container. Do not stretch reading text across the whole workspace.
- For this agent flow, omit sender headers (You/AI/Research agent). If this requires a variant, add a supported option centrally. AI responses have no background; outgoing messages keep the central brand-tinted bubble.
- Message actions are Icon Buttons; Retry on error retains text. Click feedback is a short Tooltip, not a persistent helper below the message.
- Composer uses shared Selects, Icon Buttons, Menu, File Card and tokens. Text starts at two lines, auto-expands to the central limit, and resets after send. Context/model labels maintain 8px to the chevron, grow while space permits, then ellipsize. The surface has no hover background.
- While thinking, Send becomes Stop with a solid square. Do not register competing send handlers; coordinate application handling with shared delegated behavior. Stop cancels the pending response; new chat/switching conversations cancels stale work.
- Attachments can send without text. Draft files form a compact four-column grid (two on narrow screens). Sent files use central File Cards in a vertical stack with 8px bottom spacing, not a two-column layout. Expand previews inline. Clear draft attachments after send, while preserving message previews.
- Example conversations should match their titles. Keep per-conversation messages when switching during the session. Long examples verify scrolling. Never imply that demo AI output actually read documents or executed tools.
- A floating-feel Composer has no full-width divider. Fades at the chat edges depend on whether content exists above/below. Verify the first/last message, no clipped content, and no forced scroll while reading older responses.

Keep all user-visible UI and dummy conversations in English unless requested otherwise. Keep model lists configurable and provider-grouped. If asked for latest model names, verify official provider catalogs instead of inventing names.
