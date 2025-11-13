# 👤 SISTEMA DE PERFIL DE USUÁRIO

## Guia completo para implementar página de perfil com edição de dados

---

## 📋 VISÃO GERAL

Página de perfil onde usuários podem:
- Ver seus dados pessoais
- Editar nome, email, avatar
- Alterar senha
- Excluir conta
- Ver estatísticas de uso (futuro)

---

## ✅ PROMPT 1: Criar Tabela de Profiles no Supabase

```sql
-- Executar no Supabase SQL Editor

-- Tabela de perfis estendidos
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: usuários podem inserir apenas seu próprio perfil
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function para criar perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar função ao criar usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Criar bucket de storage para avatars (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

-- Policy de storage: usuários podem fazer upload de seus avatars
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy de storage: usuários podem atualizar seus avatars
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy de storage: qualquer um pode ver avatars (público)
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Policy de storage: usuários podem deletar seus avatars
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## ✅ PROMPT 2: Hook useProfile

```
Criar hook para gerenciar perfil do usuário.

CRIAR: src/hooks/useProfile.ts

O hook deve:
1. Buscar perfil do usuário atual do Supabase
2. Sincronizar com realtime (opcional)
3. Prover métodos de atualização

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  role: string | null;
  phone: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem');
      }
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Arquivo deve ter menos de 2MB');
      }

      // Fazer upload
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Pegar URL pública
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Atualizar perfil com nova URL
      await updateProfile({ avatar_url: data.publicUrl });

      return { success: true, url: data.publicUrl };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return { success: false, error };
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    refresh: fetchProfile,
  };
};
```

TypeScript completo, export hook.
```

---

## ✅ PROMPT 3: Página de Perfil - Layout

```
Criar página de perfil do usuário com layout moderno.

CRIAR: src/pages/Profile.tsx

Layout:
- Container max-w-4xl centralizado
- 2 colunas (desktop) / 1 coluna (mobile)

Coluna Esquerda (Sidebar):
1. Card de Avatar:
   - Avatar grande (128px)
   - Botão "Trocar foto" com hover
   - Nome do usuário (H2)
   - Email (small, muted)
   - Data de cadastro: "Membro desde Nov 2025"

2. Card de Estatísticas (futuro):
   - Produtos acompanhados: 12
   - Relatórios gerados: 45
   - Último acesso: "Hoje às 14:32"

Coluna Direita (Main):
1. Tabs:
   - "Informações Pessoais" (default)
   - "Segurança"
   - "Preferências"
   - "Excluir Conta"

Design:
- Cards com glassmorphism (bg-slate-800/50, backdrop-blur)
- Bordas arredondadas (rounded-xl)
- Shadows sutis
- Espaçamento generoso
- Ícones para cada seção

Responsivo:
- Desktop (>1024px): 2 colunas
- Tablet (768-1024px): 1 coluna
- Mobile (<768px): 1 coluna compacta

Header da página:
- Breadcrumb: Dashboard > Perfil
- Título: "Meu Perfil"
- Botão "Salvar alterações" (sticky top quando scroll)

IMPORTANTE: Usar Tabs do Radix UI ou similar para navegação.
```

---

## ✅ PROMPT 4: Tab "Informações Pessoais"

```
Implementar aba de informações pessoais com formulário.

CRIAR: src/components/profile/PersonalInfoTab.tsx

Formulário com campos:
1. Nome completo
   - Input text
   - Placeholder: "Seu nome completo"
   - Validação: mínimo 2 caracteres

2. Email
   - Input email
   - Disabled (não pode alterar facilmente)
   - Ícone de "verificado" se email_verified
   - Link "Alterar email" que abre modal

3. Empresa (opcional)
   - Input text
   - Placeholder: "Nome da sua empresa"

4. Cargo (opcional)
   - Input text
   - Placeholder: "Seu cargo"

5. Telefone (opcional)
   - Input tel
   - Mask: (99) 99999-9999
   - Placeholder: "(11) 99999-9999"

6. Bio (opcional)
   - Textarea
   - Max: 500 caracteres
   - Contador de caracteres
   - Placeholder: "Conte um pouco sobre você..."

Funcionalidades:
- useProfile() para buscar/atualizar dados
- useForm() com React Hook Form
- Dirty state (detectar mudanças)
- Botão "Salvar" desabilitado se não houver mudanças
- Loading state ao salvar
- Toast de sucesso/erro

Design:
- Labels claras
- Inputs com focus states
- Validação em tempo real
- Mensagens de erro abaixo dos campos

IMPORTANTE: Sincronizar com tabela profiles do Supabase.
```

---

## ✅ PROMPT 5: Tab "Segurança"

