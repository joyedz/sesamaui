export interface RadioOptions {
  id?: string;
  name?: string;
  value?: string;
  label?: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  attributes?: string;
}

export interface RadioController {
  element: Element;
  control: HTMLInputElement;
  readonly destroyed: boolean;
  checked: boolean;
  disabled: boolean;
  value: string;
  name: string;
  setChecked(value: boolean): void;
  setDisabled(value: boolean): void;
  setRequired(value: boolean): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
  destroy(): void;
}

export declare function radio(options?: RadioOptions | string): string;
export declare function initRadio(element: Element): RadioController;
