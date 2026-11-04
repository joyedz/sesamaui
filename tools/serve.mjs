import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, readdir, stat } from 'node:fs/promises';
import { listRow, controlIcon, runeIcon } from '../src/index.mjs';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url))),port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.md':'text/plain; charset=utf-8'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const navRow=(title,icon,href)=>listRow({variant:'navigation',appearance:'plain',title,leading:icon==='inbox'?runeIcon('inbox',16):controlIcon(icon,16),href});
async function indexPage(){
  const { demoCategories } = await import('../demos/shared/pages.mjs');
  const section=(title,rows)=>rows.length?`<section><h2>${esc(title)}</h2><div class="idx-menu">${rows.join('')}</div></section>`:'';
  const designRows=[
    navRow('Component catalog','grid-3x3','/site/Design%20system.html'),
    navRow('Component API preview','file-text','/demos/Component%20API.html')
  ];
  const categorySections=demoCategories.map(category=>{
    const rows=category.pages.map(page=>navRow(page.label,page.icon,page.href));
    if(category.id==='ai-agent')rows.splice(1,0,navRow('Message','chat','/demos/ai-agent/AI%20agents%20demo.html#chat/history-design'));
    return section(category.label,rows);
  });
  const demosRoot=path.join(root,'demos');
  const referenceRows=(await readdir(demosRoot)).filter(name=>name.endsWith('.html')&&name!=='Component API.html').sort().map(name=>navRow(name.replace(/\.html$/,''),'file-text','/demos/'+encodeURIComponent(name)));
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sesama UI · dev server</title><link rel="stylesheet" href="/src/styles/fonts.css"><link rel="stylesheet" href="/src/styles/components.css"><link rel="stylesheet" href="/demos/shared/palette.css"><style>body{margin:0;min-height:100vh;background:var(--color-canvas)}header.idx-header{height:80px;display:flex;align-items:center;gap:12px;max-width:1280px;margin:0 auto;padding:0 40px;border-bottom:1px solid var(--color-hairline)}header.idx-header .idx-brand{font-size:25px;font-weight:500}header.idx-header .idx-tag{font-size:12px;color:var(--text-subtle)}main{max-width:760px;margin:0 auto;padding:32px 40px 72px}h1{font-size:24px;font-weight:500;margin:0 0 6px}p.idx-sub{color:var(--text-subtle);margin:0 0 8px}section h2{font-size:12px;font-weight:500;color:var(--text-subtle);margin:28px 0 10px;text-transform:uppercase;letter-spacing:.06em}.idx-menu{max-width:560px;display:grid;gap:8px}@media(max-width:800px){header.idx-header{height:68px;padding:0 20px}main{padding:24px 20px 56px}}</style></head><body class="sui-root" data-sui-theme="light"><header class="idx-header"><span class="idx-brand">Sesama UI</span><span class="idx-tag">dev server</span></header><main><h1>Pick a destination</h1><p class="idx-sub">Component catalog, API preview, and application demos — the same menu order as the demos. ESM pages need HTTP; never open pages via file://.</p><section><h2>Design system</h2><div class="idx-menu">${designRows.join('')}</div></section>${categorySections.join('')}${section('Reference demos',referenceRows)}</main></body></html>`;
}
http.createServer(async(req,res)=>{try{let relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(relative==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(await indexPage());return}const target=path.resolve(root,'.'+relative),parts=path.relative(root,target).split(path.sep);if(parts.includes('..')||parts.some(part=>part.startsWith('.'))||!target.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return}if(!(await stat(target)).isFile()){res.writeHead(404);res.end('Not found');return}const data=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data)}catch{res.writeHead(404);res.end('Not found')}}).listen(port,'127.0.0.1',()=>console.log(`Sesama UI: http://127.0.0.1:${port}`));
