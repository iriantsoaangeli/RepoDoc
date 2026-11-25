<script setup lang="ts">
// Tableau Markdown : en-tête + lignes, avec l'alignement des colonnes (:--, :-:, --:).
import { inline, type Tokens } from '@/markdown'

defineProps<{ table: Tokens.Table }>()

const cellule = (cell: Tokens.TableCell) => ({
  style: cell.align ? { textAlign: cell.align } : undefined,
  innerHTML: inline(cell.tokens, cell.text),
})
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="(cell, i) in table.header" :key="i" v-bind="cellule(cell)"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, r) in table.rows" :key="r">
        <td v-for="(cell, i) in row" :key="i" v-bind="cellule(cell)"></td>
      </tr>
    </tbody>
  </table>
</template>
