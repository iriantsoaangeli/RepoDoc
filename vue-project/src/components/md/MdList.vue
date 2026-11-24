<script setup lang="ts">
// Liste Markdown : à puces, numérotée, ou de tâches (- [x], case rendue par MdBlocks).
// Chaque élément peut contenir d'autres blocs (sous-listes, code…) → MdBlocks.
import type { Tokens } from '@/markdown'
import MdBlocks from './MdBlocks.vue'

defineProps<{ list: Tokens.List }>()
</script>

<template>
  <component :is="list.ordered ? 'ol' : 'ul'" :start="list.ordered && list.start !== '' ? list.start : undefined">
    <li v-for="(item, i) in list.items" :key="i">
      <MdBlocks :tokens="item.tokens" />
    </li>
  </component>
</template>
