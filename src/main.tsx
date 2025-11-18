import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyBrandingColors } from "@/lib/branding-config";

// Apply branding colors on app initialization
applyBrandingColors();

// Register Service Worker - DESABILITADO TEMPORARIAMENTE
// Service Worker estava bloqueando requisições do Supabase
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ SW registered:', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('🔄 New version available!');

              // You can show a toast or notification here
              if (confirm('Nova versão disponível! Atualizar agora?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ SW registration failed:', error);
      });
  });
}
*/

createRoot(document.getElementById("root")!).render(<App />);
