# Fila editorial programada

Esta pasta guarda conteúdos que ainda não devem aparecer no site público.

- `scheduled-posts.json`: rascunhos programados com SEO, FAQ, hashtags, data de publicação e prompt de imagem.
- `scheduled-assets/blog/`: imagens dos posts programados.

## Como funciona

O comando abaixo publica apenas os posts cuja data `publishAt` já chegou:

```bash
npm run publish:scheduled
```

Quando um post é publicado, o script:

- cria `site/blog/<slug>/index.html`;
- copia a imagem para `site/assets/blog/`;
- adiciona o post em `site/blog/posts.json`;
- atualiza `site/blog/index.html`;
- atualiza `site/sitemap.xml`;
- marca o rascunho como `published`.

## Publicação automática

O workflow `.github/workflows/scheduled-blog.yml` roda toda quinta-feira às 15:00 UTC, equivalente ao meio-dia em São Paulo, publica os posts vencidos, commita as alterações e envia para a branch principal. O Vercel faz o deploy automaticamente após o push.
