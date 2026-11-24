import { createRouter } from '@ionic/vue-router'
import { createWebHashHistory } from 'vue-router'

// Hash history : GitHub Pages ne sait pas rediriger les URL inconnues vers index.html
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/template' },
    // Page de vérification des composants
    { path: '/template', component: () => import('../views/TemplateView.vue') },
  ],
})

export default router
