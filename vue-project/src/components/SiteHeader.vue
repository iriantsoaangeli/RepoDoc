<script setup lang="ts">
// Header du site : bouton menu (mobile), nom du site, liste des thèmes, bouton recharger.
// IonMenuButton se cache tout seul quand les colonnes sont visibles (ordinateur).
import { IonButton, IonButtons, IonHeader, IonIcon, IonMenuButton, IonToolbar } from '@ionic/vue'
import { refreshOutline } from 'ionicons/icons'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { rechargerSansCache } from '@/lecteur/MarkdownReader'
import type { NavLink } from '@/types'

const props = defineProps<{
  brand: NavLink
  themes: NavLink[]
}>()

const nav = ref<HTMLElement>()

// Petit écran : centre le thème actif dans la liste des thèmes (qui défile en largeur)
const centrerActif = async () => {
  await nextTick()
  requestAnimationFrame(() => {
    const zone = nav.value
    const actif = zone?.querySelector<HTMLElement>('a.active')
    if (!zone || !actif) return
    // Positions à l'écran (offsetLeft serait relatif à la toolbar, pas à la liste)
    const z = zone.getBoundingClientRect()
    const a = actif.getBoundingClientRect()
    zone.scrollLeft += a.left - z.left - (z.width - a.width) / 2
  })
}
watch(() => props.themes.find((t) => t.active)?.to, centrerActif, { immediate: true })
// La largeur de la liste n'est connue qu'une fois le header rendu (polices, boutons Ionic)
const observateur = new ResizeObserver(centrerActif)
onMounted(() => nav.value && observateur.observe(nav.value))
onBeforeUnmount(() => observateur.disconnect())
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
