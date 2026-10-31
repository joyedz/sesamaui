export interface TagInputOptions {
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
