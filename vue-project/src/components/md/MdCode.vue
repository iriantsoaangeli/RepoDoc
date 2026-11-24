<script setup lang="ts">
// Bloc de code : coloration syntaxique + bouton « Copier ».
import { computed, ref } from 'vue'
import { highlight } from '@/markdown/highlight'

const props = defineProps<{ text: string; lang?: string }>()

const html = computed(() => highlight(props.text))
const copied = ref(false)

const copy = async () => {
  await navigator.clipboard.writeText(props.text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <pre><code :class="lang && `language-${lang}`" v-html="html"></code><button class="copy-btn" @click="copy">{{ copied ? 'Copié !' : 'Copier' }}</button></pre>
</template>
