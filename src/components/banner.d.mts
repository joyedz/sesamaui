export type BannerTone = 'neutral' | 'informative' | 'success' | 'warning' | 'error';

export interface BannerOptions {
  title?: string;
  description?: string;
  tone?: BannerTone;
  dismissible?: boolean;
  actions?: string;
  icon?: string;
  attributes?: string;
}

export interface BannerController {
  element: Element;
  readonly destroyed: boolean;
  dismiss(): void;
  destroy(): void;
}

export declare function banner(options?: BannerOptions | string): string;
export declare function initBanner(element: Element): BannerController;
