import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const siteDir = path.join(rootDir, "site");
const blogDir = path.join(siteDir, "blog");
const assetsDir = path.join(siteDir, "assets", "blog");
const contentDir = path.join(rootDir, "content");
const scheduledPath = path.join(contentDir, "scheduled-posts.json");
const postsPath = path.join(blogDir, "posts.json");
const sitemapPath = path.join(siteDir, "sitemap.xml");
const origin = "https://www.saudeinternacional.com.br";

const now = process.env.PUBLISH_NOW ? new Date(process.env.PUBLISH_NOW) : new Date();

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const stripTags = (value = "") => String(value).replace(/<[^>]*>/g, "");
const formatDate = (iso) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(iso));

const header = (current = "") => `<!doctype html><html lang="pt-BR"><head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CK6GNJTH3T"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-CK6GNJTH3T');
</script>`;

const topbar = (blogCurrent = false) => `<header class="topbar"><div class="shell nav"><a class="brand" href="/" aria-label="Saúde Internacional"><span><strong>Saúde Internacional</strong><span>by hirayama</span></span></a><nav class="nav-links" aria-label="Navegação principal"><a href="/">Início</a><a href="/blog/"${blogCurrent ? ' aria-current="page"' : ""}>Blog</a><a href="/#cotacao">Mapeamento</a><details class="service-menu"><summary>Outros serviços</summary><div class="service-menu-panel"><a href="https://www.hirayamacorretora.com.br/" target="_blank" rel="noopener">Hirayama Corretora</a><a href="https://www.segurosdecredito.com.br/" target="_blank" rel="noopener">Seguro de Crédito</a><a href="https://www.consultoriavr.com.br/" target="_blank" rel="noopener">Consultoria VR</a><a href="https://consorcio-hirayama-eeva.vercel.app/" target="_blank" rel="noopener">Consórcio Platinum</a></div></details></nav><a class="btn btn-primary" href="/#cotacao">Entenda seu cenário</a></div></header>`;

const footer = () => `<footer class="footer" id="contato"><div class="shell"><div class="footer-cta"><div><span class="footer-eyebrow">Saúde Internacional</span><h2>Entenda antes de contratar.</h2><p>Uma conversa consultiva começa pelo cenário, não pela tabela. Quando fizer sentido, a contratação é conduzida por corretora parceira legalmente habilitada.</p></div><a class="btn btn-gold" href="/#cotacao">Converse sobre o seu cenário</a></div><div class="footer-grid"><div class="footer-brand"><div><strong>Saúde Internacional</strong><span>by hirayama</span><p>Centro consultivo de inteligência em saúde internacional para decisões médicas, familiares e patrimoniais mais conscientes.</p></div></div><div class="footer-col"><h3 class="footer-title">Contato</h3><div class="footer-lines"><p>Matriz: Biritiba Mirim / Centro / SP</p><p>Filial: São Paulo / Bela Vista / SP</p><p><a href="mailto:contato@hirayamacorretora.com.br">contato@hirayamacorretora.com.br</a></p><p><a href="tel:+551146922643">(11) 4692-2643</a> / <a href="tel:+5511938020789">(11) 9-3802-0789</a></p></div></div><div class="footer-col"><h3 class="footer-title">Navegação</h3><nav class="footer-nav" aria-label="Navegação do rodapé"><a href="/">Início</a><a href="/blog/">Blog</a><a href="/#cotacao">Mapeamento</a></nav></div><div class="footer-col"><h3 class="footer-title">Redes</h3><div class="footer-social-list"><a href="https://www.linkedin.com/in/ewertonhirayama/" target="_blank" rel="noopener">LinkedIn</a><a href="https://www.instagram.com/ewertonhirayamaoficial" target="_blank" rel="noopener">Instagram</a><a href="https://www.youtube.com/@HirayamaCorretora" target="_blank" rel="noopener">YouTube</a><a href="https://www.tiktok.com/@ewertonhirayama" target="_blank" rel="noopener">TikTok</a></div><p class="footer-note">A Hirayama atua como consultoria especializada. A contratação de seguros internacionais é realizada pela FDS Seguros quando aplicável.</p></div></div><div class="footer-bottom"><span>© 2024 Hirayama. Site idealizado por Ewerton Hirayama | Consultor de Benefícios.</span><a href="#topo">Voltar ao topo</a></div></div></footer></body></html>`;

