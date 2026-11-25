// Petits outils partagés par le lecteur : pages, URL des fichiers, libellés.

/** Une page du site : un .md, ou un PDF affiché comme une page */
export interface Page {
  /** Fichier dans app/md : "reseaux/01-couche-4/tcp.md" */
  chemin: string
  label: string
  /** Route Vue = chemin du fichier : "/reseaux/01-couche-4/tcp.md" */
  route: string
}

/** URL d'un fichier de app/md, relative au site (app/html/ → ../md/) */
export const mdUrl = (chemin: string): string =>
  new URL(`../md/${encodeURI(chemin)}`, document.baseURI).href

/** Joint des morceaux de chemin en ignorant les vides : ('', 'a', 'b.md') → 'a/b.md' */
export const joindre = (...parts: string[]): string => parts.filter(Boolean).join('/')

/** "01-couche-4" → "Couche 4", "mon_fichier.md" → "Mon fichier" */
export const libelle = (nom: string): string => {
  const propre = nom
    .replace(/\.(md|pdf)$/i, '')
    .replace(/^\d+[-_. ]*/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
  return propre ? propre[0]!.toUpperCase() + propre.slice(1) : nom
}

/** Page d'un fichier de app/md, libellé tiré du nom du fichier */
export const pageDe = (chemin: string): Page => ({
  chemin,
  label: libelle(chemin.split('/').at(-1)!),
  route: `/${chemin}`,
})

/** Pages d'une leçon dans l'ordre de lecture : son intro, puis les autres */
export const pagesDe = (lecon: { intro?: Page; pages: Page[] }): Page[] =>
  lecon.intro ? [lecon.intro, ...lecon.pages] : lecon.pages

/** Pour comparer des noms sans tenir compte des majuscules ni des accents : "Récupérer" → "recuperer" */
export const normaliser = (texte: string): string =>
  texte.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()

/** Tri naturel : "2-b" avant "10-a" */
export const comparer = new Intl.Collator('fr', { numeric: true }).compare
