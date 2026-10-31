import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import postcss from 'postcss';

async function imports(file,seen=new Set()){
  if(seen.has(file.href))return seen;seen.add(file.href);
  const ast=postcss.parse(await readFile(file,'utf8'));
  const children=[];ast.walkAtRules('import',node=>{const value=node.params.match(/url\("([^"]+)"\)/)?.[1];if(value)children.push(new URL(value,file));});
  for(const child of children)await imports(child,seen);return seen;
}
for(const component of ['button','field','select','modal','badge','status-dot','avatar','label','divider','card','banner','empty-state','loader','skeleton','scroll-area','checkbox','radio','switch','textarea','chip','menu','popover','dropdown-menu','tooltip','toast','button-group','command-palette','combobox','date-picker','tag-input','tabs','breadcrumbs','tree','list-row','toolbar','collapsible','table','pagination','chart','wire','canvas','file-card','message','tool-call','agent-run','composer'])test(`${component} CSS has an independent, scoped dependency graph`,async()=>{
  const entry=new URL(`../src/styles/components/${component}.css`,import.meta.url),files=await imports(entry);
  for(const file of files){assert.doesNotMatch(file,/legacy|library\.css|charts\.css|workspace-blocks\.css|fonts\.css/);
    if(file.endsWith('/tokens.css'))continue;
    const ast=postcss.parse(await readFile(new URL(file),'utf8'));ast.walkRules(rule=>{if(rule.parent?.type==='atrule'&&/keyframes/i.test(rule.parent.name))return;assert.match(rule.selector,/sui-root/,`${file}: ${rule.selector} leaks into host styles`);});
  }
  if(component==='button')assert.equal([...files].some(file=>/field|select|modal/.test(file)),false);
});

for(const block of ['app-shell','workspace-sidebar','page-header','page-layout','page-grid','content-section','data-section','people-list','activity-feed','metric-card','chart-section','recipes'])test(`${block} block CSS has an independent, scoped dependency graph`,async()=>{
  const entry=new URL(`../src/styles/blocks/${block}.css`,import.meta.url),files=await imports(entry);
  for(const file of files){assert.doesNotMatch(file,/legacy|library\.css|charts\.css|workspace-blocks\.css|fonts\.css/);
    if(file.endsWith('/tokens.css'))continue;
    const ast=postcss.parse(await readFile(new URL(file),'utf8'));ast.walkRules(rule=>{if(rule.parent?.type==='atrule'&&/keyframes/i.test(rule.parent.name))return;assert.match(rule.selector,/sui-root/,`${file}: ${rule.selector} leaks into host styles`);});
  }
});
