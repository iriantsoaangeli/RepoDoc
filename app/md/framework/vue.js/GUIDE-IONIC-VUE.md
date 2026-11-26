# Guide Ionic Vue : templates, Router, ESLint, Prettier, PWA, Android (TS et JS)

> Testé le 26/11/2026 sous Linux avec Node 22.23 / npm 10.9.
> Versions : `@ionic/cli` 7.2.1, `@ionic/vue` + `@ionic/vue-router` 9.0.x, `vue` 3.5, `vue-router` 5, `vite` 8,
> Capacitor 8.6.x (Gradle 8.14.3, AGP 8.13.0, compile/targetSdk 36, minSdk 24), `vite-plugin-pwa` 2.0.
> Snippets en **TS** et en **JS**. Les blocs sans mention valent pour les deux.

---

## 0. Prérequis

```bash
node -v                    # Capacitor 8 exige Node >= 22
npm i -g @ionic/cli        # CLI Ionic
ionic --version
```
Si `npm i -g` demande sudo, configure un préfixe utilisateur :
```bash
mkdir -p ~/.npm-global && npm config set prefix ~/.npm-global
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc
```

---

## 1. Créer le projet (méthode scaffolder)

```bash
ionic start mon-app blank    --type=vue --capacitor
ionic start mon-app tabs     --type=vue --capacitor
ionic start mon-app sidemenu --type=vue --capacitor
# options : --no-git  --no-deps  --package-id=com.societe.monapp  --list (liste des templates)
cd mon-app
ionic serve            # dev server (port 8100 par défaut), ou: npm run dev (Vite, 5173)
```

`--capacitor` installe `@capacitor/core`, `@capacitor/cli` (dev), plus les plugins `@capacitor/app`, `@capacitor/haptics`, `@capacitor/keyboard` et `@capacitor/status-bar`, puis crée `capacitor.config.ts`.

> Le starter officiel est **en TypeScript uniquement**. Il inclut déjà ESLint, Prettier, Vitest et Playwright. Pour la version JS, voir §7.

### Différences entre les 3 templates

| | `blank` | `tabs` | `sidemenu` |
|---|---|---|---|
| Navigation | aucune (une page) | barre d'onglets en bas (`ion-tabs`) | menu latéral (`ion-menu`) + `ion-split-pane` (menu fixe sur grand écran) |
| `App.vue` | `ion-app` > `ion-router-outlet` | identique à blank | contient le menu, la liste des pages (`appPages`) et l'outlet `#main-content` |
| Pages | `views/HomePage.vue` | `views/TabsPage.vue` (conteneur) + `Tab1Page`/`Tab2Page`/`Tab3Page` + `components/ExploreContainer.vue` | `views/FolderPage.vue` (une page dynamique `/folder/:id`) |
| Routes | `/` → `/home` | `/` → `/tabs/tab1`, routes **enfants** de `/tabs/` | `/` → `/folder/Inbox`, route paramétrée `/folder/:id` |
| Pour | appli simple, ou ta propre navigation | 3 à 5 sections principales | beaucoup de sections, tablette/desktop |

---

## 2. Arborescence : fichiers à modifier

```
mon-app/
├─ index.html               # <title>, meta viewport/theme-color
├─ ionic.config.json        # nom, type "vue-vite", intégrations (lu par la CLI ionic)
├─ capacitor.config.ts      # appId, appName, webDir ("dist"), plugins natifs, server
├─ vite.config.ts           # plugins (vue, legacy, PWA), alias @, test (vitest)
├─ eslint.config.js         # ESLint flat config
├─ .prettierignore          # android/, ios/
├─ package.json             # scripts + "prettier": "@ionic/prettier-config"
├─ tsconfig.json            # options TS + alias @
├─ .browserslistrc          # navigateurs ciblés (plugin legacy)
├─ src/
│  ├─ main.ts               # IonicVue, CSS Ionic, dark mode, router.isReady()
│  ├─ App.vue               # <ion-app> + <ion-router-outlet>
│  ├─ router/index.ts       # routes (createRouter de @ionic/vue-router)
│  ├─ views/                # pages : chacune DOIT avoir <ion-page> en racine
│  ├─ components/
│  └─ theme/variables.css   # couleurs --ion-color-*, thème
├─ public/                  # favicon, icônes PWA
└─ android/                 # projet natif (après `cap add android`)
   ├─ variables.gradle      # minSdk / compileSdk / targetSdk
   ├─ app/build.gradle      # applicationId, versionCode, versionName, signing
   └─ app/src/main/
      ├─ AndroidManifest.xml            # permissions
      └─ res/values/strings.xml         # nom affiché de l'appli
```

