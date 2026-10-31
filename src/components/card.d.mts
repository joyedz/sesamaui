export type CardVariant = 'default' | 'flat' | 'bordered' | 'recessed';

export interface CardOptions {
  header?: string;
  title?: string;
  description?: string;
  content?: string;
  footer?: string;
  actions?: string;
  variant?: CardVariant;
  selected?: boolean;
  attributes?: string;
}

export declare function card(options?: CardOptions): string;
