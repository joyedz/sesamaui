export interface TreeItemConfig {
  id?: string;
  label?: string;
  icon?: string | boolean | null;
  expanded?: boolean;
  active?: boolean;
  loading?: boolean;
  actions?: string;
  children?: TreeItemConfig[];
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
  items?: TreeItemConfig[];
  ariaLabel?: string;
  attributes?: string;
}

export interface TreeSectionOptions {
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
