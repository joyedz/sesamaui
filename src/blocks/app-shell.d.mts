export interface AppShellOptions {
  id?: string;
  sidebar?: string;
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
  setDetail(detailHtml?: string): void;
  destroy(): void;
}

export function appShell(options?: AppShellOptions): string;
export function initAppShell(element: HTMLElement): AppShellController | null;
