// Lit les config.yaml de app/md (globale, par thème, par leçon).
import { parse } from 'yaml'
import { joindre, mdUrl } from './chemins'

export interface Config {
  /** Dépôt GitHub "compte/repo" (config globale seulement) */
  repo?: string
  /** Chemin du dossier des md dans le dépôt, pour l'API GitHub (config globale seulement) */
  dossier?: string
  /** Nom affiché dans le header (config globale seulement) */
  titre?: string
  /** Fichiers ou dossiers à cacher, relatifs au dossier de la config */
  hidden: string[]
}

/** Lit le config.yaml d'un dossier ('' = racine de app/md). Absent → config vide. */
export const lireConfig = async (dossier: string): Promise<Config> => {
  const rep = await fetch(mdUrl(joindre(dossier, 'config.yaml')))
  if (!rep.ok) return { hidden: [] }
  const brut = (parse(await rep.text()) ?? {}) as Record<string, unknown>
  const texte = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)
  return {
    repo: texte(brut.repo),
    dossier: texte(brut.dossier),
    titre: texte(brut.titre),
    hidden: Array.isArray(brut.hidden) ? brut.hidden.map(String) : [],
  }
}

/**
 * Dépôt GitHub du site : celui de la config, sinon déduit de l'URL
 * (compte.github.io/repo/... → compte/repo). Vide si introuvable (ex. en local).
 */
export const resoudreRepo = (config: Config): string => {
  if (config.repo) return config.repo
  const compte = location.hostname.match(/^([^.]+)\.github\.io$/)?.[1]
  if (!compte) return ''
  const repo = location.pathname.split('/').filter(Boolean)[0]
  return `${compte}/${repo ?? `${compte}.github.io`}`
}
