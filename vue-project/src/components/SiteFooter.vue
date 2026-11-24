<script setup lang="ts">
// Footer du site : logo GitHub, lien vers le code source et vers le compte.
import { IonIcon } from '@ionic/vue'
import { logoGithub } from 'ionicons/icons'
import { computed } from 'vue'

const props = defineProps<{
  /** Dépôt au format "compte/repo" */
  repo: string
}>()

const owner = computed(() => props.repo.split('/')[0])
</script>

<template>
  <footer class="site-footer">
    <IonIcon :icon="logoGithub" aria-hidden="true" />
    <a :href="`https://github.com/${repo}`" target="_blank" rel="noopener">Code source ici</a>,
    by <a :href="`https://github.com/${owner}`" target="_blank" rel="noopener">{{ owner }}</a>
  </footer>
</template>
