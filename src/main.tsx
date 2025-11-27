import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // First, unregister all existing service workers to force fresh install
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      const oldVersion = registrations.some(reg =>
        reg.active?.scriptURL.includes('sw.js')
      );

      if (oldVersion) {
        console.log('🔄 Cleaning old service workers...');
        Promise.all(registrations.map(reg => reg.unregister()))
          .then(() => {
            console.log('✅ Old service workers removed');
            // Clear all caches
            return caches.keys().then(cacheNames => {
              return Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
              );
            });
          })
          .then(() => {
            console.log('✅ All caches cleared');
            // Register new service worker
            return registerServiceWorker();
          });
      } else {
        registerServiceWorker();
      }
    });
  });
}

function registerServiceWorker() {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('✅ SW registered:', registration);

      // Force immediate activation
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      // Check for updates every 60 seconds
      setInterval(() => {
        registration.update();
      }, 60000);

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔄 New version available!');
            // Auto-reload after 2 seconds
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        });
      });
    })
    .catch((error) => {
      console.error('❌ SW registration failed:', error);
    });
}

createRoot(document.getElementById("root")!).render(<App />);
