# SVG Charts

Load charts.js after workspace-blocks.js and library.js. library.css imports charts.css. No React, Tailwind or network chart dependencies.

```js
const plot=SESAMA_CHARTS.chart({
 type:'area',label:'Weekly revenue',height:240,
 data:[{label:'Mon',revenue:32,orders:20},{label:'Tue',revenue:45,orders:28}],
 series:[{key:'revenue',label:'Revenue'},{key:'orders',label:'Orders'}]
});
const block=SESAMA_CHARTS.section({title:'Performance',description:'Example weekly values',chart:plot,variant:'bordered'});
```

Types: line, area, bar (grouped), stacked bar, donut. Data is an ordered array with label and numeric fields. Series specify key, label and optional semantic CSS color. Donut uses the first visible series and categories in data. Values must be finite and nonnegative; negative/diverging charts are not supported. Avoid implying support for large datasets or zoom/pan. Amounts may use format currency with currency USD or another Intl currency code. Percent format expects percentage points (e.g. 42 means 42%).

Auto initialization and ResizeObserver adapt the SVG to the container. Keyboard-focusable data regions offer tooltip details with left/right/Home/End navigation. Legend buttons toggle series on Cartesian charts; donut legend identifies categories. View data supplies an accessible table fallback. Tooltip closes on scroll/Escape. Loading/empty/error states use the same chart footprint. No unnecessary entrance animation.

For updates, call SESAMA_CHARTS.update(rootElement,{data:newRows}) after initialization. Use SESAMA_CHARTS.init(container) if explicit mounting is needed. New markup is initialized automatically. Keep chart content in Page Grid and Chart Section; do not handcraft chart SVG or duplicate axes/tooltips in page code.

Chart Section has title, optional description/actions, chart, optional footer; bordered and plain variants. Actions accept shared Select/Button HTML. A filter must call chart update through application logic; the catalog filter is only a layout example and is labelled accordingly.
