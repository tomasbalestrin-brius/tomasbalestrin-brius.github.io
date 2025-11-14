# 📊 CONFIGURAÇÃO DO GOOGLE SHEETS - GUIA COMPLETO

## ✅ O DASHBOARD JÁ ESTÁ CONECTADO!

O sistema **já possui integração com Google Sheets** funcionando! Você só precisa configurar as credenciais.

---

## 🎯 RESUMO RÁPIDO

1. **Obter API Key** do Google Cloud Console (5 min)
2. **ID da Planilha** do Google Sheets (1 min)
3. **Configurar variáveis** no `.env` (1 min)
4. **Testar** o dashboard (2 min)

**Tempo total:** ~10 minutos

---

## 📋 PASSO 1: OBTER GOOGLE SHEETS API KEY

### **1.1 - Acessar Google Cloud Console**

1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Se não tiver projeto, clique em **"Criar Projeto"**
   - Nome: `Bethel Dashboard` (ou qualquer nome)
   - Clique em **"Criar"**

### **1.2 - Ativar Google Sheets API**

1. No menu lateral, vá em: **APIs e Serviços** → **Biblioteca**
2. Busque: `Google Sheets API`
3. Clique no resultado **"Google Sheets API"**
4. Clique em **"Ativar"** (Enable)
5. Aguarde alguns segundos até ativar

### **1.3 - Criar API Key**

1. No menu lateral, vá em: **APIs e Serviços** → **Credenciais**
2. Clique em **"+ Criar Credenciais"** (no topo)
3. Selecione: **"Chave de API"** (API Key)
4. Uma chave será gerada. **Copie** ela!
   - Formato: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
5. Clique em **"Restringir chave"** (recomendado)

### **1.4 - Restringir API Key (Segurança)** ⚠️ IMPORTANTE

1. Em **"Restrições de aplicativo"**:
   - Selecione: **"Referenciadores HTTP (sites)"**
   - Adicione:
     ```
     http://localhost:8080/*
     https://tomasbalestrin-brius-github-*.vercel.app/*
     https://seu-dominio-customizado.com/*
     ```

2. Em **"Restrições de API"**:
   - Selecione: **"Restringir chave"**
   - Marque apenas: ✅ **Google Sheets API**

3. Clique em **"Salvar"**

**Pronto! API Key criada e segura** 🔐

---

## 📋 PASSO 2: OBTER ID DA PLANILHA

### **2.1 - Encontrar o ID**

Abra sua planilha do Google Sheets. A URL terá este formato:

```
https://docs.google.com/spreadsheets/d/1XsdWQNR7FUo4TrrhsMjSGESS3PtS9G7X8FoHHStxLtU/edit#gid=0
                                      ↑
                            ESTE É O SPREADSHEET_ID
```

**Copie** a parte entre `/d/` e `/edit`

**Exemplo:**
- URL completa: `https://docs.google.com/spreadsheets/d/ABC123XYZ/edit`
- ID da planilha: `ABC123XYZ`

### **2.2 - Tornar Planilha Pública** ⚠️

**IMPORTANTE:** A planilha precisa ser pública (somente leitura) para a API funcionar.

1. Abra a planilha
2. Clique em **"Compartilhar"** (canto superior direito)
3. Em **"Acesso geral"**, selecione:
   - ✅ **"Qualquer pessoa com o link"**
   - Permissão: **"Leitor"** (Viewer)
4. Clique em **"Concluído"**

**Alternativa (mais seguro):**
- Use Service Account (configuração avançada)
- Tutorial: https://developers.google.com/sheets/api/guides/authorizing

---

## 📋 PASSO 3: CONFIGURAR VARIÁVEIS DE AMBIENTE

### **3.1 - Criar arquivo `.env`**

Na raiz do projeto, crie o arquivo `.env`:

```bash
# No diretório do projeto
touch .env
```

### **3.2 - Adicionar variáveis**

Abra o arquivo `.env` e adicione:

```env
# Google Sheets API
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_GOOGLE_SPREADSHEET_ID=1XsdWQNR7FUo4TrrhsMjSGESS3PtS9G7X8FoHHStxLtU

# Supabase (já configurado)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
VITE_SUPABASE_PROJECT_ID=your-project-id
```

