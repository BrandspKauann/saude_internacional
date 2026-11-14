import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
test('Cigna search promise matches visible article, citation and quote destination',async()=>{
 const html=await fs.readFile(new URL('../site/blog/cigna-seguro-saude-internacional-brasil/index.html',import.meta.url),'utf8');
 assert.equal((html.match(/<h1>/g)||[]).length,1);
 assert.match(html,/<h1>Cigna no Brasil: compare cobertura, franquia e elegibilidade<\/h1>/);
 assert.match(html,/href="\/#solicitar-cotacao"/);
 assert.match(html,/cignaglobal.com\/individuals-families\/members\/resources\/frequently-asked-questions/);
 assert.doesNotMatch(html,/"@type":"FAQPage"/);
 assert.match(html,/"dateModified":"2026-11-13T15:00:00.000Z"/);
 assert.match(html,/Cigna no Brasil: compare cobertura, franquia e elegibilidade/);
 const home=await fs.readFile(new URL('../site/index.html',import.meta.url),'utf8');
 assert.match(home,/id="solicitar-cotacao"/);
 const map=await fs.readFile(new URL('../site/sitemap.xml',import.meta.url),'utf8');
 assert.match(map,/cigna-seguro-saude-internacional-brasil\/<\/loc><lastmod>2026-11-13<\/lastmod>/);
});
