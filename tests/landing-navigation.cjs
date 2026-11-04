const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const browserName = process.env.BROWSER || 'chromium';
const browserType = require(process.env.PLAYWRIGHT_PATH || 'playwright')[browserName];
const port = Number(process.env.TEST_PORT || 4196);
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
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  const desktop = page.locator('#lp-header-navigation');
  const demo = desktop.getByRole('button', { name: 'Demo', exact: true });
  await demo.hover();
  await page.waitForSelector('#landing-demo:popover-open');
  assert.equal(await page.locator('#landing-demo section').count(), 4);
  await demo.click();
  assert.equal(await demo.getAttribute('aria-expanded'), 'true', 'Clicking a hovered trigger must not dismiss it');
  await page.locator('#landing-demo a').last().hover();
  await page.waitForTimeout(250);
  assert.equal(await demo.getAttribute('aria-expanded'), 'true');
  await desktop.getByRole('button', { name: 'Components', exact: true }).hover();
  assert.equal(await demo.getAttribute('aria-expanded'), 'false');
  await page.waitForSelector('#landing-components:popover-open');
  await page.mouse.move(1300, 700);
  await page.waitForTimeout(250);
  assert.equal(await page.locator('[data-landing-navigation] :popover-open').count(), 0);
  await demo.focus();
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Overview');
  await page.keyboard.press('Escape');
  assert.equal(await demo.getAttribute('aria-expanded'), 'false');
  assert.equal(await demo.evaluate(button => document.activeElement === button), true);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Revenue');
  await page.keyboard.press('Escape');

  await page.waitForFunction(() => [...document.querySelectorAll('[data-catalog-count]')].every(node => /^\d+$/.test(node.textContent)));
  assert.equal(await page.locator('.lp-stat-stage').count(), 0);
  assert.equal(await page.locator('.lp-inside').evaluate(node => getComputedStyle(node).borderRadius),
    await page.locator('.lp-bento-grid').evaluate(node => getComputedStyle(node).borderRadius));

  await page.getByRole('tab', { name: /^Agent Bot/ }).click();
  await page.frameLocator('#app-preview').locator('#bot-composer').waitFor();
  assert.equal(await page.locator('#open-demo').getAttribute('href'), '/demos/ai-bot/Agent%20Bot.html');

  const touch = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const mobile = await touch.newPage();
  mobile.on('pageerror', error => errors.push(error.message));
  await mobile.goto(base);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await mobile.locator('#lp-mobile-navigation button').tap();
  await mobile.waitForSelector('#landing-mobile-demo:popover-open');
  await mobile.waitForTimeout(200);
  const bounds = await mobile.locator('#landing-mobile-demo').boundingBox();
  assert.ok(bounds.x >= 8 && bounds.x + bounds.width <= 382, 'The panel must remain within mobile viewport bounds');
  assert.equal(await mobile.locator('#landing-mobile-demo a').count(), 12);
  const originalURL = mobile.url();
  const opened = mobile.waitForEvent('popup');
  await mobile.locator('#landing-mobile-demo').getByRole('link', { name: 'Orders', exact: true }).tap();
  const orderPage = await opened;
  await orderPage.waitForURL('**/Orders.html');
  await orderPage.waitForSelector('#orders-results');
  assert.equal(mobile.url(), originalURL);
  assert.equal(await orderPage.evaluate(() => window.opener === null), true);
  assert.equal(await page.locator('#landing-components a:not([target="_blank"])').count(), 0);
  assert.deepEqual(errors, []);
  console.log(`${browserName}: landing navigation, statistics corners, and touch navigation passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  server.kill();
});
