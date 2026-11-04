import type { Surface } from '../surface.d.mts';
import { ContentSectionVariant } from './content-section.d.mts';

export interface DataSectionOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  title?: string;
  description?: string;
  actions?: string;
  filters?: string;
  table?: string;
  pagination?: string;
  variant?: ContentSectionVariant;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function dataSection(options?: DataSectionOptions): string;
