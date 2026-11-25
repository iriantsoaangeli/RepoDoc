/** Un lien de navigation (thème, page…) */
export interface NavLink {
  label: string
  to: string
  active?: boolean
}

/** Un lien de barre latérale. level (2 ou 3) sert à indenter la table des matières. */
export interface SideItem extends NavLink {
  level?: number
}
