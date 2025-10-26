import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig((configEnv) => {
  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 3000
    },
    resolve: {
      alias: {
        '@app': path.resolve(__dirname, 'src')
      }
    },
    build: {
      sourcemap: configEnv.mode === 'development'
    }
  };
});
