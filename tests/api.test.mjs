import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
  button,
  iconButton,
  linkButton,
  socialButton,
  input,
  inputField,
  select,
  modal,
  badge,
  statusDot,
  avatar,
  initAvatar,
  label,
  divider,
  card,
  banner,
  initBanner,
  emptyState,
  loader,
  skeleton,
  scrollArea,
  initScrollArea,
  checkbox,
  initCheckbox,
  radio,
  initRadio,
  switchControl,
  initSwitch,
  textarea,
  initTextarea,
  chip,
  initChip,
  menuItem,
  menu,
  initMenu,
  popover,
  initPopover,
  dropdownMenu,
  initDropdownMenu,
  tooltip,
  initTooltip,
  showToast,
  initToastRegion,
  buttonGroup,
  initButtonGroup,
  commandPalette,
  initCommandPalette,
  combobox,
  initCombobox,
  datePicker,
  initDatePicker,
  tagInput,
  initTagInput,
  tabs,
  initTabs,
  breadcrumbs,
  treeItem,
  tree,
  treeSection,
  initTree,
  listRow,
  toolbar,
  collapsible,
  initCollapsible,
  table,
  initTable,
  pagination,
  initPagination,
  chart,
  initChart,
  wire,
  canvas,
  initCanvas,
  fileCard,
  fileAttachment,
  initFileCard,
  message,
  initMessage,
  toolCall,
  initToolCall,
  agentRun,
  initAgentRun,
  composer,
  initComposer,
  appShell,
  initAppShell,
  workspaceSidebar,
  sidebar,
  initWorkspaceSidebar,
  pageHeader,
  pageLayout,
  pageGrid,
  contentSection,
  dataSection,
  peopleList,
  activityFeed,
  metricCard,
  metricSummary,
  chartSection,
  requirementGroupRecipe,
  resourceListRecipe,
  agentCardRecipe,
  createSkillDialogRecipe,
  deleteResourceRecipe,
  dashboardOverviewRecipe,
  revenueChartRecipe,
  dataWorkspaceRecipe,
  controllerRegistry,
  registerController,
} from '../src/index.mjs';

test('module import and builders work without browser globals', () => {
  assert.equal(typeof globalThis.document, 'undefined');
  assert.match(button({label: 'Save'}), /data-sui-button/);
  assert.match(iconButton('plus', {label: 'Add'}), /data-sui-icon-button/);
  assert.match(linkButton('Docs', {href: '/docs'}), /data-sui-link-button/);
  assert.match(socialButton('google'), /data-sui-social-button/);
  assert.match(badge({label: 'Active'}), /data-sui-badge/);
  assert.match(statusDot({tone: 'success'}), /data-sui-status-dot/);
  assert.match(avatar({name: 'A'}), /data-sui-avatar/);
  assert.match(label({text: 'System'}), /data-sui-label/);
  assert.match(divider(), /data-sui-divider/);
  assert.match(card({title: 'Card'}), /data-sui-card/);
  assert.match(banner({description: 'Alert'}), /data-sui-banner/);
  assert.match(emptyState({title: 'Empty'}), /data-sui-empty-state/);
  assert.match(loader(), /data-sui-loader/);
  assert.match(skeleton(), /data-sui-skeleton/);
  assert.match(scrollArea(), /data-sui-scroll-area/);
  assert.match(checkbox({label: 'Check'}), /data-sui-checkbox/);
  assert.match(radio({label: 'Radio'}), /data-sui-radio/);
  assert.match(switchControl({label: 'Switch'}), /data-sui-switch/);
  assert.match(textarea({label: 'Text'}), /data-sui-textarea/);
  assert.match(chip({label: 'Chip'}), /data-sui-chip/);
  assert.match(menuItem({label: 'Item'}), /data-sui-menu-item/);
  assert.match(menu({items: ['Item']}), /data-sui-menu/);
  assert.match(popover({trigger: 'Open', content: 'Body'}), /data-sui-popover/);
  assert.match(dropdownMenu({trigger: 'Actions', items: ['A']}), /data-sui-dropdown/);
  assert.match(tooltip({content: 'Tip', trigger: '<button>X</button>'}), /data-sui-tooltip/);
  assert.match(buttonGroup({buttons: ['A', 'B']}), /data-sui-button-group/);
  assert.match(commandPalette({commands: [{id: '1', label: 'Cmd'}]}), /data-sui-command-palette/);
  assert.match(combobox({label: 'Project'}), /data-sui-combobox/);
  assert.match(datePicker({label: 'Date'}), /data-sui-date-picker/);
  assert.match(tagInput({label: 'Tags'}), /data-sui-tag-input/);
  assert.match(tabs({tabs: [{id: 't1', label: 'T1', panel: 'P1'}]}), /data-sui-tabs/);
  assert.match(breadcrumbs({items: [{label: 'Home'}]}), /sx-breadcrumbs/);
  assert.match(tree({items: [{id: 'f1', label: 'Folder'}]}), /sx-tree/);
  assert.match(listRow({title: 'Item'}), /sx-list-row/);
  assert.match(toolbar({items: [{type: 'button', icon: 'plus'}]}), /data-sui-toolbar/);
  assert.match(collapsible({title: 'Details', content: 'Info'}), /data-sui-collapsible/);
  assert.match(table({columns: [{key: 'a', header: 'A'}], rows: [{id: '1', a: 'Val'}]}), /data-sui-table/);
  assert.match(pagination({page: 1, total: 50, pageSize: 10}), /data-sui-pagination/);
  assert.match(chart({type: 'bar', data: [{label: 'A', value: 10}]}), /data-sui-chart/);
  assert.match(wire({from: {x: 0, y: 0}, to: {x: 100, y: 100}}), /data-sui-wire/);
  assert.match(canvas({content: '<div></div>'}), /data-sui-canvas/);
  assert.match(fileCard({name: 'report.pdf'}), /data-sui-file-card/);
  assert.match(fileAttachment({name: 'brief.docx'}), /data-sui-file-card/);
  assert.match(message({content: 'Hello'}), /data-sui-message/);
  assert.match(toolCall({name: 'Search documents'}), /data-sui-tool-call/);
  assert.match(agentRun({title: 'Agent run'}), /data-sui-agent-run/);
  assert.match(composer({placeholder: 'Type message...'}), /data-sui-composer/);
  assert.match(appShell({content: 'Main'}), /data-sui-app-shell/);
  assert.match(workspaceSidebar(), /data-sui-workspace-sidebar/);
  assert.match(sidebar(), /data-sui-workspace-sidebar/);
  assert.match(pageHeader({title: 'Overview'}), /data-sui-page-header/);
  assert.match(pageLayout({content: 'Page'}), /data-sui-page-layout/);
  assert.match(pageGrid({content: '<div>Item</div>'}), /data-sui-page-grid/);
  assert.match(contentSection({title: 'Sec'}), /data-sui-content-section/);
  assert.match(dataSection({title: 'Data'}), /data-sui-data-section/);
  assert.match(peopleList({people: [{name: 'Alice'}]}), /data-sui-people-list/);
  assert.match(activityFeed({activities: [{title: 'Done'}]}), /data-sui-activity-feed/);
  assert.match(metricCard({label: 'Rev', value: '$100'}), /data-sui-metric-card/);
  assert.match(metricSummary({metrics: [{label: 'A', value: '1'}]}), /data-sui-metric-summary/);
  assert.match(chartSection({title: 'Analytics'}), /sb-chart-section/);
  assert.match(requirementGroupRecipe({title: 'Reqs'}), /data-sui-requirement-group/);
  assert.match(resourceListRecipe({title: 'Resources'}), /data-sui-data-section/);
  assert.match(agentCardRecipe({name: 'Copilot'}), /data-sui-agent-card/);
  assert.match(createSkillDialogRecipe(), /data-sui-modal/);
  assert.match(deleteResourceRecipe({resourceName: 'cluster-1'}), /data-sui-modal/);
  assert.match(dashboardOverviewRecipe(), /sb-dashboard-overview/);
  assert.match(revenueChartRecipe(), /sb-revenue-chart/);
  assert.match(dataWorkspaceRecipe(), /data-sui-app-shell/);
});

test('text options are escaped and button rejects injected enum values', () => {
  assert.match(button({label: '<script>"'}), /&lt;script&gt;&quot;/);
  assert.throws(() => button({variant: '" onclick="alert(1)'}), TypeError);
  assert.throws(() => button({type: 'invalid'}), TypeError);
  assert.throws(() => button({size: 'xl'}), TypeError);
  assert.throws(() => button({iconPosition: 'top'}), TypeError);
  assert.match(inputField({label: '<label>', value: '" onfocus="x'}), /&lt;label&gt;/);
  assert.doesNotMatch(inputField({value: '" onfocus="x'}), /value="" onfocus=/);
  assert.match(modal({title: '<title>'}), /&lt;title&gt;/);
});

test('button supports all variants, sizes, loading state and icon positions', () => {
  const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'dashed', 'destructive'];
  for (const variant of variants) {
    const html = button({label: variant, variant});
    assert.match(html, new RegExp(`class="btn ${variant} sm"`));
  }

  const sizes = ['xs', 'sm', 'base', 'lg'];
  for (const size of sizes) {
    const html = button({label: size, size});
    assert.match(html, new RegExp(`class="btn secondary ${size}"`));
  }

  // Loading state
  const loadingBtn = button({label: 'Saving', loading: true});
  assert.match(loadingBtn, /aria-busy="true"/);
  assert.match(loadingBtn, /\bdisabled\b/);
  assert.match(loadingBtn, /<span class="spinner" aria-hidden="true"><\/span>Saving/);

  // Icon positions
  const startIcon = button({label: 'Add', icon: 'plus', iconPosition: 'start'});
  assert.match(startIcon, /<svg aria-hidden="true"[\s\S]*<\/svg>\n?Add/);

  const endIcon = button({label: 'Next', icon: 'chevron-down', iconPosition: 'end'});
  assert.match(endIcon, /Next<svg aria-hidden="true"/);

  // Id escaping
  assert.match(button({label: 'Go', id: 'btn<1>'}), /id="btn&lt;1&gt;"/);
});

test('iconButton supports options, accessibility, and legacy positional calls', () => {
  const btn1 = iconButton('plus', {label: 'Add item', variant: 'raised', size: 'base'});
  assert.match(btn1, /data-sui-icon-button/);
  assert.match(btn1, /class="ibtn raised size-base"/);
  assert.match(btn1, /aria-label="Add item"/);

  // aria-pressed toggle
  const pressedBtn = iconButton('sun', {label: 'Theme', pressed: true});
  assert.match(pressedBtn, /aria-pressed="true"/);

  const unpressedBtn = iconButton('sun', {label: 'Theme', ariaPressed: false});
  assert.match(unpressedBtn, /aria-pressed="false"/);

  // Disabled
  const disabledBtn = iconButton('x', {label: 'Close', disabled: true});
  assert.match(disabledBtn, /\bdisabled\b/);

  // Legacy positional call: iconButton(name, variant, attributes, label)
  const legacy = iconButton('kebab', 'outline', 'data-menu="actions"', 'Row actions');
  assert.match(legacy, /class="ibtn outline"/);
  assert.match(legacy, /aria-label="Row actions"/);
  assert.match(legacy, /data-menu="actions"/);

  // Escaping
  assert.match(iconButton('search', {label: '<script>'}), /aria-label="&lt;script&gt;"/);
  assert.throws(() => iconButton('search', {size: 'huge'}), TypeError);
});

test('linkButton supports navigation links and action buttons', () => {
  // Navigation <a>
  const nav = linkButton('Overview', {href: '/overview', tone: 'brand'});
  assert.match(nav, /^<a data-sui-link-button class="btn link link-brand" href="\/overview"><span>Overview<\/span><\/a>$/);

  // Action <button> when href is omitted
  const action = linkButton('Open dialog', {tone: 'default'});
  assert.match(action, /^<button type="button" data-sui-link-button class="btn link"><span>Open dialog<\/span><\/button>$/);

  // Disabled link
  const disabledNav = linkButton('Locked', {href: '/locked', disabled: true});
  assert.match(disabledNav, /aria-disabled="true"/);
  assert.match(disabledNav, /tabindex="-1"/);
  assert.doesNotMatch(disabledNav, /\bhref=/);

  // Disabled button
  const disabledAction = linkButton('Unavailable', {disabled: true});
  assert.match(disabledAction, /\bdisabled\b/);

  // Icon
  const external = linkButton('Learn more', {href: 'https://example.com', iconName: 'arrow-up-right', iconPosition: 'end'});
  assert.match(external, /<span>Learn more<\/span><svg aria-hidden="true"/);

  const back = linkButton('Back', {icon: 'chevron-down', iconPosition: 'start'});
  assert.match(back, /<svg aria-hidden="true"[\s\S]*<span>Back<\/span>/);

  assert.throws(() => linkButton('Invalid', {tone: 'unknown'}), TypeError);
  assert.throws(() => linkButton('Invalid', {iconPosition: 'middle'}), TypeError);
});

test('socialButton supports Google and GitHub providers with branding', () => {
  const google = socialButton('google');
  assert.match(google, /data-sui-social-button/);
  assert.match(google, /class="btn social base"/);
  assert.match(google, /<span>Continue with Google<\/span>/);
  assert.match(google, /class="sx-social-logo"/);

  const github = socialButton('github', {label: 'Sign in with GitHub', size: 'lg', disabled: true});
  assert.match(github, /class="btn social lg"/);
  assert.match(github, /\bdisabled\b/);
  assert.match(github, /<span>Sign in with GitHub<\/span>/);
  assert.match(github, /is-monochrome/);

  assert.throws(() => socialButton('twitter'), TypeError);
  assert.throws(() => socialButton('github', {size: 'xl'}), TypeError);
});

test('builders create distinct IDs and only opt-in behavior attributes', () => {
  const a = inputField({type: 'password'}), b = inputField({type: 'password'});
  assert.notEqual(a.match(/<input[^>]*\bid="([^"]+)"/)[1], b.match(/<input[^>]*\bid="([^"]+)"/)[1]);
  assert.match(a, /data-sui-password-toggle/);
  assert.doesNotMatch(a, /data-password-toggle/);
});

test('inputField supports affixes and bare input works', () => {
  const withSuffix = inputField({label: 'Domain', suffix: '.com', prefix: 'https://'});
  assert.match(withSuffix, /<span class="phone-prefix sx-affix">https:\/\/<\/span>/);
  assert.match(withSuffix, /<span class="sx-affix sx-suffix">\.com<\/span>/);

  const bare = input({label: 'Search', name: 'q'});
  assert.match(bare, /<input data-sui-input /);
  assert.doesNotMatch(bare, /<label/);
});

test('select preserves distinct form values, disabled options and grouping', () => {
  const html = select({
    name: 'team',
    value: 'eng',
    groups: [
      {label: 'Teams', options: [{label: 'Engineering', value: 'eng'}, {label: 'Archived', value: 'old', disabled: true}]}
    ]
  });
  assert.match(html, /<select[^>]*name="team"/);
  assert.match(html, /<option value="eng"[^>]*selected/);
  assert.match(html, /data-sui-option="eng"/);
  assert.match(html, /role="group"/);
  assert.match(html, /data-sui-option="old"[^>]*disabled/);
  assert.doesNotMatch(html, /data-select-demo|data-sx-popup|popovertarget=/);
  assert.throws(() => select({value: 'missing', options: ['One']}), TypeError);
  assert.throws(() => select({options: [{label: 'One', value: 'x'}, {label: 'Two', value: 'x'}]}), TypeError);
});

test('Select maps values independently from labels, including duplicate labels', () => {
  const html = select({value: 'D', options: [{label: 'A', value: 'B'}, {label: 'B', value: 'C'}, {label: 'A', value: 'D'}]});
  assert.match(html, /aria-selected="false" data-sui-option="B" data-sui-option-label="A"/);
  assert.match(html, /aria-selected="false" data-sui-option="C" data-sui-option-label="B"/);
  assert.match(html, /aria-selected="true" data-sui-option="D" data-sui-option-label="A"/);
  assert.match(html, /<option value="D"[^>]*selected>A<\/option>/);
  assert.throws(() => inputField({size: 'xs'}), TypeError);
  assert.throws(() => inputField({type: 'email', passwordToggle: true}), TypeError);
});

test('accessible names, errors and listbox groups are present before mounting', () => {
  const html = select({
    name: 'team',
    label: 'Team',
    required: true,
    helper: 'Choose your team.',
    error: 'A team is required.',
    groups: [{label: 'A', options: ['Design']}, {label: 'B', options: ['Engineering']}]
  });
  assert.match(html, /aria-controls=/);
  assert.match(html, /aria-labelledby="[^\"]+-label [^\"]+-value"/);
  assert.match(html, /aria-errormessage=/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /aria-live="polite"/);
  assert.doesNotMatch(html, /role="separator"/);
  assert.match(html, /role="presentation" aria-hidden="true"/);
  assert.match(inputField({ariaLabel: 'Search files', error: 'Try again.'}), /aria-label="Search files"/);
  assert.match(inputField({label: 'Name', error: 'Try again.'}), /aria-invalid="true"/);
  assert.match(select({name: 'team', ariaLabel: 'Choose a team', disabled: true, options: ['Design']}), /Choose a team<\/span>/);
  assert.match(inputField({label: 'Name'}), /name=""/);
  assert.match(select({label: 'Team', options: ['Design']}), /name=""/);
});

test('runtime exports explicit controller registry and allows registration', () => {
  assert.ok(controllerRegistry instanceof Map);
  assert.ok(controllerRegistry.has('[data-sui-input-field]'));
  assert.ok(controllerRegistry.has('[data-sui-select]'));
  assert.ok(controllerRegistry.has('dialog[data-sui-modal]'));
  assert.ok(controllerRegistry.has('[data-sui-banner]'));
  assert.ok(controllerRegistry.has('[data-sui-avatar]'));
  assert.ok(controllerRegistry.has('[data-sui-scroll-area]'));
  assert.ok(controllerRegistry.has('[data-sui-checkbox]'));
  assert.ok(controllerRegistry.has('[data-sui-radio]'));
  assert.ok(controllerRegistry.has('[data-sui-switch]'));
  assert.ok(controllerRegistry.has('[data-sui-textarea-field]'));
  assert.ok(controllerRegistry.has('[data-sui-chip]'));
  assert.ok(controllerRegistry.has('[data-sui-menu]'));
  assert.ok(controllerRegistry.has('[data-sui-popover]'));
  assert.ok(controllerRegistry.has('[data-sui-dropdown-menu]'));
  assert.ok(controllerRegistry.has('[data-sui-tooltip]'));
  assert.ok(controllerRegistry.has('[data-sui-toast-region]'));
  assert.ok(controllerRegistry.has('[data-sui-button-group-wrapper]'));
  assert.ok(controllerRegistry.has('dialog[data-sui-command-palette]'));
  assert.ok(controllerRegistry.has('[data-sui-combobox]'));
  assert.ok(controllerRegistry.has('[data-sui-date-picker]'));
  assert.ok(controllerRegistry.has('[data-sui-tag-input]'));
  assert.ok(controllerRegistry.has('[data-sui-tabs]'));
  assert.ok(controllerRegistry.has('[data-sui-tree]'));
  assert.ok(controllerRegistry.has('[data-sui-collapsible]'));
  assert.ok(controllerRegistry.has('[data-sui-table]'));
  assert.ok(controllerRegistry.has('[data-sui-pagination]'));
  assert.ok(controllerRegistry.has('[data-sui-chart]'));
  assert.ok(controllerRegistry.has('[data-sui-canvas]'));
  assert.ok(controllerRegistry.has('[data-sui-file-card]'));
  assert.ok(controllerRegistry.has('[data-sui-message]'));
  assert.ok(controllerRegistry.has('[data-sui-tool-call]'));
  assert.ok(controllerRegistry.has('[data-sui-agent-run]'));
  assert.ok(controllerRegistry.has('[data-sui-composer]'));
  assert.ok(controllerRegistry.has('[data-sui-app-shell]'));
  assert.ok(controllerRegistry.has('[data-sui-workspace-sidebar]'));

  const dummyInit = () => ({destroy: () => {}});
  registerController('[data-sui-custom]', dummyInit);
  assert.equal(controllerRegistry.get('[data-sui-custom]'), dummyInit);
  controllerRegistry.delete('[data-sui-custom]');
});

