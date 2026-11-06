/**
 * CATÁLOGO DA VN DRINKS
 * Edite este arquivo para trocar produtos, preços, fotos e contato.
 * Valores em CENTAVOS: 799 = R$ 7,99. IDs precisam ser únicos.
 * As fotos ficam em public/assets/images/. Use npm run dev para visualizar.
 */
export const STORE = Object.freeze({
  name: 'VN Drinks',
  whatsapp: '5511960123119', // Código do país + DDD + número, somente dígitos.
  demoMode: true, // Mude para false APENAS depois de conferir produtos e preços reais.
  currency: 'BRL',
  locale: 'pt-BR',
});

export const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: 'grid' },
  { id: 'combos', name: 'Combos', icon: 'box' },
  { id: 'cervejas', name: 'Cervejas', icon: 'beer' },
  { id: 'destilados', name: 'Destilados', icon: 'bottle' },
  { id: 'sem-alcool', name: 'Sem álcool', icon: 'bolt' },
];

// Sabores disponíveis no avulso e nos combos. Mantenha os IDs estáveis.
export const RED_BULL_FLAVORS = [
  { id: 'tradicional', name: 'Tradicional', tone: 'original' },
  { id: 'melancia', name: 'Melancia', tone: 'watermelon' },
  { id: 'morango-pessego', name: 'Morango e Pêssego', tone: 'strawberry-peach' },
  { id: 'tropical', name: 'Tropical', tone: 'tropical' },
];

export const BALY_FLAVORS = [
  { id: 'morango-pessego', name: 'Morango e Pêssego', tone: 'strawberry-peach' },
  { id: 'melancia', name: 'Melancia', tone: 'watermelon' },
  { id: 'tropical', name: 'Tropical', tone: 'tropical' },
  { id: 'maca-verde', name: 'Maçã Verde', tone: 'green-apple' },
];

export const getFlavorOptions = product => product?.balyUnits ? BALY_FLAVORS : RED_BULL_FLAVORS;
export const getFlavorUnits = product => product?.balyUnits || product?.redBullUnits || 0;

// Opções da garrafa no combo Beefeater. O preço é o mesmo nas duas opções.
export const BEEFEATER_BOTTLES = [
  { id: 'tradicional', name: 'Beefeater Tradicional', volume: '700 ml', image: 'beefeater-tradicional.png' },
  { id: 'pink', name: 'Beefeater Pink', volume: '700 ml', image: 'beefeater-pink.png' },
];

