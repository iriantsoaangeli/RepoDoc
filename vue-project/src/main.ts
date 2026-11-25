// CSS requis par Ionic, puis le CSS du template (chargé après pour avoir le dernier mot)
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/display.css'
import '../../template/style.css'

import { IonicVue } from '@ionic/vue'
import { createApp } from 'vue'
import App from './App.vue'
import { chargerSite } from './lecteur/RouterMarkdown'
import router from './router'

// Prod : service worker à la racine du dépôt (généré par ./build.sh) → lecture hors ligne
if (import.meta.env.PROD && 'serviceWorker' in navigator)
  navigator.serviceWorker
    .register(new URL('../../sw.js', document.baseURI), { scope: '../../' })
    .catch(() => {}) // sans service worker, le site marche quand même (en ligne)

chargerSite()
createApp(App).use(IonicVue, { mode: 'md' }).use(router).mount('#app')