test('individual component modules can be imported directly in isolation', async () => {
  const {button: directButton} = await import('../src/components/button.mjs');
  assert.equal(typeof directButton, 'function');
  assert.match(directButton({label: 'Standalone'}), /data-sui-button/);

  const {inputField: directInputField} = await import('../src/components/input.mjs');
  assert.equal(typeof directInputField, 'function');
  assert.match(directInputField({label: 'Email'}), /data-sui-input-field/);

  const {select: directSelect} = await import('../src/components/select.mjs');
  assert.equal(typeof directSelect, 'function');
  assert.match(directSelect({options: ['Item']}), /data-sui-select/);

  const {modal: directModal} = await import('../src/components/modal.mjs');
  assert.equal(typeof directModal, 'function');
  assert.match(directModal({title: 'Hi'}), /data-sui-modal/);

  const {badge: directBadge} = await import('../src/components/badge.mjs');
  assert.equal(typeof directBadge, 'function');
  assert.match(directBadge({label: 'Active'}), /data-sui-badge/);

  const {statusDot: directStatusDot} = await import('../src/components/status-dot.mjs');
  assert.equal(typeof directStatusDot, 'function');
  assert.match(directStatusDot({tone: 'success'}), /data-sui-status-dot/);

  const {avatar: directAvatar, initAvatar: directInitAvatar} = await import('../src/components/avatar.mjs');
  assert.equal(typeof directAvatar, 'function');
  assert.equal(typeof directInitAvatar, 'function');
  assert.match(directAvatar({name: 'User'}), /data-sui-avatar/);

  const {label: directLabel} = await import('../src/components/label.mjs');
  assert.equal(typeof directLabel, 'function');
  assert.match(directLabel({text: 'Category'}), /data-sui-label/);

  const {divider: directDivider} = await import('../src/components/divider.mjs');
  assert.equal(typeof directDivider, 'function');
  assert.match(directDivider(), /data-sui-divider/);

  const {card: directCard} = await import('../src/components/card.mjs');
  assert.equal(typeof directCard, 'function');
  assert.match(directCard({title: 'Card'}), /data-sui-card/);

  const {banner: directBanner, initBanner: directInitBanner} = await import('../src/components/banner.mjs');
  assert.equal(typeof directBanner, 'function');
  assert.equal(typeof directInitBanner, 'function');
  assert.match(directBanner({description: 'Banner'}), /data-sui-banner/);

  const {emptyState: directEmptyState} = await import('../src/components/empty-state.mjs');
  assert.equal(typeof directEmptyState, 'function');
  assert.match(directEmptyState({title: 'No Data'}), /data-sui-empty-state/);

  const {loader: directLoader} = await import('../src/components/loader.mjs');
  assert.equal(typeof directLoader, 'function');
  assert.match(directLoader(), /data-sui-loader/);

  const {skeleton: directSkeleton} = await import('../src/components/skeleton.mjs');
  assert.equal(typeof directSkeleton, 'function');
  assert.match(directSkeleton(), /data-sui-skeleton/);

  const {scrollArea: directScrollArea, initScrollArea: directInitScrollArea} = await import('../src/components/scroll-area.mjs');
  assert.equal(typeof directScrollArea, 'function');
  assert.equal(typeof directInitScrollArea, 'function');
  assert.match(directScrollArea(), /data-sui-scroll-area/);

  const {checkbox: directCheckbox, initCheckbox: directInitCheckbox} = await import('../src/components/checkbox.mjs');
  assert.equal(typeof directCheckbox, 'function');
  assert.equal(typeof directInitCheckbox, 'function');
  assert.match(directCheckbox({label: 'Check'}), /data-sui-checkbox/);

  const {radio: directRadio, initRadio: directInitRadio} = await import('../src/components/radio.mjs');
  assert.equal(typeof directRadio, 'function');
  assert.equal(typeof directInitRadio, 'function');
  assert.match(directRadio({label: 'Radio'}), /data-sui-radio/);

  const {switchControl: directSwitch, initSwitch: directInitSwitch} = await import('../src/components/switch.mjs');
  assert.equal(typeof directSwitch, 'function');
  assert.equal(typeof directInitSwitch, 'function');
  assert.match(directSwitch({label: 'Switch'}), /data-sui-switch/);

  const {textarea: directTextarea, initTextarea: directInitTextarea} = await import('../src/components/textarea.mjs');
  assert.equal(typeof directTextarea, 'function');
  assert.equal(typeof directInitTextarea, 'function');
  assert.match(directTextarea({label: 'Text'}), /data-sui-textarea/);

  const {chip: directChip, initChip: directInitChip} = await import('../src/components/chip.mjs');
  assert.equal(typeof directChip, 'function');
  assert.equal(typeof directInitChip, 'function');
  assert.match(directChip({label: 'Chip'}), /data-sui-chip/);

  const {menuItem: directMenuItem} = await import('../src/components/menu-item.mjs');
  assert.equal(typeof directMenuItem, 'function');
  assert.match(directMenuItem({label: 'Item'}), /data-sui-menu-item/);

  const {menu: directMenu, initMenu: directInitMenu} = await import('../src/components/menu.mjs');
  assert.equal(typeof directMenu, 'function');
  assert.equal(typeof directInitMenu, 'function');
  assert.match(directMenu({items: ['Item']}), /data-sui-menu/);

  const {popover: directPopover, initPopover: directInitPopover} = await import('../src/components/popover.mjs');
  assert.equal(typeof directPopover, 'function');
  assert.equal(typeof directInitPopover, 'function');
  assert.match(directPopover({content: 'Body'}), /data-sui-popover/);

  const {dropdownMenu: directDropdown, initDropdownMenu: directInitDropdown} = await import('../src/components/dropdown-menu.mjs');
  assert.equal(typeof directDropdown, 'function');
  assert.equal(typeof directInitDropdown, 'function');
  assert.match(directDropdown({items: ['Item']}), /data-sui-dropdown/);

  const {tooltip: directTooltip, initTooltip: directInitTooltip} = await import('../src/components/tooltip.mjs');
  assert.equal(typeof directTooltip, 'function');
  assert.equal(typeof directInitTooltip, 'function');
  assert.match(directTooltip({content: 'Tip'}), /data-sui-tooltip/);

  const {showToast: directShowToast, initToastRegion: directInitToastRegion} = await import('../src/components/toast.mjs');
  assert.equal(typeof directShowToast, 'function');
  assert.equal(typeof directInitToastRegion, 'function');

  const {buttonGroup: directButtonGroup, initButtonGroup: directInitButtonGroup} = await import('../src/components/button-group.mjs');
  assert.equal(typeof directButtonGroup, 'function');
  assert.equal(typeof directInitButtonGroup, 'function');
  assert.match(directButtonGroup({buttons: ['A']}), /data-sui-button-group/);

  const {commandPalette: directCommandPalette, initCommandPalette: directInitCommandPalette} = await import('../src/components/command-palette.mjs');
  assert.equal(typeof directCommandPalette, 'function');
  assert.equal(typeof directInitCommandPalette, 'function');
  assert.match(directCommandPalette({commands: [{id: '1', label: 'Cmd'}]}), /data-sui-command-palette/);

  const {combobox: directCombobox, initCombobox: directInitCombobox} = await import('../src/components/combobox.mjs');
  assert.equal(typeof directCombobox, 'function');
  assert.equal(typeof directInitCombobox, 'function');
  assert.match(directCombobox({label: 'Project'}), /data-sui-combobox/);

  const {datePicker: directDatePicker, initDatePicker: directInitDatePicker} = await import('../src/components/date-picker.mjs');
  assert.equal(typeof directDatePicker, 'function');
  assert.equal(typeof directInitDatePicker, 'function');
  assert.match(directDatePicker({label: 'Date'}), /data-sui-date-picker/);

  const {tagInput: directTagInput, initTagInput: directInitTagInput} = await import('../src/components/tag-input.mjs');
  assert.equal(typeof directTagInput, 'function');
  assert.equal(typeof directInitTagInput, 'function');
  assert.match(directTagInput({label: 'Tags'}), /data-sui-tag-input/);

  const {tabs: directTabs, initTabs: directInitTabs} = await import('../src/components/tabs.mjs');
  assert.equal(typeof directTabs, 'function');
  assert.equal(typeof directInitTabs, 'function');
  assert.match(directTabs({tabs: ['One']}), /data-sui-tabs/);

  const {breadcrumbs: directBreadcrumbs} = await import('../src/components/breadcrumbs.mjs');
  assert.equal(typeof directBreadcrumbs, 'function');
  assert.match(directBreadcrumbs({items: [{label: 'Home'}]}), /data-sui-breadcrumbs/);

  const {treeItem: directTreeItem, tree: directTree, treeSection: directTreeSection, initTree: directInitTree} = await import('../src/components/tree.mjs');
  assert.equal(typeof directTreeItem, 'function');
  assert.equal(typeof directTree, 'function');
  assert.equal(typeof directTreeSection, 'function');
  assert.equal(typeof directInitTree, 'function');
  assert.match(directTree([{label: 'Item'}]), /data-sui-tree/);

  const {listRow: directListRow} = await import('../src/components/list-row.mjs');
  assert.equal(typeof directListRow, 'function');
  assert.match(directListRow({title: 'Row'}), /sx-list-row/);

  const {toolbar: directToolbar} = await import('../src/components/toolbar.mjs');
  assert.equal(typeof directToolbar, 'function');
  assert.match(directToolbar(), /data-sui-toolbar/);

  const {collapsible: directCollapsible, initCollapsible: directInitCollapsible} = await import('../src/components/collapsible.mjs');
  assert.equal(typeof directCollapsible, 'function');
  assert.equal(typeof directInitCollapsible, 'function');
  assert.match(directCollapsible({trigger: 'Open'}), /data-sui-collapsible/);

  const {table: directTable, initTable: directInitTable} = await import('../src/components/table.mjs');
  assert.equal(typeof directTable, 'function');
  assert.equal(typeof directInitTable, 'function');
  assert.match(directTable({columns: [{key: 'id'}]}), /data-sui-table/);

  const {pagination: directPagination, initPagination: directInitPagination} = await import('../src/components/pagination.mjs');
  assert.equal(typeof directPagination, 'function');
  assert.equal(typeof directInitPagination, 'function');
  assert.match(directPagination({page: 1, totalItems: 10}), /data-sui-pagination/);

  const {chart: directChart, initChart: directInitChart} = await import('../src/components/chart.mjs');
  assert.equal(typeof directChart, 'function');
  assert.equal(typeof directInitChart, 'function');
  assert.match(directChart({data: [{label: 'A', v: 1}], series: [{key: 'v'}]}), /data-sui-chart/);

  const {wire: directWire} = await import('../src/components/wire.mjs');
  assert.equal(typeof directWire, 'function');
  assert.match(directWire(), /data-sui-wire/);

  const {canvas: directCanvas, initCanvas: directInitCanvas} = await import('../src/components/canvas.mjs');
  assert.equal(typeof directCanvas, 'function');
  assert.equal(typeof directInitCanvas, 'function');
  assert.match(directCanvas({content: '<span>Node</span>'}), /data-sui-canvas/);

  const {appShell: directAppShell, initAppShell: directInitAppShell} = await import('../src/blocks/app-shell.mjs');
  assert.equal(typeof directAppShell, 'function');
  assert.equal(typeof directInitAppShell, 'function');
  assert.match(directAppShell({content: 'Body'}), /data-sui-app-shell/);

  const {workspaceSidebar: directWorkspaceSidebar, sidebar: directSidebar, initWorkspaceSidebar: directInitWorkspaceSidebar} = await import('../src/blocks/workspace-sidebar.mjs');
  assert.equal(typeof directWorkspaceSidebar, 'function');
  assert.equal(typeof directSidebar, 'function');
  assert.equal(typeof directInitWorkspaceSidebar, 'function');
  assert.match(directWorkspaceSidebar(), /data-sui-workspace-sidebar/);
  assert.match(directSidebar(), /data-sui-workspace-sidebar/);

  const {pageHeader: directPageHeader} = await import('../src/blocks/page-header.mjs');
  assert.equal(typeof directPageHeader, 'function');
  assert.match(directPageHeader({title: 'Page'}), /data-sui-page-header/);

  const {pageLayout: directPageLayout} = await import('../src/blocks/page-layout.mjs');
  assert.equal(typeof directPageLayout, 'function');
  assert.match(directPageLayout({content: 'Content'}), /data-sui-page-layout/);

  const {pageGrid: directPageGrid} = await import('../src/blocks/page-grid.mjs');
  assert.equal(typeof directPageGrid, 'function');
  assert.match(directPageGrid({content: 'Items'}), /data-sui-page-grid/);

  const {contentSection: directContentSection} = await import('../src/blocks/content-section.mjs');
  assert.equal(typeof directContentSection, 'function');
  assert.match(directContentSection({title: 'Section'}), /data-sui-content-section/);

  const {dataSection: directDataSection} = await import('../src/blocks/data-section.mjs');
  assert.equal(typeof directDataSection, 'function');
  assert.match(directDataSection({title: 'Data'}), /data-sui-data-section/);

  const {peopleList: directPeopleList} = await import('../src/blocks/people-list.mjs');
  assert.equal(typeof directPeopleList, 'function');
  assert.match(directPeopleList({people: [{name: 'Bob'}]}), /data-sui-people-list/);

  const {activityFeed: directActivityFeed} = await import('../src/blocks/activity-feed.mjs');
  assert.equal(typeof directActivityFeed, 'function');
  assert.match(directActivityFeed({activities: [{title: 'Login'}]}), /data-sui-activity-feed/);

  const {metricCard: directMetricCard, metricSummary: directMetricSummary} = await import('../src/blocks/metric-card.mjs');
  assert.equal(typeof directMetricCard, 'function');
  assert.equal(typeof directMetricSummary, 'function');
  assert.match(directMetricCard({label: 'Users', value: '1,200'}), /data-sui-metric-card/);
  assert.match(directMetricSummary({metrics: [{label: 'A', value: '1'}]}), /data-sui-metric-summary/);

  const {chartSection: directChartSection} = await import('../src/blocks/chart-section.mjs');
  assert.equal(typeof directChartSection, 'function');
  assert.match(directChartSection({title: 'Sales'}), /sb-chart-section/);

  const {
    requirementGroupRecipe: directReqRecipe,
    resourceListRecipe: directResRecipe,
    agentCardRecipe: directAgentRecipe,
    createSkillDialogRecipe: directSkillRecipe,
    deleteResourceRecipe: directDeleteRecipe,
    dashboardOverviewRecipe: directDashRecipe,
    revenueChartRecipe: directRevRecipe,
    dataWorkspaceRecipe: directWsRecipe
  } = await import('../src/blocks/recipes.mjs');
  assert.equal(typeof directReqRecipe, 'function');
  assert.equal(typeof directResRecipe, 'function');
  assert.equal(typeof directAgentRecipe, 'function');
  assert.equal(typeof directSkillRecipe, 'function');
  assert.equal(typeof directDeleteRecipe, 'function');
  assert.equal(typeof directDashRecipe, 'function');
  assert.equal(typeof directRevRecipe, 'function');
  assert.equal(typeof directWsRecipe, 'function');
});

test('badge renders display-only status with tones, sizes, icons, and escaping', () => {
  // String shorthand and default tone
  const b1 = badge('Draft');
  assert.match(b1, /^<span data-sui-badge class="badge tone-neutral">Draft<\/span>$/);

  // All semantic tones
  const tones = ['neutral', 'informative', 'success', 'warning', 'error', 'disabled'];
  for (const tone of tones) {
    const html = badge({label: tone, tone});
    assert.match(html, new RegExp(`class="badge tone-${tone}"`));
    assert.match(html, /data-sui-badge/);
  }

  // Size base
  const baseBadge = badge({label: 'Large', size: 'base'});
  assert.match(baseBadge, /class="badge tone-neutral size-base"/);

  // Icon
  const withIcon = badge({label: 'Checked', icon: 'check', tone: 'success'});
  assert.match(withIcon, /<svg aria-hidden="true"/);
  assert.match(withIcon, /Checked<\/span>$/);

  // Escaping
  assert.match(badge({label: '<b>alert</b>'}), /&lt;b&gt;alert&lt;\/b&gt;/);

  // Validation
  assert.throws(() => badge({tone: 'invalid'}), TypeError);
  assert.throws(() => badge({size: 'xl'}), TypeError);
});

test('statusDot renders tones, active state, sizes and accessible labels', () => {
  // Standalone dot (no label) has role="img" and aria-label
  const dot1 = statusDot('success');
  assert.match(dot1, /^<span data-sui-status-dot class="sx-status-dot" data-tone="success" style="--status-dot-size:8px" role="img" aria-label="success status"><\/span>$/);

  // Tones
  const tones = ['neutral', 'informative', 'success', 'warning', 'error', 'disabled'];
  for (const tone of tones) {
    const html = statusDot({tone});
    assert.match(html, new RegExp(`data-tone="${tone}"`));
    assert.match(html, new RegExp(`aria-label="${tone} status"`));
  }

  // Active pulsing dot
  const activeDot = statusDot({tone: 'warning', active: true});
  assert.match(activeDot, /class="sx-status-dot is-active"/);

  // Custom size
  const customSize = statusDot({tone: 'informative', size: 12});
  assert.match(customSize, /style="--status-dot-size:12px"/);

  // With label: wraps in sx-status-label with aria-hidden on dot
  const withLabel = statusDot({tone: 'success', label: 'Active service'});
  assert.match(withLabel, /^<span class="sx-status-label"><span data-sui-status-dot class="sx-status-dot" data-tone="success" style="--status-dot-size:8px" aria-hidden="true"><\/span><span>Active service<\/span><\/span>$/);

  // Escaping
  assert.match(statusDot({label: '<Live>'}), /&lt;Live&gt;/);

  // Validation
  assert.throws(() => statusDot({tone: 'wrong'}), TypeError);
  assert.throws(() => statusDot({size: 0}), TypeError);
  assert.throws(() => statusDot({size: -4}), TypeError);
});

test('avatar renders static span or interactive button with image fallback and selection', () => {
  // Static avatar (non-interactive)
  const staticAv = avatar({name: 'Alex Morgan'});
  assert.match(staticAv, /^<span data-sui-avatar role="img" class="sx-avatar"/);
  assert.match(staticAv, /aria-label="Alex Morgan"/);
  assert.match(staticAv, /<span class="sx-avatar-fallback">AM<\/span>/);

  // Auto tone hash
  const autoTone = avatar({name: 'Jordan Lee', tone: 'auto'});
  assert.match(autoTone, /background:color-mix\(in srgb,var\(--color-/);

  // Preset sizes
  const sm = avatar({size: 'sm', initials: 'S'});
  assert.match(sm, /width:16px;height:16px;font-size:8px/);

  const base = avatar({size: 'base', initials: 'B'});
  assert.match(base, /width:24px;height:24px;font-size:12px/);

  const lg = avatar({size: 'lg', initials: 'L'});
  assert.match(lg, /width:32px;height:32px;font-size:14px/);

  // Numeric size
  const numAv = avatar({size: 40, initials: 'N'});
  assert.match(numAv, /width:40px;height:40px;font-size:14px/);

  // Interactive avatar (selectable)
  const selectable = avatar({name: 'Sam', selectable: true});
  assert.match(selectable, /<button [^>]*data-sui-avatar/);
  assert.match(selectable, /type="button"/);
  assert.match(selectable, /aria-pressed="false"/);
  assert.match(selectable, /data-sui-avatar-toggle/);
  assert.match(selectable, /aria-label="Select Sam"/);

  // Selected avatar
  const selectedAv = avatar({name: 'Sam', selectable: true, selected: true});
  assert.match(selectedAv, /class="sx-avatar selected"/);
  assert.match(selectedAv, /aria-pressed="true"/);

  // Disabled avatar
  const disabledAv = avatar({name: 'Sam', disabled: true});
  assert.match(disabledAv, /<button [^>]*data-sui-avatar[^>]*\bdisabled\b/);

  // Image avatar
  const imgAv = avatar({name: 'Alex', image: 'https://example.com/avatar.jpg'});
  assert.match(imgAv, /<img src="https:\/\/example\.com\/avatar\.jpg" alt="" data-sui-avatar-image data-avatar-image>/);

  // Escaping
  assert.match(avatar({name: '<Admin>'}), /aria-label="&lt;Admin&gt;"/);

  // Validation
  assert.throws(() => avatar({size: 'huge'}), TypeError);
  assert.throws(() => avatar({size: -1}), TypeError);

  // initAvatar controller behavior with mock element
  const listeners = new Map();
  const mockImg = {
    complete: true,
    naturalWidth: 0,
    hidden: false,
    addEventListener(event, fn) { listeners.set(`img:${event}`, fn); },
    removeEventListener(event) { listeners.delete(`img:${event}`); }
  };
  const mockButton = {
    tagName: 'BUTTON',
    attributes: new Map([['aria-pressed', 'false'], ['data-sui-avatar-toggle', '']]),
    classList: {
      _classes: new Set(),
      toggle(cls, on) { on ? this._classes.add(cls) : this._classes.delete(cls); },
      contains(cls) { return this._classes.has(cls); }
    },
    hasAttribute(name) { return this.attributes.has(name); },
    getAttribute(name) { return this.attributes.get(name); },
    setAttribute(name, val) { this.attributes.set(name, String(val)); },
    matches(sel) { return sel === '[data-sui-avatar]'; },
    querySelector(sel) { return sel.includes('img') ? mockImg : null; },
    addEventListener(event, fn) { listeners.set(`btn:${event}`, fn); },
    removeEventListener(event) { listeners.delete(`btn:${event}`); },
    dispatchEvent(ev) {},
    ownerDocument: { defaultView: { CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } } } }
  };

  const ctrl = initAvatar(mockButton);
  assert.equal(mockImg.hidden, true); // Converted broken image to hidden
  assert.equal(ctrl.selected, false);
  ctrl.setSelected(true);
  assert.equal(ctrl.selected, true);
  assert.equal(mockButton.classList.contains('selected'), true);
  ctrl.destroy();
  assert.equal(ctrl.destroyed, true);
});

test('label renders semantic tones, sizes, icons and escaped text', () => {
  // String shorthand
  const l1 = label('Default label');
  assert.match(l1, /^<span data-sui-label class="sx-label tl tone-default">Default label<\/span>$/);

  // Semantic tones
  const tones = ['default', 'neutral', 'brand', 'success', 'warning', 'error', 'subtle'];
  for (const tone of tones) {
    const html = label({text: tone, tone});
    assert.match(html, new RegExp(`tone-${tone}`));
  }

  // Size base
  const baseLabel = label({text: 'Category', size: 'base'});
  assert.match(baseLabel, /size-base/);

  // Icon
  const withIcon = label({text: 'Folder', icon: 'folder'});
  assert.match(withIcon, /<svg aria-hidden="true"/);
  assert.match(withIcon, /Folder<\/span>$/);

  // Escaping
  assert.match(label({text: '<script>alert(1)</script>'}), /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);

  // Validation
  assert.throws(() => label({tone: 'unsupported'}), TypeError);
  assert.throws(() => label({size: 'lg'}), TypeError);
});

