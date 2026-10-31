export type LoaderPresetSize = 'sm' | 'base' | 'lg';
export type LoaderSize = number | LoaderPresetSize;

export interface LoaderOptions {
  size?: LoaderSize;
  label?: string;
  showLabel?: boolean;
  attributes?: string;
}

export declare function loader(options?: LoaderOptions | LoaderSize): string;
