import { applySurface, surfaceMode } from '../components/shared.mjs';
import { escapeHTML, uid } from '../components/shared.mjs';
import { card } from '../components/card.mjs';
import { avatar } from '../components/avatar.mjs';
import { badge } from '../components/badge.mjs';
import { statusDot } from '../components/status-dot.mjs';

/**
 * Agent Card Recipe
 * Domain recipe using Card, Avatar, Badges, and Status.
 */
function buildAgentCardRecipe(options = {}) {
  const {
    id = uid(),
    name = 'AI Agent',
    headerActions = '',
    role = 'Assistant',
    description = '',
    status = 'online', // 'online' | 'offline' | 'busy' | 'away'
    model = '',
    avatar: avatarOpts = {},
    capabilities = [],
    actions = '',
    variant = 'bordered',
    classes = '',
  } = options;

  const statusTone = status === 'online' ? 'success' : status === 'offline' ? 'neutral' : 'warning';
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

  const avatarMarkup = avatar({
    name,
    initials: name.slice(0, 2).toUpperCase(),
    size: 'lg',
    ...avatarOpts,
  });

  const statusMarkup = statusDot({ tone: statusTone, attributes: `aria-label="${escapeHTML(statusLabel)}"` });
  const modelMarkup = model ? badge({ label: model, tone: 'neutral' }) : '';

  let capsMarkup = '';
  if (Array.isArray(capabilities) && capabilities.length > 0) {
    capsMarkup = `<div class="sb-agent-capabilities">${capabilities.map(cap => badge({ label: cap, tone: 'informative' })).join(' ')}</div>`;
  }

  const headerMarkup = `
    <div class="sb-agent-header">
      <div class="sb-agent-avatar-wrap">
        ${avatarMarkup}
        <span class="sb-agent-status-indicator">${statusMarkup}</span>
      </div>
      <div class="sb-agent-meta">
        <h4 class="sb-agent-name">${escapeHTML(name)}</h4>
        <div class="sb-agent-sub">${escapeHTML(role)} ${modelMarkup}</div>
      </div>
    </div>
  `;

  const bodyMarkup = `
    ${description ? `<p class="sb-agent-desc">${escapeHTML(description)}</p>` : ''}
    ${capsMarkup}
  `;

  return card({
    id,
    header: headerMarkup + headerActions,
    content: bodyMarkup,
    footer: actions,
    variant,
    classes: 'sb-agent-card sx-agent-card',
    attributes: 'data-sui-agent-card',
  });
}

export function agentCardRecipe(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildAgentCardRecipe(...args), mode, ["@root"]);
}