test('divider renders orientation, label, and decorative presentation/separator semantics', () => {
  // Default horizontal separator
  const d1 = divider();
  assert.match(d1, /^<div data-sui-divider class="sx-divider hr horizontal" role="separator"><\/div>$/);

  // Vertical separator
  const dVert = divider({orientation: 'vertical'});
  assert.match(dVert, /class="sx-divider hr vertical"/);
  assert.match(dVert, /role="separator"/);
  assert.match(dVert, /aria-orientation="vertical"/);

  // Decorative divider
  const dDeco = divider({decorative: true});
  assert.match(dDeco, /role="presentation"/);
  assert.match(dDeco, /aria-hidden="true"/);
  assert.doesNotMatch(dDeco, /role="separator"/);

  // Divider with label
  const dLabel = divider({label: 'OR'});
  assert.match(dLabel, /class="sx-divider hr horizontal has-label"/);
  assert.match(dLabel, /<span class="sx-divider-line" aria-hidden="true"><\/span><span class="sx-divider-label">OR<\/span><span class="sx-divider-line" aria-hidden="true"><\/span>/);

  // Escaping
  assert.match(divider({label: '<Section>'}), /&lt;Section&gt;/);

  // Validation
  assert.throws(() => divider({orientation: 'diagonal'}), TypeError);
});

test('card renders surfaces, header/body/footer slots, variants and selection', () => {
  // Default empty card
  const c1 = card();
  assert.match(c1, /^<div data-sui-card class="card sx-card variant-default bare"><\/div>$/);

  // Variants
  const variants = ['default', 'flat', 'bordered', 'recessed'];
  for (const v of variants) {
    const html = card({title: v, variant: v});
    assert.match(html, new RegExp(`variant-${v}`));
  }

  // Selected state
  const selected = card({title: 'Item', selected: true});
  assert.match(selected, /class="card sx-card variant-default on bare"/);

  // Header, title, description, content, footer, actions
  const full = card({
    header: '<span>Project</span>',
    title: 'Landing Page',
    description: 'Marketing website',
    content: '<p>Body text</p>',
    footer: '<span>Status: Live</span>',
    actions: '<button>Edit</button>',
  });
  assert.match(full, /<div class="ch sx-card-header"><span>Project<\/span><\/div>/);
  assert.match(full, /<h3 class="sx-card-title">Landing Page<\/h3>/);
  assert.match(full, /<p class="hint sx-card-description">Marketing website<\/p>/);
  assert.match(full, /<p>Body text<\/p>/);
  assert.match(full, /<div class="cf sx-card-footer"><span>Status: Live<\/span><div class="actions sx-card-actions"><button>Edit<\/button><\/div><\/div>/);
  assert.doesNotMatch(full, /\bbare\b/);

  // Escaping
  assert.match(card({title: '<Title>', description: '<Desc>'}), /&lt;Title&gt;/);
  assert.match(card({title: '<Title>', description: '<Desc>'}), /&lt;Desc&gt;/);

  // Validation
  assert.throws(() => card({variant: 'unknown'}), TypeError);
});

test('banner renders tones, alert/status roles, dismiss button and dismiss controller', () => {
  // Neutral banner (default role="status")
  const b1 = banner({description: 'System updated'});
  assert.match(b1, /^<div data-sui-banner class="sx sx-banner" data-tone="neutral" role="status">/);
  assert.match(b1, /<div class="sx-banner-content"><p>System updated<\/p><\/div><\/div>$/);

  // Error tone gets role="alert"
  const errBanner = banner({description: 'Connection failed', tone: 'error'});
  assert.match(errBanner, /data-tone="error"/);
  assert.match(errBanner, /role="alert"/);
  assert.match(errBanner, /<svg aria-hidden="true"/);

  // Success tone
  const successBanner = banner({description: 'Saved', tone: 'success'});
  assert.match(successBanner, /role="status"/);
  assert.match(successBanner, /<svg aria-hidden="true"/);

  // Warning tone
  const warnBanner = banner({description: 'Caution', tone: 'warning'});
  assert.match(warnBanner, /data-tone="warning"/);
  assert.match(warnBanner, /<svg aria-hidden="true"/);

  // Dismissible banner
  const dismissible = banner({title: 'Notice', description: 'Read this', dismissible: true});
  assert.match(dismissible, /data-sui-banner-dismiss/);
  assert.match(dismissible, /aria-label="Dismiss banner"/);

  // Actions slot
  const withActions = banner({description: 'Update available', actions: '<button>Update</button>'});
  assert.match(withActions, /<div class="sx-banner-actions"><button>Update<\/button><\/div>/);

  // Escaping
  assert.match(banner({title: '<Title>', description: '<Desc>'}), /&lt;Title&gt;/);
  assert.match(banner({title: '<Title>', description: '<Desc>'}), /&lt;Desc&gt;/);

  // Validation
  assert.throws(() => banner({tone: 'danger'}), TypeError);

  // initBanner controller with mock element
  let removed = false;
  let emittedEvent = null;
  const mockDismissBtn = { tagName: 'BUTTON' };
  const mockBannerEl = {
    matches(sel) { return sel === '[data-sui-banner]'; },
    querySelector(sel) { return sel.includes('dismiss') ? mockDismissBtn : null; },
    addEventListener(ev, fn) { this._onClick = fn; },
    removeEventListener(ev, fn) { this._onClick = null; },
    dispatchEvent(ev) { emittedEvent = ev; return !ev.defaultPrevented; },
    remove() { removed = true; },
    ownerDocument: {
      defaultView: {
        CustomEvent: class {
          constructor(name, opts) {
            this.type = name;
            this.bubbles = opts?.bubbles;
            this.cancelable = opts?.cancelable;
            this.defaultPrevented = false;
          }
          preventDefault() { this.defaultPrevented = true; }
        }
      }
    }
  };

  const bannerCtrl = initBanner(mockBannerEl);
  assert.equal(typeof bannerCtrl.dismiss, 'function');
  bannerCtrl.dismiss();
  assert.equal(removed, true);
  assert.equal(emittedEvent.type, 'sui:dismiss');
  assert.equal(bannerCtrl.destroyed, true);
});

test('emptyState renders icons, titles, descriptions and actions with escaping', () => {
  // String shorthand
  const e1 = emptyState('No projects yet');
  assert.match(e1, /^<div data-sui-empty-state class="sx sx-empty"><b>No projects yet<\/b><\/div>$/);

  // Title, description, icon, actions, compact
  const full = emptyState({
    title: 'No results',
    description: 'Try adjusting your filters.',
    icon: 'search',
    actions: '<button>Clear filters</button>',
    compact: true,
  });
  assert.match(full, /class="sx sx-empty compact"/);
  assert.match(full, /<svg aria-hidden="true"/);
  assert.match(full, /<b>No results<\/b>/);
  assert.match(full, /<p class="sx-help">Try adjusting your filters\.<\/p>/);
  assert.match(full, /<div class="sx-empty-actions"><button>Clear filters<\/button><\/div>/);

  // Escaping
  assert.match(emptyState({title: '<h1>None</h1>', description: '<script>'}), /&lt;h1&gt;None&lt;\/h1&gt;/);
  assert.match(emptyState({title: '<h1>None</h1>', description: '<script>'}), /&lt;script&gt;/);
});

test('loader renders presets, custom sizes, visible label and accessible label', () => {
  // Default loader (size=sm, label='Loading…', showLabel=true)
  const l1 = loader();
  assert.match(l1, /^<span data-sui-loader class="sx-row sx-loader-wrap" role="status"><span class="sx-loader" aria-hidden="true" style="--loader-size:16px"><\/span><span>Loading…<\/span><\/span>$/);

  // Presets
  const sm = loader({size: 'sm'});
  assert.match(sm, /--loader-size:16px/);

  const base = loader({size: 'base'});
  assert.match(base, /--loader-size:24px/);

  const lg = loader({size: 'lg'});
  assert.match(lg, /--loader-size:32px/);

  // Numeric shorthand: loader(20)
  const num = loader(20);
  assert.match(num, /--loader-size:20px/);

  // Accessible label only (showLabel = false)
  const accessibleOnly = loader({showLabel: false, label: 'Loading content'});
  assert.match(accessibleOnly, /^<span data-sui-loader class="sx-loader" role="status" aria-label="Loading content" style="--loader-size:16px"><\/span>$/);

  // Escaping
  assert.match(loader({label: '<Saving>'}), /&lt;Saving&gt;/);

  // Validation
  assert.throws(() => loader({size: 'huge'}), TypeError);
  assert.throws(() => loader(-5), TypeError);
});

test('skeleton renders shapes, dimensions, count and accessibility status', () => {
  // Default skeleton line
  const s1 = skeleton();
  assert.match(s1, /^<div data-sui-skeleton class="sx-skeleton-layout" role="status" aria-busy="true" aria-label="Loading content"><div class="sx-skeleton" aria-hidden="true"><\/div><\/div>$/);

  // Shapes
  const shapes = ['line', 'line-short', 'round', 'card', 'fill'];
  for (const shape of shapes) {
    const html = skeleton({shape});
    if (shape === 'line') assert.match(html, /class="sx-skeleton"/);
    else if (shape === 'card') assert.match(html, /class="sx-skeleton card-shape"/);
    else assert.match(html, new RegExp(`class="sx-skeleton ${shape}"`));
  }

  // Count > 1
  const multi = skeleton({shape: 'line', count: 3});
  const lines = multi.match(/class="sx-skeleton"/g);
  assert.equal(lines.length, 3);

  // Dimensions
  const dims = skeleton({shape: 'round', size: 48, radius: '50%'});
  assert.match(dims, /--skeleton-size:48px/);
  assert.match(dims, /--skeleton-radius:50%/);

  const custom = skeleton({width: '80%', height: 24});
  assert.match(custom, /--skeleton-width:80%/);
  assert.match(custom, /--skeleton-height:24px/);

  // Escaping
  assert.match(skeleton({ariaLabel: '<Content>'}), /aria-label="&lt;Content&gt;"/);

  // Validation
  assert.throws(() => skeleton({shape: 'triangle'}), TypeError);
});

test('scrollArea renders orientation, tabindex, region role and handles boundary indicators', () => {
  // Default vertical scroll area
  const sa1 = scrollArea({content: '<p>Text</p>'});
  assert.match(sa1, /^<div data-sui-scroll-area class="sx-scroll-area orientation-vertical" role="region" tabindex="0"><p>Text<\/p><\/div>$/);

  // Orientations
  const horizontal = scrollArea({orientation: 'horizontal'});
  assert.match(horizontal, /orientation-horizontal/);

  const both = scrollArea({orientation: 'both', ariaLabel: 'Scroll area'});
  assert.match(both, /orientation-both/);
  assert.match(both, /aria-label="Scroll area"/);

  // Custom tabindex
  const noTab = scrollArea({tabindex: -1});
  assert.match(noTab, /tabindex="-1"/);

  // Validation
  assert.throws(() => scrollArea({orientation: 'invalid'}), TypeError);

  // initScrollArea controller with mock element
  const attrs = new Set();
  const mockScrollEl = {
    scrollTop: 0,
    clientHeight: 100,
    scrollHeight: 300,
    scrollLeft: 0,
    clientWidth: 100,
    scrollWidth: 100,
    matches(sel) { return sel === '[data-sui-scroll-area]'; },
    toggleAttribute(name, force) { force ? attrs.add(name) : attrs.delete(name); },
    hasAttribute(name) { return attrs.has(name); },
    addEventListener(ev, fn) { this._onScroll = fn; },
    removeEventListener(ev, fn) { this._onScroll = null; },
    scrollTo(opts) { this.lastScroll = opts; }
  };

  const saCtrl = initScrollArea(mockScrollEl);
  assert.equal(mockScrollEl.hasAttribute('data-at-top'), true);
  assert.equal(mockScrollEl.hasAttribute('data-at-bottom'), false);
  assert.equal(mockScrollEl.hasAttribute('data-at-start'), true);
  assert.equal(mockScrollEl.hasAttribute('data-at-end'), true);

  // Simulate scroll to bottom
  mockScrollEl.scrollTop = 200;
  saCtrl.update();
  assert.equal(mockScrollEl.hasAttribute('data-at-top'), false);
  assert.equal(mockScrollEl.hasAttribute('data-at-bottom'), true);

  saCtrl.scrollTo({top: 50});
  assert.deepEqual(mockScrollEl.lastScroll, {top: 50});

  saCtrl.destroy();
  assert.equal(saCtrl.destroyed, true);
});

test('checkbox renders native input, states, description, and controller handles indeterminate and reset', () => {
  // String shorthand
  const cb1 = checkbox('Agree to terms');
  assert.match(cb1, /^<div data-sui-checkbox class="sx sx-checkbox-layout"><input id="[^"]*" data-sui-checkbox-input type="checkbox" value="on"><label for="[^"]*">Agree to terms<\/label><\/div>$/);

  // States: checked, indeterminate, disabled, required, invalid
  const full = checkbox({
    name: 'notify',
    value: 'email',
    label: 'Send emails',
    description: 'Weekly summary',
    checked: true,
    indeterminate: true,
    disabled: true,
    required: true,
    invalid: true,
  });
  assert.match(full, /name="notify"/);
  assert.match(full, /value="email"/);
  assert.match(full, /\bchecked\b/);
  assert.match(full, /data-indeterminate="true"/);
  assert.match(full, /\bdisabled\b/);
  assert.match(full, /\brequired\b/);
  assert.match(full, /aria-invalid="true"/);
  assert.match(full, /aria-describedby="[^\"]+-description"/);
  assert.match(full, /<span class="sx-help" id="[^\"]+-description">Weekly summary<\/span>/);

  // Escaping
  assert.match(checkbox({label: '<b>Terms</b>', description: '<script>'}), /&lt;b&gt;Terms&lt;\/b&gt;/);
  assert.match(checkbox({label: 'Terms', description: '<script>'}), /&lt;script&gt;/);

  // Controller behavior with mock input
  let emitted = null;
  const mockFormListeners = new Map();
  const mockInput = {
    tagName: 'INPUT',
    type: 'checkbox',
    name: 'agree',
    value: 'yes',
    checked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    validity: { valid: true },
    attributes: new Map([['data-indeterminate', 'true']]),
    matches(sel) { return sel === 'input[type="checkbox"]'; },
    hasAttribute(name) { return this.attributes.has(name); },
    setAttribute(name, val) { this.attributes.set(name, String(val)); },
    removeAttribute(name) { this.attributes.delete(name); },
    addEventListener(ev, fn) { this._onChange = fn; },
    removeEventListener(ev, fn) { this._onChange = null; },
    dispatchEvent(ev) { emitted = ev; return true; },
    checkValidity() { return !this.required || this.checked; },
    reportValidity() { return this.checkValidity(); },
    setCustomValidity(msg) { this.customError = msg; },
    form: {
      addEventListener(ev, fn) { mockFormListeners.set(ev, fn); },
      removeEventListener(ev) { mockFormListeners.delete(ev); }
    },
    ownerDocument: {
      defaultView: {
        setTimeout(fn) { fn(); },
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      }
    }
  };

  const ctrl = initCheckbox(mockInput);
  assert.equal(ctrl.indeterminate, true);
  assert.equal(ctrl.checked, false);

  // Silent setters
  ctrl.setChecked(true);
  assert.equal(mockInput.checked, true);
  assert.equal(mockInput.indeterminate, false);

  ctrl.setIndeterminate(true);
  assert.equal(mockInput.indeterminate, true);

  ctrl.setDisabled(true);
  assert.equal(mockInput.disabled, true);

  ctrl.setRequired(true);
  assert.equal(mockInput.required, true);

  // Event emission on user change
  mockInput.checked = true;
  mockInput._onChange();
  assert.equal(emitted.type, 'sui:change');
  assert.deepEqual(emitted.detail, { name: 'agree', checked: true, indeterminate: false });

  ctrl.destroy();
  assert.equal(ctrl.destroyed, true);
});

test('radio renders native radio input, name grouping, and controller state', () => {
  // String shorthand
  const r1 = radio('Option 1');
  assert.match(r1, /^<div data-sui-radio class="sx sx-checkbox-layout"><input id="[^"]*" data-sui-radio-input type="radio"><label for="[^"]*">Option 1<\/label><\/div>$/);

  // Full options
  const full = radio({
    name: 'plan',
    value: 'pro',
    label: 'Pro Plan',
    description: '$20/month',
    checked: true,
    disabled: true,
    required: true,
    invalid: true,
  });
  assert.match(full, /name="plan"/);
  assert.match(full, /value="pro"/);
  assert.match(full, /\bchecked\b/);
  assert.match(full, /\bdisabled\b/);
  assert.match(full, /\brequired\b/);
  assert.match(full, /aria-invalid="true"/);
  assert.match(full, /<span class="sx-help" id="[^\"]+-description">\$20\/month<\/span>/);

  // Escaping
  assert.match(radio({label: '<em>Pro</em>', description: '<b>$20</b>'}), /&lt;em&gt;Pro&lt;\/em&gt;/);
  assert.match(radio({description: '<b>$20</b>'}), /&lt;b&gt;\$20&lt;\/b&gt;/);

  // Controller behavior with mock input
  let emitted = null;
  const mockInput = {
    tagName: 'INPUT',
    type: 'radio',
    name: 'plan',
    value: 'pro',
    checked: false,
    disabled: false,
    required: false,
    matches(sel) { return sel === 'input[type="radio"]'; },
    addEventListener(ev, fn) { this._onChange = fn; },
    removeEventListener(ev, fn) { this._onChange = null; },
    dispatchEvent(ev) { emitted = ev; return true; },
    checkValidity() { return !this.required || this.checked; },
    reportValidity() { return this.checkValidity(); },
    setCustomValidity(msg) { this.customError = msg; },
    ownerDocument: {
      defaultView: {
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      }
    }
  };

  const ctrl = initRadio(mockInput);
  assert.equal(ctrl.checked, false);

  ctrl.setChecked(true);
  assert.equal(mockInput.checked, true);

  ctrl.setDisabled(true);
  assert.equal(mockInput.disabled, true);

  mockInput._onChange();
  assert.equal(emitted.type, 'sui:change');
  assert.deepEqual(emitted.detail, { name: 'plan', value: 'pro', checked: true });

  ctrl.destroy();
  assert.equal(ctrl.destroyed, true);
});

test('switchControl renders accessible switch button, hidden form input, and controller toggle', () => {
  // String shorthand
  const s1 = switchControl('Airplane mode');
  assert.match(s1, /^<div data-sui-switch class="sx sx-switch-layout sx-checkbox-layout"><button id="[^"]*" data-sui-switch-control type="button" role="switch" class="sw" aria-checked="false"><i><\/i><\/button><input type="checkbox" data-sui-switch-input value="on" style="display:none" tabindex="-1" aria-hidden="true"><label for="[^"]*">Airplane mode<\/label><\/div>$/);

  // Full options: checked, disabled, required, description
  const full = switchControl({
    name: 'notifications',
    value: 'enabled',
    label: 'Push notifications',
    description: 'Instant alerts',
    checked: true,
    disabled: true,
    required: true,
  });
  assert.match(full, /role="switch"/);
  assert.match(full, /aria-checked="true"/);
  assert.match(full, /<input type="checkbox" data-sui-switch-input name="notifications" value="enabled" checked disabled required/);
  assert.match(full, /<span class="sx-help" id="[^\"]+-description">Instant alerts<\/span>/);

  // Escaping
  assert.match(switchControl({label: '<Mode>', description: '<Info>'}), /&lt;Mode&gt;/);
  assert.match(switchControl({label: '<Mode>', description: '<Info>'}), /&lt;Info&gt;/);

  // Controller behavior with mock elements
  let emitted = null;
  const mockInput = { name: 'notifications', value: 'enabled', checked: false, disabled: false };
  const mockBtn = {
    tagName: 'BUTTON',
    attributes: new Map([['aria-checked', 'false']]),
    disabled: false,
    matches(sel) { return sel === 'button[role="switch"]'; },
    getAttribute(name) { return this.attributes.get(name); },
    setAttribute(name, val) { this.attributes.set(name, String(val)); },
    addEventListener(ev, fn) { if (ev === 'click') this._onClick = fn; if (ev === 'keydown') this._onKeyDown = fn; },
    removeEventListener(ev) { if (ev === 'click') this._onClick = null; if (ev === 'keydown') this._onKeyDown = null; },
    dispatchEvent(ev) { emitted = ev; return true; },
    closest() { return { querySelector(sel) { return sel.includes('switch-input') ? mockInput : null; } }; },
    ownerDocument: {
      defaultView: {
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      }
    }
  };

  const ctrl = initSwitch(mockBtn);
  assert.equal(ctrl.checked, false);

  // User click toggle
  mockBtn._onClick({ preventDefault() {}, target: mockBtn });
  assert.equal(mockBtn.getAttribute('aria-checked'), 'true');
  assert.equal(mockInput.checked, true);
  assert.equal(emitted.type, 'sui:change');
  assert.deepEqual(emitted.detail, { name: 'notifications', checked: true, value: 'enabled' });

  // Silent setters
  ctrl.setChecked(false);
  assert.equal(mockBtn.getAttribute('aria-checked'), 'false');
  assert.equal(mockInput.checked, false);

  ctrl.setDisabled(true);
  assert.equal(mockBtn.disabled, true);
  assert.equal(mockInput.disabled, true);

  ctrl.destroy();
  assert.equal(ctrl.destroyed, true);
});

