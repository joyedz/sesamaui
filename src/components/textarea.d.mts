export type TextareaSize = 'sm' | 'base' | 'lg';

export interface TextareaOptions {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  helper?: string;
  error?: string;
  invalid?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  size?: TextareaSize;
  maxLength?: number;
  autoResize?: boolean;
  attributes?: string;
}

export interface TextareaController {
  element: Element;
  control: HTMLTextAreaElement;
  readonly destroyed: boolean;
  value: string;
  name: string;
  disabled: boolean;
  required: boolean;
  setValue(value: string): void;
  setDisabled(value: boolean): void;
  setRequired(value: boolean): void;
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
  destroy(): void;
}

export declare function textarea(options?: TextareaOptions | string): string;
export declare function initTextarea(element: Element): TextareaController;
