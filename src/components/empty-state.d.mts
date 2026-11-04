import type { Surface } from '../surface.d.mts';
export interface EmptyStateOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  title?: string;
  description?: string;
  icon?: string;
  actions?: string;
  compact?: boolean;
  attributes?: string;
}

export declare function emptyState(options?: EmptyStateOptions | string): string;
