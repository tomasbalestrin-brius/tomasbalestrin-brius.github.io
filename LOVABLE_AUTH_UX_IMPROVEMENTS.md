# 🎨 MELHORIAS DE UX - AUTENTICAÇÃO

## Prompts adicionais para melhorar a experiência do usuário no sistema de autenticação

---

## ✅ PROMPT 9: Loading States Avançados

```
Melhorar os loading states em todas as páginas de autenticação.

CRIAR: src/components/auth/LoadingButton.tsx

Um botão reutilizável que mostra loading state:

Props:
- loading: boolean
- children: ReactNode
- onClick?: () => void
- type?: 'button' | 'submit'
- variant?: 'primary' | 'secondary' | 'outline'
- disabled?: boolean
- className?: string

Comportamento:
- Quando loading=true:
  * Mostrar spinner animado no lugar do texto
  * Desabilitar o botão
  * Cursor: not-allowed
  * Opacidade reduzida
- Quando loading=false:
  * Renderizar children normalmente
  * Botão clicável

Design:
- Spinner: border-2 border-white/30 border-t-white animação spin
- Tamanho do spinner: 16px (ajustar ao texto)
- Transição suave entre estados
- Suportar variantes de cor

Usar este componente em:
- Login.tsx (botão "Entrar")
- Register.tsx (botão "Cadastrar")
- ForgotPassword.tsx (botão "Enviar")

TypeScript completo.
```

---

## ✅ PROMPT 10: Skeleton Loader para Dashboard

```
Criar skeleton loader para mostrar enquanto carrega dados do dashboard.

CRIAR: src/components/SkeletonLoader.tsx

Componentes:
1. CardSkeleton - para cards de métricas
2. TableSkeleton - para tabelas
3. ChartSkeleton - para gráficos

CardSkeleton:
- Div com animação pulse
- Altura: 120px
- Rounded corners
- Gradiente sutil
- 3 linhas de conteúdo simulado (diferentes larguras)

TableSkeleton:
- Header com 6 colunas
- 5 linhas de dados
- Animação pulse
- Linhas alternadas

ChartSkeleton:
- Container do tamanho do gráfico
- Barras/linhas simuladas
- Animação pulse

Design:
- bg-slate-800/50
- Animação: animate-pulse do Tailwind
- Bordas arredondadas
- Efeito shimmer (opcional, gradiente animado)

Usar no:
- Dashboard principal enquanto fetchSheetData está loading
- Qualquer página que carrega dados assíncronos

Export:
- export { CardSkeleton, TableSkeleton, ChartSkeleton }
```

---

## ✅ PROMPT 11: Toast Notifications Customizado

```
Criar sistema de toast notifications mais elegante.

CRIAR: src/components/ui/Toast.tsx
CRIAR: src/hooks/useToast.ts

O Lovable já pode ter um sistema de toast (Sonner), mas vamos customizar:

useToast hook deve retornar:
- toast.success(message, options)
- toast.error(message, options)
- toast.warning(message, options)
- toast.info(message, options)
- toast.loading(message) - retorna ID
- toast.dismiss(id)

Customizações:
- Position: bottom-right
- Duration: 4000ms (4s)
- Estilos dark theme:
  * bg-slate-800
  * border-slate-700
  * Ícones coloridos por tipo
  * Animação slide in/out

Tipos de ícones:
- Success: ✓ (verde)
- Error: ✗ (vermelho)
- Warning: ⚠ (amarelo)
- Info: ℹ (azul)
- Loading: spinner

Usar em:
- Login/Register/Logout (sucesso/erro)
- Operações CRUD
- Erros de rede
- Confirmações

IMPORTANTE: Mensagens devem ser amigáveis:
- ❌ "Error: 401 Unauthorized"
- ✅ "Email ou senha incorretos. Tente novamente."
```

---

## ✅ PROMPT 12: Validação de Formulários com React Hook Form

```
Melhorar validação de formulários usando React Hook Form + Zod.

INSTALAR (se não tiver):
- react-hook-form
- zod
- @hookform/resolvers

CRIAR: src/lib/validations/auth.ts

Schemas Zod:
```typescript
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Senha deve ter pelo menos 1 letra maiúscula")
    .regex(/[0-9]/, "Senha deve ter pelo menos 1 número"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});
```

ATUALIZAR: Login.tsx, Register.tsx, ForgotPassword.tsx

Usar:
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema)
});
```

Mostrar erros:
- Abaixo de cada input
- Cor vermelha (text-red-400)
- Ícone de erro
- Animação fade in

