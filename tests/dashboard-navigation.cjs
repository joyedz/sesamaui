const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const browserName = process.env.BROWSER || 'chromium';
const browserType = require(process.env.PLAYWRIGHT_PATH || 'playwright')[browserName];
const port = Number(process.env.TEST_PORT || 4193);
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
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}/demos/Dashboard%20overview.html`);
  await page.waitForSelector('.sb-main');
  await page.evaluate(() => {
    window.originalSidebar = document.querySelector('[data-sui-workspace-sidebar]');
    window.originalShell = document.querySelector('[data-sui-app-shell]');
  });
  async function go(key) {
    await page.locator(`[data-tree-key="${key}"]`).click();
    await page.waitForFunction(key => document.querySelector(`[data-tree-key="${key}"]`)?.getAttribute('aria-current') === 'page', key);
    assert.equal(await page.evaluate(() =>
      document.querySelector('[data-sui-workspace-sidebar]') === window.originalSidebar &&
      document.querySelector('[data-sui-app-shell]') === window.originalShell
    ), true, 'Navigation must retain the actual shell and sidebar DOM nodes');
    assert.equal(await page.evaluate(() => performance.getEntriesByType('navigation').length), 1);
  }
  await go('revenue');
  const select = page.locator('[name="revenue-period"]');
  await select.evaluate(control => control.closest('[data-sui-select]').querySelector('button').click());
  await page.getByRole('option', { name: 'Last 7 days', exact: true }).click();
  await go('orders');
  await page.getByRole('textbox', { name: 'Search orders', exact: true }).fill('ORD-2101');
  await go('customers');
  await go('orders');
  assert.equal(await page.locator('#order-search').inputValue(), 'ORD-2101');
  await page.locator('[data-order-details]').first().click();
  assert.equal(await page.locator('dialog[open]').count(), 1, 'Returning to Orders must not duplicate event handlers');
  await page.keyboard.press('Escape');
  await go('revenue');
  assert.equal(await page.locator('[name="revenue-period"]').inputValue(), 'Last 7 days');
  await page.goBack();
  await page.waitForSelector('#orders-results');
  await page.goForward();
  await page.waitForSelector('#revenue-content');
  await page.reload();
  await page.waitForSelector('#revenue-content');
  assert.equal(await page.locator('[name="revenue-period"]').inputValue(), 'Last 7 days');
  await page.goto(`${base}/demos/Orders.html?order=ORD-2101`);
  await page.waitForSelector('dialog[open]');
  await page.keyboard.press('Escape');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  }
  assert.deepEqual(errors, []);
  console.log(`${browserName}: Dashboard shell, history, filters, dialogs, and direct URLs passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (browser) await browser.close();
  server.kill();
});
