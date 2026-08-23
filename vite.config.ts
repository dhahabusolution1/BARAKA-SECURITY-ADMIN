import path from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function firebaseMessagingSw(env: Record<string, string>): Plugin {
  const source = () => `importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: ${JSON.stringify(env.VITE_FIREBASE_API_KEY ?? '')},
  authDomain: ${JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN ?? '')},
  projectId: ${JSON.stringify(env.VITE_FIREBASE_PROJECT_ID ?? '')},
  storageBucket: ${JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET ?? '')},
  messagingSenderId: ${JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '')},
  appId: ${JSON.stringify(env.VITE_FIREBASE_APP_ID ?? '')}
});
firebase.messaging();
`;

  return {
    name: 'firebase-messaging-sw',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== '/firebase-messaging-sw.js') {
          next();
          return;
        }
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Service-Worker-Allowed', '/');
        res.end(source());
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'firebase-messaging-sw.js',
        source: source(),
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), firebaseMessagingSw(env)],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/graphql': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          ws: true,
        },
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  };
});
