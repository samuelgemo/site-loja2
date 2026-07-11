window.addEventListener("DOMContentLoaded", async () => {
  const formulario = document.getElementById("formProduto");
  const lista = document.getElementById("listaProdutos");
  const botaoCancelar = document.getElementById("botaoCancelar");
  const tituloFormulario = document.getElementById("tituloFormulario");
  const botaoSalvar = document.getElementById("botaoSalvar");

  const areaLogin = document.getElementById("areaLogin");
  const formLogin = document.getElementById("formLogin");
  const mensagemLogin = document.getElementById("mensagemLogin");
  const painelAdmin = document.getElementById("painelAdmin");
  const botaoSair = document.getElementById("botaoSair");

  const campoCategoria = document.getElementById("categoria");
  const campoImagem = document.getElementById("img");
  const campoArquivoImagem = document.getElementById("arquivoImagem");
  const areaPreviewImagem = document.getElementById("areaPreviewImagem");
  const previewImagem = document.getElementById("previewImagem");
  const gruposEspecificacao = formulario.querySelectorAll("[data-categorias]");
  const botaoRemoverImagem = document.getElementById("botaoRemoverImagem");
  const armazenamentoPorCor = document.getElementById("armazenamentoPorCor");
  const campoArmazenamentoGeral = document.getElementById("armazenamento");
  const listaCores = document.getElementById("listaCores");

  let produtos = [];
  let arquivoSelecionado = null;
  let coresProduto = [];
  let coresRemovidas = [];

  const camposPorCategoria = {
    celular: [
      "id",
      "categoria",
      "titulo",
      "marca",
      "descricao",
      "img",
      "preco",
      "armazenamento",
      "ram",
      "camera",
      "cor",
      "tela",
      "bateria",
      "sistema",
    ],
    tablet: [
      "id",
      "categoria",
      "titulo",
      "marca",
      "descricao",
      "img",
      "preco",
      "armazenamento",
      "ram",
      "cor",
      "tela",
      "bateria",
      "sistema",
    ],
    tv: [
      "id",
      "categoria",
      "titulo",
      "marca",
      "descricao",
      "img",
      "preco",
      "tela",
      "resolucao",
      "painel",
      "sistema",
    ],
  };

  function escaparHtml(texto) {
    return String(texto || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function atualizarEspecificacoes() {
    const categoria = campoCategoria.value;

    gruposEspecificacao.forEach((grupo) => {
      const categoriasPermitidas = grupo.dataset.categorias.split(" ");

      grupo.hidden = !categoriasPermitidas.includes(categoria);
    });
  }

  function atualizarArmazenamentoPorCor() {
    const ativado = armazenamentoPorCor.checked;

    campoArmazenamentoGeral.closest(".mb-3").hidden = ativado;

    document.querySelectorAll(".armazenamentoIndividual").forEach((campo) => {
      campo.hidden = !ativado;
    });
  }

  function atualizarTipoArmazenamento() {
    if (armazenamentoPorCor.checked) {
      campoArmazenamentoGeral.disabled = true;
      campoArmazenamentoGeral.value = "";
    } else {
      campoArmazenamentoGeral.disabled = false;
    }
  }

  function criarBlocoCor() {
    const id = Date.now();

    const bloco = document.createElement("div");

    bloco.className = "card mb-3 p-3 blocoCor";

    bloco.dataset.id = id;

    bloco.innerHTML = `
        <div class="row g-3">
          <input
            type="hidden"
            class="idCor">
            <div class="col-md-6">
                <label class="form-label">
                    Nome da cor
                </label>

                <input
                    class="form-control nomeCor"
                    placeholder="Ex: Preto">
            </div>


            <div class="col-md-6 armazenamentoIndividual">
                <label class="form-label">
                    Armazenamentos
                </label>

                <input
                    class="form-control armazenamentosCor"
                    placeholder="Ex: 128GB,256GB">
            </div>


            <div class="col-12">

                <label class="form-label">
                    Imagem
                </label>

                <input
                    class="form-control mb-2 imagemCor"
                    placeholder="Cole um link ou uma imagem (Ctrl + V)">

                <div class="text-center text-secondary small my-2">
                    ou
                </div>


                <div class="input-group">

                    <input
                        class="form-control arquivoImagemCor"
                        type="file"
                        accept="image/*">

                    <button
                        class="btn btn-outline-danger removerImagemCor"
                        type="button"
                        title="Remover imagem">

                        🗑️

                    </button>

                </div>


                <div
                    class="areaPreviewCor image-preview mt-3"
                    hidden>

                    <img
                        class="previewImagemCor"
                        alt="Prévia da cor">

                    <small>
                        Prévia da imagem
                    </small>

                </div>

            </div>


            <div class="col-md-6">

                <label class="form-label">
                    Swatch
                </label>

                <input
                    type="color"
                    class="form-control form-control-color swatchCor"
                    value="#000000">

            </div>


            <div class="col-12 text-end">

                <button
                    type="button"
                    class="btn btn-outline-danger removerCor">

                    🗑 Remover cor

                </button>

            </div>

        </div>
    `;

    listaCores.appendChild(bloco);

    const armazenamentoIndividual = bloco.querySelector(
      ".armazenamentoIndividual",
    );

    armazenamentoIndividual.hidden = !armazenamentoPorCor.checked;

    const campoImagem = bloco.querySelector(".imagemCor");

    const arquivoImagem = bloco.querySelector(".arquivoImagemCor");

    const preview = bloco.querySelector(".previewImagemCor");

    const areaPreview = bloco.querySelector(".areaPreviewCor");

    function atualizarPreview() {
      if (arquivoImagem.files.length > 0) {
        preview.src = URL.createObjectURL(arquivoImagem.files[0]);

        areaPreview.hidden = false;

        campoImagem.value = "";

        return;
      }

      const link = campoImagem.value.trim();

      if (link) {
        preview.src = link;

        areaPreview.hidden = false;

        arquivoImagem.value = "";

        return;
      }

      preview.removeAttribute("src");

      areaPreview.hidden = true;
    }

    arquivoImagem.addEventListener("change", atualizarPreview);

    campoImagem.addEventListener("input", atualizarPreview);

    campoImagem.addEventListener("paste", (evento) => {
      const itens = evento.clipboardData.items;

      for (const item of itens) {
        if (item.type.startsWith("image")) {
          const arquivo = item.getAsFile();
          const transferencia = new DataTransfer();
          transferencia.items.add(arquivo);
          arquivoImagem.files = transferencia.files;
          campoImagem.value = "";
          atualizarPreview();
          break;
        }
      }
    });

    bloco.querySelector(".removerImagemCor").addEventListener("click", () => {
      arquivoImagem.value = "";

      campoImagem.value = "";

      preview.removeAttribute("src");

      areaPreview.hidden = true;
    });
  }

  function atualizarPreviewImagem() {
    if (arquivoSelecionado) {
      previewImagem.src = URL.createObjectURL(arquivoSelecionado);
      areaPreviewImagem.hidden = false;

      return;
    }

    const valor = campoImagem.value.trim();

    if (!valor) {
      previewImagem.removeAttribute("src");
      areaPreviewImagem.hidden = true;

      return;
    }

    previewImagem.src = valor.startsWith("http")
      ? valor
      : `assets/img/${valor}`;

    areaPreviewImagem.hidden = false;
  }

  function exibirProdutos() {
    lista.innerHTML = "";

    if (produtos.length === 0) {
      lista.innerHTML = `
        <p class="text-secondary mb-0">
          Nenhum produto cadastrado no banco.
        </p>
      `;
      return;
    }

    produtos.forEach((produto) => {
      lista.innerHTML += `
        <div class="list-group-item d-flex justify-content-between align-items-center gap-3">
          <div>
            <strong>${escaparHtml(produto.titulo)}</strong>
            <br>
            <small class="text-secondary">
              ${escaparHtml(produto.categoria)} ·
              ${escaparHtml(produto.marca || "Sem marca")}
            </small>
          </div>

          <div class="btn-group">
            <button class="btn btn-sm btn-outline-primary"
              data-acao="editar"
              data-id="${produto.id}">
              Editar
            </button>

            <button class="btn btn-sm btn-outline-danger"
              data-acao="excluir"
              data-id="${produto.id}">
              Excluir
            </button>
          </div>
        </div>
      `;
    });
  }

  async function carregarProdutos() {
    const { data, error } = await clienteSupabase
      .from("produtos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(`Erro ao carregar produtos: ${error.message}`);
      return;
    }

    produtos = data || [];
    exibirProdutos();
  }

  async function sincronizarCoresProduto(produtoId) {
    const { data: coresBanco, error } = await clienteSupabase
      .from("produto_imagens")
      .select("*")
      .eq("produto_id", produtoId);

    if (error) {
      throw error;
    }

    // Remove cores apagadas
    for (const id of coresRemovidas) {
      await clienteSupabase.from("produto_imagens").delete().eq("id", id);
    }

    const blocos = document.querySelectorAll(".blocoCor");

    for (const bloco of blocos) {
      const idCor = bloco.querySelector(".idCor").value;

      const nomeCor = bloco.querySelector(".nomeCor").value.trim();

      const arquivo = bloco.querySelector(".arquivoImagemCor").files[0];

      const linkImagem = bloco.querySelector(".imagemCor").value.trim();

      const swatch = bloco.querySelector(".swatchCor").value;

      const armazenamentos = bloco
        .querySelector(".armazenamentosCor")
        .value.trim();

      let imagem = linkImagem || bloco.dataset.imagemAtual || "";

      if (arquivo) {
        const extensao = arquivo.name.split(".").pop();

        const nomeArquivo = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extensao}`;

        const { error: erroUpload } = await clienteSupabase.storage
          .from("produtos")
          .upload(nomeArquivo, arquivo);

        if (erroUpload) {
          throw erroUpload;
        }

        const { data } = clienteSupabase.storage
          .from("produtos")
          .getPublicUrl(nomeArquivo);

        imagem = data.publicUrl;
      }

      const dadosCor = {
        produto_id: produtoId,
        nome_cor: nomeCor,
        imagem: imagem,
        swatch: swatch,
        armazenamentos: armazenamentos,
      };

      if (idCor) {
        await clienteSupabase
          .from("produto_imagens")
          .update(dadosCor)
          .eq("id", idCor);
      } else {
        await clienteSupabase.from("produto_imagens").insert(dadosCor);
      }
    }

    coresRemovidas = [];
  }

  function limparFormulario() {
    formulario.reset();
    document.getElementById("id").value = "";
    armazenamentoPorCor.checked = false;

    tituloFormulario.textContent = "Adicionar produto";
    botaoSalvar.textContent = "Salvar produto";

    atualizarEspecificacoes();
    atualizarPreviewImagem();
    atualizarTipoArmazenamento();
    atualizarArmazenamentoPorCor();
  }

  async function carregarCoresProduto(produtoId) {
    listaCores.innerHTML = "";

    const { data, error } = await clienteSupabase
      .from("produto_imagens")
      .select("*")
      .eq("produto_id", produtoId)
      .order("ordem");

    if (error) {
      console.error("Erro ao carregar cores:", error.message);

      return;
    }

    data.forEach((cor) => {
      criarBlocoCor();

      const bloco = listaCores.lastElementChild;

      bloco.querySelector(".idCor").value = cor.id;

      console.log("ID DA COR:", cor.id);

      bloco.querySelector(".nomeCor").value = cor.nome_cor;

      bloco.querySelector(".imagemCor").value = cor.imagem;

      bloco.dataset.imagemAtual = cor.imagem;

      bloco.querySelector(".swatchCor").value = cor.swatch;

      bloco.querySelector(".armazenamentosCor").value =
        cor.armazenamentos || "";

      const preview = bloco.querySelector(".previewImagemCor");

      const areaPreview = bloco.querySelector(".areaPreviewCor");

      if (cor.imagem) {
        preview.src = cor.imagem;

        areaPreview.hidden = false;
      }
    });
  }

  function editarProduto(id) {
    const produto = produtos.find((item) => item.id === id);

    if (!produto) return;

    Object.keys(produto).forEach((campo) => {
      const elemento = formulario.elements[campo];

      if (elemento) {
        elemento.value = produto[campo] || "";
      }
    });
    armazenamentoPorCor.checked = produto.armazenamento_por_cor;

    tituloFormulario.textContent = "Editar produto";
    botaoSalvar.textContent = "Salvar alterações";

    atualizarEspecificacoes();
    atualizarPreviewImagem();
    atualizarTipoArmazenamento();
    atualizarArmazenamentoPorCor();

    carregarCoresProduto(produto.id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirProduto(id) {
    const produto = produtos.find((item) => item.id === id);

    if (!produto) return;

    if (!confirm(`Deseja excluir "${produto.titulo}"?`)) {
      return;
    }

    const { error } = await clienteSupabase
      .from("produtos")
      .delete()
      .eq("id", id);

    if (error) {
      alert(`Erro ao excluir: ${error.message}`);
      return;
    }

    await carregarProdutos();
  }

  function mostrarPainel() {
    areaLogin.hidden = true;
    painelAdmin.hidden = false;
    botaoSair.hidden = false;

    carregarProdutos();
  }

  function mostrarLogin() {
    areaLogin.hidden = false;
    painelAdmin.hidden = true;
    botaoSair.hidden = true;
  }

  formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    mensagemLogin.textContent = "";

    const email = document.getElementById("emailLogin").value.trim();
    const senha = document.getElementById("senhaLogin").value;

    const { error } = await clienteSupabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      mensagemLogin.textContent = "E-mail ou senha inválidos.";
      return;
    }
    
    mostrarPainel();
  });

  botaoSair.addEventListener("click", async () => {
    await clienteSupabase.auth.signOut();
    limparFormulario();
    mostrarLogin();
  });

  campoCategoria.addEventListener("change", atualizarEspecificacoes);

  document
    .getElementById("botaoAdicionarCor")
    .addEventListener("click", criarBlocoCor);

  listaCores.addEventListener("click", (evento) => {
    if (evento.target.classList.contains("removerCor")) {
      const bloco = evento.target.closest(".blocoCor");

      const id = bloco.querySelector(".idCor").value;

      if (id) {
        coresRemovidas.push(id);
      }

      bloco.remove();
    }
  });

  armazenamentoPorCor.addEventListener("change", atualizarTipoArmazenamento);

  campoImagem.addEventListener("input", () => {
    if (campoImagem.value.trim() !== "") {
      arquivoSelecionado = null;
      campoArquivoImagem.value = "";
    }
    atualizarPreviewImagem();
  });

  campoArquivoImagem.addEventListener("change", () => {
    if (campoArquivoImagem.files.length > 0) {
      arquivoSelecionado = campoArquivoImagem.files[0];
      campoImagem.value = "";
    }
    atualizarPreviewImagem();
  });
  botaoRemoverImagem.addEventListener("click", () => {
    arquivoSelecionado = null;

    campoArquivoImagem.value = "";

    campoImagem.value = "";

    atualizarPreviewImagem();
  });
  campoImagem.addEventListener("paste", (evento) => {
    const itens = evento.clipboardData.items;
    for (const item of itens) {
      if (item.type.startsWith("image")) {
        arquivoSelecionado = item.getAsFile();

        campoImagem.value = "";
        campoArquivoImagem.value = "";
        atualizarPreviewImagem();

        break;
      }
    }
  });

  armazenamentoPorCor.addEventListener("change", atualizarArmazenamentoPorCor);
  campoArquivoImagem.addEventListener("change", atualizarPreviewImagem);

  previewImagem.addEventListener("error", () => {
    areaPreviewImagem.hidden = true;
  });

  formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const { data: usuario } = await clienteSupabase.auth.getUser();

    console.log(usuario);

    const dados = Object.fromEntries(new FormData(formulario).entries());
    const produto = {};

    camposPorCategoria[dados.categoria].forEach((campo) => {
      produto[campo] = (dados[campo] || "").trim();
    });

    produto.armazenamento_por_cor = armazenamentoPorCor.checked;

    if (arquivoSelecionado) {
      const extensao = arquivoSelecionado.name.includes(".")
        ? arquivoSelecionado.name.split(".").pop()
        : arquivoSelecionado.type.split("/")[1];

      const nomeArquivo = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extensao}`;

      console.log("Arquivo selecionado:", arquivoSelecionado);
      console.log("Nome:", arquivoSelecionado.name);
      console.log("Tipo:", arquivoSelecionado.type);
      const { error: erroUpload } = await clienteSupabase.storage
        .from("produtos")
        .upload(nomeArquivo, arquivoSelecionado);

      if (erroUpload) {
        alert(erroUpload.message);

        return;
      }

      const { data } = clienteSupabase.storage
        .from("produtos")
        .getPublicUrl(nomeArquivo);

      produto.img = data.publicUrl;
    }
    if (!arquivoSelecionado && dados.img.trim() !== "") {
      produto.img = dados.img.trim();
    }
    let error;
    let idProduto;

    if (produto.id) {
      const id = produto.id;
      idProduto = id;
      delete produto.id;

      ({ error } = await clienteSupabase
        .from("produtos")
        .update(produto)
        .eq("id", id));
    } else {
      delete produto.id;

      const { data, error: erroInserir } = await clienteSupabase
        .from("produtos")
        .insert(produto)
        .select()
        .single();

      error = erroInserir;

      if (!error) {
        idProduto = data.id;
      }
      console.log("Produto criado:", idProduto);
    }

    if (error) {
      alert(`Erro ao salvar: ${error.message}`);
      return;
    }
    try {
      console.log("ID DO PRODUTO PARA CORES:", idProduto);
      await sincronizarCoresProduto(idProduto);
    } catch (error) {
      alert(`Erro ao salvar cores: ${error.message}`);

      return;
    }
    await carregarProdutos();
    limparFormulario();
  });

  lista.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button");

    if (!botao) return;

    const { acao, id } = botao.dataset;

    if (acao === "editar") {
      editarProduto(id);
    }

    if (acao === "excluir") {
      excluirProduto(id);
    }
  });

  botaoCancelar.addEventListener("click", limparFormulario);

  atualizarEspecificacoes();
  atualizarPreviewImagem();
  atualizarTipoArmazenamento();
  atualizarArmazenamentoPorCor();

  const { data } = await clienteSupabase.auth.getSession();

  if (data.session) {
    mostrarPainel();
  } else {
    mostrarLogin();
  }
});
