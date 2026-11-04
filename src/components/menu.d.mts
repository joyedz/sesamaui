import type { Surface } from '../surface.d.mts';
import { MenuItemOptions } from './menu-item.d.mts';

export interface MenuGroup {
  label: string;
  items: Array<MenuItemOptions | string>;
}

export type MenuItemEntry = MenuItemOptions | { type: 'separator' } | { type: 'group'; label: string; items: MenuItemOptions[] } | string;

export interface MenuOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  ariaLabel?: string;
  items?: MenuItemEntry[];
  groups?: MenuGroup[] | null;
  attributes?: string;
}

export interface MenuController {
  getItems(): HTMLElement[];
  getActiveItem(): HTMLElement | null;
  selectItem(target: string | HTMLElement): void;
  focusFirst(): void;
  focusLast(): void;
  destroy(): void;
}

export declare function menu(options?: MenuOptions): string;
export declare function initMenu(element: HTMLElement): MenuController;
