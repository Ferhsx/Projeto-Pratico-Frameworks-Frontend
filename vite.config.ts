import 'dotenv/config'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server:{
    proxy:{
      '/api': {
        target: process.env.API_URL,
        changeOrigin: true,
        //Rewrite the URL to render backend on render.com
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
