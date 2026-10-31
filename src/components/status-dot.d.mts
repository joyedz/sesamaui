export type StatusDotTone = 'neutral' | 'informative' | 'success' | 'warning' | 'error' | 'disabled';

export interface StatusDotOptions {
  tone?: StatusDotTone;
  label?: string;
  size?: number;
  active?: boolean;
  attributes?: string;
}

export declare function statusDot(options?: StatusDotOptions | StatusDotTone): string;
