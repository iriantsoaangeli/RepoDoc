// Petits outils partagés par le lecteur : URL des fichiers et libellés.

/** URL d'un fichier de app/md, relative au site (app/html/ → ../md/) */
export const mdUrl = (chemin: string): string =>
  new URL(`../md/${encodeURI(chemin)}`, document.baseURI).href

/** Joint des morceaux de chemin en ignorant les vides : ('', 'a', 'b.md') → 'a/b.md' */
export const joindre = (...parts: string[]): string => parts.filter(Boolean).join('/')

/** "01-couche-4" → "Couche 4", "mon_fichier.md" → "Mon fichier" */
export const libelle = (nom: string): string => {
  const propre = nom
    .replace(/\.md$/, '')
    .replace(/^\d+[-_. ]*/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
  return propre ? propre[0]!.toUpperCase() + propre.slice(1) : nom
}

/** Tri naturel : "2-b" avant "10-a" */
export const comparer = new Intl.Collator('fr', { numeric: true }).compare
