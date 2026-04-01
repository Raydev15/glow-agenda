# Glow Agenda — Frontend

Site de agendamento de beleza com design feminino, elegante e moderno.

## Tecnologias

- HTML5 semântico
- CSS3 com variáveis customizadas
- JavaScript puro (ES2022+)
- Google Fonts: Poppins + Playfair Display

## Funcionalidades

- Header fixo com efeito ao rolar e menu mobile responsivo
- Seção hero com animação de blob e cards flutuantes
- Grade de 6 serviços com cards animados
- Seção de diferenciais
- Formulário de agendamento com:
  - Validação completa de todos os campos
  - Máscara de telefone automática
  - Bloqueio de datas passadas
  - Envio via `fetch()` para o backend
  - Fallback modo demo (funciona sem backend)
  - Modal de confirmação com link WhatsApp pré-preenchido
- Depoimentos de clientes
- Footer completo com redes sociais
- Animações de entrada via Intersection Observer

## Configuração

Edite as seguintes variáveis no início de `script.js`:

```js
const API_BASE_URL    = 'https://glow-agenda-api.onrender.com'; // URL do seu backend
const WHATSAPP_NUMBER = '5511999990000'; // Número sem formatação
```

## Deploy no GitHub Pages

1. Crie um repositório chamado `glow-agenda`
2. Faça upload dos arquivos `index.html`, `style.css` e `script.js`
3. Vá em **Settings → Pages → Source: main branch → / (root)**
4. O site estará em `https://seuusuario.github.io/glow-agenda/`

## Estrutura de Arquivos

```
frontend/
├── index.html   — Estrutura HTML completa
├── style.css    — Estilos com variáveis CSS e responsividade
├── script.js    — Lógica, validação e integração com API
└── README.md    — Este arquivo
```
