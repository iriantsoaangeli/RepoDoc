<script setup lang="ts">
// Sidebar droite : pages directes du thème, puis ses leçons en accordéon pliable.
// Les leçons qui contiennent la page courante sont ouvertes par défaut.
import { RouterLink } from 'vue-router'
import ArbreLecons from './ArbreLecons.vue'
import type { Theme } from '@/lecteur/RouterMarkdown'

defineProps<{
  theme: Theme
  /** Route de la page affichée */
  actif?: string
  /** Chemins des leçons à ouvrir */
  ouvertes?: string[]
}>()
</script>

<template>
  <p class="side-title">{{ theme.label }}</p>
  <ul v-if="theme.pages.length" class="side-list">
    <li v-for="page in theme.pages" :key="page.route">
      <RouterLink :to="page.route" :class="{ active: page.route === actif }">{{ page.label }}</RouterLink>
    </li>
  </ul>

  <ArbreLecons :lecons="theme.lecons" :actif="actif" :ouvertes="ouvertes" />
</template>
