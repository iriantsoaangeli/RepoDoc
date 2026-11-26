// Largeur d'une sidebar sur ordinateur : automatique (le nom le plus long tient sans être coupé),
// choisie à la main avec la poignée, ou repliée. Largeur choisie et repli retenus d'une visite à l'autre.
import { computed, ref, watch } from 'vue'

/** Bornes de la largeur, en px */
const MIN = 140
const maxAuto = () => innerWidth * 0.4
const maxMain = () => innerWidth * 0.6
const borner = (l: number, max: number) => Math.round(Math.min(Math.max(l, MIN), max))

/** Largeur du texte d'un élément, même coupé par « … » */
const largeurTexte = (el: Element) => {
  const r = document.createRange()
  r.selectNodeContents(el)
  return r.getBoundingClientRect().width
}

export const useColonne = (cle: string, base: number) => {
  const memo = `repodoc.colonne.${cle}`
  const lu = JSON.parse(localStorage.getItem(memo) ?? '{}') as { largeur?: number; ouverte?: boolean }
  /** Largeur choisie à la main, null = automatique */
  const choisie = ref<number | null>(lu.largeur ?? null)
  const ouverte = ref(lu.ouverte ?? true)
  const auto = ref(base)
  watch([choisie, ouverte], () =>
    localStorage.setItem(memo, JSON.stringify({ largeur: choisie.value, ouverte: ouverte.value })),
  )

  const largeur = computed(() => choisie.value ?? auto.value)
  /** Largeur à appliquer : 0 quand la colonne est repliée */
  const px = computed(() => `${ouverte.value ? largeur.value : 0}px`)

  /**
   * Largeur automatique = place prise par le nom affiché le plus long.
   * Pour chaque nom : marge à sa gauche + son texte complet + ses marges internes + marge à sa droite.
   */
  const mesurer = (colonne: HTMLElement, selecteur: string) => {
    const boite = colonne.getBoundingClientRect()
    if (!boite.width) return // repliée, ou mobile
    let besoin = base
    for (const el of colonne.querySelectorAll<HTMLElement>(selecteur)) {
      const r = el.getBoundingClientRect()
      if (!r.width) continue // dans une leçon pliée
      const s = getComputedStyle(el)
      const interne = parseFloat(s.paddingLeft) + parseFloat(s.paddingRight)
      besoin = Math.max(besoin, r.left - boite.left + interne + largeurTexte(el) + boite.right - r.right + 1)
    }
    auto.value = borner(besoin, maxAuto())
  }

  return {
    ouverte,
    largeur,
    px,
    mesurer,
    redimensionner: (l: number) => (choisie.value = borner(l, maxMain())),
    automatique: () => (choisie.value = null),
    basculer: () => (ouverte.value = !ouverte.value),
  }
}
