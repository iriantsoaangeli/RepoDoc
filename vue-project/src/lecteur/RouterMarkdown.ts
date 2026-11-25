// Construit le site à partir de app/md : thèmes (dossiers) → leçons (sous-dossiers) → pages (.md).
// Fournit l'état partagé (useSite) et les liens pour le header et les sidebars.
import { reactive } from 'vue'
import type { NavLink } from '@/types'
import { comparer, joindre, libelle, pageDe, pagesDe, type Page } from './chemins'
import { lireConfig, resoudreRepo, type Config } from './LecteurConfig'
import { lireArbre } from './MarkdownReader'
import { initialiser } from './MdRouter'

export type { Page }
export { pagesDe }

export interface Lecon {
  slug: string
  label: string
  /** intro.md de la leçon : sa première page */
  intro?: Page
  pages: Page[]
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

/** Range les fichiers .md dans thèmes / leçons / pages */
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
    if (parts.length > 3) continue // plus profond que thème/leçon/page : ignoré

    const [slug, leconSlug] = parts as [string, string]
    let theme = themes.get(slug)
    if (!theme)
      themes.set(slug, (theme = { slug, label: libelle(slug), route: `/${slug}`, pages: [], lecons: [] }))

    if (parts.length === 2) {
      if (estIntro) theme.intro = page
      else theme.pages.push(page)
      continue
    }

    let lecon = theme.lecons.find((l) => l.slug === leconSlug)
    if (!lecon) theme.lecons.push((lecon = { slug: leconSlug, label: libelle(leconSlug), pages: [] }))
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
      .filter((f) => f.endsWith('/config.yaml'))
      .map((f) => f.slice(0, -'/config.yaml'.length))
    const lues = await Promise.all(dossiers.map(lireConfig))
    dossiers.forEach((d, i) => configs.set(d, lues[i]!))

    // Fichiers cachés par les config.yaml : absents de la navigation et des liens (PDF compris)
    const visibles = arbre.filter((f) => !estCache(f, configs))
    const { intro, themes } = construire(visibles)
    initialiser(themes, visibles)
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
  ...theme.lecons.flatMap(pagesDe),
]

/** Première page d'une leçon (son intro si elle existe) */
export const entreeLecon = (lecon: Lecon): Page | undefined => pagesDe(lecon)[0]
