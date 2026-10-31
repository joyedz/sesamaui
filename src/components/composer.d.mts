import { FileCardOptions } from './file-card.mjs';

export type ComposerState = 'empty' | 'ready' | 'thinking';

export interface ComposerAttachment {
  id: string;
  name: string;
  type?: string;
  src?: string;
  size?: string | number;
}

export interface ComposerSendPayload {
  text: string;
  attachments: ComposerAttachment[];
  context: string;
  model: string;
}

export interface ComposerOptions {
  id?: string;
  placeholder?: string;
  value?: string;
  attachments?: FileCardOptions[];
  contextOptions?: string[] | { label: string; value: string }[];
  contextValue?: string;
  modelOptions?: any[];
  modelValue?: string;
  state?: ComposerState;
  rows?: number;
  showMic?: boolean;
  showAttach?: boolean;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export interface ComposerController {
  element: HTMLElement;
  getValue(): string;
  setValue(val: string): void;
  getAttachments(): ComposerAttachment[];
  addAttachment(fileRecord: FileCardOptions): void;
  removeAttachment(id: string): void;
  clear(): void;
  setState(state: ComposerState): void;
  focus(): void;
  destroy(): void;
}

export function composer(options?: ComposerOptions): string;
export function initComposer(element: HTMLElement): ComposerController | null;
