<script setup lang="ts">
// Barre latérale : un titre + une liste de liens.
// Sert pour la table des matières (liens #ancre, avec niveaux) et pour les pages du thème.
import { RouterLink } from 'vue-router'
import type { SideItem } from '@/types'

defineProps<{
  title: string
  items: SideItem[]
}>()
</script>

<template>
  <p class="side-title">{{ title }}</p>
  <ul class="side-list">
    <li v-for="item in items" :key="item.to" :class="item.level ? `h${item.level}` : undefined">
      <!-- Ancre dans la page : lien simple (DocLayout gère le défilement) -->
      <a v-if="item.to.startsWith('#')" :href="item.to" :class="{ active: item.active }">{{ item.label }}</a>
      <RouterLink v-else :to="item.to" :class="{ active: item.active }">{{ item.label }}</RouterLink>
    </li>
  </ul>
</template>
