# 🔐 SISTEMA DE AUTENTICAÇÃO - PROMPTS PARA LOVABLE

## 📋 ORDEM DE IMPLEMENTAÇÃO
Execute os prompts na ordem abaixo, colando cada um no Lovable e aguardando a conclusão antes de passar para o próximo.

---

## ✅ PROMPT 1: Hook useAuth + Context Provider

```
Criar um sistema completo de autenticação usando Supabase Auth.

CRIAR: src/hooks/useAuth.tsx

Implementar:
1. AuthContext com React.createContext
2. AuthProvider component que envolve a aplicação
3. Hook useAuth() para acessar contexto de auth

O contexto deve ter:
- user: User | null (usuário atual do Supabase)
- loading: boolean (carregando estado inicial)
- signUp(email, password): Promise<void> - registrar novo usuário
- signIn(email, password): Promise<void> - fazer login
- signOut(): Promise<void> - fazer logout
- resetPassword(email): Promise<void> - enviar email de reset
- updateProfile(data): Promise<void> - atualizar perfil do usuário

Funcionalidades:
- Usar supabase.auth.getSession() no mount para verificar sessão existente
- Listener para onAuthStateChange para sincronizar estado
- Tratamento de erros com mensagens amigáveis (usar toast)
- Persistência automática de sessão
- Loading state inicial enquanto verifica sessão

TypeScript:
- Tipar corretamente User, Session do Supabase
- Interface AuthContextType bem definida
- Export AuthProvider e useAuth

IMPORTANTE: Usar o cliente Supabase que já existe no projeto (@/integrations/supabase/client)
```

---

## ✅ PROMPT 2: Componente ProtectedRoute

```
Criar componente para proteger rotas que requerem autenticação.

CRIAR: src/components/ProtectedRoute.tsx

O componente deve:
1. Usar o hook useAuth() para verificar se usuário está logado
2. Se loading = true, mostrar um loading spinner elegante (full screen)
3. Se user = null, redirecionar para /login usando Navigate do react-router-dom
4. Se user existe, renderizar {children}

Props:
- children: ReactNode (conteúdo protegido)

Design do Loading:
- Fundo: bg-slate-950 (dark theme do projeto)
- Spinner: border-purple-500/border-pink-500 animado
- Texto: "Carregando..." em text-slate-400
- Centralizado vertical e horizontalmente

Usar:
- Navigate from 'react-router-dom' para redirect
- useAuth from '@/hooks/useAuth'

TypeScript completo com todas as tipagens.
```

---

## ✅ PROMPT 3: Página de Login

```
Criar página de login moderna e responsiva.

CRIAR: src/pages/Login.tsx

Layout:
- Container centralizado (max-w-md mx-auto)
- Card com glassmorphism (backdrop-blur-xl, bg-slate-800/50)
- Logo/título: "Dashboard Analytics" com gradiente purple/pink
- Formulário de login (email + senha)
- Botão "Entrar" com loading state
- Link "Esqueceu a senha?" → /forgot-password
- Link "Não tem conta? Cadastre-se" → /register
- Mensagens de erro usando toast

Funcionalidades:
1. Formulário com useState para email/password
2. Validação básica (email válido, senha mínima 6 chars)
3. Ao fazer login com sucesso: redirecionar para "/" usando useNavigate
4. Tratamento de erros do Supabase (credenciais inválidas, etc)
5. Loading state no botão enquanto processa
6. Usar useAuth().signIn(email, password)

Design:
- Seguir o padrão dark theme do projeto
- Inputs com bg-slate-900/50, border-slate-700
- Foco: ring-purple-500
- Botão: bg-gradient-to-r from-purple-600 to-pink-600
- Transições suaves
- Mobile-first responsivo

IMPORTANTE: Se usuário já estiver logado (verificar com useAuth), redirecionar para "/"
```

---

## ✅ PROMPT 4: Página de Registro

```
Criar página de cadastro de novos usuários.

CRIAR: src/pages/Register.tsx

Similar ao Login, mas com campos adicionais:
- Nome completo (opcional, guardar no user_metadata)
- Email
- Senha
- Confirmar senha

Layout:
- Mesmo estilo glassmorphism do Login
- Título: "Criar sua conta"
- Botão: "Cadastrar"
- Link: "Já tem conta? Faça login" → /login

Validações:
1. Email válido
2. Senha mínima 6 caracteres (ou 8 para mais segurança)
3. Senha e confirmar senha devem ser iguais
4. Nome não pode ser vazio se preenchido

Funcionalidades:
1. Ao cadastrar com sucesso:
   - Mostrar toast de sucesso: "Conta criada! Verifique seu email"
   - Redirecionar para /login
2. Passar metadata do nome: signUp(email, password, { data: { full_name: name } })
3. Loading state durante registro
4. Tratamento de erros (email já existe, senha fraca, etc)

IMPORTANTE: Supabase pode requerer verificação de email. Avisar o usuário após cadastro.
```

