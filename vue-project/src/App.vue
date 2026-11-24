<script setup lang="ts">
// Attend que le site (config + liste des .md) soit chargé avant d'afficher les pages.
import { IonApp } from '@ionic/vue'
import { RouterView } from 'vue-router'
import { useSite } from '@/lecteur/RouterMarkdown'

const etat = useSite()
</script>

<template>
  <IonApp>
    <main v-if="etat.chargement" class="content">Chargement…</main>
    <main v-else-if="etat.erreur" class="content">
      <h1>Impossible de charger le site</h1>
      <p>{{ etat.erreur }}</p>
    </main>
    <RouterView v-else />
  </IonApp>
</template>
