# 🎨 COMO PERSONALIZAR O DASHBOARD BETHEL

## ✅ SISTEMA DE BRANDING INTEGRADO

O sistema de branding está **100% configurado e funcionando**! Agora você pode personalizar cores, logo e informações da empresa em um único arquivo.

---

## 📍 ONDE PERSONALIZAR

### **Arquivo Principal:**
```
src/lib/branding-config.ts
```

Este é o **único arquivo** que você precisa editar para customizar todo o visual do dashboard!

---

## 🎨 O QUE VOCÊ PODE PERSONALIZAR

### **1. Informações da Empresa**

```typescript
company: {
  name: 'Bethel Educação',          // ← Nome completo
  shortName: 'Bethel',              // ← Nome curto (para ícones)
  tagline: 'Dashboard de Análise de Funis',  // ← Subtítulo
  description: 'Sistema completo...',         // ← Descrição
}
```

**Aparece em:**
- Sidebar (nome + tagline)
- Tela de login
- Tela de cadastro
- PWA (quando instalar no celular)
- Meta tags (SEO)

---

### **2. Cores da Marca**

```typescript
colors: {
  primary: '#8b5cf6',     // ← COR PRIMÁRIA (roxo atual)
  secondary: '#ec4899',   // ← COR SECUNDÁRIA (rosa atual)
  accent: '#f43f5e',      // ← COR DE DESTAQUE

  // Cores funcionais (pode manter ou ajustar)
  success: '#10b981',     // Verde
  warning: '#f59e0b',     // Amarelo
  danger: '#ef4444',      // Vermelho
}
```

**Cores são aplicadas automaticamente em:**
- Gradientes do logo/texto
- Botões primários
- Ícones e destaques
- Gráficos e cards

