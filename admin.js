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
  

  let produtos = [];
  let arquivoSelecionado = null;

  const camposPorCategoria = {
    celular: [
      "id", "categoria", "titulo", "marca", "descricao", "img", "preco",
      "armazenamento", "ram", "camera", "cor", "tela", "bateria", "sistema"
    ],
    tablet: [
      "id", "categoria", "titulo", "marca", "descricao", "img", "preco",
      "armazenamento", "ram", "cor", "tela", "bateria", "sistema"
    ],
    tv: [
      "id", "categoria", "titulo", "marca", "descricao", "img", "preco",
      "tela", "resolucao", "painel", "sistema"
    ]
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

  function atualizarPreviewImagem() {

  if (arquivoSelecionado) {
    previewImagem.src =
      URL.createObjectURL(arquivoSelecionado);
    areaPreviewImagem.hidden = false;

    return;
  }

  const valor = campoImagem.value.trim();

  if (!valor) {

    previewImagem.removeAttribute("src");
    areaPreviewImagem.hidden = true;

    return;

  }

  previewImagem.src =
    valor.startsWith("http")
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

  function limparFormulario() {
    formulario.reset();
    document.getElementById("id").value = "";

    tituloFormulario.textContent = "Adicionar produto";
    botaoSalvar.textContent = "Salvar produto";

    atualizarEspecificacoes();
    atualizarPreviewImagem();
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

    tituloFormulario.textContent = "Editar produto";
    botaoSalvar.textContent = "Salvar alterações";

    atualizarEspecificacoes();
    atualizarPreviewImagem();

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
      password: senha
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

campoImagem.addEventListener("input", () => {
    if (campoImagem.value.trim() !== "") {
        arquivoSelecionado = null;
        campoArquivoImagem.value = "";
    }
    atualizarPreviewImagem();
});

campoArquivoImagem.addEventListener("change", () => {
    if (campoArquivoImagem.files.length > 0) {
        arquivoSelecionado =
            campoArquivoImagem.files[0];
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

            arquivoSelecionado =
                item.getAsFile();

            campoImagem.value = "";
            campoArquivoImagem.value = "";
            atualizarPreviewImagem();

            break;
        }
    }
});

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

    if (arquivoSelecionado) {

        const extensao = arquivoSelecionado.name.includes(".")
        ? arquivoSelecionado.name.split(".").pop()
        : arquivoSelecionado.type.split("/")[1];

        const nomeArquivo =
            `${Date.now()}-${Math.random().toString(36).substring(2)}.${extensao}`;

        console.log("Arquivo selecionado:", arquivoSelecionado);
        console.log("Nome:", arquivoSelecionado.name);
        console.log("Tipo:", arquivoSelecionado.type);
        const { error: erroUpload } =
            await clienteSupabase.storage
                .from("produtos")
                .upload(nomeArquivo, arquivoSelecionado,);

        if (erroUpload) {

            alert(erroUpload.message);

            return;

        }

        const { data } =
            clienteSupabase.storage
                .from("produtos")
                .getPublicUrl(nomeArquivo);

        produto.img = data.publicUrl;

    }
    if (!arquivoSelecionado && dados.img.trim() !== "") {

        produto.img = dados.img.trim();

    }
    let error;

    if (produto.id) {
      const id = produto.id;
      delete produto.id;

      ({ error } = await clienteSupabase
        .from("produtos")
        .update(produto)
        .eq("id", id));
    } else {
      delete produto.id;
    
      ({ error } = await clienteSupabase
        .from("produtos")
        .insert(produto));
    }

    if (error) {
      alert(`Erro ao salvar: ${error.message}`);
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

  const { data } = await clienteSupabase.auth.getSession();

  if (data.session) {
    mostrarPainel();
  } else {
    mostrarLogin();
  }
});