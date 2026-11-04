import type { Surface } from '../surface.d.mts';
export type ContentSectionVariant = 'plain' | 'bordered' | 'divided';

export interface ContentSectionOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  title?: string;
  description?: string;
  actions?: string;
  content?: string;
  footer?: string;
  variant?: ContentSectionVariant;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function contentSection(options?: ContentSectionOptions): string;
