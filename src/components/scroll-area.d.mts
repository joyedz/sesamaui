export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

export interface ScrollAreaOptions {
  content?: string;
  orientation?: ScrollAreaOrientation;
  tabindex?: number;
  ariaLabel?: string;
  attributes?: string;
}

export interface ScrollAreaController {
  element: Element;
  readonly destroyed: boolean;
  update(): void;
  scrollTo(options: ScrollToOptions | number, y?: number): void;
  destroy(): void;
}

export declare function scrollArea(options?: ScrollAreaOptions): string;
export declare function initScrollArea(element: Element): ScrollAreaController;
