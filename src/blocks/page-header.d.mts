export interface PageHeaderOptions {
  id?: string;
  title?: string;
  icon?: string;
  description?: string;
  actions?: string;
  breadcrumbs?: string;
  meta?: string;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function pageHeader(options?: PageHeaderOptions): string;
