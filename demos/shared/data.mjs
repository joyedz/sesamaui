/**
 * Shared demo fixtures and helper utilities for Sesama UI application demos.
 */
import { workspaceSidebar } from '../../src/index.mjs';

/**
 * Currency formatter (integer USD).
 * @param {number} n
 * @returns {string}
 */
export function money(n) {
  return new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

/**
 * Currency formatter with cents (USD).
 * @param {number} n
 * @returns {string}
 */
export function moneyExact(n) {
  return new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(n);
}

/**
 * Shared sales navigation items.
 * @param {string} [active]
 */
export function getSalesNavigation(active = 'overview') {
  return [
    { id: 'overview', key: 'overview', label: 'Overview', icon: 'home', href: 'Dashboard%20overview.html', selected: active === 'overview', active: active === 'overview' }
  ];
}

/**
 * Shared sales groups navigation.
 * @param {string} [active]
 */
export function getSalesGroups(active = 'overview') {
  return [
    {
      title: 'Sales',
      items: [
        { id: 'revenue', key: 'revenue', label: 'Revenue reports', icon: 'grid-3x3', href: 'Revenue%20report.html', selected: active === 'revenue', active: active === 'revenue' },
        { id: 'orders', key: 'orders', label: 'Orders', icon: 'file-text', href: 'Orders.html', selected: active === 'orders', active: active === 'orders' },
        { id: 'customers', key: 'customers', label: 'Customers', icon: 'users', href: 'Customers.html', selected: active === 'customers', active: active === 'customers' }
      ]
    },
    {
      title: 'Team',
      items: [
        { id: 'members', key: 'members', label: 'Members', icon: 'users', href: '#', selected: active === 'members', active: active === 'members' },
        { id: 'workload', key: 'workload', label: 'Workload', icon: 'list-filter', href: '#', selected: active === 'workload', active: active === 'workload' },
        { id: 'performance', key: 'performance', label: 'Performance', icon: 'activity', href: '#', selected: active === 'performance', active: active === 'performance' }
      ]
    }
  ];
}

/**
 * Shared sales projects tree.
 */
export const salesProjects = [
  {
    id: 'project-launch',
    key: 'project-launch',
    label: 'Website launch',
    icon: 'folder',
    children: [
      { id: 'launch', key: 'launch', label: 'Review launch checklist', icon: false },
      { id: 'release', key: 'release', label: 'Plan the release', icon: false }
    ]
  },
  {
    id: 'project-portal',
    key: 'project-portal',
    label: 'Customer portal',
    icon: 'folder',
    expanded: false,
    children: [
      { id: 'portal', key: 'portal', label: 'Review requirements', icon: false }
    ]
  },
  {
    id: 'project-tools',
    key: 'project-tools',
    label: 'Internal tools',
    icon: 'folder',
    expanded: false,
    children: [
      { id: 'tools', key: 'tools', label: 'Plan dashboard improvements', icon: false }
    ]
  }
];

/**
 * Create a workspace sidebar configured for sales reporting demos.
 * @param {string} [activeKey]
 * @returns {string} HTML markup
 */
export function createSalesSidebar(activeKey = 'overview') {
  return workspaceSidebar({
    workspace: 'Sesama workspace',
    navigation: getSalesNavigation(activeKey),
    groups: getSalesGroups(activeKey),
    projects: salesProjects,
    profileName: 'Nils Eller',
    initials: 'N'
  });
}

/**
 * 60 sample revenue records.
 */
export const sampleRevenue = Array.from({ length: 60 }, (_, i) => {
  const gross = 450 + (i * 173) % 1200;
  const discount = i % 4 === 0 ? Math.round(gross * 0.1) : 0;
  const refund = i % 11 === 0 ? 80 : 0;
  return {
    id: 'ORD-' + (1040 + i),
    date: new Date(Date.UTC(2026, 8, 1 + i)).toISOString().slice(0, 10),
    customer: ['Northwind Labs', 'Blue River Co.', 'Oak Street Studio', 'Harbor Supply'][i % 4],
    channel: ['Website', 'Marketplace', 'Direct'][i % 3],
    gross,
    discount,
    refund,
    net: gross - discount - refund
  };
});

/**
 * 36 sample orders records.
 */
export const sampleOrders = Array.from({ length: 36 }, (_, i) => ({
  id: 'ORD-' + (2101 + i),
  customer: ['Amelia Park', 'Noah Ibarra', 'Priya Desai', 'Marcus Chen', 'Emily Johnson', 'Alex Morgan'][i % 6],
  date: '2026-10-' + String(30 - i % 30).padStart(2, '0'),
  channel: ['Website', 'Marketplace', 'Direct'][i % 3],
  items: 1 + i % 4,
  total: 79 + i * 13,
  payment: ['Paid', 'Paid', 'Pending', 'Refunded'][i % 4],
  fulfillment: ['Completed', 'Shipped', 'Processing', 'Unfulfilled'][i % 4]
}));

/**
 * 36 sample customer names.
 */
export const sampleCustomerNames = [
  'Amelia Park', 'Noah Ibarra', 'Priya Desai', 'Marcus Chen', 'Emily Johnson', 'Alex Morgan',
  'Sofia Martinez', 'Oliver Wilson', 'Ava Thompson', 'Ethan Brooks', 'Isabella Rossi', 'Liam Anderson',
  'Mia Robinson', 'Lucas Garcia', 'Charlotte Lee', 'James Taylor', 'Harper Davis', 'Benjamin Scott',
  'Evelyn Moore', 'Henry Clark', 'Aria Patel', 'Leo Nguyen', 'Chloe Adams', 'Daniel Kim',
  'Grace Turner', 'Samuel Reed', 'Lily Morgan', 'Jack Bennett', 'Ella Cooper', 'William Hayes',
  'Zoe Mitchell', 'Mason Carter', 'Nora Evans', 'Sebastian Diaz', 'Lucy Collins', 'Owen Wright'
];

/**
 * 36 sample customer records.
 */
export const sampleCustomers = sampleCustomerNames.map((name, i) => ({
  id: 'CUS-' + (1001 + i),
  name,
  email: name.toLowerCase().replace(' ', '.') + '@' + ['gmail.com', 'outlook.com', 'icloud.com'][i % 3],
  orders: i % 7 === 0 ? 1 : 3 + i % 12,
  spent: Math.round((i % 7 === 0 ? 1 : 3 + i % 12) * (79 + i * 7.5) * 100) / 100,
  last: '2026-' + (i % 5 === 0 ? '08' : '10') + '-' + String(28 - i % 24).padStart(2, '0'),
  joined: '2026-' + String(1 + i % 9).padStart(2, '0') + '-12',
  status: i % 5 === 0 ? 'Inactive' : i % 7 === 0 ? 'New' : 'Active',
  channel: ['Website', 'Marketplace', 'Direct'][i % 3],
  phone: '+1 (415) 555-' + String(1000 + i)
}));

/**
 * Sample team members.
 */
export const sampleTeamMembers = [
  { name: 'Amelia Park', status: 'Online', metadata: '9 assigned' },
  { name: 'Noah Ibarra', status: 'Online', metadata: '7 assigned' },
  { name: 'Priya Desai', status: 'Away', metadata: '4 assigned' },
  { name: 'Marcus Chen', status: 'Online', metadata: '11 assigned' }
];

/**
 * Sample activity feed events.
 */
export const sampleActivities = [
  { title: 'A support request was resolved', time: '12 minutes ago', icon: 'circle-check' },
  { title: 'A conversation was escalated', time: '28 minutes ago', icon: 'chat' },
  { title: 'The project brief was updated', time: '1 hour ago', icon: 'file-text' }
];

/**
 * Sample recent projects.
 */
export const sampleRecentProjects = [
  { id: 1, name: 'Website launch', status: 'Active', owner: 'Amelia Park', updated: 'Oct 24, 2026', due: 'Nov 4, 2026', progress: '75%' },
  { id: 2, name: 'Mobile app', status: 'Draft', owner: 'Noah Ibarra', updated: 'Oct 25, 2026', due: 'Nov 8, 2026', progress: '50%' },
  { id: 3, name: 'Design system', status: 'Active', owner: 'Priya Desai', updated: 'Oct 26, 2026', due: 'Nov 12, 2026', progress: '90%' },
  { id: 4, name: 'Customer portal', status: 'Review', owner: 'Marcus Chen', updated: 'Oct 27, 2026', due: 'Nov 16, 2026', progress: '80%' },
  { id: 5, name: 'Analytics', status: 'Draft', owner: 'Amelia Park', updated: 'Oct 28, 2026', due: 'Nov 20, 2026', progress: '25%' },
  { id: 6, name: 'Documentation', status: 'Active', owner: 'Priya Desai', updated: 'Oct 29, 2026', due: 'Nov 24, 2026', progress: '60%' }
];

/**
 * Sample issue seeds for Issue Workspace.
 */
export const issueSeeds = [
  ['Faster app launch', 'In Progress', 'High', 'Amelia Park', 'Performance'],
  ['Keep filters when switching views', 'Todo', 'Medium', 'Noah Ibarra', 'Experience'],
  ['Improve keyboard navigation in tables', 'In Progress', 'High', 'Priya Desai', 'Accessibility'],
  ['Add customer search to the command menu', 'Backlog', 'Medium', 'Amelia Park', 'Search'],
  ['Reduce layout shifts on initial load', 'Todo', 'High', 'Marcus Chen', 'Performance'],
  ['Make project activity easier to scan', 'Done', 'Low', 'Priya Desai', 'Experience'],
  ['Fix empty state on archived projects', 'Todo', 'Medium', 'Noah Ibarra', 'Bug'],
  ['Sync notification preferences across tabs', 'Backlog', 'Low', 'Marcus Chen', 'Settings'],
  ['Review contrast in dark mode', 'Done', 'High', 'Priya Desai', 'Accessibility'],
  ['Remember the last selected workspace', 'In Progress', 'Medium', 'Amelia Park', 'Experience'],
  ['Show upload progress for large files', 'Todo', 'Medium', 'Noah Ibarra', 'Files'],
  ['Polish issue detail spacing', 'Backlog', 'Low', 'Priya Desai', 'Design']
];

/**
 * AI agent conversations dictionary for AI agents demo.
 */
export const aiAgentConversations = {
  'history-office': [
    ['Help me prioritize the team workload this week.', 'Start with work that unblocks others: confirm scope, assign milestone owners, and complete pending reviews. Reserve Friday for a progress review.'],
    ['Can you break it down by day?', 'Use Monday for planning, Tuesday and Wednesday for implementation, Thursday for review, and Friday for improvements.']
  ],
  'history-coding': [
    ['How should I connect an agent to our internal API?', 'Use a server endpoint to validate requests and forward tasks to the agent service. Keep credentials on the server and return status updates to the UI.'],
    ['What if processing takes a long time?', 'Return a job ID and expose queued, running, completed, and failed states. Support cancellation and stream progress updates.']
  ],
  'website-office': [
    ['What should we check before launching the website?', 'Review content, forms, analytics, metadata, and the main user journeys. Assign a monitoring owner and prepare a rollback procedure.'],
    ['What order should we use?', 'Test core journeys first, followed by mobile layouts, accessibility, performance, and SEO. Verify the domain and monitoring last.']
  ],
  'website-coding': [
    ['The landing page overflows on mobile.', 'Check fixed-width elements and flex children missing min-width: 0. Images should fit their containers and grid columns must be allowed to shrink.'],
    ['How can I locate the source?', 'Compare scrollWidth and clientWidth in DevTools, starting with the overflowing section and inspecting its children.']
  ],
  'website-design': [
    ['Suggest a homepage structure for our collaboration product.', 'Start with a clear benefit and a product preview, then show practical workflows and customer evidence. Finish with a focused call to action.'],
    ['Should the preview be interactive?', 'Use a clear image first. An interactive demo works better once visitors understand the context and want to explore the workflow.']
  ],
  'tools-office': [
    ['Summarize what operations needs in an internal dashboard.', 'The team needs pending work, request status, search, and recent activity. Every item should have an owner and a clear next action.'],
    ['What belongs in the first version?', 'Prioritize the request list, status filters, item details, and status updates. Add advanced analytics after the main workflow is stable.']
  ],
  'tools-coding': [
    ['Help me add status filters to a table.', 'Apply the filter before pagination and reset the page when it changes. Keep selection tied to row identity.'],
    ['What happens when there are no results?', 'Show an Empty State explaining the active filter and offer a clear-filters action. Keep the table header and filters visible.']
  ],
  'tools-design': [
    ['Help me simplify this dashboard.', 'Separate summaries from the main work list, reduce unnecessary borders, standardize row heights, and clarify the hierarchy of titles, metadata, and actions.'],
    ['How should we use color?', 'Use neutrals for structure, brand blue for primary actions and selection, and semantic colors only when they communicate status.']
  ],
  'history-design': [
    ['Review our design system for a team collaboration product.', 'Start with the core workflows: project navigation, reading conversations, composing messages, and attaching documents. Consistency across these journeys matters more than the number of variants.'],
    ['How do we review input consistency?', 'Compare control height, padding, labels, placeholders, hover, and focus. Input, Select, and Date Picker should use shared spacing tokens. Helper text is optional and should add useful context.'],
    ['What about navigation?', 'Use indentation to express hierarchy. Parent items can have chevrons; children do not need extra icons when labels are clear. Selection should be visible without dominating the page.'],
    ['How should long conversation titles behave?', 'Truncate them with ellipsis within their container. Reserve space for actions and provide the full title through an accessible name or tooltip.'],
    ['Let us review the Composer.', 'The text area starts at two lines and grows with the content. Use the shared attachment menu, context and model Selects, microphone button, and Send control. Send becomes Stop while the agent is working.'],
    ['How should attachments appear?', 'Use a compact grid inside the Composer. After sending, show File Cards inside the message. Clicking a filename expands its preview; unsupported formats use a fallback icon.'],
    ['What makes long responses readable?', 'Use 14px text with a 22px line height and a constrained reading width. Keep paragraph spacing consistent and use icon actions with brief click feedback.'],
    ['What should we test while scrolling?', 'Keep the header and Composer accessible. Ensure the final message is not obscured and tooltips dismiss on scroll. Edge fades should indicate content beyond the viewport.'],
    ['What if someone is reading older messages?', 'Preserve their reading position rather than forcing them to the bottom. Scroll to a newly submitted message when they send it themselves. Opening menus should not move the conversation.'],
    ['How do we keep the demo consistent?', 'Define typography, controls, colors, internal spacing, and states in shared components. The demo should own page layout, sample data, and application interactions.'],
    ['Summarize the next steps.', 'Test the core journeys on desktop and mobile. Check keyboard navigation, focus, contrast, and reduced motion. Update component documentation before connecting model and tool APIs.']
  ]
};
