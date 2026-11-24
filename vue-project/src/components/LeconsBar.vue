<script setup lang="ts">
// Sidebar droite : pages directes du thème, puis ses leçons en accordéon pliable.
// La leçon de la page courante est ouverte par défaut.
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/vue'
import { RouterLink } from 'vue-router'
import type { Theme } from '@/lecteur/RouterMarkdown'

defineProps<{
  theme: Theme
  /** Route de la page affichée */
  actif?: string
  /** Slug de la leçon à ouvrir */
  leconActive?: string
}>()
</script>

<template>
  <p class="side-title">{{ theme.label }}</p>
  <ul v-if="theme.pages.length" class="side-list">
    <li v-for="page in theme.pages" :key="page.route">
      <RouterLink :to="page.route" :class="{ active: page.route === actif }">{{ page.label }}</RouterLink>
    </li>
  </ul>

  <IonAccordionGroup :multiple="true" :value="leconActive ? [leconActive] : []">
    <IonAccordion v-for="lecon in theme.lecons" :key="lecon.slug" :value="lecon.slug">
      <!-- slot = attribut de web component Ionic, pas un slot Vue -->
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <IonItem slot="header" lines="none">
        <IonLabel>{{ lecon.label }}</IonLabel>
      </IonItem>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <ul slot="content" class="side-list">
        <li v-for="page in lecon.intro ? [lecon.intro, ...lecon.pages] : lecon.pages" :key="page.route">
          <RouterLink :to="page.route" :class="{ active: page.route === actif }">{{ page.label }}</RouterLink>
        </li>
      </ul>
    </IonAccordion>
  </IonAccordionGroup>
</template>
