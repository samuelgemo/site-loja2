let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let produtos = [];

const parametros = new URLSearchParams(window.location.search);
const vendedorParametro = parametros.get("vendedor");
const vendedores = {
  gil: {
    nome: "Gil",
    whatsapp: "5549999001256",
  },

  vivi: {
    nome: "Vivi",
    whatsapp: "5549984185249",
  },
};

const vendedorAtual = vendedores[vendedorParametro] || vendedores.vivi;

function obterUrlImagem(imagem) {
  return imagem.startsWith("http") ? imagem : `assets/img/${imagem}`;
}

function informacao(nome, valor) {
  if (!valor) return "";

  return `<p><strong>${nome}:</strong> ${valor}</p>`;
}

function criarBolinhasCor(produto) {
  if (!produto.cores?.length) {
    return "";
  }

  return `
    <div class="seletorCores mt-3">

      ${produto.cores
        .map(
          (cor, indice) => `

        <button
          class="bolinhaCor ${indice === 0 ? "selecionada" : ""}"
          style="background:${cor.swatch}"
          data-imagem="${cor.imagem}"
          data-produto="${produto.id}"
          data-armazenamentos="${cor.armazenamentos || ""}"
          title="${cor.nome_cor}">
        </button>

      `,
        )
        .join("")}

    </div>
  `;
}

function criarModal(produto) {
  const imagemPrincipal = produto.cores?.length
    ? produto.cores[0].imagem
    : produto.img;

  const imagem = obterUrlImagem(imagemPrincipal);

  return `
    <div class="modal fade" id="modal-${produto.id}" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${produto.titulo}</h5>
            <button type="button" class="btn-close"
              data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>
          
          <div class="modal-body text-center">
            <img 
              id="imagem-${produto.id}"
              src="${imagem}" 
              alt="${produto.titulo}"
            >

            ${criarBolinhasCor(produto)}

            <div class="accordion" id="accordion-${produto.id}">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#especificacoes-${produto.id}"
                  >
                    Especificações
                  </button>
                </h2>

                <div
                  id="especificacoes-${produto.id}"
                  class="accordion-collapse collapse"
                  data-bs-parent="#accordion-${produto.id}"
                >
                  <div class="accordion-body text-start">
                    ${informacao("Marca", produto.marca)}
                    ${informacao("Descrição", produto.descricao)}

                    <p id="armazenamento-${produto.id}">
                        <strong>Armazenamento:</strong>
                        ${
                          produto.armazenamento_por_cor
                            ? produto.cores?.[0]?.armazenamentos || ""
                            : produto.armazenamento || ""
                        }
                    </p>
                    ${informacao("RAM", produto.ram)}
                    ${informacao("Câmera", produto.camera)}
                    ${informacao("Cores", produto.cor)}
                    ${informacao("Tela", produto.tela)}
                    ${informacao("Bateria", produto.bateria)}
                    ${informacao("Sistema", produto.sistema)}

                    ${informacao("Resolução", produto.resolucao)}
                    ${informacao("Painel", produto.painel)}
                  </div>
                </div>
              </div>
            </div>

  <p class="product-price">
    R$ ${produto.preco || "Preço sob consulta"}
  </p>
</div>

          <div class="modal-footer">
          <button class="btn btn-primary justify-content-start adicionarCarrinho" style="display: flex; gap: 0.5rem; margin-right: auto;"
          data-id="${produto.id}"
          data-titulo="${produto.titulo}"
          data-preco="${produto.preco}"
          data-img="${produto.img}"
          data-categoria="${produto.categoria}"
          data-acao="carrinho">
          Adicionar à lista
          </button>
          <a
              href="https://api.whatsapp.com/send?phone=${vendedorAtual?.whatsapp}&text=Olá, ${vendedorAtual?.nome}! Gostaria de mais informações sobre o(a) ${encodeURIComponent(produto.categoria)} + ${encodeURIComponent(produto.titulo)}."
              target="_blank"
              class="btn btn-success"
            >
              <i class=" bi bi-whatsapp">  WhatsApp</i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

//Carrinho

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function atualizarContadorCarrinho() {
  const contador = document.getElementById("contadorCarrinho");
  if (!contador) return;
  if (carrinho.length === 0) {
    contador.hidden = true;
    return;
  }
  contador.hidden = false;
  contador.textContent = carrinho.length;
}

function adicionarAoCarrinho(produto) {
  const jaExiste = carrinho.find((item) => item.id == produto.id);

  if (jaExiste) {
    alert("Produto já está na lista.");
    return;
  }

  carrinho.push(produto);

  salvarCarrinho();

  atualizarContadorCarrinho();
}

function enviarCarrinhoWhatsapp() {
  if (carrinho.length === 0) {
    alert("Sua lista está vazia.");

    return;
  }

  let mensagem = `Olá ${vendedorAtual?.nome || "!"}!

Montei uma lista de produtos no site e gostaria de receber mais informações sobre os seguintes itens:

`;

  carrinho.forEach((produto) => {
    mensagem += `${produto.titulo}\n`;
    mensagem += `Categoria: ${produto.categoria}\n`;

    if (produto.preco) {
      mensagem += `Preço anunciado: R$ ${produto.preco}\n`;
    }

    mensagem += "\n";
  });

  mensagem += `Obrigado! Aguardo o retorno. 😊`;

  window.open(
    `https://api.whatsapp.com/send?phone=${vendedorAtual.whatsapp}&text=${encodeURIComponent(mensagem)}`,
    "_blank",
  );
}

