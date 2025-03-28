document.addEventListener("DOMContentLoaded", function () {
  const categoryDisplayNames = {
    baba: "Babá",
    bordados: "Bordados",
    consultor: "Consultor de Benefícios e Seguros",
    contador: "Contador(a)",
    corretor: "Corretor(a) de imóveis",
    costureira: "Costureira",
    diarista: "Diarista",
    enfermeiro: "Enfermeiro",
    entregador: "Entregador de aplicativo",
    impressoes: "Impressões",
    motorista: "Motorista de táxi e aplicativo",
    personalizacao: "Personalização de canecas e blusas",
    petsister: "Petsister (Cuidadora de pets)",
    professor: "Professor(a) particular",
    tecnicos: "Técnicos e manutenção",
    trabalhossociais: "Trabalhos sociais e de Saúde",
    viagens: "Viagens e Turismo",
  };

  async function fetchServices() {
    const loader = document.querySelector(".loader-container");
    const accordion = document.getElementById("servicesAccordion");

    if (!accordion) {
      console.error("Elemento 'servicesAccordion' não encontrado.");
      return;
    }

    loader.style.display = "flex";

    try {
      const response = await fetch("https://backend-rust-phi-51.vercel.app/api/services");
      if (response.ok) {
        const services = await response.json();

        // Agrupar serviços por categoria
        const categories = {};
        services.forEach((service) => {
          if (!categories[service.category]) {
            categories[service.category] = [];
          }
          categories[service.category].push(service);
        });

        // Renderizar categorias e serviços no formato de accordion
        accordion.innerHTML = "";
        Object.keys(categories).forEach((category, index) => {
          const categoryName = categoryDisplayNames[category] || category;
          const servicesList = categories[category]
            .map(
              (service) => `
              <div class="list-group-item d-flex justify-content-between align-items-center">
                <span>${service.name} - Torre ${service.tower}</span>
                <a href="https://api.whatsapp.com/send/?phone=${service.contact}" class="text-primary">WhatsApp</a>
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
                  ${categoryName}
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
      } else {
        alert("Erro ao buscar serviços.");
      }
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      alert("Erro ao buscar serviços. Tente novamente mais tarde.");
    } finally {
      loader.style.display = "none";
    }
  }

  fetchServices();
});