import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const MD = fileURLToPath(new URL('../app/md', import.meta.url))

/** Types des fichiers non texte servis depuis app/md */
const TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

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
      // Comme GitHub Pages : le bon type selon l'extension (sinon un PDF s'afficherait en texte)
      res.setHeader('Content-Type', TYPES[extname(fichier).toLowerCase()] ?? 'text/plain; charset=utf-8')
      res.end(readFileSync(fichier))
    })
  },
})

/**
 * Au build : écrit sw.js à la racine du dépôt (portée = tout le site, PDF des iframes compris),
 * depuis le modèle ./sw.js, avec la liste des fichiers de l'application à mettre en cache.
 * La version change avec la liste : chaque déploiement installe un nouveau service worker.
 */
const serviceWorker = (): Plugin => ({
  name: 'service-worker',
  apply: 'build',
  writeBundle(_options, bundle) {
    // Chemins relatifs à la racine du dépôt (outDir = app/html)
    const fichiers = [
      './',
      'index.html',
      'app/html/',
      'app/html/favicon.svg',
      ...Object.keys(bundle).map((f) => `app/html/${f}`),
    ]
    const version = createHash('sha1').update(fichiers.join()).digest('hex').slice(0, 10)
    const modele = readFileSync(fileURLToPath(new URL('./sw.js', import.meta.url)), 'utf8')
    writeFileSync(
      fileURLToPath(new URL('../sw.js', import.meta.url)),
      modele.replace('__VERSION__', version).replace('__FICHIERS__', JSON.stringify(fichiers)),
    )
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), mdLocal(), serviceWorker()],
  // Chemins relatifs : le site marche quel que soit le nom du dépôt GitHub
  base: './',
  build: {
    outDir: '../app/html',
    emptyOutDir: true,
    rolldownOptions: {
      treeshake: {
        // @ionic/core ne déclare pas « sideEffects » : sans ça, tous ses composants sont embarqués
        // (datetime, select, input…), même inutilisés. 298 Ko → 132 Ko compressés.
        moduleSideEffects: (id) => !/@ionic\/core\/components\//.test(id),
      },
    },
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
