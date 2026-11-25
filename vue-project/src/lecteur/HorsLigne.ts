// Lecture hors ligne : garde le contenu de app/md dans le cache du navigateur (Cache Storage),
// que le service worker (sw.js) sert ensuite sans réseau. Prod seulement.
//   - pages .md, config.yaml, images : téléchargées dès la première visite, en arrière-plan
//   - PDF : gardés seulement quand on les ouvre (c'est le service worker qui s'en charge)
// Chaque fichier n'est téléchargé qu'une fois par version : on compare l'empreinte git (sha).
import { ref } from 'vue'
import { mdUrl } from './chemins'
import type { Fichier } from './MarkdownReader'

/** Même nom que dans sw.js */
const CACHE = 'contenu'
/** Empreintes des fichiers lors de la dernière synchronisation */
const CLE = 'contenu-sha'

/**
 * Connexion : le navigateur dit être hors ligne, ou l'API GitHub n'a pas répondu
 * (signalé par MarkdownReader). Revient à true dès que le réseau revient.
 */
export const enLigne = ref(navigator.onLine)
addEventListener('online', () => (enLigne.value = true))
addEventListener('offline', () => (enLigne.value = false))

/**
 * État du cache hors ligne (affiché par EtatReseau) :
 *   indisponible : dev, ou navigateur sans service worker
 *   chargement   : pages en cours de téléchargement (ou en attente du réseau)
 *   charge       : toutes les pages (hors PDF) sont en cache et le service worker est actif
 */
export const etatCache = ref<'indisponible' | 'chargement' | 'charge'>(
  import.meta.env.PROD && 'serviceWorker' in navigator && 'caches' in window
    ? 'chargement'
    : 'indisponible',
)

/** Télécharge les URL dans le cache, 4 à la fois ; une erreur n'arrête pas les autres */
const remplir = async (cache: Cache, urls: string[]) => {
  const file = [...urls]
  const travailleur = async () => {
    for (let url = file.shift(); url; url = file.shift()) await cache.add(url).catch(() => {})
  }
  await Promise.all([1, 2, 3, 4].map(travailleur))
}

/**
 * Met le cache à jour avec la liste des fichiers visibles.
 * Attendu avant d'afficher le site : retire tout de suite du cache les fichiers modifiés ou
 * supprimés (jamais de page périmée). Le téléchargement des manquants se fait ensuite, au calme.
 */
export const synchroniser = async (fichiers: Fichier[]): Promise<void> => {
  if (etatCache.value === 'indisponible') return
  const cache = await caches.open(CACHE)

  let avant: Record<string, string> = {}
  try {
    avant = JSON.parse(localStorage.getItem(CLE) ?? '{}')
  } catch {
    // illisible : tout sera revérifié
  }
  const shas = Object.fromEntries(fichiers.map((f) => [f.chemin, f.sha]))
  await Promise.all(
    Object.keys(avant)
      .filter((chemin) => avant[chemin] !== shas[chemin])
      .map((chemin) => cache.delete(mdUrl(chemin))),
  )
  try {
    localStorage.setItem(CLE, JSON.stringify(shas))
  } catch {
    // stockage plein : la prochaine synchro revérifiera tout
  }

  const urls = fichiers.filter((f) => !/\.pdf$/i.test(f.chemin)).map((f) => mdUrl(f.chemin))
  const manquantes = async () => {
    const presents = await Promise.all(urls.map((url) => cache.match(url)))
    return urls.filter((_, i) => !presents[i])
  }
  const telecharger = async () => {
    etatCache.value = 'chargement'
    await remplir(cache, await manquantes())
    // « charge » seulement si tout est là et que le service worker peut servir hors ligne
    if (!(await manquantes()).length) {
      await navigator.serviceWorker.ready
      etatCache.value = 'charge'
    }
  }
  // Téléchargement interrompu (réseau coupé) : on reprend quand le réseau revient
  addEventListener('online', () => etatCache.value !== 'charge' && void telecharger())
  if ('requestIdleCallback' in window) requestIdleCallback(() => void telecharger())
  else setTimeout(() => void telecharger(), 1000)
}
