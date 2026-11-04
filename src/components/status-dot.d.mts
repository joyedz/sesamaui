import type { Surface } from '../surface.d.mts';
export type StatusDotTone = 'neutral' | 'informative' | 'success' | 'warning' | 'error' | 'disabled';

export interface StatusDotOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  tone?: StatusDotTone;
  label?: string;
  size?: number;
  active?: boolean;
  attributes?: string;
}

export declare function statusDot(options?: StatusDotOptions | StatusDotTone): string;
