<script setup lang="ts">
// Poignée posée sur le bord intérieur d'une sidebar (ordinateur) :
// tirer = redimensionner, double-clic = largeur automatique, bouton = replier / rouvrir.
import { computed, ref } from 'vue'

const props = defineProps<{
  cote: 'gauche' | 'droite'
  /** Largeur actuelle de la colonne, en px */
  largeur: number
  ouverte: boolean
}>()
const emit = defineEmits<{ redimensionner: [largeur: number]; automatique: []; basculer: [] }>()

// Colonne repliée : poignée un peu en retrait du bord de l'écran, pour que le bouton reste
// entier et ne tombe pas sur la barre de défilement
const bord = computed(() => (props.ouverte ? props.largeur : 24))

const tire = ref(false)
let depart = 0
let largeurDepart = 0

const onDown = (e: PointerEvent) => {
  if (!props.ouverte || (e.target as HTMLElement).closest('button')) return
  e.preventDefault() // pas de sélection de texte pendant le glissé
  tire.value = true
  depart = e.clientX
  largeurDepart = props.largeur
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
const onMove = (e: PointerEvent) => {
  if (!tire.value) return
  const d = e.clientX - depart
  emit('redimensionner', largeurDepart + (props.cote === 'gauche' ? d : -d))
}
const onUp = () => (tire.value = false)
</script>

<template>
  <div
    class="poignee ion-hide-lg-down"
    :class="{ tire }"
    :style="{ left: cote === 'gauche' ? `${bord}px` : `calc(100% - ${bord}px)` }"
    title="Tirer pour redimensionner · double-clic : largeur automatique"
    @pointerdown="onDown"
    @pointermove="onMove"
    @pointerup="onUp"
    @pointercancel="onUp"
    @dblclick="emit('automatique')"
  >
    <button
      type="button"
      :aria-label="ouverte ? 'Replier la colonne' : 'Ouvrir la colonne'"
      :title="ouverte ? 'Replier la colonne' : 'Ouvrir la colonne'"
      @click="emit('basculer')"
    >
      {{ (cote === 'gauche') === ouverte ? '‹' : '›' }}
    </button>
  </div>
</template>
