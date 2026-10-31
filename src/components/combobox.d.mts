export interface ComboboxOption {
  id?: string;
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
}

export interface ComboboxGroup {
  label: string;
  options: Array<ComboboxOption | string>;
}

export interface ComboboxOptions {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  options?: Array<ComboboxOption | string>;
  groups?: ComboboxGroup[] | null;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  helper?: string;
  error?: string;
  loading?: boolean;
  clearable?: boolean;
  attributes?: string;
}

export interface ComboboxController {
  open(): void;
  close(): void;
  setValue(value: string, silent?: boolean): void;
  getValue(): string;
  getLabel(): string;
  setOptions(options: Array<ComboboxOption | string>): void;
  setDisabled(disabled: boolean): void;
  clear(): void;
  destroy(): void;
}

export declare function combobox(options?: ComboboxOptions): string;
export declare function initCombobox(element: HTMLElement): ComboboxController;
