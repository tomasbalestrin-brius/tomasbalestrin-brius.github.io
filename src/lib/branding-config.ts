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
    // Cores principais Bethel Educação
    primary: '#ff6d17',     // Laranja vibrante Bethel - Cor primária
    secondary: '#020051',   // Azul marinho Bethel - Cor secundária
    accent: '#ff8c42',      // Laranja claro - Cor de destaque

    // Cores funcionais
    success: '#10b981',     // Verde - Sucesso
    warning: '#f59e0b',     // Amarelo - Avisos
    danger: '#ef4444',      // Vermelho - Erros
    info: '#020051',        // Azul Bethel - Informações

    // Cores de fundo (tema escuro)
    background: {
      primary: '#0f172a',   // Fundo principal
      secondary: '#1d1d1d', // Fundo secundário (cor Bethel)
      tertiary: '#334155',  // Fundo terciário
    },

    // Cores de texto
    text: {
      primary: '#efefef',   // Texto principal (cor Bethel)
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
    themeColor: '#ff6d17', // Laranja Bethel
    backgroundColor: '#1d1d1d', // Preto Bethel
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
