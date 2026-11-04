import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
test('4 November article is complete, crawlable and illustrated',async()=>{
 const root=new URL('../',import.meta.url);
 const html=await fs.readFile(new URL('site/blog/seguro-saude-internacional-com-ou-sem-eua/index.html',root),'utf8');
 assert.equal((html.match(/<h1(?:\s[^>]*)?>/g)||[]).length,1);
 assert.ok(html.includes("Seguro saúde internacional com ou sem EUA: como comparar a cobertura"));
 for(const heading of ["Internacional não significa uma única área de cobertura","Desenhe a sua rotina antes de desenhar o orçamento","Área de cobertura, rede e pagamento são decisões diferentes","Não conte com uma exceção que você ainda não verificou","Compare propostas equivalentes, não apenas dois preços"])assert.ok(html.includes(heading));
 assert.ok(html.includes('Imagem ilustrativa gerada por IA')||html.includes('imagem de capa ilustrativa gerada por IA'));
 assert.ok(html.includes('"@type":"Organization"'));
 const map=await fs.readFile(new URL('site/sitemap.xml',root),'utf8');
 assert.ok(map.includes('seguro-saude-internacional-com-ou-sem-eua'));
 assert.ok(html.includes('Fontes conferidas em 4 de novembro de 2026.'));
});
