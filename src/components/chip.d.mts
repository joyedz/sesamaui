import type { Surface } from '../surface.d.mts';
export type ChipTone = 'neutral' | 'informative' | 'success' | 'warning' | 'error';
export type ChipVariant = 'static' | 'selectable' | 'removable';

export interface ChipOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  label?: string;
  tone?: ChipTone;
  variant?: ChipVariant;
  selected?: boolean;
  disabled?: boolean;
  icon?: string;
  removable?: boolean;
  attributes?: string;
}

export interface ChipController {
  element: Element;
  readonly destroyed: boolean;
  selected: boolean;
  setSelected(value: boolean): void;
  destroy(): void;
}

export declare function chip(options?: ChipOptions | string): string;
export declare function initChip(element: Element): ChipController;
