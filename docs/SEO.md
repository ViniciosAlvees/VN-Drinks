# SEO e Google Search Console

A URL principal é **https://vn-drinks.vercel.app/**. O projeto inclui título, descrição, canonical, metadados de compartilhamento, dados estruturados `WebSite`, `robots.txt` e sitemap. Se trocar de domínio, atualize as URLs em `index.html`, `public/robots.txt`, `public/sitemap.xml` e nos testes de build.

O comando `npm run build` compila os arquivos e gera o catálogo React no HTML inicial. Isso permite ler nomes, descrições e preços mesmo antes de carregar JavaScript. O navegador assume a interface interativa normalmente, incluindo o carrinho salvo localmente. O conteúdo entregue aos buscadores e aos visitantes é o mesmo.

## Verificar a propriedade

1. Abra [Google Search Console](https://search.google.com/search-console/).
2. Adicione uma propriedade do tipo **Prefixo do URL** com `https://vn-drinks.vercel.app/`.
3. Escolha **Tag HTML** e copie a tag `google-site-verification` fornecida para sua conta.
4. A tag fornecida pelo proprietário já está dentro de `<head>` no `index.html` da raiz. Se precisar adicionar outra verificação, mantenha a existente e insira a nova tag nesse mesmo arquivo. Não coloque no componente React nem no HTML gerado em `dist/`.
5. Envie a alteração para a branch usada no deploy de produção da Vercel e aguarde o deploy ficar pronto.
6. Confira a presença da tag no código-fonte público da loja e clique em **Verificar** no Search Console. Mantenha a tag após verificar.

A tag exclusiva fornecida pelo proprietário foi incluída no projeto. Isso prepara a confirmação; a conclusão depende de publicar a tag no domínio e clicar em **Verificar** no Search Console. Não remova a tag após verificar.

## Enviar o sitemap e pedir indexação

Na propriedade verificada, abra **Sitemaps** e envie `https://vn-drinks.vercel.app/sitemap.xml`. Depois use **Inspeção de URL**, informe `https://vn-drinks.vercel.app/`, execute **Testar URL publicado** e solicite a indexação.

O sitemap lista somente a página inicial. Links como `#catalogo` e `#combos` são seções da mesma página, não URLs independentes para indexação.

Publicar os arquivos permite o rastreamento, mas não comprova que o Google já indexou a loja. Acompanhe o relatório do Search Console; inclusão e posição nos resultados são decisões do Google.

## Verificar o build

Execute `npm run check` para validar regras do carrinho, metadados, catálogo no HTML inicial, sitemap, IDs e recursos locais.

Referências oficiais: [verificação de propriedade](https://support.google.com/webmasters/answer/9008080), [SEO para JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [nome do site](https://developers.google.com/search/docs/appearance/site-names) e [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
