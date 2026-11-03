# VN Drinks 🍻

Catálogo responsivo com React, Vite, Tailwind CSS e npm. Carrinho salvo no navegador, filtros, busca, seleção de sabores e pedidos pelo WhatsApp.

## Desenvolvimento

Use Node.js 22.12 ou superior (recomendado: Node.js 24) e npm 10 ou superior.

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:4173. Comandos disponíveis:

- `npm run dev`: servidor local com atualização automática.
- `npm run lint`: análise estática com ESLint e regras de Hooks.
- `npm test`: testes das regras de catálogo, carrinho, sabores e preços.
- `npm run build`: gera o site de produção em `dist/`, com arquivos versionados e catálogo no HTML inicial.
- `npm run preview`: serve o último build localmente.
- `npm run test:build`: verifica SEO e recursos do último build.
- `npm run check`: executa lint, testes, build e verificação do HTML publicado.

## Organização

- `src/catalog.js`: produtos, preços em centavos, sabores e WhatsApp.
- `src/cart.js`: validação, totais e montagem do pedido.
- `src/components/`: componentes React do site, catálogo, carrinho e seleção de opções.
- `src/styles/`: identidade visual e integração Tailwind CSS 4 pelo plugin oficial do Vite.
- `public/assets/`: fotos, logo e ícones.
- `tests/`: testes com o runner nativo do Node.js.

O arquivo `package-lock.json` registra as versões instaladas. `dist/` é gerada automaticamente e não deve ser editada nem versionada. O reset CSS do projeto foi mantido para preservar o visual; os utilitários do Tailwind estão disponíveis nos componentes.

O override de `minimatch` usa a versão 11 corrigida para remover a vulnerabilidade transitiva das ferramentas ESLint. A configuração foi verificada com `npm run check`.

Preços atualizados: Heineken normal **R$ 8,50**, Corona normal **R$ 9,00** e pack de **6 Heinekens por R$ 50,00**. A promoção é um produto separado no catálogo.

## Publicação

Na Vercel, importe o repositório e selecione a raiz deste projeto. `vercel.json` configura o framework Vite, a instalação com `npm ci`, o build com `npm run build` e a saída `dist/`. Pela CLI autenticada, execute `npx vercel --prod`.

O GitHub Pages continua disponível pela configuração `.github/workflows/pages.yml`, que instala dependências, verifica o código e compila antes da publicação. A base relativa do Vite permite servir o mesmo build na raiz de um domínio e em `/VN-Drinks/`.

O modo de demonstração existente foi preservado em `STORE.demoMode`. Revise os demais preços e a disponibilidade antes de alterá-lo.

Veja [o guia de edição](docs/GUIA.md) e [as informações sobre imagens](docs/ASSETS.md).

Para verificar a propriedade no Google, enviar o sitemap e pedir indexação, consulte [SEO e Search Console](docs/SEO.md). A tag exclusiva fornecida pelo proprietário já está no `index.html`; mantenha-a após concluir a verificação.
