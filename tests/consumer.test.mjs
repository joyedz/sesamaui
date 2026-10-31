import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  // Public structural blocks
  appShell,
  workspaceSidebar,
  pageHeader,
  pageLayout,
  pageGrid,
  // Public content blocks
  contentSection,
  dataSection,
  metricCard,
  peopleList,
  activityFeed,
  // Public components
  button,
  iconButton,
  linkButton,
  input,
  inputField,
  initInput,
  select,
  modal,
  table,
  badge,
  statusDot,
  avatar,
  showToast,
  // Public runtime
  mount,
  registerController,
  controllerRegistry,
} from '../src/index.mjs';

function createMockElement(tagName, attrs = {}, children = []) {
  const listeners = new Map();
  const dataset = {};
  for (const [key, val] of Object.entries(attrs)) {
    if (key.startsWith('data-')) {
      const camel = key.slice(5).replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
      dataset[camel] = val;
    }
  }

  const el = {
    tagName: tagName.toUpperCase(),
    attributes: { ...attrs },
    dataset,
    children: [...children],
    parentNode: null,
    ownerDocument: null,
    type: attrs.type || (tagName.toLowerCase() === 'button' ? 'submit' : 'text'),
    value: attrs.value || '',
    disabled: Boolean(attrs.disabled),
    required: Boolean(attrs.required),
    matches(sel) {
      if (!sel) return false;
      if (sel === ':disabled') return this.disabled;
      if (sel.toLowerCase() === tagName.toLowerCase()) return true;
      if (sel.startsWith('[data-') && sel.endsWith(']')) {
        const attr = sel.slice(1, -1);
        return attr in attrs;
      }
      return false;
    },
    querySelector(sel) {
      for (const item of this.querySelectorAll(sel)) return item;
      return null;
    },
    querySelectorAll(sel) {
      const results = [];
      function walk(node) {
        for (const child of node.children) {
          if (child.matches(sel)) results.push(child);
          walk(child);
        }
      }
      walk(this);
      return results;
    },
    contains(target) {
      let cur = target;
      while (cur) {
        if (cur === this) return true;
        cur = cur.parentNode;
      }
      return false;
    },
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    removeEventListener(type, fn) {
      const list = listeners.get(type) || [];
      listeners.set(type, list.filter(f => f !== fn));
    },
    dispatchEvent(event) {
      event.target = this;
      for (const fn of (listeners.get(event.type) || [])) fn(event);
      return !event.defaultPrevented;
    },
    checkValidity() {
      if (this.required && !this.value) return false;
      return true;
    },
    reportValidity() {
      return this.checkValidity();
    },
    setCustomValidity(msg) {
      this.customValidity = msg;
    }
  };

  const doc = {
    defaultView: {
      CustomEvent: class {
        constructor(type, opts = {}) {
          this.type = type;
          this.detail = opts.detail;
          this.bubbles = Boolean(opts.bubbles);
          this.defaultPrevented = false;
        }
        preventDefault() { this.defaultPrevented = true; }
      },
      MutationObserver: class {
        constructor(callback) { this.callback = callback; }
        observe() {}
        disconnect() {}
      }
    }
  };

  el.ownerDocument = doc;
  for (const child of el.children) {
    child.parentNode = el;
    child.ownerDocument = doc;
  }
  return el;
}

test('Consumer API surface: only canonical exports are required', () => {
  assert.equal(typeof appShell, 'function');
  assert.equal(typeof workspaceSidebar, 'function');
  assert.equal(typeof pageHeader, 'function');
  assert.equal(typeof pageLayout, 'function');
  assert.equal(typeof pageGrid, 'function');
  assert.equal(typeof dataSection, 'function');
  assert.equal(typeof contentSection, 'function');
  assert.equal(typeof metricCard, 'function');
  assert.equal(typeof peopleList, 'function');
  assert.equal(typeof activityFeed, 'function');
  assert.equal(typeof button, 'function');
  assert.equal(typeof iconButton, 'function');
  assert.equal(typeof linkButton, 'function');
  assert.equal(typeof input, 'function');
  assert.equal(typeof inputField, 'function');
  assert.equal(typeof initInput, 'function');
  assert.equal(typeof select, 'function');
  assert.equal(typeof modal, 'function');
  assert.equal(typeof table, 'function');
  assert.equal(typeof badge, 'function');
  assert.equal(typeof statusDot, 'function');
  assert.equal(typeof avatar, 'function');
  assert.equal(typeof showToast, 'function');
  assert.equal(typeof mount, 'function');
  assert.equal(typeof registerController, 'function');
  assert.ok(controllerRegistry instanceof Map);
});