test('textarea renders field, sizes, autoResize, character limit counter, and validation', () => {
  // String shorthand
  const t1 = textarea('Feedback');
  assert.match(t1, /^<div data-sui-textarea-field class="form-field sx-textarea-field"><label class="form-label" for="[^"]*">Feedback<\/label><div class="field sx-input-shell sx-textarea-shell sx-size-base"><textarea id="[^"]*" data-sui-textarea class="sx-textarea" rows="3"><\/textarea><\/div><\/div>$/);

  // Full options: size, autoResize, maxLength, helper, error, invalid, disabled
  const full = textarea({
    name: 'comments',
    value: 'Sesama kit',
    label: 'Comments',
    placeholder: 'Write here…',
    rows: 5,
    size: 'lg',
    maxLength: 100,
    autoResize: true,
    error: 'Too short',
    required: true,
    disabled: true,
  });
  assert.match(full, /name="comments"/);
  assert.match(full, /rows="5"/);
  assert.match(full, /placeholder="Write here…"/);
  assert.match(full, /sx-size-lg/);
  assert.match(full, /maxlength="100" data-count/);
  assert.match(full, /data-autoresize/);
  assert.match(full, /<output class="sx-counter" id="[^\"]+-counter" aria-live="polite">10 \/ 100<\/output>/);
  assert.match(full, /<span class="form-error" id="[^\"]+-message">Too short<\/span>/);
  assert.match(full, /aria-invalid="true"/);
  assert.match(full, /\bdisabled\b/);
  assert.match(full, /\brequired\b/);

  // Escaping
  assert.match(textarea({label: '<b>Note</b>', placeholder: '<write>', value: '<done>'}), /&lt;b&gt;Note&lt;\/b&gt;/);
  assert.match(textarea({placeholder: '<write>'}), /placeholder="&lt;write&gt;"/);
  assert.match(textarea({value: '<done>'}), />&lt;done&gt;<\/textarea>/);

  // Validation
  assert.throws(() => textarea({size: 'xl'}), TypeError);

  // Controller behavior with mock elements
  let emitted = null;
  const mockCounter = { textContent: '' };
  const mockTa = {
    tagName: 'TEXTAREA',
    name: 'bio',
    value: 'Hello',
    disabled: false,
    required: false,
    scrollHeight: 120,
    style: { height: '' },
    attributes: new Map([['data-autoresize', ''], ['maxlength', '50']]),
    matches(sel) { return sel === 'textarea'; },
    hasAttribute(name) { return this.attributes.has(name); },
    getAttribute(name) { return this.attributes.get(name); },
    addEventListener(ev, fn) { if (ev === 'input') this._onInput = fn; if (ev === 'change') this._onChange = fn; },
    removeEventListener(ev) { if (ev === 'input') this._onInput = null; if (ev === 'change') this._onChange = null; },
    dispatchEvent(ev) { emitted = ev; return true; },
    closest() { return { querySelector(sel) { return sel === '.sx-counter' ? mockCounter : null; } }; },
    checkValidity() { return !this.required || Boolean(this.value); },
    reportValidity() { return this.checkValidity(); },
    setCustomValidity(msg) { this.customError = msg; },
    ownerDocument: {
      defaultView: {
        setTimeout(fn) { fn(); },
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      }
    }
  };

  const ctrl = initTextarea(mockTa);
  assert.equal(mockTa.style.height, '120px');
  assert.equal(mockCounter.textContent, '5 / 50');

  // Value update
  ctrl.setValue('Updated message');
  assert.equal(mockTa.value, 'Updated message');
  assert.equal(mockCounter.textContent, '15 / 50');

  // Change event
  mockTa._onChange();
  assert.equal(emitted.type, 'sui:change');
  assert.deepEqual(emitted.detail, { name: 'bio', value: 'Updated message' });

  ctrl.destroy();
  assert.equal(ctrl.destroyed, true);
});

test('chip renders static, selectable and removable variants with tones and controller events', () => {
  // Default chip: selectable toggle (legacy behavior)
  const c1 = chip('Frontend');
  assert.match(c1, /^<button data-sui-chip type="button" class="chip tone-neutral" data-sui-chip-select aria-pressed="false"><span>Frontend<\/span><\/button>$/);

  // Static chip is opt-in (non-interactive label)
  const staticChip = chip({label: 'Frontend', variant: 'static'});
  assert.match(staticChip, /^<span data-sui-chip class="chip tone-neutral"><span>Frontend<\/span><\/span>$/);

  // Tones
  const tones = ['neutral', 'informative', 'success', 'warning', 'error'];
  for (const tone of tones) {
    const html = chip({label: tone, tone});
    assert.match(html, new RegExp(`class="chip tone-${tone}"`));
  }

  // Selectable chip
  const selectable = chip({label: 'React', variant: 'selectable', selected: true});
  assert.match(selectable, /^<button data-sui-chip type="button" class="chip tone-neutral selected" data-sui-chip-select aria-pressed="true"><span>React<\/span><\/button>$/);

  // Removable chip
  const removable = chip({label: 'Design', removable: true});
  assert.match(removable, /^<span data-sui-chip class="chip tone-neutral" data-sui-chip-removable><span>Design<\/span><button type="button" class="ibtn sx-chip-remove" data-sui-chip-remove data-chip-remove aria-label="Remove Design tag"/);

  // Icon
  const withIcon = chip({label: 'Folder', icon: 'folder'});
  assert.match(withIcon, /<svg aria-hidden="true"/);

  // Escaping
  assert.match(chip({label: '<Tag>'}), /&lt;Tag&gt;/);

  // Validation
  assert.throws(() => chip({tone: 'brand'}), TypeError);
  assert.throws(() => chip({variant: 'popup'}), TypeError);

  // Controller behavior: selectable
  let changeEvent = null;
  const mockSelectableEl = {
    attributes: new Map([['aria-pressed', 'false'], ['data-sui-chip-select', '']]),
    classList: {
      _set: new Set(),
      toggle(cls, on) { on ? this._set.add(cls) : this._set.delete(cls); },
      contains(cls) { return this._set.has(cls); }
    },
    disabled: false,
    matches(sel) { return sel === '[data-sui-chip]'; },
    hasAttribute(name) { return this.attributes.has(name); },
    getAttribute(name) { return this.attributes.get(name); },
    setAttribute(name, val) { this.attributes.set(name, String(val)); },
    querySelector(sel) { return sel === 'span' ? { textContent: 'Design' } : null; },
    addEventListener(ev, fn) { this._onClick = fn; },
    removeEventListener() { this._onClick = null; },
    dispatchEvent(ev) { changeEvent = ev; },
    ownerDocument: {
      defaultView: { CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } } }
    }
  };

  const selCtrl = initChip(mockSelectableEl);
  assert.equal(selCtrl.selected, false);

  mockSelectableEl._onClick({});
  assert.equal(selCtrl.selected, true);
  assert.equal(changeEvent.type, 'sui:change');
  assert.deepEqual(changeEvent.detail, { label: 'Design', selected: true });

  selCtrl.setSelected(false);
  assert.equal(selCtrl.selected, false);

  selCtrl.destroy();
  assert.equal(selCtrl.destroyed, true);

  // Controller behavior: removable
  let removeEvent = null;
  const mockRemoveBtn = { tagName: 'BUTTON' };
  const mockRemovableEl = {
    attributes: new Map([['data-sui-chip-removable', '']]),
    disabled: false,
    matches(sel) { return sel === '[data-sui-chip]'; },
    hasAttribute(name) { return this.attributes.has(name); },
    querySelector(sel) {
      if (sel.includes('remove')) return mockRemoveBtn;
      if (sel === 'span') return { textContent: 'Design' };
      return null;
    },
    addEventListener(ev, fn) { this._onClick = fn; },
    removeEventListener() { this._onClick = null; },
    dispatchEvent(ev) { removeEvent = ev; },
    ownerDocument: {
      defaultView: { CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } } }
    }
  };

  const remCtrl = initChip(mockRemovableEl);
  mockRemovableEl._onClick({ target: mockRemoveBtn, preventDefault() {} });
  assert.equal(removeEvent.type, 'sui:remove');
  assert.deepEqual(removeEvent.detail, { label: 'Design' });
  remCtrl.destroy();
  assert.equal(remCtrl.destroyed, true);
});

test('menuItem renders actions, links, checkboxes, radios, shortcuts, and escaping', () => {
  // Action item
  const item1 = menuItem({label: 'Edit', icon: 'pencil', shortcut: '⌘E'});
  assert.match(item1, /^<button type="button" [^>]*class="sx-menu-item" role="menuitem"/);
  assert.match(item1, /data-sui-menu-item/);
  assert.match(item1, /<span>Edit<\/span>/);
  assert.match(item1, /<kbd>⌘E<\/kbd>/);

  // Link item
  const linkItem = menuItem({label: 'Settings', href: '/settings'});
  assert.match(linkItem, /^<a [^>]*class="sx-menu-item" role="menuitem" href="\/settings"/);

  // Checkbox item
  const checkItem = menuItem({label: 'Show line numbers', role: 'menuitemcheckbox', checked: true});
  assert.match(checkItem, /role="menuitemcheckbox"/);
  assert.match(checkItem, /aria-checked="true"/);
  assert.match(checkItem, /class="sx-menu-check"/);

  // Radio item
  const radioItem = menuItem({label: 'Dark mode', role: 'menuitemradio', checked: false});
  assert.match(radioItem, /role="menuitemradio"/);
  assert.match(radioItem, /aria-checked="false"/);
  assert.match(radioItem, /class="sx-menu-radio"/);

  // Danger / destructive
  const dangerItem = menuItem({label: 'Delete', danger: true});
  assert.match(dangerItem, /class="sx-menu-item danger"/);

  // Disabled button & link
  const disabledBtn = menuItem({label: 'Copy', disabled: true});
  assert.match(disabledBtn, /\bdisabled aria-disabled="true"/);

  const disabledLink = menuItem({label: 'Profile', href: '/profile', disabled: true});
  assert.match(disabledLink, /href="#" aria-disabled="true" tabindex="-1"/);

  // Escaping
  const escaped = menuItem({label: '<b>Bold</b>', shortcut: '<kbd>'});
  assert.match(escaped, /&lt;b&gt;Bold&lt;\/b&gt;/);
  assert.match(escaped, /&lt;kbd&gt;/);
});

test('menu and initMenu render collections, groups, and handle keyboard navigation', () => {
  // Builder rendering
  const menuHtml = menu({
    ariaLabel: 'Project actions',
    items: [
      {label: 'Edit', id: 'edit-item'},
      {type: 'separator'},
      {label: 'Delete', id: 'delete-item', danger: true},
    ]
  });
  assert.match(menuHtml, /role="menu"/);
  assert.match(menuHtml, /aria-label="Project actions"/);
  assert.match(menuHtml, /role="separator"/);
  assert.match(menuHtml, /data-sui-menu-id="edit-item"/);
  assert.match(menuHtml, /data-sui-menu-id="delete-item"/);

  // Grouped builder
  const groupedHtml = menu({
    groups: [
      {label: 'Edit', items: [{label: 'Undo'}, {label: 'Redo'}]},
      {label: 'Danger', items: [{label: 'Clear'}]}
    ]
  });
  assert.match(groupedHtml, /role="group" aria-label="Edit"/);
  assert.match(groupedHtml, /class="sx-menu-label">Edit<\/div>/);
  assert.match(groupedHtml, /role="group" aria-label="Danger"/);

  // Controller interaction
  let selectDetail = null;
  const mockCheckItem = {
    disabled: false,
    dataset: { suiMenuId: 'line-num' },
    id: 'item-1',
    getAttribute(attr) { return attr === 'role' ? 'menuitemcheckbox' : attr === 'aria-checked' ? this._checked : null; },
    setAttribute(attr, val) { if (attr === 'aria-checked') this._checked = val; },
    _checked: 'false',
    matches() { return false; },
    querySelector(sel) {
      if (sel === 'span') return { textContent: 'Line numbers' };
      if (sel === '.sx-menu-check') return this._checkSlot;
      return null;
    },
    _checkSlot: { innerHTML: '' },
    textContent: 'Line numbers',
    focus() { this._focused = true; }
  };

  const mockMenuItems = [mockCheckItem];
  const mockMenuEl = {
    querySelectorAll(sel) { return sel === '[data-sui-menu-item]' ? mockMenuItems : []; },
    addEventListener(ev, fn) { if (ev === 'click') this._onClick = fn; if (ev === 'keydown') this._onKey = fn; },
    removeEventListener() {},
    contains(n) { return mockMenuItems.includes(n); },
    dispatchEvent(ev) { selectDetail = ev.detail; },
    ownerDocument: {
      defaultView: { CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } } },
      activeElement: mockCheckItem,
    }
  };

  const menuCtrl = initMenu(mockMenuEl);
  assert.equal(menuCtrl.getItems().length, 1);

  // Activate via click
  mockMenuEl._onClick({ target: { closest: () => mockCheckItem } });
  assert.equal(mockCheckItem._checked, 'true');
  assert.equal(selectDetail.id, 'line-num');
  assert.equal(selectDetail.checked, true);

  // Activate via keydown Enter
  mockMenuEl._onKey({ key: 'Enter', preventDefault() {} });
  assert.equal(mockCheckItem._checked, 'false');
  assert.equal(selectDetail.checked, false);

  menuCtrl.destroy();
});

test('popover and initPopover manage trigger, content, open/close, and dismissal', () => {
  const popHtml = popover({
    trigger: 'Filter',
    content: '<div class="pop-body">Filter body</div>',
    placement: 'bottom',
    ariaLabel: 'Filter dialog',
  });
  assert.match(popHtml, /data-sui-popover/);
  assert.match(popHtml, /popovertarget=/);
  assert.match(popHtml, /aria-haspopup="dialog"/);
  assert.match(popHtml, /role="dialog"/);
  assert.match(popHtml, /aria-label="Filter dialog"/);
  assert.match(popHtml, /Filter body/);

  // Controller interaction
  let openDetail = null;
  let closeDetail = null;
  const mockTrigger = {
    disabled: false,
    dataset: {},
    setAttribute(k, v) { this[k] = v; },
    removeAttribute(k) { delete this[k]; },
    addEventListener(ev, fn) { if (ev === 'click') this._onClick = fn; },
    removeEventListener() {},
    matches() { return false; },
    getBoundingClientRect: () => ({ left: 100, top: 50, right: 180, bottom: 80, width: 80, height: 30 }),
    isConnected: true,
    focus() { this._focused = true; },
  };

  const mockPopup = {
    id: 'pop-1',
    dataset: {},
    style: {},
    showPopover() { this._open = true; },
    hidePopover() { this._open = false; },
    getBoundingClientRect: () => ({ width: 150, height: 100 }),
    ownerDocument: {
      defaultView: { innerWidth: 1024, innerHeight: 768, Node: Object },
    }
  };

  const mockPopoverEl = {
    dataset: { placement: 'bottom' },
    querySelector(sel) {
      if (sel.includes('trigger') || sel.includes('popovertarget')) return mockTrigger;
      if (sel.includes('content') || sel.includes('popover')) return mockPopup;
      return null;
    },
    ownerDocument: {
      defaultView: {
        innerWidth: 1024,
        innerHeight: 768,
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      },
      addEventListener() {},
      removeEventListener() {},
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:popover:open') openDetail = ev.detail;
      if (ev.type === 'sui:popover:close') closeDetail = ev.detail;
    }
  };

  const popCtrl = initPopover(mockPopoverEl);
  assert.equal(popCtrl.isOpen(), false);

  popCtrl.open();
  assert.equal(popCtrl.isOpen(), true);
  assert.equal(mockTrigger['aria-expanded'], 'true');
  assert.equal(mockPopup._open, true);
  assert.equal(openDetail.id, 'pop-1');

  popCtrl.close(true);
  assert.equal(popCtrl.isOpen(), false);
  assert.equal(mockTrigger['aria-expanded'], 'false');
  assert.equal(mockPopup._open, false);
  assert.equal(closeDetail.id, 'pop-1');
  assert.equal(mockTrigger._focused, true);

  popCtrl.destroy();
});

test('dropdownMenu and initDropdownMenu compose button and menu with selection lifecycle', () => {
  const ddHtml = dropdownMenu({
    trigger: 'Options',
    items: [{label: 'Profile', id: 'opt-prof'}, {label: 'Sign out', id: 'opt-out'}],
  });
  assert.match(ddHtml, /data-sui-dropdown/);
  assert.match(ddHtml, /data-sui-dropdown-trigger/);
  assert.match(ddHtml, /data-sui-dropdown-menu-list/);
  assert.match(ddHtml, /role="menu"/);
  assert.match(ddHtml, /opt-prof/);

  // Controller interaction
  let selectEvent = null;
  const mockTrigger = {
    disabled: false,
    setAttribute(k, v) { this[k] = v; },
    addEventListener(ev, fn) { if (ev === 'click') this._onClick = fn; },
    removeEventListener() {},
    matches() { return false; },
    getBoundingClientRect: () => ({ left: 50, top: 40, right: 120, bottom: 70, width: 70, height: 30 }),
    isConnected: true,
    focus() { this._focused = true; }
  };

  let menuSelectHandler = null;
  const mockMenu = {
    id: 'dd-menu',
    dataset: {},
    style: {},
    showPopover() { this._open = true; },
    hidePopover() { this._open = false; },
    getBoundingClientRect: () => ({ width: 140, height: 90 }),
    querySelectorAll() { return []; },
    addEventListener(ev, fn) { if (ev === 'sui:menu:select') menuSelectHandler = fn; },
    removeEventListener() {},
    ownerDocument: {
      defaultView: { innerWidth: 1024, innerHeight: 768, Node: Object }
    }
  };

  const mockDdEl = {
    dataset: { placement: 'bottom' },
    querySelector(sel) {
      if (sel.includes('trigger') || sel.includes('popovertarget')) return mockTrigger;
      if (sel.includes('menu') || sel.includes('role="menu"')) return mockMenu;
      return null;
    },
    ownerDocument: {
      defaultView: {
        innerWidth: 1024,
        innerHeight: 768,
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      },
      addEventListener() {},
      removeEventListener() {},
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:dropdown:select') selectEvent = ev.detail;
    }
  };

  const ddCtrl = initDropdownMenu(mockDdEl);
  ddCtrl.open();
  assert.equal(ddCtrl.isOpen(), true);

  // Selecting an action closes menu and dispatches sui:dropdown:select
  menuSelectHandler({ detail: { id: 'opt-prof', label: 'Profile', role: 'menuitem' } });
  assert.equal(ddCtrl.isOpen(), false);
  assert.equal(selectEvent.id, 'opt-prof');
  assert.equal(mockTrigger._focused, true);

  ddCtrl.destroy();
});

test('tooltip and initTooltip handle hover, focus, delay, and escape dismissal', () => {
  const tipHtml = tooltip({
    content: 'Helpful hint',
    placement: 'top',
    trigger: '<button id="btn-help">Help</button>',
    delay: 0,
  });
  assert.match(tipHtml, /class="sx-tooltip-wrap"/);
  assert.match(tipHtml, /data-sui-tooltip/);
  assert.match(tipHtml, /role="tooltip"/);
  assert.match(tipHtml, /Helpful hint/);
  assert.match(tipHtml, /aria-describedby=/);

  // Controller interaction
  let showEvent = null;
  let hideEvent = null;
  const mockTrigger = {
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    getBoundingClientRect: () => ({ left: 200, top: 100, right: 250, bottom: 130, width: 50, height: 30 }),
    ownerDocument: { defaultView: { innerWidth: 1024, innerHeight: 768 } }
  };

  const mockTip = {
    id: 'tip-1',
    dataset: {},
    style: {},
    showPopover() { this._open = true; },
    hidePopover() { this._open = false; },
    getBoundingClientRect: () => ({ width: 80, height: 24 }),
    ownerDocument: { defaultView: { innerWidth: 1024, innerHeight: 768 } }
  };

  const mockTooltipEl = {
    dataset: { placement: 'top', delay: '0' },
    querySelector(sel) {
      if (sel.includes('trigger') || sel.includes('describedby')) return mockTrigger;
      if (sel.includes('tooltip')) return mockTip;
      return null;
    },
    ownerDocument: {
      defaultView: {
        innerWidth: 1024,
        innerHeight: 768,
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      },
      querySelectorAll() { return []; },
      addEventListener() {},
      removeEventListener() {},
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:tooltip:show') showEvent = ev.detail;
      if (ev.type === 'sui:tooltip:hide') hideEvent = ev.detail;
    }
  };

  const tipCtrl = initTooltip(mockTooltipEl);
  assert.equal(tipCtrl.isVisible(), false);

  tipCtrl.show();
  assert.equal(tipCtrl.isVisible(), true);
  assert.equal(mockTip._open, true);
  assert.equal(showEvent.id, 'tip-1');

  tipCtrl.hide();
  assert.equal(tipCtrl.isVisible(), false);
  assert.equal(mockTip._open, false);
  assert.equal(hideEvent.id, 'tip-1');

  tipCtrl.destroy();
});

