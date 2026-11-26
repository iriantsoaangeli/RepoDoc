<script setup lang="ts">
// Leçons du sommaire, à n'importe quelle profondeur : titre de la leçon (mène à sa première
// page), ses pages, puis ses sous-leçons (ce composant s'appelle lui-même).
import { RouterLink } from 'vue-router'
import { entreeLecon, type Lecon } from '@/lecteur/RouterMarkdown'

defineProps<{ lecons: Lecon[] }>()
</script>

<template>
  <li v-for="lecon in lecons" :key="lecon.chemin">
    <RouterLink v-if="entreeLecon(lecon)" :to="entreeLecon(lecon)!.route"><strong>{{ lecon.label }}</strong></RouterLink>
    <ul>
      <li v-for="page in lecon.pages" :key="page.route">
        <RouterLink :to="page.route">{{ page.label }}</RouterLink>
      </li>
      <SommaireLecons :lecons="lecon.lecons" />
    </ul>
  </li>
</template>
