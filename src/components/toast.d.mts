export type ToastTone = 'neutral' | 'informative' | 'success' | 'warning' | 'error' | 'loading';

export interface ToastAction {
  label: string;
  onClick?: () => void;
  run?: () => void;
}

export interface ToastOptions {
  message: string;
  title?: string;
  tone?: ToastTone;
  duration?: number;
  persistent?: boolean;
  action?: ToastAction | null;
  dismissible?: boolean;
  region?: HTMLElement | null;
}

export interface ToastHandle {
  dismiss(): void;
  update(nextMessage: string, nextTone?: ToastTone, nextPersistent?: boolean): void;
}

export interface ToastRegionController {
  showToast(options: ToastOptions): ToastHandle;
  getEntries(): any[];
  clearAll(): void;
  destroy(): void;
}

export declare function showToast(
  optionsOrMessage: ToastOptions | string,
  legacyTone?: ToastTone,
  legacyPersistent?: boolean,
  legacyOptions?: Partial<ToastOptions>
): ToastHandle;

export declare function initToastRegion(element: HTMLElement): ToastRegionController;
