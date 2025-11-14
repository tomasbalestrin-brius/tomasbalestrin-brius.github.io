# 📊 Dashboard Analytics - Funis de Vendas

> **Sistema de análise de funis de vendas com integração Google Sheets, desenvolvido para Bethel Educação (R$ 20M em revenue), com potencial para se tornar um produto SaaS White Label.**

[![Made with Lovable](https://img.shields.io/badge/Made%20with-Lovable-ff69b4)](https://lovable.dev)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## 🎯 Visão Geral

Dashboard moderno e responsivo que conecta diretamente com Google Sheets para análise em tempo real de múltiplos funis de vendas. Permite acompanhar métricas como ROI, ROAS, Taxa de Conversão, Lucro, e muito mais.

### ✨ Principais Features

- 📈 **Dashboard Dinâmico**: Visualização de métricas por produto/funil selecionado
- 📊 **Múltiplos Funis**: Suporte para produtos ilimitados na mesma planilha
- 🔄 **Sync com Google Sheets**: Leitura direta da planilha via API (sem Edge Functions)
- 📱 **PWA**: Instalável como app no mobile e desktop
- 🎨 **Dark Mode Premium**: Design moderno com glassmorphism e gradientes
- 📅 **Multi-mês**: Alternar entre Outubro, Novembro, Dezembro e Janeiro
- 🔐 **Autenticação Completa**: Sistema de login, registro e recuperação de senha (em implementação)
- 👥 **Multi-tenancy Ready**: Preparado para múltiplas organizações (roadmap)

---

## 🚀 Demo

[Ver Demo ao Vivo](https://seu-dominio.lovable.app) *(substituir com link real)*

![Screenshot Dashboard](./docs/screenshot.png) *(adicionar screenshot)*

---

## 📋 Índice

- [Features Implementadas](#-features-implementadas)
- [Stack Tecnológica](#️-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Uso](#-uso)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## ✅ Features Implementadas

### 1. Core do Dashboard

- ✅ Integração com Google Sheets API
- ✅ Dashboard dinâmico baseado em produto selecionado
- ✅ Sistema de parsing automático de dados
- ✅ Cache e sincronização de dados
- ✅ Navegação hierárquica (Geral → Cleiton → Julia)

### 2. Páginas e Visualizações

| Página | Descrição | Status |
|--------|-----------|--------|
| **Dashboard** | Visão geral do produto selecionado | ✅ |
| **Resumo Geral** | Cards de todos os produtos | ✅ |
| **Lucro e ROAS** | Análise de rentabilidade | ✅ |
| **Custo por Lead** | CAC detalhado | ✅ |
| **Insights Automáticos** | Alertas e recomendações | ✅ |
| **Comparar Funis** | Comparação lado a lado | ✅ |
| **Comparar Meses** | Evolução temporal | 🚧 |
| **Exportar** | PDF, Excel, CSV, Link | ✅ |

### 3. Componentes Principais

- **Cards de Métricas**: Investido, Faturamento, Lucro, ROI, Vendas, Taxa de Conversão, Taxa de Agendamento
- **Funil de Conversão**: Visualização em cascata
- **Tabela por Semana**: Breakdown detalhado (4 semanas + tendência)
- **Ranking de Produtos**: Melhores performers
- **Totais em Destaque**: Faturamento Total, Tendência, Lucro Total

### 4. UI/UX

- 🎨 Dark mode com gradientes purple/pink/rose
- ✨ Glassmorphism (backdrop-blur)
- 📱 Mobile-first responsive
- 🎭 Animações suaves
- 🔝 Header sticky com controles
- 📱 Sidebar retrátil (overlay no mobile, minimizável no desktop)

### 5. PWA (Progressive Web App)

- ✅ Instalável (Add to Home Screen)
- ✅ Service Worker configurado
- ✅ Manifest.json
- ✅ Ícones em todos os tamanhos
- ✅ Offline support básico
- ✅ Meta tags para iOS/Android

---

## 🛠️ Stack Tecnológica

### Frontend
- **Framework**: [React](https://react.dev) 18+ com TypeScript
- **Build Tool**: [Vite](https://vitejs.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) 3+
- **Routing**: [React Router](https://reactrouter.com) v6
- **Charts**: [Recharts](https://recharts.org) *(opcional)*

### Backend / Infra
- **Platform**: [Lovable.dev](https://lovable.dev) (desenvolvimento)
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **APIs**: Google Sheets API v4

### Hospedagem
- **Dev**: Lovable
- **Prod** *(futuro)*: Vercel + Supabase

---

## 📁 Estrutura do Projeto

```
tomasbalestrin-brius.github.io/
├── src/
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── auth/         # Componentes de autenticação
│   │   ├── profile/      # Componentes de perfil
│   │   ├── dashboard/    # Componentes do dashboard
│   │   └── ui/           # Componentes UI genéricos
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.tsx   # Hook de autenticação
│   │   ├── useProfile.ts # Hook de perfil
│   │   └── useOrganization.ts # Hook de organização
│   ├── pages/            # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Profile.tsx
│   │   └── ...
│   ├── lib/              # Utilities e helpers
│   │   ├── sheets-api.ts # Integração Google Sheets
│   │   └── utils.ts
│   ├── integrations/     # Integrações externas
│   │   └── supabase/
│   │       └── client.ts
│   └── App.tsx           # Componente raiz
├── public/
│   ├── manifest.json     # PWA manifest
│   ├── service-worker.js # Service worker
│   └── icons/            # Ícones PWA
├── docs/                 # Documentação
│   ├── LOVABLE_PROMPTS.md          # Prompts de autenticação
│   ├── LOVABLE_AUTH_UX_IMPROVEMENTS.md # Melhorias UX
│   ├── LOVABLE_USER_PROFILE.md     # Sistema de perfil
│   └── LOVABLE_MULTI_TENANCY.md    # Guia multi-tenancy
├── supabase/
│   └── functions/        # Edge Functions
└── README.md
```

---

## 💻 Instalação

### Pré-requisitos

- Node.js 18+ e npm/yarn
- Conta no [Lovable.dev](https://lovable.dev)
- Conta no [Supabase](https://supabase.com)
- Google Cloud Project com Sheets API habilitada

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/tomasbalestrin-brius/tomasbalestrin-brius.github.io.git
cd tomasbalestrin-brius.github.io
```

2. **Instale dependências**

```bash
npm install
# ou
yarn install
```

3. **Configure variáveis de ambiente**

Crie `.env` na raiz:

```env
VITE_GOOGLE_SHEETS_API_KEY=sua_api_key_aqui
VITE_SUPABASE_URL=sua_supabase_url
VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key
```

4. **Execute localmente**

```bash
npm run dev
# ou
yarn dev
```

Acesse: `http://localhost:5173`

---

## ⚙️ Configuração

### 1. Google Sheets API

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Habilite **Google Sheets API**
4. Crie credenciais (API Key)
5. Restrinja a key apenas para Sheets API
6. Copie a key para `.env`

### 2. Planilha do Google Sheets

**Estrutura da Planilha**:

- **ID**: `1XsdWQNR7FUo4TrrhsMjSGESS3PtS9G7X8FoHHStxLtU`
- **Abas**: `Dados de Out/25`, `Dados de Nov/25`, `Dados de Dez/25`, `Dados de Jan/26`
- **Permissão**: "Qualquer pessoa com o link pode visualizar"

**Estrutura das Colunas**:
- **Coluna A**: Nome do Funil
- **Coluna B**: Período (Semana 1, Semana 2, Semana 3, Semana 4, Tendência)
- **Colunas C-R**: 18 métricas de dados

**Produtos** (cada um ocupa 5 linhas):
1. Geral (linhas 2-6)
2. Total Cleiton (linhas 8-12)
3. Total Julia (linhas 14-18)
4. 50 Scripts, Couply, Social Selling CL, Teste, MPM, IA Julia, Autentiq, Mentoria Ju, Social Selling Ju

### 3. Supabase

1. Crie projeto no [Supabase](https://supabase.com/dashboard)
2. Copie `URL` e `anon key` para `.env`
3. Habilite **Email Auth** em Authentication > Providers
4. Configure **URL de redirect**: `https://seu-dominio.lovable.app`
5. Execute scripts SQL (ver `docs/LOVABLE_MULTI_TENANCY.md`)

---

## 📖 Uso

### Navegação Básica

1. **Selecione o Mês** no header (Outubro, Novembro, Dezembro, Janeiro)
2. **Escolha o Funil**:
   - **GERAL**: visão consolidada de tudo
   - **CLEITON**: dropdown com Total Cleiton + funis individuais
   - **JULIA**: dropdown com Total Julia + funis individuais
3. **Visualize Métricas** nos cards, gráficos e tabelas
4. **Compare Funis** na página "Comparar Funis"
5. **Exporte Dados** em PDF, Excel ou CSV

### Autenticação (em implementação)

Siga os prompts em `docs/LOVABLE_PROMPTS.md` para implementar:

1. Login/Registro
2. Recuperação de senha
3. Perfil de usuário
4. Logout

### Multi-tenancy (roadmap)

Ver guia completo em `docs/LOVABLE_MULTI_TENANCY.md`.

---

## 🗺️ Roadmap

### ✅ FASE 0: MVP (CONCLUÍDO)
- ✅ Dashboard funcional
- ✅ Integração Google Sheets
- ✅ PWA
- ✅ Múltiplos funis
- ✅ Navegação hierárquica

### 🚧 FASE 1: Autenticação (EM ANDAMENTO)
- 🚧 Login/Registro com Supabase
- 🚧 Recuperação de senha
- 🚧 Perfil de usuário
- 🚧 Proteção de rotas

**Timeline**: 1-2 semanas
**Guias**: `LOVABLE_PROMPTS.md`, `LOVABLE_AUTH_UX_IMPROVEMENTS.md`, `LOVABLE_USER_PROFILE.md`

### 📋 FASE 2: Multi-Tenancy (PRÓXIMO)
- [ ] Sistema de organizações
- [ ] Isolamento de dados
- [ ] Roles e permissões (owner, admin, member, viewer)
- [ ] Convites de equipe
- [ ] White label básico (logo, cores)

**Timeline**: 2-3 meses
**Guia**: `LOVABLE_MULTI_TENANCY.md`

### 📋 FASE 3: Customização Self-Service
- [ ] Conexão self-service com planilhas
- [ ] Mapeamento customizável de colunas
- [ ] 5 indicadores customizáveis
- [ ] Dashboard builder (arrastar/soltar)
- [ ] Múltiplas planilhas por conta

**Timeline**: 2-3 meses

### 📋 FASE 4: Monetização
- [ ] Integração Stripe
- [ ] Planos de assinatura (Free, Starter, Pro, Enterprise)
- [ ] Upgrade/downgrade automático
- [ ] Billing automático
- [ ] Histórico de faturas

**Timeline**: 1-2 meses
**Receita Estimada**: R$ 15-63K/mês (12-24 meses)

### 📋 FASE 5: Enterprise
- [ ] SSO (Single Sign-On)
- [ ] Domínios customizados
- [ ] App mobile white label
- [ ] API pública
- [ ] Suporte 24/7

**Timeline**: 2-3 meses

---

## 🎨 Customização

### Cores

Edite `src/index.css` ou Tailwind config:

```css
:root {
  --accent-primary: #8b5cf6;    /* Purple */
  --accent-secondary: #ec4899;  /* Pink */
  --success: #10b981;           /* Green */
  --danger: #ef4444;            /* Red */
}
```

### Logo

Substitua arquivos em `public/icons/` e atualize `manifest.json`.

### Planilha

Modifique `src/lib/sheets-api.ts`:

```typescript
const SPREADSHEET_ID = 'SEU_SPREADSHEET_ID';
const SHEET_NAMES = {
  'Outubro': 'Nome da Aba',
  // ...
};
```

---

## 🧪 Testes

```bash
# Testes unitários (se configurado)
npm run test

# Testes E2E (se configurado)
npm run test:e2e

# Build de produção
npm run build

# Preview do build
npm run preview
```

---

## 📊 Métricas de Dados

O dashboard calcula automaticamente:

| Métrica | Descrição |
|---------|-----------|
| **Investido** | Total investido em tráfego |
| **Faturamento** | Receita bruta do funil |
| **Lucro** | Faturamento - Investido |
| **ROI** | (Lucro / Investido) × 100% |
| **ROAS** | Faturamento / Investido |
| **Vendas** | Número de vendas realizadas |
| **Taxa de Conversão** | (Vendas / Calls Realizadas) × 100% |
| **Taxa de Agendamento** | (Agendados / Qualificados) × 100% |
| **Taxa de Comparecimento** | (Calls / Agendados) × 100% |
| **CAC** | Investido / Vendas |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature incrível'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📝 Documentação Adicional

- **[Autenticação](docs/LOVABLE_PROMPTS.md)**: Guia completo de implementação de auth
- **[Melhorias UX](docs/LOVABLE_AUTH_UX_IMPROVEMENTS.md)**: Loading states, validações, animações
- **[Perfil de Usuário](docs/LOVABLE_USER_PROFILE.md)**: Sistema completo de perfil
- **[Multi-tenancy](docs/LOVABLE_MULTI_TENANCY.md)**: Transformar em SaaS multi-tenant

---

## 📄 Licença

Este projeto está sob a licença MIT. Ver `LICENSE` para mais informações.

---

## 👥 Autores

- **Tomás Balestrin** - [GitHub](https://github.com/tomasbalestrin-brius)
- **Bethel Educação** - Cliente

---

## 🙏 Agradecimentos

- [Lovable.dev](https://lovable.dev) - Plataforma de desenvolvimento
- [Supabase](https://supabase.com) - Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Lucide Icons](https://lucide.dev) - Ícones

---

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/tomasbalestrin-brius/tomasbalestrin-brius.github.io/issues)
- **Discussões**: [GitHub Discussions](https://github.com/tomasbalestrin-brius/tomasbalestrin-brius.github.io/discussions)

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=tomasbalestrin-brius/tomasbalestrin-brius.github.io&type=Date)](https://star-history.com/#tomasbalestrin-brius/tomasbalestrin-brius.github.io&Date)

---

**Feito com ❤️ para Bethel Educação**

*Transformando dados em insights acionáveis.*