Benefícios:
- Validação em tempo real (onChange)
- Mensagens de erro customizadas
- Type-safety total
- Menos código boilerplate
```

---

## ✅ PROMPT 13: Animações de Transição entre Páginas

```
Adicionar animações suaves ao navegar entre páginas.

INSTALAR: framer-motion

CRIAR: src/components/PageTransition.tsx

Componente wrapper para páginas:
```typescript
<PageTransition>
  {/* conteúdo da página */}
</PageTransition>
```

Animações:
- Fade in ao entrar (opacity 0 → 1)
- Slide up leve (translateY 20px → 0)
- Duração: 300ms
- Easing: ease-out

Usar em:
- Todas as páginas de auth (Login, Register, ForgotPassword)
- Páginas do dashboard
- Transições de rotas protegidas

Exemplo:
```typescript
import { motion } from 'framer-motion';

export const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);
```

IMPORTANTE: Envolver cada página com este componente para UX fluida.
```

---

## ✅ PROMPT 14: Password Strength Indicator

```
Adicionar indicador visual de força da senha na página de registro.

CRIAR: src/components/auth/PasswordStrength.tsx

Props:
- password: string

Lógica de força:
- Fraca (vermelho): < 6 chars
- Média (amarelo): 6-8 chars, sem maiúscula/número
- Boa (verde claro): 8+ chars, maiúscula OU número
- Forte (verde): 8+ chars, maiúscula E número E caractere especial

UI:
- Barra de progresso (0-100%)
- Cores dinâmicas (red → yellow → green)
- Label: "Fraca" | "Média" | "Boa" | "Forte"
- Lista de requisitos:
  ✓ Mínimo 8 caracteres
  ✓ 1 letra maiúscula
  ✓ 1 número
  ✓ 1 caractere especial (opcional)

Design:
- Barra: h-2, rounded-full, transição suave
- Background: bg-slate-700
- Fill: bg-red-500 / bg-yellow-500 / bg-green-500
- Ícones: ✓ (verde) ou ○ (cinza)

Usar em:
- Register.tsx (abaixo do campo senha)

Benefícios:
- Melhor UX
- Usuários criam senhas mais seguras
- Reduz tentativas de senha fraca
```

---

## ✅ PROMPT 15: Email Verification Banner

```
Adicionar banner de verificação de email após registro.

CRIAR: src/components/auth/EmailVerificationBanner.tsx

Mostrar quando:
- Usuário está logado
- Email não foi verificado (user.email_verified === false)

Banner:
- Posição: topo da página (sticky)
- Cor: bg-yellow-500/10, border-yellow-500/50
- Ícone: ⚠️
- Mensagem: "Verifique seu email para acessar todos os recursos"
- Botão: "Reenviar email de verificação"
- Botão fechar (X)

Funcionalidades:
1. Ao clicar "Reenviar":
   - Chamar supabase.auth.resend() (verificar método correto)
   - Mostrar toast: "Email reenviado! Verifique sua caixa de entrada"
   - Desabilitar botão por 60s (cooldown)
2. Ao clicar X:
   - Ocultar banner (salvar no localStorage para não mostrar novamente nesta sessão)
3. Auto-dismiss se usuário verificar email

Usar em:
- App.tsx ou Layout principal
- Mostrar em todas as páginas protegidas

IMPORTANTE: Verificar se Supabase está configurado para exigir verificação de email.
```

---

## ✅ PROMPT 16: Social Login (Google)

```
Adicionar login social com Google OAuth.

CONFIGURAR NO SUPABASE:
1. Authentication > Providers > Google
2. Adicionar Client ID e Client Secret do Google Cloud Console
3. Configurar Redirect URL

ATUALIZAR: Login.tsx e Register.tsx

Adicionar:
1. Divider "ou" entre form e social login
2. Botão "Continuar com Google":
   - Ícone do Google
   - bg-white, text-slate-900
   - Hover: bg-gray-100
   - onClick: signInWithGoogle()

ATUALIZAR: useAuth.tsx

Adicionar método:
```typescript
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    }
  });
  if (error) throw error;
};
```

Design:
- Botão com logo do Google (SVG)
- Border: border-slate-300
- Transição suave
- Responsivo

FUTURO: Adicionar GitHub, LinkedIn se necessário.

IMPORTANTE:
- Testar fluxo completo
- Verificar se dados do Google (nome, email, avatar) são salvos
- user_metadata deve conter avatar_url
```

---

## ✅ PROMPT 17: Session Timeout & Auto-logout

```
Implementar logout automático por inatividade.