### `src/main.ts|js` : points de config

```js
import { IonicVue } from '@ionic/vue';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import '@ionic/vue/css/core.css';           // obligatoire
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';         // utilitaires optionnels
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

// Dark mode : choisir UNE ligne
// import '@ionic/vue/css/palettes/dark.always.css';
// import '@ionic/vue/css/palettes/dark.class.css';   // activer via class "ion-palette-dark" sur <html>
import '@ionic/vue/css/palettes/dark.system.css';     // suit le système

import './theme/variables.css';

const app = createApp(App)
  .use(IonicVue, {
    // mode: 'md',          // forcer le style Material ('ios' pour le style iOS) sur toutes plateformes
    // animated: true,
    // rippleEffect: true,
  })
  .use(router);

router.isReady().then(() => app.mount('#app'));   // attendre le router avant de monter
```

### `src/theme/variables.css` : couleurs

```css
:root {
  --ion-color-primary: #3880ff;
  --ion-color-primary-rgb: 56, 128, 255;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: #3171e0;
  --ion-color-primary-tint: #4c8dff;
}
```
Le générateur de couleurs officiel donne toutes les variables d'un coup : https://ionicframework.com/docs/theming/color-generator

---

## 3. Router Ionic

Différences avec Vue Router classique :
- `createRouter` / `createWebHistory` s'importent depuis **`@ionic/vue-router`** (les types restent dans `vue-router`).
- On utilise `<ion-router-outlet>` au lieu de `<RouterView>` : il gère les animations de transition et la pile de pages.
- Chaque page routée a `<ion-page>` en élément racine.
- Les pages déjà visitées restent montées. Utilise les hooks Ionic (`onIonViewWillEnter`…) plutôt que `onMounted` pour rafraîchir les données.

**`src/router/index.ts`** (TS)
```ts
import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'Home', component: HomePage },
  { path: '/detail/:id', name: 'Detail', component: () => import('@/views/DetailPage.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
```

**`src/router/index.js`** (JS)
```js
import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '@/views/HomePage.vue';

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'Home', component: HomePage },
  { path: '/detail/:id', name: 'Detail', component: () => import('@/views/DetailPage.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
```

### Variante tabs : routes enfants
```js
{ path: '/', redirect: '/tabs/tab1' },
{
  path: '/tabs/',
  component: TabsPage,
  children: [
    { path: '', redirect: '/tabs/tab1' },
    { path: 'tab1', component: () => import('@/views/Tab1Page.vue') },
    { path: 'tab2', component: () => import('@/views/Tab2Page.vue') },
    { path: 'tab4', component: () => import('@/views/Tab4Page.vue') }, // ← ajouter un onglet
  ],
},
```
Puis dans `TabsPage.vue` :
```vue
<ion-tab-button tab="tab4" href="/tabs/tab4">
  <ion-icon aria-hidden="true" :icon="star" />
  <ion-label>Tab 4</ion-label>
</ion-tab-button>
<!-- script : import { star } from 'ionicons/icons'; -->
```

