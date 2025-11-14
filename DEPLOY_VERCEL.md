# 🚀 DEPLOY NO VERCEL - GUIA PASSO A PASSO

## ✅ ARQUIVOS PREPARADOS

Acabei de criar/configurar:
- ✅ `vercel.json` - Configuração do Vercel
- ✅ `.env.example` - Template de variáveis
- ✅ `.gitignore` - Protege .env de ser enviado ao Git

---

## 📋 PASSO A PASSO

### **ETAPA 1: FAZER COMMIT DOS ARQUIVOS DE CONFIG**

No seu terminal (onde está rodando o projeto):

```bash
# Parar o servidor (Ctrl+C se estiver rodando)

# Adicionar arquivos novos
git add vercel.json .env.example .gitignore

# Fazer commit
git commit -m "Add Vercel configuration files"

# Push para GitHub
git push
```

---

### **ETAPA 2: CRIAR CONTA NA VERCEL**

1. **Acesse:** https://vercel.com/signup
2. **Clique:** "Continue with GitHub"
3. **Autorize** o Vercel a acessar seus repositórios
4. **Pronto!** Conta criada

---

### **ETAPA 3: FAZER DEPLOY PELA INTERFACE (MAIS FÁCIL)**

#### **Opção A: Deploy pelo Site (Recomendado)** ⭐

1. **Acesse:** https://vercel.com/new
2. **Importe seu repositório:**
   - Procure: `tomasbalestrin-brius.github.io`
   - Branch: `claude/implement-authentication-system-01Ve1wy2iKMLLPa5H21HQpx2`
   - Clique "Import"

3. **Configure o projeto:**
   - **Project Name:** `dashboard-bethel` (ou outro nome que quiser)
   - **Framework Preset:** Vite (deve detectar automaticamente)
   - **Root Directory:** `./` (deixar como está)
   - **Build Command:** `npm run build` (já configurado)
   - **Output Directory:** `dist` (já configurado)
   - **Install Command:** `npm install --legacy-peer-deps` (já configurado no vercel.json)

4. **Adicionar Variáveis de Ambiente:**

   Clique em **"Environment Variables"** e adicione:

   ```
   Nome: VITE_GOOGLE_SHEETS_API_KEY
   Valor: AIzaSyAL1gbG-HhApXjzMez6-XRkapW3yk3bN1g
   ```

   ```
   Nome: VITE_SUPABASE_URL
   Valor: https://eunyqaesqqavdvehljkn.supabase.co
   ```

   ```
   Nome: VITE_SUPABASE_PUBLISHABLE_KEY
   Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bnlxYWVzcXFhdmR2ZWhsamtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTUzNDUsImV4cCI6MjA3ODU5MTM0NX0.n2hKWeATBFad4mgpLXU7s7qMotGWuTUPrQug2HUbgMI
   ```

   ```
   Nome: VITE_SUPABASE_PROJECT_ID
   Valor: eunyqaesqqavdvehljkn
   ```

5. **Clique "Deploy"**

6. **Aguarde 2-3 minutos** 🕐

7. **PRONTO!** ✅ Vercel te dá a URL:
   ```
   https://dashboard-bethel.vercel.app
   ```

---

#### **Opção B: Deploy via CLI** (Se preferir terminal)

```bash
# 1. Instalar Vercel CLI globalmente
npm install -g vercel

# 2. Login (vai abrir navegador)
vercel login

# 3. Deploy
vercel --prod

# Siga as perguntas:
# - Set up and deploy? Y
# - Which scope? (sua conta)
# - Link to existing project? N
# - Project name? dashboard-bethel
# - In which directory? ./
# - Want to override settings? N

# 4. Aguarde o deploy...

# 5. URL será exibida no terminal!
```

**IMPORTANTE:** Depois de fazer deploy via CLI, você ainda precisa adicionar as variáveis de ambiente pelo dashboard da Vercel.

---

### **ETAPA 4: CONFIGURAR VARIÁVEIS NO DASHBOARD VERCEL**

