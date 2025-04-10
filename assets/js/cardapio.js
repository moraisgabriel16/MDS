document.addEventListener("DOMContentLoaded", function () {
    const menuData = `./cardapio_completo.json`; // Caminho do JSON
    const menuContainer = document.getElementById("menu");
  
    fetch(menuData)
      .then((response) => response.json())
      .then((data) => {
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
  });