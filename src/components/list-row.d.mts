import type { Surface } from '../surface.d.mts';
export type ListRowVariant =
  | 'plain'
  | 'basic'
  | 'description'
  | 'icon'
  | 'avatar'
  | 'metadata'
  | 'badge'
  | 'navigation'
  | 'action'
  | 'switch'
  | 'checkbox'
  | 'radio'
  | 'disabled';

export interface ListRowOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  appearance?: 'default' | 'plain';
  variant?: ListRowVariant;
  title?: string;
  /** Escaped badge text beside the title; description retains the full copy width. */
  titleBadge?: string;
  description?: string;
  descriptionHTML?: string;
  leading?: string;
  trailing?: string;
  href?: string;
  disabled?: boolean;
  checked?: boolean;
  name?: string;
  value?: string;
  attributes?: string;
}

export function listRow(options?: ListRowOptions): string;
