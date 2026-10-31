import {test} from 'node:test';
import assert from 'node:assert/strict';

import {
  button, iconButton, linkButton, socialButton,
  input, inputField, textarea, select, combobox, datePicker, tagInput,
  checkbox, radio, switchControl, chip, badge, statusDot, label, divider,
  skeleton, loader, breadcrumbs, table, pagination, tree, treeItem, treeSection,
  listRow, message, fileCard, toolCall, agentRun, composer, canvas, chart, wire, collapsible, toolbar,
  avatar, banner, card, emptyState, popover, dropdownMenu, menu, menuItem,
  modal, scrollArea, tabs, tooltip, commandPalette
} from '../src/index.mjs';
import {
  appShell, workspaceSidebar, pageHeader, pageLayout, pageGrid,
  contentSection, dataSection, metricCard, chartSection,
  peopleList, activityFeed
} from '../src/blocks/index.mjs';

// Payloads: an injected tag must never appear as real markup, and a
// quote-breakout must never produce a real attribute.
const TAG = '<img src=x onerror="alert(1)">';
const BREAKOUT = 'x" onerror="alert(1)';

function assertSafe(html, note = '') {
  assert.ok(!html.includes('<img'), `raw <img injected ${note}: ${html.slice(0, 200)}`);
  assert.ok(!html.includes('<script'), `raw <script injected ${note}: ${html.slice(0, 200)}`);
  assert.ok(!html.includes('" onerror="'), `attribute breakout injected ${note}: ${html.slice(0, 200)}`);
}

test('action builders escape text and attributes', () => {
  assertSafe(button({label: TAG, id: BREAKOUT, ariaLabel: TAG}));
  assertSafe(button({label: BREAKOUT}));
  assertSafe(iconButton({name: 'kebab', accessibleLabel: TAG, id: BREAKOUT, label: TAG}));
  assertSafe(iconButton({name: 'kebab', label: BREAKOUT}));
  assertSafe(linkButton({label: TAG, href: BREAKOUT}));
  assertSafe(linkButton({label: BREAKOUT}));
  assertSafe(socialButton({provider: 'google', label: TAG}));
  assertSafe(socialButton({provider: 'github', label: BREAKOUT}));
});

test('form builders escape labels, values, messages and attributes', () => {
  assertSafe(inputField({
    id: BREAKOUT, name: BREAKOUT, label: TAG, placeholder: TAG, value: TAG,
    helper: TAG, error: TAG, prefix: TAG, suffix: TAG, autocomplete: BREAKOUT, ariaLabel: TAG
  }));
  assertSafe(input({name: BREAKOUT, value: TAG, placeholder: TAG, label: TAG}));
  assertSafe(textarea({id: BREAKOUT, name: BREAKOUT, label: TAG, value: TAG, placeholder: TAG, helper: TAG, error: TAG}));
  assertSafe(select({
    name: BREAKOUT, label: TAG, ariaLabel: TAG, placeholder: TAG, value: 'design',
    helper: TAG, error: TAG,
    options: ['design', {label: TAG, value: TAG}],
  }));
  assertSafe(select({
    name: 'team', value: 'a',
    groups: [{label: TAG, options: [{label: TAG, value: 'a'}]}],
    actions: [{key: 'x', label: TAG, icon: 'plus'}]
  }));
  assertSafe(combobox({
    name: BREAKOUT, label: TAG, placeholder: TAG, value: TAG, helper: TAG, error: TAG,
    options: [{value: TAG, label: TAG}]
  }));
  assertSafe(datePicker({
    name: BREAKOUT, label: TAG, value: TAG, min: BREAKOUT, max: BREAKOUT,
    placeholder: TAG, helper: TAG, error: TAG
  }));
  assertSafe(tagInput({name: BREAKOUT, label: TAG, tags: [TAG, BREAKOUT], placeholder: TAG, helper: TAG, error: TAG}));
  assertSafe(checkbox({id: BREAKOUT, name: BREAKOUT, value: TAG, label: TAG, description: TAG}));
  assertSafe(radio({id: BREAKOUT, name: BREAKOUT, value: TAG, label: TAG, description: TAG}));
  assertSafe(switchControl({id: BREAKOUT, name: BREAKOUT, value: TAG, label: TAG, description: TAG}));
});

test('display builders escape text', () => {
  assertSafe(chip({label: TAG}));
  assertSafe(chip({label: BREAKOUT, removable: true}));
  assertSafe(badge({label: TAG}));
  assertSafe(statusDot({tone: 'success', label: TAG}));
  assertSafe(label({text: TAG}));
  assertSafe(divider({label: TAG}));
  assertSafe(skeleton({ariaLabel: TAG, width: BREAKOUT, height: BREAKOUT}));
  assertSafe(loader({label: TAG}));
  assertSafe(breadcrumbs({items: [{label: TAG, href: BREAKOUT}, {label: BREAKOUT, current: true}], ariaLabel: TAG}));
  assertSafe(avatar({name: TAG, initials: TAG, color: BREAKOUT}));
  assertSafe(pagination({ariaLabel: TAG, summaryText: TAG, totalItems: 1, page: 1, pageSize: 1}));
});

