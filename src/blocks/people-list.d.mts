import type { Surface } from '../surface.d.mts';
export interface PersonItem {
  id?: string;
  name: string;
  initials?: string;
  status?: string;
  metadata?: string;
  role?: string;
  email?: string;
  avatar?: string | { src?: string; fallback?: string };
  actions?: string;
}

export type PeopleListItem = PersonItem;

export interface PeopleListOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  title?: string;
  count?: number;
  people?: PersonItem[];
  emptyMessage?: string;
  emptyText?: string;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function peopleList(options?: PeopleListOptions): string;
