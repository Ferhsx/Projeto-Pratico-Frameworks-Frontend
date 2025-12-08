import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import * as Terser from 'terser';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  // Configuração de HTTPS para desenvolvimento
  const httpsConfig = mode === 'development' ? {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../Projeto-Pratico-Banco-de-Dados-Backend/certs/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../Projeto-Pratico-Banco-de-Dados-Backend/certs/cert.pem'))
    }
  } : {};

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      ...httpsConfig,
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: process.env.API_URL || 'https://localhost:8000',
          changeOrigin: true,
          secure: false, // Aceita certificados autoassinados
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    // Configurações de build para produção
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'terser' : false,
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        },
        format: {
          comments: false
        }
      } as Terser.MinifyOptions
    },
    // Configurações de otimização
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'axios']
    }
  };
});