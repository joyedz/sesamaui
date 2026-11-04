import type { Surface } from '../surface.d.mts';
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  current?: boolean;
}

export interface BreadcrumbsOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  items?: BreadcrumbItem[];
  separator?: string;
  maxItems?: number;
  ariaLabel?: string;
  attributes?: string;
}

export function breadcrumbs(options?: BreadcrumbsOptions): string;