```
Implementar aba de segurança para alterar senha.

CRIAR: src/components/profile/SecurityTab.tsx

Seções:
1. Alterar Senha
   - Campo: Senha atual (password)
   - Campo: Nova senha (password)
   - Campo: Confirmar nova senha (password)
   - Botão: "Atualizar senha"
   - PasswordStrength indicator na nova senha

2. Autenticação de Dois Fatores (futuro)
   - Toggle: Habilitar/Desabilitar
   - QR Code (quando implementar)
   - Status: "Ativado" ou "Desativado"

3. Sessões Ativas (futuro)
   - Lista de dispositivos/browsers logados
   - IP e última atividade
   - Botão "Encerrar sessão" para cada
   - Botão "Encerrar todas as sessões"

Lógica de Alteração de Senha:
```typescript
const changePassword = async (currentPassword: string, newPassword: string) => {
  // 1. Verificar senha atual fazendo re-autenticação
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    toast.error('Senha atual incorreta');
    return;
  }

  // 2. Atualizar senha
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    toast.error('Erro ao atualizar senha');
    return;
  }

  toast.success('Senha atualizada com sucesso!');
  // Limpar campos
};
```

Validações:
- Senha atual não pode estar vazia
- Nova senha: mínimo 8 chars, maiúscula, número
- Confirmar senha deve ser igual à nova senha
- Nova senha deve ser diferente da atual

Design:
- Ícones de cadeado
- Campos password com toggle "mostrar/ocultar"
- Alert informativo: "Após alterar a senha, você permanecerá logado"

IMPORTANTE: Adicionar confirmação antes de alterar senha.
```

---

## ✅ PROMPT 6: Tab "Preferências"

```
Implementar aba de preferências do usuário.

CRIAR: src/components/profile/PreferencesTab.tsx

Preferências:
1. Tema
   - Radio buttons: Dark / Light / Auto (sistema)
   - Preview ao lado mostrando como fica
   - Salvar no localStorage + user_metadata

2. Idioma (futuro)
   - Select: Português / English / Español
   - Salvar no user_metadata

3. Notificações por Email
   - Toggle: Receber atualizações de produtos
   - Toggle: Receber dicas semanais
   - Toggle: Receber alertas de anomalias
   - Salvar no user_metadata ou tabela separada

4. Fuso Horário
   - Select com timezones
   - Auto-detect timezone do browser
   - Usar para exibir datas/horas

5. Formato de Data
   - Radio: DD/MM/YYYY / MM/DD/YYYY / YYYY-MM-DD
   - Preview: "Hoje: 13/11/2025"

6. Moeda Padrão
   - Select: BRL (R$) / USD ($) / EUR (€)
   - Para exibição futura multi-currency

Salvar preferências:
```typescript
const savePreferences = async (prefs: Preferences) => {
  // Salvar no user_metadata
  const { error } = await supabase.auth.updateUser({
    data: { preferences: prefs }
  });

  // Aplicar imediatamente
  applyTheme(prefs.theme);
  localStorage.setItem('preferences', JSON.stringify(prefs));

  toast.success('Preferências salvas!');
};
```

Design:
- Cada seção separada por dividers
- Labels descritivas
- Toggles bonitos (Radix UI Switch)
- Preview das mudanças em tempo real

IMPORTANTE: Carregar preferências salvas ao montar componente.
```

---

## ✅ PROMPT 7: Tab "Excluir Conta"

```
Implementar aba para exclusão de conta (danger zone).

CRIAR: src/components/profile/DeleteAccountTab.tsx

Layout:
- Card vermelho (bg-red-500/10, border-red-500/50)
- Ícone de alerta (⚠️)
- Título: "Zona de Perigo"
- Descrição clara das consequências

Avisos:
1. "Esta ação é irreversível"
2. "Todos os seus dados serão permanentemente excluídos"
3. "Você não poderá recuperar sua conta ou dados"
4. Lista do que será excluído:
   - ✗ Perfil e configurações
   - ✗ Histórico de relatórios
   - ✗ Preferências salvas
   - ✗ Dashboards personalizados (futuro)

Processo de Exclusão:
1. Botão: "Excluir minha conta" (vermelho)
2. Ao clicar: abrir modal de confirmação
3. Modal pede:
   - Digite seu email para confirmar
   - Digite senha atual
   - Checkbox: "Entendo que esta ação é irreversível"
4. Botão final: "Sim, excluir minha conta permanentemente"

Lógica:
```typescript
const deleteAccount = async (email: string, password: string) => {
  // 1. Verificar senha
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    toast.error('Senha incorreta');
    return;
  }

  // 2. Deletar dados relacionados (profiles, etc)
  // Isso será feito automaticamente pelo CASCADE no SQL

  // 3. Deletar conta do Auth
  const { error: deleteError } = await supabase.auth.admin.deleteUser(
    user.id
  );

  if (deleteError) {
    toast.error('Erro ao excluir conta');
    return;
  }

  // 4. Fazer logout e redirecionar
  toast.success('Conta excluída com sucesso');
  navigate('/register');
};
```

Design:
- Cores vermelhas para ênfase
- Espaçamento extra
- Ícones de alerta
- Texto bold nos avisos
- Modal de confirmação com fundo escuro

IMPORTANTE:
- Adicionar delay de 3s antes de permitir clicar no botão final
- Enviar email de confirmação após exclusão
- Limpar localStorage
```

---

## ✅ PROMPT 8: Modal de Alteração de Email

