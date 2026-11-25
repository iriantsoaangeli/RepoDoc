// Lit le contenu : la liste des fichiers de app/md, puis chaque page .md.
import { headings, lex, walkTokens, type Heading, type Token } from '@/markdown'
import { mdUrl } from './chemins'
import { routeDuLien } from './MdRouter'

/** Un fichier de app/md, et son empreinte git (change quand le fichier change ; vide en dev) */
export interface Fichier {
  chemin: string
  sha: string
}

/** Lit une valeur JSON de localStorage (absente ou illisible → undefined) */
const lireStockage = <T>(cle: string): T | undefined => {
  try {
    return JSON.parse(localStorage.getItem(cle) ?? 'null') ?? undefined
  } catch {
    return undefined
  }
}

/**
 * Liste des fichiers de app/md (chemins relatifs : "reseaux/01-couche-4/tcp.md").
 * En dev : lue sur le disque par Vite.
 * En prod : API GitHub, seulement le dossier du contenu. La liste est gardée dans le navigateur
 * avec son ETag : à chaque ouverture, la requête est conditionnelle (304 sans contenu si rien
 * n'a changé, et un 304 ne compte pas dans la limite de l'API). Sans réseau, on lit la copie.
 */
export const lireArbre = async (repo: string, dossier: string): Promise<Fichier[]> => {
  if (import.meta.env.DEV)
    return ((await (await fetch('/__arbre')).json()) as string[]).map((chemin) => ({ chemin, sha: '' }))

  if (!repo)
    throw new Error('Dépôt GitHub introuvable : renseigner « repo » dans app/md/config.yaml')
  const cle = `arbre:${repo}:${dossier}`
  const copie = lireStockage<{ etag: string; fichiers: Fichier[] }>(cle)

  let rep: Response
  try {
    rep = await fetch(
      `https://api.github.com/repos/${repo}/git/trees/HEAD:${encodeURI(dossier.replace(/\/$/, ''))}?recursive=1`,
      { headers: copie?.etag ? { 'If-None-Match': copie.etag } : {} },
    )
  } catch {
    // Hors ligne
    if (copie) return copie.fichiers
    throw new Error("Pas de connexion, et le site n'a encore jamais été ouvert sur cet appareil.")
  }
  if (rep.status === 304 && copie) return copie.fichiers
  if (!rep.ok) {
    if (copie) return copie.fichiers
    if (rep.status === 403 || rep.status === 429)
      throw new Error("Limite de l'API GitHub atteinte, réessayez dans quelques minutes.")
    throw new Error(`API GitHub : erreur ${rep.status} pour ${repo}`)
  }

  const { tree } = (await rep.json()) as { tree: { path: string; type: string; sha: string }[] }
  const fichiers = tree.filter((f) => f.type === 'blob').map((f) => ({ chemin: f.path, sha: f.sha }))
  try {
    localStorage.setItem(cle, JSON.stringify({ etag: rep.headers.get('ETag') ?? '', fichiers }))
  } catch {
    // Stockage plein ou interdit : la liste sera redemandée en entier la prochaine fois
  }
  return fichiers
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
