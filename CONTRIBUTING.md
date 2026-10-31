# Contributing

Sesama UI is preparing its first public release. Please open an issue before substantial API, architecture or visual changes.

## Local workflow

1. Use Node.js 22 or later and run `npm run dev`.
2. Run `npm ci`. Make component changes in the shared source, then consume them from catalog/examples. Edit canonical preview styles in `src/styles/components/`, then run `npm run build`; do not hand-edit generated compatibility CSS or JavaScript.
3. Preserve existing states and behaviors. Avoid private component restyling inside demo pages.
4. Run `npm run check` and `npm test`. Install Playwright browsers and run `test:functional`, `test:browser`, `test:keyboard` and `test:a11y` for affected widgets. Test light/dark modes and narrow layouts. Functional component API work currently has priority; manual screen-reader verification is deferred.
5. Describe the change, validation and any compatibility implications in the pull request.

Document packaging, API and accessibility changes in the [changelog](CHANGELOG.md). Do not claim axe, screen-reader or cross-browser results unless actually checked. Never commit keys, personal data, local caches or reference captures.

Third-party assets need a documented source and redistribution terms. New assets must not rely on an inaccessible relative URL from a reference website.
