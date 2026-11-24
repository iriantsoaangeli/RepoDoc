import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  // Chemins relatifs : le site marche quel que soit le nom du dépôt GitHub
  base: './',
  build: {
    outDir: '../app/html',
    emptyOutDir: true,
  },
  server: {
    // Autorise l'import de ../template/style.css
    fs: { allow: ['..'] },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
