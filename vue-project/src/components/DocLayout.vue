<script setup lang="ts">
// Mise en page d'une page de doc, basée sur IonSplitPane :
//   ordinateur : table des matières | contenu | pages du thème
//   mobile     : un seul menu coulissant qui contient les deux listes
// Slots : toc, pages, default (contenu), footer.
import { IonContent, IonMenu, IonSplitPane, menuController } from '@ionic/vue'

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
</script>

<template>
  <div class="doc-body">
    <IonSplitPane content-id="main" when="lg">
      <IonMenu content-id="main">
        <IonContent @click="onSideClick">
          <aside class="toc"><slot name="toc" /></aside>
          <!-- Sur mobile seulement : les pages du thème sont dans le même menu -->
          <aside class="pages-col ion-hide-lg-up"><slot name="pages" /></aside>
        </IonContent>
      </IonMenu>

      <IonContent id="main">
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
