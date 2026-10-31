export type AvatarPresetSize = 'sm' | 'base' | 'lg';
export type AvatarSize = number | AvatarPresetSize;

export interface AvatarOptions {
  name?: string;
  initials?: string;
  image?: string;
  size?: AvatarSize;
  tone?: string;
  color?: string;
  selectable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  attributes?: string;
}

export interface AvatarController {
  element: Element;
  readonly destroyed: boolean;
  selected: boolean;
  setSelected(value: boolean): void;
  refresh(): void;
  destroy(): void;
}

export declare function avatar(options?: AvatarOptions | string): string;
export declare function initAvatar(element: Element): AvatarController;
