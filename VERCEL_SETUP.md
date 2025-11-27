# Configuração da Vercel

## 🚀 Passos para Deploy

### 1. Configurar Variáveis de Ambiente

Acesse: **Vercel Dashboard > Seu Projeto > Settings > Environment Variables**

Adicione as seguintes variáveis:

```
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyAL1gbG-HhApXjzMez6-XRkapW3yk3bN1g
VITE_SUPABASE_PROJECT_ID=eunyqaesqqavdvehljkn
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1bnlxYWVzcXFhdmR2ZWhsamtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMTUzNDUsImV4cCI6MjA3ODU5MTM0NX0.n2hKWeATBFad4mgpLXU7s7qMotGWuTUPrQug2HUbgMI
VITE_SUPABASE_URL=https://eunyqaesqqavdvehljkn.supabase.co
```

**IMPORTANTE**: Marque todas como disponíveis para:
- ✅ Production
- ✅ Preview
- ✅ Development

### 2. Verificar Branch de Deploy

Acesse: **Vercel Dashboard > Seu Projeto > Settings > Git**

Verifique se o branch correto está configurado:
- Branch principal: `main` ou `master`
- Branch de desenvolvimento: `claude/continue-dashboard-redesign-01QxQun1N6M65z39jYsvWQNC`

### 3. Fazer Redeploy Manual

1. Vá para **Vercel Dashboard > Seu Projeto > Deployments**
2. Encontre o último deploy
3. Clique nos 3 pontinhos (...) e selecione **Redeploy**
4. Aguarde o build completar

### 4. Verificar Logs de Build

Se o deploy falhar:
1. Clique no deployment que falhou
2. Vá na aba **Build Logs**
3. Procure por erros em vermelho
4. Verifique se as variáveis de ambiente estão sendo detectadas

## 🔧 Troubleshooting

### Site não carrega / Tela branca
- Verifique se todas as variáveis de ambiente estão configuradas
- Certifique-se que as variáveis começam com `VITE_`
- Faça um redeploy após adicionar as variáveis

### Deploy bem-sucedido mas site não atualiza
- Limpe o cache do navegador (Ctrl + Shift + R)
- Tente acessar em aba anônima
- Espere alguns minutos para propagação do CDN

### Erro 404 nas rotas
- A configuração em `vercel.json` já está correta com rewrites
- Se ainda ocorrer, verifique se o arquivo foi incluído no deploy

## 📞 Próximos Passos

1. Configure as variáveis de ambiente na Vercel
2. Faça um redeploy manual
3. Aguarde 2-3 minutos
4. Teste o link de produção

Se o problema persistir, compartilhe os logs de build da Vercel.