const toPostMeta = (draft) => ({
  title: draft.title,
  slug: draft.slug,
  category: draft.category,
  description: draft.description,
  date: draft.publishAt,
  readTime: draft.readTime ?? 7,
  image: `/assets/blog/${draft.image}`,
  sourceUrl: `${origin}/blog/${draft.slug}/`,
  keywords: draft.keywords,
  hashtags: draft.hashtags,
});

const sectionHtml = (post) => {
  const paragraphs = [
    {
      title: "O ponto central",
      body: [
        `Quando o tema é ${post.focus.toLowerCase()}, a decisão raramente se resume a preço, hospital ou nome da seguradora. A pergunta mais importante é entender o que esse assunto muda na prática para a família, para o patrimônio e para a continuidade do acesso à saúde.`,
        post.angle,
      ],
    },
    {
      title: "Por que isso aparece na saúde internacional",
      body: [
        `A saúde internacional funciona com uma lógica diferente da maioria dos planos nacionais. Ela pode envolver análise de aceitação, declaração de saúde, franquia anual, rede parceira, reembolso e regras específicas para utilização em diferentes países.`,
        `Por isso, comparar apenas uma tabela pode levar a uma leitura incompleta. O que parece detalhe técnico no início pode se tornar decisivo em uma internação, cirurgia, tratamento contínuo ou mudança familiar.`
      ],
    },
    {
      title: "Onde as pessoas costumam errar",
      body: [
        post.commonMistake,
        `Outro erro comum é presumir que todos os contratos funcionam do mesmo modo. Em saúde internacional, duas propostas visualmente parecidas podem ter diferenças relevantes em elegibilidade, autorização prévia, franquia, exclusões, limites e dinâmica de reembolso.`,
      ],
    },
    {
      title: "O que muda na prática",
      body: [
        post.practicalImpact,
        `A leitura consultiva ajuda a transformar uma escolha abstrata em perguntas concretas: onde você pretende usar a cobertura, quem precisa estar protegido, qual desembolso seria aceitável, que histórico médico precisa ser declarado e qual modelo continua fazendo sentido daqui a alguns anos.`,
      ],
    },
    {
      title: "Perguntas antes de decidir",
      body: post.questions,
      list: true,
    },
    {
      title: "Quando pode fazer sentido",
      body: [
        post.whenItMatters,
        `Isso não significa que o seguro saúde internacional será sempre a melhor resposta. Em alguns perfis, manter um plano nacional, revisar o contrato atual ou combinar soluções pode ser mais coerente. A boa decisão nasce do cenário, não do impulso.`,
      ],
    },
    {
      title: "Como conduzir a análise",
      body: [
        `O caminho mais seguro é organizar dados antes de pedir qualquer proposta: idade dos envolvidos, país de residência, frequência de viagens, uso de reembolso, plano atual, histórico médico relevante, dependentes e objetivos de longo prazo.`,
        `Com essas informações, a conversa deixa de ser uma busca por cotação e passa a ser um mapeamento de cenário. É nesse ponto que a saúde internacional deixa de parecer um produto e passa a ser entendida como uma decisão estratégica.`,
      ],
    },
  ];

  return paragraphs.map((section) => {
    if (section.list) {
      return `<section class="article-block"><h2>${escapeHtml(section.title)}</h2><ul>${section.body.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`;
    }
    return `<section class="article-block"><h2>${escapeHtml(section.title)}</h2>${section.body.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}</section>`;
  }).join("");
};

