import fs from 'node:fs/promises';
const root=new URL('../site/',import.meta.url);
const slug='cigna-seguro-saude-internacional-brasil';
const title='Cigna no Brasil: compare cobertura, franquia e elegibilidade';
const description='Avalie o seguro saúde internacional Cigna pelo país de residência, área de cobertura, rede e franquia. Organize seu perfil antes de solicitar uma proposta.';
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const sections=[
 ['A proposta começa pelo país onde você mora',[
 'Você procura Cigna no Brasil para continuar usando médicos no país, atender à rotina no exterior ou combinar os dois cenários? Essa informação muda a comparação. Antes de discutir o preço, identifique seu país de residência, os países em que pretende receber atendimento e quem precisa participar da contratação.',
 'A disponibilidade deve ser confirmada para o produto e o perfil apresentados. O nome da marca não significa que qualquer modalidade esteja disponível a qualquer residente no Brasil. Peça a identificação do produto, a documentação vigente e a confirmação de elegibilidade antes de organizar uma mudança de proteção.'
 ]],
 ['Com ou sem EUA é uma escolha que precisa aparecer na comparação',[
 'As perguntas oficiais da Cigna apresentam áreas de cobertura com e sem os Estados Unidos, além de configurações próprias de outros produtos. Essa distinção precisa aparecer na proposta. Uma opção sem EUA não atende automaticamente ao mesmo cenário de quem pretende utilizar serviços médicos naquele país.',
 'Compare a área de cobertura com a sua rotina real. Visitas frequentes à família, trabalho e intenção de realizar atendimento programado merecem ser explicados na análise. Uma hipótese de mudança futura pode ser discutida, mas não deve ser tratada como uma alteração contratual já aceita.'
 ]],
 ['Rede, reembolso e franquia precisam ser lidos juntos',[
 'Um país estar incluído não confirma pagamento direto em qualquer hospital. Peça orientação sobre consulta de rede, autorização e documentação para o produto avaliado. Quando existe preferência por um prestador específico, confirme a informação pelos canais oficiais e registre a data da consulta.',
 'Ao receber duas propostas, confira se a franquia, a participação nas despesas e os benefícios são equivalentes. Se vários pontos mudam ao mesmo tempo, a diferença de preço não pode ser atribuída a um único item. O valor útil é aquele que você consegue relacionar às condições de utilização.'
 ]],
 ['O histórico de saúde deve ser tratado no canal adequado',[
 'A elegibilidade comercial não substitui a avaliação das informações de saúde exigidas pela contratação. Preencha a documentação conforme as orientações oficiais e solicite esclarecimento sobre dúvidas antes do envio. Não presuma aceitação de uma condição de saúde a partir de uma simulação de preço.',
 'Não publique exames ou documentos pessoais em comentários ou grupos abertos. A conversa inicial pode organizar país, composição familiar e prioridades, enquanto os dados necessários à análise são encaminhados pelo procedimento indicado.'
 ]],
 ['Como avançar para uma proposta que faça sentido',[
 'O Saúde Internacional pode ajudar a organizar os critérios de comparação: território, rede, franquia, reembolso e documentação. A escolha depende do cenário apresentado e das condições vigentes, sem indicação automática da Cigna ou de outra marca como melhor para todos.',
 'Se sua intenção é contratar, informe quem precisa da proteção e onde pretende utilizá-la. Isso permite discutir uma proposta com contexto, em vez de comparar apenas um nome comercial e um preço.'
 ]]
];
const body=sections.map(([h,ps])=>'<section class="article-block"><h2>'+h+'</h2>'+ps.map(p=>'<p>'+p+'</p>').join('')+'</section>').join('')+
 '<section class="article-block"><h2>Compare as condições para o seu perfil</h2><p><a href="/blog/seguro-saude-internacional-com-ou-sem-eua/">Entenda a diferença entre cobertura com e sem EUA</a> e veja <a href="/blog/diferenca-entre-rede-direta-e-reembolso/">como rede direta e reembolso participam da escolha</a>.</p><p data-home-comparison-link>Na <a href="/#comparar-planos">comparação de seguro saúde internacional</a>, você encontra o caminho para organizar sua análise.</p><p><a class="btn btn-primary" href="/#solicitar-cotacao">Solicitar uma cotação para meu perfil</a></p></section>'+
 '<section class="article-block"><h2>Referência oficial</h2><p><a href="https://www.cignaglobal.com/individuals-families/members/resources/frequently-asked-questions">Cigna: áreas de cobertura e condições de utilização</a>. Fonte conferida em 13 de novembro de 2026. Regras, aceitação e benefícios dependem do produto e da apólice.</p></section>';
const file=new URL('blog/'+slug+'/index.html',root);let html=await fs.readFile(file,'utf8');
html=html.replaceAll('Seguro Saúde Internacional da Cigna: quem pode contratar no Brasil?',title).replace('2 min de leitura','4 min de leitura');
html=html.replace(/<title>.*?<\/title>/,'<title>'+title+' | Saúde Internacional</title>');
html=html.replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*(")/g,'$1'+escape(description)+'$2');
html=html.replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*(")/g,'$1'+escape(title)+' | Saúde Internacional$2');
html=html.replace(/<h1>.*?<\/h1>/,'<h1>'+title+'</h1>');
html=html.replace(/(<header class="article-head">[\s\S]*?<h1>.*?<\/h1>)<p>.*?<\/p>/,'$1<p>'+description+'</p>');
html=html.replace(/<div class="article-body">[\s\S]*?<\/div><section class="article-tags"/,'<div class="article-body">'+body+'</div><section class="article-tags"');
html=html.replace(/<script type="application\/ld\+json">(.*?)<\/script>/gs,(_,raw)=>{const schema=JSON.parse(raw);if(schema['@type']==='FAQPage')return '';if(schema['@type']==='BlogPosting'){schema.headline=title;schema.description=description;schema.dateModified='2026-11-13T15:00:00.000Z';}if(schema['@type']==='BreadcrumbList')schema.itemListElement.at(-1).name=title;return '<script type="application/ld+json">'+JSON.stringify(schema)+'</script>';});
if(!html.includes('Solicitar uma cotação para meu perfil'))throw Error('Article body insertion failed');
await fs.writeFile(file,html);
const postsFile=new URL('blog/posts.json',root);const posts=JSON.parse(await fs.readFile(postsFile,'utf8'));const post=posts.find(p=>p.slug===slug);post.title=title;post.description=description;post.readTime=4;await fs.writeFile(postsFile,JSON.stringify(posts,null,2)+'\n');
const mapFile=new URL('sitemap.xml',root);let map=await fs.readFile(mapFile,'utf8');map=map.replace(/(<loc>https:\/\/www\.saudeinternacional\.com\.br\/blog\/cigna-seguro-saude-internacional-brasil\/<\/loc>)(?:<lastmod>.*?<\/lastmod>)?/,'$1<lastmod>2026-11-13</lastmod>');await fs.writeFile(mapFile,map);
// Only change this existing card in the list, keeping other editorial decisions.
const listingFile=new URL('blog/index.html',root);let listing=await fs.readFile(listingFile,'utf8');listing=listing.replaceAll('Seguro Saúde Internacional da Cigna: quem pode contratar no Brasil?',title).replaceAll('Veja quem pode contratar seguro saúde internacional da Cigna no Brasil e quais pontos analisar antes da proposta.',description);await fs.writeFile(listingFile,listing);
console.log('Cigna search presentation and original article refined');
