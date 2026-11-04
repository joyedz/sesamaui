import type { Surface } from '../surface.d.mts';
import type { ContentSectionVariant } from './content-section.mjs';
import type { MetricCardOptions } from './metric-card.mjs';

export interface ChartSectionOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
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