const articleHtml = (post) => {
  const canonical = `${origin}/blog/${post.slug}/`;
  const imageUrl = `${origin}/assets/blog/${post.image}`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: imageUrl,
    author: { "@type": "Person", name: "Ewerton Hirayama" },
    publisher: { "@type": "Organization", name: "Saúde Internacional" },
    datePublished: post.publishAt,
    dateModified: post.publishAt,
    mainEntityOfPage: canonical,
    keywords: post.keywords,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: origin },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${origin}/blog/` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonical },
    ],
  };

  return `${header()}<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg?v=6"><title>${escapeHtml(post.title)} | Saúde Internacional</title><meta name="description" content="${escapeHtml(post.description)}"><meta name="keywords" content="${escapeHtml(post.keywords.join(", "))}"><meta name="author" content="Hirayama Corretora de Seguros"><link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:title" content="${escapeHtml(post.title)} | Saúde Internacional"><meta property="og:description" content="${escapeHtml(post.description)}"><meta property="og:url" content="${canonical}"><meta property="og:site_name" content="Saúde Internacional"><meta property="og:image" content="${imageUrl}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(post.title)} | Saúde Internacional"><meta name="twitter:description" content="${escapeHtml(post.description)}"><meta name="twitter:image" content="${imageUrl}"><meta name="theme-color" content="#06243f"><link rel="stylesheet" href="/assets/saude-blog.css?v=6"><script type="application/ld+json">${JSON.stringify(blogSchema)}</script><script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script><script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};</script><script defer src="/_vercel/insights/script.js"></script></head><body id="topo">${topbar(false)}<div class="breadcrumb"><div class="shell"><a href="/">Início</a><span>›</span><a href="/blog/">Blog</a><span>›</span><span>${escapeHtml(post.title)}</span></div></div><main class="shell article-shell"><article class="article-main"><img class="article-cover" src="/assets/blog/${post.image}" alt="${escapeHtml(post.title)}"><header class="article-head"><div class="article-meta"><span class="pill">${escapeHtml(post.category)}</span><span class="pill">${formatDate(post.publishAt)}</span><span class="pill">${post.readTime ?? 7} min de leitura</span></div><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.description)}</p><div class="author-row"><div class="author"><img class="author-photo" src="/assets/ewerton-hirayama-consultor.jpg" alt="Ewerton Hirayama" loading="lazy"><div><strong>Ewerton Hirayama</strong><span>Consultor em saúde internacional</span></div></div><button class="btn share-button" type="button" onclick="navigator.clipboard && navigator.clipboard.writeText(location.href)">Compartilhar</button></div></header><div class="article-body">${sectionHtml(post)}<section class="article-block"><h2>Perguntas frequentes</h2>${post.faq.map((item) => `<p><strong>${escapeHtml(item.question)}</strong><br>${escapeHtml(item.answer)}</p>`).join("")}</section></div><section class="article-tags" aria-label="Hashtags">${post.hashtags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</section></article><aside class="sidebar"><div class="side-card"><h3>Continue entendendo</h3><p>Antes de conversar sobre qualquer solução, vale aprofundar os conceitos que mudam a decisão.</p><div class="related-list"><a href="/inteligencia/pre-existencias-seguro-saude-internacional/"><span class="related-number">01</span><span><span>Elegibilidade</span><strong>O que quase ninguém explica sobre pré-existências</strong></span></a><a href="/inteligencia/franquia-seguro-saude-internacional/"><span class="related-number">02</span><span><span>Custos do modelo</span><strong>Franquia é realmente um problema?</strong></span></a><a href="/inteligencia/holding-familiar-e-saude/"><span class="related-number">03</span><span><span>Planejamento</span><strong>A saúde da sua família faz parte do planejamento patrimonial?</strong></span></a></div></div><div class="side-card"><h3>Perguntas para mapear seu cenário</h3><p>O que você tenta resolver? O plano atual ainda acompanha sua vida? Há dependentes, viagens, histórico médico ou estrutura familiar envolvida?</p></div><div class="side-card newsletter"><h3>Quando conversar faz sentido</h3><p>Quando você já entendeu que a decisão envolve mais do que rede, preço e hospital.</p><div style="margin-top:18px"><a class="btn btn-gold" href="/#cotacao">Mapear meu cenário</a></div></div></aside></main>${footer()}`;
};

const blogIndexHtml = (posts) => `${header()}<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg?v=6"><title>Biblioteca de inteligência em saúde internacional | Saúde Internacional</title><meta name="description" content="Artigos consultivos para entender saúde internacional, franquia, reembolso, pré-existência, continuidade familiar e decisões sem achismo."><meta name="author" content="Hirayama Corretora de Seguros"><link rel="canonical" href="${origin}/blog/"><meta property="og:type" content="website"><meta property="og:title" content="Biblioteca de inteligência em saúde internacional | Saúde Internacional"><meta property="og:description" content="Leia antes de comparar qualquer proposta: conceitos, riscos invisíveis e decisões de longo prazo em saúde internacional."><meta property="og:url" content="${origin}/blog/"><meta property="og:site_name" content="Saúde Internacional"><meta name="theme-color" content="#06243f"><link rel="stylesheet" href="/assets/saude-blog.css?v=6"><script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};</script><script defer src="/_vercel/insights/script.js"></script></head><body id="topo">${topbar(true)}<main><section class="blog-hero library-hero"><div class="shell"><p class="cat">Centro de inteligência</p><h1>Leia antes de comparar qualquer proposta.</h1><p>O blog existe para acelerar compreensão, não para empurrar produto. Aqui você encontra conceitos, riscos invisíveis, vida real e planejamento familiar em saúde internacional.</p></div></section><section class="shell editorial-pillars" aria-label="Pilares editoriais"><article><span>01</span><h2>Começando do zero</h2><p>Seguro viagem, cartão, plano nacional e saúde internacional sem confusão.</p></article><article><span>02</span><h2>Como funciona na prática</h2><p>Reembolso, rede parceira, franquia, internação, telemedicina e documentação.</p></article><article><span>03</span><h2>Decisões sem achismo</h2><p>Continuidade, CNPJ, titularidade, holding familiar e quando pode não fazer sentido.</p></article></section><section class="shell post-list"><div class="list-head"><div><p class="cat">Biblioteca</p><h2>Artigos consultivos</h2></div><p>Use os conteúdos para formar critério antes de qualquer conversa comercial.</p></div><div class="posts-grid">${posts.map((post) => `<article class="post-card"><a href="/blog/${post.slug}/"><img src="${post.image}" alt="${escapeHtml(post.title)}" loading="lazy"><span>${escapeHtml(post.category)}</span><h2>${escapeHtml(post.title)}</h2><p>${escapeHtml(post.description)}</p><small>${post.readTime} min de leitura</small></a></article>`).join("")}</div></section></main>${footer()}`;

const updateSitemap = async (posts) => {
  const current = await readFile(sitemapPath, "utf8");
  const existing = new Set([...current.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]));
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const loc of existing) {
    lines.push(`  <url><loc>${loc}</loc><priority>${loc.includes("/blog/") && loc !== `${origin}/blog/` ? "0.8" : loc === origin + "/" ? "1.0" : loc === origin + "/blog/" ? "0.9" : "0.85"}</priority></url>`);
  }
  for (const post of posts) {
    const loc = `${origin}/blog/${post.slug}/`;
    if (!existing.has(loc)) {
      lines.push(`  <url><loc>${loc}</loc><priority>0.8</priority></url>`);
      existing.add(loc);
    }
  }
  lines.push("</urlset>", "");
  await writeFile(sitemapPath, lines.join("\n"));
};

