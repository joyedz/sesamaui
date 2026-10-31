const assert=require('node:assert/strict'),fs=require('node:fs'),{spawn}=require('node:child_process');
const browserName=process.env.BROWSER||'chromium',browserType=require(process.env.PLAYWRIGHT_PATH||'playwright')[browserName];
const port=Number(process.env.TEST_PORT||4188),base=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['tools/serve.mjs'],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe'],windowsHide:true});
let browser;
(async()=>{
  await new Promise((resolve,reject)=>{server.once('error',reject);server.once('exit',code=>reject(Error('Server exited: '+code)));server.stdout.once('data',resolve);server.stderr.once('data',data=>reject(Error(String(data))));});
  browser=await browserType.launch({headless:true,...(browserName==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  const page=await browser.newPage({viewport:{width:1280,height:900}}),requests=[],errors=[];
  page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{if(request.url().endsWith('.css'))requests.push(request.url());});
  async function fixture(component='all'){await page.goto(`${base}/tests/fixtures/components.html?component=${component}`);await page.waitForFunction(()=>window.fixtureReady);}
  for(const component of ['button','field','select','modal']){
    requests.length=0;await fixture(component);
    assert.ok(!requests.some(url=>/library\.css|legacy|charts|workspace|fonts/.test(url)),`${component} must load only its own CSS dependencies`);
    await page.evaluate(()=>{document.body.insertAdjacentHTML('beforeend','<button id="host-control" class="btn primary">Host button</button>');});
    const host=await page.locator('#host-control').evaluate(node=>{const s=getComputedStyle(node);return [s.fontSize,s.borderTopWidth,s.paddingTop,s.backgroundColor];});
    assert.deepEqual(host,['17px','3px','11px','rgb(255, 255, 0)'],'Component CSS does not reset host controls');
  }
  await fixture();
  assert.equal(await page.locator('[data-sui-select] .sx-select-trigger').first().evaluate(node=>getComputedStyle(node).paddingLeft),'8px','Aggregate CSS must not reset Select padding');
  assert.equal(await page.locator('.btn.base').first().evaluate(node=>node.getBoundingClientRect().height),30);
  await page.locator('#fixture-name').focus();
  await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'fixture-password');
  await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Show password');
  await page.keyboard.press('Space');assert.equal(await page.locator('#fixture-password').getAttribute('type'),'text');
  await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'fixture-error');
  const select=page.locator('[data-sui-select]').first(),trigger=select.locator('.sx-select-trigger');
  await trigger.focus();await page.keyboard.press('ArrowDown');assert.equal(await trigger.getAttribute('aria-expanded'),'true');
  await page.keyboard.press('End');assert.equal((await page.locator(':focus').textContent()).trim(),'Operations');
  await page.keyboard.press('Home');assert.equal((await page.locator(':focus').textContent()).trim(),'Design');
  await page.keyboard.press('e');assert.equal((await page.locator(':focus').textContent()).trim(),'Engineering');
  await page.keyboard.press('Enter');assert.equal(await select.locator('[data-sui-select-native]').inputValue(),'engineering');
  assert.match(await trigger.getAttribute('aria-labelledby'),/-label .*?-value/);
  await trigger.press('ArrowDown');await page.keyboard.press('Tab');assert.equal(await trigger.getAttribute('aria-expanded'),'false');
  assert.equal(await page.locator(':focus').evaluate(node=>node.closest('[data-sui-select]')?.querySelector('[data-sui-select-native]').name),'location');
  await trigger.focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('Shift+Tab');assert.equal(await trigger.getAttribute('aria-expanded'),'false');assert.equal(await page.locator(':focus').getAttribute('aria-label'),'Search projects');
  // Required Select provides visible, linked feedback and clears it after a choice.
  await page.locator('#fixture-name').fill('Amelia');
  await page.getByRole('button',{name:'Submit',exact:true}).click();
  const required=page.locator('[data-sui-required]'),requiredTrigger=required.locator('.sx-select-trigger');
  assert.equal(await requiredTrigger.getAttribute('aria-invalid'),'true');assert.equal(await required.locator('[data-sui-select-error]').isVisible(),true);
  await requiredTrigger.press('ArrowDown');await page.keyboard.press('Enter');assert.equal(await requiredTrigger.getAttribute('aria-invalid'),null);
  // Modal focus stays inside; Escape from a nested popup closes only that popup.
  const opener=page.getByRole('button',{name:'Review changes',exact:true});await opener.scrollIntoViewIfNeeded();const scroll=await page.evaluate(()=>window.scrollY);await opener.click();
  const dialog=page.locator('#fixture-modal');assert.equal(await dialog.evaluate(node=>node.contains(document.activeElement)),true);
  for(let i=0;i<8;i++){await page.keyboard.press('Tab');assert.equal(await dialog.evaluate(node=>node.contains(document.activeElement)),true);}
  await dialog.getByRole('button',{name:'Close dialog',exact:true}).focus();await page.keyboard.press('Shift+Tab');assert.equal(await page.locator(':focus').getAttribute('id'),'modal-confirm');
  const inner=dialog.locator('.sx-select-trigger');await inner.focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('Escape');assert.equal(await dialog.evaluate(node=>node.open),true);
  await page.keyboard.press('Escape');await page.waitForTimeout(50);assert.equal(await dialog.evaluate(node=>node.open),false);assert.equal(await opener.evaluate(node=>node===document.activeElement),true);assert.equal(await page.evaluate(()=>window.scrollY),scroll);
  await opener.click();assert.equal(await dialog.evaluate(node=>node.scrollTop),0);
  await inner.click();await page.evaluate(async()=>{const {initModal}=await import('/src/index.mjs');initModal(document.getElementById('fixture-modal')).close();});await page.waitForTimeout(50);assert.equal(await inner.getAttribute('aria-expanded'),'false');
  await opener.click();await inner.click();assert.equal(await inner.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');await page.keyboard.press('Escape');
  await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await trigger.evaluate(node=>getComputedStyle(node).transitionDuration),'0s');
  assert.deepEqual(errors,[]);
  fs.mkdirSync('.qa',{recursive:true});fs.writeFileSync(`.qa/keyboard-${browserName}.json`,JSON.stringify({browser:browserName,browserVersion:browser.version(),passed:true,checks:['independent CSS','host style isolation','keyboard toggle','disabled skipping','typeahead','Tab and Shift+Tab','required error feedback','modal focus trap','scroll preservation','nested popup lifecycle','reduced motion']},null,2));
  if(process.env.QA_SCREENSHOTS){fs.mkdirSync('.qa',{recursive:true});await page.goto(base+'/demos/Component%20API.html');await page.screenshot({path:'.qa/components-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'.qa/components-mobile.png',fullPage:true});await page.goto(base+'/demos/Orders.html');await page.setViewportSize({width:1440,height:900});await page.screenshot({path:'.qa/orders-css.png'});}
  console.log(`PASS ${browserName}: CSS isolation, host styles, keyboard, disabled skipping, typeahead, Tab order, error feedback, modal focus trap, scroll, nested popup lifecycle, reduced motion.`);
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server.kill();});
