/**
 * 🎨 CONFIGURAÇÃO DE BRANDING - BETHEL EDUCAÇÃO
 *
 * Personalize aqui todas as cores, logo e informações da marca.
 * Após alterar, faça: git add . && git commit -m "Update branding" && git push
 */

export const BRANDING_CONFIG = {
  // 🏢 INFORMAÇÕES DA EMPRESA
  company: {
    name: 'Bethel Educação',
    shortName: 'Bethel',
    tagline: 'Dashboard de Análise de Funis',
    description: 'Sistema completo de análise e acompanhamento de funis de vendas com integração Google Sheets',
  },

  // 🎨 CORES DA MARCA
  colors: {
    // Cores principais (MUDAR PARA CORES DA BETHEL)
    primary: '#8b5cf6',     // Roxo - Cor primária principal
    secondary: '#ec4899',   // Rosa - Cor secundária
    accent: '#f43f5e',      // Rose - Cor de destaque

    // Cores funcionais (pode manter ou ajustar)
    success: '#10b981',     // Verde - Sucesso
    warning: '#f59e0b',     // Amarelo - Avisos
    danger: '#ef4444',      // Vermelho - Erros
    info: '#3b82f6',        // Azul - Informações

    // Cores de fundo (tema escuro)
    background: {
      primary: '#0f172a',   // Fundo principal
      secondary: '#1e293b', // Fundo secundário
      tertiary: '#334155',  // Fundo terciário
    },

    // Cores de texto
    text: {
      primary: '#e2e8f0',   // Texto principal
      secondary: '#94a3b8', // Texto secundário
      muted: '#64748b',     // Texto esmaecido
    },
  },

  // 🖼️ LOGO E IMAGENS
  logo: {
    // Caminho do logo (coloque o arquivo em public/)
    path: '/bethel-logo.svg',
    pathDark: '/bethel-logo-dark.svg', // Versão para modo escuro (opcional)
    pathLight: '/bethel-logo-light.svg', // Versão para modo claro (opcional)

    // Texto alternativo
    alt: 'Bethel Educação Logo',

    // Dimensões
    width: 180,
    height: 45,

    // Favicon
    favicon: '/favicon.ico',
  },

  // 📱 PWA (Progressive Web App)
  pwa: {
    name: 'Bethel Dashboard',
    shortName: 'Bethel',
    description: 'Dashboard de Análise de Funis - Bethel Educação',
    themeColor: '#8b5cf6', // Cor do tema (usar primary)
    backgroundColor: '#0f172a', // Cor de fundo
    display: 'standalone',
    startUrl: '/',
    icons: {
      appleTouchIcon: '/icons/icon-192x192.png',
    }
  },

  // 🔗 LINKS E REDES SOCIAIS
  social: {
    website: 'https://bethel.com.br',
    instagram: '@betheleducacao',
    linkedin: 'company/bethel-educacao',
    email: 'contato@bethel.com.br',
    phone: '+55 11 99999-9999',
  },

  // 📊 META TAGS (SEO)
  seo: {
    title: 'Bethel Educação - Dashboard de Análise de Funis',
    description: 'Sistema completo de análise e acompanhamento de funis de vendas com R$ 20M em revenue',
    keywords: 'dashboard, funis de vendas, analytics, bethel educação, ROI, ROAS',
    author: 'Bethel Educação',
    ogImage: '/og-image.png', // Imagem para compartilhar em redes sociais (1200x630px)
  },

  // ⚙️ CONFIGURAÇÕES ADICIONAIS
  settings: {
    // Mostrar logo ou nome no header?
    showLogo: true,
    showCompanyName: true,

    // Animações
    enableAnimations: true,

    // Modo padrão
    defaultTheme: 'dark' as 'dark' | 'light' | 'auto',
  }
};

// 🎨 APLICAR CORES NO CSS
export const applyBrandingColors = () => {
  const root = document.documentElement;

  // Aplicar cores customizadas
  root.style.setProperty('--color-primary', BRANDING_CONFIG.colors.primary);
  root.style.setProperty('--color-secondary', BRANDING_CONFIG.colors.secondary);
  root.style.setProperty('--color-accent', BRANDING_CONFIG.colors.accent);
  root.style.setProperty('--color-success', BRANDING_CONFIG.colors.success);
  root.style.setProperty('--color-warning', BRANDING_CONFIG.colors.warning);
  root.style.setProperty('--color-danger', BRANDING_CONFIG.colors.danger);
};

// 📱 Atualizar título da página
export const updatePageTitle = (pageTitle?: string) => {
  const base = BRANDING_CONFIG.company.name;
  document.title = pageTitle
    ? `${pageTitle} - ${base}`
    : `${base} - ${BRANDING_CONFIG.company.tagline}`;
};

// Export default para facilitar importação
export default BRANDING_CONFIG;