const scheduled = await readJson(scheduledPath);
const published = await readJson(postsPath);
const publishedSlugs = new Set(published.map((post) => post.slug));
const duePosts = scheduled.filter((post) => post.status === "scheduled" && new Date(post.publishAt) <= now && !publishedSlugs.has(post.slug));

if (duePosts.length === 0) {
  console.log("No scheduled posts are due.");
  process.exit(0);
}

await mkdir(assetsDir, { recursive: true });

for (const post of duePosts) {
  const postDir = path.join(blogDir, post.slug);
  await mkdir(postDir, { recursive: true });
  await writeFile(path.join(postDir, "index.html"), articleHtml(post));

  const sourceImage = path.join(contentDir, "scheduled-assets", "blog", post.image);
  const targetImage = path.join(assetsDir, post.image);
  if (existsSync(sourceImage) && !existsSync(targetImage)) {
    await copyFile(sourceImage, targetImage);
  }

  published.unshift(toPostMeta(post));
  post.status = "published";
  post.publishedAt = new Date().toISOString();
}

published.sort((a, b) => new Date(b.date) - new Date(a.date));
await writeFile(postsPath, `${JSON.stringify(published, null, 2)}\n`);
await writeFile(path.join(blogDir, "index.html"), blogIndexHtml(published));
await updateSitemap(published);
await writeFile(scheduledPath, `${JSON.stringify(scheduled, null, 2)}\n`);

console.log(`Published ${duePosts.length} scheduled post(s): ${duePosts.map((post) => post.slug).join(", ")}`);
