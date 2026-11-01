export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dashed' | 'destructive' | 'secondary-destructive';
export type ButtonSize = 'xs' | 'sm' | 'base' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';
export type IconPosition = 'start' | 'end';

export interface ButtonOptions {
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

export interface IconButtonOptions {
  label?: string;
  ariaLabel?: string;
  variant?: IconButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  pressed?: boolean;
  ariaPressed?: boolean;
  attributes?: string;
}

export type LinkTone = 'default' | 'brand';

export interface LinkButtonOptions {
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
  label?: string;
  size?: ButtonSize;
  disabled?: boolean;
  attributes?: string;
}

export function button(options?: ButtonOptions | string): string;
export function iconButton(name: string, options?: IconButtonOptions | string, attributes?: string, label?: string): string;
export function linkButton(label?: string, options?: LinkButtonOptions): string;
export function socialButton(provider: SocialProvider, options?: SocialButtonOptions): string;
