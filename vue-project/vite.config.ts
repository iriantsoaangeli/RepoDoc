import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const MD = fileURLToPath(new URL('../app/md', import.meta.url))

/** Tous les fichiers d'un dossier, en chemins relatifs avec des / */
const lister = (dossier: string): string[] =>
  readdirSync(dossier).flatMap((nom) => {
    const chemin = join(dossier, nom)
    return statSync(chemin).isDirectory()
      ? lister(chemin)
      : [relative(MD, chemin).split(sep).join('/')]
  })

/**
 * En dev seulement : remplace l'API GitHub par le disque.
 *   GET /__arbre → liste des fichiers de app/md (même format que MarkdownReader.lireArbre)
 *   GET /md/...  → sert les fichiers de app/md (le site les demande en ../md/)
 */
const mdLocal = (): Plugin => ({
  name: 'md-local',
  configureServer(server) {
    server.middlewares.use('/__arbre', (_req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(existsSync(MD) ? lister(MD) : []))
    })
    server.middlewares.use('/md', (req, res) => {
      const fichier = resolve(MD, '.' + decodeURIComponent((req.url ?? '').split('?')[0]!))
      if (!fichier.startsWith(MD + sep) || !existsSync(fichier) || statSync(fichier).isDirectory()) {
        res.statusCode = 404
        return res.end()
      }
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.end(readFileSync(fichier))
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), mdLocal()],
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