---

## ✅ PROMPT 5: Página de Recuperação de Senha

```
Criar página para recuperação de senha.

CRIAR: src/pages/ForgotPassword.tsx

Layout:
- Container centralizado (max-w-md)
- Card glassmorphism
- Título: "Recuperar senha"
- Descrição: "Digite seu email para receber instruções de redefinição"
- Campo: Email
- Botão: "Enviar instruções"
- Link: "Voltar para login" → /login

Funcionalidades:
1. Input de email com validação
2. Ao clicar "Enviar":
   - useAuth().resetPassword(email)
   - Mostrar toast sucesso: "Email enviado! Verifique sua caixa de entrada"
   - Desabilitar botão por 60s (cooldown para evitar spam)
   - Mostrar contador: "Aguarde 59s para reenviar"
3. Loading state
4. Tratamento de erros

Design:
- Mesmo padrão visual das outras páginas auth
- Ícone de email ou lock no topo
- Botão secundário para voltar (outline)

IMPORTANTE: Configurar no Supabase Dashboard a URL de redirect após reset.
```

---

## ✅ PROMPT 6: Componente UserMenu no Header

```
Criar menu de usuário para o header do dashboard.

CRIAR: src/components/UserMenu.tsx

O componente deve mostrar:
1. Quando NÃO logado:
   - Botão "Entrar" → link para /login

2. Quando logado:
   - Avatar com inicial do nome (ou ícone user)
   - Nome do usuário ao lado (apenas desktop, ocultar no mobile)
   - Dropdown ao clicar:
     * Email do usuário (texto small, não clicável)
     * Divider
     * "Perfil" (futuro)
     * "Configurações" (futuro)
     * Divider
     * "Sair" (onClick: signOut + redirect /login)

UI/UX:
- Usar Radix UI DropdownMenu ou similar
- Avatar: círculo com bg-gradient purple/pink, letra branca
- Dropdown: bg-slate-800, border-slate-700, backdrop-blur
- Hover states suaves
- Transições
- Fechar dropdown ao clicar fora
- Responsivo (compacto no mobile)

Funcionalidades:
- useAuth() para pegar user e signOut
- useNavigate para redirect após logout
- Mostrar loading state durante logout
- Toast de confirmação: "Você saiu da conta"

IMPORTANTE: Deve ser reutilizável e se integrar facilmente ao Header existente.
```

---

## ✅ PROMPT 7: Integrar UserMenu no Header + Rotas de Auth

