export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  current?: boolean;
}

export interface BreadcrumbsOptions {
  items?: BreadcrumbItem[];
  separator?: string;
  maxItems?: number;
  ariaLabel?: string;
  attributes?: string;
}

export function breadcrumbs(options?: BreadcrumbsOptions): string;
