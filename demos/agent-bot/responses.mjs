import { escapeHTML as esc, table, banner } from '../../src/index.mjs';

export function renderMessageContent(item) {
  if (!Array.isArray(item.blocks) || !item.blocks.length) return '<div class="bot-message">' + esc(item.text || '') + '</div>';
  const content = item.blocks.map(block => {
    if (block.type === 'heading') return '<h3>' + esc(block.text) + '</h3>';
    if (block.type === 'paragraph') return '<p>' + esc(block.text) + '</p>';
    if (block.type === 'list') return '<ul>' + block.items.map(text => '<li>' + esc(text) + '</li>').join('') + '</ul>';
    if (block.type === 'code') return '<div class="bot-code-block"><span class="bot-muted">' + esc(block.language || 'code') + '</span><pre><code>' + esc(block.text) + '</code></pre></div>';
    if (block.type === 'callout') return banner({ tone: block.tone === 'warning' ? 'warning' : 'informative', title: block.title, description: block.text });
    if (block.type === 'sources') return '<section class="bot-response-sources"><h3>Sample sources</h3><ul>' + block.items.map(text => '<li>' + esc(text) + '</li>').join('') + '</ul></section>';
    if (block.type === 'table') {
      const columns = block.columns.map((label, index) => ({ key: 'column' + index, header: label }));
      const rows = block.rows.map((values, index) => Object.fromEntries([['id', index], ...values.map((value, column) => ['column' + column, value])]));
      return '<div class="bot-response-table">' + table({ columns, rows, compact: true, minWidth: 430, ariaLabel: 'Sample comparison' }) + '</div>';
    }
    return '';
  }).join('');
  return '<div class="bot-rich-response"><p class="bot-muted">Simulated analysis · fictional sample data</p>' + content + '</div>';
}
