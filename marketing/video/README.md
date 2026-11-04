# Sesama UI — Build faster. Keep your freedom.

45-second English product-film draft. 1920 × 1080, 30 fps, nine scenes.
This first cut is silent: typography carries the message. Voiceover copy below is a production script, not a recorded track. Add licensed music and recorded narration before releasing an audio version.

## Run

```sh
cd marketing/video
npm ci
npm run studio
npm run typecheck
npm run still
npm run render
```

If the automatic browser download is unavailable, append `-- --browser-executable="<absolute path to chrome.exe>"` to still/render. Render the gentler version with `npx remotion render src/index.tsx SesamaPromoReducedMotion out/sesama-promo-reduced.mp4`. Both timelines are frame-driven and can be scrubbed backwards; no wall-clock animations or live network assets are used. Video cannot automatically respond to a viewer's motion preference; the alternative composition is a separate export.

Remotion and React are isolated production dependencies here, not Sesama UI runtime dependencies. Implementation follows https://www.remotion.dev/docs/composition and https://www.remotion.dev/docs/render.

## Storyboard and proposed voiceover

| Time | Picture | Voiceover |
| --- | --- | --- |
| 00–04 | Interface hero, generous whitespace | Your next interface is already taking shape. |
| 04–10 | Actual builder output gives way to the dashboard | Compose components and blocks into one coherent experience. Spend less time setting up, and more time building. |
| 10–15 | Subpath import, ESM / zero / HTML proof points | Pure ES modules. Zero runtime dependencies. Import what you use. |
| 15–20 | Builder branches to browser, server, build time | Keep your architecture. Render in the browser, on the server, or at build time. |
| 20–25 | Typed ButtonOptions and illustrated suggestions | With TypeScript declarations, your next step is easier to discover. |
| 25–31 | Light and dark dashboard pair | One design language. Semantic tokens and scoped styles, in every light. |
| 31–36 | Focus illustration and lifecycle code | Thoughtful controls. Keyboard navigation. One runtime to bring it together. |
| 36–40 | MIT, source, agent skill | Open source. Ready for you and your coding agent to build on. |
| 40–45 | Logo, positioning, install command | Sesama UI. Build faster. Keep your freedom. |

## Claim boundaries and source of truth

- Pure ESM and subpath imports: root `package.json` exports and `src/components/button.mjs`.
- Zero runtime dependencies: root `package.json`; production dependencies in this video package do not apply to the library.
- Framework agnostic: HTML-string builders, not framework-specific native adapters. No React/Vue/Svelte integration demo or certification is implied.
- TypeScript ready: `.d.mts` declarations, not a claim that implementation is written in TypeScript. The suggestion panel is an editorial illustration.
- Render without a DOM: pure builder source and `tests/api.test.mjs`.
- Scoped styling and theme support: `src/styles/tokens.css` and component CSS. Do not claim immunity from external host CSS.
- Runtime lifecycle: `src/runtime.mjs`; keyboard/focus behavior is an existing library capability. The focus ring in this video is an illustration, not a live keyboard test or accessibility certification.
- MIT: root LICENSE, subject to third-party notices. Agent guidance: `skills/sesama-ui/`.
- Speed is qualitative. No time-saving benchmark or generation-from-prompt feature is claimed.
- Alpha is disclosed in the closing card. Complex experimental controls are not promoted as stable.

The strongest positioning is the combination of a coherent design language, reusable page blocks, portable builders, explicit lifecycle, and agent instructions. Individual features such as ESM or TypeScript support are benefits, not by themselves a defensible moat.

## Assets and editing

The component tiles call canonical Sesama builders and import canonical CSS without internal overrides. Dashboard images are copies of the existing repository documentation screenshots; data shown is illustrative. `public/mark.svg` comes from `assets/brand/sesama-mark.svg`. Inter comes from the repository's OFL font asset (see root NOTICE). Refresh these snapshots if the product visual changes.

Edit scene timing/copy in `src/index.tsx` and editorial composition styles in `src/video.css`. Entrance motion uses transform/opacity and a strong ease-out; the video is an explanatory marketing surface, not an interaction recording. Check pacing at normal speed before selecting a soundtrack.
