import type { Surface } from '../surface.d.mts';
import { TreeItem } from '../components/tree.d.mts';

export interface WorkspaceItem {
  label: string;
  icon?: string;
}

export interface WorkspaceGroup {
  title: string;
  items: TreeItem[];
}

export interface WorkspaceSidebarOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  variant?: 'default' | 'conversation' | 'compact';
  workspace?: string;
  workspaces?: WorkspaceItem[];
  workspaceSelector?: string;
  /** Trusted header action HTML replacing the default sidebar toggle. */
  headerAction?: string;
  navigation?: TreeItem[] | string;
  groups?: WorkspaceGroup[];
  projects?: TreeItem[] | string;
  /** Label for the secondary navigation section. Defaults to Projects. */
  projectsTitle?: string;
  projectActions?: string | object;
  profile?: string;
  profileName?: string;
  initials?: string;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export interface WorkspaceSidebarController {
  element: HTMLElement;
  destroy(): void;
}

export function workspaceSidebar(options?: WorkspaceSidebarOptions): string;
export function sidebar(options?: WorkspaceSidebarOptions): string;
export function initWorkspaceSidebar(element: HTMLElement): WorkspaceSidebarController | null;
