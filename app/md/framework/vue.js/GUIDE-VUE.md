# Guide Vue 3 + Vite : Router, ESLint, Prettier (TS et JS)

> Testé le 26/11/2026 sous Linux avec Node 22.23 / npm 10.9.
> Versions générées : `create-vue` 3.24.0, `vue` 3.5.x, `vue-router` 5.x, `vite` 8.x, `eslint` 10.x, `prettier` 3.x.
> Chaque snippet existe en **TS** et en **JS**. Les blocs sans mention valent pour les deux.

---

## 0. Prérequis

```bash
node -v   # create-vue impose: ^22.18.0 || >=24.12.0
npm -v
```

Mise à jour de Node via `nvm` si nécessaire :

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.bashrc
nvm install --lts && nvm use --lts
```

---

## 1. Méthode A : via le scaffolder (recommandée)

### Création

**TS**
```bash
npm create vue@latest mon-app -- --ts --router --eslint --prettier
```

**JS**
```bash
npm create vue@latest mon-app -- --router --eslint --prettier
```

```bash
cd mon-app
npm install
npm run dev        # http://localhost:5173
```

> ⚠️ `--default` génère un projet **TypeScript**. Pour du JS, ne passe pas `--ts` et ne passe pas `--default`.
> Sans aucun flag, l'assistant est interactif.

Flags utiles (`npm create vue@latest -- --help`) : `--ts`, `--router`, `--pinia`, `--vitest`, `--eslint`, `--prettier`, `--bare` (sans code d'exemple), `--force`.

### Scripts générés (`package.json`)

| Script | TS | JS |
|---|---|---|
| `npm run dev` | `vite` | `vite` |
| `npm run build` | type-check (`vue-tsc`) + `vite build` | `vite build` |
| `npm run preview` | sert `dist/` | idem |
| `npm run lint` | `oxlint --fix` puis `eslint --fix --cache` | idem |
| `npm run format` | `prettier --write src/` | idem |

> Avec `--eslint`, create-vue ajoute **toujours** Oxlint (un linter rapide, en Rust) en plus d'ESLint. Pour le retirer, voir §1.4.

### Arborescence générée : fichiers à modifier

```
mon-app/
├─ index.html              # <title>, meta, point d'entrée (/src/main.ts|js)
├─ vite.config.ts|js       # plugins, alias @, port, proxy, base
├─ eslint.config.ts|js     # règles ESLint (flat config)
├─ .oxlintrc.json          # règles Oxlint
├─ .prettierrc.json        # style Prettier
├─ .editorconfig           # indentation, fins de ligne
├─ tsconfig.app.json       # (TS) options TS du code src/, alias
├─ tsconfig.node.json      # (TS) options TS des fichiers de config
├─ jsconfig.json           # (JS) alias @ pour l'IDE
├─ env.d.ts                # (TS) types Vite / .vue
├─ .vscode/                # extensions et settings recommandés
└─ src/
   ├─ main.ts|js           # createApp, plugins (router…), CSS globaux
   ├─ App.vue              # layout racine + <RouterView />
   ├─ router/index.ts|js   # routes
   ├─ views/               # pages (une par route)
   ├─ components/          # composants réutilisables
   └─ assets/              # CSS, images importées
```

### Retirer Oxlint (facultatif)

```bash
npm uninstall oxlint eslint-plugin-oxlint
rm .oxlintrc.json
```
Dans `eslint.config.*`, supprime :
```js
import pluginOxlint from 'eslint-plugin-oxlint'
// ...
...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
```
Dans `package.json` :
```json
"lint": "eslint . --fix --cache"
```

---

## 2. Méthode B : installation manuelle (sur un projet existant)

Point de départ : un projet créé sans ces options.

```bash
# TS sans extras
npm create vue@latest mon-app -- --ts
# JS sans extras : mode interactif (répondre Non partout)
npm create vue@latest mon-app
cd mon-app && npm install
```

### 2.1 Vue Router

```bash
npm i vue-router
```

**`src/router/index.ts`** (TS)
```ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') }, // lazy
  { path: '/users/:id', name: 'user', component: () => import('@/views/UserView.vue'), props: true },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
```

**`src/router/index.js`** (JS)
```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
  { path: '/users/:id', name: 'user', component: () => import('@/views/UserView.vue'), props: true },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
```

**`src/main.ts|js`**
```js
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

**`src/App.vue`**
```vue
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink :to="{ name: 'about' }">About</RouterLink>
  </nav>
  <RouterView />
</template>
```
> En TS : `<script setup lang="ts">`.

**Navigation par le code + paramètres**

TS
```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const id = route.params.id as string
const goHome = () => router.push({ name: 'home' })
</script>
```
JS
```vue
<script setup>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const id = route.params.id
const goHome = () => router.push({ name: 'home' })
</script>
```

**Guard global** (dans `router/index.*`, avant `export`)
```js
router.beforeEach((to) => {
  const isLogged = !!localStorage.getItem('token')
  if (to.meta.requiresAuth && !isLogged) return { name: 'home' }
})
// route protégée : { path: '/admin', component: ..., meta: { requiresAuth: true } }
```

TS : typer `meta` dans un fichier **séparé**, `src/types/router.d.ts`. Pas dans `env.d.ts` : l'`import` en ferait un module, et le typage `ImportMetaEnv` du §3 ne serait plus global.
```ts
import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta { requiresAuth?: boolean }
}
```

