# 🏢 MULTI-TENANCY - FASE 1 DO SAAS

## Transformar dashboard em produto White Label multi-tenant

---

## 🎯 VISÃO GERAL

**Objetivo**: Permitir que múltiplas empresas usem o mesmo sistema, cada uma com:
- Seus próprios usuários
- Seus próprios dados (isolados)
- Suas próprias planilhas do Google
- Suas próprias configurações de marca (white label básico)

**Modelo**: **Schema-based Multi-tenancy** (todos compartilham o mesmo banco, mas com RLS - Row Level Security)

---

## 📊 ARQUITETURA

```
┌─────────────────────────────────────────────────┐
│                   APLICAÇÃO                      │
│  (Dashboard Analytics - Lovable)                │
└─────────────────┬───────────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
┌───▼────┐  ┌────▼────┐  ┌─────▼─────┐
│ Org A  │  │  Org B  │  │   Org C   │
│        │  │         │  │           │
│ User 1 │  │ User 1  │  │  User 1   │
│ User 2 │  │ User 2  │  │  User 2   │
│ User 3 │  │         │  │  User 3   │
│        │  │         │  │  User 4   │
│ Sheet1 │  │ Sheet1  │  │  Sheet1   │
│        │  │ Sheet2  │  │  Sheet2   │
└────────┘  └─────────┘  └───────────┘

Dados isolados por organization_id
```

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### PROMPT 1: Criar Schema Multi-tenant

