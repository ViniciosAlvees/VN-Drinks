import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { versionAssets } from '../scripts/version-assets.mjs';

test('HTML, CSS e módulos usam a mesma versão e mudanças no catálogo renovam todos', async () => {
  const root = await mkdtemp(join(tmpdir(),'vn-drinks-version-'));
  await mkdir(join(root,'js')); await mkdir(join(root,'css'));
  await writeFile(join(root,'index.html'), '<link href="css/styles.css"><script src="js/app.js"></script>');
  await writeFile(join(root,'js','app.js'), "import {value} from './catalog.js';");
  await writeFile(join(root,'js','catalog.js'), 'export const value=1;');
  await writeFile(join(root,'css','styles.css'), 'body{color:black}');
  const first = await versionAssets(root);
  assert.match(await readFile(join(root,'index.html'),'utf8'), new RegExp(`js/app.js\\?v=${first}`));
  assert.match(await readFile(join(root,'js','app.js'),'utf8'), new RegExp(`catalog.js\\?v=${first}`));
  assert.equal(await versionAssets(root), first, 'A versão deve ficar estável sem mudanças');
  await writeFile(join(root,'js','catalog.js'), 'export const value=2;');
  const second = await versionAssets(root);
  assert.notEqual(second,first);
  const html = await readFile(join(root,'index.html'),'utf8');
  assert.ok(html.includes(`css/styles.css?v=${second}`));
  assert.ok(html.includes(`js/app.js?v=${second}`));
  assert.ok((await readFile(join(root,'js','app.js'),'utf8')).includes(`catalog.js?v=${second}`));
});