CRIAR: src/hooks/useSessionTimeout.ts

Lógica:
1. Detectar inatividade do usuário (sem mouse/keyboard por X minutos)
2. Mostrar modal de aviso: "Você será desconectado em 60s por inatividade"
3. Usuário pode clicar "Continuar conectado" para resetar timer
4. Após 60s, fazer logout automático

Configuração:
- Tempo de inatividade: 15 minutos (configurável)
- Tempo de aviso: 60 segundos
- Eventos monitorados: mousemove, keydown, click, scroll

Implementação:
```typescript
const useSessionTimeout = (timeoutMinutes = 15) => {
  // useEffect para monitorar eventos
  // setTimeout para inatividade
  // Modal de aviso
  // Auto-logout
};
```

CRIAR: src/components/SessionTimeoutModal.tsx

Modal:
- Fundo escuro com blur
- Card centralizado
- Ícone de relógio
- Contador regressivo: "59s"
- Botões: "Continuar conectado" | "Sair agora"

Usar em:
- App.tsx (aplicar globalmente para usuários logados)

IMPORTANTE:
- Não ativar em páginas públicas (login, register)
- Salvar preferência do usuário (se desabilitou)
- Toast ao fazer auto-logout: "Você foi desconectado por inatividade"
```

---

## ✅ PROMPT 18: Remember Me (Persistir Login)

```
Adicionar opção "Lembrar-me" no login para sessão persistente.

ATUALIZAR: Login.tsx

Adicionar checkbox:
- Label: "Lembrar-me"
- Default: false
- Posição: entre senha e botão "Entrar"

ATUALIZAR: useAuth.tsx

Modificar signIn:
```typescript
const signIn = async (email: string, password: string, rememberMe = false) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // Se rememberMe = true, salvar flag no localStorage
  if (rememberMe) {
    localStorage.setItem('remember_me', 'true');
  }

  // Configurar persistência da sessão
  if (!rememberMe) {
    // Sessão expira ao fechar navegador
    supabase.auth.setSession({ access_token, refresh_token, session: 'temporary' });
  }
};
```

ATUALIZAR: signOut

Limpar flag:
```typescript
localStorage.removeItem('remember_me');
```

Design:
- Checkbox pequeno (16px)
- Label clicável
- Cor accent (purple)
- Alinhamento à esquerda

IMPORTANTE:
- Explicar ao usuário: "Mantenha-se conectado neste dispositivo"
- Avisar sobre segurança em dispositivos compartilhados
```

---

## 🎨 COMPONENTES VISUAIS EXTRAS

### PROMPT 19: Avatar com Upload

```
Criar componente de avatar com upload de imagem.

CRIAR: src/components/UserAvatar.tsx

Features:
1. Mostrar avatar atual (imagem ou iniciais)
2. Hover: mostrar botão "Trocar foto"
3. Click: abrir seletor de arquivo
4. Upload para Supabase Storage
5. Atualizar user_metadata com nova URL

Props:
- user: User
- editable?: boolean (default false)
- size?: 'sm' | 'md' | 'lg' (32px | 48px | 64px)

Upload flow:
1. Usuário seleciona imagem
2. Validar: tipo (jpg/png), tamanho (< 2MB)
3. Upload para bucket 'avatars' no Supabase Storage
4. Pegar URL pública
5. Atualizar user.user_metadata.avatar_url
6. Mostrar toast sucesso

Fallback:
- Se não tem avatar, mostrar iniciais do nome
- Fundo: gradiente purple/pink
- Letra branca, centralizada

Usar em:
- UserMenu (header)
- Página de perfil (editable=true)

IMPORTANTE: Configurar bucket 'avatars' no Supabase Storage (público).
```

---

## 📱 RESPONSIVIDADE

### PROMPT 20: Auth Mobile Optimization

```
Otimizar todas as páginas de autenticação para mobile.

ATUALIZAR: Login.tsx, Register.tsx, ForgotPassword.tsx

Melhorias mobile (< 768px):
1. Formulários:
   - Width: 100% (sem max-width)
   - Padding: 16px
   - Font-size: 16px (evita zoom no iOS)

2. Inputs:
   - Height: 48px (touch-friendly)
   - Border: 2px (mais visível)
   - Spacing: 16px entre campos

3. Botões:
   - Height: 48px
   - Font-size: 16px
   - Border-radius: 8px

4. Cards:
   - Remover backdrop-blur (performance)
   - Box-shadow mais sutil
   - Padding reduzido

5. Logo/Título:
   - Font-size menor
   - Margin reduzido

