<script setup lang="ts">
// Header du site : bouton menu (mobile), nom du site, liste des thèmes.
// IonMenuButton se cache tout seul quand les colonnes sont visibles (ordinateur).
import { IonButtons, IonHeader, IonMenuButton, IonToolbar } from '@ionic/vue'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { NavLink } from '@/types'

defineProps<{
  brand: NavLink
  themes: NavLink[]
}>()

const nav = ref<HTMLElement>()

// Garde le thème actif visible dans le header sur petit écran
onMounted(() => {
  nav.value?.querySelector('a.active')?.scrollIntoView({ inline: 'center', block: 'nearest' })
})
</script>

<template>
  <IonHeader>
    <IonToolbar>
      <!-- slot = attribut de web component Ionic, pas un slot Vue -->
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <IonButtons slot="start">
        <IonMenuButton />
      </IonButtons>
      <div class="site-header">
        <RouterLink class="brand" :to="brand.to">{{ brand.label }}</RouterLink>
        <nav ref="nav" class="themes">
          <RouterLink
            v-for="theme in themes"
            :key="theme.to"
            :to="theme.to"
            :class="{ active: theme.active }"
          >
            {{ theme.label }}
          </RouterLink>
        </nav>
      </div>
    </IonToolbar>
  </IonHeader>
</template>