test('showToast and initToastRegion manage queue, tones, actions, and handle updates', () => {
  const createdItems = [];
  const mockRegionEl = {
    append(item) { createdItems.push(item); },
    ownerDocument: {
      createElement(tag) {
        return {
          tagName: tag.toUpperCase(),
          classList: { add() {} },
          dataset: {},
          style: {},
          append(...children) { this._children = (this._children || []).concat(children); },
          querySelector(sel) {
            if (sel === '.ds-toast-icon') return this._icon || (this._icon = { innerHTML: '' });
            if (sel === '.ds-toast-text') return this._text || (this._text = { innerHTML: '' });
            return null;
          },
          setAttribute(k, v) { this[k] = v; },
          addEventListener() {},
          remove() {
            const idx = createdItems.indexOf(this);
            if (idx >= 0) createdItems.splice(idx, 1);
          }
        };
      },
      defaultView: { setTimeout, clearTimeout }
    }
  };

  const regionCtrl = initToastRegion(mockRegionEl);

  // Show a neutral toast
  const handle1 = regionCtrl.showToast({
    message: 'Changes saved',
    title: 'Success',
    tone: 'success',
    duration: 0,
    action: { label: 'Undo', onClick() {} },
  });

  assert.equal(createdItems.length, 1);
  const toast1 = createdItems[0];
  assert.equal(toast1.dataset.tone, 'success');
  assert.equal(toast1.hidden, false);

  // Duplicate deduplication: same message & tone returns existing handle
  const handleDup = regionCtrl.showToast({ message: 'Changes saved', tone: 'success' });
  assert.equal(handleDup, handle1);
  assert.equal(createdItems.length, 1);

  // Update handle
  handle1.update('Save failed', 'error');
  assert.equal(toast1.dataset.tone, 'error');

  // Dismiss handle
  handle1.dismiss();
  assert.equal(createdItems.length, 0);

  regionCtrl.destroy();
});

test('buttonGroup and initButtonGroup render groups, connected radii, and split dropdowns', () => {
  // Plain button group
  const groupHtml = buttonGroup({
    buttons: ['Day', 'Week', 'Month'],
    variant: 'secondary',
  });
  assert.match(groupHtml, /data-sui-button-group/);
  assert.match(groupHtml, /Day<\/button>/);
  assert.match(groupHtml, /Week<\/button>/);
  assert.match(groupHtml, /Month<\/button>/);

  // Split button
  const splitHtml = buttonGroup({
    split: true,
    buttons: [{label: 'Create project', variant: 'primary'}],
    menu: {
      items: [{label: 'From template'}, {label: 'Blank'}]
    }
  });
  assert.match(splitHtml, /data-sui-button-group-split-trigger/);
  assert.match(splitHtml, /data-sui-button-group-split-menu/);
  assert.match(splitHtml, /Create project<\/button>/);
  assert.match(splitHtml, /From template/);

  // Controller
  const mockGroupEl = {
    querySelector(sel) { return null; }
  };
  const ctrl = initButtonGroup(mockGroupEl);
  ctrl.destroy();
});

test('commandPalette and initCommandPalette filter commands and handle execution', () => {
  const palHtml = commandPalette({
    title: 'Actions',
    placeholder: 'Type a command…',
    commands: [
      {id: 'cmd-new', label: 'Create Project', group: 'Projects', action: 'create:project'},
      {id: 'cmd-open', label: 'Open Project', group: 'Projects', action: 'open:project'},
      {id: 'cmd-del', label: 'Delete Account', group: 'Settings', action: 'delete:account'},
    ],
    emptyText: 'Nothing found.',
  });
  assert.match(palHtml, /<dialog [^>]*data-sui-command-palette/);
  assert.match(palHtml, /role="combobox"/);
  assert.match(palHtml, /role="listbox"/);
  assert.match(palHtml, /data-command-search/);
  assert.match(palHtml, /Create Project/);
  assert.match(palHtml, /Projects/);

  // Controller interaction
  let executedCommand = null;
  const mockResultsContainer = {
    innerHTML: '',
    querySelectorAll(sel) {
      if (sel === '[role="option"]') return this._options || [];
      return [];
    },
    _options: [],
    contains(n) { return this._options.includes(n); }
  };

  const mockInput = {
    value: '',
    setAttribute() {},
    removeAttribute() {},
    focus() {},
    addEventListener() {},
    removeEventListener() {}
  };

  const mockDialog = {
    id: 'cmd-dialog',
    open: false,
    dataset: {
      emptyText: 'Nothing found.',
      suiCommands: JSON.stringify([
        { id: '1', label: 'Open Workspace', name: 'Open Workspace', group: 'Workspaces', action: 'ws:open' },
        { id: '2', label: 'Close Workspace', name: 'Close Workspace', group: 'Workspaces', action: 'ws:close' },
      ])
    },
    querySelector(sel) {
      if (sel.includes('input') || sel.includes('search')) return mockInput;
      if (sel.includes('results') || sel.includes('listbox')) return mockResultsContainer;
      return null;
    },
    showModal() { this.open = true; },
    close() { this.open = false; },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    dispatchEvent(ev) {
      if (ev.type === 'sui:command:select') executedCommand = ev.detail;
    },
    ownerDocument: {
      defaultView: { CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } } },
      addEventListener() {},
      removeEventListener() {}
    }
  };

  const palCtrl = initCommandPalette(mockDialog);
  palCtrl.open();
  assert.equal(mockDialog.open, true);

  // Filter commands
  palCtrl.filter('close');
  assert.match(mockResultsContainer.innerHTML, /Close Workspace/);
  assert.doesNotMatch(mockResultsContainer.innerHTML, /Open Workspace/);

  // Filter with no matches shows emptyText
  palCtrl.filter('xyzxyz');
  assert.match(mockResultsContainer.innerHTML, /Nothing found\./);

  palCtrl.close();
  assert.equal(mockDialog.open, false);
  palCtrl.destroy();
});

test('combobox and initCombobox support separate query/value, filtering, and native reset', () => {
  const comboHtml = combobox({
    name: 'project',
    label: 'Assigned Project',
    value: 'p2',
    options: [
      {value: 'p1', label: 'Website'},
      {value: 'p2', label: 'Mobile app'},
      {value: 'p3', label: 'Archived', disabled: true},
    ],
    placeholder: 'Search projects…',
    clearable: true,
  });

  assert.match(comboHtml, /data-sui-combobox/);
  assert.match(comboHtml, /<label [^>]*>Assigned Project<\/label>/);
  assert.match(comboHtml, /role="combobox"/);
  assert.match(comboHtml, /value="Mobile app"/);
  assert.match(comboHtml, /data-sui-combobox-hidden[^>]*value="p2"/);
  assert.match(comboHtml, /data-combo-clear/);
  assert.match(comboHtml, /data-combo-status/);

  // Controller interaction
  let changeDetail = null;
  const mockInput = {
    value: 'Web',
    disabled: false,
    setAttribute(k, v) { this[k] = v; },
    removeAttribute(k) { delete this[k]; },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    focus() { this._focused = true; },
    getBoundingClientRect: () => ({ left: 10, top: 20, right: 150, bottom: 50, width: 140, height: 30 })
  };

  const mockHidden = { value: 'p2' };
  const mockClearBtn = { hidden: false, addEventListener() {}, removeEventListener() {} };
  const mockStatus = { textContent: '' };

  const mockList = {
    id: 'c-list',
    innerHTML: '',
    showPopover() { this._open = true; },
    hidePopover() { this._open = false; },
    style: {},
    dataset: {},
    querySelectorAll(sel) {
      if (sel.includes('option')) return this._opts || [];
      return [];
    },
    querySelector(sel) {
      if (sel.includes('option')) return (this._opts && this._opts[0]) || null;
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    contains(n) { return (this._opts || []).includes(n); },
    getBoundingClientRect: () => ({ width: 140, height: 100 })
  };

  const mockOpt = {
    getAttribute(attr) { return attr === 'aria-disabled' ? 'false' : null; },
    dataset: { comboValue: 'p1', comboLabel: 'Website' },
    classList: { add() {}, remove() {} },
    scrollIntoView() {},
    id: 'c-list-0'
  };
  mockList._opts = [mockOpt];

  const mockComboEl = {
    dataset: {
      name: 'project',
      value: 'p2',
      suiOptions: JSON.stringify([
        { value: 'p1', label: 'Website' },
        { value: 'p2', label: 'Mobile app' }
      ])
    },
    querySelector(sel) {
      if (sel.includes('combobox-input') || sel === '[role="combobox"]') return mockInput;
      if (sel.includes('combobox-list') || sel === '[role="listbox"]') return mockList;
      if (sel.includes('combobox-hidden') || sel.includes('hidden')) return mockHidden;
      if (sel.includes('clear')) return mockClearBtn;
      if (sel.includes('status')) return mockStatus;
      return null;
    },
    closest: () => null,
    addEventListener() {},
    removeEventListener() {},
    ownerDocument: {
      defaultView: {
        innerWidth: 1024,
        innerHeight: 768,
        Node: Object,
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      },
      addEventListener() {},
      removeEventListener() {}
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:change') changeDetail = ev.detail;
    }
  };

  const ctrl = initCombobox(mockComboEl);
  assert.equal(ctrl.getValue(), 'p2');

  // Trigger input change (filtering)
  mockInput._input();
  assert.equal(mockList._open, true);
  assert.match(mockList.innerHTML, /Website/);

  // Set value programmatically
  ctrl.setValue('p1');
  assert.equal(ctrl.getValue(), 'p1');
  assert.equal(mockHidden.value, 'p1');
  assert.equal(changeDetail.value, 'p1');

  // Clear
  ctrl.clear();
  assert.equal(ctrl.getValue(), '');
  assert.equal(mockInput.value, '');
  assert.equal(changeDetail.value, '');

  ctrl.destroy();
});

test('datePicker and initDatePicker support direct opening, calendar grid navigation, and range mode', () => {
  // Single mode
  const singleHtml = datePicker({
    label: 'Due date',
    name: 'due',
    value: '2026-10-31',
  });
  assert.match(singleHtml, /data-sui-date-picker/);
  assert.match(singleHtml, /data-date-mode="single"/);
  assert.match(singleHtml, /data-sui-date-hidden[^>]*value="2026-10-31"/);
  assert.match(singleHtml, /2026-10-31<\/span>/);
  assert.match(singleHtml, /data-date-clear/);
  assert.match(singleHtml, /data-calendar-content/);

  // Range mode
  const rangeHtml = datePicker({
    label: 'Period',
    mode: 'range',
    value: '2026-10-01 – 2026-10-15',
  });
  assert.match(rangeHtml, /data-date-mode="range"/);
  assert.match(rangeHtml, /2026-10-01 – 2026-10-15/);

  // Controller interaction
  let dateChange = null;
  const mockTrigger = {
    disabled: false,
    setAttribute(k, v) { this[k] = v; },
    addEventListener(ev, fn) { if (ev === 'click') this._onClick = fn; },
    removeEventListener() {},
    focus() { this._focused = true; },
    getBoundingClientRect: () => ({ left: 20, top: 40, right: 160, bottom: 70, width: 140, height: 30 }),
    isConnected: true
  };

  const mockDisplay = { textContent: '2026-10-31', classList: { toggle() {} } };
  const mockClear = { hidden: false, addEventListener() {}, removeEventListener() {} };
  const mockHiddenDate = { value: '2026-10-31' };
  const mockContent = { innerHTML: '', querySelector() { return null; } };

  const mockCalendarPopup = {
    showPopover() { this._open = true; },
    hidePopover() { this._open = false; },
    style: {},
    dataset: {},
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    getBoundingClientRect: () => ({ width: 280, height: 260 })
  };

  const mockDateEl = {
    dataset: {
      name: 'due',
      dateMode: 'single',
      value: '2026-10-31'
    },
    querySelector(sel) {
      if (sel.includes('trigger')) return mockTrigger;
      if (sel.includes('display')) return mockDisplay;
      if (sel.includes('clear')) return mockClear;
      if (sel.includes('hidden')) return mockHiddenDate;
      if (sel.includes('content') || sel.includes('calendar-content')) return mockContent;
      if (sel.includes('popup') || sel.includes('calendar')) return mockCalendarPopup;
      return null;
    },
    closest: () => null,
    ownerDocument: {
      defaultView: {
        innerWidth: 1024,
        innerHeight: 768,
        Node: Object,
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      },
      addEventListener() {},
      removeEventListener() {}
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:change') dateChange = ev.detail;
    }
  };

  const dateCtrl = initDatePicker(mockDateEl);
  assert.equal(dateCtrl.getValue(), '2026-10-31');

  // Open calendar
  dateCtrl.open();
  assert.equal(mockCalendarPopup._open, true);
  assert.match(mockContent.innerHTML, /role="grid"/);

  // Set programmatic value
  dateCtrl.setValue('2026-11-15');
  assert.equal(dateCtrl.getValue(), '2026-11-15');
  assert.equal(dateChange.value, '2026-11-15');

  // Clear
  dateCtrl.clear();
  assert.equal(dateCtrl.getValue(), '');
  assert.equal(dateChange.value, '');

  dateCtrl.destroy();
});

test('tagInput and initTagInput manage tags, duplicate rejection, and form integration', () => {
  const tagHtml = tagInput({
    name: 'skills',
    label: 'User Skills',
    tags: ['Design', 'Engineering'],
    maxTags: 4,
  });

  assert.match(tagHtml, /data-sui-tag-input/);
  assert.match(tagHtml, /data-max="4"/);
  assert.match(tagHtml, /data-sui-tag-input-hidden[^>]*value="Design,Engineering"/);
  assert.match(tagHtml, /data-tag-value="Design"/);
  assert.match(tagHtml, /data-tag-value="Engineering"/);
  assert.match(tagHtml, /data-tag-remove/);
  assert.match(tagHtml, /data-tag-status/);

  // Controller interaction
  let tagChange = null;
  const createdTags = ['Design', 'Engineering'];

  const mockInput = {
    value: '',
    disabled: false,
    readOnly: false,
    addEventListener(ev, fn) { if (ev === 'keydown') this._onKey = fn; },
    removeEventListener() {},
    focus() { this._focused = true; },
    insertAdjacentHTML(pos, html) {
      const match = html.match(/data-tag-value="([^"]+)"/);
      if (match) createdTags.push(match[1]);
    }
  };

  const mockHiddenTags = { value: 'Design,Engineering' };
  const mockStatus = { textContent: '' };

  const mockTagbox = {
    dataset: { max: '4' },
    contains() { return true; },
    querySelectorAll(sel) {
      if (sel === '.sx-tag') {
        return createdTags.map(val => ({
          dataset: { tagValue: val },
          querySelector() { return { textContent: val }; },
          remove() {
            const i = createdTags.indexOf(val);
            if (i >= 0) createdTags.splice(i, 1);
          }
        }));
      }
      return [];
    },
    querySelector() { return null; },
    addEventListener(ev, fn) { if (ev === 'click') this._onClick = fn; },
    removeEventListener() {}
  };

  const mockTagEl = {
    dataset: {
      name: 'skills',
      max: '4',
      initialTags: JSON.stringify(['Design', 'Engineering'])
    },
    querySelector(sel) {
      if (sel.includes('tagbox')) return mockTagbox;
      if (sel.includes('field') || sel.includes('input:not')) return mockInput;
      if (sel.includes('hidden')) return mockHiddenTags;
      if (sel.includes('status')) return mockStatus;
      if (sel.includes('input')) return mockInput;
      return null;
    },
    closest: () => null,
    ownerDocument: {
      defaultView: {
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      }
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:change') tagChange = ev.detail;
    }
  };

  const tagCtrl = initTagInput(mockTagEl);
  assert.deepEqual(tagCtrl.getTags(), ['Design', 'Engineering']);

  // Add tag via keydown Enter
  mockInput.value = 'Product';
  mockInput._onKey({ key: 'Enter', preventDefault() {} });
  assert.deepEqual(tagCtrl.getTags(), ['Design', 'Engineering', 'Product']);
  assert.equal(mockHiddenTags.value, 'Design,Engineering,Product');
  assert.equal(mockStatus.textContent, 'Added Product');
  assert.equal(tagChange.added, 'Product');

  // Duplicate tag is rejected
  mockInput.value = 'design';
  mockInput._onKey({ key: 'Enter', preventDefault() {} });
  assert.equal(mockStatus.textContent, 'This tag already exists.');
  assert.deepEqual(tagCtrl.getTags(), ['Design', 'Engineering', 'Product']);

  // Add 4th tag
  mockInput.value = 'Sales';
  mockInput._onKey({ key: 'Enter', preventDefault() {} });
  assert.equal(tagCtrl.getTags().length, 4);

  // 5th tag exceeds maxTags (4)
  mockInput.value = 'Marketing';
  mockInput._onKey({ key: 'Enter', preventDefault() {} });
  assert.equal(mockStatus.textContent, 'Maximum number of tags reached.');
  assert.equal(tagCtrl.getTags().length, 4);

  // Remove tag programmatically
  tagCtrl.removeTag('Product');
  assert.deepEqual(tagCtrl.getTags(), ['Design', 'Engineering', 'Sales']);
  assert.equal(tagChange.removed, 'Product');

  tagCtrl.destroy();
});

test('tabs and initTabs handle variants, keyboard roving tabindex, panel switching, and events', () => {
  // Functional builder
  const html = tabs({
    id: 'demo-tabs',
    ariaLabel: 'Project tabs',
    variant: 'segmented',
    tabs: [
      { id: 'overview', label: 'Overview', icon: 'file-text', content: '<p>Overview</p>' },
      { id: 'settings', label: 'Settings', disabled: true, content: '<p>Settings</p>' },
      { id: 'activity', label: 'Activity', content: '<p>Activity</p>' }
    ],
    activeTabId: 'overview'
  });

  assert.match(html, /data-sui-tabs/);
  assert.match(html, /class="sx-tabs sx-tabs-segmented"/);
  assert.match(html, /role="tablist" aria-label="Project tabs"/);
  assert.match(html, /class="sx-tablist seg"/);
  assert.match(html, /role="tab" id="demo-tabs-tab-overview" class="sx-tab on" aria-controls="demo-tabs-panel-overview" aria-selected="true" tabindex="0"/);
  assert.match(html, /role="tab" id="demo-tabs-tab-settings" class="sx-tab" aria-controls="demo-tabs-panel-settings" aria-selected="false" tabindex="-1" data-tab-id="settings" disabled aria-disabled="true"/);
  assert.match(html, /role="tabpanel" id="demo-tabs-panel-overview" aria-labelledby="demo-tabs-tab-overview" tabindex="0" class="sx-tabpanel" data-panel-id="overview">/);
  assert.match(html, /role="tabpanel" id="demo-tabs-panel-activity" aria-labelledby="demo-tabs-tab-activity" tabindex="0" class="sx-tabpanel" data-panel-id="activity" hidden>/);

  // Variant classes
  assert.match(tabs({ variant: 'pill', tabs: ['A', 'B'] }), /class="sx-tablist pill"/);
  assert.match(tabs({ variant: 'line', tabs: ['A', 'B'] }), /class="sx-tablist line"/);

  // Controller interaction
  let tabChangeEvent = null;
  const mockTab1 = {
    id: 'tab-1',
    dataset: { tabId: 'tab1' },
    disabled: false,
    tabIndex: 0,
    getAttribute(attr) { return attr === 'aria-disabled' ? 'false' : null; },
    setAttribute(k, v) { this[k] = v; },
    classList: {
      _classes: new Set(['on']),
      toggle(c, force) { if (force) this._classes.add(c); else this._classes.delete(c); },
      contains(c) { return this._classes.has(c); }
    },
    focus() { this._focused = true; }
  };

  const mockTab2 = {
    id: 'tab-2',
    dataset: { tabId: 'tab2' },
    disabled: true,
    tabIndex: -1,
    getAttribute(attr) { return attr === 'aria-disabled' ? 'true' : null; },
    setAttribute(k, v) { this[k] = v; },
    classList: {
      _classes: new Set(),
      toggle(c, force) { if (force) this._classes.add(c); else this._classes.delete(c); },
      contains(c) { return this._classes.has(c); }
    },
    focus() { this._focused = true; }
  };

  const mockTab3 = {
    id: 'tab-3',
    dataset: { tabId: 'tab3' },
    disabled: false,
    tabIndex: -1,
    getAttribute(attr) { return attr === 'aria-disabled' ? 'false' : null; },
    setAttribute(k, v) { this[k] = v; },
    classList: {
      _classes: new Set(),
      toggle(c, force) { if (force) this._classes.add(c); else this._classes.delete(c); },
      contains(c) { return this._classes.has(c); }
    },
    focus() { this._focused = true; }
  };

  const mockPanel1 = { id: 'panel-1', dataset: { panelId: 'tab1' }, hidden: false, getAttribute() { return 'tab-1'; } };
  const mockPanel2 = { id: 'panel-2', dataset: { panelId: 'tab2' }, hidden: true, getAttribute() { return 'tab-2'; } };
  const mockPanel3 = { id: 'panel-3', dataset: { panelId: 'tab3' }, hidden: true, getAttribute() { return 'tab-3'; } };

  const tabListBtns = [mockTab1, mockTab2, mockTab3];
  const panels = [mockPanel1, mockPanel2, mockPanel3];

  const mockTablist = {
    querySelectorAll(sel) {
      if (sel === '[role="tab"]') return tabListBtns;
      return [];
    },
    contains(n) { return tabListBtns.includes(n); },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {}
  };

  const mockTabsEl = {
    querySelector(sel) {
      if (sel.includes('tablist')) return mockTablist;
      if (sel.includes('aria-selected="true"')) return mockTab1;
      return null;
    },
    querySelectorAll(sel) {
      if (sel.includes('tabpanel')) return panels;
      return [];
    },
    ownerDocument: {
      defaultView: {
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      }
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:tab:change') tabChangeEvent = ev.detail;
    }
  };

  const ctrl = initTabs(mockTabsEl);
  assert.equal(ctrl.getActiveTab(), 'tab1');

  // Programmatic switch
  ctrl.setActiveTab('tab3');
  assert.equal(ctrl.getActiveTab(), 'tab3');
  assert.equal(mockTab3['aria-selected'], 'true');
  assert.equal(mockTab1['aria-selected'], 'false');
  assert.equal(mockPanel3.hidden, false);
  assert.equal(mockPanel1.hidden, true);
  assert.deepEqual(tabChangeEvent, { id: 'tab3', previousId: 'tab1' });

  // Keyboard navigation skipping disabled tab2
  // Press ArrowLeft on tab3 -> should jump to tab1 (skipping disabled tab2)
  mockTablist._keydown({
    key: 'ArrowLeft',
    preventDefault() {},
    target: { closest: () => mockTab3 }
  });
  assert.equal(ctrl.getActiveTab(), 'tab1');
  assert.equal(mockTab1._focused, true);

  // Press ArrowRight on tab1 -> should jump to tab3
  mockTablist._keydown({
    key: 'ArrowRight',
    preventDefault() {},
    target: { closest: () => mockTab1 }
  });
  assert.equal(ctrl.getActiveTab(), 'tab3');

  ctrl.destroy();
});

