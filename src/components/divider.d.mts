export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerOptions {
  orientation?: DividerOrientation;
  label?: string;
  decorative?: boolean;
  attributes?: string;
}

export declare function divider(options?: DividerOptions): string;
