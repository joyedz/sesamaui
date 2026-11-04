import type { Surface } from '../surface.d.mts';
export type LabelTone = 'default' | 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'subtle';
export type LabelSize = 'sm' | 'base';

export interface LabelOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  text?: string;
  tone?: LabelTone;
  size?: LabelSize;
  icon?: string;
  attributes?: string;
}

export declare function label(options?: LabelOptions | string): string;