test('breadcrumbs renders links, current page, icons, separators, and ellipsis', () => {
  const html = breadcrumbs({
    items: [
      { label: 'Home', href: '/', icon: 'file-text' },
      { label: 'Workspace', href: '/workspace' },
      { label: 'Projects', href: '/projects' },
      { label: 'Website redesign', current: true }
    ],
    separator: 'chevron-right'
  });

  assert.match(html, /<nav aria-label="Breadcrumbs" class="sx-breadcrumbs-nav" data-sui-breadcrumbs>/);
  assert.match(html, /<ol class="sx-breadcrumbs">/);
  assert.match(html, /<a href="\/" class="btn ghost sx-breadcrumb-link">[\s\S]*?Home<\/a>/);
  assert.match(html, /<a href="\/workspace" class="btn ghost sx-breadcrumb-link">Workspace<\/a>/);
  assert.match(html, /<span class="btn ghost sx-breadcrumb-current" aria-current="page">Website redesign<\/span>/);
  assert.match(html, /<li class="sx-breadcrumb-separator" aria-hidden="true" role="presentation">/);

  // Collapsing with maxItems
  const collapsedHtml = breadcrumbs({
    items: [
      { label: 'Root', href: '/' },
      { label: 'Level 1', href: '/1' },
      { label: 'Level 2', href: '/2' },
      { label: 'Level 3', href: '/3' },
      { label: 'Current', current: true }
    ],
    maxItems: 3
  });

  assert.match(collapsedHtml, /class="sx-breadcrumb-ellipsis" aria-label="Show more breadcrumbs">…<\/button>/);
  assert.match(collapsedHtml, /Root<\/a>/);
  assert.match(collapsedHtml, /Level 3<\/a>/);
  assert.match(collapsedHtml, /Current<\/span>/);
});

test('tree, treeItem, treeSection and initTree handle structure, expanding/collapsing, selection, and keyboard navigation', () => {
  // Single tree item
  const leafHtml = treeItem({ id: 'leaf-1', label: 'Overview', icon: 'file-text' });
  assert.match(leafHtml, /<button type="button" class="ti" data-sel data-tree-id="leaf-1"/);
  assert.match(leafHtml, /<span class="sx-tree-label">Overview<\/span>/);

  // Folder tree item with children
  const folderHtml = treeItem({
    id: 'folder-1',
    label: 'Documents',
    children: [
      { id: 'sub-1', label: 'Brief' }
    ],
    expanded: true
  });
  assert.match(folderHtml, /<button type="button" class="ti" data-fold data-tree-id="folder-1" aria-expanded="true"/);
  assert.match(folderHtml, /class="br" data-branch data-branch-for="folder-1"/);
  assert.match(folderHtml, /data-tree-id="sub-1"/);

  // Tree section
  const sectionHtml = treeSection('Projects', leafHtml, { actionIcon: 'plus', actionLabel: 'Add project' });
  assert.match(sectionHtml, /<section class="sx-tree-section">/);
  assert.match(sectionHtml, /<h2 class="sx-tree-section-title">Projects<\/h2>/);
  assert.match(sectionHtml, /class="ibtn" aria-label="Add project"/);

  // Tree container
  const treeHtml = tree([
    { id: 'f1', label: 'Folder', children: [{ id: 'l1', label: 'Child' }] }
  ]);
  assert.match(treeHtml, /<div class="sx-tree" role="tree" aria-label="Navigation tree" data-sui-tree>/);

  // Controller interaction
  let toggleEvent = null;
  let selectEvent = null;

  const mockBranch = {
    hidden: false,
    hasAttribute(attr) { return attr === 'data-branch'; },
    querySelector() { return mockLeafBtn; }
  };

  const mockFolderBtn = {
    dataset: { treeId: 'f1' },
    hasAttribute(attr) { return attr === 'data-fold'; },
    getAttribute(attr) { return attr === 'aria-expanded' ? (mockBranch.hidden ? 'false' : 'true') : null; },
    setAttribute(k, v) { this[k] = v; },
    removeAttribute() {},
    classList: { remove() {}, add() {} },
    closest() { return null; },
    nextElementSibling: mockBranch,
    focus() { this._focused = true; }
  };

  const mockLeafBtn = {
    dataset: { treeId: 'l1' },
    hasAttribute(attr) { return attr === 'data-sel'; },
    getAttribute() { return null; },
    setAttribute(k, v) { this[k] = v; },
    removeAttribute() {},
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); }
    },
    closest() { return mockBranch; },
    focus() { this._focused = true; }
  };

  const allTreeBtns = [mockFolderBtn, mockLeafBtn];

  const mockTreeEl = {
    querySelectorAll(sel) {
      if (sel.includes('button.ti')) return allTreeBtns;
      return [];
    },
    querySelector(sel) {
      if (sel.includes('f1')) return mockFolderBtn;
      if (sel.includes('l1')) return mockLeafBtn;
      if (sel.includes('.on')) return mockLeafBtn.classList.contains('on') ? mockLeafBtn : null;
      return null;
    },
    contains(n) { return allTreeBtns.includes(n); },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    ownerDocument: {
      defaultView: {
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      }
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:tree:toggle') toggleEvent = ev.detail;
      if (ev.type === 'sui:tree:select') selectEvent = ev.detail;
    }
  };

  const treeCtrl = initTree(mockTreeEl);

  // Toggle folder
  treeCtrl.collapse('f1');
  assert.equal(mockBranch.hidden, true);
  assert.deepEqual(toggleEvent, { id: 'f1', expanded: false });

  treeCtrl.expand('f1');
  assert.equal(mockBranch.hidden, false);
  assert.deepEqual(toggleEvent, { id: 'f1', expanded: true });

  // Select item
  treeCtrl.select('l1');
  assert.equal(mockLeafBtn.dataset.active, 'true');
  assert.equal(mockLeafBtn['aria-current'], 'page');
  assert.deepEqual(selectEvent.id, 'l1');
  assert.equal(treeCtrl.getSelected(), 'l1');

  treeCtrl.destroy();
});

test('listRow renders variants, choices, links, switches, and avoids invalid interactive nesting', () => {
  // Basic row
  const basic = listRow({ title: 'Requirements Writing' });
  assert.match(basic, /^<div class="lrow sx-list-row"/);
  assert.match(basic, /<span class="sx-list-title">Requirements Writing<\/span>/);

  // Plain variant
  const plain = listRow({ variant: 'plain', title: 'Plain item' });
  assert.match(plain, /class="lrow sx-list-row sx-list-row-plain"/);

  // Description variant
  const desc = listRow({ variant: 'description', title: 'With details', description: 'Helpful context' });
  assert.match(desc, /<span class="sx-help">Helpful context<\/span>/);

  // Icon variant
  const withIcon = listRow({ variant: 'icon', title: 'Document' });
  assert.match(withIcon, /<span class="sx-list-leading">/);

  // Switch variant
  const withSwitch = listRow({ variant: 'switch', title: 'Auto sync', checked: true });
  assert.match(withSwitch, /<button type="button" class="sw" role="switch" aria-checked="true" data-switch aria-label="Auto sync"><i><\/i><\/button>/);
  // Ensure the outer element is a div, NOT an interactive button/link!
  assert.match(withSwitch, /^<div class="lrow sx-list-row"/);

  // Navigation variant with link
  const nav = listRow({ variant: 'navigation', title: 'Go to settings', href: '/settings' });
  assert.match(nav, /^<a class="lrow sx-list-row sx-list-link" href="\/settings"/);
  assert.match(nav, /<span class="sx-list-chevron" aria-hidden="true">/);

  // Checkbox and radio choices
  const cb = listRow({ variant: 'checkbox', title: 'Select option', name: 'choice', value: 'opt1', checked: true });
  assert.match(cb, /^<label class="lrow sx-list-row sx-list-select sx-choice"/);
  assert.match(cb, /<input type="checkbox" name="choice" value="opt1" checked aria-label="Select Select option">/);

  const rad = listRow({ variant: 'radio', title: 'Radio option', name: 'choice', value: 'opt2' });
  assert.match(rad, /^<label class="lrow sx-list-row sx-list-select sx-choice"/);
  assert.match(rad, /<input type="radio" name="choice" value="opt2" aria-label="Select Radio option">/);

  // Disabled row
  const dis = listRow({ title: 'Inactive', disabled: true });
  assert.match(dis, /class="lrow sx-list-row off" aria-disabled="true"/);
});

test('toolbar renders orientations, groups, separators, and items', () => {
  // Horizontal toolbar
  const tbH = toolbar({
    ariaLabel: 'Editor actions',
    orientation: 'horizontal',
    size: 'base',
    items: [
      { label: 'Cut', variant: 'ghost' },
      { label: 'Copy', variant: 'ghost' },
      'separator',
      { icon: 'trash', ariaLabel: 'Delete' }
    ]
  });

  assert.match(tbH, /<div role="toolbar" class="sx-toolbar sx-toolbar-horizontal sx-toolbar-base" aria-label="Editor actions" aria-orientation="horizontal" data-sui-toolbar>/);
  assert.match(tbH, /Cut<\/button>/);
  assert.match(tbH, /<div class="sx-toolbar-separator" role="separator" aria-orientation="vertical"><\/div>/);
  assert.match(tbH, /data-sui-icon-button/);

  // Vertical toolbar
  const tbV = toolbar({
    ariaLabel: 'Canvas controls',
    orientation: 'vertical',
    size: 'sm',
    items: [
      '<output aria-live="polite">100%</output>',
      'separator',
      { icon: 'plus', ariaLabel: 'Zoom in' }
    ]
  });

  assert.match(tbV, /class="sx-toolbar sx-toolbar-vertical sx-toolbar-sm" aria-label="Canvas controls" aria-orientation="vertical"/);
  assert.match(tbV, /<div class="sx-toolbar-separator" role="separator" aria-orientation="horizontal"><\/div>/);
  assert.match(tbV, /<output aria-live="polite">100%<\/output>/);
});

test('collapsible and initCollapsible handle trigger toggle, animation/reduced-motion, and events', () => {
  const html = collapsible({
    id: 'plan-col',
    trigger: 'Execution plan',
    content: '<p>Plan details</p>',
    open: false
  });

  assert.match(html, /<div class="sx-collapsible" data-sui-collapsible id="plan-col" data-open="false">/);
  assert.match(html, /<button type="button" class="sx-collapsible-trigger btn ghost" data-collapsible-trigger aria-expanded="false" aria-controls="plan-col-content">/);
  assert.match(html, /<span class="sx-collapsible-trigger-text">Execution plan<\/span>/);
  assert.match(html, /<div id="plan-col-content" class="sx-collapsible-content" data-collapsible-content hidden>/);

  // Controller interaction
  let toggleDetail = null;

  const mockTrigger = {
    getAttribute(attr) { return attr === 'aria-expanded' ? 'false' : null; },
    setAttribute(k, v) { this[k] = v; },
    addEventListener(ev, fn) { if (ev === 'click') this._onClick = fn; },
    removeEventListener() {}
  };

  const mockContent = {
    hidden: true,
    style: {},
    scrollHeight: 120,
    getBoundingClientRect: () => ({ height: 0 }),
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {}
  };

  const mockColEl = {
    dataset: { open: 'false' },
    querySelector(sel) {
      if (sel.includes('trigger')) return mockTrigger;
      if (sel.includes('content')) return mockContent;
      return null;
    },
    ownerDocument: {
      defaultView: {
        matchMedia: () => ({ matches: true }), // reduced motion in test mock for instant toggle
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      }
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:collapsible:toggle') toggleDetail = ev.detail;
    }
  };

  const colCtrl = initCollapsible(mockColEl);
  assert.equal(colCtrl.isOpen(), false);

  // Toggle open
  colCtrl.toggle();
  assert.equal(colCtrl.isOpen(), true);
  assert.equal(mockTrigger['aria-expanded'], 'true');
  assert.equal(mockContent.hidden, false);
  assert.deepEqual(toggleDetail, { open: true });

  // Toggle closed
  colCtrl.setOpen(false);
  assert.equal(colCtrl.isOpen(), false);
  assert.equal(mockTrigger['aria-expanded'], 'false');
  assert.equal(mockContent.hidden, true);
  assert.deepEqual(toggleDetail, { open: false });

  colCtrl.destroy();
});

test('table and initTable handle columns, sorting, single/multiple selection, row click, and empty state', () => {
  // Functional builder
  const html = table({
    id: 'users-table',
    columns: [
      { key: 'name', label: 'Full name', sortable: true, align: 'left', width: 200 },
      { key: 'role', label: 'Role', align: 'center' },
      { key: 'status', label: 'Status', render: val => `<span class="badge">${val}</span>` }
    ],
    rows: [
      { id: 'u1', name: 'Alice Smith', role: 'Engineer', status: 'Active' },
      { id: 'u2', name: 'Bob Jones', role: 'Designer', status: 'Invited' }
    ],
    selectionMode: 'multiple',
    selectedKeys: ['u1'],
    sortColumn: 'name',
    sortDirection: 'ascending',
    stickyHeader: true,
    compact: true,
    fixed: true,
    rowAction: 'open-profile'
  });

  assert.match(html, /<div class="sx-table-wrap compact" data-sui-table id="users-table"/);
  assert.match(html, /<table class="sx-table fixed" aria-label="Data table">/);
  assert.match(html, /<thead class="sticky">/);
  assert.match(html, /<input type="checkbox" data-table-select-all aria-label="Select all rows">/);
  assert.match(html, /<th scope="col" style="text-align:left;width:200px;" aria-sort="ascending">/);
  assert.match(html, /data-table-sort="name"/);
  assert.match(html, /<tr data-row-key="u1" class="selected" data-table-row-action="open-profile"/);
  assert.match(html, /<input type="checkbox" data-table-select-row data-row-key="u1" aria-label="Select row" checked>/);
  assert.match(html, /<span class="badge">Active<\/span>/);

  // Empty state
  const emptyHtml = table({ columns: [{ key: 'id', label: 'ID' }], rows: [] });
  assert.match(emptyHtml, /<td colspan="1" class="sx-empty-cell">No records to display.<\/td>/);

  // Controller interaction
  let selectDetail = null;
  let sortDetail = null;
  let rowClickDetail = null;

  const row1Input = { dataset: { rowKey: 'u1' }, checked: true, closest: () => row1El };
  const row2Input = { dataset: { rowKey: 'u2' }, checked: false, closest: () => row2El };
  const allRowInputs = [row1Input, row2Input];

  const row1El = {
    dataset: { rowKey: 'u1', tableRowAction: 'open-profile' },
    classList: { toggle(c, val) { if (val) this._on = true; else this._on = false; } }
  };
  const row2El = {
    dataset: { rowKey: 'u2', tableRowAction: 'open-profile' },
    classList: { toggle(c, val) { if (val) this._on = true; else this._on = false; } }
  };

  const selectAllInput = { checked: false, indeterminate: false };
  const sortBtn = { dataset: { tableSort: 'name' } };
  const sortTh = {
    setAttribute(k, v) { this[k] = v; },
    querySelector() { return sortBtn; }
  };

  const mockTableEl = {
    dataset: {
      suiTableConfig: JSON.stringify({
        selectionMode: 'multiple',
        sortColumn: 'name',
        sortDirection: 'ascending'
      })
    },
    querySelector(sel) {
      if (sel === 'table') return {};
      if (sel.includes('select-all')) return selectAllInput;
      return null;
    },
    querySelectorAll(sel) {
      if (sel.includes('data-table-select-row')) return allRowInputs;
      if (sel.includes('th[data-table-sort]') || sel.includes('th:has')) return [sortTh];
      return [];
    },
    contains(target) {
      return target === sortBtn || target === row1El || target === row2El;
    },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    ownerDocument: {
      defaultView: {
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      }
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:table:select') selectDetail = ev.detail;
      if (ev.type === 'sui:table:sort') sortDetail = ev.detail;
      if (ev.type === 'sui:table:rowclick') rowClickDetail = ev.detail;
    }
  };

  const tableCtrl = initTable(mockTableEl);
  tableCtrl.setRows([
    { id: 'u1', name: 'Alice Smith' },
    { id: 'u2', name: 'Bob Jones' }
  ]);

  // Initial selection
  assert.deepEqual(tableCtrl.getSelection(), ['u1']);

  // Set selection programmatically
  tableCtrl.setSelection(['u1', 'u2']);
  assert.deepEqual(tableCtrl.getSelection(), ['u1', 'u2']);
  assert.equal(selectAllInput.checked, true);

  // Sort
  tableCtrl.setSort('name', 'descending');
  assert.equal(sortTh['aria-sort'], 'descending');
  assert.deepEqual(sortDetail, { column: 'name', direction: 'descending' });

  // Row click
  mockTableEl._click({
    target: {
      closest(sel) {
        if (sel === '[data-table-row-action]') return row1El;
        return null;
      }
    }
  });
  assert.equal(rowClickDetail.rowKey, 'u1');
  assert.equal(rowClickDetail.action, 'open-profile');

  tableCtrl.destroy();
});

test('pagination and initPagination manage pages, total items, page size, bounds, and events', () => {
  // Functional builder
  const html = pagination({
    page: 2,
    pageSize: 10,
    totalItems: 45,
    pageSizeOptions: [5, 10, 25],
    showSummary: true
  });

  assert.match(html, /<nav class="sx-pagination" aria-label="Pagination" data-sui-pagination/);
  assert.match(html, /<select class="sx-select" data-page-size aria-label="Rows per page">/);
  assert.match(html, /<option value="10" selected>10<\/option>/);
  assert.match(html, /<span class="sx-page-summary" data-page-summary>Page 2 of 5 · 45 items<\/span>/);
  assert.match(html, /data-page-step="-1"/);
  assert.match(html, /data-page-step="1"/);
  assert.match(html, /data-page-number="2" aria-label="Page 2" aria-current="page"/);

  // Controller interaction
  let changeDetail = null;
  const prevBtn = { disabled: false };
  const nextBtn = { disabled: false };
  const numbersEl = { innerHTML: '' };
  const summaryEl = { textContent: '' };
  const selectEl = { value: '10' };

  const mockPagEl = {
    dataset: {
      suiPaginationConfig: JSON.stringify({
        page: 2,
        pageSize: 10,
        totalItems: 45,
        totalPages: 5
      })
    },
    querySelector(sel) {
      if (sel.includes('-1')) return prevBtn;
      if (sel.includes('1') && sel.includes('step')) return nextBtn;
      if (sel.includes('numbers')) return numbersEl;
      if (sel.includes('summary')) return summaryEl;
      if (sel.includes('size')) return selectEl;
      return null;
    },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    contains() { return true; },
    ownerDocument: {
      defaultView: {
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      }
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:pagination:change') changeDetail = ev.detail;
    }
  };

  const pagCtrl = initPagination(mockPagEl);
  assert.equal(pagCtrl.getPage(), 2);
  assert.equal(pagCtrl.getPageSize(), 10);
  assert.equal(pagCtrl.getTotal(), 45);

  // Step next page
  mockPagEl._click({
    target: {
      closest(sel) {
        if (sel === '[data-page-step]') return { dataset: { pageStep: '1' } };
        return null;
      }
    },
    preventDefault() {}
  });

  assert.equal(pagCtrl.getPage(), 3);
  assert.deepEqual(changeDetail, { page: 3, pageSize: 10, totalItems: 45 });

  // Set total and bounds
  pagCtrl.setTotal(100);
  assert.equal(pagCtrl.getTotal(), 100);

  pagCtrl.setPage(10);
  assert.equal(pagCtrl.getPage(), 10);

  pagCtrl.destroy();
});

