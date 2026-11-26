<script setup lang="ts">
// Leçons pliables (accordéon Ionic), à n'importe quelle profondeur : chaque leçon contient
// ses pages, puis ses sous-leçons, pliables elles aussi (ce composant s'appelle lui-même).
import { IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/vue'
import { RouterLink } from 'vue-router'
import { pagesDe, type Lecon } from '@/lecteur/RouterMarkdown'

const props = defineProps<{
  lecons: Lecon[]
  /** Route de la page affichée */
  actif?: string
  /** Chemins des leçons à ouvrir (celles qui contiennent la page affichée) */
  ouvertes?: string[]
}>()

// Seules les leçons de ce niveau comptent pour ce groupe
const ouvertesIci = () => props.lecons.map((l) => l.chemin).filter((c) => props.ouvertes?.includes(c))
</script>

<template>
  <IonAccordionGroup :multiple="true" :value="ouvertesIci()">
    <IonAccordion v-for="lecon in lecons" :key="lecon.chemin" :value="lecon.chemin">
      <!-- slot = attribut de web component Ionic, pas un slot Vue -->
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <IonItem slot="header" lines="none">
        <IonLabel>{{ lecon.label }}</IonLabel>
      </IonItem>
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <ul slot="content" class="side-list">
        <li v-for="page in pagesDe(lecon)" :key="page.route">
          <RouterLink :to="page.route" :class="{ active: page.route === actif }">{{ page.label }}</RouterLink>
        </li>
        <!-- Sous-leçons dans la liste : décalées comme les pages -->
        <li v-if="lecon.lecons.length">
          <ArbreLecons :lecons="lecon.lecons" :actif="actif" :ouvertes="ouvertes" />
        </li>
      </ul>
    </IonAccordion>
  </IonAccordionGroup>
</template>
