import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, readdir, stat } from 'node:fs/promises';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url))),port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.md':'text/plain; charset=utf-8'};
const categoryLabels={'dashboard':'Dashboard','ai-agent':'AI Agent','ai-bot':'AI Bot','issue':'Issue Workspace','onboarding':'Onboarding'};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
async function indexPage(){
  const demosRoot=path.join(root,'demos');
  const entries=await readdir(demosRoot,{withFileTypes:true});
  const section=(title,items)=>items.length?`<section><h2>${esc(title)}</h2><ul>${items.map(item=>`<li><a href="${item.href}">${esc(item.label)}</a></li>`).join('')}</ul></section>`:'';
  const categorySections=await Promise.all(entries.filter(entry=>entry.isDirectory()&&entry.name!=='shared').sort((a,b)=>a.name.localeCompare(b.name)).map(async entry=>{
    const files=(await readdir(path.join(demosRoot,entry.name))).filter(name=>name.endsWith('.html')).sort();
    return section(categoryLabels[entry.name]||entry.name,files.map(name=>({href:`/demos/${entry.name}/${encodeURIComponent(name)}`,label:name.replace(/\.html$/,'')})));
  }));
  const rootPages=(await readdir(demosRoot)).filter(name=>name.endsWith('.html')&&name!=='Component API.html').sort();
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sesama UI · dev server</title><style>body{font:14px/1.6 system-ui,sans-serif;margin:0;padding:40px 24px;background:#f6f6f3;color:#21211f}main{max-width:680px;margin:auto}h1{font-size:18px;font-weight:500}h2{font-size:13px;font-weight:500;color:#6f6f6b;margin:28px 0 8px}ul{list-style:none;margin:0;padding:0}li{padding:6px 0;border-bottom:1px solid rgba(0,0,0,.06)}a{color:#1f3acb;text-decoration:none}a:hover{text-decoration:underline}p{color:#6f6f6b}</style></head><body><main><h1>Sesama UI <span style="font-weight:400;color:#6f6f6b">· dev server</span></h1><p>ESM pages need HTTP; never open pages via file://.</p>${section('Design system',[{href:'/site/Design%20system.html',label:'Component catalog'},{href:'/demos/Component%20API.html',label:'Component API preview'}])}${categorySections.join('')}${section('Reference demos',rootPages.map(name=>({href:'/demos/'+encodeURIComponent(name),label:name.replace(/\.html$/,'')})))}</main></body></html>`;
}
http.createServer(async(req,res)=>{try{let relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(relative==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(await indexPage());return}const target=path.resolve(root,'.'+relative),parts=path.relative(root,target).split(path.sep);if(parts.includes('..')||parts.some(part=>part.startsWith('.'))||!target.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return}if(!(await stat(target)).isFile()){res.writeHead(404);res.end('Not found');return}const data=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data)}catch{res.writeHead(404);res.end('Not found')}}).listen(port,'127.0.0.1',()=>console.log(`Sesama UI: http://127.0.0.1:${port}`));