**Mode hash** (hébergement statique sans réécriture d'URL) : remplace `createWebHistory` par `createWebHashHistory`.

> En mode history, le serveur de prod doit renvoyer `index.html` pour toutes les routes (nginx : `try_files $uri $uri/ /index.html;`).

### 2.2 ESLint + Prettier

**TS**
```bash
npm i -D eslint eslint-plugin-vue @vue/eslint-config-typescript prettier eslint-config-prettier
```

**JS**
```bash
npm i -D eslint @eslint/js eslint-plugin-vue globals prettier eslint-config-prettier
```

**`eslint.config.js`** (TS ; le `.js` fonctionne, pour un `eslint.config.ts` il faut `npm i -D jiti`)
```js
import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfigWithVueTs(
  { name: 'app/files-to-lint', files: ['**/*.{vue,ts,mts,tsx}'] },
  globalIgnores(['**/dist/**', '**/coverage/**']),
  ...pluginVue.configs['flat/essential'],   // ou 'flat/strongly-recommended' / 'flat/recommended'
  vueTsConfigs.recommended,                  // ou vueTsConfigs.strict
  {
    rules: {
      // tes règles ici
      'vue/multi-word-component-names': 'off',
    },
  },
  skipFormatting, // toujours en dernier : coupe les règles qui gênent Prettier
)
```

**`eslint.config.js`** (JS)
```js
import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfig([
  { name: 'app/files-to-lint', files: ['**/*.{vue,js,mjs,jsx}'] },
  globalIgnores(['**/dist/**', '**/coverage/**']),
  { languageOptions: { globals: { ...globals.browser } } },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  skipFormatting,
])
```

**`.prettierrc.json`** (identique à ce que génère create-vue)
```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "singleQuote": true,
  "printWidth": 100
}
```

**`.prettierignore`**
```
dist
coverage
```

**Scripts `package.json`**
```json
"scripts": {
  "lint": "eslint . --fix --cache",
  "format": "prettier --write src/",
  "format:check": "prettier --check src/"
}
```

**VS Code** (`.vscode/settings.json`) : extensions `Vue.volar`, `dbaeumer.vscode-eslint`, `esbenp.prettier-vscode`
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }
}
```

---

## 3. Configs fréquentes

### `vite.config.ts|js`
```js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools' // retirable

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  base: '/',                 // '/sous-dossier/' si déployé dans un sous-chemin
  server: {
    port: 5173,
    host: true,              // accessible depuis le réseau local
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
  build: { outDir: 'dist', sourcemap: false },
})
```

### Ajouter un alias (ex. `@components`)
1. `vite.config.*` → `resolve.alias` :
   ```js
   '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
   ```
2. TS : `tsconfig.app.json` → `compilerOptions.paths` ; JS : `jsconfig.json` → `compilerOptions.paths`
   ```json
   "@components/*": ["./src/components/*"]
   ```

### Variables d'environnement
Fichiers à la racine : `.env`, `.env.development`, `.env.production`. Seules les variables préfixées `VITE_` sont exposées au client.
```
VITE_API_URL=http://localhost:3000
```
```js
const api = import.meta.env.VITE_API_URL
```
TS : typer dans `env.d.ts`
```ts
/// <reference types="vite/client" />
interface ImportMetaEnv { readonly VITE_API_URL: string }
interface ImportMeta { readonly env: ImportMetaEnv }
```

### Composant type

TS
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ title: string; count?: number }>()
const emit = defineEmits<{ (e: 'increment', value: number): void }>()

const local = ref(props.count ?? 0)
const double = computed(() => local.value * 2)
function inc() { local.value++; emit('increment', local.value) }
</script>

<template>
  <h2>{{ title }}</h2>
  <button @click="inc">{{ local }} ({{ double }})</button>
</template>

<style scoped>
h2 { margin: 0; }
</style>
```

JS
```vue
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
})
const emit = defineEmits(['increment'])

const local = ref(props.count)
const double = computed(() => local.value * 2)
function inc() { local.value++; emit('increment', local.value) }
</script>

<template>
  <h2>{{ title }}</h2>
  <button @click="inc">{{ local }} ({{ double }})</button>
</template>
```

---

## 4. Commandes de référence

```bash
npm run dev                 # serveur dev
npm run dev -- --host       # exposé sur le LAN
npm run build               # build prod -> dist/
npm run preview             # sert dist/ en local
npm run lint                # lint + autofix
npm run format              # formatage Prettier
npx eslint src/ --fix       # lint ciblé
npx prettier --check .      # vérifier sans écrire
npm outdated                # deps à jour ?
npx npm-check-updates -u && npm i   # tout mettre à jour (major incluses)
```

## 5. Problèmes fréquents

| Symptôme | Cause / correctif |
|---|---|
| `Unsupported engine` à l'install | Node trop ancien → `nvm install --lts` |
| `Parsing error` dans un `.vue` (JS) | composant avec `lang="ts"` dans un projet JS → retirer `lang="ts"` ou passer en config TS |
| ESLint ne lit pas `eslint.config.ts` | `npm i -D jiti` ou renommer en `.js` |
| 404 en prod sur refresh d'une route | serveur sans fallback `index.html` → config serveur ou `createWebHashHistory` |
| Prettier et ESLint se contredisent | `skipFormatting` doit être le **dernier** élément de la config |
| `import.meta.env.X` undefined | variable non préfixée `VITE_` ou serveur non relancé |