test('chart and initChart render SVG lines, bars, donuts, hover targets, and dispatch events', () => {
  // Line chart
  const lineHtml = chart({
    type: 'line',
    label: 'Revenue trends',
    data: [
      { label: 'Jan', rev: 100 },
      { label: 'Feb', rev: 150 },
      { label: 'Mar', rev: 220 }
    ],
    series: [{ key: 'rev', label: 'Revenue' }]
  });

  assert.match(lineHtml, /data-sui-chart/);
  assert.match(lineHtml, /<svg class="sc-svg"/);
  assert.match(lineHtml, /role="img" aria-label="Revenue trends"/);
  assert.match(lineHtml, /<title>Revenue trends<\/title>/);
  assert.match(lineHtml, /Jan<\/text>/);
  assert.match(lineHtml, /Mar<\/text>/);

  // Donut chart
  const donutHtml = chart({
    type: 'donut',
    label: 'Budget share',
    data: [
      { label: 'Engineering', val: 60 },
      { label: 'Marketing', val: 40 }
    ],
    series: [{ key: 'val' }]
  });

  assert.match(donutHtml, /data-sc-segment="0"/);
  assert.match(donutHtml, /data-sc-segment="1"/);
  assert.match(donutHtml, /class="sc-total"/);

  // Bar chart
  const barHtml = chart({
    type: 'bar',
    label: 'Sales',
    data: [{ label: 'Q1', s: 80 }],
    series: [{ key: 's' }]
  });
  assert.match(barHtml, /data-sc-index="0"/);

  // Loading state
  const loadingHtml = chart({ state: 'loading' });
  assert.match(loadingHtml, /role="status" aria-label="Loading chart"/);

  // Controller interaction
  const mockChartEl = {
    clientWidth: 480,
    dataset: {
      chartConfig: JSON.stringify({
        type: 'line',
        label: 'Metrics',
        data: [{ label: 'A', v: 10 }],
        series: [{ key: 'v', label: 'Val' }]
      })
    },
    innerHTML: '',
    querySelectorAll() { return []; },
    querySelector() { return null; },
    addEventListener() {},
    removeEventListener() {},
    ownerDocument: {
      createElement: (tag) => ({
        tagName: tag,
        className: '',
        style: {},
        setAttribute() {},
        addEventListener() {},
        append() {}
      }),
      defaultView: {
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      }
    },
    append() {}
  };

  const chartCtrl = initChart(mockChartEl);
  assert.match(mockChartEl.innerHTML, /<svg class="sc-svg"/);

  chartCtrl.setData([{ label: 'B', v: 20 }]);
  assert.match(mockChartEl.innerHTML, /B<\/text>/);

  chartCtrl.destroy();
});

test('wire renders bezier, step, straight, dashed variants, and endpoints', () => {
  // Bezier default
  const bz = wire({
    variant: 'bezier',
    from: { x: 10, y: 20 },
    to: { x: 100, y: 80 }
  });
  assert.match(bz, /<svg class="wires sx-wire"/);
  assert.match(bz, /<path d="M10 20 C55 20 55 80 100 80"/);
  assert.match(bz, /<circle cx="10" cy="20" r="3"\/>/);
  assert.match(bz, /<circle cx="100" cy="80" r="3"\/>/);

  // Step curve
  const st = wire({
    variant: 'step',
    from: { x: 10, y: 20 },
    to: { x: 100, y: 80 }
  });
  assert.match(st, /<path d="M10 20 H55 V80 H100"/);

  // Straight
  const str = wire({
    variant: 'straight',
    from: { x: 10, y: 20 },
    to: { x: 100, y: 80 }
  });
  assert.match(str, /<path d="M10 20 L100 80"/);

  // Dashed
  const dash = wire({ variant: 'dashed' });
  assert.match(dash, /class="wires sx-wire dashed"/);

  // Positional string
  assert.match(wire('step'), /H120 V60 H228/);
});

test('canvas and initCanvas handle viewport, zoom, pan, toolbar, and events', () => {
  // Functional builder
  const html = canvas({
    id: 'agent-canvas',
    content: '<div class="card">Start node</div>',
    zoom: 1.25,
    pan: { x: 30, y: 50 },
    toolbar: true
  });

  assert.match(html, /<div class="ds-canvas sx-canvas dotted" data-sui-canvas id="agent-canvas" data-zoom="1.25" data-pan-x="30" data-pan-y="50"/);
  assert.match(html, /<div class="ds-canvas-viewport sx-canvas-viewport" tabindex="0" role="region"/);
  assert.match(html, /<div class="ds-canvas-world sx-canvas-world" style="transform:translate\(30px,50px\) scale\(1.25\);"><div class="card">Start node<\/div><\/div>/);
  assert.match(html, /class="sx-toolbar[^"]*sx-toolbar-rail"/);
  assert.match(html, /data-canvas-zoom="-0.1"/);
  assert.match(html, /data-canvas-zoom="0.1"/);
  assert.match(html, /data-canvas-zoom="fit"/);

  // Controller interaction
  let canvasChangeDetail = null;
  const mockWorld = {
    style: {},
    scrollWidth: 500,
    scrollHeight: 200
  };

  const mockViewport = {
    clientWidth: 600,
    clientHeight: 400,
    classList: { add() {}, remove() {} },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {}
  };

  const mockOutput = { textContent: '100%' };

  const mockCanvasEl = {
    dataset: {
      zoom: '1',
      panX: '16',
      panY: '30',
      minZoom: '0.25',
      maxZoom: '2'
    },
    style: {},
    querySelector(sel) {
      if (sel.includes('viewport')) return mockViewport;
      if (sel.includes('world')) return mockWorld;
      if (sel === 'output') return mockOutput;
      return null;
    },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    contains() { return true; },
    ownerDocument: {
      defaultView: {
        CustomEvent: class { constructor(t, opts) { this.type = t; this.detail = opts?.detail; } }
      }
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:canvas:change') canvasChangeDetail = ev.detail;
    }
  };

  const canvasCtrl = initCanvas(mockCanvasEl);
  assert.equal(canvasCtrl.getZoom(), 1);
  assert.deepEqual(canvasCtrl.getPan(), { x: 16, y: 30 });

  // Programmatic pan
  canvasCtrl.setPan({ x: 50, y: 80 });
  assert.deepEqual(canvasCtrl.getPan(), { x: 50, y: 80 });
  assert.equal(canvasChangeDetail.pan.x, 50);

  // Programmatic zoom
  canvasCtrl.setZoom(1.5);
  assert.equal(canvasCtrl.getZoom(), 1.5);
  assert.equal(canvasChangeDetail.zoom, 1.5);

  // Toolbar zoom button interaction
  mockCanvasEl._click({
    target: {
      closest(sel) {
        if (sel === '[data-canvas-zoom]') return { dataset: { canvasZoom: '-0.1' } };
        return null;
      }
    },
    preventDefault() {}
  });
  assert.equal(canvasCtrl.getZoom(), 1.4);

  canvasCtrl.destroy();
});

