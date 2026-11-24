// CSS requis par Ionic, puis le CSS du template (chargé après pour avoir le dernier mot)
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/display.css'
import '../../template/style.css'

import { IonicVue } from '@ionic/vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App).use(IonicVue, { mode: 'md' }).use(router)

router.isReady().then(() => app.mount('#app'))
