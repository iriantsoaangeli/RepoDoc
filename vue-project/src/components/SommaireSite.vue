<script setup lang="ts">
// Sommaire : thème → leçons (imbriquées) → pages, en listes imbriquées.
// Le titre d'une leçon mène à sa première page (son intro.md s'il existe).
import { RouterLink } from 'vue-router'
import SommaireLecons from './SommaireLecons.vue'
import type { Theme } from '@/lecteur/RouterMarkdown'

defineProps<{
  themes: Theme[]
  /** Affiche un titre h2 par thème (index général) */
  titres?: boolean
}>()
</script>

<template>
  <section v-for="theme in themes" :key="theme.slug">
    <h2 v-if="titres" :id="theme.slug">
      <RouterLink :to="theme.route">{{ theme.label }}</RouterLink>
    </h2>
    <ul>
      <li v-for="page in theme.pages" :key="page.route">
        <RouterLink :to="page.route">{{ page.label }}</RouterLink>
      </li>
      <SommaireLecons :lecons="theme.lecons" />
    </ul>
    <p v-if="!theme.pages.length && !theme.lecons.length">Aucune page pour l'instant.</p>
  </section>
</template>
