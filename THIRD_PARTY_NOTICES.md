# Third-party notices

## Rune icon artwork

Source: https://github.com/Runeicons/runeicons and https://runeicons.com.

The included license distinguishes icon artwork (Apache-2.0) from site software and third-party brand marks. Preserve [the complete included terms](assets/rune-icons/LICENSE). Sesama does not relicense Rune website code or design under its own code license.

## Brand marks

Google, GitHub, OpenAI, Anthropic/Claude, Google/Gemini, Copilot, Grok and other marks shown in examples are trademarks of their respective owners. They are not covered by the original Sesama code license, and their display does not imply endorsement.

`assets/ai-logos` contains SVG marks extracted from supplied reference markup; authoritative provenance/redistribution review remains a release blocker for shipping these in a public package. `assets/brands/github.svg` originated from a locally authored inline path; `google.svg` uses the familiar multicolor G artwork. Replace/verify against authoritative permitted assets before a packaged release. These assets are not evidence of completed integrations.

## Typography

Inter is self-hosted: `src/styles/fonts.css` declares a local `@font-face` over `assets/fonts/InterVariable.woff2` (SIL Open Font License 1.1, see NOTICE). No request is made to a third-party font CDN; the system-font stack remains the fallback when the stylesheet is omitted.

## Publication scope

This repository is a development snapshot, not a license audit or a published distributable. Reference attachments and recordings are not included. Marketing/example assets will be separated from the component package before release.
