import { applySurface, surfaceMode } from './shared.mjs';
import { escapeHTML, uid } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { fileCard } from './file-card.mjs';
import { avatar } from './avatar.mjs';

/**
 * Render a Message component.
 * @param {Object} options
 * @returns {string} HTML string
 */
function buildMessage(options = {}) {
  const id = options.id || uid('msg');
  const role = options.role || (options.sender?.isAgent ? 'agent' : options.sender?.isSelf ? 'user' : 'user');
  const isAgent = role === 'agent' || Boolean(options.sender?.isAgent);
  const isSelf = Boolean(options.sender?.isSelf) || (role === 'user' && options.own);
  const isComment = role === 'comment';

  const status = options.status || options.state || '';
  const isDeleted = status === 'deleted';
  const isThinking = status === 'thinking';
  const isStreaming = status === 'streaming';

  const appearance = options.appearance || 'default';
  if (!['default', 'bubble'].includes(appearance)) throw new TypeError(`Invalid message appearance: ${appearance}`);
  const classes = [
    'sx-message',
    appearance === 'bubble' ? 'sx-message-bubbled' : '',
    isAgent ? 'sx-agent-message' : '',
    isSelf ? 'sx-message-outgoing' : '',
    isComment ? 'sx-message-comment' : '',
    options.classes
  ].filter(Boolean).join(' ');

  // Sender header — names are optional for every role, including agent:
  // omit `sender` to render a headerless message (e.g. an inline agent answer).
  let headerHTML = '';
  if (options.sender) {
    const senderName = typeof options.sender === 'string'
      ? options.sender
      : (isSelf ? 'You' : options.sender?.name || (isAgent ? 'Sesama Agent' : 'User'));
    const timeHTML = options.time ? `<time datetime="${escapeHTML(options.time)}">${escapeHTML(options.time)}</time>` : '';

    if (isAgent) {
      headerHTML = `<div class="sx-message-header"><span class="sx-agent-avatar" role="img" aria-label="${escapeHTML(senderName)}">${controlIcon('sparkles', 14)}</span><strong>${escapeHTML(senderName)}</strong><span class="badge">AI</span>${timeHTML}</div>`;
    } else {
      let avatarHTML = '';
      if (typeof options.sender?.avatar === 'string' && options.sender.avatar.trim().startsWith('<')) {
        avatarHTML = options.sender.avatar;
      } else {
        avatarHTML = avatar({ name: senderName, size: 24 });
      }
      headerHTML = `<div class="sx-message-header">${avatarHTML}<strong>${escapeHTML(senderName)}</strong>${timeHTML}</div>`;
    }
  }

  // Quote / ReplyTo
  let quoteHTML = '';
  const quote = options.quote || options.replyTo;
  if (quote) {
    quoteHTML = `<blockquote class="sx-message-quote"><strong>${escapeHTML(quote.name || '')}</strong><span>${escapeHTML(quote.text || '')}</span></blockquote>`;
  }

  // Content
  let contentHTML = '';
  if (isThinking) {
    contentHTML = `<span class="sx-thinking-text">Thinking…</span>`;
  } else if (isDeleted) {
    contentHTML = options.content || 'This message was deleted.';
  } else if (options.content) {
    contentHTML = options.content;
  } else if (isStreaming) {
    contentHTML = 'Ready to generate a response.';
  }

  // Attachments
  let attachmentsHTML = '';
  if (Array.isArray(options.attachments) && options.attachments.length > 0) {
    attachmentsHTML = `<div class="sx-message-attachment">${options.attachments.map(att => typeof att === 'string' ? att : fileCard(att)).join('')}</div>`;
  } else if (typeof options.attachments === 'string' && options.attachments.trim()) {
    attachmentsHTML = `<div class="sx-message-attachment">${options.attachments}</div>`;
  }

  // Body container. Thinking bubbles are status regions; streaming bubbles carry
  // data-agent-response so the app can stream text into them.
  const bodyClass = isThinking
    ? 'bubble sx-row sx-agent-thinking'
    : (isComment ? 'sx-message-comment-body' : 'bubble');
  const bodyAttrs = isThinking
    ? ' role="status" aria-live="polite"'
    : (isStreaming ? ' data-agent-response role="status"' : '');
  const bodyContent = isThinking
    ? contentHTML
    : `${quoteHTML}<div data-message-content ${isDeleted ? 'class="sx-help"' : ''}>${contentHTML}</div>${attachmentsHTML}`;

  // Status & actions
  const actions = options.actions ?? (isSelf ? [{ action: 'copy', icon: 'copy', label: 'Copy message' }] : []);
  let statusHTML = '';
  if (status === 'sent' && isSelf) {
    statusHTML = '<div class="sx-message-status" aria-label="Message sent">Sent</div>';
  } else if (status === 'sending') {
    statusHTML = '<div class="sx-message-status" role="status" data-message-status>Sending…</div>';
  } else if (status === 'failed') {
    statusHTML = `<div class="sx-message-status" role="status" data-message-status>Message could not be sent.</div><button type="button" class="btn outline sx-message-retry-btn" data-message-action="retry">Retry</button>`;
  }

  let actionsHTML = '';
  if (typeof actions === 'string') {
    actionsHTML = actions;
  } else if (Array.isArray(actions) && actions.length > 0) {
    const actionButtons = actions.map(action => {
      if (typeof action === 'string') {
        if (action === 'retry') {
          return `<button type="button" class="btn outline" data-message-action="retry">Retry</button>`;
        }
        if (action === 'reply') {
          return `<button type="button" class="ibtn" data-message-action="reply" aria-label="Reply">${controlIcon('chat', 16)}</button>`;
        }
        if (action === 'copy') {
          return `<button type="button" class="ibtn" data-message-action="copy" aria-label="Copy message">${controlIcon('copy', 16)}</button>`;
        }
        if (action === 'kebab') {
          return `<button type="button" class="ibtn" data-menu="Edit,Delete" aria-label="Message actions">${controlIcon('kebab', 16)}</button>`;
        }
        return `<button type="button" class="ibtn" data-message-action="${escapeHTML(action)}" aria-label="${escapeHTML(action)}">${escapeHTML(action)}</button>`;
      }
      const icon = action.icon ? controlIcon(action.icon, 16) : '';
      if (action.menu) {
        return `<button type="button" class="ibtn" data-menu="${escapeHTML(action.menu)}" aria-label="${escapeHTML(action.label)}">${icon}</button>`;
      }
      return `<button type="button" class="ibtn" data-message-action="${escapeHTML(action.action || action.label)}" aria-label="${escapeHTML(action.label)}">${icon}</button>`;
    }).join('');
    actionsHTML = `<div class="sx-row sx-message-actions">${actionButtons}</div>`;
  }

  const extraAttrs = [];
  if (options.attributes) {
    if (typeof options.attributes === 'string') {
      extraAttrs.push(options.attributes);
    } else if (typeof options.attributes === 'object') {
      for (const [k, v] of Object.entries(options.attributes)) {
        extraAttrs.push(`${k}="${escapeHTML(v)}"`);
      }
    }
  }

  return `<div class="${classes}" data-sui-message id="${escapeHTML(id)}" data-message-id="${escapeHTML(id)}" ${extraAttrs.join(' ')}>${headerHTML}<div class="${bodyClass}"${bodyAttrs}>${bodyContent}</div>${statusHTML}${actionsHTML}</div>`;
}

