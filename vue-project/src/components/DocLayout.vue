<script setup lang="ts">
// Mise en page d'une page de doc, basée sur IonSplitPane :
//   ordinateur : table des matières | contenu | pages du thème
//   mobile     : un seul menu coulissant qui contient les deux listes
// Slots : toc (reçoit `actif` = id du titre en cours de lecture), pages, default, footer.
import { IonContent, IonMenu, IonSplitPane, menuController } from '@ionic/vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const main = ref<InstanceType<typeof IonContent>>()
const actif = ref('')
const route = useRoute()

// Liens d'ancre (#titre) : on fait défiler au lieu de laisser le routeur changer de page,
// puis on referme le menu mobile.
const onSideClick = (e: MouseEvent) => {
  const link = (e.target as HTMLElement).closest('a')
  if (!link) return
  const href = link.getAttribute('href') ?? ''
  if (href.startsWith('#') && !href.startsWith('#/')) {
    e.preventDefault()
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }
  menuController.close()
}

// Surligne dans la table des matières le dernier titre passé sous le header
const suivreTitre = () => {
  const titres = [...document.querySelectorAll<HTMLElement>('.page-body h2[id], .page-body h3[id]')]
  let courant = titres[0]
  for (const h of titres) if (h.getBoundingClientRect().top < 140) courant = h
  actif.value = courant?.id ?? ''
}

// Nouvelle page : on remonte en haut
watch(
  () => route.path,
  () => {
    main.value?.$el.scrollToTop(0)
    actif.value = ''
  },
)
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

      <IonContent id="main" ref="main" :scroll-events="true" @ion-scroll="suivreTitre">
        <main class="content"><slot /></main>
        <slot name="footer" />
      </IonContent>

      <!-- Sur ordinateur seulement : colonne de droite -->
      <aside class="pages-col pages-desk ion-hide-lg-down" @click="onSideClick">
        <slot name="pages" />
      </aside>
    </IonSplitPane>
  </div>
</template>
