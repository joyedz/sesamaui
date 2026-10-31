export interface CheckboxOptions {
  id?: string;
  name?: string;
  value?: string;
  label?: string;
  description?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  attributes?: string;
}

export interface CheckboxController {
  element: Element;
  control: HTMLInputElement;
  readonly destroyed: boolean;
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  value: string;
  name: string;
  setChecked(value: boolean): void;
  setIndeterminate(value: boolean): void;
  setDisabled(value: boolean): void;
  setRequired(value: boolean): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
  destroy(): void;
}

export declare function checkbox(options?: CheckboxOptions | string): string;
export declare function initCheckbox(element: Element): CheckboxController;
