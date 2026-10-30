# Application structure: use the blocks

The Sales reporting trial reused Tree and Select but rebuilt the rest of the application. Its custom 216px shell, oversized header and private sidebar departed from Sesama. Its raw table inherited max-width:300px. Avoid this by using actual structural builders, not a visual description.

## Mandatory starting point

Load `workspace-blocks.js` after `library.js`. All builders return HTML strings; slots take trusted HTML, so escape any user-provided content.

```js
const B=SESAMA_BLOCKS;
app.innerHTML=B.appShell({
 sidebar:B.sidebar({
  workspace:'Sesama workspace',
  navigation:[{n:'Sales reports',i:'grid-3x3',key:'sales',selected:true}],
  projects:[{n:'Website launch',i:'folder',k:[{n:'Review launch checklist',i:false,key:'launch'}]}],
  profileName:'Nils Eller',initials:'N'
 }),
 header:B.pageHeader({title:'Sales reports',icon:'grid-3x3'}),
 content:B.pageLayout(B.pageGrid([
  {html:B.dataSection({title:'Products',table:tableHTML}),span:12,tablet:6}
 ]),{variant:'dashboard'})
});
```

`tableHTML` must come from the central Table builder/example, rather than an independently styled HTML table. Current export is `SESAMA_UI.getExamples('Table')`; inspect its variants and event/data requirements. `dataSection` also guards table width to fill the container.

## Responsibilities and contracts

- `appShell({sidebar,header,content,footer,detail})`: canvas background; 8px gap/inset; 240px sidebar; inset central panel with independent scroll. Optional right detail is 300px. Footer can host a central Composer. Collapse creates a 48px rail. Hover opens after 200ms; exit waits 200ms. Content and header do not move on hover; no overlay shadow. Reduced motion is honored.
- `sidebar({workspace,workspaces,navigation,projects,profileName,initials,projectActions})`: composes central Select, Tree, Tree section, Avatar styling and Icon Buttons. `projectActions` is the `treeSection` action config. Application handlers supply project creation and other business actions. Standard workspace selection and theme toggle work locally.
- `pageHeader({title,icon,actions})`: default icon + title. Actions are optional. Do not add a second giant page title or breadcrumb row automatically.
- `pageLayout(html,{variant,compact})`: dashboard has 1440px maximum outer width, data uses full width, conversation has 768px outer width (720px reading area with default padding). Padding 24px default, 16px compact/narrow.
- `pageGrid([{html,span,tablet}],{compact})`: 12 desktop columns above 1100px; 6 tablet columns down to 600px; 1 mobile column. Gap16px or compact8px. Every item has min-width:0. A full table uses span12/tablet6. Four metrics use span3/tablet3. Main chart span8, breakdown span4, both tablet6. Sidebar is outside this grid.
- `dataSection({title,description,actions,filters,table,pagination})`: consistent section header and slots. Use central Table, Select, Pagination, Skeleton and Empty State as needed. Table width is 100%, max-width none. Horizontal scrolling stays inside the data content.

Do not copy `AI agents demo.html` CSS as a shell implementation. It is an accumulated reference consumer; new pages should use these blocks. Existing pages can be migrated to the blocks as part of an explicitly requested page update, preserving their business behavior.

## Missing components

Chart and Chart Section now exist centrally in charts.js / charts.css. Use SESAMA_CHARTS.chart and SESAMA_CHARTS.section; read charts.md. Metric Card, Content Section, People List, Activity Feed and Dashboard Overview also exist centrally in workspace-blocks.js. Read content-blocks.md when building dashboard content.

## Browser acceptance

Verify a standalone starter at desktop, tablet and mobile. Measure that table width equals its available container, grid items fit their tracks, and sidebar matches 240px. Test collapse plus delayed hover and confirm main/header bounds stay unchanged during hover. Check shared controls retain their component styles and computed typography. Report checks actually performed, not a blanket visual guarantee.
