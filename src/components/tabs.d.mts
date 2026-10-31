export type TabsVariant = 'segmented' | 'pill' | 'line';

export interface TabItem {
  id?: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  content?: string;
}

export interface TabsOptions {
  id?: string;
  ariaLabel?: string;
  variant?: TabsVariant;
  tabs?: Array<TabItem | string>;
  activeTabId?: string;
  attributes?: string;
}

export interface TabsController {
  setActiveTab(id: string): void;
  getActiveTab(): string;
  destroy(): void;
}

export function tabs(options?: TabsOptions): string;
export function initTabs(element: HTMLElement): TabsController;
