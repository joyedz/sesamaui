import type { Surface } from '../surface.d.mts';
import type { AvatarOptions } from '../components/avatar.mjs';

export interface AgentCardRecipeOptions {
  /** Solid by default; blur keeps the existing component variant and tone. */
  surface?: Surface;
  /** Trusted application HTML for top-right card actions. */
  headerActions?: string;
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
