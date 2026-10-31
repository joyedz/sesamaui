export type FileCardType =
  | 'image'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'video'
  | 'audio'
  | 'archive'
  | 'other';

export interface FileCardAction {
  label: string;
  action?: string;
  icon?: string;
}

export interface FileCardOptions {
  id?: string;
  name?: string;
  size?: string | number;
  type?: FileCardType;
  src?: string;
  preview?: string;
  iconName?: string;
  expanded?: boolean;
  removable?: boolean;
  actions?: (FileCardAction | string)[] | string;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export interface FileCardController {
  element: HTMLElement;
  isExpanded(): boolean;
  toggle(expand?: boolean): void;
  destroy(): void;
}

export function fileCard(options?: FileCardOptions): string;
export function fileAttachment(options?: FileCardOptions): string;
export function initFileCard(element: HTMLElement): FileCardController | null;
