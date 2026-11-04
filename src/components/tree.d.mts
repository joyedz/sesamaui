import type { Surface } from '../surface.d.mts';
export interface TreeItemConfig {
  surface?: Surface;
  id?: string;
  label?: string;
  icon?: string | boolean | null;
  expanded?: boolean;
  active?: boolean;
  loading?: boolean;
  actions?: string;
  children?: TreeItemConfig[];
  /** Trusted application HTML for rich branch rows. */
  content?: string;
  /** Section folders place the icon at the end and omit branch indentation. */
  layout?: 'default' | 'section';
  attributes?: string;
  // Legacy aliases
  key?: string;
  n?: string;
  i?: string | boolean | null;
  k?: TreeItemConfig[];
  o?: number;
  selected?: boolean;
}

export interface TreeOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  items?: TreeItemConfig[];
  ariaLabel?: string;
  attributes?: string;
}

export interface TreeSectionOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  title?: string;
  action?: string;
  content?: string;
  actionIcon?: string;
  actionLabel?: string;
  actionAttributes?: string;
}

export interface TreeController {
  expand(id: string): void;
  collapse(id: string): void;
  toggle(id: string): void;
  select(id: string): void;
  getSelected(): string | null;
  destroy(): void;
}

export function treeItem(options?: TreeItemConfig): string;
export function tree(options?: TreeOptions | TreeItemConfig[]): string;
export function treeSection(titleOrOptions: string | TreeSectionOptions, content?: string, options?: TreeSectionOptions): string;
export function initTree(element: HTMLElement): TreeController;
