export interface CommandItem {
  id?: string;
  label?: string;
  name?: string;
  icon?: string | null;
  shortcut?: string | null;
  group?: string;
  action?: string;
  disabled?: boolean;
}

export interface CommandGroup {
  label?: string;
  name?: string;
  commands?: CommandItem[];
  items?: CommandItem[];
}

export interface CommandPaletteOptions {
  id?: string;
  title?: string;
  placeholder?: string;
  value?: string;
  commands?: Array<CommandItem | string>;
  groups?: CommandGroup[] | null;
  emptyText?: string;
  attributes?: string;
}

export interface CommandPaletteController {
  open(trigger?: HTMLElement | null): void;
  close(): void;
  filter(query: string): void;
  getVisibleCommands(): Array<{ id: string; action: string; label: string }>;
  getActiveCommand(): { id: string; action: string; label: string } | null;
  executeActive(): void;
  destroy(): void;
}

export declare function commandPalette(options?: CommandPaletteOptions): string;
export declare function initCommandPalette(dialog: HTMLDialogElement): CommandPaletteController;
