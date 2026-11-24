import { createRouter, createWebHashHistory } from 'vue-router'

// Hash history : GitHub Pages ne sait pas rediriger les URL inconnues vers index.html
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // Page de vérification des composants
    { path: '/_template', component: () => import('../views/TemplateView.vue') },
    // Sommaire général, puis sommaire d'un thème
    { path: '/', component: () => import('../views/IndexView.vue') },
    { path: '/:theme', component: () => import('../views/IndexView.vue'), props: true },
    // Une page : /theme/page ou /theme/lecon/page
    { path: '/:theme/:chemin+', component: () => import('../views/PageView.vue'), props: true },
  ],
})

export default router
