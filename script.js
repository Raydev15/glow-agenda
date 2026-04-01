/**
 * Glow Agenda ✨ — script.js
 * Lógica avançada para multi-páginas, PWA e simulação de agendamento (LocalStorage).
 * Projeto Acadêmico ADS - Uninove.
 */

/* =====================================================
   NAVEGAÇÃO MULTI-PÁGINAS
   ===================================================== */
function showPage(pageId) {
  // Esconder todas as páginas
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Mostrar a página selecionada
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Atualizar links da nav
  document.querySelectorAll('.header__nav a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Se for a página de agendamentos, carregar a lista
  if (pageId === 'meus-agendamentos') {
    carregarAgendamentos();
  }

  // Re-inicializar ícones Lucide para novos elementos
  if (window.lucide) lucide.createIcons();
}

/* =====================================================
   SIMULAÇÃO DE AGENDAMENTO (LocalStorage)
   ===================================================== */
const form = document.getElementById('formAgendamento');
const modalOverlay = document.getElementById('modalOverlay');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const servico = document.getElementById('servico').value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;

    if (!nome || !telefone || !servico || !data || !hora) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Criar objeto de agendamento
    const novoAgendamento = {
      id: Date.now(),
      nome,
      telefone,
      servico,
      data,
      hora,
      status: 'Confirmado'
    };

    // Salvar no LocalStorage
    const agendamentos = JSON.parse(localStorage.getItem('glow-agendamentos') || '[]');
    agendamentos.push(novoAgendamento);
    localStorage.setItem('glow-agendamentos', JSON.stringify(agendamentos));

    // Mostrar modal de sucesso
    modalOverlay.classList.add('active');
    form.reset();
  });
}

function closeModal() {
  modalOverlay.classList.remove('active');
  showPage('meus-agendamentos');
}

function carregarAgendamentos() {
  const lista = document.getElementById('listaAgendamentos');
  const agendamentos = JSON.parse(localStorage.getItem('glow-agendamentos') || '[]');

  if (agendamentos.length === 0) {
    lista.innerHTML = '<p class="empty-msg">Nenhum agendamento encontrado.</p>';
    return;
  }

  lista.innerHTML = agendamentos.map(ag => `
    <div class="agendamento-card">
      <div class="ag-info">
        <strong>${ag.servico}</strong>
        <p><i data-lucide="calendar"></i> ${ag.data} às ${ag.hora}</p>
        <p><i data-lucide="user"></i> ${ag.nome}</p>
      </div>
      <div class="ag-status">${ag.status}</div>
      <button class="btn-cancel" onclick="cancelarAgendamento(${ag.id})">Cancelar</button>
    </div>
  `).join('');
  
  if (window.lucide) lucide.createIcons();
}

function cancelarAgendamento(id) {
  if (confirm('Deseja realmente cancelar este agendamento?')) {
    let agendamentos = JSON.parse(localStorage.getItem('glow-agendamentos') || '[]');
    agendamentos = agendamentos.filter(ag => ag.id !== id);
    localStorage.setItem('glow-agendamentos', JSON.stringify(agendamentos));
    carregarAgendamentos();
  }
}

/* =====================================================
   MENU MOBILE
   ===================================================== */
const btnMenu = document.getElementById('btnMenu');
const mobileNav = document.getElementById('mobileNav');

if (btnMenu) {
  btnMenu.addEventListener('click', () => {
    btnMenu.classList.toggle('active');
    mobileNav.classList.toggle('active');
  });
}

function closeMobileNav() {
  btnMenu.classList.remove('active');
  mobileNav.classList.remove('active');
}

/* =====================================================
   HEADER — efeito ao rolar
   ===================================================== */
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  header.classList.toggle('scrolled', window.scrollY > 20);
});
