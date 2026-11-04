import type { Surface } from '../surface.d.mts';
export type InputSize = 'sm' | 'base' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number';

export interface Controller {
  readonly destroyed: boolean;
  destroy(): void;
}

export interface FormController<T extends HTMLElement = HTMLInputElement> extends Controller {
  readonly control: T;
  readonly value: string;
  readonly disabled: boolean;
  readonly required: boolean;
  setValue(value: string): void;
  setDisabled(disabled: boolean): void;
  setRequired(required: boolean): void;
  setCustomValidity(message: string): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  refresh(): this;
}

export interface InputController extends FormController<HTMLInputElement> {}

export interface InputOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  clearable?: boolean;
  /** Optional leading control icon name. */
  icon?: string;
  ariaLabel?: string;
  id?: string;
  name?: string;
  label?: string;
  type?: InputType;
  value?: string;
  placeholder?: string;
  size?: InputSize;
  disabled?: boolean;
  required?: boolean;
}

export interface InputFieldOptions extends InputOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  ariaLabel?: string;
  autocomplete?: string;
  readonly?: boolean;
  invalid?: boolean;
  helper?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  phonePrefix?: boolean;
  passwordToggle?: boolean;
  errorSlot?: boolean;
}

export function input(options?: InputOptions): string;
export function inputField(options?: InputFieldOptions): string;
export function initInput(element: HTMLElement): InputController;