```sql
-- Executar no Supabase SQL Editor

-- =====================================================
-- TABELA: organizations (tenants)
-- =====================================================
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL amigável: dashboard.com/bethel
  domain TEXT UNIQUE, -- Domínio customizado: analytics.bethel.com.br

  -- White Label
  logo_url TEXT,
  primary_color TEXT DEFAULT '#8b5cf6',
  secondary_color TEXT DEFAULT '#ec4899',
  favicon_url TEXT,

  -- Plano e Limites
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'enterprise')),
  max_users INTEGER DEFAULT 3,
  max_spreadsheets INTEGER DEFAULT 1,
  features JSONB DEFAULT '{}', -- { "custom_dashboards": true, "api_access": false }

  -- Dados de contato
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  billing_email TEXT,
  phone TEXT,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para performance
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_domain ON organizations(domain);
CREATE INDEX idx_organizations_owner ON organizations(owner_id);
CREATE INDEX idx_organizations_status ON organizations(status) WHERE status = 'active';

-- =====================================================
-- TABELA: organization_members (usuários da org)
-- =====================================================
CREATE TABLE organization_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Role do usuário na organização
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),

  -- Timestamps
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Constraint: um usuário não pode estar duplicado na mesma org
  UNIQUE(organization_id, user_id)
);

-- Índices
CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);

-- =====================================================
-- TABELA: spreadsheet_connections (conexões com Google Sheets)
-- =====================================================
CREATE TABLE spreadsheet_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,

  -- Dados da conexão
  spreadsheet_id TEXT NOT NULL, -- ID da planilha do Google
  spreadsheet_name TEXT NOT NULL, -- Nome amigável: "Funis Novembro 2025"
  api_key TEXT, -- Opcional: API key específica da org

  -- Configuração
  sync_frequency TEXT DEFAULT 'manual' CHECK (sync_frequency IN ('manual', 'hourly', 'daily')),
  last_synced_at TIMESTAMP WITH TIME ZONE,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'error', 'disabled')),
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices
CREATE INDEX idx_spreadsheets_org ON spreadsheet_connections(organization_id);
CREATE INDEX idx_spreadsheets_status ON spreadsheet_connections(status) WHERE status = 'active';

-- =====================================================
-- TABELA: invitations (convites para org)
-- =====================================================
CREATE TABLE invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,

  email TEXT NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),

  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX idx_invitations_org ON invitations(organization_id);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_status ON invitations(status) WHERE status = 'pending';

-- =====================================================
-- ATUALIZAR: profiles (adicionar organization_id)
-- =====================================================
ALTER TABLE profiles
ADD COLUMN current_organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL;

-- Índice
CREATE INDEX idx_profiles_current_org ON profiles(current_organization_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Organizations: usuários podem ver apenas orgs que pertencem
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own organizations"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update own organizations"
  ON organizations FOR UPDATE
  USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Organization Members: apenas membros da org podem ver
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own organization members"
  ON organization_members FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage members"
  ON organization_members FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Spreadsheets: apenas membros da org podem ver/editar
ALTER TABLE spreadsheet_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org spreadsheets"
  ON spreadsheet_connections FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage spreadsheets"
  ON spreadsheet_connections FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Invitations: apenas membros da org podem ver/gerenciar
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view org invitations"
  ON invitations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- =====================================================
-- FUNCTIONS ÚTEIS
-- =====================================================

-- Function: pegar organização atual do usuário
CREATE OR REPLACE FUNCTION get_current_organization()
RETURNS UUID AS $$
  SELECT current_organization_id
  FROM profiles
  WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function: verificar se usuário é admin da org
CREATE OR REPLACE FUNCTION is_org_admin(org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function: contar membros da org
CREATE OR REPLACE FUNCTION count_org_members(org_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM organization_members
  WHERE organization_id = org_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function: verificar limite de usuários
CREATE OR REPLACE FUNCTION check_user_limit(org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT count_org_members(org_id) < (
    SELECT max_users FROM organizations WHERE id = org_id
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: criar organização padrão ao criar usuário
CREATE OR REPLACE FUNCTION create_default_organization()
RETURNS TRIGGER AS $$
DECLARE
  org_id UUID;
  user_name TEXT;
BEGIN
  -- Pegar nome do usuário ou usar email
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1));

  -- Criar organização
  INSERT INTO organizations (name, slug, owner_id)
  VALUES (
    user_name || '''s Workspace',
    LOWER(REGEXP_REPLACE(user_name, '[^a-zA-Z0-9]', '', 'g')) || '-' || SUBSTR(NEW.id::text, 1, 8),
    NEW.id
  )
  RETURNING id INTO org_id;

  -- Adicionar usuário como owner
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (org_id, NEW.id, 'owner');

  -- Setar como organização atual no perfil
  UPDATE profiles
  SET current_organization_id = org_id
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_created_create_org
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_organization();

-- Trigger: atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER org_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER spreadsheet_updated_at
  BEFORE UPDATE ON spreadsheet_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- DADOS INICIAIS (SEED)
-- =====================================================

-- Isso será executado depois que usuários se cadastrarem
-- Apenas como exemplo:

-- INSERT INTO organizations (name, slug, owner_id, plan)
-- VALUES ('Bethel Educação', 'bethel', '<user_id>', 'enterprise');

-- INSERT INTO organization_members (organization_id, user_id, role)
-- VALUES ('<org_id>', '<user_id>', 'owner');
```

---

## 🎨 FRONTEND - HOOKS

### PROMPT 2: Hook useOrganization

