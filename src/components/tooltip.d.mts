import type { Surface } from '../surface.d.mts';
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  content?: string;
  placement?: TooltipPlacement;
  trigger?: string | null;
  delay?: number;
  attributes?: string;
}

export interface TooltipController {
  show(): void;
  hide(): void;
  isVisible(): boolean;
  destroy(): void;
}

export declare function tooltip(options?: TooltipOptions): string;
export declare function initTooltip(element: HTMLElement): TooltipController;
