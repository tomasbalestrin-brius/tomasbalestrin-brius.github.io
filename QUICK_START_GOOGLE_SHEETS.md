# ⚡ GOOGLE SHEETS - INÍCIO RÁPIDO

## 🎯 3 PASSOS PARA CONECTAR

### **1️⃣ OBTER API KEY (5 min)**

1. Acesse: https://console.cloud.google.com/
2. Crie projeto: "Bethel Dashboard"
3. Ative: **Google Sheets API**
4. Crie: **Chave de API**
5. Copie a chave: `AIzaSyXXXXXXXXXXXXXX...`

### **2️⃣ OBTER ID DA PLANILHA (1 min)**

Abra sua planilha. A URL é assim:

```
https://docs.google.com/spreadsheets/d/ABC123XYZ/edit
                                      ↑
                              Copie este ID
```

**Importante:** Compartilhe a planilha como **"Qualquer pessoa com o link - Leitor"**

### **3️⃣ CONFIGURAR `.env` (1 min)**

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyXXXXXXXXXXXXXX
VITE_GOOGLE_SPREADSHEET_ID=ABC123XYZ
```

**Substitua** pelos seus valores!

---

## ✅ TESTAR

```bash
# Parar servidor (Ctrl+C)

# Rodar novamente
npm run dev
```

Abra `http://localhost:8080`

**Sucesso:** Toast verde "Dados carregados com sucesso!"

**Erro:** Veja [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) para diagnóstico

---

## 📊 ESTRUTURA DA PLANILHA

### **Abas Necessárias**

```
Dados de Out/25
Dados de Nov/25
Dados de Dez/25
Dados de Jan/26
```

### **Formato** (colunas A-R)

| A (Funil) | B (Período) | C (Investido) | ... | R (Lucro) |
|-----------|-------------|---------------|-----|-----------|
| 50 Scripts | Semana 1   | 5000          | ... | 3500      |
| 50 Scripts | Semana 2   | 6000          | ... | 4200      |
| 50 Scripts | Semana 3   | 5500          | ... | 3900      |
| 50 Scripts | Semana 4   | 6200          | ... | 4500      |
| 50 Scripts | Tendência  | 5675          | ... | 4025      |

**Cada produto = 5 linhas** (4 semanas + 1 tendência)

---

## 🔧 VERCEL (Deploy)

Adicione as variáveis no Vercel:

1. **Settings** → **Environment Variables**
2. Adicione:
   - `VITE_GOOGLE_SHEETS_API_KEY`
   - `VITE_GOOGLE_SPREADSHEET_ID`
3. **Redeploy**

---

## 🆘 PROBLEMAS?

**❌ "API Key não configurada"**
- Criou o arquivo `.env`?
- Reiniciou o servidor?

**❌ "Acesso negado" (403)**
- Planilha está pública?
- API Key correta?

**❌ "Aba não encontrada" (404)**
- Nome da aba está correto?
- Formato: `Dados de Out/25` (não `Outubro`)

---

**Guia completo:** [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)
