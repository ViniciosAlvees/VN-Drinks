# VN Drinks🍻

Site responsivo para catálogo de bebidas, cervejas e combos. O visitante adiciona itens ao carrinho e abre uma mensagem pronta para **+55 (11) 96012-3119** no WhatsApp. O envio e a confirmação acontecem no atendimento.

## Abrir no computador

É necessário Node.js. Não há dependências para instalar.

```sh
npm run dev
```

Execute os comandos na raiz do repositório e abra **http://127.0.0.1:4173**. Use o servidor para carregar os módulos JavaScript; abrir `index.html` diretamente com duplo clique não é suficiente. Para verificar as regras do carrinho, execute `npm test`.

Os comandos de prévia e teste atualizam juntos a versão do JavaScript e do CSS. Isso evita misturar o catálogo novo com um seletor de opções antigo em cache. Se estiver com a página aberta durante uma edição, recarregue com **Ctrl+F5**. Antes de uma publicação manual da pasta `dist`, execute `npm run version-assets`.

## Organização dos arquivos

```text
VN-Drinks/                     Raiz do repositório
├── .github/workflows/pages.yml Testes e publicação automática no GitHub Pages
├── dist/                      Site pronto para hospedagem estática
│   ├── index.html             Estrutura, textos e seções
│   ├── css/
│   │   ├── styles.css         Visual, animações e adaptação ao celular
│   │   ├── flavors.css        Seleção de sabores e resumo no carrinho
│   │   └── brand.css          Nova logo e ajustes de toque para celular
│   ├── js/
│   │   ├── catalog.js         EDITE AQUI: catálogo, preços e WhatsApp
│   │   ├── cart.js            Cálculos e montagem da mensagem
│   │   ├── app.js             Filtros, busca, formulário e interface
│   │   ├── flavor-picker.js   Escolha da garrafa e dos sabores de Red Bull
│   │   └── ui.js              Ícones e helpers compartilhados de interface
│   └── assets/
│       ├── brand/logo-neon.png Logo otimizada dentro do site
│       ├── brand/logo-original.png Imagem original da nova logo
│       ├── brand/favicon-32.png Ícone da aba do navegador
│       ├── brand/apple-touch-icon.png Ícone para iPhone e iPad
│       └── images/            Fotos dos produtos e abertura
├── scripts/serve.mjs           Servidor local
├── scripts/version-assets.mjs  Mantém HTML, CSS e módulos na mesma versão
├── tests/                     Verificações do catálogo, carrinho e opções
├── docs/                      Guia e referências das imagens
├── exports/                   Logo para download
├── package.json               Comandos de desenvolvimento e teste
└── .openai/hosting.json        Identificação da hospedagem Sites
```

## Cadastrar produtos e preços

Os itens atuais são **exemplos**. Não foram informados estoque ou preços reais. Abra `dist/js/catalog.js` e edite a lista `PRODUCTS`:

```js
{
  id: 'minha-bebida',          // Identificador único; mantenha estável.
  name: 'Nome da bebida',
  category: 'cervejas',        // cervejas, combos, destilados ou sem-alcool
  description: '350 ml · Unidade',
  price: 750,                 // CENTAVOS: 750 = R$ 7,50; 15990 = R$ 159,90
  images: ['minha-foto.png'],  // Arquivo em dist/assets/images/
  badge: 'CERVEJA',
  tone: 'mint',               // mint, lime, peach ou blue
  featured: true              // Aparece primeiro na ordenação Destaques.
}
```

Use fotos quadradas com bom espaço ao redor do produto, de preferência PNG transparente ou fundo branco. Para um combo, o campo `images` pode ter 2 ou 3 arquivos. A descrição precisa informar as quantidades e os tamanhos incluídos. Há aviso de imagem ilustrativa nos cartões.

### Sabores de Red Bull

O Red Bull avulso e os combos com energético têm o botão **Selecionar**. O avulso permite escolher um sabor; os combos permitem distribuir as quatro latas entre **Tradicional**, **Melancia**, **Morango e Pêssego** e **Tropical**. O atalho “Todas desse sabor” preenche as quatro latas de uma vez. Morango e Pêssego é um único sabor.

As opções ficam na lista `RED_BULL_FLAVORS` em `catalog.js`. Mantenha os IDs estáveis. O campo `redBullUnits` no produto indica quantas latas escolher: `1` no avulso e `4` nos combos atuais. O preço em `price` continua sendo o valor do produto inteiro, independentemente da mistura de sabores.

