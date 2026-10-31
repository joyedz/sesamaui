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
  id?: string;
  workspace?: string;
  workspaces?: WorkspaceItem[];
  workspaceSelector?: string;
  navigation?: TreeItem[] | string;
  groups?: WorkspaceGroup[];
  projects?: TreeItem[] | string;
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
