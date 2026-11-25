// Lit le contenu : la liste des fichiers de app/md, puis chaque page .md.
import { headings, lex, walkTokens, type Heading, type Token } from '@/markdown'
import { mdUrl } from './chemins'
import { routeDuLien } from './MdRouter'

/**
 * Liste des fichiers de app/md (chemins relatifs : "reseaux/01-couche-4/tcp.md").
 * En dev : lu sur le disque par Vite. En prod : API GitHub, mise en cache pour la session.
 */
export const lireArbre = async (repo: string, dossier: string): Promise<string[]> => {
  if (import.meta.env.DEV) return (await fetch('/__arbre')).json()

  if (!repo)
    throw new Error('Dépôt GitHub introuvable : renseigner « repo » dans app/md/config.yaml')
  const cle = `arbre:${repo}:${dossier}`
  const cache = sessionStorage.getItem(cle)
  if (cache) return JSON.parse(cache)

  const rep = await fetch(`https://api.github.com/repos/${repo}/git/trees/HEAD?recursive=1`)
  if (rep.status === 403 || rep.status === 429)
    throw new Error("Limite de l'API GitHub atteinte, réessayez dans quelques minutes.")
  if (!rep.ok) throw new Error(`API GitHub : erreur ${rep.status} pour ${repo}`)

  const { tree } = (await rep.json()) as { tree: { path: string; type: string }[] }
  const prefixe = `${dossier.replace(/\/$/, '')}/`
  const arbre = tree
    .filter((f) => f.type === 'blob' && f.path.startsWith(prefixe))
    .map((f) => f.path.slice(prefixe.length))
  sessionStorage.setItem(cle, JSON.stringify(arbre))
  return arbre
}

/** Vide le cache de la liste des fichiers puis recharge la page (nouvelles pages poussées) */
export const rechargerSansCache = (): void => {
  Object.keys(sessionStorage)
    .filter((cle) => cle.startsWith('arbre:'))
    .forEach((cle) => sessionStorage.removeItem(cle))
  location.reload()
}

export interface PageLue {
  /** Texte du "# titre" en tête du fichier, s'il y en a un */
  titre?: string
  /** Blocs à afficher (sans le # titre) */
  tokens: Token[]
  /** Titres h2/h3 pour la table des matières */
  toc: Heading[]
}

/**
 * Réécrit les liens et images d'une page pour qu'ils marchent dans le site (voir MdRouter) :
 *   "udp.md#x"   → "#/reseaux/01-couche-4/udp.md#x"   (autre page)
 *   "#x"         → "#/<route>#x"                       (titre de la page)
 *   "schema.png" → URL du fichier dans app/md
 *   lien qui ne mène à rien → href vide, affiché comme du texte
 */
const reecrireLiens = (tokens: Token[], chemin: string, route: string) => {
  const dossier = chemin.split('/').slice(0, -1).join('/')
  walkTokens(tokens, (t) => {
    if (t.type === 'link' || t.type === 'image') t.href = routeDuLien(dossier, t.href, route) ?? ''
  })
}

/**
 * Lit une page : fichier dans app/md ("reseaux/01-couche-4/tcp.md").
 * `route` = route où la page est affichée (pour les liens #titre), par défaut /chemin.
 */
export const lirePage = async (chemin: string, route = `/${chemin}`): Promise<PageLue> => {
  const rep = await fetch(mdUrl(chemin))
  if (!rep.ok) throw new Error(`Page introuvable : ${chemin}`)
  const tokens = lex(await rep.text()).filter((t, i) => !(i === 0 && t.type === 'space'))
  reecrireLiens(tokens, chemin, route)
  let titre: string | undefined
  const premier = tokens[0]
  if (premier?.type === 'heading' && premier.depth === 1) {
    titre = premier.text
    tokens.shift()
  }
  return { titre, tokens, toc: headings(tokens) }
}