```
Criar hook para gerenciar organização atual do usuário.

CRIAR: src/hooks/useOrganization.ts

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  max_users: number;
  max_spreadsheets: number;
  status: 'active' | 'suspended' | 'cancelled';
}

interface OrganizationMember {
  id: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  user: {
    email: string;
    full_name: string | null;
  };
  joined_at: string;
}

export const useOrganization = () => {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrganization();
    }
  }, [user]);

  const fetchOrganization = async () => {
    try {
      // Buscar organização atual do profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_organization_id')
        .eq('id', user.id)
        .single();

      if (!profile?.current_organization_id) {
        setLoading(false);
        return;
      }

      // Buscar dados da organização
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.current_organization_id)
        .single();

      if (orgError) throw orgError;
      setOrganization(org);

      // Buscar role do usuário
      const { data: membership } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', profile.current_organization_id)
        .eq('user_id', user.id)
        .single();

      setUserRole(membership?.role || null);

      // Buscar membros (se admin)
      if (membership?.role && ['owner', 'admin'].includes(membership.role)) {
        fetchMembers(profile.current_organization_id);
      }
    } catch (error) {
      console.error('Error fetching organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (orgId: string) => {
    const { data } = await supabase
      .from('organization_members')
      .select(`
        id,
        role,
        joined_at,
        user:user_id (
          email,
          profiles (full_name)
        )
      `)
      .eq('organization_id', orgId)
      .order('joined_at', { ascending: false });

    setMembers(data || []);
  };

  const updateOrganization = async (updates: Partial<Organization>) => {
    if (!organization) return { success: false };

    try {
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', organization.id)
        .select()
        .single();

      if (error) throw error;
      setOrganization(data);
      return { success: true };
    } catch (error) {
      console.error('Error updating organization:', error);
      return { success: false, error };
    }
  };

  const switchOrganization = async (orgId: string) => {
    try {
      // Atualizar profile com nova org
      await supabase
        .from('profiles')
        .update({ current_organization_id: orgId })
        .eq('id', user.id);

      // Recarregar dados
      await fetchOrganization();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const isOwner = userRole === 'owner';
  const isAdmin = userRole && ['owner', 'admin'].includes(userRole);
  const canManageMembers = isAdmin;
  const canManageSettings = isAdmin;

  return {
    organization,
    members,
    userRole,
    loading,
    isOwner,
    isAdmin,
    canManageMembers,
    canManageSettings,
    updateOrganization,
    switchOrganization,
    refresh: fetchOrganization,
  };
};
```

Export hook com TypeScript completo.
```

---

## 👥 SISTEMA DE CONVITES

### PROMPT 3: Página de Gerenciamento de Equipe

```
Criar página para gerenciar membros da organização.

CRIAR: src/pages/Team.tsx

Layout:
1. Header:
   - Título: "Equipe"
   - Contador: "5 membros de 10 máximo"
   - Botão: "Convidar membro" (se isAdmin)

2. Lista de Membros:
   - Avatar + Nome
   - Email
   - Role (badge colorido)
   - Data de entrada: "há 3 dias"
   - Menu de ações (... três pontos):
     * Alterar role (se isOwner e não for o próprio)
     * Remover membro (se isAdmin e não for o próprio)

3. Convites Pendentes (seção separada):
   - Email convidado
   - Role
   - Expira em: "5 dias"
   - Botões: "Reenviar" | "Cancelar"

4. Modal de Convite:
   - Campo: Email
   - Select: Role (admin, member, viewer)
   - Descrição de cada role:
     * Admin: pode gerenciar membros e configurações
     * Member: pode visualizar e editar dados
     * Viewer: apenas visualização
   - Botão: "Enviar convite"

Funcionalidades:
- Verificar limite de usuários antes de convidar
- Enviar email de convite (Edge Function)
- Remover membro (confirmação)
- Atualizar role
- Cancelar convite
- Reenviar convite

Design:
- Tabela responsiva (cards no mobile)
- Badges coloridos por role:
  * Owner: purple
  * Admin: blue
  * Member: green
  * Viewer: gray
- Loading states
- Empty state: "Nenhum membro ainda"

IMPORTANTE:
- Owner não pode ser removido
- Não pode alterar próprio role
- Verificar permissões antes de cada ação
```

---

## 📧 EMAIL DE CONVITE

### PROMPT 4: Edge Function para Enviar Convite

```
Criar Edge Function para enviar email de convite.

CRIAR: supabase/functions/send-invitation/index.ts

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { email, organizationId, role, invitedByName } = await req.json();

    // Criar supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Criar convite no banco
    const { data: invitation, error } = await supabase
      .from('invitations')
      .insert({
        email,
        organization_id: organizationId,
        role,
        invited_by: req.headers.get('user-id'),
      })
      .select()
      .single();

    if (error) throw error;

    // Buscar dados da org
    const { data: org } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single();

    // Enviar email (usando Resend, SendGrid, etc)
    const inviteUrl = `${Deno.env.get('APP_URL')}/invite/${invitation.token}`;

    // TODO: Integrar com serviço de email
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Dashboard Analytics <noreply@dashboard.com>',
        to: email,
        subject: `Você foi convidado para ${org.name}`,
        html: `
          <h2>Você foi convidado!</h2>
          <p>${invitedByName} convidou você para se juntar a ${org.name}.</p>
          <p>Seu role será: <strong>${role}</strong></p>
          <a href="${inviteUrl}">Aceitar convite</a>
          <p>Este convite expira em 7 dias.</p>
        `,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

