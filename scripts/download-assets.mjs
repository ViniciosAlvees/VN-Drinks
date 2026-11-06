/** Executado somente na preparação das fotos de exemplo. Não é necessário para usar o site. */
import { writeFile } from 'node:fs/promises';
const sources = [
  ['heineken.png', 'https://vinaritrade.com/UserFiles/products/09C99B1A-B54F-1DE5-DD2B-83D568F8A81F.png?cache=&q=100&w=600'],
  ['jack-daniels.png', 'https://giassi.vtexassets.com/arquivos/ids/2760057/Whisky-Old-No--7-Jack-Daniel-s-Garrafa-1l.png?v=638627604777500000'],
  ['absolut.png', 'https://kentstreetcellars.com.au/cdn/shop/products/Absolut-Vodka-1l_1200x1200.png?v=1625012720'],
  ['tanqueray.png', 'https://www.paodeacucar.com/img/uploads/1/359/33029359.png'],
  ['red-bull.jpg', 'https://www.sondadelivery.com.br/Arquivos/ProdutosSku/238261/1000007571-5.jpg'],
  ['beefeater-tradicional.png', 'https://camperdowncellars.com.au/cdn/shop/products/Beefeater700ml3-3_clipped_rev_1_2000x.png?v=1654146073'],
  ['beefeater-pink.png', 'https://laescocesa.com/cdn/shop/files/BeefeaterpinkStranberry700ml_1.png?v=1722630380'],
  ['heineken-zero.png', 'https://camperdowncellars.com.au/cdn/shop/products/Heineken0-0NonAlcoholicBeer_986f3fdc-bda8-4364-9b74-35da2b042179_2048x.png?v=1679706971'],
  ['corona.png', 'https://soaresemcasa.com.br/storage/uploads/CG2aj2rHtKbTbAYSd9GZ9YOPxmS6loFhsz2pEoNc.png'],
  ['corona-zero.jpg', 'https://images.tcdn.com.br/img/img_prod/854009/cerveja_zero_alcool_long_neck_330ml_corona_6283_1_a06a20565de99dd859b468d73d77719b.jpg'],
  ['red-label.png', 'https://product-media.edg.com.au/900934-1.png?h=640&impolicy=wowtofzcfpg&w=640'],
  ['white-horse-700ml.jpg', 'https://a-static.mlcdn.com.br/800x560/whisky-8-anos-white-horse-700ml/efacil/4500553/2b70c945c2e797bf3b6b9a60a8ca6b25.jpeg'],
  ['rocks.png', 'https://nossadistribuidorabebidas.com.br/wp-content/uploads/2021/12/gin-rocks-1l.png'],
  ['eternity.png', 'https://fenomenobebidas.com.br/wp-content/uploads/2025/11/15384599624-gin-eternity-london.png'],
  ['baly-morango-pessego.png', 'https://www.jauserve.com.br/dw/image/v2/BFJL_PRD/on/demandware.static/-/Sites-jauserve-master/default/dw4bfc328b/7898080665010.png?sw=1800'],
];
const filenames = process.argv.slice(2);
const selected = filenames.length ? sources.filter(([name]) => filenames.includes(name)) : sources;
const results = await Promise.allSettled(selected.map(async ([name,url]) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(25000), headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) throw new Error(`${name}: resposta não é imagem`);
  const data = Buffer.from(await response.arrayBuffer());
  await writeFile(new URL(`../public/assets/images/${name}`, import.meta.url), data);
  console.log(`${name}: ${data.length} bytes`);
}));
for (const result of results) if (result.status === 'rejected') { console.error(result.reason.message); process.exitCode = 1; }
