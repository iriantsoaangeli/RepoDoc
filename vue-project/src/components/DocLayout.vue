<script setup lang="ts">
// Mise en page d'une page de doc, basée sur IonSplitPane :
//   ordinateur : table des matières | contenu | pages du thème
//   mobile     : un seul menu coulissant qui contient les deux listes
// Slots : toc (reçoit `actif` = id du titre en cours de lecture), pages, default, footer.
// Expose `positionner()`, à appeler par la vue quand le contenu est affiché.
import { IonContent, IonMenu, IonSplitPane, menuController } from '@ionic/vue'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const main = ref<InstanceType<typeof IonContent>>()
const actif = ref('')
const route = useRoute()
const router = useRouter()

// Un clic dans une sidebar referme le menu mobile
const onSideClick = () => menuController.close()

// Liens internes écrits dans le Markdown (href="#/…") : passent par le routeur,
// comme un RouterLink (sauf ctrl/cmd/maj + clic, laissés au navigateur)
const onContentClick = (e: MouseEvent) => {
  if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey)
    return
  const lien = (e.target as HTMLElement).closest('a')
  const href = lien?.getAttribute('href')
  if (!lien || !href?.startsWith('#/') || lien.target) return
  e.preventDefault()
  router.push(href.slice(1))
}

// Élément qui défile réellement (dans le shadow DOM d'IonContent), lu une fois
let zone: HTMLElement | undefined
const zoneDefilement = async () => (zone ??= await main.value?.$el.getScrollElement())

// Surligne dans la table des matières le dernier titre passé sous le header,
// ou le dernier titre de la page quand on est tout en bas
const suivreTitre = () => {
  const titres = [...document.querySelectorAll<HTMLElement>('.page-body h2[id], .page-body h3[id]')]
  let courant = titres[0]
  for (const h of titres) if (h.getBoundingClientRect().top < 140) courant = h
  if (zone && zone.scrollTop > 0 && zone.scrollTop + zone.clientHeight >= zone.scrollHeight - 4)
    courant = titres.at(-1)
  actif.value = courant?.id ?? ''
}

// Position de lecture de chaque page, pour la retrouver avec le bouton Retour
const positions = new Map<string, number>()
const onScroll = (e: CustomEvent<{ scrollTop: number }>) => {
  positions.set(route.fullPath, e.detail.scrollTop)
  suivreTitre()
}
let retour = false
const onPopstate = () => (retour = true)
onMounted(() => {
  addEventListener('popstate', onPopstate)
  zoneDefilement()
})
onBeforeUnmount(() => removeEventListener('popstate', onPopstate))

/** Fait défiler jusqu'au titre d'id donné. Faux s'il n'existe pas. */
const allerA = (id: string, doux = false): boolean => {
  const cible = document.getElementById(decodeURIComponent(id))
  cible?.scrollIntoView({ behavior: doux ? 'smooth' : 'auto' })
  return !!cible
}

/**
 * Place le défilement quand une page s'affiche : sur l'ancre de l'URL (#titre),
 * sinon à la position mémorisée si on revient en arrière, sinon en haut.
 */
const positionner = async () => {
  await nextTick()
  const contenu = main.value?.$el
  const y = positions.get(route.fullPath)
  if (route.hash && allerA(route.hash.slice(1))) {
    // déjà placé sur l'ancre
  } else if (retour && y !== undefined) await contenu?.scrollToPoint(0, y, 0)
  else await contenu?.scrollToTop(0)
  retour = false
  await zoneDefilement()
  suivreTitre()
}

// Clic sur un titre de la table des matières : même page, nouvelle ancre
watch(
  () => [route.path, route.hash] as const,
  ([chemin, ancre], [ancienChemin]) => {
    if (chemin === ancienChemin && ancre) allerA(ancre.slice(1), true)
  },
)

defineExpose({ positionner })
</script>

<template>
  <div class="doc-body">
    <IonSplitPane content-id="main" when="lg">
      <IonMenu content-id="main">
        <IonContent @click="onSideClick">
          <aside class="toc"><slot name="toc" :actif="actif" /></aside>
          <!-- Sur mobile seulement : les pages du thème sont dans le même menu -->
          <aside class="pages-col ion-hide-lg-up"><slot name="pages" /></aside>
        </IonContent>
      </IonMenu>

      <IonContent id="main" ref="main" :scroll-events="true" @ion-scroll="onScroll">
        <main class="content" @click="onContentClick"><slot /></main>
        <slot name="footer" />
      </IonContent>

      <!-- Sur ordinateur seulement : colonne de droite -->
      <aside class="pages-col pages-desk ion-hide-lg-down" @click="onSideClick">
        <slot name="pages" />
      </aside>
    </IonSplitPane>
  </div>
</template>