Deploy via Supabase CLI:
```bash
supabase functions deploy send-invitation
```

ATUALIZAR: src/hooks/useOrganization.ts

Adicionar método:
```typescript
const inviteMember = async (email: string, role: string) => {
  // Verificar limite
  const canInvite = await checkUserLimit();
  if (!canInvite) {
    toast.error('Limite de usuários atingido. Faça upgrade do plano.');
    return { success: false };
  }

  // Chamar Edge Function
  const { data, error } = await supabase.functions.invoke('send-invitation', {
    body: { email, organizationId: organization.id, role, invitedByName: user.name }
  });

  if (error) {
    toast.error('Erro ao enviar convite');
    return { success: false };
  }

  toast.success('Convite enviado com sucesso!');
  return { success: true };
};
```
```

---

## 🔗 ACEITAR CONVITE

### PROMPT 5: Página de Aceitar Convite

```
Criar página para aceitar convite de organização.

CRIAR: src/pages/AcceptInvite.tsx

URL: /invite/:token

Fluxo:
1. Carregar dados do convite pelo token
2. Verificar se convite é válido (não expirado, não aceito)
3. Se usuário NÃO está logado:
   - Mostrar: "Faça login ou crie uma conta para aceitar o convite"
   - Salvar token no localStorage
   - Redirecionar para /login
   - Após login, processar convite automaticamente
4. Se usuário JÁ está logado:
   - Mostrar dados do convite:
     * Nome da organização
     * Logo
     * Quem convidou
     * Role que terá
   - Botões: "Aceitar" | "Recusar"

Aceitar convite:
```typescript
const acceptInvite = async (token: string) => {
  // 1. Buscar convite
  const { data: invitation } = await supabase
    .from('invitations')
    .select('*, organizations(*)')
    .eq('token', token)
    .eq('status', 'pending')
    .single();

  if (!invitation) {
    toast.error('Convite inválido ou expirado');
    return;
  }

  // 2. Verificar se não expirou
  if (new Date(invitation.expires_at) < new Date()) {
    toast.error('Este convite expirou');
    return;
  }

  // 3. Adicionar usuário à organização
  const { error } = await supabase
    .from('organization_members')
    .insert({
      organization_id: invitation.organization_id,
      user_id: user.id,
      role: invitation.role,
    });

  if (error) {
    toast.error('Erro ao aceitar convite');
    return;
  }

  // 4. Atualizar status do convite
  await supabase
    .from('invitations')
    .update({ status: 'accepted', accepted_at: new Date().toISOString() })
    .eq('id', invitation.id);

  // 5. Trocar para a nova organização
  await switchOrganization(invitation.organization_id);

  toast.success(`Você entrou em ${invitation.organizations.name}!`);
  navigate('/');
};
```

Design:
- Card centralizado
- Logo da organização
- Informações claras
- Botões grandes e destacados
- Loading states

IMPORTANTE:
- Limpar token do localStorage após processar
- Verificar limite de usuários da org antes de aceitar
- Enviar notificação para quem convidou
```

---

## 🎨 WHITE LABEL BÁSICO

### PROMPT 6: Aplicar Branding da Organização

```
Aplicar cores e logo customizados da organização.

CRIAR: src/hooks/useBranding.ts

Hook para aplicar branding:
```typescript
export const useBranding = () => {
  const { organization } = useOrganization();

  useEffect(() => {
    if (organization) {
      applyBranding(organization);
    }
  }, [organization]);

  const applyBranding = (org: Organization) => {
    // Aplicar cores
    document.documentElement.style.setProperty('--accent-primary', org.primary_color);
    document.documentElement.style.setProperty('--accent-secondary', org.secondary_color);

    // Aplicar favicon
    if (org.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.setAttribute('href', org.favicon_url);
      }
    }

    // Aplicar título
    document.title = `${org.name} - Dashboard Analytics`;
  };
};
```

