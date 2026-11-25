// Lit les config.yaml de app/md (globale, par thème, par leçon).
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

/**
 * Lit le YAML simple de nos config.yaml (au lieu d'une bibliothèque de ~30 Ko compressés) :
 *   cle: valeur      cle: "valeur"      cle:      cle: [a, b]      # commentaire
 *   cle:
 *     - element
 */
export const lireYaml = (texte: string): Record<string, string | string[]> => {
  const resultat: Record<string, string | string[]> = {}
  const valeur = (v: string) => v.trim().replace(/^(["'])(.*)\1$/, '$2')
  let liste: string[] | undefined
  for (const brute of texte.split('\n')) {
    // Commentaire : en début de ligne, ou précédé d'un espace ("C#" reste du texte)
    const ligne = brute.replace(/(^|\s)#.*$/, '').trimEnd()
    if (!ligne.trim()) continue
    const element = ligne.match(/^\s*-\s+(.*)$/)
    if (element) {
      liste?.push(valeur(element[1]!))
      continue
    }
    const [, cle, v] = ligne.match(/^([\w-]+)\s*:\s*(.*)$/) ?? []
    if (!cle) continue
    liste = undefined
    if (!v) resultat[cle] = liste = [] // vide, ou suivi d'une liste "- element"
    else if (v.startsWith('['))
      resultat[cle] = v.slice(1, v.lastIndexOf(']')).split(',').map(valeur).filter(Boolean)
    else resultat[cle] = valeur(v)
  }
  return resultat
}

/** Lit le config.yaml d'un dossier ('' = racine de app/md). Absent ou injoignable → config vide. */
export const lireConfig = async (dossier: string): Promise<Config> => {
  const rep = await fetch(mdUrl(joindre(dossier, 'config.yaml'))).catch(() => undefined)
  if (!rep?.ok) return { hidden: [] }
  const brut = lireYaml(await rep.text())
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
