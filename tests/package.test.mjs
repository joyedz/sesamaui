import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const pkgPath = path.resolve('package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

test('Package manifest: metadata and module configuration', () => {
  assert.equal(pkg.name, 'sesama-ui', 'Package must publish under the sesama-ui name');
  assert.match(pkg.version, /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/, 'Version must follow semver format');
  assert.equal(pkg.type, 'module', 'Package must be ES module (type: module)');
  assert.notEqual(pkg.private, true, 'Package must be publishable; intentional publication is now allowed');
  assert.ok(fs.existsSync(pkg.main), `Main entry ${pkg.main} must exist on disk`);
  assert.ok(fs.existsSync(pkg.types), `Types entry ${pkg.types} must exist on disk`);
  assert.ok(Array.isArray(pkg.files), 'Package files array must be declared');
  for (const file of pkg.files) {
    assert.ok(fs.existsSync(file), `Declared package file/dir ${file} must exist on disk`);
  }
});

test('Package export map: all public targets exist on disk', () => {
  assert.ok(pkg.exports, 'Package exports field must be defined');

  for (const [subpath, target] of Object.entries(pkg.exports)) {
    if (subpath.includes('*')) continue; // Skip wildcard patterns in static path check

    if (typeof target === 'string') {
      const resolved = path.resolve(target);
      assert.ok(fs.existsSync(resolved), `Export ${subpath} -> ${target} does not exist on disk`);
    } else if (typeof target === 'object' && target !== null) {
      if (target.default) {
        const resolved = path.resolve(target.default);
        assert.ok(fs.existsSync(resolved), `Export ${subpath}.default -> ${target.default} does not exist on disk`);
      }
      if (target.types) {
        const resolved = path.resolve(target.types);
        assert.ok(fs.existsSync(resolved), `Export ${subpath}.types -> ${target.types} does not exist on disk`);
      }
    }
  }
});

test('Package export map: covers all 48 canonical components and key subpaths', () => {
  const expectedComponentSubpaths = [
    './button', './input', './input-field', './select', './modal',
    './badge', './status-dot', './avatar', './label', './divider',
    './card', './banner', './empty-state', './loader', './skeleton',
    './scroll-area', './checkbox', './radio', './switch', './textarea',
    './chip', './menu', './menu-item', './popover', './dropdown-menu',
    './tooltip', './toast', './button-group', './command-palette', './combobox',
    './date-picker', './tag-input', './tabs', './breadcrumbs', './tree',
    './list-row', './toolbar', './collapsible', './table', './pagination',
    './chart', './wire', './canvas', './file-card', './message',
    './tool-call', './agent-run', './composer'
  ];

  for (const sub of expectedComponentSubpaths) {
    assert.ok(pkg.exports[sub], `Missing canonical export in package.json: ${sub}`);
  }

  // Key system subpaths
  assert.ok(pkg.exports['.'], 'Missing root "." export');
  assert.ok(pkg.exports['./blocks'], 'Missing "./blocks" export');
  assert.ok(pkg.exports['./icons'], 'Missing "./icons" export');
  assert.ok(pkg.exports['./runtime'], 'Missing "./runtime" export');
  assert.ok(pkg.exports['./css/components.css'], 'Missing "./css/components.css" export');
  assert.ok(pkg.exports['./css/blocks.css'], 'Missing "./css/blocks.css" export');
});

test('Package module resolution: subpath modules import cleanly in Node without DOM globals', async () => {
  // Test root import
  const root = await import('../src/index.mjs');
  assert.equal(typeof root.button, 'function');
  assert.equal(typeof root.appShell, 'function');
  assert.equal(typeof root.mount, 'function');

  // Test individual component imports
  const btnMod = await import('../src/components/button.mjs');
  assert.equal(typeof btnMod.button, 'function');
  assert.ok(btnMod.button({ label: 'Test' }).includes('sui-button'));

  const inputMod = await import('../src/components/input.mjs');
  assert.equal(typeof inputMod.input, 'function');
  assert.equal(typeof inputMod.initInput, 'function');

  const tableMod = await import('../src/components/table.mjs');
  assert.equal(typeof tableMod.table, 'function');
  assert.equal(typeof tableMod.initTable, 'function');

  // Test blocks subpath import
  const blocksMod = await import('../src/blocks/index.mjs');
  assert.equal(typeof blocksMod.appShell, 'function');
  assert.equal(typeof blocksMod.workspaceSidebar, 'function');
  assert.equal(typeof blocksMod.dataSection, 'function');

  // Test icons subpath import
  const iconsMod = await import('../src/icons/index.mjs');
  assert.equal(typeof iconsMod.controlIcon, 'function');
  assert.ok(iconsMod.controlIcon('check').includes('<svg'));

  // Test runtime subpath import
  const runtimeMod = await import('../src/runtime.mjs');
  assert.equal(typeof runtimeMod.mount, 'function');
  assert.equal(typeof runtimeMod.registerController, 'function');
});

test('Package packaging: npm pack dry-run generates tarball with all required files', () => {
  const result = execSync('npm pack --dry-run --json', { encoding: 'utf8' });
  const packInfo = JSON.parse(result);
  assert.ok(Array.isArray(packInfo) && packInfo.length > 0, 'npm pack must output array of tarball metadata');

  const tarball = packInfo[0];
  assert.ok(tarball.files && tarball.files.length > 0, 'Tarball must contain files');

  const paths = new Set(tarball.files.map(f => f.path));

  // Check critical source files
  assert.ok(paths.has('src/index.mjs'), 'Tarball must contain src/index.mjs');
  assert.ok(paths.has('src/index.d.mts'), 'Tarball must contain src/index.d.mts');
  assert.ok(paths.has('src/styles/components.css'), 'Tarball must contain components.css');
  assert.ok(paths.has('src/styles/blocks.css'), 'Tarball must contain blocks.css');
  assert.ok(paths.has('src/styles/fonts.css'), 'Tarball must contain fonts.css');
  assert.ok(paths.has('src/blocks/index.mjs'), 'Tarball must contain src/blocks/index.mjs');
  assert.ok(paths.has('src/icons/index.mjs'), 'Tarball must contain src/icons/index.mjs');

  // Check licenses and notices
  assert.ok(paths.has('LICENSE'), 'Tarball must contain LICENSE');
  assert.ok(paths.has('NOTICE'), 'Tarball must contain NOTICE');
  assert.ok(paths.has('README.md'), 'Tarball must contain README.md');
});
