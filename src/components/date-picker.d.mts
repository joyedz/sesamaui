export type DatePickerMode = 'single' | 'range';

export interface DatePickerOptions {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  mode?: DatePickerMode;
  min?: string;
  max?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  helper?: string;
  error?: string;
  attributes?: string;
}

export interface DatePickerController {
  open(): void;
  close(): void;
  setValue(value: string, silent?: boolean): void;
  getValue(): string;
  clear(): void;
  destroy(): void;
}

export declare function datePicker(options?: DatePickerOptions): string;
export declare function initDatePicker(element: HTMLElement): DatePickerController;