CRIAR: src/components/OrganizationLogo.tsx

Componente para mostrar logo:
```tsx
export const OrganizationLogo = () => {
  const { organization } = useOrganization();

  if (!organization) return null;

  return (
    <div className="flex items-center gap-3">
      {organization.logo_url ? (
        <img
          src={organization.logo_url}
          alt={organization.name}
          className="h-8 w-auto"
        />
      ) : (
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {organization.name[0]}
          </span>
        </div>
      )}
      <span className="text-lg font-semibold">{organization.name}</span>
    </div>
  );
};
```

ATUALIZAR: src/components/Header.tsx

Substituir logo fixo por <OrganizationLogo />

ATUALIZAR: src/components/Sidebar.tsx

Adicionar logo da org no topo.
```

---

## 🔄 TROCAR DE ORGANIZAÇÃO

### PROMPT 7: Organization Switcher

```
Criar componente para trocar entre organizações (se usuário pertencer a múltiplas).

CRIAR: src/components/OrganizationSwitcher.tsx

UI:
- Dropdown similar ao UserMenu
- Item atual: nome da org + checkmark
- Lista de outras orgs do usuário
- Opção: "+ Criar nova organização"

Funcionalidades:
1. Buscar todas as orgs do usuário:
```typescript
const { data: userOrgs } = await supabase
  .from('organization_members')
  .select('organization_id, organizations(*)')
  .eq('user_id', user.id);
```

2. Ao clicar em uma org:
   - switchOrganization(orgId)
   - Reload da página para aplicar novos dados

3. Ao clicar "Criar nova":
   - Abrir modal de criação
   - Campos: Nome, Slug
   - Criar org + adicionar usuário como owner
   - Trocar para nova org

Design:
- Radix UI DropdownMenu
- Ícone de empresa (building)
- Badges mostrando role em cada org
- Cores da org atual aplicadas no dropdown

Posição:
- Header (ao lado do UserMenu)
- Ou Sidebar (topo)

IMPORTANTE: Mostrar apenas se usuário pertencer a 2+ orgs.
```

---

## 📊 DASHBOARD DE ADMIN

### PROMPT 8: Página de Configurações da Organização

```
Criar página de configurações da organização.

CRIAR: src/pages/OrganizationSettings.tsx

Rota: /settings/organization
Permissão: apenas admin/owner

Tabs:
1. **Geral**
   - Nome da organização
   - Slug (URL)
   - Domínio customizado (enterprise)

2. **Branding**
   - Logo (upload)
   - Cor primária (color picker)
   - Cor secundária (color picker)
   - Favicon (upload)

3. **Plano e Cobrança**
   - Plano atual (badge)
   - Limites:
     * X de Y usuários
     * X de Y planilhas
   - Botão: "Fazer upgrade" (futuro)
   - Histórico de faturas (futuro)

4. **Integrações**
   - Google Sheets API Key (por org)
   - Webhooks (futuro)
   - API Keys (futuro)

5. **Danger Zone**
   - Transferir propriedade (owner)
   - Excluir organização (owner, confirmação)

Funcionalidades:
- useOrganization() para dados
- Formulários com validação
- Upload de imagens para Storage
- Verificar permissões antes de renderizar/salvar
- Toasts de sucesso/erro

Design:
- Similar à página de Profile
- Cards separados por categoria
- Previews das mudanças de branding
- Confirmações para ações perigosas

IMPORTANTE:
- Slug deve ser único (validar)
- Domínio customizado: verificar DNS (futuro)
- Não permitir excluir org se tiver outros membros
```

---

## 🔐 ISOLAR DADOS POR ORGANIZAÇÃO

### PROMPT 9: Atualizar Fetch de Dados

```
Modificar todas as queries de dados para filtrar por organização.

EXEMPLO: Buscar planilhas

