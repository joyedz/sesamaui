import { popover, initPopover, listRow, escapeHTML, runeIcon, controlIcon } from '../src/index.mjs';
import { demoCategories } from '../demos/shared/pages.mjs';

const components = [
  { label: 'All components', description: 'Explore the full library.', icon: 'grid-3x3', href: '/site/Design%20system.html' },
  { label: 'Buttons', description: 'Actions, variants, and states.', icon: 'plus', href: '/site/Design%20system.html#components-button' },
  { label: 'Composer', description: 'Messages, context, and attachments.', icon: 'sparkles', href: '/site/Design%20system.html#components-composer' },
  { label: 'Charts', description: 'Make your data easier to read.', icon: 'activity', href: '/site/Design%20system.html#components-chart' }
];
const resources = [
  { label: 'Get started', description: 'Install Sesama and build your first page.', icon: 'file-text', href: '/site/Design%20system.html#installations' },
  { label: 'For agents', description: 'Build with the shared components and skill.', icon: 'sparkles', href: '#foundations' }
];
const descriptions = {
  dashboard: 'Metrics and business data',
  'ai-agent': 'Conversations and agents',
  'issue-workspace': 'Your team’s daily work',
  onboarding: 'Start with a warm welcome'
};

function row(page, description = '') {
  return listRow({ variant: 'navigation', appearance: 'plain', title: page.label,
    description, leading: page.icon === 'inbox' ? runeIcon('inbox', 16) : controlIcon(page.icon, 16), trailing: '', href: page.href,
    attributes: page.href.startsWith('#') ? '' : 'target="_blank" rel="noopener noreferrer"' });
}

function panel(label, kind, mobile = false) {
  const id = `landing-${mobile ? 'mobile-' : ''}${kind}`;
  const content = kind === 'demo'
    ? `<div class="lp-nav-columns">${demoCategories.map(category => `<section class="lp-nav-category" aria-labelledby="${id}-${category.id}">
        <div class="lp-nav-category-heading"><h2 id="${id}-${category.id}">${escapeHTML(category.label)}</h2><p>${escapeHTML(descriptions[category.id])}</p></div>
        <div class="lp-nav-links">${category.pages.map(page => row(page)).join('')}</div>
      </section>`).join('')}</div><div class="lp-nav-note">Built with shared Sesama components. Explore a working demo.</div>`
    : `<div class="lp-nav-directory">${(kind === 'components' ? components : resources).map(page => row(page, page.description)).join('')}</div>`;
  return popover({ id, ariaLabel: label, placement: 'bottom', align: 'center',
    attributes: `data-landing-navigation="${kind}"`,
    trigger: `<button type="button" class="lp-nav-trigger" data-sui-popover-trigger popovertarget="${id}" aria-controls="${id}" aria-haspopup="dialog" aria-expanded="false">${label}<span class="lp-nav-chevron" aria-hidden="true">${controlIcon('chevron-down', 12)}</span></button>`,
    content });
}

export function installLandingNavigation() {
  const desktop = document.getElementById('lp-header-navigation');
  const mobile = document.getElementById('lp-mobile-navigation');
  for (const host of [desktop, mobile]) host.classList.add('sui-root', 'lp-navigation-system');
  desktop.innerHTML = panel('Demo', 'demo') + panel('Components', 'components') + panel('Resources', 'resources');
  mobile.innerHTML = panel('Demo', 'demo', true);

  const entries = [...document.querySelectorAll('[data-landing-navigation]')].map(wrapper => ({
    wrapper, controller: initPopover(wrapper), trigger: wrapper.querySelector('[data-sui-popover-trigger]'),
    popup: wrapper.querySelector('[data-sui-popover-content]'), closeTimer: null
  }));
  const canHover = matchMedia('(hover: hover) and (pointer: fine)');
  function cancel(entry) { clearTimeout(entry.closeTimer); }
  function open(entry) {
    cancel(entry);
    for (const other of entries) if (other !== entry) { cancel(other); other.controller.close(); }
    entry.controller.open();
  }
  function later(entry) {
    cancel(entry);
    entry.closeTimer = setTimeout(() => {
      if (entry.popup.contains(document.activeElement)) return;
      entry.controller.close();
    }, 180);
  }
  for (const entry of entries) {
    const { wrapper, trigger, popup, controller } = entry;
    trigger.addEventListener('click', event => {
      if (canHover.matches && event.detail > 0 && event.pointerType !== 'touch' && controller.isOpen()) {
        event.preventDefault(); event.stopImmediatePropagation();
      }
    }, true);
    // Only mouse hover opens navigation; touch keeps the shared click behavior.
    trigger.addEventListener('pointerenter', event => { if (canHover.matches && event.pointerType === 'mouse') open(entry); });
    trigger.addEventListener('pointerleave', event => { if (canHover.matches && event.pointerType === 'mouse') later(entry); });
    popup.addEventListener('pointerenter', () => cancel(entry));
    popup.addEventListener('pointerleave', event => { if (canHover.matches && event.pointerType === 'mouse') later(entry); });
    wrapper.addEventListener('sui:popover:open', () => {
      for (const other of entries) if (other !== entry) other.controller.close();
    });
    wrapper.addEventListener('focusout', event => {
      if (event.relatedTarget && !wrapper.contains(event.relatedTarget)) controller.close();
    });
    wrapper.addEventListener('keydown', event => {
      if (event.key === 'Tab' && controller.isOpen()) {
        const links = [...popup.querySelectorAll('a[href]')];
        const index = links.indexOf(document.activeElement);
        if (event.target === trigger && !event.shiftKey) { event.preventDefault(); links[0]?.focus(); return; }
        if (index >= 0) {
          const next = index + (event.shiftKey ? -1 : 1);
          if (next >= 0 && next < links.length) { event.preventDefault(); links[next].focus(); return; }
          if (next < 0) { event.preventDefault(); controller.close(true); return; }
        }
      }
      if (event.target === trigger && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault(); open(entry);
        const links = popup.querySelectorAll('a[href]');
        (event.key === 'ArrowUp' ? links[links.length - 1] : links[0])?.focus();
      }
    });
    popup.addEventListener('click', event => { if (event.target.closest('a[href]')) controller.close(); });
  }
  window.addEventListener('resize', () => entries.forEach(entry => entry.controller.close()));
}
