const parametros = new URLSearchParams(window.location.search);

const vendedorParametro = parametros.get("vendedor");

const vendedores = {

    gil: {
        nome: "Gil",
        whatsapp: "5549999001256"
    },


    vivi: {
        nome: "Vivi",
        whatsapp: "5549984185249"
    }

};

const vendedorAtual =
    vendedores[vendedorParametro] || vendedores.vivi;

function obterUrlImagem(imagem) {
  return imagem.startsWith("http") ? imagem : `assets/img/${imagem}`;
}

function informacao(nome, valor) {
  if (!valor) return "";

  return `<p><strong>${nome}:</strong> ${valor}</p>`;
}

function criarModal(produto) {
  const imagem = obterUrlImagem(produto.img);

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
            <img src="${imagem}" alt="${produto.titulo}">

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

                    ${informacao("Armazenamento", produto.armazenamento)}
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
          <button class="btn btn-primary justify-content-start" style="display: flex; gap: 0.5rem; margin-right: auto;"
          data-id="${produto.id}"
          data-acao="carrinho">
          Adicionar ao carrinho
          </button>
          <a
              href="https://api.whatsapp.com/send?phone=${vendedorAtual?.whatsapp}&text=Olá,%20gostaria%20de%20mais%20informações%20sobre%20o%20produto%20${encodeURIComponent(produto.titulo)}."
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
    const imagem = obterUrlImagem(produto.img);

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
  const { data, error } = await clienteSupabase
    .from("produtos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos:", error.message);
    return [];
  }

  return data;
}

window.addEventListener("DOMContentLoaded", async () => {
  const categoriaAtual = document.body.dataset.categoria;
  const formulario = document.getElementById("formPesquisa");
  const campoPesquisa = document.getElementById("campoPesquisa");
  const produtos = await carregarProdutosDoBanco();

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