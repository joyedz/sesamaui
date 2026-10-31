export type ChartType = 'line' | 'area' | 'bar' | 'thin-bar' | 'stacked bar' | 'donut';

export interface ChartSeries {
  key: string;
  label?: string;
  color?: string;
}

export interface ChartOptions {
  id?: string;
  type?: ChartType;
  label?: string;
  data?: Array<Record<string, any>>;
  series?: ChartSeries[];
  height?: number;
  formatValue?: string | ((val: number) => string);
  currency?: string;
  state?: 'default' | 'loading' | 'error';
  errorMessage?: string;
  barSize?: 'default' | 'thin';
  attributes?: string;
}

export interface ChartController {
  setData(newData: Array<Record<string, any>>): void;
  destroy(): void;
}

export function chart(options?: ChartOptions): string;
export function initChart(element: HTMLElement): ChartController;
