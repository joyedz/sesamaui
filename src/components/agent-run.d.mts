import { ToolCallOptions, ToolCallState } from './tool-call.mjs';

export interface AgentRunThinkingStep {
  type: 'thinking';
  title?: string;
  state?: ToolCallState;
  detail?: string;
  description?: string;
  open?: boolean;
}

export interface AgentRunProgressStep {
  type?: 'progress';
  title: string;
  state?: ToolCallState;
}

export type AgentRunStep =
  | (ToolCallOptions & { type: 'tool' })
  | AgentRunThinkingStep
  | AgentRunProgressStep;

export interface AgentRunOptions {
  id?: string;
  title?: string;
  state?: ToolCallState;
  duration?: string;
  open?: boolean;
  steps?: AgentRunStep[];
  attributes?: string | Record<string, string>;
  classes?: string;
}

export interface AgentRunController {
  element: HTMLElement;
  isOpen(): boolean;
  setOpen(open: boolean): void;
  setState(state: ToolCallState, duration?: string): void;
  setSteps(steps: AgentRunStep[]): void;
  destroy(): void;
}

export function agentRun(options?: AgentRunOptions): string;
export function initAgentRun(element: HTMLElement): AgentRunController | null;
