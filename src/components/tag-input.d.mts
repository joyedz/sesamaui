import type { Surface } from '../surface.d.mts';
import type { InputSize } from './input.mjs';
export interface TagInputOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  name?: string;
  label?: string;
  tags?: string[];
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  helper?: string;
  error?: string;
  /** Control height: sm 26 / base 30 / lg 34, matching Input Field. */
  size?: InputSize;
  attributes?: string;
}

export interface TagInputController {
  addTag(tag: string): boolean;
  removeTag(tag: string): boolean;
  getTags(): string[];
  setTags(tags: string[]): void;
  clear(): void;
  destroy(): void;
}

export declare function tagInput(options?: TagInputOptions): string;
export declare function initTagInput(element: HTMLElement): TagInputController;
