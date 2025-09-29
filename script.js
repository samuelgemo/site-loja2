const produtos = [
  {titulo: "Produto 1", descricao: "Descrição 1", img: "https://via.placeholder.com/300"},
  {titulo: "Produto 2", descricao: "Descrição 2", img: "https://via.placeholder.com/300"},
  {titulo: "Produto 3", descricao: "Descrição 3", img: "https://via.placeholder.com/300"},
  {titulo: "Produto 4", descricao: "Descrição 4", img: "https://via.placeholder.com/300"},
  {titulo: "Produto 5", descricao: "Descrição 5", img: "https://via.placeholder.com/300"},
  {titulo: "Produto 6", descricao: "Descrição 6", img: "https://via.placeholder.com/300"}
];

window.addEventListener('DOMContentLoaded', () => { // espera o HTML carregar
  const container = document.getElementById("vitrine");
  produtos.forEach(produto => {
    container.innerHTML += `
      <div class="col">
        <div class="card">
          <img src="${produto.img}" class="card-img-top" alt="${produto.titulo}">
          <div class="card-body">
            <h5 class="card-title">${produto.titulo}</h5>
            <p class="card-text">${produto.descricao}</p>
          </div>
        </div>
      </div>
    `;
  });
});