6. Links:
   - Espaçamento maior (44px mínimo)
   - Cor mais contrastante

TESTAR:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- Android pequeno (360px)
- Tablet (768px)

IMPORTANTE:
- Keyboard overlay não deve cobrir inputs
- Focus deve scroll para campo visível
- Evitar scrolling horizontal
```

---

## 🧪 TESTES E QUALIDADE

### PROMPT 21: Error Boundaries

```
Adicionar Error Boundary para capturar erros em auth.

CRIAR: src/components/ErrorBoundary.tsx

Componente:
- Capturar erros em child components
- Mostrar UI de fallback elegante
- Log de erro (console + Sentry futuro)
- Botão "Tentar novamente" que recarrega página

Fallback UI:
- Ícone de erro
- Mensagem: "Algo deu errado"
- Descrição: "Por favor, recarregue a página ou entre em contato com suporte"
- Botão: "Recarregar página"
- Link: "Voltar para login"

Usar em:
- Envolver <AuthProvider>
- Envolver rotas principais

Logs:
- Capturar error stack
- Timestamp
- User info (se disponível)
- URL da página

Integração futura:
- Sentry
- LogRocket
- Custom analytics
```

---

## 🔒 SEGURANÇA

### PROMPT 22: Rate Limiting (Frontend)

```
Implementar rate limiting no frontend para prevenir spam.

CRIAR: src/hooks/useRateLimit.ts

Hook para limitar tentativas:
```typescript
const useRateLimit = (key: string, maxAttempts: number, windowMs: number) => {
  const [attempts, setAttempts] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [resetTime, setResetTime] = useState<number | null>(null);

  const attempt = () => {
    // Incrementar tentativas
    // Se > maxAttempts, bloquear
    // Salvar no localStorage com timestamp
  };

  return { attempt, blocked, resetTime, remainingAttempts };
};
```

Usar em:
1. Login: max 5 tentativas / 15 minutos
2. Register: max 3 tentativas / hora
3. Forgot Password: max 3 tentativas / hora

UI quando bloqueado:
- Desabilitar botão
- Mostrar mensagem: "Muitas tentativas. Aguarde 14:32 minutos"
- Contador regressivo

IMPORTANTE:
- Frontend rate limiting é apenas UX, backend deve ter também
- Limpar localStorage após sucesso
- Não bloquear para sempre (reset após window)
```

---

## 📊 ANALYTICS

### PROMPT 23: Auth Analytics

```
Adicionar tracking de eventos de autenticação.

CRIAR: src/lib/analytics.ts

Eventos para trackear:
1. auth.signup_started
2. auth.signup_completed
3. auth.signup_failed (com motivo)
4. auth.login_started
5. auth.login_completed
6. auth.login_failed (com motivo)
7. auth.logout
8. auth.password_reset_requested
9. auth.password_reset_completed
10. auth.email_verified

Implementação básica:
```typescript
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  // Console log (dev)
  console.log('[Analytics]', event, properties);

  // Google Analytics (se configurado)
  if (window.gtag) {
    window.gtag('event', event, properties);
  }

  // Mixpanel, Amplitude, etc (futuro)
};
```

Usar em:
- useAuth hook (cada método)
- Páginas de auth (page views)

Dados coletados:
- Timestamp
- User agent
- Referrer
- Tempo até conclusão
- Tipo de erro (se falhou)

IMPORTANTE:
- GDPR compliance
- Não logar dados sensíveis (senhas, tokens)
- Consentimento do usuário (banner de cookies futuro)
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

Após implementar todos os prompts acima, você terá:

- ✅ Loading states em todos os botões
- ✅ Skeletons enquanto carrega dados
- ✅ Toast notifications customizadas
- ✅ Validação de formulários robusta (Zod + React Hook Form)
- ✅ Animações suaves entre páginas
- ✅ Indicador de força de senha
- ✅ Banner de verificação de email
- ✅ Login social com Google
- ✅ Session timeout com auto-logout
- ✅ Opção "Lembrar-me"
- ✅ Avatar com upload
- ✅ Mobile otimizado
- ✅ Error boundaries
- ✅ Rate limiting
- ✅ Analytics básico

---

## 🚀 RESULTADO ESPERADO

Com todas essas melhorias, seu sistema de autenticação terá:

1. **UX de nível profissional**
2. **Segurança aumentada**
3. **Performance otimizada**
4. **Mobile-first**
5. **Acessibilidade melhorada**
6. **Analytics para decisões data-driven**

---

**Pronto para impressionar usuários! 💎✨**
