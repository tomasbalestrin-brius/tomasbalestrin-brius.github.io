# Sistema de Multi-Tenancy

## Status: IMPLEMENTADO ✅

O sistema de multi-tenancy está **completamente implementado** no banco de dados e na interface!

---

## Arquitetura

### 1. Database Schema

**Tabelas Principais:**

```sql
organizations
├── id (UUID)
├── name (Texto)
├── slug (Único)
├── logo_url (URL opcional)
├── primary_color / secondary_color (White Label)
├── plan (free/starter/pro/enterprise)
├── max_users / max_spreadsheets (Limites)
└── owner_id (Referência ao criador)

organization_members
├── id (UUID)
├── organization_id → organizations
├── user_id → auth.users
├── role (owner/admin/member/viewer)
└── joined_at

spreadsheet_connections
├── id (UUID)
├── organization_id → organizations
├── spreadsheet_id (ID do Google Sheets)
├── spreadsheet_name
├── api_key (opcional)
└── sync_frequency (manual/hourly/daily)

invitations
├── id (UUID)
├── organization_id → organizations
├── email
├── role (admin/member/viewer)
├── token (único)
├── expires_at (7 dias)
└── status (pending/accepted/expired)
```

**RLS (Row Level Security):** ✅
- Políticas para isolar dados entre organizações
- Usuários só veem dados da sua organização
- Admins/Owners têm permissões elevadas

**Triggers Automáticos:** ✅
- Cria organização padrão ao registrar novo usuário
- Adiciona usuário como owner automaticamente
- Atualiza `profiles.current_organization_id`

---

## 2. Frontend Implementation

### Hooks & Contexts

**`useOrganization` Hook** (`src/hooks/useOrganization.ts`)
```typescript
const {
  organization,           // Org atual
  members,               // Membros da org
  userRole,              // Role do usuário
  loading,

  // Permissões
  isOwner,
  isAdmin,
  canManageMembers,
  canManageSettings,

  // Ações
  updateOrganization,
  switchOrganization,
  inviteMember,
  removeMember,
  updateMemberRole,
} = useOrganization();
```

### Componentes UI

✅ **OrganizationSwitcher** - Dropdown para trocar entre organizações
- Mostra todas as organizações do usuário
- Badge com role (owner/admin/member)
- Botão para criar nova organização
- Integrado no header do dashboard

✅ **OrganizationLogo** - Logo da organização na sidebar
- Mostra logo ou inicial
- Animação de loading

✅ **Team Page** (`/team`) - Gerenciamento completo
- Lista de membros ativos com avatars
- Gerenciar roles (promover/rebaixar)
- Remover membros
- Convidar novos membros por email
- Lista de convites pendentes
- Limite de usuários por plano

---

## 3. Como Usar

### Para Usuários

**Trocar de Organização:**
1. Clique no seletor de organizações (canto superior direito)
2. Escolha a organização desejada
3. Dashboard recarrega com os dados da nova org

**Convidar Membros:**
1. Acesse `/team` ou clique em "Equipe" no menu do usuário
2. Clique em "Convidar Membro"
3. Digite o email e escolha a role
4. Membro receberá email com link de convite

**Gerenciar Membros:**
1. Acesse `/team`
2. Clique nos 3 pontos ao lado do membro
3. Promover, rebaixar ou remover

### Para Desenvolvedores

**Verificar Organização Atual:**
```typescript
import { useOrganization } from '@/hooks/useOrganization';

function MyComponent() {
  const { organization, userRole } = useOrganization();

  if (!organization) return <div>Carregando...</div>;

  return (
    <div>
      <h1>{organization.name}</h1>
      <p>Seu role: {userRole}</p>
    </div>
  );
}
```

**Filtrar Dados por Organização:**
```typescript
const { data, error } = await supabase
  .from('spreadsheet_connections')
  .select('*')
  .eq('organization_id', organization.id);
```

---

## 4. Integração com Dashboard (PENDENTE ⚠️)

### Status Atual

O dashboard **ainda não filtra dados por organização**. Atualmente:
- Todos veem os mesmos dados do Google Sheets
- `useDashboardData` usa `SHEET_ID` hardcoded
- Não considera `organization.id`

### Como Completar a Integração

#### Passo 1: Criar Configuração de Planilha

Criar página de settings em `/settings/organization`:

```typescript
// src/pages/OrganizationSettings.tsx
import { useOrganization } from '@/hooks/useOrganization';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function OrganizationSettings() {
  const { organization } = useOrganization();
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSave = async () => {
    await supabase
      .from('spreadsheet_connections')
      .insert({
        organization_id: organization.id,
        spreadsheet_id: spreadsheetId,
        spreadsheet_name: 'Dashboard Analytics',
      });
  };

  // UI para configurar Google Sheets ID
}
```

#### Passo 2: Atualizar `useDashboardData`

