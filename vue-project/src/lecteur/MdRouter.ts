// Table des routes du site, construite une fois au démarrage à partir des fichiers de app/md.
// Route d'une page = chemin de son fichier : "/reseaux/01-couche-4/tcp.md".
// Les PDF ont aussi leur route ("/cours/gestion-rh/modeles/cdd.pdf") : affichés dans le site
// comme une page, mais seulement atteints par un lien (absents de la sidebar).
// Sert à retrouver la page d'une URL et à transformer les liens écrits dans les .md
// en URL du site (ou en simple texte quand le fichier n'existe pas).
import { mdUrl, normaliser, pageDe, pagesDe, type Page } from './chemins'
import type { Lecon, Theme } from './RouterMarkdown'

export interface PageTrouvee {
  theme: Theme
  /** Leçons qui contiennent la page, de la plus haute à la plus profonde (vide si la page est
   *  posée directement dans le thème) */
  lecons: Lecon[]
  page: Page
  /** URL du fichier quand la page est un PDF */
  pdf?: string
}

/** "reseaux/01-couche-4/tcp.md", "cours/gestion-rh/modeles/cdd.pdf" → page */
const routes = new Map<string, PageTrouvee>()
/** Nom de fichier normalisé ("tcp", "cdd.pdf") → page, pour les liens écrits avec le seul nom */
const parNom = new Map<string, PageTrouvee>()
/** intro.md de la racine et des thèmes → leur sommaire ("/", "/reseaux") */
const sommaires = new Map<string, string>()
/** Tous les fichiers de app/md (images, pdf… compris) */
const fichiers = new Set<string>()

const nomDe = (fichier: string) => normaliser(fichier.split('/').at(-1)!.replace(/\.md$/i, ''))

/** Remplit la table à partir des thèmes construits et de la liste des fichiers */
export const initialiser = (themes: Theme[], arbre: string[]): void => {
  for (const table of [routes, parNom, sommaires, fichiers]) table.clear()
  arbre.forEach((f) => fichiers.add(f))
  sommaires.set('intro.md', '/')

  const ajouter = (trouvee: PageTrouvee) => {
    routes.set(trouvee.page.chemin, trouvee)
    const nom = nomDe(trouvee.page.chemin)
    // "intro" existe dans chaque leçon : trop ambigu pour une recherche par nom
    if (nom !== 'intro' && !parNom.has(nom)) parNom.set(nom, trouvee)
  }
  // Pages d'une leçon puis de ses sous-leçons ; parents = leçons au-dessus d'elle
  const parcourir = (theme: Theme, parents: Lecon[], lecon: Lecon) => {
    const lecons = [...parents, lecon]
    pagesDe(lecon).forEach((page) => ajouter({ theme, lecons, page }))
    lecon.lecons.forEach((l) => parcourir(theme, lecons, l))
  }
  for (const theme of themes) {
    if (theme.intro) sommaires.set(theme.intro.chemin, theme.route)
    theme.pages.forEach((page) => ajouter({ theme, lecons: [], page }))
    theme.lecons.forEach((l) => parcourir(theme, [], l))
  }

  // PDF : n'importe où dans un thème, rattaché à la leçon la plus profonde qui le contient
  for (const fichier of arbre.filter((f) => /\.pdf$/i.test(f))) {
    const [slug, ...reste] = fichier.split('/')
    const theme = themes.find((t) => t.slug === slug)
    if (!theme || !reste.length) continue
    const lecons: Lecon[] = []
    let parent: { lecons: Lecon[] } = theme
    for (const dossier of reste.slice(0, -1)) {
      const lecon = parent.lecons.find((l) => l.slug === dossier)
      if (!lecon) break // dossier sans .md : pas une leçon
      lecons.push((parent = lecon))
    }
    ajouter({ theme, lecons, page: pageDe(fichier), pdf: mdUrl(fichier) })
  }
}

/** Page d'un fichier ("reseaux/01-couche-4/tcp.md"), ou undefined */
export const trouver = (fichier: string): PageTrouvee | undefined => routes.get(fichier)

/** Page d'un fichier : chemin exact, sinon par nom de fichier */
const chercher = (fichier: string) => (routes.get(fichier) ?? parNom.get(nomDe(fichier)))?.page

/** Route Vue → href utilisable dans le HTML rendu ("#/reseaux/x.md") */
const versHref = (route: string) => `#${route.split('/').map(encodeURIComponent).join('/')}`

/**
 * URL du site pour un lien (ou une image) écrit dans un .md, ou undefined s'il ne mène à rien
 * (le lien sera alors affiché comme du texte).
 *   dossier : dossier du .md qui contient le lien ("reseaux/corba")
 *   route   : route où ce .md est affiché, pour les liens "#titre"
 */
export const routeDuLien = (dossier: string, href: string, route: string): string | undefined => {
  if (!href) return undefined
  // URL complète (http:, mailto:…) : laissée telle quelle
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return href
  if (href.startsWith('#')) return `${versHref(route)}${href}`

  // Résolu comme le ferait un navigateur : "../x.md", "/theme/x.md" (racine de app/md), "%20", "#ancre"
  const url = new URL(href, `x:/${dossier && `${dossier}/`}`)
  let cible: string
  try {
    cible = decodeURIComponent(url.pathname.slice(1))
  } catch {
    return undefined // %xx invalide
  }
  const vers = (r?: string) => r && `${versHref(r)}${url.hash}`

  if (/\.pdf$/i.test(cible)) return vers(chercher(cible)?.route)
  // Autre fichier que du Markdown (image, zip…) : lien direct s'il existe
  if (/\.[a-z0-9]+$/i.test(cible) && !/\.md$/i.test(cible))
    return fichiers.has(cible) ? mdUrl(cible) : undefined
  // Lien sans extension (style Obsidian) : c'est un .md
  const md = /\.md$/i.test(cible) ? cible : `${cible}.md`
  return vers(sommaires.get(md) ?? chercher(md)?.route)
}