```
Criar modal para alterar email com verificação.

CRIAR: src/components/profile/ChangeEmailModal.tsx

Props:
- open: boolean
- onClose: () => void
- currentEmail: string

Fluxo:
1. Campo: Novo email
   - Validação: email válido
   - Verificar se diferente do atual
   - Verificar se não está em uso

2. Campo: Senha atual (para confirmar identidade)

3. Botão "Enviar código de verificação"
   - Supabase envia email com código

4. Campo: Código de verificação (6 dígitos)
   - Input com 6 boxes separados
   - Auto-focus ao preencher

5. Botão "Confirmar alteração"

Lógica:
```typescript
const changeEmail = async (newEmail: string, password: string) => {
  // 1. Re-autenticar
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (authError) {
    toast.error('Senha incorreta');
    return;
  }

  // 2. Atualizar email (Supabase envia confirmação automaticamente)
  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (error) {
    toast.error('Email já está em uso');
    return;
  }

  toast.success('Email de confirmação enviado! Verifique sua nova caixa de entrada');
  onClose();
};
```

Design:
- Modal centralizado
- Glassmorphism
- Steps indicator (1/3, 2/3, 3/3)
- Loading states
- Animações suaves

IMPORTANTE:
- Supabase pode exigir verificação de ambos os emails (antigo e novo)
- Usuário pode continuar usando conta enquanto não confirma
- Após confirmar novo email, atualizar automaticamente
```

---

## ✅ PROMPT 9: Adicionar Rota de Perfil

```
Integrar página de perfil no sistema de rotas.

ATUALIZAR: src/App.tsx (ou arquivo de rotas)

Adicionar rota:
```typescript
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
```

ATUALIZAR: src/components/UserMenu.tsx

Adicionar item no dropdown:
- Ícone: User
- Label: "Meu Perfil"
- Link: /profile
- Posição: antes de "Configurações"

ATUALIZAR: src/components/Sidebar.tsx (se houver)

Adicionar item:
- Seção: "Conta"
- Ícone: User
- Label: "Perfil"
- Link: /profile

IMPORTANTE: Link deve fechar sidebar/dropdown ao clicar (mobile).
```

---

## 🎨 COMPONENTES REUTILIZÁVEIS

### PROMPT 10: ProfileCard Component

```
Criar componente card reutilizável para perfil.

CRIAR: src/components/profile/ProfileCard.tsx

Props:
- title: string
- description?: string
- icon?: ReactNode
- children: ReactNode
- variant?: 'default' | 'danger'

Uso:
```tsx
<ProfileCard
  title="Informações Pessoais"
  description="Atualize seus dados pessoais"
  icon={<UserIcon />}
>
  {/* Conteúdo */}
</ProfileCard>
```

Design:
- bg-slate-800/50
- backdrop-blur-xl
- border-slate-700
- rounded-xl
- padding: 24px
- variant='danger': bg-red-500/10, border-red-500/50

Export componente.
```

---

## 📸 MELHORIAS VISUAIS

### PROMPT 11: Avatar Upload com Crop

```
Melhorar upload de avatar com cropping.

INSTALAR: react-image-crop

CRIAR: src/components/profile/AvatarCropModal.tsx

Funcionalidades:
1. Usuário seleciona imagem
2. Modal abre com imagem
3. Área de crop circular
4. Zoom in/out
5. Botões: "Cancelar" | "Salvar"
6. Preview do resultado
7. Upload da versão cropada

Design:
- Modal fullscreen no mobile
- Controles intuitivos
- Grid de alinhamento
- Feedback visual

IMPORTANTE: Comprimir imagem antes de upload (max 500KB).
```

---

## 🧪 TESTES

### Checklist de Testes - Perfil

- [ ] Carregar página de perfil (dados aparecem)
- [ ] Editar nome e salvar (atualiza no banco)
- [ ] Upload de avatar (aparece no UserMenu)
- [ ] Alterar senha com senha atual errada (mostra erro)
- [ ] Alterar senha com sucesso (toast de confirmação)
- [ ] Trocar tema (aplica imediatamente)
- [ ] Salvar preferências (persiste após reload)
- [ ] Tentar excluir conta (modal de confirmação aparece)
- [ ] Alterar email (envia confirmação)
- [ ] Responsividade mobile (todos os tabs)

---

## 📊 MÉTRICAS DE SUCESSO

Após implementação completa:

- ✅ Usuários podem personalizar perfil
- ✅ Avatar customizado aumenta engajamento
- ✅ Preferências salvas melhoram UX
- ✅ Segurança (troca de senha) aumenta confiança
- ✅ Transparência (excluir conta) atende LGPD/GDPR

---

## 🚀 PRÓXIMOS PASSOS

Com perfil implementado, adicionar:

1. **Activity Log**: histórico de ações do usuário
2. **Connected Apps**: integrações com terceiros
3. **Billing**: assinatura e pagamentos (Stripe)
4. **Team**: convidar membros (multi-tenancy)
5. **API Keys**: gerar chaves para API

---

**Perfil completo = Usuários felizes! 🎉**
