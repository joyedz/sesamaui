import type { Surface } from '../surface.d.mts';
export interface ActivityItem {
  id?: string;
  title: string;
  description?: string;
  time?: string;
  timestamp?: string;
  datetime?: string;
  icon?: string;
  status?: string;
  user?: string;
  actions?: string;
}

export type ActivityFeedItem = ActivityItem;

export interface ActivityFeedOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  id?: string;
  title?: string;
  items?: ActivityItem[];
  activities?: ActivityItem[];
  emptyMessage?: string;
  attributes?: string | Record<string, string>;
  classes?: string;
}

export function activityFeed(options?: ActivityFeedOptions): string;