test('data builders escape text and headers', () => {
  assertSafe(table({
    label: TAG, ariaLabel: TAG,
    columns: [{key: TAG, header: TAG}],
    rows: [{[TAG]: TAG}]
  }));
  assertSafe(tree([{label: TAG, icon: 'file', key: BREAKOUT}]));
  assertSafe(treeItem({id: BREAKOUT, label: TAG, icon: 'file-text'}));
  assertSafe(treeSection(TAG, ''));
  assertSafe(listRow({title: TAG, description: TAG, name: BREAKOUT, value: TAG, href: BREAKOUT}));
  assertSafe(toolCall({name: TAG, input: TAG, output: TAG, error: TAG, duration: TAG}));
  assertSafe(agentRun({title: TAG, duration: TAG, steps: [
    {type: 'thinking', title: TAG, detail: TAG},
    {type: 'tool', name: TAG, input: TAG, output: TAG}
  ]}));
  assertSafe(composer({placeholder: TAG, value: TAG}));
  assertSafe(chart({
    type: 'area', label: TAG, height: 200,
    data: [{label: TAG, a: 5, b: 3}],
    series: [{key: 'a', label: TAG, color: BREAKOUT}, {key: 'b', label: TAG, color: TAG}]
  }));
  assertSafe(wire({color: BREAKOUT, strokeWidth: BREAKOUT}));
});

test('overlay builders escape text options', () => {
  assertSafe(menu({id: BREAKOUT, ariaLabel: TAG, items: [{label: TAG, shortcut: TAG}]}));
  assertSafe(menuItem({id: BREAKOUT, label: TAG, shortcut: TAG, href: BREAKOUT}));
  assertSafe(dropdownMenu({id: BREAKOUT, trigger: {label: TAG}, items: [{label: TAG}], ariaLabel: TAG}));
  assertSafe(commandPalette({
    id: BREAKOUT, title: TAG, placeholder: TAG, value: TAG, emptyText: TAG,
    commands: [{id: BREAKOUT, label: TAG, shortcut: TAG, group: TAG, action: TAG}]
  }));
  assertSafe(tooltip({id: BREAKOUT, placement: 'top', content: 'static text'}));
});

test('block builders escape text', () => {
  assertSafe(appShell({
    sidebar: workspaceSidebar({
      workspace: TAG, profileName: TAG, initials: TAG,
      navigation: [{label: TAG, icon: 'home', key: BREAKOUT}],
      groups: [{title: TAG, items: [{label: TAG, key: BREAKOUT, icon: 'users'}]}],
      projects: [{label: TAG, icon: 'folder', key: BREAKOUT, children: [{label: TAG, key: BREAKOUT, icon: false}]}]
    }),
    header: pageHeader({title: TAG, icon: 'grid-3x3', description: TAG}),
    content: pageLayout(pageGrid([{html: metricCard({label: TAG, value: TAG, change: TAG, description: TAG}), span: 12}]), {variant: 'data'})
  }));
  assertSafe(contentSection({title: TAG, description: TAG}));
  assertSafe(dataSection({title: TAG, description: TAG}));
  assertSafe(chartSection({title: TAG, description: TAG, summary: TAG, chart: chart({type: 'line', label: TAG, data: [{label: TAG, a: 1}], series: [{key: 'a', label: TAG}]})}));
  assertSafe(peopleList({people: [{name: TAG, role: TAG, email: TAG, status: TAG, metadata: TAG}]}));
  assertSafe(activityFeed({items: [{title: TAG, time: TAG, description: TAG, icon: 'check'}]}));
});

// Trusted HTML slots render application markup verbatim, by contract.
test('trusted HTML slots pass application markup through unescaped', () => {
  const markup = '<button type="button" data-test-slot>Slot control</button>';
  assert.ok(modal({title: 'T', content: markup}).includes(markup));
  assert.ok(modal({title: 'T', actions: markup}).includes(markup));
  assert.ok(card({title: 'T', content: markup}).includes(markup));
  assert.ok(card({title: 'T', actions: markup}).includes(markup));
  assert.ok(banner({title: 'T', actions: markup}).includes(markup));
  assert.ok(emptyState({title: 'T', actions: markup}).includes(markup));
  assert.ok(message({role: 'user', content: markup}).includes(markup));
  assert.ok(message({role: 'user', actions: markup}).includes(markup));
  assert.ok(tabs({tabs: [{id: 'a', label: 'A', content: markup}]}).includes(markup));
  assert.ok(collapsible({trigger: 'T', content: markup}).includes(markup));
  assert.ok(scrollArea({content: markup}).includes(markup));
  assert.ok(canvas({content: markup}).includes(markup));
  assert.ok(popover({content: markup}).includes(markup));
  assert.ok(tooltip({content: markup}).includes(markup));
  assert.ok(toolbar({items: [markup]}).includes(markup));
  assert.ok(tree([{label: 'A', key: 'a', actions: markup}]).includes(markup));
  assert.ok(table({
    columns: [{key: 'a', header: 'A', render: () => markup}],
    rows: [{a: 1}]
  }).includes(markup));
  assert.ok(fileCard({name: 'f.txt', preview: markup}).includes(markup));
  assert.ok(composer({attachments: [{name: 'f.txt', preview: markup}]}).includes(markup));
  assert.ok(contentSection({title: 'T', content: markup}).includes(markup));
  assert.ok(dataSection({title: 'T', data: markup}).includes(markup));
});
