// @ts-expect-error (TS is configured with "moduleResolution": "bundler", yet still somehow the types are not picked up)
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': resolve(process.cwd(), './src'),
    },
  },

  esbuild: {
    jsx: 'automatic',
  },

  server: {
    port: 3000,
    proxy: {
      '/graphql': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
