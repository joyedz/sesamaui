export interface PageGridItem {
  html: string;
  span?: number;
  tablet?: number;
  mobile?: number;
}

export interface PageGridOptions {
  compact?: boolean;
  id?: string;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function pageGrid(items?: PageGridItem[], options?: PageGridOptions): string;