**Substitua:**
- `AIzaSy...` → Sua API Key do Google Cloud Console
- `1XsdWQN...` → ID da sua planilha

### **3.3 - Verificar `.gitignore`**

Certifique-se que `.env` está no `.gitignore` (já deve estar):

```gitignore
# Environment variables
.env
.env.local
.env.production
```

✅ **NUNCA** commite o arquivo `.env` com suas chaves!

---

## 📋 PASSO 4: ESTRUTURA DA PLANILHA

### **4.1 - Abas Necessárias**

O dashboard busca dados nas seguintes abas:

```
📄 Dados de Out/25
📄 Dados de Nov/25
📄 Dados de Dez/25
📄 Dados de Jan/26
```

**Você pode adicionar mais meses:**
- Edite `src/hooks/useDashboardData.ts`
- Adicione novos meses no array `MONTHS`

### **4.2 - Estrutura de Cada Aba**

Formato esperado (colunas A a R):

| A (Funil) | B (Período) | C (Investido) | D (Fat. Tráfego) | ... | R (Lucro Funil) |
|-----------|-------------|---------------|------------------|-----|-----------------|
| 50 Scripts | Semana 1   | 5000          | 12000            | ... | 3500            |
| 50 Scripts | Semana 2   | 6000          | 15000            | ... | 4200            |
| 50 Scripts | Semana 3   | 5500          | 14000            | ... | 3900            |
| 50 Scripts | Semana 4   | 6200          | 16000            | ... | 4500            |
| 50 Scripts | Tendência  | 5675          | 14250            | ... | 4025            |
| Couply     | Semana 1   | 3000          | 8000             | ... | 2100            |
| ...        | ...        | ...           | ...              | ... | ...             |

**Regras:**
- ✅ Primeira linha: Header (títulos das colunas)
- ✅ Cada produto tem 5 linhas (4 semanas + 1 tendência)
- ✅ Coluna A: Nome do funil/produto
- ✅ Coluna B: "Semana 1", "Semana 2", ..., "Tendência"

### **4.3 - Colunas Mapeadas**

O parser lê as seguintes colunas:

```
C  - Investido
D  - Faturamento Tráfego
E  - ROAS Tráfego
F  - Alunos
G  - Qualificados
H  - Agendados
I  - Taxa Agendamento (%)
J  - Call Realizada
K  - Taxa Comparecimento (%)
L  - Número Venda
M  - Taxa Conversão (%)
N  - Taxa Ascensão (%)
O  - Venda Monetização
P  - Entradas
Q  - Faturamento Funil
R  - Lucro Funil
```

**Valores aceitos:**
- ✅ Números: `5000`, `5.000`, `5000,50`
- ✅ Moeda: `R$ 5.000,00`
- ✅ Porcentagem: `15%`, `15`, `0.15`
- ✅ Vazios: Serão convertidos para `0`
- ✅ Erros: `#N/A`, `#DIV/0!` → Convertidos para `0`

---

## 📋 PASSO 5: CONFIGURAR VERCEL (Deploy)

### **5.1 - Adicionar Variáveis no Vercel**

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione:

| Nome | Valor |
|------|-------|
| `VITE_GOOGLE_SHEETS_API_KEY` | `AIzaSyXXXXXXXXX...` |
| `VITE_GOOGLE_SPREADSHEET_ID` | `1XsdWQNR7FUo4T...` |

5. Clique em **"Save"**
6. Faça um novo **Deploy** (ou aguarde o próximo commit)

### **5.2 - Atualizar Restrições da API Key**

Volte ao Google Cloud Console e adicione o domínio da Vercel:

```
https://tomasbalestrin-brius-github-*.vercel.app/*
```

---

## 📋 PASSO 6: TESTAR

### **6.1 - Local**

```bash
# Pare o servidor se estiver rodando (Ctrl+C)

# Rode novamente
npm run dev
```

Abra `http://localhost:8080`

