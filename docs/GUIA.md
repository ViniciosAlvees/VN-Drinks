# Guia de edição da VN Drinks

Instale as dependências com `npm ci` e execute `npm run dev`. Abra http://127.0.0.1:4173 para acompanhar as alterações.

## Produtos e preços

Edite `src/catalog.js`. Os preços são inteiros em centavos: `850` significa R$ 8,50. Mantenha os IDs estáveis para preservar os carrinhos existentes. Fotos ficam em `public/assets/images/`; o catálogo referencia apenas o nome do arquivo.

O pack `heineken-six` contém seis long necks e custa R$ 50,00. Cada unidade desse produto no carrinho representa um pack. A Heineken avulsa custa R$ 8,50 e a Corona avulsa R$ 9,00. As versões sem álcool mantêm os preços anteriores.

`redBullUnits` define quantas latas precisam ser escolhidas no seletor. `bottleOptions` define as garrafas do combo Beefeater. Os preços e opções são validados novamente ao restaurar o carrinho e gerar o pedido.

## Contato e modo de demonstração

O campo `STORE.whatsapp` deve conter país, DDD e número, apenas dígitos. O contato fica centralizado no catálogo; o link de fallback sem JavaScript está em `index.html`.

O projeto mantém `STORE.demoMode: true`. Confira o catálogo inteiro e a disponibilidade antes de mudar para `false`. O pedido abre uma mensagem pronta; o visitante envia e confirma os detalhes no WhatsApp.

## Visual e componentes

Edite os componentes em `src/components/` e os estilos em `src/styles/`. Os tokens de cores existentes estão em `styles.css`; os tokens e imports do Tailwind 4 estão em `index.css`. Logo, favicons e ícones ficam em `public/assets/brand/`. Dados de instalação do site ficam em `public/manifest.webmanifest`.

## Verificação e publicação

Execute `npm run check` antes de publicar. O build gera `dist/` e usa hashes para atualizar o cache de JS e CSS. Não edite a pasta gerada.

A Vercel usa `vercel.json`. Após autenticar a CLI, `npx vercel --prod` publica o frontend. O GitHub Pages continua configurado para compilar e publicar em pushes para `main`.
