import { escapeHTML, uid } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';
import { fileCard, initFileCard } from './file-card.mjs';
import { select } from './select.mjs';
import { menu } from './menu.mjs';

const DEFAULT_MODELS = [
  {
    label: 'OpenAI',
    options: ['GPT-6.1 Sol', 'GPT-6.1 Terra', 'GPT-6 Astra', 'GPT-6 Luna']
  },
  {
    label: 'Anthropic',
    options: ['Claude Sonnet 5.5', 'Claude Opus 5.5']
  },
  {
    label: 'Google',
    options: ['Gemini 3.5 Flash', 'Gemini 3.5 Flash-Lite']
  }
];

function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || isNaN(bytes)) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Render a Composer component.
 * @param {Object} options
 * @returns {string} HTML string
 */
export function composer(options = {}) {
  const id = options.id || uid('composer');
  const placeholder = options.placeholder || 'Write a message or tag @flow';
  const value = options.value || '';
  const attachments = Array.isArray(options.attachments) ? options.attachments : [];
  const rows = options.rows || 2;
  const showMic = options.showMic !== false;
  const showAttach = options.showAttach !== false;

  const state = options.state || (value ? 'ready' : 'empty');
  const canSend = state !== 'empty' || value.trim().length > 0 || attachments.length > 0;
  const isThinking = state === 'thinking';

  // Context options
  const contextOptions = options.contextOptions || ['Base', 'feature/torque-420'];
  const contextValue = options.contextValue || (typeof contextOptions[0] === 'string' ? contextOptions[0] : contextOptions[0]?.value || 'Base');

  // Model options
  const modelOptions = options.modelOptions || DEFAULT_MODELS;
  const isGrouped = Array.isArray(modelOptions) && modelOptions.length > 0 && Boolean(modelOptions[0].groups || modelOptions[0].options);
  const modelValue = options.modelValue || (isGrouped ? (modelOptions[0].options?.[0]?.value || modelOptions[0].options?.[0] || 'GPT-6.1 Sol') : (typeof modelOptions[0] === 'string' ? modelOptions[0] : modelOptions[0]?.value || 'GPT-6.1 Sol'));

  const classes = ['composer', 'sx-composer', options.classes].filter(Boolean).join(' ');

  // Attachments markup
  let attachmentsHTML = '';
  if (attachments.length > 0) {
    attachmentsHTML = attachments.map(att => fileCard({ ...att, removable: true })).join('');
  }

  // Attach button with a shared Menu popup; initMenu positions it on toggle
  let attachButtonHTML = '';
  if (showAttach) {
    const popupId = `${id}-attach-menu`;
    const popupHTML = menu({
      id: popupId,
      ariaLabel: 'Add attachments or integrations',
      attributes: 'popover data-composer-attach-menu',
      groups: [
        {
          label: 'Attachments',
          items: [
            { label: 'Upload file', icon: 'file', attributes: 'data-composer-action="upload-file"' },
            { label: 'Upload image', icon: 'file-image', attributes: 'data-composer-action="upload-image"' }
          ]
        },
        {
          label: 'Integrations',
          items: [
            { label: 'Connect apps', icon: 'plus', attributes: 'data-composer-action="apps"' },
            { label: 'Plugins', icon: 'box', attributes: 'data-composer-action="plugins"' },
            { label: 'MCP', icon: 'code', attributes: 'data-composer-action="mcp"' }
          ]
        }
      ]
    });
    attachButtonHTML = `<div><button type="button" class="ibtn" popovertarget="${popupId}" aria-haspopup="menu" aria-expanded="false" aria-label="Add attachment" title="Add attachment" data-composer-attach-trigger>${controlIcon('plus', 16)}</button>${popupHTML}</div>`;
  }

  // Context select
  const contextSelectHTML = select({
    name: 'context',
    ariaLabel: 'Choose context',
    inline: true,
    icon: 'branch',
    value: contextValue,
    options: contextOptions
  });

  // Model select
  const modelSelectConfig = {
    name: 'model',
    ariaLabel: 'Choose model',
    inline: true,
    value: modelValue
  };
  if (isGrouped) {
    modelSelectConfig.groups = modelOptions;
  } else {
    modelSelectConfig.options = modelOptions;
  }
  const modelSelectHTML = `<div class="composer-model">${select(modelSelectConfig)}</div>`;

  // Mic button
  const micButtonHTML = showMic
    ? `<button type="button" class="ibtn" data-composer-mic aria-pressed="false" aria-label="Microphone" title="Microphone">${controlIcon('mic', 16)}</button>`
    : '';

  // Send / Stop button
  let sendButtonHTML = '';
  if (isThinking) {
    sendButtonHTML = `<button type="button" class="send" data-composer-stop aria-label="Stop response" title="Stop response"><span class="composer-stop-square" aria-hidden="true"></span></button>`;
  } else {
    sendButtonHTML = `<button type="button" class="send" data-send ${canSend ? '' : 'disabled'} aria-label="Send comment" title="Send comment">${controlIcon('up', 14)}</button>`;
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

  return `<div class="${classes}" data-sui-composer id="${escapeHTML(id)}" data-composer-id="${escapeHTML(id)}" data-state="${escapeHTML(state)}" ${extraAttrs.join(' ')}><div class="composer-attachments" data-composer-attachments ${attachments.length > 0 ? '' : 'hidden'}>${attachmentsHTML}</div><input type="file" data-composer-files multiple hidden><textarea rows="${rows}" data-composer-autoresize placeholder="${escapeHTML(placeholder)}" aria-label="Comment">${escapeHTML(value)}</textarea><div class="cbar sx-composer-bar">${attachButtonHTML}${contextSelectHTML}<span class="grow"></span>${modelSelectHTML}${micButtonHTML}${sendButtonHTML}</div></div>`;
}

const instances = new WeakMap();

/**
 * Initialize Composer controller.
 * @param {HTMLElement} element
 * @returns {Object} Controller instance
 */
export function initComposer(element) {
  if (!element) return null;
  if (instances.has(element)) return instances.get(element);

  const composerId = element.dataset.composerId || element.id || '';
  const textarea = element.querySelector('textarea');
  const attachmentsContainer = element.querySelector('[data-composer-attachments]');
  const fileInput = element.querySelector('[data-composer-files]');
  let sendBtn = element.querySelector('[data-send], [data-composer-stop]');
  const micBtn = element.querySelector('[data-composer-mic]');

  const createdObjectUrls = new Set();
  const fileCardControllers = new Map();

  function initExistingCards() {
    if (!attachmentsContainer) return;
    attachmentsContainer.querySelectorAll('.fcard').forEach(cardEl => {
      const fc = initFileCard(cardEl);
      if (fc && cardEl.id) {
        fileCardControllers.set(cardEl.id, fc);
      }
    });
  }
  initExistingCards();

  function autoResize() {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  function getAttachments() {
    if (!attachmentsContainer) return [];
    return [...attachmentsContainer.querySelectorAll('.fcard')].map(card => ({
      id: card.dataset.fileId || card.id,
      name: card.querySelector('.sx-file-name')?.textContent?.trim() || '',
      type: card.dataset.fileType || '',
      src: card.dataset.fileSrc || ''
    }));
  }

  function getContext() {
    const ctxSelect = element.querySelector('select[name="context"]');
    return ctxSelect ? ctxSelect.value : '';
  }

  function getModel() {
    const modelSelect = element.querySelector('select[name="model"]');
    return modelSelect ? modelSelect.value : '';
  }

  function updateSendDisabled() {
    if (!sendBtn || element.dataset.state === 'thinking') return;
    const hasText = textarea && textarea.value.trim().length > 0;
    const hasFiles = getAttachments().length > 0;
    sendBtn.disabled = !hasText && !hasFiles;
  }

  function handleInput() {
    autoResize();
    updateSendDisabled();
  }

  function send() {
    const text = textarea ? textarea.value.trim() : '';
    const attachments = getAttachments();
    if (!text && attachments.length === 0) return;

    const payload = {
      text,
      attachments,
      context: getContext(),
      model: getModel()
    };

    element.dispatchEvent(new CustomEvent('sui:composer:send', {
      bubbles: true,
      detail: payload
    }));

    if (textarea) {
      textarea.value = '';
      textarea.style.height = 'auto';
    }
    clearAttachments();
    updateSendDisabled();
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      if (!sendBtn?.disabled && element.dataset.state !== 'thinking') {
        send();
      }
    }
  }

  function clearAttachments() {
    if (!attachmentsContainer) return;
    for (const fc of fileCardControllers.values()) {
      fc.destroy();
    }
    fileCardControllers.clear();
    for (const url of createdObjectUrls) {
      if (typeof URL !== 'undefined' && URL.revokeObjectURL) {
        URL.revokeObjectURL(url);
      }
    }
    createdObjectUrls.clear();
    attachmentsContainer.replaceChildren();
    attachmentsContainer.setAttribute('hidden', '');
  }

  function addAttachment(fileRecord) {
    if (!attachmentsContainer) return;
    const cardHTML = fileCard({ ...fileRecord, removable: true });
    const temp = document.createElement('div');
    temp.innerHTML = cardHTML.trim();
    const cardEl = temp.firstElementChild;
    attachmentsContainer.append(cardEl);
    attachmentsContainer.removeAttribute('hidden');

    const fc = initFileCard(cardEl);
    if (fc && cardEl.id) {
      fileCardControllers.set(cardEl.id, fc);
    }
    updateSendDisabled();
  }

  function removeAttachment(id) {
    if (!attachmentsContainer) return;
    const card = attachmentsContainer.querySelector(`[data-file-id="${id}"], #${id}`);
    if (card) {
      const fc = fileCardControllers.get(card.id || id);
      if (fc) {
        fc.destroy();
        fileCardControllers.delete(card.id || id);
      }
      card.remove();
      if (attachmentsContainer.querySelectorAll('.fcard').length === 0) {
        attachmentsContainer.setAttribute('hidden', '');
      }
      updateSendDisabled();
    }
  }

  function handleClick(e) {
    // Send click
    const sendTarget = e.target.closest('[data-send]');
    if (sendTarget && !sendTarget.disabled) {
      e.stopPropagation();
      send();
      return;
    }

    // Stop click
    const stopTarget = e.target.closest('[data-composer-stop]');
    if (stopTarget) {
      e.stopPropagation();
      element.dispatchEvent(new CustomEvent('sui:composer:stop', {
        bubbles: true,
        detail: { id: composerId }
      }));
      return;
    }

    // Mic click
    const micTarget = e.target.closest('[data-composer-mic]');
    if (micTarget) {
      e.stopPropagation();
      const current = micTarget.getAttribute('aria-pressed') === 'true';
      const next = !current;
      micTarget.setAttribute('aria-pressed', String(next));
      element.dispatchEvent(new CustomEvent('sui:composer:mic', {
        bubbles: true,
        detail: { active: next }
      }));
      return;
    }

    // Attachment action inside menu
    const actionTarget = e.target.closest('[data-composer-action]');
    if (actionTarget) {
      const action = actionTarget.dataset.composerAction;
      if (action === 'upload-file' || action === 'upload-image') {
        if (fileInput) fileInput.click();
      }
      element.dispatchEvent(new CustomEvent('sui:composer:attach', {
        bubbles: true,
        detail: { action }
      }));
      return;
    }

    // Attachment removal button
    const removeTarget = e.target.closest('[data-composer-remove-file], [data-file-remove]');
    if (removeTarget) {
      const card = removeTarget.closest('.fcard');
      if (card) {
        const id = card.dataset.fileId || card.id;
        removeAttachment(id);
      }
      return;
    }
  }

  function handleFileChange() {
    if (!fileInput || !fileInput.files?.length) return;
    const added = [];
    for (const file of fileInput.files) {
      const fileSrc = (typeof URL !== 'undefined' && URL.createObjectURL) ? URL.createObjectURL(file) : '';
      if (fileSrc) createdObjectUrls.add(fileSrc);
      const record = {
        id: uid('file'),
        name: file.name,
        size: formatFileSize(file.size),
        src: fileSrc
      };
      addAttachment(record);
      added.push(record);
    }
    fileInput.value = '';
    element.dispatchEvent(new CustomEvent('sui:composer:attach', {
      bubbles: true,
      detail: { files: added }
    }));
  }

  function handleFileRemoveEvent(e) {
    if (e.target.closest('.composer') === element) {
      const id = e.detail?.id;
      if (id) removeAttachment(id);
    }
  }

  if (textarea) {
    textarea.addEventListener('input', handleInput);
    textarea.addEventListener('keydown', handleKeydown);
  }
  element.addEventListener('click', handleClick);
  element.addEventListener('sui:file:remove', handleFileRemoveEvent);
  if (fileInput) {
    fileInput.addEventListener('change', handleFileChange);
  }

  function setState(state) {
    element.dataset.state = state;
    sendBtn = element.querySelector('[data-send], [data-composer-stop]');
    if (!sendBtn) return;

    if (state === 'thinking') {
      sendBtn.removeAttribute('data-send');
      sendBtn.setAttribute('data-composer-stop', '');
      sendBtn.setAttribute('aria-label', 'Stop response');
      sendBtn.innerHTML = '<span class="composer-stop-square" aria-hidden="true"></span>';
      sendBtn.disabled = false;
    } else {
      sendBtn.removeAttribute('data-composer-stop');
      sendBtn.setAttribute('data-send', '');
      sendBtn.setAttribute('aria-label', 'Send comment');
      sendBtn.innerHTML = controlIcon('up', 14);
      updateSendDisabled();
    }
  }

  const controller = {
    element,
    getValue() {
      return textarea ? textarea.value : '';
    },
    setValue(val) {
      if (textarea) {
        textarea.value = val;
        autoResize();
        updateSendDisabled();
      }
    },
    getAttachments,
    addAttachment,
    removeAttachment,
    clear() {
      if (textarea) {
        textarea.value = '';
        textarea.style.height = 'auto';
      }
      clearAttachments();
      updateSendDisabled();
    },
    setState,
    focus() {
      textarea?.focus();
    },
    destroy() {
      if (textarea) {
        textarea.removeEventListener('input', handleInput);
        textarea.removeEventListener('keydown', handleKeydown);
      }
      element.removeEventListener('click', handleClick);
      element.removeEventListener('sui:file:remove', handleFileRemoveEvent);
      if (fileInput) {
        fileInput.removeEventListener('change', handleFileChange);
      }
      clearAttachments();
      instances.delete(element);
    }
  };

  instances.set(element, controller);
  return controller;
}