**Você verá:**
- ✅ Dados carregados da planilha
- ✅ Cache de 5 minutos
- ✅ Auto-refresh a cada 5 minutos
- ✅ Toast: "Dados carregados com sucesso!"

### **6.2 - Console do Navegador**

Abra DevTools (F12) e veja os logs:

```
🔄 Buscando dados DIRETAMENTE da Google Sheets API
📅 Mês: Outubro
📋 Aba: Dados de Out/25
✅ Dados recebidos: 200 linhas
📦 Processando produto: 50 Scripts (linha 2)
  📅 Semana 1 (linha 2)
  📅 Semana 2 (linha 3)
  📈 Tendência encontrada (linha 6)
✅ 50 Scripts: 4 semanas processadas
✅ Total de produtos processados: 10
```

### **6.3 - Erros Comuns**

**❌ "API Key não configurada"**
- Solução: Verifique se `VITE_GOOGLE_SHEETS_API_KEY` está no `.env`
- Reinicie o servidor: `Ctrl+C` → `npm run dev`

**❌ "Acesso negado" (403)**
- Solução: Planilha não está pública OU API Key não está configurada corretamente
- Torne a planilha pública (Passo 2.2)

**❌ "Aba não encontrada" (404)**
- Solução: Nome da aba está errado
- Verifique `src/hooks/useDashboardData.ts` → `SHEET_NAMES`

**❌ Dados vazios**
- Solução: Planilha está vazia ou formatação incorreta
- Siga a estrutura do Passo 4.2

---

## 🔄 CACHE E AUTO-REFRESH

### **Cache Local**

O dashboard salva os dados por **5 minutos** no LocalStorage:

- ✅ Primeiro acesso: Busca do Google Sheets
- ✅ Próximos 5 minutos: Usa cache local (rápido!)
- ✅ Após 5 minutos: Busca novamente

**Limpar cache:**
```javascript
// No console do navegador (F12)
localStorage.clear();
location.reload();
```

### **Auto-Refresh**

O dashboard atualiza automaticamente a cada **5 minutos**:

- ⏰ Contador regressivo no canto superior direito
- 🔄 Botão "Atualizar" para forçar refresh manual
- ✅ Toast: "Dados atualizados!"

---

## 📚 ARQUIVOS IMPORTANTES

```
📁 projeto/
├── 📄 .env                              ← Suas credenciais (NÃO commitar!)
├── 📄 .env.example                      ← Template
├── 📄 GOOGLE_SHEETS_SETUP.md           ← Este guia
├── 📁 src/
│   ├── 📁 lib/
│   │   ├── 📄 sheets-api.ts            ← Integração Google Sheets
│   │   ├── 📄 googleSheets.ts          ← Service alternativo
│   │   └── 📄 sheetsParser.ts          ← Parser de dados
│   ├── 📁 hooks/
│   │   └── 📄 useDashboardData.ts      ← Hook principal
│   └── 📁 services/
│       └── 📄 googleSheets.ts          ← Serviço Google Sheets
```

---

## 🔐 SEGURANÇA

### **✅ Boas Práticas**

1. ✅ **Nunca** commite `.env` com API Keys
2. ✅ Restrinja a API Key a domínios específicos
3. ✅ Use planilha pública apenas com permissão de "Leitor"
4. ✅ Rotacione a API Key periodicamente

### **⚠️ O que NÃO fazer**

1. ❌ Não coloque API Key direto no código
2. ❌ Não use API Key em repositórios públicos
3. ❌ Não dê permissão de "Editor" na planilha pública
4. ❌ Não compartilhe o arquivo `.env`

---

## 🆘 SUPORTE

**Problemas?**

1. Verifique os logs no console (F12)
2. Confira se todas as variáveis `.env` estão corretas
3. Teste se a planilha está pública
4. Verifique se a API está ativada no Google Cloud Console

**Links Úteis:**
- Google Cloud Console: https://console.cloud.google.com/
- Google Sheets API Docs: https://developers.google.com/sheets/api
- Vercel Docs: https://vercel.com/docs/environment-variables

---

**Configuração completa! 🚀**

Agora seu dashboard está conectado ao Google Sheets e atualiza automaticamente!
