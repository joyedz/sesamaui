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
