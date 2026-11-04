import type { Surface } from '../surface.d.mts';
export type TabsVariant = 'segmented' | 'pill' | 'line';

export interface TabItem {
  id?: string;
  label: string;
  icon?: string;
  /** Trusted HTML for an avatar or other leading visual. Takes priority over icon. */
  leading?: string;
  disabled?: boolean;
  content?: string;
}

export interface TabsOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  ariaLabel?: string;
  /** ID of an application-managed shared panel; omits generated panels. */
  panelId?: string;
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
