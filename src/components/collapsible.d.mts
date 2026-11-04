import type { Surface } from '../surface.d.mts';
export interface CollapsibleOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  trigger?: string;
  content?: string;
  open?: boolean;
  attributes?: string;
}

export interface CollapsibleController {
  setOpen(open: boolean): void;
  toggle(): void;
  isOpen(): boolean;
  destroy(): void;
}

export function collapsible(options?: CollapsibleOptions): string;
export function initCollapsible(element: HTMLElement): CollapsibleController;
