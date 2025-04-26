document.addEventListener("DOMContentLoaded", function () {
    const menuData = [
      { nome: "Sobrancelha simples", preco: 35.00 },
      { nome: "SPA de sobrancelhas", preco: 30.00 },
      { nome: "Brow Lamination c/ design", preco: 80.00 },
      { nome: "Protocolo de crescimento de sobrancelhas (sessão)", preco: 85.00 },
      { nome: "Lash Lifting (Alongamento natural dos cílios)", preco: 80.00 },
      { nome: "Remoção de extensão", preco: 30.00 },
      { nome: "Buço", preco: 15.00 },
      { nome: "Hidratação Gloss Labial", preco: 80.00 },
      { nome: "SPA facial", preco: 40.00 },
      { nome: "Limpeza de pele", preco: 60.00 }
    ];
  
    const menuContainer = document.getElementById("menu");
    const modalServiceText = document.getElementById("modalServiceText");
    const confirmButton = document.getElementById("confirmButton");
    let selectedService = "";
  
    function displayMenu(data) {
      menuContainer.innerHTML = data.map(service => `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card-service p-3 text-center" data-service="${service.nome}">
            <div class="service-name mb-2">${service.nome}</div>
            <div class="service-price">R$ ${service.preco.toFixed(2)}</div>
          </div>
        </div>
      `).join("");
  
      document.querySelectorAll(".card-service").forEach(card => {
        card.addEventListener("click", function () {
          selectedService = this.getAttribute("data-service");
          modalServiceText.textContent = `Deseja agendar o serviço "${selectedService}" via WhatsApp?`;
          const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
          modal.show();
        });
      });
    }
  
    displayMenu(menuData);
  
    document.getElementById("search-bar").addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = menuData.filter(service => service.nome.toLowerCase().includes(searchTerm));
      displayMenu(filtered);
    });
  
    confirmButton.addEventListener("click", function () {
      const mensagem = encodeURIComponent(`Olá! Gostaria de agendar o serviço: ${selectedService}`);
      window.location.href = `https://wa.me/5511963526519?text=${mensagem}`;
    });
  });
  