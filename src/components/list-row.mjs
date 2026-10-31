import { escapeHTML, uid as uniqueId } from './shared.mjs';
import { controlIcon } from '../icons/controls.mjs';

const VALID_VARIANTS = new Set([
  'plain',
  'basic',
  'description',
  'icon',
  'avatar',
  'metadata',
  'badge',
  'navigation',
  'action',
  'switch',
  'checkbox',
  'radio',
  'disabled',
]);

/**
 * Pure functional builder for List Row.
 *
 * @param {object} [options]
 * @returns {string} HTML string
 */
export function listRow(options = {}) {
  const {
    variant = 'basic',
    title = '',
    description = '',
    descriptionHTML = '',
    leading: rawLeading,
    trailing: rawTrailing,
    href = '',
    disabled = false,
    checked = false,
    name = '',
    value = '',
    attributes = '',
  } = options;

  const validVariant = VALID_VARIANTS.has(variant) ? variant : 'basic';
  const isDisabled = Boolean(disabled || validVariant === 'disabled');

  let defaultTitle = title;
  if (!defaultTitle) {
    if (validVariant === 'avatar') defaultTitle = 'Jordan Lee';
    else if (validVariant === 'switch') defaultTitle = 'Email notifications';
    else if (validVariant === 'navigation') defaultTitle = 'Project settings';
    else defaultTitle = 'Project overview';
  }

  let defaultDesc = description;
  if (!defaultDesc && !descriptionHTML) {
    if (validVariant === 'description') defaultDesc = 'Keep your project information in one place.';
    else if (validVariant === 'avatar') defaultDesc = 'Product designer';
  }

  let leadingHtml = '';
  if (rawLeading !== undefined) {
    if (typeof rawLeading === 'string' && rawLeading.trim().startsWith('<')) {
      leadingHtml = `<span class="sx-list-leading">${rawLeading}</span>`;
    } else if (rawLeading) {
      leadingHtml = `<span class="sx-list-leading">${controlIcon(rawLeading, 16)}</span>`;
    }
  } else if (validVariant === 'icon') {
    leadingHtml = `<span class="sx-list-leading">${controlIcon('file-text', 16)}</span>`;
  }

  let trailingHtml = '';
  if (rawTrailing !== undefined) {
    trailingHtml = typeof rawTrailing === 'string' ? rawTrailing : '';
  } else if (validVariant === 'metadata') {
    trailingHtml = '<span class="sx-help">Updated today</span>';
  } else if (validVariant === 'badge') {
    trailingHtml = '<span class="badge">Draft</span>';
  } else if (validVariant === 'action') {
    trailingHtml = `<button type="button" class="ibtn ghost" aria-label="Row actions">${controlIcon('kebab', 16)}</button>`;
  } else if (validVariant === 'switch') {
    trailingHtml = `<button type="button" class="sw" role="switch" aria-checked="${checked ? 'true' : 'false'}" data-switch aria-label="${escapeHTML(defaultTitle)}"${isDisabled ? ' disabled' : ''}><i></i></button>`;
  } else if (validVariant === 'navigation') {
    trailingHtml = `<span class="sx-list-chevron" aria-hidden="true">${controlIcon('chevron-right', 14)}</span>`;
  }

  const descContent = descriptionHTML
    ? `<span class="sx-help">${descriptionHTML}</span>`
    : defaultDesc ? `<span class="sx-help">${escapeHTML(defaultDesc)}</span>` : '';

  const copyHtml = `<span class="sx-list-copy"><span class="sx-list-title">${escapeHTML(defaultTitle)}</span>${descContent}</span>`;

  const classes = ['lrow', 'sx-list-row'];
  if (validVariant === 'plain') classes.push('sx-list-row-plain');
  if (validVariant === 'navigation') classes.push('sx-list-link');
  if (isDisabled) classes.push('off');

  const disabledAttr = isDisabled ? ' aria-disabled="true"' : '';
  const classAttr = `class="${classes.join(' ')}"`;
  const extraAttrs = attributes ? ` ${attributes}` : '';

  // Navigation variant with link semantics
  if (validVariant === 'navigation' && href && !isDisabled) {
    return `<a ${classAttr} href="${escapeHTML(href)}"${extraAttrs}>${leadingHtml}${copyHtml}${trailingHtml}</a>`;
  }

  // Choice inputs (checkbox / radio)
  if (validVariant === 'checkbox' || validVariant === 'radio') {
    const inputId = uniqueId(`sx-lr-${validVariant}`);
    const inputName = name || inputId;
    const inputValAttr = value ? ` value="${escapeHTML(value)}"` : '';
    const checkedAttr = checked ? ' checked' : '';
    const disabledInputAttr = isDisabled ? ' disabled' : '';

    return `<label class="lrow sx-list-row sx-list-select sx-choice${isDisabled ? ' off' : ''}"${disabledAttr}${extraAttrs}><input type="${validVariant}" name="${escapeHTML(inputName)}"${inputValAttr}${checkedAttr}${disabledInputAttr} aria-label="Select ${escapeHTML(defaultTitle)}">${leadingHtml}${copyHtml}${trailingHtml}</label>`;
  }

  return `<div ${classAttr}${disabledAttr}${extraAttrs}>${leadingHtml}${copyHtml}${trailingHtml}</div>`;
}
