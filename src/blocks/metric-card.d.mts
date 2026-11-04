import type { Surface } from '../surface.d.mts';
export type MetricTone = 'success' | 'error' | 'neutral';
export type MetricSize = 'default' | 'compact';
export type MetricState = 'ready' | 'loading';

export interface MetricSummaryOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  value?: string;
  change?: string;
  description?: string;
  tone?: MetricTone;
  size?: MetricSize;
}

export interface MetricCardOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  label?: string;
  value?: string;
  change?: string;
  description?: string;
  tone?: MetricTone;
  size?: MetricSize;
  state?: MetricState;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function metricSummary(options?: MetricSummaryOptions): string;
export function metricCard(options?: MetricCardOptions): string;
