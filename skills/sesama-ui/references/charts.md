# SVG Charts and Analytics

Sesama UI includes built-in, dependency-free SVG charts. They render semantic markup on the server or client and progressively hydrate with interactive tooltips, keyboard navigation, and responsive scaling.

## Public Chart Components

Import directly from `src/index.mjs`:

```js
import { chart, initChart, chartSection, mount } from './src/index.mjs';

const revenuePlot = chart({
  type: 'area', // 'line' | 'area' | 'bar' | 'stacked-bar' | 'donut'
  label: 'Weekly Revenue',
  height: 240,
  data: [
    { label: 'Mon', revenue: 3200, orders: 40 },
    { label: 'Tue', revenue: 4500, orders: 55 },
    { label: 'Wed', revenue: 4100, orders: 50 },
    { label: 'Thu', revenue: 5800, orders: 72 },
    { label: 'Fri', revenue: 6200, orders: 85 }
  ],
  series: [
    { key: 'revenue', label: 'Revenue ($)', color: 'var(--color-primary)' },
    { key: 'orders', label: 'Orders', color: 'var(--color-secondary)' }
  ],
  format: 'currency',
  currency: 'USD'
});

const section = chartSection({
  title: 'Revenue Trends',
  description: 'Daily revenue vs order volume for the current week',
  chart: revenuePlot,
  variant: 'bordered'
});
```

## Supported Chart Types

- **`'line'`**: Multi-series continuous line plot.
- **`'area'`**: Filled gradient area chart.
- **`'bar'`**: Grouped column bar chart.
- **`'stacked-bar'`**: Stacked column chart.
- **`'donut'`**: Radial proportion donut chart with legend and center statistics.

## Interactive Features & Accessibility

- **Responsive scaling**: Automatically adapts to container width using `ResizeObserver`.
- **Keyboard navigation**: Data points are focusable using Tab, and navigable with Left/Right/Home/End keys.
- **Accessible tooltips**: Displays precise values on hover and keyboard focus; dismisses on Escape or scroll.
- **Accessible table fallback**: Embeds an accessible hidden `<table>` representing the raw data for screen readers.
- **Dynamic updates**: Controllers support `.update({ data, series })` to smoothly redraw without rebuilding the DOM.
