import type { Surface } from '../surface.d.mts';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dashed' | 'destructive' | 'secondary-destructive';
export type ButtonSize = 'xs' | 'sm' | 'base' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';
export type IconPosition = 'start' | 'end';

export interface ButtonOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  label?: string;
  id?: string;
  type?: ButtonType;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: IconPosition;
}

export type IconButtonVariant = 'raised' | 'ghost' | 'circle' | 'outline' | string;

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export interface IconButtonOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  label?: string;
  ariaLabel?: string;
  variant?: IconButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  pressed?: boolean;
  ariaPressed?: boolean;
  /** Tooltip text override. By default every Icon Button uses its accessible label. */
  tooltip?: string;
  tooltipPlacement?: TooltipPlacement;
  attributes?: string;
}

export type LinkTone = 'default' | 'brand';

export interface LinkButtonOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  href?: string;
  tone?: LinkTone;
  disabled?: boolean;
  iconName?: string;
  icon?: string;
  iconPosition?: IconPosition;
  attributes?: string;
}

export type SocialProvider = 'google' | 'github';

export interface SocialButtonOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  label?: string;
  size?: ButtonSize;
  disabled?: boolean;
  attributes?: string;
}

export function button(options?: ButtonOptions | string): string;
export function iconButton(name: string, options?: IconButtonOptions | string, attributes?: string, label?: string): string;
export function linkButton(label?: string, options?: LinkButtonOptions): string;
export function socialButton(provider: SocialProvider, options?: SocialButtonOptions): string;