As escolhas aparecem no carrinho e na mensagem do WhatsApp. É possível usar **Alterar sabores** no carrinho. Combinações diferentes ficam separadas; combinações iguais são agrupadas. Para múltiplas unidades de um combo, o resumo informa os sabores **por combo**. Carrinhos salvos antes desta função mantêm os itens e pedem a escolha dos sabores antes de permitir finalizar. Fechar a seleção sem confirmar não altera o carrinho.

### Garrafa do combo Beefeater

O catálogo inclui Beefeater Tradicional e Beefeater Pink de 700 ml, vendidos separadamente, além do **Combo Beefeater**. No combo, o visitante escolhe uma das garrafas e os sabores das quatro latas de Red Bull antes de adicionar ao carrinho. A mensagem do WhatsApp identifica a garrafa e os sabores por combo. O botão **Alterar opções** permite trocar a garrafa e os Red Bulls mantendo a quantidade de combos.

As garrafas permitidas ficam em `BEEFEATER_BOTTLES`, no arquivo `catalog.js`. Cada opção contém `id`, `name`, `volume` e `image`. O produto do combo utiliza essa lista no campo `bottleOptions`. O preço do combo fica no campo `price` do próprio produto e é o mesmo para as duas opções. Os avulsos possuem seus próprios produtos e preços em `PRODUCTS`.

**Após conferir todos os produtos e valores, mude `demoMode: true` para `demoMode: false`.** Isso retira os avisos de demonstração do catálogo e da mensagem de pedido. Edite os dados no computador e publique novamente; o site não tem painel administrativo ou banco de dados.

## Colocar sua logo

- A nova logo enviada pelo proprietário está em `dist/assets/brand/logo-original.png`.
- Cabeçalho e rodapé usam a versão otimizada `dist/assets/brand/logo-neon.png`, preservando a imagem completa.
- A aba do navegador usa `favicon-32.png` e `favicon-64.png` na mesma pasta.
- Os ícones de celular são `apple-touch-icon.png`, `icon-192.png` e `icon-512.png`. O arquivo `dist/manifest.webmanifest` identifica a marca ao salvar o site na tela inicial.
- Se trocar a arte novamente, atualize as versões acima e execute `npm run version-assets`. Os downloads em `exports/vn-drinks-logo.png` e `exports/vn-drinks-logo.svg` também contêm a nova logo; o SVG é um contêiner da imagem original, não um desenho vetorial redesenhado. Os caminhos deste guia são relativos à raiz do projeto.

## Uso no celular

O catálogo usa duas colunas nas telas pequenas e filtros com rolagem horizontal. A navegação vira um menu, o carrinho ocupa a tela e os seletores de combos permitem rolar o conteúdo mantendo o botão de confirmar visível. Os controles de toque têm pelo menos 44 pixels nas áreas principais, e os campos do pedido usam fonte de 16 pixels para facilitar a digitação no celular. A nova logo tem tamanhos próprios para o navegador, iPhone/iPad e tela inicial.

## WhatsApp e pedidos

O número fica em `STORE.whatsapp` no arquivo `catalog.js`, sem espaços ou pontuação: `5511960123119`. Os links do site são atualizados a partir dele. Se trocar o telefone, atualize também os links de fallback e o número visível no HTML, para quem estiver sem JavaScript.

O carrinho permite adicionar, remover e ajustar até 99 unidades por produto ou combinação de sabores. Ele é salvo no navegador deste dispositivo e sincroniza entre abas. O formulário aceita nome, retirada ou entrega, forma de pagamento e observações. A entrega exige endereço. A mensagem inclui os itens, os sabores escolhidos, os valores unitários e o subtotal.

O site não calcula frete nem cobra pagamentos. Taxa, área de entrega, estoque, pagamento e confirmação do pedido são combinados pelo WhatsApp. Abrir o link **não envia a mensagem automaticamente**. Nenhuma mensagem foi enviada durante os testes. Nome, endereço e observações não são salvos pelo site; entram apenas no link preparado para o WhatsApp.

## Estilo e acessibilidade

As cores ficam no início de `dist/css/styles.css`. O site tem animação de entrada e flutuação de garrafas, gelo e limão, faixa em movimento e feedback ao adicionar itens. Respeita a preferência de reduzir movimento do dispositivo. Há navegação por teclado, rótulos em português, carrinho com foco contido e fechamento pela tecla Escape.

