import type { Surface } from '../surface.d.mts';
import { ButtonOptions } from './button.d.mts';
import { MenuOptions, MenuItemEntry, MenuGroup } from './menu.d.mts';

export interface DropdownMenuOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  trigger?: string | ButtonOptions;
  /** Add a separator and trailing chevron to the trigger. */
  menuIndicator?: boolean;
  items?: MenuItemEntry[];
  groups?: MenuGroup[] | null;
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'auto';
  ariaLabel?: string;
  attributes?: string;
}

export interface DropdownMenuController {
  open(focusTarget?: 'first' | 'last'): void;
  close(focusTrigger?: boolean): void;
  toggle(): void;
  isOpen(): boolean;
  selectItem(target: string | HTMLElement): void;
  destroy(): void;
}

export declare function dropdownMenu(options?: DropdownMenuOptions): string;
export declare function initDropdownMenu(element: HTMLElement): DropdownMenuController;
