export type SelectSize = 'sm' | 'base' | 'lg';

export interface SelectOption {
  label: string;
  value?: string;
  icon?: string;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: Array<string | SelectOption>;
}

export interface SelectAction {
  key: string;
  label: string;
  icon?: string;
}

export interface SelectOptions {
  name?: string;
  label?: string;
  ariaLabel?: string;
  value?: string;
  placeholder?: string;
  options?: Array<string | SelectOption>;
  groups?: SelectGroup[];
  actions?: SelectAction[];
  size?: SelectSize;
  inline?: boolean;
  disabled?: boolean;
  required?: boolean;
  helper?: string;
  error?: string;
  invalid?: boolean;
  icon?: string;
}

export interface Controller {
  readonly destroyed: boolean;
  destroy(): void;
}

export interface SelectController extends Controller {
  readonly control: HTMLSelectElement;
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
  open(last?: boolean): void;
  close(focus?: boolean): void;
}

export function select(options?: SelectOptions): string;
export function initSelect(element: HTMLElement): SelectController;
