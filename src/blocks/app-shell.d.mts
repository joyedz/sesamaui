import type { Surface } from '../surface.d.mts';
export interface AppShellOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  sidebar?: string;
  /** Trusted HTML for a persistent global icon rail. */
  rail?: string;
  header?: string;
  content?: string;
  footer?: string;
  detail?: string;
  collapsed?: boolean;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export interface AppShellController {
  element: HTMLElement;
  isCollapsed(): boolean;
  setCollapsed(collapsed: boolean): void;
  isPeeking(): boolean;
  setPeeking(peeking: boolean): void;
  setDetail(detailHtml?: string, options?: { animate?: boolean }): void | Promise<void>;
  destroy(): void;
}

export function appShell(options?: AppShellOptions): string;
export function initAppShell(element: HTMLElement): AppShellController | null;
