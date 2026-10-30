# Dashboard content patterns

Use SESAMA_BLOCKS builders from workspace-blocks.js. Sources take precedence as APIs evolve.

- contentSection({title,description,actions,content,footer,variant}): shared header/body/footer. Variant plain, bordered or divided. Description/actions/footer optional. Chart Section and Data Section compose this builder rather than maintaining their own headings.
- metricCard({label,value,change,description,tone,state}): label, value, comparison; tone success/error/neutral must reflect business meaning (a lower response time can be good). State loading provides Skeleton. Default description is English. Omit change for a simple metric.
- peopleList({people,emptyMessage}): people have name, optional initials, status Online/Away/Offline and metadata. Names and metadata are escaped. Rows use shared Avatar and Status Dot styles. No fake row navigation.
- activityFeed({items,emptyMessage}): title, time, optional datetime (machine-readable ISO), optional Rune icon. Render chronological sample activities with metadata; no automatic click behavior.
- dashboardOverview(): sample overview using four Metric Cards, central area/donut/stacked-bar charts, People List, Data Section with central Table and Activity Feed. This is a composition template, not a data connector. Use it as reference and configure real blocks for the requested business data.

Dashboard overview.html is a standalone consumer without private component styles. Recommended grid: metrics span3/tablet3; main chart span8; breakdown span4; supporting chart span8 plus people span4; data span8 plus activity span4. On tablet supporting sections use all six columns; on mobile all stack. Keep shared 16px gaps.

Keep report filters/data updates in application logic. Do not imply an unrelated chart or list changes when a layout-only sample control is clicked. Keep visual tokens, typography, empty/loading states, and internal spacing in central builders/styles.