```
Atualizar o projeto para integrar o sistema de autenticação:

1. ATUALIZAR: src/App.tsx (ou arquivo principal de rotas)
   - Importar AuthProvider de '@/hooks/useAuth'
   - Envolver todo o app com <AuthProvider>
   - Adicionar rotas:
     * /login → <Login />
     * /register → <Register />
     * /forgot-password → <ForgotPassword />
   - Todas as rotas do dashboard devem usar <ProtectedRoute>

Exemplo de estrutura:
```tsx
<AuthProvider>
  <Routes>
    {/* Rotas públicas */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />

    {/* Rotas protegidas */}
    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/resumo-geral" element={<ProtectedRoute><ResumoGeral /></ProtectedRoute>} />
    {/* ... demais rotas */}
  </Routes>
</AuthProvider>
```

2. ATUALIZAR: src/components/Header.tsx (ou componente de header)
   - Importar UserMenu
   - Adicionar <UserMenu /> no canto direito do header
   - Posicionamento: ml-auto (empurra para direita)
   - Deve ficar ao lado do seletor de mês

IMPORTANTE:
- Verificar que TODAS as páginas do dashboard estão protegidas
- Testar navegação entre páginas públicas e protegidas
- UserMenu deve aparecer em todas as páginas protegidas
```

---

## ✅ PROMPT 8: Configurar Supabase Auth (se necessário)

```
Verificar e ajustar configurações do Supabase Auth:

NO SUPABASE DASHBOARD (https://supabase.com/dashboard):

1. Authentication > Providers:
   - ✅ Email provider habilitado
   - Configurar: "Confirm email" → decidir se requer verificação
   - Recomendado: desabilitar para desenvolvimento, habilitar em produção

2. Authentication > URL Configuration:
   - Site URL: https://seu-dominio.lovable.app
   - Redirect URLs:
     * https://seu-dominio.lovable.app/login
     * https://seu-dominio.lovable.app/forgot-password
     * http://localhost:5173 (desenvolvimento)

3. Authentication > Email Templates:
   - Personalizar templates (opcional):
     * Confirm signup
     * Reset password
     * Magic link

4. Criar tabela de profiles (opcional, para futura expansão):
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table profiles enable row level security;

-- Policy: usuários podem ver apenas seu próprio perfil
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

-- Policy: usuários podem atualizar apenas seu próprio perfil
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

IMPORTANTE: Anotar as credenciais do Supabase (já devem estar no Lovable):
- SUPABASE_URL
- SUPABASE_ANON_KEY
```

---

## 🧪 CHECKLIST DE TESTES

Após implementar tudo, testar na ordem:

### 1. Fluxo de Registro
- [ ] Acessar /register
- [ ] Tentar cadastrar sem preencher campos (validação deve bloquear)
- [ ] Tentar cadastrar com senhas diferentes (deve mostrar erro)
- [ ] Cadastrar com email válido
- [ ] Verificar se recebeu email de confirmação (se habilitado)
- [ ] Verificar se foi redirecionado para /login

### 2. Fluxo de Login
- [ ] Acessar /login
- [ ] Tentar logar com credenciais erradas (deve mostrar erro)
- [ ] Logar com credenciais corretas
- [ ] Verificar se foi redirecionado para dashboard (/)
- [ ] Verificar se UserMenu aparece com nome/avatar
- [ ] Verificar se token persiste (recarregar página)

### 3. Navegação Protegida
- [ ] Tentar acessar / sem estar logado (deve redirecionar para /login)
- [ ] Logar e navegar entre páginas do dashboard
- [ ] Verificar se UserMenu está presente em todas as páginas

### 4. Fluxo de Logout
- [ ] Clicar no UserMenu
- [ ] Clicar em "Sair"
- [ ] Verificar se foi redirecionado para /login
- [ ] Tentar acessar / novamente (deve bloquear)

### 5. Recuperação de Senha
- [ ] Acessar /forgot-password
- [ ] Inserir email cadastrado
- [ ] Verificar se recebeu email com link
- [ ] Clicar no link e redefinir senha
- [ ] Fazer login com nova senha

### 6. Responsividade
- [ ] Testar todas as páginas no mobile (< 768px)
- [ ] Verificar se UserMenu funciona bem no mobile
- [ ] Verificar se formulários são usáveis no mobile

---

## 🎨 MELHORIAS OPCIONAIS (FUTURAS)

Após o sistema básico funcionar:

1. **Página de Perfil** (/profile)
   - Editar nome, avatar
   - Alterar senha
   - Excluir conta

2. **OAuth Providers**
   - Google Login
   - GitHub Login

3. **2FA (Two-Factor Authentication)**
   - TOTP via app autenticador

4. **Roles & Permissions**
   - Admin, Editor, Viewer
   - Controle de acesso por feature

5. **Session Management**
   - Ver dispositivos conectados
   - Fazer logout de todos os dispositivos

6. **Auditoria**
   - Log de atividades do usuário
   - Histórico de logins

---

## 📚 RECURSOS ÚTEIS

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Auth UI (opcional)](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)
- [React Router Protected Routes](https://reactrouter.com/en/main/start/overview)

---

## ⚠️ TROUBLESHOOTING

**Erro: "Invalid login credentials"**
- Verificar se email foi confirmado (se confirmação obrigatória)
- Verificar se usuário existe no Supabase Dashboard

**Erro: "Email not confirmed"**
- Supabase requer confirmação por padrão
- Desabilitar em: Authentication > Providers > Email > "Confirm email"

**Session não persiste após reload**
- Verificar se supabase client está usando 'localStorage'
- Verificar se não há erro no console

**Redirect não funciona**
- Verificar URLs permitidas no Supabase Dashboard
- Adicionar domínio do Lovable

**Email não chega**
- Verificar spam
- Em dev, emails aparecem nos logs do Supabase
- Configurar SMTP customizado para produção

---

## 🚀 PRÓXIMOS PASSOS APÓS AUTH

Com autenticação implementada, você pode:

1. **Vincular dados do usuário**
   - Salvar spreadsheetId por usuário
   - Cada usuário tem seus próprios funis

2. **Multi-tenancy (futuro)**
   - Organizações
   - Convites de equipe
   - Roles

3. **Features premium**
   - Planos de assinatura
   - Stripe integration
   - Feature flags por plano

---

**BOA SORTE! 🎉**