// Catálogo de apresentação: confira a disponibilidade antes de vender.
export const PRODUCTS = [
  { id: 'combo-gin', name: 'Combo Gin & Friends', category: 'combos', description: '1 Tanqueray 750 ml + 5 Red Bull 250 ml + 5 gelos', redBullUnits: 5, iceUnits: 5, price: 15999, images: ['tanqueray.png', 'red-bull.jpg'], badge: 'COMBO', tone: 'lime', featured: true },
  { id: 'heineken', name: 'Heineken Long Neck', category: 'cervejas', description: '330 ml · Unidade', price: 850, images: ['heineken.png'], badge: 'LONG NECK', tone: 'mint', featured: true },
  { id: 'jack-daniels', name: 'Jack Daniel’s Old No. 7', category: 'destilados', description: '1 litro · Tennessee whiskey', price: 14990, images: ['jack-daniels.png'], badge: 'WHISKEY', tone: 'peach', featured: true },
  { id: 'absolut', name: 'Absolut Vodka', category: 'destilados', description: '1 litro · Original', price: 8999, images: ['absolut.png'], badge: 'VODKA', tone: 'blue', featured: false },
  { id: 'combo-whisky', name: 'Combo Esquenta', category: 'combos', description: '1 Jack Daniel’s 1 L + 5 Red Bull 250 ml + 5 gelos', redBullUnits: 5, iceUnits: 5, price: 19899, images: ['jack-daniels.png', 'red-bull.jpg'], badge: 'COMBO', tone: 'peach', featured: false },
  { id: 'heineken-six', name: 'Heineken · Leva 6', category: 'cervejas', description: '6 long necks de 330 ml', price: 5000, images: ['heineken.png', 'heineken.png', 'heineken.png'], badge: 'PROMOÇÃO · 6 POR R$ 50', tone: 'mint', featured: false },
  { id: 'tanqueray', name: 'Tanqueray London Dry', category: 'destilados', description: '750 ml · Gin', price: 11990, images: ['tanqueray.png'], badge: 'GIN', tone: 'lime', featured: false },
  { id: 'beefeater-tradicional', name: 'Beefeater Tradicional', category: 'destilados', description: '700 ml · Gin', price: 10499, images: ['beefeater-tradicional.png'], badge: 'GIN', tone: 'peach', featured: false },
  { id: 'beefeater-pink', name: 'Beefeater Pink', category: 'destilados', description: '700 ml · Gin', price: 10499, images: ['beefeater-pink.png'], badge: 'GIN PINK', tone: 'pink', featured: false },
  { id: 'combo-beefeater', name: 'Combo Beefeater', category: 'combos', description: '1 Beefeater 700 ml à escolha + 5 Red Bull 250 ml + 5 gelos', price: 15999, redBullUnits: 5, iceUnits: 5, bottleOptions: BEEFEATER_BOTTLES, images: ['beefeater-tradicional.png', 'red-bull.jpg'], badge: 'MONTE SEU COMBO', tone: 'pink', featured: true },
  { id: 'red-bull', name: 'Red Bull', category: 'sem-alcool', description: '250 ml · Energético', redBullUnits: 1, price: 1299, images: ['red-bull.jpg'], badge: 'ENERGÉTICO', tone: 'blue', featured: false },
  { id: 'heineken-zero', name: 'Heineken Zero Long Neck', category: 'cervejas', description: '330 ml · Sem álcool', alcoholFree: true, price: 750, images: ['heineken-zero.png'], badge: 'ZERO ÁLCOOL', tone: 'mint', featured: false },
  { id: 'corona', name: 'Corona Extra Long Neck', category: 'cervejas', description: '330 ml · Unidade', price: 900, images: ['corona.png'], badge: 'LONG NECK', tone: 'peach', featured: false },
  { id: 'corona-zero', name: 'Corona Zero Long Neck', category: 'cervejas', description: '330 ml · Sem álcool', alcoholFree: true, price: 750, images: ['corona-zero.jpg'], badge: 'ZERO ÁLCOOL', tone: 'blue', featured: false },
  { id: 'red-label', name: 'Johnnie Walker Red Label', category: 'destilados', description: '1 litro · Whisky', price: 10199, images: ['red-label.png'], badge: 'WHISKY', tone: 'peach', featured: false },
  { id: 'combo-red-label', name: 'Combo Red Label', category: 'combos', description: '1 Red Label 1 L + 5 Red Bull 250 ml + 5 gelos', redBullUnits: 5, iceUnits: 5, price: 13099, images: ['red-label.png', 'red-bull.jpg'], badge: 'COMBO', tone: 'peach', featured: false },
  { id: 'white-horse', name: 'White Horse (Cavalo Branco)', category: 'destilados', description: '700 ml · Whisky', price: 7999, images: ['white-horse-700ml.jpg'], badge: 'WHISKY', tone: 'peach', featured: false },
  { id: 'combo-white-horse', name: 'Combo Cavalo Branco', category: 'combos', description: '1 White Horse 700 ml + 5 Red Bull 250 ml + 5 gelos', redBullUnits: 5, iceUnits: 5, price: 12399, images: ['white-horse-700ml.jpg', 'red-bull.jpg'], badge: 'COMBO', tone: 'peach', featured: false },
  { id: 'rocks', name: 'Gin Rock’s Tradicional', category: 'destilados', description: '1 litro · Gin', price: 3599, images: ['rocks.png'], badge: 'GIN', tone: 'blue', featured: false },
  { id: 'combo-rocks', name: 'Combo Rock’s', category: 'combos', description: '1 Gin Rock’s 1 L + 5 Red Bull 250 ml + 5 gelos', redBullUnits: 5, iceUnits: 5, price: 8799, images: ['rocks.png', 'red-bull.jpg'], badge: 'COMBO', tone: 'blue', featured: false },
  { id: 'eternity', name: 'Gin Eternity Tradicional', category: 'destilados', description: '900 ml · Gin', price: 2499, images: ['eternity.png'], badge: 'GIN', tone: 'mint', featured: false },
  { id: 'combo-eternity', name: 'Combo Eternity com Baly', category: 'combos', description: '1 Gin Eternity 900 ml + 1 garrafa de Baly à escolha + 5 gelos', balyUnits: 1, iceUnits: 5, price: 5999, images: ['eternity.png', 'baly-morango-pessego.png'], imageLayout: 'bottle-pair', badge: 'COMBO', tone: 'mint', featured: false },
  { id: 'combo-eternity-red-bull', name: 'Combo Eternity com Red Bull', category: 'combos', description: '1 Gin Eternity 900 ml + 5 Red Bull 250 ml + 5 gelos', redBullUnits: 5, iceUnits: 5, price: 6999, images: ['eternity.png', 'red-bull.jpg'], badge: 'COMBO', tone: 'mint', featured: false },
];

