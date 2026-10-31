export interface EmptyStateOptions {
  title?: string;
  description?: string;
  icon?: string;
  actions?: string;
  compact?: boolean;
  attributes?: string;
}

export declare function emptyState(options?: EmptyStateOptions | string): string;
