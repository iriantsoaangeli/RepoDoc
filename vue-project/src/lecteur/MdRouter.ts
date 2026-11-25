// Table des routes du site, construite une fois au démarrage à partir des fichiers de app/md.
// Route d'une page = chemin de son fichier : "/reseaux/01-couche-4/tcp.md".
// Sert à retrouver la page d'une URL et à transformer les liens écrits dans les .md
// en URL du site (ou en simple texte quand le fichier n'existe pas).
import { mdUrl, normaliser, resoudre } from './chemins'
import type { Lecon, Page, Theme } from './RouterMarkdown'

export interface PageTrouvee {
  theme: Theme
  /** Absente pour une page posée directement dans le thème */
  lecon?: Lecon
  page: Page
}

/** "reseaux/01-couche-4/tcp.md" → page */
const routes = new Map<string, PageTrouvee>()
/** Nom de fichier normalisé ("tcp") → page, pour les liens écrits avec le seul nom */
const parNom = new Map<string, PageTrouvee>()
/** intro.md de la racine et des thèmes → leur sommaire ("/", "/reseaux") */
const sommaires = new Map<string, string>()
/** Tous les fichiers de app/md (images, pdf… compris) */
const fichiers = new Set<string>()

const nomDe = (fichier: string) => normaliser(fichier.split('/').at(-1)!.replace(/\.md$/i, ''))

/** Remplit la table à partir des thèmes construits et de la liste des fichiers */
export const initialiser = (themes: Theme[], arbre: string[]): void => {
  routes.clear()
  parNom.clear()
  sommaires.clear()
  fichiers.clear()
  arbre.forEach((f) => fichiers.add(f))
  sommaires.set('intro.md', '/')

  const ajouter = (trouvee: PageTrouvee) => {
    const fichier = `${trouvee.page.chemin}.md`
    routes.set(fichier, trouvee)
    const nom = nomDe(fichier)
    // "intro" existe dans chaque leçon : trop ambigu pour une recherche par nom
    if (nom !== 'intro' && !parNom.has(nom)) parNom.set(nom, trouvee)
  }
  for (const theme of themes) {
    if (theme.intro) sommaires.set(`${theme.intro.chemin}.md`, theme.route)
    theme.pages.forEach((page) => ajouter({ theme, page }))
    for (const lecon of theme.lecons)
      [lecon.intro, ...lecon.pages].forEach((page) => page && ajouter({ theme, lecon, page }))
  }
}

/** Page d'un fichier ("reseaux/01-couche-4/tcp.md"), ou undefined */
export const trouver = (fichier: string): PageTrouvee | undefined => routes.get(fichier)

/** Route Vue → href utilisable dans le HTML rendu ("#/reseaux/x.md") */
const versHref = (route: string) => `#${route.split('/').map(encodeURIComponent).join('/')}`

/**
 * URL du site pour un lien écrit dans un .md, ou undefined s'il ne mène à rien
 * (le lien sera alors affiché comme du texte).
 *   dossier : dossier du .md qui contient le lien ("reseaux/corba")
 *   route   : route où ce .md est affiché, pour les liens "#titre"
 */
export const routeDuLien = (dossier: string, href: string, route: string): string | undefined => {
  // URL complète (http:, mailto:…) : laissée telle quelle
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return href

  const i = href.indexOf('#')
  const brut = i < 0 ? href : href.slice(0, i)
  const suffixe = i < 0 ? '' : href.slice(i)
  if (!brut) return suffixe ? `${versHref(route)}${suffixe}` : undefined

  let relatif = brut
  try {
    relatif = decodeURI(brut)
  } catch {
    // %xx invalide : on garde le texte tel quel
  }
  // "/theme/page.md" part de la racine de app/md, le reste du dossier du .md
  const cible = relatif.startsWith('/') ? resoudre('', relatif) : resoudre(dossier, relatif)

  // Autre fichier que du Markdown (image, pdf…) : lien direct s'il existe
  if (/\.[a-z0-9]+$/i.test(cible) && !/\.md$/i.test(cible))
    return fichiers.has(cible) ? mdUrl(cible) : undefined

  // Lien sans extension (style Obsidian) : c'est un .md
  const md = /\.md$/i.test(cible) ? cible : `${cible}.md`
  const sommaire = sommaires.get(md)
  if (sommaire) return `${versHref(sommaire)}${suffixe}`
  const page = (routes.get(md) ?? parNom.get(nomDe(md)))?.page
  return page ? `${versHref(page.route)}${suffixe}` : undefined
}
