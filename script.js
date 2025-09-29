const produtos = [
  {titulo: "Xiaomi 17 Pro Max", marca:'Xiaomi', descricao: "Bom para fotos", img: "xiaomi.jpeg", armazenamento: '1024GB', ram: '16GB', camera: '50 Mpx', cor: 'Preto, verde e branco', preco:'R$ 1000,00'},
  {titulo: "Produto 2", descricao: "Descrição 2", img: "xiaomi2.jpeg"},
  {titulo: "Produto 3", descricao: "Descrição 3", img: "xiaomi3.jpeg"},
  {titulo: "Produto 4", descricao: "Descrição 4", img: "https://via.placeholder.com/300"},
  {titulo: "Produto 5", descricao: "Descrição 5", img: "https://via.placeholder.com/300"},
  {titulo: "Produto 6", descricao: "Descrição 6", img: "https://via.placeholder.com/300"}
];

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById("vitrine");
  
  produtos.forEach((produto, index) => {
    // Cria o card
    container.innerHTML += `
      <div class="col">
        <div class="card">
          <img src="assets/img/${produto.img}" class="card-img-top" alt="${produto.titulo}" 
               data-bs-toggle="modal" data-bs-target="#modal${index}">
          <div class="card-body">
            <h5 class="card-title">${produto.titulo}</h5>
            <p class="card-text">${produto.descricao}</p>
          </div>
        </div>
      </div>

      <!-- Modal do produto -->
      <div class="modal fade" id="modal${index}" tabindex="-1" aria-labelledby="modalLabel${index}" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel${index}">${produto.titulo}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body text-center">
              <img src="assets/img/${produto.img}" alt="${produto.titulo}">
              <p><strong>Marca:</strong> ${produto.marca || 'Indisponível'}</p>
              <p><strong>Descrição:</strong> ${produto.descricao || 'Indisponível'}</p>
              <p><strong>Armazenamento:</strong> ${produto.armazenamento || 'Indisponível'}</p>
              <p><strong>RAM:</strong> ${produto.ram || 'Indisponível'}</p>
              <p><strong>Câmera:</strong> ${produto.camera || 'Indisponível'}</p>
              <p><strong>Cores:</strong> ${produto.cor || 'Indisponível'}</p>
              <p><strong>Preço:</strong> ${produto.preco || 'Indisponível'}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
});
