export type BadgeTone = 'neutral' | 'informative' | 'success' | 'warning' | 'error' | 'disabled';
export type BadgeSize = 'sm' | 'base';

export interface BadgeOptions {
  label?: string;
  tone?: BadgeTone;
  size?: BadgeSize;
  icon?: string;
  attributes?: string;
}

export declare function badge(options?: BadgeOptions | string): string;
