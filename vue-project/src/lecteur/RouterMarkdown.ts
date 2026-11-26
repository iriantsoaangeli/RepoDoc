// Construit le site à partir de app/md : thèmes (dossiers) → leçons (sous-dossiers, imbriqués
// à n'importe quelle profondeur) → pages (.md).
// Fournit l'état partagé (useSite) et les liens pour le header et les sidebars.
import { reactive } from 'vue'
import type { NavLink } from '@/types'
import { comparer, joindre, libelle, pageDe, pagesDe, toutesPages, type Page } from './chemins'
import { lireConfig, resoudreRepo, type Config } from './LecteurConfig'
import { synchroniser } from './HorsLigne'
import { lireArbre } from './MarkdownReader'
import { initialiser } from './MdRouter'

export type { Page }
export { pagesDe, toutesPages }

export interface Lecon {
  slug: string
  /** Dossier dans app/md : "api/firebase/firebase-auth" (unique, sert de clé) */
  chemin: string
  label: string
  /** intro.md de la leçon : sa première page */
  intro?: Page
  /** Pages posées directement dans la leçon */
  pages: Page[]
  /** Sous-dossiers de la leçon */
  lecons: Lecon[]
}

export interface Theme {
  slug: string
  label: string
  route: string
  /** intro.md du thème : affiché en haut de l'index du thème */
  intro?: Page
  /** Pages posées directement dans le thème */
  pages: Page[]
  lecons: Lecon[]
}

export interface Site {
  titre: string
  repo: string
  /** intro.md à la racine : affiché sur l'index général */
  intro?: Page
  themes: Theme[]
}

/** État partagé, chargé une fois au démarrage */
const etat = reactive({
  site: null as Site | null,
  chargement: true,
  erreur: '',
})
export const useSite = () => etat

/** Vrai si le chemin est caché par l'une des configs (hidden relatif au dossier de la config) */
const estCache = (chemin: string, configs: Map<string, Config>): boolean =>
  [...configs].some(([dossier, config]) =>
    config.hidden.some((h) => {
      const cible = joindre(dossier, h.replace(/\/$/, ''))
      return chemin === cible || chemin === `${cible}.md` || chemin.startsWith(`${cible}/`)
    }),
  )

/** Sous-leçon `slug` d'un thème ou d'une leçon, créée si elle n'existe pas encore */
const sousLecon = (parent: { lecons: Lecon[] }, slug: string, chemin: string): Lecon => {
  let lecon = parent.lecons.find((l) => l.slug === slug)
  if (!lecon) parent.lecons.push((lecon = { slug, chemin, label: libelle(slug), pages: [], lecons: [] }))
  return lecon
}

/** Range les fichiers .md dans thèmes / leçons (imbriquées) / pages */
const construire = (arbre: string[]) => {
  const themes = new Map<string, Theme>()
  let intro: Page | undefined

  for (const fichier of arbre.filter((f) => f.endsWith('.md')).sort(comparer)) {
    const parts = fichier.split('/')
    const page = pageDe(fichier)
    const estIntro = parts.at(-1) === 'intro.md'

    if (parts.length === 1) {
      if (estIntro) intro = page
      continue
    }

    const [slug, ...dossiers] = parts.slice(0, -1) as [string, ...string[]]
    let theme = themes.get(slug)
    if (!theme)
      themes.set(slug, (theme = { slug, label: libelle(slug), route: `/${slug}`, pages: [], lecons: [] }))

    if (!dossiers.length) {
      if (estIntro) theme.intro = page
      else theme.pages.push(page)
      continue
    }

    // Descend dossier par dossier : theme → leçon → sous-leçon…
    let lecon!: Lecon
    let parent: { lecons: Lecon[] } = theme
    let chemin = slug
    for (const dossier of dossiers) {
      chemin = joindre(chemin, dossier)
      parent = lecon = sousLecon(parent, dossier, chemin)
    }
    if (estIntro) lecon.intro = { ...page, label: 'Introduction' }
    else lecon.pages.push(page)
  }
  return { intro, themes: [...themes.values()] }
}

/** Lit la config, la liste des fichiers et les configs des dossiers, puis construit le site */
export const chargerSite = async (): Promise<void> => {
  try {
    const globale = await lireConfig('')
    const repo = resoudreRepo(globale)
    const arbre = await lireArbre(repo, globale.dossier ?? 'app/md')

    // Configs des thèmes et leçons présentes dans l'arbre
    const configs = new Map<string, Config>([['', globale]])
    const dossiers = arbre
      .map((f) => f.chemin)
      .filter((f) => f.endsWith('/config.yaml'))
      .map((f) => f.slice(0, -'/config.yaml'.length))
    const lues = await Promise.all(dossiers.map(lireConfig))
    dossiers.forEach((d, i) => configs.set(d, lues[i]!))

    // Fichiers cachés par les config.yaml : absents de la navigation et des liens (PDF compris)
    const visibles = arbre.filter((f) => !estCache(f.chemin, configs))
    // Prod : cache hors ligne à jour avant d'afficher la moindre page
    if (import.meta.env.PROD) await synchroniser(visibles)
    const chemins = visibles.map((f) => f.chemin)
    const { intro, themes } = construire(chemins)
    initialiser(themes, chemins)
    etat.site = { titre: globale.titre ?? 'Documentation', repo, intro, themes }
  } catch (e) {
    etat.erreur = e instanceof Error ? e.message : String(e)
  } finally {
    etat.chargement = false
  }
}

/** Liens du header : Accueil + un lien par thème */
export const themesHeader = (site: Site, actif?: string): NavLink[] => [
  { label: 'Accueil', to: '/', active: !actif },
  ...site.themes.map((t) => ({ label: t.label, to: t.route, active: t.slug === actif })),
]

/** Toutes les pages d'un thème dans l'ordre de lecture (pour précédent / suivant) */
export const pagesOrdonnees = (theme: Theme): Page[] => [
  ...theme.pages,
  ...theme.lecons.flatMap(toutesPages),
]

/** Première page d'une leçon (son intro si elle existe, sinon celle d'une sous-leçon) */
export const entreeLecon = (lecon: Lecon): Page | undefined => toutesPages(lecon)[0]