test('fileCard and initFileCard manage preview toggle, actions, and remove events', () => {
  const cardMarkup = fileCard({
    id: 'fc1',
    name: 'Design brief.pdf',
    size: '840 KB',
    type: 'document'
  });
  assert.match(cardMarkup, /class="fcard sx-file-card/);
  assert.match(cardMarkup, /id="fc1"/);
  assert.match(cardMarkup, /Design brief\.pdf/);
  assert.match(cardMarkup, /840 KB/);
  assert.match(cardMarkup, /data-file-type="document"/);

  const imgMarkup = fileCard({
    name: 'photo.png',
    preview: 'https://example.com/photo.png'
  });
  assert.match(imgMarkup, /<img src="https:\/\/example\.com\/photo\.png" alt="photo\.png"/);

  const removableMarkup = fileCard({
    name: 'draft.txt',
    removable: true
  });
  assert.match(removableMarkup, /data-file-remove/);

  // Controller tests
  let toggleDetail = null;
  let removeDetail = null;

  const mockPreviewBtn = {
    getAttribute(attr) { return this[attr] || 'false'; },
    setAttribute(attr, val) { this[attr] = String(val); },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    querySelector() { return { textContent: 'Design brief.pdf' }; }
  };

  const mockPreviewBody = {
    hasAttribute(attr) { return attr in this; },
    setAttribute(attr) { this[attr] = true; },
    removeAttribute(attr) { delete this[attr]; }
  };

  const mockRemoveBtn = {
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {}
  };

  const mockCardEl = {
    id: 'fc1',
    dataset: { fileId: 'fc1' },
    querySelector(sel) {
      if (sel.includes('preview-body')) return mockPreviewBody;
      if (sel.includes('preview')) return mockPreviewBtn;
      if (sel.includes('remove')) return mockRemoveBtn;
      return null;
    },
    dispatchEvent(ev) {
      if (ev.type === 'sui:file:toggle') toggleDetail = ev.detail;
      if (ev.type === 'sui:file:remove') removeDetail = ev.detail;
    }
  };

  const cardCtrl = initFileCard(mockCardEl);
  assert.equal(cardCtrl.isExpanded(), false);

  // Expand
  cardCtrl.toggle(true);
  assert.equal(cardCtrl.isExpanded(), true);
  assert.deepEqual(toggleDetail, { id: 'fc1', name: 'Design brief.pdf', expanded: true });

  // Collapse
  cardCtrl.toggle(false);
  assert.equal(cardCtrl.isExpanded(), false);
  assert.deepEqual(toggleDetail, { id: 'fc1', name: 'Design brief.pdf', expanded: false });

  // Remove button click
  mockRemoveBtn._click({ preventDefault() {}, stopPropagation() {} });
  assert.deepEqual(removeDetail, { id: 'fc1', name: 'Design brief.pdf' });

  cardCtrl.destroy();
});

test('message and initMessage support user/agent/comment roles and emit action events', () => {
  // Outgoing user message with attachment
  const userMsg = message({
    id: 'm1',
    sender: { name: 'Jordan Lee', isSelf: true },
    content: 'Please review this file.',
    status: 'sent',
    attachments: [{ name: 'spec.pdf' }]
  });
  assert.match(userMsg, /sx-message-outgoing/);
  assert.match(userMsg, /<strong>You<\/strong>/);
  assert.match(userMsg, /Please review this file\./);
  assert.match(userMsg, /sx-message-status.*Message sent/);
  assert.match(userMsg, /spec\.pdf/);

  // Agent message
  const agentMsg = message({
    id: 'm2',
    role: 'agent',
    sender: { name: 'Sesama Agent', isAgent: true },
    content: 'Review complete. All 3 milestones confirmed.',
    actions: ['copy', 'retry']
  });
  assert.match(agentMsg, /sx-agent-message/);
  assert.match(agentMsg, /<span class="badge">AI<\/span>/);
  assert.match(agentMsg, /data-message-action="copy"/);
  assert.match(agentMsg, /data-message-action="retry"/);

  // Thinking message
  const thinkingMsg = message({ status: 'thinking' });
  assert.match(thinkingMsg, /<span class="sx-thinking-text">Thinking…<\/span>/);

  // Comment message
  const commentMsg = message({ role: 'comment', content: 'Inline team note.' });
  assert.match(commentMsg, /sx-message-comment/);
  assert.match(commentMsg, /sx-message-comment-body/);

  // Controller tests
  let copyDetail = null;
  let retryDetail = null;
  let customActionDetail = null;

  const mockContentEl = { textContent: 'Review complete.' };
  const mockStatusEl = { textContent: '' };

  const mockMsgEl = {
    id: 'm2',
    dataset: { messageId: 'm2' },
    querySelector(sel) {
      if (sel.includes('content')) return mockContentEl;
      if (sel.includes('status')) return mockStatusEl;
      return null;
    },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    dispatchEvent(ev) {
      if (ev.type === 'sui:message:copy') copyDetail = ev.detail;
      if (ev.type === 'sui:message:retry') retryDetail = ev.detail;
      if (ev.type === 'sui:message:action') customActionDetail = ev.detail;
    }
  };

  const msgCtrl = initMessage(mockMsgEl);

  // Copy click
  mockMsgEl._click({
    target: {
      closest(sel) {
        if (sel === '[data-message-action]') return { dataset: { messageAction: 'copy' } };
        return null;
      }
    }
  });
  assert.deepEqual(copyDetail, { id: 'm2', text: 'Review complete.' });

  // Retry click
  mockMsgEl._click({
    target: {
      closest(sel) {
        if (sel === '[data-message-action]') return { dataset: { messageAction: 'retry' } };
        return null;
      }
    }
  });
  assert.deepEqual(retryDetail, { id: 'm2' });

  // Custom action click
  mockMsgEl._click({
    target: {
      closest(sel) {
        if (sel === '[data-message-action]') return { dataset: { messageAction: 'flag' } };
        return null;
      }
    }
  });
  assert.deepEqual(customActionDetail, { id: 'm2', action: 'flag' });

  // Setters
  msgCtrl.setStatus('Sent');
  assert.equal(mockStatusEl.textContent, 'Sent');
  msgCtrl.setContent('New text');
  assert.equal(mockContentEl.textContent, 'New text');

  msgCtrl.destroy();
});

test('toolCall and initToolCall represent operation states and toggle details', () => {
  const toolMarkup = toolCall({
    id: 'tc1',
    name: 'Search documents',
    state: 'completed',
    input: 'Latest brief',
    output: { count: 3 },
    duration: '12s'
  });
  assert.match(toolMarkup, /class="sx-tool-call/);
  assert.match(toolMarkup, /Search documents/);
  assert.match(toolMarkup, /Completed · 12s/);
  assert.match(toolMarkup, /<strong>Input<\/strong><pre>Latest brief<\/pre>/);
  assert.match(toolMarkup, /<strong>Output<\/strong><pre>[\s\S]*(&quot;|")count(&quot;|"): 3[\s\S]*<\/pre>/);

  const failedTool = toolCall({
    name: 'Run build',
    state: 'failed',
    error: 'Exit code 1'
  });
  assert.match(failedTool, /Failed/);
  assert.match(failedTool, /<strong>Error<\/strong><pre class="sx-tool-error">Exit code 1<\/pre>/);

  // Controller tests
  let toolToggleDetail = null;
  const mockMeta = { textContent: 'Completed' };
  const mockBody = { innerHTML: '' };

  const mockToolEl = {
    id: 'tc1',
    dataset: { toolId: 'tc1', state: 'completed' },
    open: false,
    querySelector(sel) {
      if (sel.includes('meta')) return mockMeta;
      if (sel.includes('body')) return mockBody;
      if (sel.includes('name')) return { textContent: 'Search documents' };
      return null;
    },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    dispatchEvent(ev) {
      if (ev.type === 'sui:tool:toggle') toolToggleDetail = ev.detail;
    }
  };

  const toolCtrl = initToolCall(mockToolEl);
  assert.equal(toolCtrl.isOpen(), false);

  toolCtrl.setOpen(true);
  assert.equal(toolCtrl.isOpen(), true);

  mockToolEl._toggle();
  assert.deepEqual(toolToggleDetail, { id: 'tc1', name: 'Search documents', open: true });

  // Update state
  toolCtrl.setState('failed', { error: 'Network timeout', duration: '5s' });
  assert.equal(mockToolEl.dataset.state, 'failed');
  assert.equal(mockMeta.textContent, 'Failed · 5s');
  assert.match(mockBody.innerHTML, /Network timeout/);

  toolCtrl.destroy();
});

test('agentRun and initAgentRun render composite steps and emit toggle events', () => {
  const runMarkup = agentRun({
    id: 'ar1',
    title: 'Research task',
    state: 'completed',
    duration: '8s',
    steps: [
      { type: 'thinking', title: 'Reviewing scope', detail: 'Found relevant guidelines.' },
      { type: 'tool', name: 'Query database', input: 'SELECT *', output: '2 rows' },
      { type: 'progress', title: 'Synthesizing report' }
    ]
  });
  assert.match(runMarkup, /class="sx-agent-run/);
  assert.match(runMarkup, /Research task/);
  assert.match(runMarkup, /Completed · 8s/);
  assert.match(runMarkup, /class="sx-thinking-step/);
  assert.match(runMarkup, /class="sx-tool-call/);
  assert.match(runMarkup, /class="sx-run-step/);

  // Controller tests
  let runToggleDetail = null;
  const mockStepsContainer = { innerHTML: '' };
  const mockRunMeta = { textContent: 'Completed · 8s' };

  const mockRunEl = {
    id: 'ar1',
    dataset: { runId: 'ar1', state: 'completed' },
    open: false,
    querySelector(sel) {
      if (sel.includes('run-steps')) return mockStepsContainer;
      if (sel.includes('meta')) return mockRunMeta;
      if (sel.includes('summary > span:first-child')) return { textContent: 'Research task' };
      return null;
    },
    querySelectorAll() { return []; },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    dispatchEvent(ev) {
      if (ev.type === 'sui:run:toggle') runToggleDetail = ev.detail;
    }
  };

  const runCtrl = initAgentRun(mockRunEl);
  assert.equal(runCtrl.isOpen(), false);

  runCtrl.setOpen(true);
  assert.equal(runCtrl.isOpen(), true);

  mockRunEl._toggle({ target: mockRunEl });
  assert.deepEqual(runToggleDetail, { id: 'ar1', title: 'Research task', open: true });

  runCtrl.setState('running', '10s');
  assert.equal(mockRunEl.dataset.state, 'running');
  assert.equal(mockRunMeta.textContent, 'Running · 10s');

  runCtrl.setSteps([{ type: 'progress', title: 'Finalizing' }]);
  assert.match(mockStepsContainer.innerHTML, /Finalizing/);

  runCtrl.destroy();
});

test('composer and initComposer handle input, attachments, state switches and send/stop intents', () => {
  const compEmpty = composer({ placeholder: 'Ask a question…' });
  assert.match(compEmpty, /class="composer sx-composer/);
  assert.match(compEmpty, /data-state="empty"/);
  assert.match(compEmpty, /<button type="button" class="send" data-send disabled/);
  assert.match(compEmpty, /data-composer-attachments hidden/);

  const compThinking = composer({ state: 'thinking' });
  assert.match(compThinking, /data-state="thinking"/);
  assert.match(compThinking, /data-composer-stop/);
  assert.match(compThinking, /composer-stop-square/);

  // Controller tests
  let sendPayload = null;
  let stopPayload = null;
  let micPayload = null;

  const mockTextarea = {
    value: 'Review brief',
    style: {},
    scrollHeight: 72,
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    focus() {}
  };

  const mockSendBtn = {
    disabled: false,
    innerHTML: '',
    setAttribute(attr, val) { this[attr] = val; },
    removeAttribute(attr) { delete this[attr]; }
  };

  const mockMicBtn = {
    getAttribute(attr) { return this[attr] || 'false'; },
    setAttribute(attr, val) { this[attr] = String(val); }
  };

  const mockAttachmentsContainer = {
    children: [],
    querySelectorAll() { return this.children; },
    replaceChildren() { this.children = []; },
    append(child) { this.children.push(child); },
    setAttribute(attr) { this[attr] = true; },
    removeAttribute(attr) { delete this[attr]; }
  };

  const mockComposerEl = {
    id: 'c1',
    dataset: { composerId: 'c1', state: 'ready' },
    querySelector(sel) {
      if (sel === 'textarea') return mockTextarea;
      if (sel.includes('attachments')) return mockAttachmentsContainer;
      if (sel.includes('send') || sel.includes('stop')) return mockSendBtn;
      if (sel.includes('mic')) return mockMicBtn;
      if (sel === 'select[name="context"]') return { value: 'Base' };
      if (sel === 'select[name="model"]') return { value: 'GPT-6.1 Sol' };
      return null;
    },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    dispatchEvent(ev) {
      if (ev.type === 'sui:composer:send') sendPayload = ev.detail;
      if (ev.type === 'sui:composer:stop') stopPayload = ev.detail;
      if (ev.type === 'sui:composer:mic') micPayload = ev.detail;
    }
  };

  const composerCtrl = initComposer(mockComposerEl);
  assert.equal(composerCtrl.getValue(), 'Review brief');

  // Value setter and auto-resize
  composerCtrl.setValue('Updated message');
  assert.equal(mockTextarea.value, 'Updated message');
  assert.equal(mockTextarea.style.height, '72px');

  // Trigger send via click
  mockComposerEl._click({
    target: {
      closest(sel) {
        if (sel === '[data-send]') return mockSendBtn;
        return null;
      }
    },
    stopPropagation() {}
  });

  assert.deepEqual(sendPayload, {
    text: 'Updated message',
    attachments: [],
    context: 'Base',
    model: 'GPT-6.1 Sol'
  });
  assert.equal(mockTextarea.value, '');

  // Mic click
  mockComposerEl._click({
    target: {
      closest(sel) {
        if (sel === '[data-composer-mic]') return mockMicBtn;
        return null;
      }
    },
    stopPropagation() {}
  });
  assert.deepEqual(micPayload, { active: true });
  assert.equal(mockMicBtn['aria-pressed'], 'true');

  // State toggle to thinking
  composerCtrl.setState('thinking');
  assert.equal(mockComposerEl.dataset.state, 'thinking');
  assert.equal(mockSendBtn['data-composer-stop'], '');

  // Stop click
  mockComposerEl._click({
    target: {
      closest(sel) {
        if (sel === '[data-composer-stop]') return mockSendBtn;
        return null;
      }
    },
    stopPropagation() {}
  });
  assert.deepEqual(stopPayload, { id: 'c1' });

  // State toggle back to empty
  composerCtrl.setState('empty');
  assert.equal(mockComposerEl.dataset.state, 'empty');
  assert.equal(mockSendBtn['data-send'], '');
  assert.equal(mockSendBtn.disabled, true);

  composerCtrl.destroy();
});

test('appShell builder and initAppShell controller manage sidebar collapse, peek, and theme', () => {
  const shellMarkup = appShell({
    header: '<header class="demo-header">Header</header>',
    sidebar: '<nav class="sb-sidebar">Sidebar</nav>',
    content: '<main class="demo-main">Content</main>',
    footer: '<footer class="demo-footer">Footer</footer>',
    collapsed: true,
    classes: 'custom-shell'
  });

  assert.match(shellMarkup, /data-sui-app-shell/);
  assert.match(shellMarkup, /class="sb-app-shell sx-app-shell is-collapsed custom-shell"/);
  assert.match(shellMarkup, /class="demo-header">Header<\/header>/);
  assert.match(shellMarkup, /class="sb-sidebar">Sidebar<\/nav>/);
  assert.match(shellMarkup, /class="demo-main">Content<\/main>/);
  assert.match(shellMarkup, /class="demo-footer">Footer<\/footer>/);

  // Controller tests with mock element
  const classes = new Set(['is-collapsed']);
  let shellToggleDetail = null;
  let shellThemeDetail = null;
  const mockToggleBtn = {
    setAttribute(attr, val) { this[attr] = val; },
    blur() {}
  };
  const mockSidebar = {
    className: 'sb-sidebar',
    closest(sel) { if (sel.includes('sidebar')) return mockSidebar; return null; }
  };
  const mockDetailAside = {
    className: '',
    innerHTML: '',
    dataset: {},
    remove() { this.removed = true; }
  };

  const mockShellEl = {
    classList: {
      contains: cls => classes.has(cls),
      add: cls => classes.add(cls),
      remove: cls => classes.delete(cls),
      toggle: (cls, force) => {
        if (force === undefined) {
          if (classes.has(cls)) classes.delete(cls); else classes.add(cls);
        } else if (force) classes.add(cls); else classes.delete(cls);
        return classes.has(cls);
      }
    },
    querySelector(sel) {
      if (sel === '[data-shell-toggle]') return mockToggleBtn;
      if (sel === '[data-shell-detail]') return mockDetailAside;
      return null;
    },
    contains(child) { return child === mockSidebar; },
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    dispatchEvent(ev) {
      if (ev.type === 'sui:shell:toggle') shellToggleDetail = ev.detail;
      if (ev.type === 'sui:shell:theme') shellThemeDetail = ev.detail;
    },
    ownerDocument: {
      documentElement: {
        dataset: { suiTheme: 'dark', mode: 'dark' }
      }
    }
  };

  const shellCtrl = initAppShell(mockShellEl);
  assert.equal(shellCtrl.isCollapsed(), true);
  assert.equal(shellCtrl.isPeeking(), false);

  // Expand sidebar
  shellCtrl.setCollapsed(false);
  assert.equal(shellCtrl.isCollapsed(), false);
  assert.deepEqual(shellToggleDetail, { collapsed: false });
  assert.equal(mockToggleBtn['aria-expanded'], 'true');

  // Peek sidebar
  shellCtrl.setPeeking(true);
  assert.equal(shellCtrl.isPeeking(), true);
  shellCtrl.setPeeking(false);
  assert.equal(shellCtrl.isPeeking(), false);

  // Toggle click via event handler
  mockShellEl._click({
    target: {
      closest(sel) {
        if (sel === '[data-shell-toggle]') return mockToggleBtn;
        return null;
      }
    }
  });
  assert.equal(shellCtrl.isCollapsed(), true);
  assert.deepEqual(shellToggleDetail, { collapsed: true });

  // Theme click via event handler
  const mockThemeBtn = {};
  mockShellEl._click({
    target: {
      closest(sel) {
        if (sel === '[data-shell-theme]') return mockThemeBtn;
        return null;
      }
    }
  });
  assert.equal(mockShellEl.ownerDocument.documentElement.dataset.suiTheme, 'light');
  assert.deepEqual(shellThemeDetail, { theme: 'light' });

  // Set detail slot
  shellCtrl.setDetail('<div>Detail view</div>');
  assert.equal(mockDetailAside.innerHTML, '<div>Detail view</div>');

  shellCtrl.setDetail(null);
  assert.equal(mockDetailAside.removed, true);

  shellCtrl.destroy();
});

test('workspaceSidebar and sidebar alias builder and controller handle navigation, projects, and selection', () => {
  const sidebarMarkup = workspaceSidebar({
    brand: { name: 'Acme Corp', badge: 'v2' },
    selector: '<select class="sb-selector"><option>Main Workspace</option></select>',
    navigation: [
      { id: 'home', label: 'Home', icon: 'home', active: true },
      { id: 'users', label: 'Users', icon: 'users', count: 12 },
    ],
    projects: [
      {
        id: 'p-core',
        label: 'Sesama UI',
        items: [
          { id: 'p-core-overview', label: 'Overview', active: true },
          { id: 'p-core-components', label: 'Components' },
        ]
      }
    ],
    user: {
      name: 'Jordan Lee',
      role: 'Staff Engineer',
      avatar: { fallback: 'JL' }
    }
  });

  assert.match(sidebarMarkup, /data-sui-workspace-sidebar/);
  assert.match(sidebarMarkup, /class="sb-sidebar sx-workspace-sidebar"/);
  assert.match(sidebarMarkup, /Acme Corp/);
  assert.match(sidebarMarkup, /Main Workspace/);
  assert.match(sidebarMarkup, /Home/);
  assert.match(sidebarMarkup, /Users/);
  assert.match(sidebarMarkup, /Sesama UI/);
  assert.match(sidebarMarkup, /Jordan Lee/);
  assert.match(sidebarMarkup, /Staff Engineer/);

  // Compatibility alias check
  const aliasMarkup = sidebar({
    id: 'sb-fixed',
    brand: { name: 'Acme Corp', badge: 'v2' },
    selector: '<div class="custom-select">Selector</div>',
    navigation: [{ id: 'home', label: 'Home' }]
  });
  assert.equal(aliasMarkup, workspaceSidebar({
    id: 'sb-fixed',
    brand: { name: 'Acme Corp', badge: 'v2' },
    selector: '<div class="custom-select">Selector</div>',
    navigation: [{ id: 'home', label: 'Home' }]
  }));

  // Controller selection event
  let sidebarSelectDetail = null;
  const mockItem = {
    dataset: { treeKey: 'p-core-overview' },
    textContent: ' Overview ',
    hasAttribute(attr) { return false; }
  };
  const mockSidebarEl = {
    addEventListener(ev, fn) { this['_' + ev] = fn; },
    removeEventListener() {},
    dispatchEvent(ev) {
      if (ev.type === 'sui:sidebar:select') sidebarSelectDetail = ev.detail;
    }
  };

  const sidebarCtrl = initWorkspaceSidebar(mockSidebarEl);
  mockSidebarEl._click({
    target: {
      closest(sel) {
        if (sel === '[data-tree-key]') return mockItem;
        return null;
      }
    }
  });

  assert.deepEqual(sidebarSelectDetail, { key: 'p-core-overview', label: 'Overview' });
  sidebarCtrl.destroy();
});

test('pageHeader, pageLayout, and pageGrid render configurable layouts and responsive grids', () => {
  // Page Header
  const headerMarkup = pageHeader({
    title: 'Customer Directory',
    description: 'Manage verified enterprise and consumer accounts.',
    breadcrumbs: '<nav class="sx-breadcrumbs">Home / Customers</nav>',
    actions: '<button class="btn">Add Customer</button>',
    meta: '<span class="status">1,248 total</span>',
    classes: 'custom-header'
  });
  assert.match(headerMarkup, /data-sui-page-header/);
  assert.match(headerMarkup, /Customer Directory/);
  assert.match(headerMarkup, /Manage verified enterprise and consumer accounts\./);
  assert.match(headerMarkup, /Home \/ Customers/);
  assert.match(headerMarkup, /Add Customer/);
  assert.match(headerMarkup, /1,248 total/);
  assert.match(headerMarkup, /custom-header/);

  // Escaping in pageHeader
  const escHeader = pageHeader({
    title: '<script>alert(1)</script>',
    description: '<b>bold</b>'
  });
  assert.match(escHeader, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(escHeader, /&lt;b&gt;bold&lt;\/b&gt;/);

  // Page Layout
  const layoutMarkup = pageLayout({
    header: '<header>Top</header>',
    sidebar: '<aside>Aside</aside>',
    content: '<main>Body</main>',
    footer: '<footer>Bottom</footer>',
    width: 'centered'
  });
  assert.match(layoutMarkup, /data-sui-page-layout/);
  assert.match(layoutMarkup, /layout-centered/);
  assert.match(layoutMarkup, /<header>Top<\/header>/);
  assert.match(layoutMarkup, /<aside>Aside<\/aside>/);
  assert.match(layoutMarkup, /<main>Body<\/main>/);
  assert.match(layoutMarkup, /<footer>Bottom<\/footer>/);

  // Page Grid
  const gridMarkup = pageGrid({
    columns: 3,
    gap: 'lg',
    items: [
      '<div class="cell-1">A</div>',
      '<div class="cell-2">B</div>',
      '<div class="cell-3">C</div>'
    ],
    classes: 'dash-grid'
  });
  assert.match(gridMarkup, /data-sui-page-grid/);
  assert.match(gridMarkup, /cols-3/);
  assert.match(gridMarkup, /gap-lg/);
  assert.match(gridMarkup, /dash-grid/);
  assert.match(gridMarkup, /class="cell-1">A<\/div>/);
  assert.match(gridMarkup, /class="cell-3">C<\/div>/);
});

test('contentSection and dataSection render structured sections with variants and toolbars', () => {
  // Content Section
  const sectionMarkup = contentSection({
    id: 'sec-1',
    title: 'Profile Settings',
    description: 'Update your display name and email address.',
    actions: '<button>Edit</button>',
    content: '<div class="form-body">Inputs</div>',
    footer: '<div class="hint">Saved automatically</div>',
    variant: 'bordered'
  });
  assert.match(sectionMarkup, /data-sui-content-section/);
  assert.match(sectionMarkup, /variant-bordered/);
  assert.match(sectionMarkup, /Profile Settings/);
  assert.match(sectionMarkup, /Update your display name and email address\./);
  assert.match(sectionMarkup, /<button>Edit<\/button>/);
  assert.match(sectionMarkup, /Inputs/);
  assert.match(sectionMarkup, /Saved automatically/);

  // Data Section
  const dataSecMarkup = dataSection({
    id: 'data-sec-1',
    title: 'Audit Logs',
    description: 'Recent system authentication attempts.',
    actions: '<button>Export</button>',
    toolbar: '<div class="filter-bar">Filters</div>',
    data: '<table class="table"><tr><td>2026-10-31</td></tr></table>',
    pagination: '<div class="pages">1 2 3</div>',
    footer: '<span>Showing 1-10 of 100</span>'
  });
  assert.match(dataSecMarkup, /data-sui-data-section/);
  assert.match(dataSecMarkup, /Audit Logs/);
  assert.match(dataSecMarkup, /Recent system authentication attempts\./);
  assert.match(dataSecMarkup, /Export/);
  assert.match(dataSecMarkup, /Filters/);
  assert.match(dataSecMarkup, /2026-10-31/);
  assert.match(dataSecMarkup, /1 2 3/);
  assert.match(dataSecMarkup, /Showing 1-10 of 100/);
});

test('peopleList and activityFeed render avatars, roles, timestamps, and actions', () => {
  // People List
  const peopleMarkup = peopleList({
    title: 'Team Members',
    count: 3,
    people: [
      {
        id: 'u1',
        name: 'Taylor Swift',
        role: 'Lead Designer',
        email: 'taylor@sesama.io',
        status: 'online',
        actions: '<button class="more">...</button>'
      },
      {
        id: 'u2',
        name: 'Alex Morgan',
        role: 'Staff Architect',
        email: 'alex@sesama.io',
        status: 'busy'
      }
    ]
  });
  assert.match(peopleMarkup, /data-sui-people-list/);
  assert.match(peopleMarkup, /Team Members/);
  assert.match(peopleMarkup, /Taylor Swift/);
  assert.match(peopleMarkup, /Lead Designer/);
  assert.match(peopleMarkup, /taylor@sesama\.io/);
  assert.match(peopleMarkup, /Alex Morgan/);
  assert.match(peopleMarkup, /Staff Architect/);

  // Empty People List
  const emptyPeople = peopleList({ people: [], emptyText: 'No members assigned.' });
  assert.match(emptyPeople, /No members assigned\./);

  // Activity Feed
  const feedMarkup = activityFeed({
    title: 'Recent Activity',
    activities: [
      {
        id: 'act-1',
        title: 'Pull request merged',
        description: 'PR #108 Component API Migration Phase 8',
        timestamp: '5m ago',
        status: 'success',
        actions: '<a href="#">View PR</a>'
      },
      {
        id: 'act-2',
        title: 'Build failed',
        description: 'Workflow Run #412',
        timestamp: '1h ago',
        status: 'error'
      }
    ]
  });
  assert.match(feedMarkup, /data-sui-activity-feed/);
  assert.match(feedMarkup, /Pull request merged/);
  assert.match(feedMarkup, /PR #108 Component API Migration Phase 8/);
  assert.match(feedMarkup, /5m ago/);
  assert.match(feedMarkup, /Build failed/);
  assert.match(feedMarkup, /1h ago/);
});

test('metricCard, metricSummary, and chartSection render quantitative blocks and responsive charts', () => {
  // Metric Card
  const cardMarkup = metricCard({
    label: 'Monthly Recurring Revenue',
    value: '$84,200',
    change: '+14.5%',
    trend: 'up',
    badge: 'MRR',
    description: 'Based on active subscriptions as of October 2026',
    footer: '<a href="/billing">View revenue details</a>'
  });
  assert.match(cardMarkup, /data-sui-metric-card/);
  assert.match(cardMarkup, /Monthly Recurring Revenue/);
  assert.match(cardMarkup, /\$84,200/);
  assert.match(cardMarkup, /\+14\.5%/);
  assert.match(cardMarkup, /trend-up/);
  assert.match(cardMarkup, /MRR/);
  assert.match(cardMarkup, /Based on active subscriptions/);
  assert.match(cardMarkup, /View revenue details/);

  // Metric Summary
  const summaryMarkup = metricSummary({
    columns: 3,
    metrics: [
      { label: 'Total Sales', value: '1,420' },
      { label: 'Conversion', value: '3.8%' },
      { label: 'Churn Rate', value: '0.4%', trend: 'down', change: '-0.2%' }
    ]
  });
  assert.match(summaryMarkup, /data-sui-metric-summary/);
  assert.match(summaryMarkup, /cols-3/);
  assert.match(summaryMarkup, /Total Sales/);
  assert.match(summaryMarkup, /Conversion/);
  assert.match(summaryMarkup, /Churn Rate/);

  // Chart Section
  const chartSecMarkup = chartSection({
    id: 'analytics-chart',
    title: 'Traffic & Conversion Performance',
    description: 'Daily unique visitors and registered sessions.',
    chart: '<div class="mock-chart-svg">SVG_GRAPH</div>',
    metrics: [
      { label: 'Unique Visitors', value: '18,400', change: '+22%', trend: 'up' },
      { label: 'Bounce Rate', value: '28.4%', change: '-3.1%', trend: 'down' }
    ],
    summary: 'Visitors peaked at 18,400 during the product launch event.',
    footer: '<span>Data updated every 5 minutes</span>'
  });
  assert.match(chartSecMarkup, /sb-chart-section/);
  assert.match(chartSecMarkup, /Traffic &amp; Conversion Performance/);
  assert.match(chartSecMarkup, /SVG_GRAPH/);
  assert.match(chartSecMarkup, /Unique Visitors/);
  assert.match(chartSecMarkup, /Bounce Rate/);
  assert.match(chartSecMarkup, /Visitors peaked at 18,400/);
  assert.match(chartSecMarkup, /Data updated every 5 minutes/);
});

test('domain recipes assemble cohesive workflows from atomic components and blocks', () => {
  // 1. Requirement Group Recipe
  const reqMarkup = requirementGroupRecipe({
    id: 'req-group-1',
    title: 'Core Architecture Requirements',
    description: 'System specifications for the distributed orchestrator.',
    requirements: [
      { id: 'req-1', title: 'Sub-millisecond latency', status: 'completed', priority: 'P0' },
      { id: 'req-2', title: 'Zero downtime rolling restart', status: 'in-progress', priority: 'P1' }
    ]
  });
  assert.match(reqMarkup, /data-sui-requirement-group/);
  assert.match(reqMarkup, /Core Architecture Requirements/);
  assert.match(reqMarkup, /Sub-millisecond latency/);
  assert.match(reqMarkup, /Zero downtime rolling restart/);

  // 2. Resource List Recipe
  const resMarkup = resourceListRecipe({
    id: 'res-list-1',
    title: 'Workspace Documents',
    layout: 'table',
    columns: [
      { key: 'name', label: 'File' },
      { key: 'size', label: 'Size' }
    ],
    resources: [
      { name: 'architecture-spec.pdf', size: '2.4 MB' },
      { name: 'api-reference.md', size: '180 KB' }
    ]
  });
  assert.match(resMarkup, /data-sui-data-section/);
  assert.match(resMarkup, /Workspace Documents/);
  assert.match(resMarkup, /architecture-spec\.pdf/);
  assert.match(resMarkup, /api-reference\.md/);

  // 3. Agent Card Recipe
  const agentMarkup = agentCardRecipe({
    id: 'agent-1',
    name: 'Research Copilot',
    role: 'Deep Research Agent',
    model: 'Gemini 2.5 Pro',
    status: 'online',
    description: 'Performs multi-step web queries and aggregates analytical dossiers.',
    capabilities: ['Web Search', 'Data Synthesis', 'Report Generation'],
    actions: '<button class="btn">Launch Session</button>'
  });
  assert.match(agentMarkup, /data-sui-agent-card/);
  assert.match(agentMarkup, /Research Copilot/);
  assert.match(agentMarkup, /Deep Research Agent/);
  assert.match(agentMarkup, /Gemini 2\.5 Pro/);
  assert.match(agentMarkup, /Web Search/);
  assert.match(agentMarkup, /Launch Session/);

  // 4. Create Skill Dialog Recipe
  const skillDialogMarkup = createSkillDialogRecipe({
    id: 'create-tool-modal',
    title: 'Register Custom MCP Tool',
    description: 'Declare a callable function tool for autonomous agents.',
    submitLabel: 'Register Tool',
    cancelLabel: 'Dismiss'
  });
  assert.match(skillDialogMarkup, /data-sui-modal/);
  assert.match(skillDialogMarkup, /Register Custom MCP Tool/);
  assert.match(skillDialogMarkup, /Declare a callable function tool/);
  assert.match(skillDialogMarkup, /Register Tool/);
  assert.match(skillDialogMarkup, /Dismiss/);

  // 5. Delete Resource Recipe
  const deleteDialogMarkup = deleteResourceRecipe({
    id: 'delete-repo-modal',
    title: 'Delete Repository',
    resourceName: 'sesama-ui-legacy',
    requiresKeyword: true,
    keyword: 'sesama-ui-legacy',
    confirmLabel: 'Confirm Destruction'
  });
  assert.match(deleteDialogMarkup, /data-sui-modal/);
  assert.match(deleteDialogMarkup, /Delete Repository/);
  assert.match(deleteDialogMarkup, /sesama-ui-legacy/);
  assert.match(deleteDialogMarkup, /data-expected-keyword="sesama-ui-legacy"/);
  assert.match(deleteDialogMarkup, /Confirm Destruction/);

  // 6. Dashboard Overview Recipe
  const dashMarkup = dashboardOverviewRecipe({
    title: 'Executive Overview',
    description: 'Key performance indicators and system telemetry.',
    metrics: [
      { label: 'Total Revenue', value: '$240K' },
      { label: 'Active Users', value: '45,000' }
    ],
    chart: '<div class="overview-chart">CHART</div>',
    activity: '<div class="overview-feed">FEED</div>',
    table: '<div class="overview-table">RECENT_ORDERS</div>'
  });
  assert.match(dashMarkup, /sb-dashboard-overview/);
  assert.match(dashMarkup, /Executive Overview/);
  assert.match(dashMarkup, /Total Revenue/);
  assert.match(dashMarkup, /\$240K/);
  assert.match(dashMarkup, /CHART/);
  assert.match(dashMarkup, /FEED/);
  assert.match(dashMarkup, /RECENT_ORDERS/);

  // 7. Revenue Chart Recipe
  const revMarkup = revenueChartRecipe({
    id: 'q4-revenue',
    title: 'Q4 Financial Trajectory',
    description: 'Quarterly run-rate and subscription retention.',
    chart: '<svg class="rev-svg">REVENUE_CHART</svg>'
  });
  assert.match(revMarkup, /sb-revenue-chart/);
  assert.match(revMarkup, /Q4 Financial Trajectory/);
  assert.match(revMarkup, /REVENUE_CHART/);
  assert.match(revMarkup, /Total Revenue/);

  // 8. Data Workspace Recipe
  const wsMarkup = dataWorkspaceRecipe({
    brand: { name: 'Lakehouse Engine', badge: 'v3' },
    title: 'Enterprise Datasets',
    description: 'Distributed query catalogs and partition metrics.',
    table: '<table class="datasets"><tr><td>warehouse-prod</td></tr></table>'
  });
  assert.match(wsMarkup, /data-sui-app-shell/);
  assert.match(wsMarkup, /Lakehouse Engine/);
  assert.match(wsMarkup, /Enterprise Datasets/);
  assert.match(wsMarkup, /warehouse-prod/);
});