Se usou CLI ou esqueceu de adicionar as variáveis:

1. **Acesse:** https://vercel.com/dashboard
2. **Clique** no seu projeto: `dashboard-bethel`
3. **Settings** → **Environment Variables**
4. **Adicione cada variável:**
   - `VITE_GOOGLE_SHEETS_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
5. **Clique "Save"**
6. **Redeploy:**
   - Aba "Deployments"
   - No último deployment, clique nos "..." → "Redeploy"

---

### **ETAPA 5: CONFIGURAR SUPABASE PARA PRODUÇÃO**

Seu dashboard agora tem uma URL pública! Precisamos atualizar o Supabase:

1. **Acesse:** https://supabase.com/dashboard
2. **Projeto:** `eunyqaesqqavdvehljkn`
3. **Authentication** → **URL Configuration**
4. **Adicione suas URLs:**

   **Site URL:**
   ```
   https://dashboard-bethel.vercel.app
   ```

   **Redirect URLs** (adicione ambas):
   ```
   https://dashboard-bethel.vercel.app
   https://dashboard-bethel.vercel.app/login
   https://dashboard-bethel.vercel.app/**
   ```

5. **Save**

---

### **ETAPA 6: TESTAR!** 🧪

1. **Abra a URL do Vercel** (te deram quando terminou deploy)
   - Exemplo: `https://dashboard-bethel.vercel.app`

2. **Teste:**
   - ✅ Dashboard carrega?
   - ✅ Consegue fazer login?
   - ✅ Consegue criar conta?
   - ✅ Dados do Google Sheets aparecem?

3. **Se algo não funcionar:**
   - Aperte F12 → Console → veja erros
   - Me manda o erro que eu resolvo!

---

## 🎉 RESULTADO FINAL

Depois do deploy, você terá:

✅ **URL pública permanente:** `https://dashboard-bethel.vercel.app`
✅ **HTTPS automático** (seguro)
✅ **CDN global** (rápido em qualquer lugar do mundo)
✅ **Deploy automático** (toda vez que fizer push no GitHub)
✅ **Grátis** (plano Hobby da Vercel)

**Qualquer pessoa** pode acessar de qualquer lugar do mundo! 🌍

---

## 🔄 DEPLOYS FUTUROS (AUTOMÁTICO)

Após o primeiro deploy, toda vez que você fizer:

```bash
git add .
git commit -m "sua mudança"
git push
```

O Vercel **automaticamente faz redeploy**! 🚀

---

## 💡 DICAS

### **Domínio Customizado**

Depois, você pode adicionar domínio próprio:
- `dashboard.bethel.com.br`
- Settings → Domains → Add Domain

### **Preview Deployments**

Vercel cria preview para cada branch/PR automaticamente!

### **Logs e Monitoring**

- Vercel Dashboard → seu projeto → Functions/Logs
- Veja erros e performance em tempo real

---

## ❓ PROBLEMAS COMUNS

### **Build falha com erro de dependências**
- Vercel já está configurado para usar `--legacy-peer-deps`
- Se continuar, adicione em Settings → General → Install Command

### **Variáveis de ambiente não funcionam**
- Verifique se começam com `VITE_` (obrigatório para Vite)
- Redeploy após adicionar variáveis

### **Erro 404 nas rotas**
- `vercel.json` já está configurado com rewrites
- Se persistir, verifique se o arquivo foi commitado

### **Auth não funciona**
- Verifique URLs no Supabase (deve ter a URL do Vercel)
- Teste fazer logout e login novamente

---

## 🎯 PRÓXIMOS PASSOS

Depois do deploy funcionando:

1. ✅ Compartilhar URL com equipe Bethel
2. ✅ Testar em diferentes dispositivos
3. ✅ Configurar domínio customizado (opcional)
4. ✅ Implementar auto-refresh no dashboard
5. ✅ Continuar com multi-tenancy

---

**Qualquer dúvida durante o deploy, me chame! 🚀**
