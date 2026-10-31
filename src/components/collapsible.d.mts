export interface CollapsibleOptions {
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
