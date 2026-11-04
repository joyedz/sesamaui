import { escapeHTML as esc } from '../src/components/shared.mjs';

const sourceUrl = new URL('../docs/COMPONENT-API-PREVIEW.md', import.meta.url);
let sourcePromise;

// Render the Markdown constructs used by the local API contract. Escape text and
// code before inserting it; relative document links resolve beside the source MD.
function inline(text) {
  const pattern = /`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|~~([^~]+)~~/g;
  let html = '', offset = 0;
  for (const match of text.matchAll(pattern)) {
    html += esc(text.slice(offset, match.index));
    if (match[1] !== undefined) html += `<code>${esc(match[1])}</code>`;
    else if (match[2] !== undefined) {
      const url = new URL(match[3], sourceUrl);
      html += ['http:', 'https:'].includes(url.protocol) ? `<a href="${esc(url.href)}">${inline(match[2])}</a>` : inline(match[2]);
    } else if (match[4] !== undefined) html += `<strong>${inline(match[4])}</strong>`;
    else html += `<del>${inline(match[5])}</del>`;
    offset = match.index + match[0].length;
  }
  return html + esc(text.slice(offset));
}

export function renderApiMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const sections = [];
  let content = '';
  const flush = () => { if (content) sections.push(`<section>${content}</section>`); content = ''; };
  const cells = line => line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim() || /^# /.test(line)) { i++; continue; }
    if (/^## /.test(line)) { flush(); content = `<h3>${inline(line.slice(3))}</h3>`; i++; continue; }
    if (/^```/.test(line)) {
      const code = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++;
      content += `<pre class="imp">${esc(code.join('\n'))}</pre>`;
      continue;
    }
    if (line.startsWith('|') && /^\|[\s:|\-]+\|$/.test(lines[i + 1] || '')) {
      const headers = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(cells(lines[i++]));
      content += `<div class="api-reference-table"><table class="api"><thead><tr>${headers.map(c => `<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      continue;
    }
    const list = line.match(/^(- |\d+\. )(.*)$/);
    if (list) {
      const ordered = /^\d/.test(list[1]);
      const pattern = ordered ? /^\d+\. (.*)$/ : /^- (.*)$/;
      const items = [];
      while (i < lines.length && pattern.test(lines[i])) items.push(lines[i++].replace(pattern, '$1'));
      const tag = ordered ? 'ol' : 'ul';
      content += `<${tag}>${items.map(item => `<li>${inline(item)}</li>`).join('')}</${tag}>`;
      continue;
    }
    const paragraph = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#|```|\||- |\d+\. )/.test(lines[i])) paragraph.push(lines[i++]);
    content += `<p>${inline(paragraph.join(' '))}</p>`;
  }
  flush();
  return sections.join('');
}

export async function renderComponentApiReference() {
  const host = document.querySelector('[data-api-reference]');
  if (!host) return;
  try {
    sourcePromise ||= fetch(sourceUrl).then(response => {
      if (!response.ok) throw new Error('Unable to load API reference');
      return response.text();
    }).catch(error => { sourcePromise = null; throw error; });
    const markdown = await sourcePromise;
    if (!host.isConnected) return;
    host.innerHTML = renderApiMarkdown(markdown);
  } catch {
    if (host.isConnected) host.innerHTML = `<section><p>Unable to load the API reference. <a href="${esc(sourceUrl.href)}">Open the Markdown document</a>.</p></section>`;
  }
}
