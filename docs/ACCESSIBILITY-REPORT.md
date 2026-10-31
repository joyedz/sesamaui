# Preview component accessibility report

Date: 2026-10-31. Status: **automated checks pass; API remains preview**.

Priority update: manual screen-reader review is deferred at the user's request. Current work focuses on functional component APIs. Native Select form integration and lifecycle follow-up are covered by `npm run test:functional`; the current contract is documented in [Component API preview](COMPONENT-API-PREVIEW.md). Deferred accessibility review does not block that development work.

Scope: Button, Input/Input Field, Select and Modal in the ESM preview. This is not an accessibility certification of all 48 catalog families or every demo's domain content.

## Results

Local environment: Windows, Playwright 1.64.1, axe-core 4.14.0.

| Engine | Version | Axe scenarios | Violations | Keyboard / CSS isolation | Existing page smoke tests |
| --- | --- | --- | --- | --- | --- |
| Chromium | 156.0.8078.4 | 12 | 0 | Pass | 13 pages pass |
| Firefox | 157.0 | 12 | 0 | Pass | 13 pages pass |
| WebKit | 27.2 | 12 | 0 | Pass | 13 pages pass |

The 12 scenarios per engine cover light/dark default controls (including error, disabled and readonly cases), required Select feedback, grouped Select open, Modal open, a Select inside Modal, 320px reflow, and forced colors with reduced motion. Axe checks the applicable WCAG 2 A/AA, 2.1 A/AA and 2.2 AA tags. The matrix therefore contains 36 scenario runs, not 36 independent accessibility standards.

Keyboard automation checks password activation with Space, disabled-option skipping, Home/End/arrows/typeahead, Enter, Escape, Tab/Shift+Tab, linked error feedback, focus containment/return, background scroll preservation, nested popup closure/reopening, teardown and reduced motion. CSS checks confirm per-component dependencies, no chart/app-shell/font imports, no host-control reset, and preserved control sizing/padding in aggregate styles.

Ten pure API/CSS tests and JavaScript/generated-source checks also pass. Functional tests cover native form data/validation/submission, disabled fieldsets, canceled resets, duplicate option labels, setters/events, overlapping mounts, password reset and immediate Modal reopen. CI is configured to run the browser matrix and upload `.qa/` reports; remote CI has not been claimed as executed by this local report.

## Issues corrected

- Grouped listbox dividers used `role="separator"`, which is not a permitted listbox child. They are now decorative presentation elements.
- Light-mode group labels had about 3.01:1 text contrast. The shared placeholder/metadata token now provides stronger light-mode contrast.
- Error text had 4.48:1 contrast on the canvas. Error text now has a separate semantic color from the danger surface.
- The dark danger button had 3.02:1 white-text contrast. A separate danger-fill token now preserves readable white labels in both themes.
- Select triggers now reference both their visible label and current value, including before controller mounting. Unlabelled visible fields support an explicit `ariaLabel`.
- Required Select feedback is visible, associated with the trigger, and announced through a polite live region. App submit handlers respect canceled submission.
- Modal Tab navigation could reach outside its content. Explicit boundary handling now keeps keyboard focus within the modal.
- Select Tab/Shift+Tab behavior was inconsistent after hiding its popup. It now moves to the intended adjacent control, respecting a containing modal.
- Closing a Modal with a nested popup could leave the Select's expanded state stale. Popup cleanup and native toggle synchronization now keep them aligned.
- Aggregate stylesheet imports could reset Select padding. Scoped baseline resets now have zero specificity, with a regression check for the 8px padding.
- Forced-color and reduced-motion styling, disabled hover guards, and visible input focus were added or preserved centrally.

## Findings still requiring human review

Axe reports `aria-valid-attr-value` as **incomplete** for popup relationships: it cannot establish the referenced popup's existence in its accessibility tree. These findings are retained in the JSON report, not disabled or counted as passes. Separate assertions verify every ARIA ID resolves in the DOM, and the open/close/keyboard paths work in each tested engine. Actual spoken announcements still require assistive-technology verification.

Before claiming AA conformance or freezing the full widget contract:

1. Run NVDA with Chrome/Firefox and VoiceOver with Safari. Confirm the field label, current value, group names, disabled state, errors, and dialog title/description are announced meaningfully.
2. Verify real Safari and touch/zoom behavior. Playwright WebKit is not a substitute for Safari/VoiceOver testing.
3. Review non-text contrast of the default subtle Input/Select boundaries and every focus state. Automated text-contrast checks do not certify those boundaries. `prefers-contrast: more` and forced-color alternatives are present.
Native Select form-validation integration is now complete for the preview controller: an actual native select backs the custom UI, including `form.checkValidity()`, `FormData` and native submission/reset behavior. It is no longer an outstanding item in this manual-review list.

## Reproduce

```sh
npm ci
npx playwright install chromium firefox webkit
npm run check
npm test
npm run test:browser
npm run test:functional
npm run test:keyboard
npm run test:a11y
```

Set `BROWSER=firefox` or `BROWSER=webkit` to use those engines; the default is Chromium. On Linux CI, install browsers with `--with-deps`. An optional `CHROME_PATH` selects an installed Chromium executable. `PLAYWRIGHT_PATH` may select another installed Playwright module.

Fixtures: `tests/fixtures/components.html`. Machine-readable results: `.qa/a11y-results-<engine>.json` and `.qa/keyboard-<engine>.json`. The fixture is test-only; it is not an additional product login page.

Manual review should cover: first/last Tab wrapping in the Modal, Escape from nested Select before closing the Modal, meaningful selected-value announcement, error discovery after submission, and returning to the opener without moving the background page.

References: [WAI listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/), [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), and [axe-core documentation](https://github.com/dequelabs/axe-core).
