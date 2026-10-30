# Contributing

Sesama UI is preparing its first public release. Please open an issue before substantial API, architecture or visual changes.

## Local workflow

1. Use Node.js 22 or later and run `npm run dev`.
2. Make component changes in the shared source, then consume them from catalog/examples.
3. Preserve existing states and behaviors. Avoid private component restyling inside demo pages.
4. Run `npm run check` and test affected interactions in a real browser, light/dark modes and narrow layouts.
5. Describe the change, validation and any compatibility implications in the pull request.

Follow the [release plan](docs/OPEN-SOURCE-RELEASE-PLAN.md) for packaging, API and accessibility work. Do not claim axe, screen-reader or cross-browser results unless actually checked. Never commit keys, personal data, local caches or reference captures.

Third-party assets need a documented source and redistribution terms. New assets must not rely on an inaccessible relative URL from a reference website.
