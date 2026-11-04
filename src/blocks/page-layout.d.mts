import type { Surface } from '../surface.d.mts';
export type PageLayoutVariant = 'dashboard' | 'data' | 'conversation';

export interface PageLayoutOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  content?: string;
  variant?: PageLayoutVariant;
  compact?: boolean;
  id?: string;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function pageLayout(content?: string | PageLayoutOptions, options?: PageLayoutOptions): string;
