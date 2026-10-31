const assert=require('node:assert/strict'),fs=require('node:fs'),{spawn}=require('node:child_process');
const browserName=process.env.BROWSER||'chromium';
const browserType=require(process.env.PLAYWRIGHT_PATH||'playwright')[browserName];
const axePath=require.resolve('axe-core/axe.min.js');
const port=Number(process.env.TEST_PORT||4187),base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['tools/serve.mjs'],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe'],windowsHide:true});
let browser;const results=[];
(async()=>{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(Error('Server exited: '+code)));server.stdout.once('data',resolve);server.stderr.once('data',data=>reject(Error(String(data))));});
  browser=await browserType.launch({headless:true,...(browserName==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  async function audit(name){
    const missing=await page.evaluate(()=>[...document.querySelectorAll('[aria-controls],[aria-labelledby],[aria-describedby],[aria-errormessage]')].flatMap(node=>['aria-controls','aria-labelledby','aria-describedby','aria-errormessage'].flatMap(attribute=>(node.getAttribute(attribute)||'').split(/\s+/).filter(Boolean).filter(id=>!document.getElementById(id)).map(id=>({attribute,id})))));
    assert.deepEqual(missing,[],'All ARIA ID references resolve, including closed popovers');
    await page.addScriptTag({path:axePath});
    const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
    assert.deepEqual(result.incomplete.filter(item=>item.id!=='aria-valid-attr-value').map(item=>item.id),[],'Unexpected manual-review findings must be investigated');
    const record={name,violations:result.violations.map(({id,impact,help,nodes})=>({id,impact,help,nodes:nodes.map(({target,failureSummary})=>({target,failureSummary}))})),incomplete:result.incomplete.map(({id,nodes})=>({id,nodes:nodes.map(({target,failureSummary})=>({target,failureSummary}))})),passes:result.passes.length};
    results.push(record);console.log(JSON.stringify({...record,incomplete:record.incomplete.map(item=>({id:item.id,count:item.nodes.length}))}));
  }
  for(const theme of ['light','dark']){
    await page.goto(`${base}/tests/fixtures/components.html?theme=${theme}`);await page.waitForFunction(()=>window.fixtureReady);
    await audit(`${theme}: default, error, disabled, readonly`);
    await page.locator('#fixture-name').fill('Amelia');await page.getByRole('button',{name:'Submit',exact:true}).click();
    await audit(`${theme}: required select error`);await page.getByRole('button',{name:'Reset',exact:true}).click();
    await page.locator('[data-sui-select]').first().locator('.sx-select-trigger').click();await audit(`${theme}: grouped select open`);await page.keyboard.press('Escape');
    await page.getByRole('button',{name:'Review changes',exact:true}).click();await audit(`${theme}: modal open`);
    const dialog=page.locator('#fixture-modal');
    await dialog.locator('.sx-select-trigger').click();await audit(`${theme}: select inside modal`);await page.keyboard.press('Escape');await page.keyboard.press('Escape');
  }
  await page.setViewportSize({width:320,height:800});await page.goto(`${base}/tests/fixtures/components.html`);await page.waitForFunction(()=>window.fixtureReady);await audit('320px reflow');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal document overflow at 320px');
  await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});await audit('forced colors and reduced motion');
  assert.deepEqual(errors,[]);
  fs.mkdirSync('.qa',{recursive:true});fs.writeFileSync(`.qa/a11y-results-${browserName}.json`,JSON.stringify({browser:browserName,browserVersion:browser.version(),axeVersion:require('axe-core/package.json').version,results},null,2));
  assert.equal(results.reduce((sum,result)=>sum+result.violations.length,0),0,'Accessibility violations; see .qa/a11y-results-'+browserName+'.json');
  console.log('PASS: '+results.length+' axe states. Manual screen-reader review remains separate.');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server.kill();});