function criarInterfaceCarrinho() {
  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <button id="botaoCarrinho" class="botao-carrinho" data-bs-toggle="modal" data-bs-target="#modalCarrinho">
          🛒
          <span id="contadorCarrinho">
              0
          </span>
      </button>
        <div class="modal fade" id="modalCarrinho" tabindex="-1">

            <div class="modal-dialog modal-dialog-scrollable">

                <div class="modal-content">

                    <div class="modal-header">

                        <h5 class="modal-title">
                            Minha lista
                        </h5>

                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Fechar">
                        </button>

                    </div>

                    <div
                        class="modal-body"
                        id="listaCarrinho">

                    </div>

                    <div class="modal-footer">

                        <button
                            class="btn btn-outline-danger"
                            id="limparCarrinho"
                            style="display: flex; gap: 0.5rem; margin-right: auto;">

                            Limpar lista

                        </button>

                        <button
                            class="btn btn-success"
                            id="enviarCarrinhoWhatsapp">

                            <i class="bi bi-whatsapp"></i>

                            Enviar lista

                        </button>

                    </div>

                </div>

            </div>

        </div>
    `,
  );
  document.getElementById("limparCarrinho").addEventListener("click", () => {
    if (!confirm("Deseja remover todos os produtos da lista?")) {
      return;
    }

    carrinho = [];

    salvarCarrinho();

    atualizarContadorCarrinho();

    renderizarCarrinho();
  });
  document
    .getElementById("enviarCarrinhoWhatsapp")
    .addEventListener("click", enviarCarrinhoWhatsapp);
}

function renderizarCarrinho() {
  const lista = document.getElementById("listaCarrinho");

  lista.innerHTML = "";

  if (carrinho.length === 0) {
    lista.innerHTML = `
            <p class="text-center text-secondary">
                Sua lista está vazia.
            </p>
        `;

    return;
  }

  carrinho.forEach((produto) => {
    lista.innerHTML += `

            <div class="d-flex align-items-center border-bottom py-3">

                <img
                    src="${obterUrlImagem(produto.img)}"
                    style="
                        width:70px;
                        height:70px;
                        object-fit:cover;
                        border-radius:10px;
                    ">

                <div class="ms-3 flex-grow-1">

                    <h6 class="mb-1">
                        ${produto.titulo}
                    </h6>

                    <strong>
                        R$ ${produto.preco}
                    </strong>

                </div>

                <button
                    class="btn btn-outline-danger btn-sm removerCarrinho"
                    data-id="${produto.id}">

                    🗑️

                </button>

            </div>

        `;
  });
}

document.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".adicionarCarrinho");

  if (!botao) return;

  const produto = {
    id: botao.dataset.id,

    titulo: botao.dataset.titulo,

    preco: botao.dataset.preco,

    img: botao.dataset.img,

    categoria: botao.dataset.categoria,
  };

  adicionarAoCarrinho(produto);
});

document.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".removerCarrinho");

  if (!botao) return;

  const id = botao.dataset.id;

  carrinho = carrinho.filter((produto) => produto.id != id);

  salvarCarrinho();

  atualizarContadorCarrinho();

  renderizarCarrinho();
});

function exibirProdutos(listaDeProdutos) {
  const vitrine = document.getElementById("vitrine");
  const modais = document.getElementById("modais");

  vitrine.innerHTML = "";
  modais.innerHTML = "";

  if (listaDeProdutos.length === 0) {
    vitrine.innerHTML = `
      <p class="text-center w-100">
        Nenhum produto encontrado.
      </p>
    `;
    return;
  }

  listaDeProdutos.forEach((produto) => {
    const imagemPrincipal = produto.cores?.length
      ? produto.cores[0].imagem
      : produto.img;

    const imagem = obterUrlImagem(imagemPrincipal);

    vitrine.innerHTML += `
      <div class="col-lg-4 col-md-6 col-sm-6 mb-4">
        <div class="card h-100">
          <img
            src="${imagem}"
            class="card-img-top"
            alt="${produto.titulo}"
            data-bs-toggle="modal"
            data-bs-target="#modal-${produto.id}"
          >

          <div class="card-body">
            <span class="badge text-bg-primary mb-2">
              ${produto.categoria}
            </span>

            <h5 class="card-title">${produto.titulo}</h5>
            <p class="card-text fw-bold">
              R$ ${produto.preco || "Preço sob consulta"}
            </p>
          </div>
        </div>
      </div>
    `;

    modais.innerHTML += criarModal(produto);
  });
}

async function carregarProdutosDoBanco() {
  const { data: produtos, error } = await clienteSupabase
    .from("produtos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  const { data: cores } = await clienteSupabase
    .from("produto_imagens")
    .select("*")
    .order("ordem", { ascending: true });

  produtos.forEach((produto) => {
    produto.cores = cores.filter((cor) => cor.produto_id === produto.id);
  });
  console.log(produtos);
  console.log(cores);
  return produtos;
}
document.addEventListener("click", (evento) => {
  const botao = evento.target.closest(".bolinhaCor");

  if (!botao) return;

  const imagem = botao.dataset.imagem;

  const armazenamentos = botao.dataset.armazenamentos;

  const produtoId = botao.dataset.produto;

  const imagemPrincipal = document.getElementById(`imagem-${produtoId}`);

  if (imagemPrincipal) {
    imagemPrincipal.src = obterUrlImagem(imagem);
  }
  const campoArmazenamento = document.getElementById(
    `armazenamento-${produtoId}`,
  );

  if (campoArmazenamento) {
    campoArmazenamento.innerHTML = `<strong>Armazenamento:</strong> ${armazenamentos}`;
  }

  document
    .querySelectorAll(`.bolinhaCor[data-produto="${produtoId}"]`)
    .forEach((bolinha) => {
      bolinha.classList.remove("selecionada");
    });

  botao.classList.add("selecionada");
});

window.addEventListener("DOMContentLoaded", async () => {
  const categoriaAtual = document.body.dataset.categoria;
  const formulario = document.getElementById("formPesquisa");
  const campoPesquisa = document.getElementById("campoPesquisa");
  produtos = await carregarProdutosDoBanco();
  criarInterfaceCarrinho();
  const modalCarrinho = document.getElementById("modalCarrinho");

  modalCarrinho.addEventListener("show.bs.modal", renderizarCarrinho);
  atualizarContadorCarrinho();

  // Cria uma área própria para os modais.
  const modais = document.createElement("div");
  modais.id = "modais";
  document.body.appendChild(modais);

  // Seleciona somente os produtos da página atual.
  const produtosDaPagina = produtos.filter((produto) => {
    return produto.categoria === categoriaAtual;
  });

  exibirProdutos(produtosDaPagina);

  function pesquisar() {
    const termo = campoPesquisa.value.trim().toLowerCase();

    const resultados = produtosDaPagina.filter((produto) => {
      const textoProduto = `
        ${produto.titulo}
        ${produto.marca || ""}
        ${produto.descricao || ""}
      `.toLowerCase();

      return textoProduto.includes(termo);
    });

    exibirProdutos(resultados);
  }

  campoPesquisa.addEventListener("input", pesquisar);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    pesquisar();
  });
});
