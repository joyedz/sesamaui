import type { Surface } from '../surface.d.mts';
export type BadgeTone = 'neutral' | 'informative' | 'success' | 'warning' | 'error' | 'disabled';
export type BadgeSize = 'sm' | 'base';

export interface BadgeOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  label?: string;
  tone?: BadgeTone;
  size?: BadgeSize;
  icon?: string;
  attributes?: string;
}

export declare function badge(options?: BadgeOptions | string): string;
