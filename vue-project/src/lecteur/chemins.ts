// Petits outils partagés par le lecteur : URL des fichiers et libellés.

/** URL d'un fichier de app/md, relative au site (app/html/ → ../md/) */
export const mdUrl = (chemin: string): string =>
  new URL(`../md/${encodeURI(chemin)}`, document.baseURI).href

/** Joint des morceaux de chemin en ignorant les vides : ('', 'a', 'b.md') → 'a/b.md' */
export const joindre = (...parts: string[]): string => parts.filter(Boolean).join('/')

/** Résout un chemin relatif depuis un dossier : ('a/b', '../c.md') → 'a/c.md' */
export const resoudre = (dossier: string, relatif: string): string => {
  const parts = dossier ? dossier.split('/') : []
  for (const p of relatif.split('/')) {
    if (p === '..') parts.pop()
    else if (p && p !== '.') parts.push(p)
  }
  return parts.join('/')
}

/** "01-couche-4" → "Couche 4", "mon_fichier.md" → "Mon fichier" */
export const libelle = (nom: string): string => {
  const propre = nom
    .replace(/\.md$/, '')
    .replace(/^\d+[-_. ]*/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
  return propre ? propre[0]!.toUpperCase() + propre.slice(1) : nom
}

/** Pour comparer des noms sans tenir compte des majuscules ni des accents : "Récupérer" → "recuperer" */
export const normaliser = (texte: string): string =>
  texte.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()

/** Tri naturel : "2-b" avant "10-a" */
export const comparer = new Intl.Collator('fr', { numeric: true }).compare
