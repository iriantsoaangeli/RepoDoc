<script setup lang="ts">
// Badge du header : connexion (online / offline) et état du cache hors ligne, toujours visibles.
// Sur petit écran, seule la précision « can view offline… » est masquée (gardée dans l'infobulle).
import { computed } from 'vue'
import { enLigne, etatCache } from '@/lecteur/HorsLigne'

const statut = computed(() => `Status: ${enLigne.value ? 'online' : 'offline'}`)
const cache = computed(
  () =>
    ({ charge: 'Cache: loaded', chargement: 'Cache: loading', indisponible: 'Cache: not loaded' })[
      etatCache.value
    ],
)
const detail = computed(() => (etatCache.value === 'charge' ? ', can view offline (PDF excluded)' : ''))
</script>

<template>
  <span
    class="etat-reseau"
    :class="{ 'hors-ligne': !enLigne }"
    :title="`${statut} · ${cache}${detail}`"
    role="status"
  >
    <span class="pastille" aria-hidden="true"></span>
    <span>{{ statut }} · {{ cache }}<span class="etat-detail">{{ detail }}</span></span>
  </span>
</template>
