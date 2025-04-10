document.addEventListener("DOMContentLoaded", function () {
  let currentLanguage = "PT"; // Idioma padrão
  const menuContainer = document.getElementById("menu");

  function loadMenu() {
    const menuData = `cardapio_${currentLanguage.toLowerCase()}.json`; // Seleciona o arquivo JSON do idioma
    fetch(menuData)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao carregar o arquivo: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        menuContainer.innerHTML = ""; // Limpa o menu
        Object.keys(data).forEach((category, index) => {
          const items = data[category]
            .map(
              (item) => `
              <div class="list-group-item d-flex justify-content-between align-items-center">
                <span>${item.nome}</span>
                <strong>R$ ${item.preco.toFixed(2)}</strong>
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
      })
      .catch((error) => console.error("Erro ao carregar o cardápio:", error));
  }

  // Alterna entre os idiomas ao clicar nos botões
  document.getElementById("btn-pt").addEventListener("click", function () {
    currentLanguage = "PT";
    loadMenu();
  });

  document.getElementById("btn-en").addEventListener("click", function () {
    currentLanguage = "EN";
    loadMenu();
  });

  document.getElementById("btn-es").addEventListener("click", function () {
    currentLanguage = "ES";
    loadMenu();
  });

  document.getElementById("search-bar").addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const items = document.querySelectorAll("#menu .list-group-item");
    items.forEach((item) => {
      const itemName = item.querySelector("span").textContent.toLowerCase();
      item.style.display = itemName.includes(searchTerm) ? "" : "none";
    });
  });

  loadMenu(); // Carrega o menu inicialmente
});