/** Canonical application demos. Utility/legacy examples stay outside Pages. */
export const demoCategories = [
  { id: 'dashboard', label: 'Dashboard', icon: 'activity', description: 'Overview, revenue, orders, and customers across connected dashboard pages.', pages: [
    { id: 'overview', label: 'Overview', href: '/demos/dashboard/Dashboard%20overview.html', icon: 'home' },
    { id: 'revenue', label: 'Revenue', href: '/demos/dashboard/Revenue%20report.html', icon: 'grid-3x3' },
    { id: 'orders', label: 'Orders', href: '/demos/dashboard/Orders.html', icon: 'file-text' },
    { id: 'customers', label: 'Customers', href: '/demos/dashboard/Customers.html', icon: 'users' }
  ] },
  { id: 'ai-agent', label: 'AI Agent', icon: 'sparkles', description: 'Chat with AI and explore the agent directory.', pages: [
    { id: 'chat', label: 'Chat', href: '/demos/ai-agent/AI%20agents%20demo.html#chat/new', icon: 'sparkles' },
    { id: 'agents', label: 'Agent', href: '/demos/ai-agent/Agents.html', icon: 'users' },
    { id: 'agent-bot', label: 'Agent Bot', href: '/demos/ai-bot/Agent%20Bot.html', icon: 'sparkles' }
  ] },
  { id: 'issue-workspace', label: 'Issue Workspace', icon: 'file-text', description: 'Inbox, personal issues, reviews, and all team issues.', pages: [
    { id: 'inbox', label: 'Inbox', href: '/demos/issue/Issue%20workspace.html', icon: 'inbox' },
    { id: 'my-issues', label: 'My issues', href: '/demos/issue/My%20issues.html', icon: 'circle-user' },
    { id: 'reviews', label: 'Review', href: '/demos/issue/Reviews.html', icon: 'code' },
    { id: 'all-issues', label: 'All issues', href: '/demos/issue/All%20issues.html', icon: 'file-text' }
  ] },
  { id: 'onboarding', label: 'Onboarding', icon: 'circle-user', description: 'A focused login flow to enter your workspace.', pages: [
    { id: 'login', label: 'Login', href: '/demos/onboarding/Login.html', icon: 'circle-user' }
  ] }
];
export const demoRoutes = Object.fromEntries(demoCategories.flatMap(category => category.pages.map(page => [page.id, page.href])));
export function demoMenuItems(prefix = 'landingnav:') {
  return demoCategories.map(category => ({ type: 'group', label: category.label, items: category.pages.map(page => ({ label: page.label, icon: page.icon, action: prefix + page.id })) }));
}
