import { createRouter, createWebHashHistory } from 'vue-router'

// Hash history : GitHub Pages ne sait pas rediriger les URL inconnues vers index.html
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // Sommaire général, puis sommaire d'un thème
    { path: '/', component: () => import('../views/IndexView.vue') },
    { path: '/:theme', component: () => import('../views/IndexView.vue'), props: true },
    // Une page : route = chemin du fichier, /theme/page.md, /theme/lecon/page.md, /theme/lecon/sous-lecon/page.md…
    { path: '/:chemin(.*\\.md)', component: () => import('../views/PageView.vue'), props: true },
    // Un PDF, affiché dans la même vue : /theme/.../fichier.pdf
    { path: '/:chemin(.*\\.pdf)', component: () => import('../views/PageView.vue'), props: true },
    // Tout le reste : page introuvable
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/PageView.vue'),
      props: (r) => ({ chemin: ([] as string[]).concat(r.params.pathMatch ?? []).join('/') }),
    },
  ],
})

export default router
