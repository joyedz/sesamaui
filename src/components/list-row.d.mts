export type ListRowVariant =
  | 'plain'
  | 'basic'
  | 'description'
  | 'icon'
  | 'avatar'
  | 'metadata'
  | 'badge'
  | 'navigation'
  | 'action'
  | 'switch'
  | 'checkbox'
  | 'radio'
  | 'disabled';

export interface ListRowOptions {
  variant?: ListRowVariant;
  title?: string;
  description?: string;
  descriptionHTML?: string;
  leading?: string;
  trailing?: string;
  href?: string;
  disabled?: boolean;
  checked?: boolean;
  name?: string;
  value?: string;
  attributes?: string;
}

export function listRow(options?: ListRowOptions): string;
