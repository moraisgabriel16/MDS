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

  // Função para validar e formatar números de telefone no formato da API do WhatsApp
  function formatPhoneNumber(phone) {
    // Remove caracteres não numéricos
    let cleaned = phone.replace(/\D/g, "");
    // Adiciona o prefixo +55 se não estiver presente
    if (!cleaned.startsWith("55")) {
      cleaned = `55${cleaned}`;
    }
    // Verifica se o número tem o formato correto (55 + DDD + número)
    if (cleaned.length === 13 || cleaned.length === 12) {
      return cleaned; // Retorna o número formatado
    }
    console.warn(`Número de telefone inválido: ${phone}`);
    return null;
  }

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

        // Ordenar categorias em ordem alfabética
        const sortedCategories = Object.keys(categories).sort();

        // Renderizar categorias e serviços no formato de accordion
        accordion.innerHTML = "";
        sortedCategories.forEach((category, index) => {
          const categoryName = categoryDisplayNames[category] || category;

          // Ordenar serviços dentro de cada categoria em ordem alfabética
          const sortedServices = categories[category].sort((a, b) =>
            a.name.localeCompare(b.name)
          );

          const servicesList = sortedServices
            .map((service) => {
              const formattedPhone = formatPhoneNumber(service.contact);
              if (!formattedPhone) {
                return `
                  <div class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${service.name} - Torre ${service.tower}</span>
                    <span class="text-danger">Contato inválido</span>
                  </div>
                `;
              }
              return `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                  <span>${service.name} - Torre ${service.tower}</span>
                  <a href="https://api.whatsapp.com/send?phone=${formattedPhone}" class="text-primary">WhatsApp</a>
                </div>
              `;
            })
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

  // Função para editar um serviço
  async function editService(serviceId, updatedData) {
    try {
      const response = await fetch(`https://backend-rust-phi-51.vercel.app/api/services/${serviceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Erro ao editar o serviço");
      }

      const updatedService = await response.json();
      console.log("Serviço atualizado com sucesso:", updatedService);
      // Atualize a interface ou recarregue os serviços
      fetchServices();
    } catch (error) {
      console.error("Erro ao editar serviço:", error);
      alert("Erro ao editar serviço. Tente novamente.");
    }
  }

  // Exemplo de uso da função editService
  // editService("serviceIdAqui", { name: "Novo Nome", category: "novaCategoria" });

  fetchServices();
});