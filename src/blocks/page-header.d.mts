import type { Surface } from '../surface.d.mts';
export interface PageHeaderOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  title?: string;
  /** Trusted HTML replacing the default heading/description content. */
  titleContent?: string;
  icon?: string;
  description?: string;
  actions?: string;
  breadcrumbs?: string;
  meta?: string;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function pageHeader(options?: PageHeaderOptions): string;
