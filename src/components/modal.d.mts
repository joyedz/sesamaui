import type { Surface } from '../surface.d.mts';
export type ModalSize = 'sm' | 'base' | 'lg' | 'xl';

export interface Controller {
  readonly destroyed: boolean;
  destroy(): void;
}

/** content and actions are trusted application HTML, never untrusted user text. */
export interface ModalOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  title?: string;
  description?: string;
  content?: string;
  actions?: string;
  size?: ModalSize;
  locked?: boolean;
  /** Scroll the body inside a fixed header/footer instead of the whole dialog. */
  bodyScroll?: boolean;
}

export interface ModalController extends Controller {
  open(trigger?: HTMLElement): void;
  close(reason?: string, returnValue?: string): void;
}

export function modal(options?: ModalOptions): string;
export function initModal(dialog: HTMLDialogElement): ModalController;
