<script setup lang="ts">
// Barre latérale : un titre + une liste de liens.
// Sert pour la table des matières (liens /page#ancre, avec niveaux) et pour les listes de thèmes.
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
      <RouterLink :to="item.to" :class="{ active: item.active }">{{ item.label }}</RouterLink>
    </li>
  </ul>
</template>