test('Consumer DOM-free rendering: builds complete page structure as pure HTML strings', () => {
  const sidebarMarkup = workspaceSidebar({
    brand: { name: 'Acme Systems', badge: 'v2.0' },
    navigation: [
      { id: 'projects', label: 'Projects', icon: 'folder', active: true },
      { id: 'analytics', label: 'Analytics', icon: 'file-text' }
    ],
    projects: [
      {
        id: 'client-work',
        label: 'Client Work',
        items: [
          { id: 'p1', label: 'Portal Redesign', active: true },
          { id: 'p2', label: 'Mobile App' }
        ]
      }
    ]
  });

  const headerMarkup = pageHeader({
    title: 'Project Directory',
    subtitle: 'Manage client deliverables and project milestones',
    badge: badge({ label: '12 Active', variant: 'success' }),
    actions: button({ label: 'Create Project', variant: 'primary', icon: 'plus' })
  });

  const searchInput = inputField({
    id: 'project-search',
    name: 'search',
    label: 'Search Projects',
    placeholder: 'Filter by name or owner...',
    icon: 'search'
  });

  const projectTable = table({
    id: 'projects-table',
    columns: [
      { key: 'name', label: 'Project Name', sortable: true },
      { key: 'owner', label: 'Lead' },
      { key: 'status', label: 'Status' }
    ],
    rows: [
      {
        id: 'row-1',
        name: 'Portal Redesign',
        owner: 'Jane Doe',
        status: statusDot({ status: 'success', label: 'On Track' })
      },
      {
        id: 'row-2',
        name: 'Mobile App',
        owner: 'John Smith',
        status: statusDot({ status: 'warning', label: 'At Risk' })
      }
    ]
  });

  const dataSectionMarkup = dataSection({
    title: 'Active Initiatives',
    description: 'Current client initiatives under active management',
    filters: searchInput,
    table: projectTable
  });

  const fullPage = appShell({
    sidebar: sidebarMarkup,
    header: headerMarkup,
    content: dataSectionMarkup
  });

  // Structural contracts
  assert.ok(typeof fullPage === 'string', 'fullPage must be a string');
  assert.ok(fullPage.length > 500, 'Page markup should be substantial');

  // Block markers
  assert.ok(fullPage.includes('data-sui-app-shell'), 'Page must contain app shell marker');
  assert.ok(fullPage.includes('data-sui-workspace-sidebar'), 'Sidebar must contain workspace marker');
  assert.ok(fullPage.includes('data-sui-page-header'), 'Header must contain page header marker');
  assert.ok(fullPage.includes('data-sui-data-section'), 'Data section marker must be present');
  assert.ok(fullPage.includes('data-sui-table'), 'Table marker must be present');
  assert.ok(fullPage.includes('data-sui-input-field'), 'Input field marker must be present');

  // Consumer content
  assert.ok(fullPage.includes('Acme Systems'), 'Brand name must be rendered');
  assert.ok(fullPage.includes('Project Directory'), 'Page title must be rendered');
  assert.ok(fullPage.includes('Portal Redesign'), 'Row contents must be rendered');
  assert.ok(fullPage.includes('On Track'), 'Status indicator must be rendered');
});

test('Consumer hydration: mount() binds controllers and provides refresh/destroy lifecycle', () => {
  // mount requires DOM root
  assert.throws(() => mount(null), /mount requires a DOM root/);
  assert.throws(() => mount({}), /mount requires a DOM root/);

  // Setup mock DOM for a form with an input field
  const inputEl = createMockElement('input', {
    type: 'text',
    name: 'email',
    value: '',
    required: 'true'
  });

  const fieldWrapper = createMockElement('div', {
    'data-sui-input-field': '',
    'data-sui-input-type': 'text'
  }, [inputEl]);

  const submitBtn = createMockElement('button', {
    type: 'submit'
  });

  const formEl = createMockElement('form', {
    action: '/api/submit'
  }, [fieldWrapper, submitBtn]);

  inputEl.form = formEl;

  const container = createMockElement('div', {
    id: 'app-container'
  }, [formEl]);

  // Direct controller access before or alongside mount
  const inputCtrl = initInput(fieldWrapper);
  assert.equal(inputCtrl.destroyed, false);
  assert.equal(inputCtrl.value, '');

  // Hydrate root
  const session = mount(container);
  assert.ok(session, 'mount() returns a session object');
  assert.equal(typeof session.refresh, 'function');
  assert.equal(typeof session.destroy, 'function');

  // Idempotency: mounting the same root returns the existing session
  const sameSession = mount(container);
  assert.equal(session, sameSession, 'mount is idempotent for the same DOM root');

  // Controller interaction
  inputCtrl.setValue('consumer@example.com');
  assert.equal(inputCtrl.value, 'consumer@example.com');
  assert.equal(inputEl.value, 'consumer@example.com');
  assert.equal(inputCtrl.checkValidity(), true);

  // Form submission handling
  let submitted = false;
  let submittedEmail = null;
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    submitted = true;
    submittedEmail = inputCtrl.value;
  });

  const submitEvent = new container.ownerDocument.defaultView.CustomEvent('submit');
  formEl.dispatchEvent(submitEvent);

  assert.equal(submitted, true, 'Form submit listener fired');
  assert.equal(submittedEmail, 'consumer@example.com', 'Form processed correct value');

  // Teardown / unmount
  session.destroy();
  assert.equal(inputCtrl.destroyed, true, 'Controller marked destroyed after session teardown');

  // Calling methods on destroyed controller fails safely
  assert.throws(() => {
    inputCtrl.setValue('another@example.com');
  }, /Input controller has been destroyed/);

  // Refreshing a destroyed session throws
  assert.throws(() => {
    session.refresh();
  }, /Mount session has been destroyed/);
});
