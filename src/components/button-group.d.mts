import type { Surface } from '../surface.d.mts';
import { ButtonOptions, ButtonVariant, ButtonSize } from './button.d.mts';
import { MenuOptions } from './menu.d.mts';

export interface ButtonGroupOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  buttons?: Array<ButtonOptions | string>;
  split?: boolean;
  menu?: MenuOptions | null;
  variant?: ButtonVariant;
  size?: ButtonSize;
  attributes?: string;
}

export interface ButtonGroupController {
  destroy(): void;
}

export declare function buttonGroup(options?: ButtonGroupOptions): string;
export declare function initButtonGroup(element: HTMLElement): ButtonGroupController;
