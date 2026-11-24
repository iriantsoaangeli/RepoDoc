<script setup lang="ts">
// Header du site : bouton menu (mobile), nom du site, liste des thèmes, bouton recharger.
// IonMenuButton se cache tout seul quand les colonnes sont visibles (ordinateur).
import { IonButton, IonButtons, IonHeader, IonIcon, IonMenuButton, IonToolbar } from '@ionic/vue'
import { refreshOutline } from 'ionicons/icons'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { rechargerSansCache } from '@/lecteur/MarkdownReader'
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
      <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
      <IonButtons slot="end">
        <!-- Vide le cache de la liste des fichiers : affiche les pages poussées depuis -->
        <IonButton
          title="Recharger le contenu"
          aria-label="Recharger le contenu"
          @click="rechargerSansCache"
        >
          <!-- eslint-disable-next-line vue/no-deprecated-slot-attribute -->
          <IonIcon slot="icon-only" :icon="refreshOutline" />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>
</template>