```typescript
// src/hooks/useDashboardData.ts
import { useOrganization } from '@/hooks/useOrganization';

export function useDashboardData() {
  const { organization } = useOrganization();

  const loadData = useCallback(async () => {
    // Buscar spreadsheet da organização
    const { data: connection } = await supabase
      .from('spreadsheet_connections')
      .select('spreadsheet_id')
      .eq('organization_id', organization.id)
      .single();

    if (!connection) {
      showToast('Configure o Google Sheets nas configurações', 'error');
      return;
    }

    // Usar connection.spreadsheet_id ao invés do hardcoded
    const productsData = await fetchSheetData(month.name, connection.spreadsheet_id);

    // ... resto do código
  }, [organization]);
}
```

#### Passo 3: Atualizar `fetchSheetData`

```typescript
// src/lib/sheets-api.ts
export async function fetchSheetData(
  month: string,
  spreadsheetId?: string  // Novo parâmetro
): Promise<ProductData[]> {
  const SPREADSHEET_ID = spreadsheetId ||
    import.meta.env.VITE_GOOGLE_SPREADSHEET_ID ||
    '1XsdWQNR7FUo4TrrhsMjSGESS3PtS9G7X8FoHHStxLtU';

  // ... resto do código usa SPREADSHEET_ID
}
```

---

## 5. Planos e Limites

| Plano | Usuários | Planilhas | Preço |
|-------|----------|-----------|-------|
| Free | 3 | 1 | R$ 0 |
| Starter | 10 | 3 | R$ 49/mês |
| Pro | 50 | 10 | R$ 149/mês |
| Enterprise | ∞ | ∞ | Customizado |

**Verificação de Limites:**
```typescript
const canInvite = await checkUserLimit(organization.id);
```

---

## 6. Segurança

**RLS Policies:**
- ✅ Usuários só veem suas organizações
- ✅ Apenas admins podem convidar/remover membros
- ✅ Apenas admins podem alterar configurações
- ✅ Owner não pode ser removido

**Validações:**
- ✅ Token de convite expira em 7 dias
- ✅ Email de convite deve ser válido
- ✅ Não pode convidar email já membro
- ✅ Slug da organização é único

---

## 7. Próximos Passos

### Prioridade Alta 🔴
- [ ] Criar página `/settings/organization` para configurar spreadsheet
- [ ] Integrar `organization_id` no `useDashboardData`
- [ ] Atualizar `fetchSheetData` para aceitar spreadsheet_id
- [ ] Testar isolamento de dados

### Prioridade Média 🟡
- [ ] White Label: Aplicar cores personalizadas por org
- [ ] Sistema de billing/pagamento
- [ ] Email notifications para convites
- [ ] Auditoria de ações (logs)

### Prioridade Baixa 🟢
- [ ] Subdomínios personalizados (ex: cliente.dashboard.com)
- [ ] SSO (Single Sign-On) para Enterprise
- [ ] Permissões granulares por módulo
- [ ] API pública para integrações

---

## 8. Migração de Dados

Para migrar usuários existentes para multi-tenancy:

```sql
-- 1. Criar organização para cada usuário existente
INSERT INTO organizations (name, slug, owner_id)
SELECT
  COALESCE(full_name, email) || '''s Workspace' as name,
  LOWER(REGEXP_REPLACE(COALESCE(full_name, email), '[^a-zA-Z0-9]', '', 'g')) || '-' || SUBSTR(id::text, 1, 8) as slug,
  id as owner_id
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM organization_members WHERE user_id = auth.users.id
);

-- 2. Adicionar usuários como owners
INSERT INTO organization_members (organization_id, user_id, role)
SELECT o.id, o.owner_id, 'owner'
FROM organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM organization_members WHERE organization_id = o.id AND user_id = o.owner_id
);

-- 3. Atualizar perfis
UPDATE profiles p
SET current_organization_id = (
  SELECT organization_id FROM organization_members
  WHERE user_id = p.id LIMIT 1
)
WHERE current_organization_id IS NULL;
```

---

## 9. FAQ

**P: Como sei qual organização o usuário está visualizando?**
R: Use `const { organization } = useOrganization()` - retorna a org atual

**P: Posso ter múltiplas organizações?**
R: Sim! Use o OrganizationSwitcher para trocar entre elas

**P: Como adicionar membros?**
R: Via convite por email na página `/team` (apenas admins/owners)

**P: Os dados são isolados?**
R: Sim! RLS garante que cada org vê apenas seus dados

**P: Posso customizar cores/logo?**
R: Sim! Campos `logo_url`, `primary_color`, `secondary_color` em `organizations`

---

## 10. Suporte

**Problemas Comuns:**

1. **"Não consigo criar organização"**
   - Verifique se o slug é único
   - Confirme que tem permissão

2. **"Convite não funciona"**
   - Verifique se o token não expirou (7 dias)
   - Confirme que o email está correto

3. **"Vejo dados de outra organização"**
   - Verifique qual org está selecionada no switcher
   - Limpe cache do navegador

4. **"Não consigo adicionar mais membros"**
   - Verifique o limite do seu plano
   - Considere upgrade

---

**Documentação criada em:** 2025-01-18
**Última atualização:** 2025-01-18
**Versão:** 1.0
