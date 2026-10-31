export interface SwitchOptions {
  id?: string;
  name?: string;
  value?: string;
  label?: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  attributes?: string;
}

export interface SwitchController {
  element: Element;
  control: HTMLButtonElement;
  readonly destroyed: boolean;
  checked: boolean;
  disabled: boolean;
  value: string;
  name: string;
  setChecked(value: boolean): void;
  setDisabled(value: boolean): void;
  destroy(): void;
}

export declare function switchControl(options?: SwitchOptions | string): string;
export declare function initSwitch(element: Element): SwitchController;
