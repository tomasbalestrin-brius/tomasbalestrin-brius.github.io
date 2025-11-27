# 🔧 Guia para Limpar Cache e Service Worker

## Problema
Se você está vendo erros como:
- `Failed to fetch`
- `TypeError: Failed to fetch` em sw.js
- Site não carrega ou fica em loop de erros
- Supabase não conecta

## ✅ Solução Rápida

### Opção 1: Limpar pelo Navegador (RECOMENDADO)

#### Chrome/Edge:
1. Pressione `F12` para abrir o DevTools
2. Vá na aba **Application**
3. No menu lateral esquerdo, clique em **Service Workers**
4. Clique em **Unregister** em todos os service workers
5. Ainda na aba Application, clique em **Storage** (no menu lateral)
6. Clique no botão **Clear site data**
7. Feche o DevTools e pressione `Ctrl + Shift + R` (ou `Cmd + Shift + R` no Mac)

#### Firefox:
1. Pressione `F12` para abrir o DevTools
2. Vá na aba **Storage**
3. Clique com botão direito em **Service Workers**
4. Selecione **Unregister All**
5. Limpe o cache: Clique em **Cache Storage** > Botão direito > **Delete All**
6. Feche o DevTools e pressione `Ctrl + Shift + R`

### Opção 2: Via Console do Navegador

1. Pressione `F12`
2. Vá na aba **Console**
3. Cole este código e pressione Enter:

```javascript
// Limpar tudo
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});

caches.keys().then(cacheNames => {
  cacheNames.forEach(cacheName => caches.delete(cacheName));
});

console.log('✅ Limpeza completa! Recarregue a página.');
```

4. Pressione `Ctrl + Shift + R` para recarregar

### Opção 3: Modo Anônimo (Para Teste)

1. Abra uma aba anônima/privada
2. Acesse o site
3. Se funcionar, o problema é cache

## 🔄 Após Limpar o Cache

1. **Feche TODAS as abas** do site
2. **Reabra o site** em uma nova aba
3. O novo Service Worker será instalado automaticamente
4. Aguarde 5 segundos para carregamento completo

## ⚠️ Se o Problema Persistir

1. Verifique se você está **online** (internet conectada)
2. Teste em **outro navegador**
3. Verifique se o **Supabase está funcionando**: https://status.supabase.com
4. Limpe **cookies e dados do site**:
   - Chrome: `Ctrl + Shift + Delete` > Limpar dados de navegação

## 🐛 Debug Avançado

Se ainda não funcionar, cole este código no Console para debug:

```javascript
// Verificar status do Service Worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('📋 Service Workers:', registrations.length);
  registrations.forEach(reg => {
    console.log('  -', reg.active?.scriptURL || 'Nenhum ativo');
  });
});

// Verificar caches
caches.keys().then(cacheNames => {
  console.log('💾 Caches:', cacheNames);
});

// Testar conexão com Supabase
fetch('https://eunyqaesqqavdvehljkn.supabase.co')
  .then(() => console.log('✅ Supabase OK'))
  .catch(() => console.log('❌ Supabase OFFLINE'));
```

## 📱 Ajuda Adicional

Se nenhuma solução funcionar:
1. Compartilhe os erros do Console (F12 > Console)
2. Tire um print da aba Application > Service Workers
3. Informe qual navegador e versão está usando
