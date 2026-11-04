import type { Surface } from '../surface.d.mts';
export type CardVariant = 'default' | 'flat' | 'bordered' | 'recessed';

export interface CardOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  header?: string;
  title?: string;
  description?: string;
  content?: string;
  footer?: string;
  actions?: string;
  /** Trusted HTML for a trailing action centered on the card edge. */
  expandAction?: string;
  variant?: CardVariant;
  selected?: boolean;
  attributes?: string;
}

export declare function card(options?: CardOptions): string;
