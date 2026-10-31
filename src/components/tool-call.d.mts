export type ToolCallState = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ToolCallDetails {
  duration?: string;
  output?: string | object;
  error?: string;
}

export interface ToolCallOptions {
  id?: string;
  name?: string;
  icon?: string;
  iconName?: string;
  state?: ToolCallState;
  input?: string | object;
  output?: string | object;
  error?: string;
  duration?: string;
  open?: boolean;
  expanded?: boolean;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export interface ToolCallController {
  element: HTMLElement;
  isOpen(): boolean;
  setOpen(open: boolean): void;
  setState(state: ToolCallState, details?: ToolCallDetails): void;
  destroy(): void;
}

export function toolCall(options?: ToolCallOptions): string;
export function initToolCall(element: HTMLElement): ToolCallController | null;
