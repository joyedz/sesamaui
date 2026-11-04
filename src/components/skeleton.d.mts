import type { Surface } from '../surface.d.mts';
export type SkeletonShape = 'line' | 'line-short' | 'round' | 'card' | 'fill';

export interface SkeletonItemSpec {
  shape: SkeletonShape;
  width?: string | number;
  height?: string | number;
  size?: string | number;
  radius?: string | number;
}

export interface SkeletonOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  shape?: SkeletonShape;
  width?: string | number;
  height?: string | number;
  size?: string | number;
  radius?: string | number;
  count?: number;
  /** Mixed shapes under one status region; a nested array renders as a row. */
  items?: Array<SkeletonShape | SkeletonItemSpec | SkeletonItemSpec[]>;
  /** Emit the raw shape divs only, without the status layout wrapper. */
  bare?: boolean;
  ariaLabel?: string;
  attributes?: string;
}

export declare function skeleton(options?: SkeletonOptions | SkeletonShape): string;
