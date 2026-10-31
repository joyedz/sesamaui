export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  totalItems?: number;
  pageSizeOptions?: number[];
  showSummary?: boolean;
  summaryText?: string | ((page: number, pages: number, total: number) => string);
  ariaLabel?: string;
  attributes?: string;
}

export interface PaginationController {
  setPage(page: number): void;
  getPage(): number;
  setPageSize(size: number): void;
  getPageSize(): number;
  setTotal(total: number): void;
  getTotal(): number;
  destroy(): void;
}

export function pagination(options?: PaginationOptions): string;
export function initPagination(element: HTMLElement): PaginationController;
