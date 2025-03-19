document.addEventListener("DOMContentLoaded", function() {
    // Funções para mostrar/ocultar Loader
    function showLoader() {
      document.querySelector(".loader-container").style.display = "flex";
    }
    function hideLoader() {
      document.querySelector(".loader-container").style.display = "none";
    }
  
    // Filtrar serviços
    const searchInput = document.getElementById("search");
    if (searchInput) {
      searchInput.addEventListener("keyup", filterServices);
    }
  
    function filterServices() {
      showLoader();
  
      setTimeout(() => {
        const inputValue = searchInput.value.toLowerCase();
        const items = document.querySelectorAll(".list-group-item");
        const accordionItems = document.querySelectorAll(".accordion-item");
  
        items.forEach((item) => {
          const text = item.innerText.toLowerCase();
          const category = item.dataset.category.toLowerCase();
  
          if (text.includes(inputValue) || category.includes(inputValue)) {
            item.style.display = "flex";
  
            // Abre o accordion do item encontrado
            const accordionCollapse = item
              .closest(".accordion-item")
              .querySelector(".accordion-collapse");
            const collapseInstance = bootstrap.Collapse.getOrCreateInstance(accordionCollapse);
            collapseInstance.show();
  
          } else {
            item.style.display = "none";
          }
        });
  
        // Esconde o accordion que não tiver nenhum item visível
        accordionItems.forEach((accordionItem) => {
          const visibleItems = accordionItem.querySelectorAll(".list-group-item[style*='display: flex']");
          if (visibleItems.length === 0) {
            accordionItem.style.display = "none";
            const collapse = accordionItem.querySelector(".accordion-collapse");
            bootstrap.Collapse.getOrCreateInstance(collapse).hide();
          } else {
            accordionItem.style.display = "block";
          }
        });
  
        hideLoader();
      }, 200);
    }
  
    // Fecha todos os accordions inicialmente (opcional)
    document.querySelectorAll(".accordion-collapse").forEach((collapse) => {
      new bootstrap.Collapse(collapse, { toggle: false });
    });
  });