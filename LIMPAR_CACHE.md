# 🧹 Como Limpar Cache Completamente

Se as mudanças não aparecem após o deploy, siga estes passos:

## 1️⃣ Hard Refresh (Mais Rápido)

### Windows/Linux:
- Pressione `Ctrl + Shift + R`

### Mac:
- Pressione `Cmd + Shift + R`

## 2️⃣ Limpar Cache do Navegador

### Chrome/Edge:
1. Pressione `F12` para abrir DevTools
2. Clique com botão direito no ícone de **Recarregar** (ao lado da barra de endereço)
3. Selecione **"Esvaziar cache e atualizar forçadamente"**

## 3️⃣ Limpar Service Worker

1. Pressione `F12` (DevTools)
2. Vá na aba **Application**
3. No menu lateral: **Service Workers**
4. Clique em **"Unregister"** (se houver algum service worker)
5. Recarregue a página (`Ctrl + R`)

## 4️⃣ Limpar localStorage (Dados Locais)

1. Pressione `F12` (DevTools)
2. Vá na aba **Console**
3. Cole este código:

```javascript
localStorage.clear();
console.log('✅ LocalStorage completamente limpo! Recarregue a página.');
```

4. Pressione `Enter`
5. Recarregue a página (`Ctrl + R`)

## 5️⃣ Limpar TUDO (Opção Nuclear)

1. Pressione `F12` (DevTools)
2. Vá na aba **Application**
3. No menu lateral: **Storage**
4. Clique em **"Clear site data"**
5. Recarregue a página (`Ctrl + Shift + R`)

## 6️⃣ Verificar Deploy no Vercel

1. Acesse: https://vercel.com
2. Vá no seu projeto
3. Verifique se o último deploy foi concluído
4. Status deve estar: ✅ **Ready**

## 🔍 Como Confirmar se Atualizou

Após limpar o cache:

1. Abra o dashboard
2. Pressione `F12` → aba **Console**
3. Vá na aba **Funis**
4. Clique em um funil para abrir o modal
5. Procure no console por logs como:

```
📅 Buscando dados de aquisição do funil "IA Julia" (Janeiro 2025)...
✅ Dados de aquisição encontrados: {...}
```

6. Verifique se o **Faturamento Total** está correto (sem soma duplicada)

## ⚠️ Se ainda não funcionar

1. Tente em uma **aba anônima** (`Ctrl + Shift + N`)
2. Tente em outro **navegador**
3. Aguarde 2-3 minutos (pode ser deploy do Vercel)
