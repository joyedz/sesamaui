export type PageLayoutVariant = 'dashboard' | 'data' | 'conversation';

export interface PageLayoutOptions {
  content?: string;
  variant?: PageLayoutVariant;
  compact?: boolean;
  id?: string;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function pageLayout(content?: string | PageLayoutOptions, options?: PageLayoutOptions): string;