Fontes: Barlow Condensed e Manrope via Google Fonts, com fontes locais de fallback. As fotos e o restante do site ficam na própria pasta.

## Publicação

O endereço da loja no GitHub Pages é **https://viniciosalvees.github.io/VN-Drinks/**. O arquivo `.github/workflows/pages.yml` testa o projeto e publica **somente o conteúdo de `dist/`** a cada atualização na branch `main`. Assim, o endereço principal abre a loja diretamente. Pull requests executam as verificações sem publicar alterações.

Em **Settings → Pages → Build and deployment**, a origem deve ser **GitHub Actions**. Depois do merge, acompanhe o fluxo **Publicar VN Drinks** na aba **Actions**. O fluxo também pode ser iniciado manualmente com **Run workflow** na branch `main`.

O conteúdo de `dist/` também pode ser servido em qualquer hospedagem estática com HTTPS. Na hospedagem Sites, o arquivo `.openai/hosting.json` mantém a identificação do projeto e o diretório `dist`; a audiência dessa hospedagem é gerenciada separadamente.

## Imagens e referências

A abertura fotográfica é uma composição original gerada com a ferramenta integrada **image_gen**, salva em `dist/assets/images/hero-drinks.png`. Garrafas, gelo e limão fazem parte da imagem animada por CSS. Ela é uma arte ilustrativa da marca, sem representar os produtos à venda.

O prompt completo usado está em [ASSETS.md](ASSETS.md). As fotos reais do catálogo de exemplo vieram de páginas de produtos: [Heineken / Vinari Trade](https://vinaritrade.com/UserFiles/products/09C99B1A-B54F-1DE5-DD2B-83D568F8A81F.png), [Jack Daniel’s / Giassi](https://www.giassi.com.br/whisky_old_no_7_jack_daniels_garrafa_1l_9641408/p), [Absolut / Kent Street Cellars](https://kentstreetcellars.com.au/products/absolut-vodka-1l), [Tanqueray / Pão de Açúcar](https://www.paodeacucar.com/produto/37355/gin-london-dry-tanqueray-garrafa-750ml) e [Red Bull / Sonda](https://www.sondadelivery.com.br/barueri/produto/energetico-red-bull-lata-250ml/1000007571). Substitua as fotos pelas suas no catálogo definitivo. Marcas e fotos de terceiros pertencem aos respectivos titulares.

Fotos Beefeater de 700 ml: [Tradicional / Camperdown Cellars](https://camperdowncellars.com.au/products/beefeater-london-dry-gin) e [Pink / La Escocesa](https://laescocesa.com/products/gin-beefeater-pink-700ml). Os arquivos ficam em `dist/assets/images/beefeater-tradicional.png` e `beefeater-pink.png`. As imagens são ilustrativas e pertencem aos respectivos titulares.

Novas fotos: [Heineken Zero / Camperdown Cellars](https://camperdowncellars.com.au/cdn/shop/products/Heineken0-0NonAlcoholicBeer_986f3fdc-bda8-4364-9b74-35da2b042179_2048x.png?v=1679706971), [Corona / Supermercado Soares](https://soaresemcasa.com.br/produto/7891149108718/cerveja-long-neck-corona-330ml), [Corona Zero / Gaby Congelados](https://www.gabycongelados.com.br/cervejas/sem-alcool/corona-zero-alcool-long-neck-330ml), [Red Label / Endeavour Group](https://product-media.edg.com.au/900934-1.png?h=640&impolicy=wowtofzcfpg&w=640), [White Horse 700 ml / eFácil via Magazine Luiza](https://www.magazineluiza.com.br/whisky-8-anos-white-horse-700ml/p/jk52ha9447/me/wisk/), [Rock’s / Nossa Distribuidora](https://nossadistribuidorabebidas.com.br/shop/gin-rocks/) e [Eternity / Fenomeno Bebidas](https://fenomenobebidas.com.br/produto/gin-eternity-london-dry-900ml/).

Os preços das novas garrafas, combos e cervejas foram informados pelo proprietário. A consulta ao Zé Delivery não permitiu confirmar valores por endereço; os preços das cervejas foram então fornecidos diretamente pelo proprietário.

Pesquisa visual: [Heineken Studio](https://www.heinekenexperience.com/en/heineken-studio) e [Monkey 47 / Pernod Ricard](https://www.pernod-ricard.com/en/brands/monkey-47). A composição, o código e o visual da VN Drinks foram feitos para este projeto.
