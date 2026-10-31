export type MenuItemRole = 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';

export interface MenuItemOptions {
  id?: string;
  label: string;
  icon?: string | null;
  shortcut?: string | null;
  disabled?: boolean;
  danger?: boolean;
  destructive?: boolean;
  role?: MenuItemRole;
  checked?: boolean;
  href?: string | null;
  attributes?: string;
}

export declare function menuItem(options?: MenuItemOptions): string;
