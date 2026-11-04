import type { Surface } from '../surface.d.mts';
export type MenuItemRole = 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';

export interface MenuItemOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  label: string;
  icon?: string | null;
  shortcut?: string | null;
  disabled?: boolean;
  danger?: boolean;
  destructive?: boolean;
  role?: MenuItemRole;
  checked?: boolean;
  control?: 'check' | 'checkbox' | 'radio';
  href?: string | null;
  attributes?: string;
}

export declare function menuItem(options?: MenuItemOptions): string;
