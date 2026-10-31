export type ContentSectionVariant = 'plain' | 'bordered' | 'divided';

export interface ContentSectionOptions {
  id?: string;
  title?: string;
  description?: string;
  actions?: string;
  content?: string;
  footer?: string;
  variant?: ContentSectionVariant;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function contentSection(options?: ContentSectionOptions): string;
