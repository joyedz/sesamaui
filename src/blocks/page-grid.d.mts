import type { Surface } from '../surface.d.mts';
export interface PageGridItem {
  html: string;
  span?: number;
  tablet?: number;
  mobile?: number;
}

export interface PageGridOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  compact?: boolean;
  id?: string;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function pageGrid(items?: PageGridItem[], options?: PageGridOptions): string;
