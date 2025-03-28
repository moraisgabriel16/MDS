document.addEventListener("DOMContentLoaded", function () {
  // Funções para mostrar/ocultar Loader
  function showLoader() {
    document.querySelector(".loader-container").style.display = "flex";
  }
  function hideLoader() {
    document.querySelector(".loader-container").style.display = "none";
  }

  // Mapeamento de categorias para exibição amigável
  const categoryDisplayNames = {
    baba: "Babá",
    bordados: "Bordados",
    consultor: "Consultor",
    contador: "Contador",
    corretor: "Corretor",
    costureira: "Costureira",
    diarista: "Diarista",
    enfermeiro: "Enfermeiro",
    entregador: "Entregador",
    impressoes: "Impressões",
    motorista: "Motorista",
    personalizacao: "Personalização",
    petsister: "Pet Sitter",
    professor: "Professor",
    tecnicos: "Técnicos",
    trabalhossociais: "Trabalhos Sociais",
    viagens: "Viagens",
  };

  // Função para formatar categorias automaticamente
  function formatCategory(category) {
    // Se a categoria já estiver no mapeamento, retorna o nome amigável
    if (categoryDisplayNames[category]) {
      return categoryDisplayNames[category];
    }

    // Caso contrário, formata dinamicamente (adiciona espaços e capitaliza)
    return category
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Adiciona espaço entre palavras camelCase
      .replace(/_/g, " ") // Substitui underscores por espaços
      .toLowerCase() // Converte para minúsculas
      .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase()); // Capitaliza cada palavra
  }

  // Fetch services from the backend
  async function fetchServices() {
    showLoader();
    try {
      const response = await fetch("https://backend-rust-phi-51.vercel.app/api/services");
      const services = await response.json();
      populateAccordion(services);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      hideLoader();
    }
  }

  // Populate accordion with services
  function populateAccordion(services) {
    const accordion = document.getElementById("servicesAccordion");
    accordion.innerHTML = ""; // Clear existing content

    const groupedServices = services.reduce((groups, service) => {
      if (!groups[service.category]) {
        groups[service.category] = [];
      }
      groups[service.category].push(service);
      return groups;
    }, {});

    Object.keys(groupedServices).forEach((category, index) => {
      const displayName = formatCategory(category); // Formata dinamicamente
      const servicesList = groupedServices[category]
        .map(
          (service) => `
          <div class="list-group-item d-flex justify-content-between align-items-center">
            <span>${service.name} - ${service.tower}</span>
            <div>
              <a href="https://api.whatsapp.com/send/?phone=${service.contact}" class="text-primary me-3">WhatsApp</a>
              
            </div>
          </div>
        `
        )
        .join("");

      const accordionItem = `
        <div class="accordion-item shadow-sm">
          <h2 class="accordion-header" id="heading${index}">
            <button
              class="accordion-button collapsed fw-bold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapse${index}"
              aria-expanded="false"
              aria-controls="collapse${index}"
            >
              ${displayName}
            </button>
          </h2>
          <div
            id="collapse${index}"
            class="accordion-collapse collapse"
            aria-labelledby="heading${index}"
            data-bs-parent="#servicesAccordion"
          >
            <div class="accordion-body">
              <div class="list-group">
                ${servicesList}
              </div>
            </div>
          </div>
        </div>
      `;
      accordion.innerHTML += accordionItem;
    });
  }

  // Function to delete a service
  async function deleteService(serviceId) {
    if (!confirm("Tem certeza que deseja deletar este serviço?")) return;

    showLoader();
    try {
      const response = await fetch(`https://backend-rust-phi-51.vercel.app/api/services/${serviceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Serviço deletado com sucesso!");
        fetchServices(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(`Erro ao deletar serviço: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao deletar serviço:", error);
      alert("Erro ao deletar serviço. Tente novamente mais tarde.");
    } finally {
      hideLoader();
    }
  }

  // Initialize
  fetchServices();
});