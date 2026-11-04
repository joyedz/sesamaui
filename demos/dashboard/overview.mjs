import {
      appShell,
      pageHeader,
      pageLayout,
      pageGrid,
      metricCard,
      chartSection,
      chart,
      contentSection,
      dataSection,
      peopleList,
      activityFeed,
      table,
      iconButton,
      mount as mountRuntime
    } from '../../src/index.mjs';
import {
      createSalesSidebar,
      sampleTeamMembers,
      sampleActivities,
      sampleRecentProjects
    } from '../shared/data.mjs';

export function createPage({ renderShell, listen, onDispose, onPersist, navigate, defer }) {
  const setTimeout = defer;
  const sessions = new Set();
  function mount(root) {
    const session = mountRuntime(root);
    sessions.add(session);
    return session;
  }
  onDispose(() => { for (const session of sessions) session.destroy(); });

    
    

    const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({
      label,
      total: [48, 64, 58, 86, 75, 105, 96][i],
      email: [20, 28, 24, 36, 31, 45, 40][i]
    }));
    const chartSeries = [
      { key: 'total', label: 'Conversations' },
      { key: 'email', label: 'Email' }
    ];

    const metrics = [
      { label: 'Open queue', value: '38', change: '−12.4%', tone: 'success', description: 'vs yesterday' },
      { label: 'Active conversations', value: '126', change: '+5.2%', tone: 'neutral' },
      { label: 'Median first reply', value: '4.1m', change: '−8.0%', tone: 'success' },
      { label: 'Customer satisfaction', value: '94%', change: '+1.1%', tone: 'success' }
    ];

    const volumeChart = chart({
      type: 'area',
      label: 'Conversation volume',
      data: chartData,
      series: chartSeries,
      height: 240
    });

    const trafficChart = chart({
      type: 'donut',
      label: 'Traffic by channel',
      data: [
        { label: 'Direct', value: 44 },
        { label: 'Email', value: 36 },
        { label: 'Social', value: 20 }
      ],
      series: [{ key: 'value', label: 'Conversations' }],
      height: 240
    });

    const activityChart = chart({
      type: 'stacked bar',
      label: 'Channel activity',
      data: chartData,
      series: chartSeries,
      height: 240
    });

    const projectsTable = table({
      label: 'Recent projects',
      rows: sampleRecentProjects,
      columns: [
        { key: 'name', header: 'Name' },
        { key: 'status', header: 'Status' },
        { key: 'owner', header: 'Owner' },
        { key: 'updated', header: 'Updated' },
        { key: 'due', header: 'Due date' },
        { key: 'progress', header: 'Progress', align: 'right' },
        {
          key: 'actions',
          header: 'Actions',
          align: 'right',
          render: (_, row) => `<div class="sx-table-actions">${iconButton({ icon: 'kebab', attributes: `data-menu="Open,Archive"`, accessibleLabel: row.name + ' actions' })}</div>`
        }
      ]
    });

    const gridItems = [
      ...metrics.map(m => ({
        html: metricCard(m),
        span: 3,
        tablet: 3
      })),
      {
        html: chartSection({
          title: 'Conversation volume',
          description: 'New threads during the selected week',
          chart: volumeChart,
          variant: 'bordered'
        }),
        span: 8
      },
      {
        html: chartSection({
          title: 'Traffic by channel',
          description: 'Share of new conversations',
          chart: trafficChart,
          variant: 'bordered'
        }),
        span: 4
      },
      {
        html: chartSection({
          title: 'Channel activity',
          description: 'Daily channel counts',
          chart: activityChart,
          variant: 'bordered'
        }),
        span: 8
      },
      {
        html: contentSection({
          title: 'Team members',
          description: 'Current active staff',
          content: peopleList({ people: sampleTeamMembers }),
          variant: 'bordered'
        }),
        span: 4
      },
      {
        html: dataSection({
          title: 'Recent projects',
          description: 'Active workspaces and roadmaps',
          data: projectsTable,
          variant: 'bordered'
        }),
        span: 8
      },
      {
        html: contentSection({
          title: 'Recent activity',
          description: 'Chronological timeline',
          content: activityFeed({ items: sampleActivities }),
          variant: 'bordered'
        }),
        span: 4
      }
    ];

    const content = pageLayout(pageGrid({ items: gridItems }), { variant: 'data' });

    renderShell(appShell({
      sidebar: createSalesSidebar('overview'),
      header: pageHeader({ title: 'Overview', icon: 'grid-3x3' }),
      content
    }));

    mount(document.querySelector('.sb-main'));

  
}
