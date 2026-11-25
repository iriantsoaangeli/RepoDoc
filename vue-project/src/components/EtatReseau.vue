<script setup lang="ts">
// Badge du header : connexion (online / offline) et état du cache hors ligne.
// Sur petit écran, seul « online / offline » est affiché ; le détail reste dans l'infobulle.
import { computed } from 'vue'
import { enLigne, etatCache } from '@/lecteur/HorsLigne'

const cache = computed(() =>
  etatCache.value === 'charge'
    ? 'Cache: loaded, can view offline (PDF excluded)'
    : etatCache.value === 'chargement'
      ? 'Cache: loading'
      : '', // dev : pas de cache hors ligne
)
const statut = computed(() => `Status: ${enLigne.value ? 'online' : 'offline'}`)
</script>

<template>
  <span
    class="etat-reseau"
    :class="{ 'hors-ligne': !enLigne }"
    :title="[statut, cache].filter(Boolean).join(' · ')"
    role="status"
  >
    <span class="pastille" aria-hidden="true"></span>
    <span>{{ statut }}</span>
    <span v-if="cache" class="etat-cache">· {{ cache }}</span>
  </span>
</template>
