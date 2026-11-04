# Issue Workspace: Linear reference adaptation

Source: user-provided Linear DOM snapshots (My issues, Reviews, Initiatives, Projects) and existing Inbox reference. Preserve reference structure; use Sesama builders and tokens. No new product concepts.

## Plan and acceptance checklist

- [x] My issues: Assigned / Created / Subscribed / Activity; status groups; consistent current user.
- [x] Reviews: For me / Created; Needs your review / You're reviewing / Completed; selected review with Activity / Guide / Diff / Preview.
- [x] Initiatives: Active / Planned / All initiatives; table with Name, Target, Health, Projects, Active projects, Activity; preserve parent/child structure.
- [x] Projects: All projects / My projects, initiative filter, roadmap with project rows and milestone labels.
- [x] Shared issue presentation: same heading, description, activity, comment and properties structure; distinct issue data.
- [x] Navigation: each reference destination renders its own content, selection survives rerender.
- [x] Verification: syntax gate, browser navigation and interactions, desktop/narrow screenshots, light/dark, no page errors.

Keep existing All issues pagination and existing Cycles/Views entries outside this reference-copy scope. Roadmap geometry and diff markup are domain content, not replacements for shared controls.

## Verification notes

Syntax gate and 143 Node tests pass. Chromium: navigation to all four pages, My issues Created, Reviews Guide, Initiatives Planned, Projects My projects plus APAC filter. Desktop light and 390px dark screenshots captured; no document overflow or page errors. Roadmap is a static reference visualization (no drag/reschedule); Preview explicitly reports unavailable. Only the first review includes the supplied diff. No backend integration is implied.
