<script setup lang="ts">
// Tableau Markdown : en-tête + lignes, avec l'alignement des colonnes (:--, :-:, --:).
import { inline, type Tokens } from '@/markdown'

defineProps<{ table: Tokens.Table }>()
</script>

<template>
  <table>
    <thead>
      <tr>
        <th
          v-for="(cell, i) in table.header"
          :key="i"
          :style="cell.align ? { textAlign: cell.align } : undefined"
          v-html="inline(cell.tokens, cell.text)"
        ></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, r) in table.rows" :key="r">
        <td
          v-for="(cell, i) in row"
          :key="i"
          :style="cell.align ? { textAlign: cell.align } : undefined"
          v-html="inline(cell.tokens, cell.text)"
        ></td>
      </tr>
    </tbody>
  </table>
</template>
