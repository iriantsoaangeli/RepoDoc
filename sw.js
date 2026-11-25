// Service worker du site. Modèle : vue-project/sw.js ; le sw.js à la racine du dépôt
// est généré par ./build.sh (ne pas le modifier à la main).
// But : télécharger le moins possible et rester navigable hors ligne.
//   - application (html, js, css) : mise en cache à l'installation, servie depuis le cache
//   - app/md/… (pages, config, images, PDF) : servie depuis le cache « contenu »,
//     rempli par l'application (lecteur/HorsLigne.ts) et, pour un PDF, à sa première ouverture
const VERSION = 'd50424ad18'
const FICHIERS = ["./","index.html","app/html/","app/html/favicon.svg","app/html/assets/index-BKzCTlo0.js","app/html/assets/IndexView-C4Cw1u4q.js","app/html/assets/MdBlocks-CFU17swG.js","app/html/assets/PageView-CyelCa-v.js","app/html/assets/p-BmVRXR1y-tEpWjZ2F.js","app/html/assets/p-C5zGntuD-TOGf5xbJ.js","app/html/assets/p-C8n1kmjg-BHhF0Vao.js","app/html/assets/p-CCpvdQ1F-SqLXAz5f.js","app/html/assets/p-CmDwAGfM-Btf9N8tx.js","app/html/assets/p-CyKwPay6-4R6fmI_T.js","app/html/assets/p-D0YpjgON-7MWMj91H.js","app/html/assets/p-D7-vHX0A-1yDKnD1t.js","app/html/assets/p-D9uVfgmC-BtQk0nfF.js","app/html/assets/p-Dj4J3LkD-CdWAa8ga.js","app/html/assets/p-ZjP4CjeZ-DJ1DGIsW.js","app/html/assets/index-D4vN2k89.css","app/html/index.html"]
const APP = `app-${VERSION}`
const CONTENU = 'contenu' // même nom que dans HorsLigne.ts
const DOSSIER_MD = new URL('app/md/', self.registration.scope).href

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(APP)
      .then((cache) => cache.addAll(FICHIERS))
      .then(() => self.skipWaiting()),
  )
})

// Nouvelle version : on supprime les fichiers de l'ancienne, et on prend la main tout de suite
// (la première visite est ainsi servie hors ligne dès la page suivante)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((cles) =>
        Promise.all(cles.filter((c) => c.startsWith('app-') && c !== APP).map((c) => caches.delete(c))),
      )
      .then(() => self.clients.claim()),
  )
})

/** Contenu : depuis le cache, sinon le réseau (et on le garde : un PDF ouvert reste lisible) */
const depuisContenu = async (requete) => {
  const cache = await caches.open(CONTENU)
  const trouve = await cache.match(requete.url)
  if (trouve) return trouve
  const reponse = await fetch(requete)
  if (reponse.status === 200) cache.put(requete.url, reponse.clone())
  return reponse
}

/**
 * config.yaml : réseau d'abord (quelques centaines d'octets), le cache seulement hors ligne.
 * Ils sont lus avant la mise à jour du cache par l'application : jamais de config périmée.
 */
const reseauDabord = async (requete) => {
  const cache = await caches.open(CONTENU)
  try {
    const reponse = await fetch(requete)
    if (reponse.status === 200) cache.put(requete.url, reponse.clone())
    return reponse
  } catch {
    return (await cache.match(requete.url)) ?? Response.error()
  }
}

self.addEventListener('fetch', (e) => {
  const requete = e.request
  // API GitHub, liens externes, envois : pas touchés
  if (requete.method !== 'GET' || !requete.url.startsWith(self.registration.scope)) return
  if (requete.url.startsWith(DOSSIER_MD) && requete.url.endsWith('/config.yaml'))
    e.respondWith(reseauDabord(requete))
  else if (requete.url.startsWith(DOSSIER_MD)) e.respondWith(depuisContenu(requete))
  else
    e.respondWith(
      caches.match(requete, { cacheName: APP, ignoreSearch: true }).then((r) => r ?? fetch(requete)),
    )
})
