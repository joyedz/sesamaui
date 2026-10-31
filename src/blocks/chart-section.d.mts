import type { ContentSectionVariant } from './content-section.mjs';
import type { MetricCardOptions } from './metric-card.mjs';

export interface ChartSectionOptions {
  id?: string;
  title?: string;
  description?: string;
  actions?: string;
  chart?: string;
  metrics?: (MetricCardOptions | string)[] | string;
  summary?: string;
  footer?: string;
  variant?: ContentSectionVariant;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function chartSection(options?: ChartSectionOptions): string;
