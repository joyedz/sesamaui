import type { ContentSectionVariant } from './content-section.mjs';
import type { MetricCardOptions } from './metric-card.mjs';
import type { AvatarOptions } from '../components/avatar.mjs';
import type { TableColumn } from '../components/table.mjs';

export interface RequirementItem {
  id?: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  trailing?: string;
}

export interface RequirementGroupRecipeOptions {
  id?: string;
  title?: string;
  description?: string;
  requirements?: (RequirementItem | string)[];
  actions?: string;
  variant?: 'default' | 'flat' | 'bordered' | 'recessed';
  classes?: string;
}

export function requirementGroupRecipe(options?: RequirementGroupRecipeOptions): string;

export interface ResourceListRecipeOptions {
  id?: string;
  title?: string;
  description?: string;
  resources?: any[];
  layout?: 'table' | 'list';
  columns?: TableColumn[];
  actions?: string;
  toolbar?: string;
  pagination?: string;
  classes?: string;
}

export function resourceListRecipe(options?: ResourceListRecipeOptions): string;

export interface AgentCardRecipeOptions {
  id?: string;
  name?: string;
  role?: string;
  description?: string;
  status?: 'online' | 'offline' | 'busy' | 'away' | string;
  model?: string;
  avatar?: AvatarOptions;
  capabilities?: string[];
  actions?: string;
  variant?: 'default' | 'flat' | 'bordered' | 'recessed';
  classes?: string;
}

export function agentCardRecipe(options?: AgentCardRecipeOptions): string;

export interface CreateSkillDialogRecipeOptions {
  id?: string;
  title?: string;
  description?: string;
  nameId?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  descId?: string;
  descLabel?: string;
  descPlaceholder?: string;
  runtimeId?: string;
  runtimeLabel?: string;
  runtimeOptions?: { value: string; label: string }[];
  submitLabel?: string;
  cancelLabel?: string;
}

export function createSkillDialogRecipe(options?: CreateSkillDialogRecipeOptions): string;

export interface DeleteResourceRecipeOptions {
  id?: string;
  title?: string;
  resourceName?: string;
  description?: string;
  warningText?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  requiresKeyword?: boolean;
  keyword?: string;
}

export function deleteResourceRecipe(options?: DeleteResourceRecipeOptions): string;

export interface DashboardOverviewRecipeOptions {
  title?: string;
  description?: string;
  headerActions?: string;
  metrics?: (MetricCardOptions | string)[] | string;
  chart?: string;
  activity?: string;
  table?: string;
  classes?: string;
}

export function dashboardOverviewRecipe(options?: DashboardOverviewRecipeOptions): string;

export interface RevenueChartRecipeOptions {
  id?: string;
  title?: string;
  description?: string;
  actions?: string;
  metrics?: (MetricCardOptions | string)[];
  chart?: string;
  summary?: string;
  footer?: string;
  classes?: string;
}

export function revenueChartRecipe(options?: RevenueChartRecipeOptions): string;

export interface DataWorkspaceRecipeOptions {
  brand?: { name: string; badge?: string; icon?: string };
  navigation?: any[];
  projects?: any[];
  user?: { name: string; role?: string; avatar?: string };
  title?: string;
  description?: string;
  toolbar?: string;
  table?: string;
  pagination?: string;
  classes?: string;
}

export function dataWorkspaceRecipe(options?: DataWorkspaceRecipeOptions): string;
