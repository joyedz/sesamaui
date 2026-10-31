import { FileCardOptions } from './file-card.mjs';

export type MessageRole = 'user' | 'agent' | 'comment';
export type MessageStatus =
  | 'sending'
  | 'sent'
  | 'failed'
  | 'deleted'
  | 'thinking'
  | 'streaming';

export interface MessageSender {
  name: string;
  avatar?: string;
  isAgent?: boolean;
  isSelf?: boolean;
}

export interface MessageQuote {
  name: string;
  text: string;
}

export interface MessageAction {
  label: string;
  action?: string;
  icon?: string;
}

export interface MessageOptions {
  id?: string;
  sender?: MessageSender | string;
  role?: MessageRole;
  time?: string;
  content?: string;
  quote?: MessageQuote;
  replyTo?: MessageQuote;
  attachments?: (FileCardOptions | string)[] | string;
  actions?: (MessageAction | string)[] | string;
  status?: MessageStatus;
  state?: string;
  own?: boolean;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export interface MessageController {
  element: HTMLElement;
  setStatus(status: string): void;
  setContent(text: string): void;
  destroy(): void;
}

export function message(options?: MessageOptions): string;
export function initMessage(element: HTMLElement): MessageController | null;
