/** Atualiza a versão de todos os módulos juntos para evitar arquivos antigos em cache. */
import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function versionAssets(root = fileURLToPath(new URL('../dist/', import.meta.url))) {
  const relative = ['index.html'];
  for (const folder of ['js','css']) {
    for (const name of (await readdir(resolve(root,folder))).sort()) {
      if (/\.(?:js|css)$/.test(name)) relative.push(`${folder}/${name}`);
    }
  }
  const normalize = source => source.replace(/((?:\.\.?\/|js\/|css\/)[^\s"'?]+\.(?:js|css))\?v=[a-f0-9]+/g, '$1');
  const entries = await Promise.all(relative.map(async name => ({ name, source: normalize(await readFile(resolve(root,name),'utf8')) })));
  const hash = createHash('sha256');
  for (const entry of entries) hash.update(entry.name).update('\0').update(entry.source).update('\0');
  const version = hash.digest('hex').slice(0,12);
  for (const {name,source} of entries) {
    const updated = source.replace(/((?:\.\.?\/|js\/|css\/)[^\s"'?]+\.(?:js|css))(?=["'])/g, `$1?v=${version}`);
    const filename = resolve(root,name);
    if (updated !== await readFile(filename,'utf8')) await writeFile(filename,updated,'utf8');
  }
  return version;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Versão dos arquivos: ${await versionAssets()}`);
}
