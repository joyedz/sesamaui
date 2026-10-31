export type LabelTone = 'default' | 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'subtle';
export type LabelSize = 'sm' | 'base';

export interface LabelOptions {
  text?: string;
  tone?: LabelTone;
  size?: LabelSize;
  icon?: string;
  attributes?: string;
}

export declare function label(options?: LabelOptions | string): string;