const instances = new WeakMap();

/**
 * Initialize Message controller.
 * @param {HTMLElement} element
 * @returns {Object} Controller instance
 */
export function initMessage(element) {
  if (!element) return null;
  if (instances.has(element)) return instances.get(element);

  const messageId = element.dataset.messageId || element.id || '';

  function handleActionClick(e) {
    const actionBtn = e.target.closest('[data-message-action]');
    if (!actionBtn) return;
    const action = actionBtn.dataset.messageAction;

    if (action === 'copy') {
      const contentEl = element.querySelector('[data-message-content]');
      const text = contentEl ? contentEl.textContent.trim() : '';
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
      element.dispatchEvent(new CustomEvent('sui:message:copy', {
        bubbles: true,
        detail: { id: messageId, text }
      }));
      return;
    }

    if (action === 'retry') {
      element.dispatchEvent(new CustomEvent('sui:message:retry', {
        bubbles: true,
        detail: { id: messageId }
      }));
      return;
    }

    element.dispatchEvent(new CustomEvent('sui:message:action', {
      bubbles: true,
      detail: { id: messageId, action }
    }));
  }

  element.addEventListener('click', handleActionClick);

  const controller = {
    element,
    setStatus(status) {
      const statusEl = element.querySelector('[data-message-status]');
      if (statusEl) {
        statusEl.textContent = status;
      }
    },
    setContent(text) {
      const contentEl = element.querySelector('[data-message-content]');
      if (contentEl) {
        contentEl.textContent = text;
      }
    },
    destroy() {
      element.removeEventListener('click', handleActionClick);
      instances.delete(element);
    }
  };

  instances.set(element, controller);
  return controller;
}


export function message(...args) {
  const mode = surfaceMode(args);
  return applySurface(buildMessage(...args), mode, ["bubble|sx-message-body|sx-message-content|sx-message-comment-body"]);
}
