const produtosIniciais = [
  {
    id: "celular-1",
    categoria: "celular",
    titulo: "Xiaomi 17 Pro Max",
    armazenamento: "1024GB",
    ram: "16GB",
    camera: "50 Mpx",
    marca: "Xiaomi",
    cor: "Azul",
    descricao: "Bom para fotos",
    bateria: "5.000 mAh",
    sistema: "Android 13",
    img: "xiaomi.jpeg",
    preco: "R$ 8000,00"
  },
  {
    id: "celular-2",
    categoria: "celular",
    titulo: "Produto 2",
    armazenamento: "1024GB",
    ram: "16GB",
    camera: "50 Mpx",
    marca: "Xiaomi",
    cor: "Preto, verde e branco",
    descricao: "Bom para fotos",
    bateria: "5.000 mAh",
    sistema: "Android 13",
    img: "xiaomi.jpeg",
    preco: "R$ 1000,00"
  },
  {
    id: "celular-3",
    categoria: "celular",
    titulo: "Produto 3",
    armazenamento: "1024GB",
    ram: "16GB",
    camera: "50 Mpx",
    marca: "Xiaomi",
    cor: "Preto, verde e branco",
    descricao: "Bom para fotos",
    bateria: "5.000 mAh",
    sistema: "Android 13",
    img: "xiaomi.jpeg",
    preco: "R$ 1000,00"
  },
  {
    id: "tablet-1",
    categoria: "tablet",
    titulo: "Tablet Samsung Galaxy Tab",
    marca: "Samsung",
    descricao: "Tablet para estudos e entretenimento",
    img: "https://via.placeholder.com/300",
    tela: '10.9"',
    armazenamento: "128GB",
    ram: "8GB",
    bateria: "8.000 mAh",
    preco: "R$ 1.500,00"
  },
  {
    id: "tablet-2",
    categoria: "tablet",
    titulo: "Tablet Xiaomi Pad",
    marca: "Xiaomi",
    descricao: "Tablet com tela grande",
    img: "https://via.placeholder.com/300",
    tela: '11"',
    armazenamento: "256GB",
    ram: "8GB",
    bateria: "8.840 mAh",
    preco: "R$ 1.800,00"
  },
  {
    id: "tv-1",
    categoria: "tv",
    titulo: "Smart TV Samsung",
    marca: "Samsung",
    descricao: "Smart TV com imagem em alta definição",
    img: "https://via.placeholder.com/300",
    tela: '50"',
    resolucao: "4K UHD",
    painel: "LED",
    sistema: "Tizen",
    preco: "R$ 2.500,00"
  },
  {
    id: "tv-2",
    categoria: "tv",
    titulo: "Smart TV LG",
    marca: "LG",
    descricao: "TV para filmes, séries e jogos",
    img: "https://via.placeholder.com/300",
    tela: '55"',
    resolucao: "4K UHD",
    painel: "OLED",
    sistema: "webOS",
    preco: "R$ 3.500,00"
  }
];

const CHAVE_PRODUTOS = "vitrine_produtos";

function carregarProdutos() {
  const dadosSalvos = localStorage.getItem(CHAVE_PRODUTOS);

  // Se já houver produtos salvos, usa-os.
  if (dadosSalvos) {
    return JSON.parse(dadosSalvos);
  }

  // Na primeira visita, salva os produtos que já existem.
  localStorage.setItem(
    CHAVE_PRODUTOS,
    JSON.stringify(produtosIniciais)
  );

  return produtosIniciais;
}

function salvarProdutos(produtos) {
  localStorage.setItem(
    CHAVE_PRODUTOS,
    JSON.stringify(produtos)
  );
}