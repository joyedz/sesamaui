export type ModalSize = 'sm' | 'base' | 'lg' | 'xl';

export interface Controller {
  readonly destroyed: boolean;
  destroy(): void;
}

/** content and actions are trusted application HTML, never untrusted user text. */
export interface ModalOptions {
  id?: string;
  title?: string;
  description?: string;
  content?: string;
  actions?: string;
  size?: ModalSize;
  locked?: boolean;
}

export interface ModalController extends Controller {
  open(trigger?: HTMLElement): void;
  close(reason?: string, returnValue?: string): void;
}

export function modal(options?: ModalOptions): string;
export function initModal(dialog: HTMLDialogElement): ModalController;
