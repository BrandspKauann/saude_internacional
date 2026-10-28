import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
test('weekly international health article is original and has a truthful byline',async()=>{
 const slug='autorizacao-previa-internacao-seguro-saude-internacional';
 const html=await fs.readFile(new URL('../site/blog/'+slug+'/index.html',import.meta.url),'utf8');
 assert.equal((html.match(/<h1>/g)||[]).length,1);
 assert.match(html,/"@type":"Organization","name":"Saúde Internacional"/);
 assert.match(html,/Conteúdo editorial/);
 assert.doesNotMatch(html,/Como conduzir a análise|Consultor em saúde internacional<\/span>/);
 assert.ok(html.includes('Cigna Global: utilização'));
 assert.ok(html.includes('Imagem ilustrativa gerada por IA.'));
 assert.ok((await fs.stat(new URL('../site/assets/blog/'+slug+'.webp',import.meta.url))).size<150000);
 const map=await fs.readFile(new URL('../site/sitemap.xml',import.meta.url),'utf8');
 assert.ok(map.includes('https://www.saudeinternacional.com.br/blog/'+slug+'/</loc><lastmod>2026-10-28'));
});
