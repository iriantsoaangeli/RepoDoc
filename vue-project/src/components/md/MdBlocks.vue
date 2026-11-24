<script setup lang="ts">
// Affiche une liste de blocs Markdown : chaque type récurrent a son composant
// (MdTable, MdCode, MdList), le reste est rendu en HTML simple.
import { blocs, inline, slug, type Token, type Tokens } from '@/markdown'
import MdCode from './MdCode.vue'
import MdList from './MdList.vue'
import MdTable from './MdTable.vue'

defineProps<{ tokens: Token[] }>()

// Les champs ne sont pas typés par bloc dans le template : on caste ici
const as = <T,>(t: Token) => t as unknown as T
const html = (t: Token) => blocs([t])
</script>

<template>
  <template v-for="(t, i) in tokens" :key="i">
    <component
      :is="`h${as<Tokens.Heading>(t).depth}`"
      v-if="t.type === 'heading'"
      :id="slug(as<Tokens.Heading>(t).text)"
      :innerHTML="inline(as<Tokens.Heading>(t).tokens)"
    />
    <p v-else-if="t.type === 'paragraph'" v-html="inline(as<Tokens.Paragraph>(t).tokens)"></p>
    <!-- texte d'un élément de liste serrée -->
    <span
      v-else-if="t.type === 'text'"
      v-html="inline(as<Tokens.Text>(t).tokens, as<Tokens.Text>(t).text)"
    ></span>
    <!-- case d'une liste de tâches (- [x]) -->
    <input
      v-else-if="t.type === 'checkbox'"
      type="checkbox"
      :checked="as<Tokens.Checkbox>(t).checked"
      disabled
    />
    <MdCode
      v-else-if="t.type === 'code'"
      :text="as<Tokens.Code>(t).text"
      :lang="as<Tokens.Code>(t).lang"
    />
    <MdTable v-else-if="t.type === 'table'" :table="as<Tokens.Table>(t)" />
    <MdList v-else-if="t.type === 'list'" :list="as<Tokens.List>(t)" />
    <blockquote v-else-if="t.type === 'blockquote'">
      <MdBlocks :tokens="as<Tokens.Blockquote>(t).tokens" />
    </blockquote>
    <template v-else-if="t.type === 'space'"></template>
    <!-- hr, html brut, et tout autre bloc -->
    <div v-else v-html="html(t)"></div>
  </template>
</template>
