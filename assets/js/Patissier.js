document.addEventListener("DOMContentLoaded", function () {
  let currentLanguage = "PT"; // Idioma padrão
  const menuContainer = document.getElementById("menu");
  const searchBar = document.getElementById("search-bar");

  // Função para carregar o menu
  function loadMenu() {
    const menuData = `cardapio_patissier.json`; // Arquivo fixo da Patissier
    fetch(menuData)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao carregar o arquivo: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        renderMenu(data);
      })
      .catch((error) => {
        console.error("Erro ao carregar o cardápio:", error);
        menuContainer.innerHTML = `<div class="alert alert-danger" role="alert">
          Não foi possível carregar o cardápio. Tente novamente mais tarde.
        </div>`;
      });
  }

  // Função para renderizar o menu
  function renderMenu(data) {
    menuContainer.innerHTML = "";
    Object.keys(data).forEach((category, index) => {
      const items = data[category]
        .map(
          (item) => `
          <div class="list-group-item d-flex justify-content-between align-items-center">
            <span>${item.nome}</span>
            ${
              item.preco
                ? `<strong>R$ ${item.preco.toFixed(2)}</strong>`
                : `<em>Consulte o valor</em>`
            }
          </div>
        `
        )
        .join("");

      const accordionItem = `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading${index}">
            <button
              class="accordion-button ${index !== 0 ? "collapsed" : ""}"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse${index}"
              aria-expanded="${index === 0}"
              aria-controls="collapse${index}"
            >
              ${category}
            </button>
          </h2>
          <div
            id="collapse${index}"
            class="accordion-collapse collapse ${index === 0 ? "show" : ""}"
            aria-labelledby="heading${index}"
            data-bs-parent="#menu"
          >
            <div class="accordion-body">
              <div class="list-group">
                ${items}
              </div>
            </div>
          </div>
        </div>
      `;
      menuContainer.innerHTML += accordionItem;
    });
  }

  // Função para filtrar os itens do menu
  searchBar.addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const items = document.querySelectorAll("#menu .list-group-item");
    items.forEach((item) => {
      const itemName = item.querySelector("span").textContent.toLowerCase();
      item.style.display = itemName.includes(searchTerm) ? "" : "none";
    });
  });

  // Carregar o menu ao iniciar
  loadMenu();
});
