# Sincronização de Funis do Google Sheets

## 🔄 Como Funciona

O módulo de Monetização sincroniza automaticamente os funis da planilha do Google Sheets (Aquisição) com os seguintes critérios:

### Sincronização Automática
- ✅ Acontece **1 vez por dia** automaticamente
- ✅ Sincroniza na primeira vez que você abre a aba Funis
- ✅ Busca dados do mês atual

### Sincronização Manual
- 🔵 Clique no botão **"Sincronizar"** na aba Funis
- 🔄 Força uma nova busca dos dados do Google Sheets
- ⚡ Atualiza imediatamente, sem esperar 24h

## 📋 O que é Sincronizado

1. **Nome do Funil/Produto** (da planilha do Google Sheets)
2. **Valor médio de venda** (calculado automaticamente)
3. **Faturamento total** (soma das semanas)
4. **Total de vendas** (média das semanas)

## 🎯 Regras de Sincronização

### Funis Criados Automaticamente:
- ✅ Cada produto da planilha vira um funil
- ✅ Especialista: "Importado do Google Sheets"
- ✅ Descrição inclui o mês de sincronização

### Funis Totais/Gerais:
- 📊 Produtos com "geral" ou "total" no nome
- 🔒 Marcados como inativos (não aparecem em dropdowns)
- 💡 Servem apenas para visualização

### Prevenção de Duplicatas:
- ✅ Não cria funis duplicados
- ✅ Compara pelo nome do produto (case-insensitive)
- ✅ Mantém funis criados manualmente

## 🧹 Como Limpar Dados de Demonstração

Se você está vendo "Produto Demo 1" e "Produto Demo 2", siga estes passos:

### Opção 1: Limpar pelo Console do Navegador

1. Pressione `F12` (DevTools)
2. Vá na aba **Console**
3. Cole este código:

```javascript
localStorage.removeItem('monetizacao_funis');
localStorage.removeItem('monetizacao_last_sync');
console.log('✅ Dados de funis limpos! Recarregue a página.');
```

4. Pressione `Enter`
5. Recarregue a página (`Ctrl + R`)
6. Clique no botão **"Sincronizar"** na aba Funis

### Opção 2: Limpar pelo Application Storage

1. Pressione `F12` (DevTools)
2. Vá na aba **Application**
3. No menu lateral: **Storage** > **Local Storage** > selecione o domínio
4. Encontre e delete:
   - `monetizacao_funis`
   - `monetizacao_last_sync`
5. Recarregue a página
6. Clique no botão **"Sincronizar"**

### Opção 3: Forçar Sincronização

1. Vá na aba **Funis**
2. Clique no botão **"Sincronizar"**
3. Aguarde o ícone parar de girar
4. Os funis devem aparecer automaticamente

## 🐛 Troubleshooting

### Funis não aparecem após sincronizar

**Causa:** A planilha pode não ter dados para o mês atual.

**Solução:**
1. Verifique se a planilha tem uma aba com o nome do mês atual (ex: "Janeiro 2025")
2. Verifique se há produtos/funis cadastrados nessa aba
3. Verifique o console do navegador (`F12` > Console) para ver logs de erro

### Erro "Mês atual não encontrado"

**Causa:** A data de hoje não está dentro de nenhum intervalo de mês configurado.

**Solução:**
1. Verifique em `src/hooks/useDashboardData.ts` se o mês atual está na lista `MONTHS`
2. Adicione o mês se necessário

### Sincronização muito lenta

**Causa:** A planilha do Google Sheets pode estar grande.

**Solução:**
- A sincronização é feita 1x por dia para evitar lentidão
- Use o botão "Sincronizar" apenas quando necessário
- Os funis sincronizados ficam salvos localmente

## 📊 Faturamento Total nos Cards

O **Faturamento Total** mostrado em cada card de funil é a soma de:

1. **Dados do Google Sheets** (Aquisição)
   - Investimento
   - Faturamento da planilha

2. **Vendas Registradas** (Monetização)
   - Vendas criadas manualmente
   - Vinculadas ao funil específico

**Exemplo:**
```
Funil: "Mentoria Premium"
├─ Faturamento Sheets: R$ 10.000
├─ Vendas Registradas: R$ 5.000
└─ Faturamento Total: R$ 15.000
```

## 🔐 Dados Locais vs Supabase

- 💾 **LocalStorage:** Usado como fallback quando Supabase não está disponível
- ☁️ **Supabase:** Banco de dados principal (quando configurado)
- 🔄 **Sincronização:** Dados do Sheets vão para LocalStorage primeiro, depois podem ser migrados para Supabase

## 📝 Logs Importantes

Abra o Console (`F12` > Console) para ver:

```
🔄 Sincronizando funis do Google Sheets...
📅 Buscando dados de Janeiro 2025...
✅ 5 produtos encontrados no Google Sheets
✅ Criado funil: Mentoria Premium
✅ Criado funil: Consultoria Business
⏭️  Funil "Produto Demo 1" já existe
🎉 3 novos funis criados!
```

## 💡 Dicas

1. **Primeira vez usando:** Clique em "Sincronizar" para puxar os funis
2. **Dados errados:** Limpe o localStorage e sincronize novamente
3. **Performance:** A sincronização salva localmente para rapidez
4. **Backup:** Os funis criados manualmente nunca são deletados
