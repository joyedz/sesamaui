import { ButtonOptions } from './button.d.mts';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface PopoverOptions {
  id?: string;
  trigger?: string | ButtonOptions;
  content?: string;
  placement?: PopoverPlacement;
  ariaLabel?: string;
  attributes?: string;
}

export interface PopoverController {
  open(): void;
  close(focusTrigger?: boolean): void;
  toggle(): void;
  isOpen(): boolean;
  destroy(): void;
}

export declare function popover(options?: PopoverOptions): string;
export declare function initPopover(element: HTMLElement): PopoverController;
