const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{spawn}=require('node:child_process');
const browserName=process.env.BROWSER||'chromium';
const browserType=require(process.env.PLAYWRIGHT_PATH||'playwright')[browserName];
const port=Number(process.env.TEST_PORT||4186),base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['tools/serve.mjs'],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe'],windowsHide:true});
let browser;
(async()=>{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(Error('Server exited: '+code)));server.stdout.once('data',resolve);server.stderr.once('data',data=>reject(Error(data.toString())));});
  browser=await browserType.launch({headless:true,...(browserName==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[],failures=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('response',response=>{if(response.url().startsWith(base)&&response.status()>=400)failures.push(response.url());});
  for(const file of ['site/Sesama landing.html','site/Design system.html',...fs.readdirSync('demos').filter(name=>name.endsWith('.html')).map(name=>'demos/'+name)]){
    const response=await page.goto(base+'/'+file);assert.equal(response.status(),200,file);await page.waitForTimeout(150);
    console.log('Loaded '+file);
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
  await page.goto(base+'/demos/Component%20API.html');
  await page.waitForSelector('[data-sui-select]');
  await page.locator('#api-password').fill('secret');
  await page.getByRole('button',{name:'Show password',exact:true}).click();assert.equal(await page.locator('#api-password').getAttribute('type'),'text');
  await page.getByRole('button',{name:'Hide password',exact:true}).click();assert.equal(await page.locator('#api-password').getAttribute('type'),'password');
  await page.evaluate(()=>{window.events=[];document.addEventListener('sui:change',event=>window.events.push(event.detail));});
  const trigger=page.locator('[data-sui-select] .sx-select-trigger');await trigger.click();await page.getByRole('option',{name:'Engineering',exact:true}).click();
  assert.equal(await page.locator('select[name=team]').inputValue(),'engineering');
  assert.deepEqual(await page.evaluate(()=>window.events),[{name:'team',value:'engineering',previousValue:'design'}]);
  await trigger.focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('Home');await page.keyboard.press('Enter');assert.equal(await page.locator('select[name=team]').inputValue(),'design');
  await trigger.click();await page.keyboard.press('Escape');assert.equal(await trigger.getAttribute('aria-expanded'),'false');
  await trigger.click();await page.evaluate(()=>window.dispatchEvent(new Event('scroll')));assert.equal(await trigger.getAttribute('aria-expanded'),'false');
  await page.evaluate(async()=>{const {initSelect}=await import('/src/index.mjs');const node=document.querySelector('[data-sui-select]');const a=initSelect(node);if(a!==initSelect(node))throw Error('Init is not idempotent');window.events=[];a.setValue('engineering');});
  assert.deepEqual(await page.evaluate(()=>window.events),[]);
  await page.getByRole('button',{name:'Reset',exact:true}).click();assert.equal(await page.locator('select[name=team]').inputValue(),'design');
  const opener=page.getByRole('button',{name:'Open modal',exact:true});await opener.click();assert.equal(await page.locator('#api-modal').evaluate(node=>node.open),true);
  await page.keyboard.press('Escape');await page.waitForTimeout(50);assert.equal(await page.locator('#api-modal').evaluate(node=>node.open),false);assert.equal(await opener.evaluate(node=>node===document.activeElement),true);
  await page.evaluate(async()=>{const {initSelect}=await import('/src/index.mjs');const node=document.querySelector('[data-sui-select]');initSelect(node).destroy();});
  await trigger.click();assert.equal(await trigger.getAttribute('aria-expanded'),'false');
  await page.evaluate(async()=>{const {initSelect}=await import('/src/index.mjs');initSelect(document.querySelector('[data-sui-select]'));});
  await trigger.click();assert.equal(await trigger.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');
  await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(process.env.QA_SCREENSHOTS){
    fs.mkdirSync('.qa',{recursive:true});
    await page.screenshot({path:'.qa/api-mobile.png',fullPage:true});
    await page.setViewportSize({width:1440,height:900});await page.screenshot({path:'.qa/api-desktop.png',fullPage:true});
    await page.goto(base+'/demos/Orders.html');await page.screenshot({path:'.qa/orders-source.png'});
    await page.goto(base+'/Design%20system.html#components-select');await page.screenshot({path:'.qa/catalog-source.png'});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
  console.log('PASS: shared pages, module import, selection/events, password, reset, keyboard, scroll dismissal, modal focus, teardown and narrow layout.');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server.kill();});
