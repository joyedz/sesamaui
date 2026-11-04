const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const browserName = process.env.BROWSER || 'chromium';
const browserType = require(process.env.PLAYWRIGHT_PATH || 'playwright')[browserName];
const port = Number(process.env.TEST_PORT || 4199);
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['tools/serve.mjs'], {
  env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true
});
let browser;
(async () => {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.once('exit', code => reject(Error('Server exited: ' + code)));
    server.stdout.once('data', resolve);
    server.stderr.once('data', data => reject(Error(String(data))));
  });
  browser = await browserType.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.install();
  await page.goto(`${base}/demos/AI%20agents%20demo.html#chat/new`);
  const input = page.locator('#compose textarea');
  await input.waitFor();
  const fallback = await input.getAttribute('placeholder');
  const ringRoom = await page.locator('[data-sui-composer]').evaluate(node => {
    const own = node.getBoundingClientRect(), wrapper = node.parentElement.getBoundingClientRect();
    return { top: own.top - wrapper.top, bottom: wrapper.bottom - own.bottom };
  });
  assert.ok(ringRoom.top >= 2 && ringRoom.bottom >= 2, 'The Composer focus ring needs space inside its wrapper');

  await page.clock.runFor(1500);
  assert.match(await input.getAttribute('placeholder'), /^Deep research/);
  assert.equal(await input.inputValue(), '');
  assert.equal(await page.locator('#compose [data-send]').isDisabled(), true);
  await page.clock.runFor(1500);
  const full = await input.getAttribute('placeholder');
  assert.match(full, /future of work\.\.\.$/);
  await page.clock.runFor(1500);
  assert.ok((await input.getAttribute('placeholder')).length < full.length, 'The suggestion must erase before changing');
  await page.clock.runFor(1500);
  assert.match(await input.getAttribute('placeholder'), /^Build a/);
  assert.match(await page.locator('.agent-compose').evaluate(node => getComputedStyle(node, '::before').backgroundImage), /linear-gradient/);

  await input.fill('My actual prompt');
  assert.equal(await input.inputValue(), 'My actual prompt');
  await input.fill('');
  await page.clock.runFor(10000);
  assert.equal(await input.getAttribute('placeholder'), fallback, 'Editing permanently stops suggestions for this visit');
  await page.locator('[data-tree-key="history-office"]').click();
  assert.equal(await page.locator('.agent-main').evaluate(node => node.classList.contains('is-new-chat')), false);
  assert.equal(await page.locator('.agent-compose').evaluate(node => getComputedStyle(node, '::before').content), 'none');

  const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const quietPage = await reduced.newPage();
  quietPage.on('pageerror', error => errors.push(error.message));
  await quietPage.clock.install();
  await quietPage.goto(`${base}/demos/AI%20agents%20demo.html#chat/new`);
  const quietInput = quietPage.locator('#compose textarea');
  assert.equal(await quietInput.getAttribute('placeholder'), 'Deep research about the future of work...');
  await quietPage.clock.runFor(6000);
  assert.equal(await quietInput.getAttribute('placeholder'), 'Deep research about the future of work...');
  await quietPage.evaluate(() => { document.documentElement.dataset.mode = 'dark'; document.documentElement.dataset.suiTheme = 'dark'; });
  assert.equal(await quietPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await reduced.close();

  const draftPage = await browser.newPage();
  await draftPage.addInitScript(() => localStorage.setItem('sesama:demo:v1:ai-agent', JSON.stringify({draft:'Saved project brief',route:'#chat/new'})));
  await draftPage.clock.install();
  await draftPage.goto(`${base}/demos/AI%20agents%20demo.html#chat/new`);
  await draftPage.clock.runFor(6000);
  assert.equal(await draftPage.locator('#compose textarea').inputValue(), 'Saved project brief');
  assert.equal(await draftPage.locator('#compose textarea').getAttribute('placeholder'), fallback);
  assert.deepEqual(errors, []);
  console.log(`${browserName}: New Chat gradient, type/erase loop, user-input stop, draft preservation, and reduced motion passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  server.kill();
});
