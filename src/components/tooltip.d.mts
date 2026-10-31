export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipOptions {
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