### Variante sidemenu : ajouter une entrée
Dans `App.vue`, ajoute un objet au tableau `appPages` (l'URL doit matcher une route) :
```js
{ title: 'Settings', url: '/settings', iosIcon: settingsOutline, mdIcon: settingsSharp },
```
Route :
```js
{ path: '/settings', component: () => import('@/views/SettingsPage.vue') },
```
Dans la page, ajoute le bouton menu :
```vue
<ion-buttons slot="start"><ion-menu-button /></ion-buttons>
```

### Page type

TS
```vue
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/home" /></ion-buttons>
        <ion-title>Détail {{ id }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button @click="goHome">Accueil</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton,
  onIonViewWillEnter, useIonRouter,
} from '@ionic/vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const ionRouter = useIonRouter();
const id = route.params.id as string;

onIonViewWillEnter(() => {
  // appelé à CHAQUE entrée sur la page (rechargement de données)
});

const goHome = () => ionRouter.navigate('/home', 'back', 'pop');  // direction + action → animation correcte
</script>
```

JS : identique, avec `<script setup>` (sans `lang="ts"`) et `const id = route.params.id;`.

Navigation dans le template :
```vue
<ion-item router-link="/detail/42" router-direction="forward">…</ion-item>
<ion-button router-link="/home" router-direction="root">Accueil</ion-button>
```

> Les composants Ionic s'importent un par un depuis `@ionic/vue`. S'il en manque un dans l'import, il ne s'affiche pas et une erreur de résolution apparaît en console.

---

## 4. ESLint + Prettier

### 4.1 Via le starter (déjà inclus)

Scripts fournis :
```bash
npm run lint         # eslint (0 warning toléré) + typecheck e2e + prettier --check
npm run lint:fix     # eslint --fix + prettier --write
```
Prettier utilise `@ionic/prettier-config` (déclaré dans `package.json`, clé `"prettier"`) : `printWidth 120`, `semi: true`, `singleQuote: true`, `trailingComma: 'all'`.

**Surcharger le style Prettier** : supprime la clé `"prettier"` de `package.json` et crée `.prettierrc.json` :
```json
{ "printWidth": 120, "semi": true, "singleQuote": true, "trailingComma": "all" }
```

**Ajouter une règle ESLint** : dans `eslint.config.js`, objet `rules` du dernier bloc commun :
```js
rules: {
  'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  'vue/no-deprecated-slot-attribute': 'off',   // nécessaire : Ionic utilise l'attribut slot="…"
  '@typescript-eslint/no-explicit-any': 'off',
  // + tes règles
},
```

### 4.2 Installation manuelle

**TS**
```bash
npm i -D eslint @eslint/js eslint-plugin-vue @vue/eslint-config-typescript globals \
        prettier eslint-config-prettier @ionic/prettier-config
```

`eslint.config.js` (TS)
```js
import js from '@eslint/js';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from 'eslint-config-prettier/flat';
import globals from 'globals';

export default defineConfigWithVueTs(
  { ignores: ['dist/**', 'android/**', 'ios/**'] },
  js.configs.recommended,
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'vue/no-deprecated-slot-attribute': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  skipFormatting, // en dernier
);
```

**JS**
```bash
npm i -D eslint @eslint/js eslint-plugin-vue globals prettier eslint-config-prettier @ionic/prettier-config
```

`eslint.config.js` (JS)
```js
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from 'eslint-config-prettier/flat';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'android/**', 'ios/**'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'vue/no-deprecated-slot-attribute': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
  skipFormatting,
];
```

`package.json` (TS : extensions `ts,vue` ; JS : `js,vue`)
```json
"prettier": "@ionic/prettier-config",
"scripts": {
  "lint": "eslint . && prettier \"src/**/*.{ts,vue}\" --check",
  "lint:fix": "eslint . --fix && prettier \"src/**/*.{ts,vue}\" --write"
}
```

`.prettierignore`
```
android/
ios/
dist/
```

---

## 5. PWA (web)

```bash
npm i -D vite-plugin-pwa
```

Icônes à placer dans `public/icons/` : `icon-192.png` (192×192) et `icon-512.png` (512×512).

`vite.config.ts|js`
```js
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'; // le starter TS utilise 'vitest/config' (bloc test) : garde-le si tu utilises Vitest

export default defineConfig({
  plugins: [
    vue(),
    legacy(),
    VitePWA({
      registerType: 'autoUpdate',          // le service worker se met à jour tout seul
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'Mon App',
        short_name: 'MonApp',
        theme_color: '#3880ff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      // devOptions: { enabled: true },    // tester le SW en `npm run dev`
    }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
```

Le build produit `dist/manifest.webmanifest`, `dist/sw.js` et `dist/registerSW.js`, qui est injecté automatiquement.

Tester :
```bash
npm run build && npm run preview     # puis DevTools > Application > Manifest / Service Workers
```
`index.html` : ajoute `<meta name="theme-color" content="#3880ff" />`.
> En production, un service worker exige HTTPS (sauf sur `localhost`).

---

## 6. Android avec Capacitor

### 6.1 Environnement Linux (une seule fois)

1. **Android Studio** : télécharge le `.tar.gz` sur https://developer.android.com/studio. Capacitor 8 demande au minimum **Android Studio 2025.2.1**.
   ```bash
   sudo tar -xzf android-studio-*-linux.tar.gz -C /opt
   /opt/android-studio/bin/studio.sh        # assistant : installe SDK, platform-tools, émulateur
   ```
2. **SDK Manager** (Settings > Languages & Frameworks > Android SDK) :
   - SDK Platforms : **Android 16 (API 36)**
   - SDK Tools : Build-Tools, Platform-Tools, **Command-line Tools (latest)**, Emulator
3. **JDK** : Capacitor 8 utilise **JDK 21**. Android Studio en embarque un (`/opt/android-studio/jbr`), inutile d'en installer un autre.
4. **Variables d'environnement** (`~/.bashrc` ou `~/.zshrc`) :
   ```bash
   export ANDROID_HOME="$HOME/Android/Sdk"
   export ANDROID_SDK_ROOT="$ANDROID_HOME"
   export JAVA_HOME="/opt/android-studio/jbr"
   export CAPACITOR_ANDROID_STUDIO_PATH="/opt/android-studio/bin/studio.sh"   # pour `cap open android`
   export PATH="$PATH:$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/cmdline-tools/latest/bin"
   ```
   ```bash
   source ~/.bashrc
   java -version        # doit afficher 21
   adb --version
   sdkmanager --list_installed
   ```
5. **Appareil physique** :
   - Téléphone : Paramètres > À propos > taper 7× sur « Numéro de build » > Options développeur > **Débogage USB**.
   - Linux (droits USB) :
     ```bash
     sudo apt install android-sdk-platform-tools-common   # règles udev (Debian/Ubuntu)
     sudo usermod -aG plugdev $USER                       # puis se reconnecter
     adb devices                                          # doit afficher "device" (pas "unauthorized")
     ```
   - **Émulateur** : Android Studio > Device Manager > créer un AVD, API 36. Ou en ligne de commande : `emulator -list-avds` puis `emulator -avd <nom>`.
   - Accélération KVM : `sudo apt install qemu-kvm && sudo usermod -aG kvm $USER`.

### 6.2 Ajouter Android au projet

Projet créé avec `--capacitor` :
```bash
npm i @capacitor/android
npm run build                 # crée dist/ (webDir)
npx cap add android           # crée le dossier android/
```

Projet **sans** Capacitor :
```bash
npm i @capacitor/core
npm i -D @capacitor/cli
npx cap init "Mon App" com.societe.monapp --web-dir dist
npm i @capacitor/android
npm run build && npx cap add android
```

`capacitor.config.ts` (le TS est lu par la CLI même dans un projet JS ; tu peux aussi utiliser `capacitor.config.json`)
```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.societe.monapp',   // identifiant unique, non modifiable une fois publié
  appName: 'Mon App',
  webDir: 'dist',                // sortie de Vite
  // server: { androidScheme: 'https' },
  // plugins: { Keyboard: { resize: 'body' } },
};

export default config;
```

### 6.3 Cycle de dev

```bash
npm run build && npx cap sync android     # après chaque changement web (copie dist + plugins)
npx cap open android                      # ouvre Android Studio (Run ▶)
npx cap run android --list                # appareils/émulateurs disponibles
npx cap run android --target <ID>         # build + install + lancement
```

**Live reload** (sur un appareil du même réseau)
```bash
# Option Ionic CLI
ionic cap run android -l --external

# Option Capacitor seul
npm run dev -- --host                                  # terminal 1
npx cap run android -l --host <IP_LAN> --port 5173     # terminal 2  (IP : hostname -I)
# USB sans réseau : npx cap run android -l --host localhost --port 5173 --forwardPorts 5173:5173
```
> Relance `npx cap sync` sans `-l` avant un build final, sinon l'APK pointe toujours vers ton serveur de dev.

**APK / AAB en ligne de commande**
```bash
cd android
./gradlew assembleDebug        # → app/build/outputs/apk/debug/app-debug.apk
./gradlew bundleRelease        # → app/build/outputs/bundle/release/app-release.aab (Play Store, signature requise)
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Signature release :
```bash
keytool -genkey -v -keystore monapp.keystore -alias monapp -keyalg RSA -keysize 2048 -validity 10000
npx cap build android --keystorepath "$PWD/monapp.keystore" --keystorealias monapp \
  --keystorepass '***' --keystorealiaspass '***' --androidreleasetype AAB
```
> Garde le keystore hors du dépôt git.

### 6.4 Fichiers Android à modifier

| Besoin | Fichier |
|---|---|
| Nom affiché | `android/app/src/main/res/values/strings.xml` → `app_name`, `title_activity_main` |
| Version | `android/app/build.gradle` → `versionCode` (entier, +1 à chaque release), `versionName` |
| SDK min/cible | `android/variables.gradle` → `minSdkVersion 24`, `compileSdkVersion 36`, `targetSdkVersion 36` (fixés par Capacitor 8, ne pas monter seul) |
| Permissions | `android/app/src/main/AndroidManifest.xml` → `<uses-permission android:name="android.permission.CAMERA" />` |
| Icônes / splash | `npm i -D @capacitor/assets`, place `assets/logo.png` (ou `icon.png`), puis `npx capacitor-assets generate --android --iconBackgroundColor '#ffffff' --splashBackgroundColor '#ffffff'` |
| HTTP non sécurisé (dev) | `capacitor.config.ts` → `server: { cleartext: true }` |

### 6.5 Utiliser un plugin natif (exemple)

```bash
npm i @capacitor/camera && npx cap sync android
```
TS/JS :
```js
import { Camera, CameraResultType } from '@capacitor/camera';

const photo = await Camera.getPhoto({ resultType: CameraResultType.Uri, quality: 80 });
// photo.webPath → <img :src="photo.webPath">
```
Détecter la plateforme :
```js
import { Capacitor } from '@capacitor/core';
Capacitor.isNativePlatform();   // true sur Android
Capacitor.getPlatform();        // 'android' | 'ios' | 'web'
```

---

## 7. Passer un projet Ionic en JavaScript

La CLI ne génère que du TS. Conversion testée sur le template `tabs` (build et lint OK) :

```bash
# 1. supprimer TS et les tests (garde tests/ + playwright/vitest si tu veux les convertir aussi)
rm -f tsconfig*.json src/vite-env.d.ts vite.config.ts playwright.config.ts
rm -rf tests
# 2. renommer
mv src/main.ts src/main.js
mv src/router/index.ts src/router/index.js
sed -i 's#/src/main.ts#/src/main.js#' index.html
# 3. retirer les types du router
sed -i '/import type { RouteRecordRaw }/d; s/const routes: RouteRecordRaw\[\] =/const routes =/' src/router/index.js
# 4. retirer lang="ts" des .vue
sed -i 's/<script setup lang="ts">/<script setup>/' $(grep -rl 'lang="ts"' src)
# 5. deps TS inutiles
npm uninstall typescript vue-tsc @vue/eslint-config-typescript @ionic/eslint-config @types/node \
              vitest @vue/test-utils jsdom @playwright/test
npm i -D eslint-config-prettier
```

`vite.config.js` (en ESM, `__dirname` n'existe pas : on utilise `import.meta.url`)
```js
import { fileURLToPath, URL } from 'node:url';
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue(), legacy()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
```

`jsconfig.json` (alias pour l'IDE)
```json
{
  "compilerOptions": { "paths": { "@/*": ["./src/*"] } },
  "exclude": ["node_modules", "dist", "android"]
}
```

`eslint.config.js` : version JS du §4.2.

`package.json` → scripts :
```json
"dev": "vite",
"build": "vite build",
"preview": "vite preview",
"lint": "eslint . && prettier \"src/**/*.{js,vue}\" --check",
"lint:fix": "eslint . --fix && prettier \"src/**/*.{js,vue}\" --write"
```

---

## 8. Commandes de référence

```bash
ionic start --list                 # templates
ionic serve                        # dev (8100)
ionic build                        # = npm run build
npm run lint / npm run lint:fix
npx cap sync android               # copie web + plugins
npx cap copy android               # copie web seulement (plus rapide)
npx cap update android             # met à jour les plugins natifs
npx cap doctor                     # diagnostic versions Capacitor
npx cap open android
npx cap run android --target <ID>
adb logcat | grep -i capacitor     # logs natifs
# Debug WebView : chrome://inspect dans Chrome desktop, appareil branché
```

## 9. Problèmes fréquents

| Symptôme | Correctif |
|---|---|
| Écran blanc sur Android | `npm run build` oublié avant `cap sync`, ou `webDir` ≠ `dist` |
| `invalid source release: 21` | Gradle tourne avec un JDK < 21 → `JAVA_HOME=/opt/android-studio/jbr`, et dans Android Studio : Settings > Build Tools > Gradle > Gradle JDK = 21 |
| `SDK location not found` | `ANDROID_HOME` absent → ou créer `android/local.properties` : `sdk.dir=/home/<user>/Android/Sdk` |
| `cap open android` ne trouve pas Studio | `CAPACITOR_ANDROID_STUDIO_PATH` non défini |
| `adb devices` → `unauthorized` | accepter la clé RSA sur le téléphone ; `adb kill-server && adb start-server` |
| Composant Ionic invisible | non importé depuis `@ionic/vue` dans le `<script setup>` |
| Données non rafraîchies au retour sur une page | utiliser `onIonViewWillEnter` au lieu de `onMounted` |
| Erreur ESLint sur `slot="start"` | `'vue/no-deprecated-slot-attribute': 'off'` |
| Plugin "not implemented" sur Android | `npx cap sync android` après l'install du plugin |
