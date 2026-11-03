import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const html = await fs.readFile(new URL('../site/index.html', import.meta.url), 'utf8');
const diagnosticUi = await fs.readFile(new URL('../site/assets/diagnostic-ui.js', import.meta.url), 'utf8');
test('home aligns search snippet, H1 and quote action without changing lead delivery', () => {
  assert.equal((html.match(/<title>/g)||[]).length, 1);
  assert.equal((html.match(/<h1\b/g)||[]).length, 1);
  assert.equal((html.match(/<meta\s+name="description"/g)||[]).length, 1);
  assert.match(html, /<title>Seguro Saúde Internacional: compare planos e solicite cotação<\/title>/);
  assert.match(html, /Solicitar minha cotação/);
  assert.match(html, /id="comparar-planos"/);
  assert.match(html, /href="https:\/\/www\.saudeinternacional\.com\.br\/"/);
  assert.match(html, /action="https:\/\/formspree\.io\/f\/xvznbqab"/);
  assert.match(diagnosticUi, /generate_lead/);
  assert.doesNotMatch(html, /<meta name="robots" content="noindex"/);
});
test('new editorial links resolve to existing static articles', async () => {
  for (const slug of ['diferenca-entre-rede-direta-e-reembolso','seguro-viagem-cartao-credito-saude-internacional-diferencas']) {
    const article = await fs.readFile(new URL(`../site/blog/${slug}/index.html`, import.meta.url), 'utf8');
    assert.match(article, /<h1\b/);
  }
});

test('home keeps diagnosis and direct quote as separate conversion paths', () => {
  assert.match(html, /Faça o seu diagnóstico gratuito/);
  assert.match(html, /data-direct-quote-open[^>]*>[\s\S]*Solicite sua cotação/);
  assert.match(html, /id="solicitar-cotacao"/);
  assert.match(html, /name="idades_participantes"/);
  assert.match(html, /name="uso_cobertura"/);
  assert.match(html, /name="nome"/);
  assert.match(html, /name="whatsapp"/);
  assert.match(html, /name="email"/);
});
