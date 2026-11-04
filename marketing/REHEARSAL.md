# Sesama product tour

Open `/marketing/product-demo.html` with the repository's HTTP server.

Story: compose workspace settings, find a customer's orders, then prepare a task in the AI Composer. Three chapters run once and hold the last result. Play/pause, replay, chapter selection, theme switching, and links to the full pages are available. Reduced motion starts with a still and explicit playback.

Reference: https://www.ui-skills.com/skills/benjitaylor/stageshow and its hero-demo, craft, and motion references. Adapted the measured cursor and short cause/result beats to native ESM. This is not a copy of the React kit or gold example; the Stageshow film gate was not run. Uses actual central Sesama builders and existing demo documents instead.

Verified with local Chrome through Playwright: desktop (1440px), narrow viewport (390px), no page overflow, complete chapter progression, Orders search `Amelia` produces six rows, pause freezes progress, AI draft matches the scripted task, theme switching, and reduced-motion startup. No page errors in the tested walkthrough. Screenshots inspected for desktop, mobile, dark Orders, and AI workspace. No Firefox, WebKit, axe, or screen-reader claim.

The AI scene leaves a draft and never sends it. The embedded application pages retain their existing local simulated behavior and storage. This is a browser product demonstration, not an exported video or backend integration.