**Como usar cores da Bethel:**
1. Abra o site da Bethel ou identidade visual
2. Use uma ferramenta de color picker (ex: https://imagecolorpicker.com/)
3. Copie o código hexadecimal (ex: `#FF5733`)
4. Cole no `branding-config.ts`

---

### **3. Logo da Empresa**

```typescript
logo: {
  // Caminho do logo (coloque o arquivo em public/)
  path: '/bethel-logo.svg',
  pathDark: '/bethel-logo-dark.svg',   // Versão escura (opcional)
  pathLight: '/bethel-logo-light.svg', // Versão clara (opcional)

  alt: 'Bethel Educação Logo',
  width: 180,
  height: 45,
}
```

**Como adicionar o logo da Bethel:**

1. **Salve o arquivo do logo** (SVG, PNG ou JPG) como `bethel-logo.svg`
2. **Coloque na pasta** `public/` do projeto
3. **Atualize o caminho** no `branding-config.ts` (já está configurado!)

**Formatos recomendados:**
- **SVG** - Melhor opção (escala sem perder qualidade)
- **PNG** - Com fundo transparente
- **Tamanho:** 200x50px a 400x100px (landscape)

**Se não tiver o logo agora:**
- O sistema mostra um ícone com as iniciais "BE" automaticamente
- Você pode adicionar o logo depois e ele será aplicado instantaneamente

---

### **4. PWA (App instalável no celular)**

```typescript
pwa: {
  name: 'Bethel Dashboard',
  shortName: 'Bethel',
  themeColor: '#8b5cf6',  // Cor da barra do navegador
}
```

**Aparece quando:**
- Usuário instala o app no celular
- Mostra na tela inicial do smartphone
- Define cor da barra superior

---

### **5. SEO e Compartilhamento**

```typescript
seo: {
  title: 'Bethel Educação - Dashboard de Análise de Funis',
  description: 'Sistema completo de análise de funis com R$ 20M em revenue',
  keywords: 'dashboard, funis de vendas, analytics, bethel educação',
  ogImage: '/og-image.png', // Imagem de compartilhamento
}
```

**Aparece em:**
- Google (resultados de busca)
- WhatsApp (preview ao compartilhar link)
- LinkedIn, Facebook (cartões de compartilhamento)

---

## 🚀 COMO APLICAR AS MUDANÇAS

### **Passo a Passo:**

1. **Abra o arquivo:**
   ```
   src/lib/branding-config.ts
   ```

2. **Edite as informações:**
   - Mude o nome da empresa
   - Altere as cores (hex codes)
   - Atualize descrições

3. **Se tiver logo, adicione na pasta `public/`:**
   ```
   public/
     └── bethel-logo.svg  ← Cole aqui
   ```

4. **Salve o arquivo** (Ctrl+S)

5. **Pronto!** As mudanças aparecem automaticamente:
   - Localmente: refresh da página (F5)
   - Vercel: próximo deploy automático

---

## 📦 EXEMPLO COMPLETO DE PERSONALIZAÇÃO

```typescript
export const BRANDING_CONFIG = {
  company: {
    name: 'Bethel Educação',
    shortName: 'Bethel',
    tagline: 'Excelência em Educação',
    description: 'Dashboard de análise de funis educacionais',
  },

  colors: {
    primary: '#FF6B00',    // Laranja Bethel
    secondary: '#0066CC',  // Azul Bethel
    accent: '#FFD700',     // Dourado
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },

  logo: {
    path: '/bethel-logo.svg',
    alt: 'Bethel Educação',
    width: 180,
    height: 45,
  },

  pwa: {
    name: 'Bethel Dashboard',
    shortName: 'Bethel',
    themeColor: '#FF6B00',  // Usar cor primária
  },

  seo: {
    title: 'Bethel Educação - Dashboard Educacional',
    description: 'Sistema de análise de funis para instituições de ensino',
    keywords: 'educação, dashboard, bethel, funis educacionais',
  }
};
```

---

## 🎯 ONDE AS MUDANÇAS APARECEM

Quando você editar o `branding-config.ts`, as mudanças aparecerão **automaticamente** em:

✅ **Sidebar**
- Logo/ícone da Bethel
- Nome da empresa
- Tagline

✅ **Login/Cadastro**
- Logo centralizado
- Cores dos botões
- Gradientes

✅ **Navegador**
- Título da aba
- Favicon (ícone da aba)
- Cor do tema

✅ **PWA (App no celular)**
- Nome do app
- Ícone na tela inicial
- Splash screen

✅ **Compartilhamento**
- Preview do WhatsApp
- Cartões do LinkedIn/Facebook
- Resultados do Google

---

## 🔧 DICAS ÚTEIS

### **Para escolher cores:**
1. Acesse: https://coolors.co/
2. Gere paletas com as cores da Bethel
3. Copie os hex codes (ex: `#FF5733`)

### **Para converter logo:**
- PNG para SVG: https://convertio.co/png-svg/
- Remover fundo: https://remove.bg/

### **Para criar ícones PWA:**
- Upload logo: https://www.pwabuilder.com/imageGenerator
- Baixe todos os tamanhos
- Cole em `public/icons/`

### **Para preview do site:**
- Criar imagem OG (1200x630px): https://www.canva.com/
- Salve como `/public/og-image.png`

---

## ❓ PERGUNTAS FREQUENTES

**Q: Preciso reiniciar o servidor após mudar cores?**
A: Sim, pare (Ctrl+C) e rode `npm run dev` novamente.

**Q: O logo não aparece?**
A: Verifique se o arquivo está em `public/` e o caminho está correto no config.

**Q: Como voltar as cores originais?**
A: Use as cores padrão:
- Primary: `#8b5cf6` (roxo)
- Secondary: `#ec4899` (rosa)

**Q: Posso usar mais de um logo?**
A: Sim! Use `pathDark` para tema escuro e `pathLight` para claro.

---

## 📞 PRÓXIMOS PASSOS

Depois de personalizar:

1. ✅ Teste localmente (`npm run dev`)
2. ✅ Faça commit das mudanças
3. ✅ Push para GitHub → Deploy automático na Vercel
4. ✅ Teste no celular (instalação PWA)
5. ✅ Compartilhe o link e veja o preview

---

**Qualquer dúvida, é só perguntar! 🚀**
