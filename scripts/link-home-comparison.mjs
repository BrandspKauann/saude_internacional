import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Keep contextual links in existing articles and when the scheduler regenerates them.
const articles = [
  ["blog/cigna-seguro-saude-internacional-brasil", "Antes de decidir pela Cigna, avalie como rede, franquia e reembolso se encaixam no seu uso. Na nossa", "comparação de seguro saúde internacional por perfil", "você encontra os critérios para organizar essa análise."],
  ["blog/best-doctors-insurance-excelencia-em-saude-internacional-premium", "Para avaliar a Best Doctors Insurance, coloque rede médica, reembolso e condições de utilização lado a lado. Veja como", "comparar opções de seguro saúde internacional para seu perfil", "antes de avançar em uma proposta."],
  ["blog/ever-insurance-seguro-saude-internacional", "Ao analisar a Ever Insurance, considere sua rotina no Brasil e no exterior, além das condições contratuais. Conheça nossa", "orientação para comparar seguro saúde internacional", "e organize as perguntas que importam para você."],
  ["blog/geoblue-seguro-saude-internacional-americano", "A avaliação de uma opção como a GeoBlue deve considerar residência, países de uso e elegibilidade do produto. Na nossa", "comparação de saúde internacional por perfil", "essas necessidades vêm antes da escolha da seguradora."],
  ["blog/seguro-internacional-vumi", "Na análise de uma proposta da VUMI, considere franquia, rede, reembolso e condições de aceitação. Veja nossa", "comparação de seguro saúde internacional para seu perfil", "para avaliar esses critérios no contexto da sua família."],
  ["blog/reembolso-medico-internacional-documentos-prazos-limites", "Depois de entender documentos e prazos, avalie como o reembolso funciona junto da rede médica e da franquia. Conheça nossa", "orientação para comparar seguro saúde internacional", "e confira quais critérios precisam entrar na sua análise."],
  ["blog/diferenca-entre-rede-direta-e-reembolso", "Rede direta e reembolso precisam ser avaliados pelo modo como você utiliza cuidados médicos. Veja como", "comparar rede, reembolso e franquias no seguro saúde internacional", "para organizar uma decisão adequada ao seu perfil."],
  ["blog/reembolso-problemas-seguro-saude", "Se o reembolso é uma preocupação, analise também limites, documentação e alternativas de rede. A nossa", "comparação de seguro saúde internacional por perfil", "ajuda a reunir esses critérios antes de escolher uma proposta."],
  ["blog/pre-existencia-o-que-declarar-saude-internacional", "A declaração de saúde deve ser considerada desde o início da comparação, junto das regras de aceitação de cada proposta. Conheça nossa", "orientação para avaliar opções de seguro saúde internacional", "e organize os critérios do seu cenário."],
  ["inteligencia/pre-existencias-seguro-saude-internacional", "Depois de organizar as informações para a declaração de saúde, avalie as condições de aceitação junto de rede, franquia e reembolso. Veja como", "comparar opções de seguro saúde internacional para seu perfil", "com orientação especializada."],
];

const marker = "data-home-comparison-link";
let changed = 0;

for (const [route, before, label, after] of articles) {
  const file = fileURLToPath(new URL(`../site/${route}/index.html`, import.meta.url));
  const html = await readFile(file, "utf8");
  if (html.includes(marker)) continue;

  const paragraph = `<p ${marker}>${before} <a href="/" style="color:var(--teal);text-decoration:underline;text-underline-offset:.18em">${label}</a> ${after}</p>`;
  const articleBodyEnd = '</div><section class="article-tags"';
  const consultingNote = '<div class="note"><strong>Resumo consultivo:';
  let updated;

  if (route.startsWith("blog/") && html.includes(articleBodyEnd)) {
    updated = html.replace(articleBodyEnd, `<section class="article-block">${paragraph}</section>${articleBodyEnd}`);
  } else if (route.startsWith("inteligencia/") && html.includes(consultingNote)) {
    updated = html.replace(consultingNote, `${paragraph}${consultingNote}`);
  } else {
    throw new Error(`Contextual home link insertion point not found: ${route}`);
  }

  await writeFile(file, updated);
  changed++;
}

console.log(`Contextual home comparison links: ${articles.length} articles checked, ${changed} updated.`);
