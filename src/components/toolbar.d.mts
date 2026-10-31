export type ToolbarOrientation = 'horizontal' | 'vertical';
export type ToolbarSize = 'sm' | 'base';

export interface ToolbarSeparatorItem {
  type: 'separator';
}

export interface ToolbarGroupItem {
  type: 'group';
  ariaLabel?: string;
  items: Array<ToolbarItem | string>;
}

export interface ToolbarButtonItem {
  label?: string;
  icon?: string;
  variant?: string;
  size?: string;
  disabled?: boolean;
  html?: string;
  attributes?: string;
  [key: string]: unknown;
}

export type ToolbarItem = ToolbarSeparatorItem | ToolbarGroupItem | ToolbarButtonItem | string;

export interface ToolbarOptions {
  ariaLabel?: string;
  items?: ToolbarItem[];
  orientation?: ToolbarOrientation;
  size?: ToolbarSize;
  attributes?: string;
}

export function toolbar(options?: ToolbarOptions): string;
