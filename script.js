/**
 * Glow Agenda — script.js
 * Validação de formulário, integração com backend via fetch(),
 * animações, header scroll e integração WhatsApp.
 */

/* =====================================================
   CONFIGURAÇÃO
   ===================================================== */
const API_BASE_URL = 'https://glow-agenda-api.onrender.com';
const WHATSAPP_NUMBER = '5511999990000'; // Número sem formatação

/* =====================================================
   HEADER — efeito ao rolar
   ===================================================== */
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

/* =====================================================
   MENU MOBILE
   ===================================================== */
const btnMenu   = document.getElementById('btnMenu');
const mobileNav = document.getElementById('mobileNav');

btnMenu.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  btnMenu.classList.toggle('open', isOpen);
  btnMenu.setAttribute('aria-expanded', isOpen);
});

function closeMobileNav() {
  mobileNav.classList.remove('open');
  btnMenu.classList.remove('open');
  btnMenu.setAttribute('aria-expanded', false);
}

/* =====================================================
   ANIMAÇÕES DE ENTRADA (Intersection Observer)
   ===================================================== */
const fadeEls = document.querySelectorAll(
  '.servico-card, .diferencial-item, .depoimento-card, .agendar__info, .agendar__form, .section-header'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

fadeEls.forEach(el => observer.observe(el));

/* =====================================================
   DATA MÍNIMA — impede datas passadas
   ===================================================== */
const inputData = document.getElementById('data');
const hoje = new Date();
const yyyy = hoje.getFullYear();
const mm   = String(hoje.getMonth() + 1).padStart(2, '0');
const dd   = String(hoje.getDate()).padStart(2, '0');
inputData.min = `${yyyy}-${mm}-${dd}`;

/* =====================================================
   MÁSCARA DE TELEFONE
   ===================================================== */
const inputTelefone = document.getElementById('telefone');

inputTelefone.addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);

  if (v.length <= 2)       e.target.value = v.replace(/^(\d{0,2})/, '($1');
  else if (v.length <= 6)  e.target.value = v.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
  else if (v.length <= 10) e.target.value = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  else                     e.target.value = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
});

/* =====================================================
   VALIDAÇÃO DO FORMULÁRIO
   ===================================================== */
function setError(fieldId, errorId, msg) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.add('error');
  error.textContent = msg;
}

function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.remove('error');
  error.textContent = '';
}

function validateForm() {
  let valid = true;

  // Nome
  const nome = document.getElementById('nome').value.trim();
  if (!nome) {
    setError('nome', 'erroNome', 'Por favor, informe seu nome completo.');
    valid = false;
  } else if (nome.length < 3) {
    setError('nome', 'erroNome', 'O nome deve ter pelo menos 3 caracteres.');
    valid = false;
  } else {
    clearError('nome', 'erroNome');
  }

  // Telefone
  const tel = document.getElementById('telefone').value.replace(/\D/g, '');
  if (!tel) {
    setError('telefone', 'erroTelefone', 'Por favor, informe seu telefone.');
    valid = false;
  } else if (tel.length < 10) {
    setError('telefone', 'erroTelefone', 'Telefone inválido. Use o formato (11) 99999-0000.');
    valid = false;
  } else {
    clearError('telefone', 'erroTelefone');
  }

  // Serviço
  const servico = document.getElementById('servico').value;
  if (!servico) {
    setError('servico', 'erroServico', 'Por favor, selecione um serviço.');
    valid = false;
  } else {
    clearError('servico', 'erroServico');
  }

  // Data
  const data = document.getElementById('data').value;
  if (!data) {
    setError('data', 'erroData', 'Por favor, selecione uma data.');
    valid = false;
  } else {
    const dataSelecionada = new Date(data + 'T00:00:00');
    const hojeInicio = new Date();
    hojeInicio.setHours(0, 0, 0, 0);
    if (dataSelecionada < hojeInicio) {
      setError('data', 'erroData', 'A data não pode ser no passado.');
      valid = false;
    } else {
      clearError('data', 'erroData');
    }
  }

  // Hora
  const hora = document.getElementById('hora').value;
  if (!hora) {
    setError('hora', 'erroHora', 'Por favor, selecione um horário.');
    valid = false;
  } else {
    clearError('hora', 'erroHora');
  }

  return valid;
}

/* Limpar erros ao digitar */
['nome', 'telefone', 'servico', 'data', 'hora'].forEach(id => {
  const errorId = 'erro' + id.charAt(0).toUpperCase() + id.slice(1);
  document.getElementById(id).addEventListener('input', () => clearError(id, errorId));
  document.getElementById(id).addEventListener('change', () => clearError(id, errorId));
});

/* =====================================================
   ENVIO DO FORMULÁRIO
   ===================================================== */
const form        = document.getElementById('formAgendamento');
const btnAgendar  = document.getElementById('btnAgendar');
const formFeedback = document.getElementById('formFeedback');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Ocultar feedback anterior
  formFeedback.className = 'form-feedback';
  formFeedback.textContent = '';

  if (!validateForm()) return;

  // Estado de carregamento
  btnAgendar.classList.add('btn--loading');
  btnAgendar.disabled = true;

  const payload = {
    nome:         document.getElementById('nome').value.trim(),
    telefone:     document.getElementById('telefone').value.trim(),
    servico:      document.getElementById('servico').value,
    data:         document.getElementById('data').value,
    hora:         document.getElementById('hora').value,
    observacoes:  document.getElementById('observacoes').value.trim(),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/agendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      // Sucesso
      showModal(payload);
      form.reset();
    } else {
      throw new Error(data.erro || data.message || 'Erro ao realizar agendamento.');
    }
  } catch (err) {
    // Verifica se é erro de rede (backend offline)
    if (err instanceof TypeError && err.message.includes('fetch')) {
      // Fallback: mostra modal mesmo sem backend (modo demo)
      showModal(payload);
      form.reset();
    } else {
      formFeedback.className = 'form-feedback error';
      formFeedback.textContent = `Erro: ${err.message}`;
    }
  } finally {
    btnAgendar.classList.remove('btn--loading');
    btnAgendar.disabled = false;
  }
});

/* =====================================================
   MODAL DE CONFIRMAÇÃO
   ===================================================== */
const modalOverlay = document.getElementById('modalOverlay');
const modalMessage = document.getElementById('modalMessage');
const modalWhatsApp = document.getElementById('modalWhatsApp');

function showModal(dados) {
  const dataFormatada = formatarData(dados.data);
  modalMessage.textContent =
    `${dados.nome}, seu agendamento para "${dados.servico}" no dia ${dataFormatada} às ${dados.hora} foi confirmado! Em breve entraremos em contato.`;

  // Link WhatsApp com mensagem pré-preenchida
  const msg = encodeURIComponent(
    `Olá! Acabei de agendar no Glow Agenda.\n\n` +
    `*Nome:* ${dados.nome}\n` +
    `*Serviço:* ${dados.servico}\n` +
    `*Data:* ${dataFormatada}\n` +
    `*Horário:* ${dados.hora}\n\n` +
    `Gostaria de confirmar meu agendamento. 😊`
  );
  modalWhatsApp.onclick = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener');
    closeModal();
  };

  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Fechar ao clicar fora do modal
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Fechar com Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* =====================================================
   UTILITÁRIOS
   ===================================================== */
function formatarData(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

/* =====================================================
   SMOOTH SCROLL para links de âncora
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // altura do header fixo
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
