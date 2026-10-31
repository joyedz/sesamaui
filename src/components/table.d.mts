export interface TableColumn<T = any> {
  key: string;
  label?: string;
  header?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: number | string;
  render?: (val: any, row: T) => string;
}

export type TableSelectionMode = 'none' | 'single' | 'multiple';
export type TableSortDirection = 'ascending' | 'descending' | 'none' | 'asc' | 'desc';

export interface TableOptions<T = any> {
  id?: string;
  columns?: TableColumn<T>[];
  rows?: T[];
  rowKey?: string | ((row: T) => string);
  selectionMode?: TableSelectionMode;
  selectedKeys?: string[] | Set<string>;
  sortColumn?: string;
  sortDirection?: TableSortDirection;
  stickyHeader?: boolean;
  compact?: boolean;
  fixed?: boolean;
  minWidth?: number;
  maxHeight?: number | string;
  ariaLabel?: string;
  rowAction?: string;
  emptyMessage?: string;
  attributes?: string;
}

export interface TableController<T = any> {
  setRows(rows: T[]): void;
  getRows(): T[];
  setSelection(keys: string[]): void;
  getSelection(): string[];
  getSelectedRows(): T[];
  setSort(column: string, direction: TableSortDirection): void;
  destroy(): void;
}

export function table<T = any>(options?: TableOptions<T>): string;
export function initTable<T = any>(element: HTMLElement): TableController<T>;
