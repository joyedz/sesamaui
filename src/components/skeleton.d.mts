export type SkeletonShape = 'line' | 'line-short' | 'round' | 'card' | 'fill';

export interface SkeletonOptions {
  shape?: SkeletonShape;
  width?: string | number;
  height?: string | number;
  size?: string | number;
  radius?: string | number;
  count?: number;
  ariaLabel?: string;
  attributes?: string;
}

export declare function skeleton(options?: SkeletonOptions | SkeletonShape): string;