ANTES:
```typescript
const fetchSheetData = async (month: string) => {
  const SPREADSHEET_ID = '1XsdWQNR7FUo4TrrhsMjSGESS3PtS9G7X8FoHHStxLtU';
  // ...
};
```

DEPOIS:
```typescript
const fetchSheetData = async (month: string) => {
  const { organization } = useOrganization();

  // Buscar conexões de planilha da org
  const { data: connections } = await supabase
    .from('spreadsheet_connections')
    .select('*')
    .eq('organization_id', organization.id)
    .eq('status', 'active');

  if (!connections || connections.length === 0) {
    toast.error('Nenhuma planilha conectada');
    return [];
  }

  // Usar primeira conexão (ou deixar usuário escolher)
  const SPREADSHEET_ID = connections[0].spreadsheet_id;
  const API_KEY = connections[0].api_key || import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

  // Resto da lógica...
};
```

ATUALIZAR todos os arquivos que buscam dados:
- src/lib/sheets-api.ts
- Componentes do dashboard
- Hooks customizados

ADICIONAR: Seletor de planilha (se org tiver múltiplas)

CRIAR: src/components/SpreadsheetSelector.tsx
- Dropdown para escolher qual planilha visualizar
- Mostrar no header
- Salvar preferência no localStorage

IMPORTANTE:
- TODAS as queries devem filtrar por organization_id
- Verificar RLS está funcionando corretamente
- Testar com múltiplas orgs diferentes
```

---

## 🧪 TESTES DE MULTI-TENANCY

### Checklist de Testes

#### Isolamento de Dados
- [ ] Criar 2 organizações diferentes
- [ ] Criar usuários em cada uma
- [ ] Conectar planilhas diferentes em cada org
- [ ] Verificar que Org A não vê dados de Org B
- [ ] Tentar acessar dados de outra org via API (deve falhar)

#### Gestão de Membros
- [ ] Convidar membro para organização
- [ ] Aceitar convite
- [ ] Verificar membro aparece na lista
- [ ] Alterar role de membro
- [ ] Remover membro
- [ ] Verificar limites de usuários (atingir max_users)

#### Roles e Permissões
- [ ] Logar como Viewer (não pode editar nada)
- [ ] Logar como Member (pode editar dados)
- [ ] Logar como Admin (pode gerenciar membros)
- [ ] Logar como Owner (pode tudo + delete org)

#### White Label
- [ ] Alterar logo → verificar aparece no header
- [ ] Alterar cores → verificar CSS variables mudaram
- [ ] Trocar de org → cores mudam automaticamente

#### Convites
- [ ] Enviar convite para email existente
- [ ] Enviar convite para email novo
- [ ] Aceitar convite
- [ ] Tentar aceitar convite expirado (deve falhar)
- [ ] Cancelar convite pendente

#### Troca de Organização
- [ ] Criar usuário membro de 2+ orgs
- [ ] Trocar de org via switcher
- [ ] Verificar dados mudam (planilhas, membros)
- [ ] Verificar branding muda

---

## 📈 MÉTRICAS DE SUCESSO

Após implementar multi-tenancy:

- ✅ Múltiplas empresas podem usar o sistema
- ✅ Dados 100% isolados e seguros
- ✅ Usuários podem pertencer a várias orgs
- ✅ Convites funcionando via email
- ✅ White label básico aplicado
- ✅ Roles e permissões funcionando
- ✅ Preparado para monetização (planos)

---

## 🚀 PRÓXIMOS PASSOS

Com multi-tenancy implementado, você pode:

1. **Monetização** (FASE 2)
   - Integrar Stripe
   - Sistema de assinaturas
   - Upgrade/downgrade de planos
   - Billing automático

2. **Customização Avançada** (FASE 3)
   - Dashboard builder
   - Indicadores customizáveis
   - White label completo (domínio próprio)

3. **Enterprise Features** (FASE 4)
   - SSO (Single Sign-On)
   - Auditoria avançada
   - SLA e suporte dedicado

---

**Multi-tenancy = SaaS Real! 🏢💰**
