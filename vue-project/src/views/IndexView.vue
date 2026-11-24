<script setup lang="ts">
// Index : sommaire de tout le site (/) ou d'un seul thème (/:theme).
// Affiche d'abord l'intro.md correspondant, s'il existe.
import { computed, ref, watch } from 'vue'
import DocLayout from '@/components/DocLayout.vue'
import LeconsBar from '@/components/LeconsBar.vue'
import SideBar from '@/components/SideBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SommaireSite from '@/components/SommaireSite.vue'
import MdBlocks from '@/components/md/MdBlocks.vue'
import { lirePage, type PageLue } from '@/lecteur/MarkdownReader'
import { entreeLecon, themesHeader, useSite } from '@/lecteur/RouterMarkdown'

const props = defineProps<{ theme?: string }>()
const etat = useSite()
const site = computed(() => etat.site!)

const theme = computed(() => site.value.themes.find((t) => t.slug === props.theme))
const introuvable = computed(() => props.theme && !theme.value)
const titre = computed(() => theme.value?.label ?? site.value.titre)

// intro.md du thème, ou de la racine pour l'index général
const intro = ref<PageLue>()
watch(
  () => (props.theme ? theme.value?.intro : site.value.intro),
  async (page) => {
    intro.value = page ? await lirePage(page.chemin).catch(() => undefined) : undefined
  },
  { immediate: true },
)
watch(titre, (t) => (document.title = t), { immediate: true })
</script>

<template>
  <div class="ion-page">
    <SiteHeader :brand="{ label: site.titre, to: '/' }" :themes="themesHeader(site, props.theme)" />

    <DocLayout>
      <template #toc>
        <SideBar
          v-if="theme"
          title="Leçons"
          :items="theme.lecons.map((l) => ({ label: l.label, to: entreeLecon(l)?.route ?? theme!.route }))"
        />
        <SideBar
          v-else
          title="Thèmes"
          :items="site.themes.map((t) => ({ label: t.label, to: t.route }))"
        />
      </template>

      <template v-if="theme" #pages>
        <LeconsBar :theme="theme" />
      </template>

      <template v-if="introuvable">
        <h1>Thème introuvable</h1>
        <p><RouterLink to="/">Retour à l'accueil</RouterLink></p>
      </template>
      <template v-else>
        <div v-if="theme" class="breadcrumb"><RouterLink to="/">Accueil</RouterLink> › {{ theme.label }}</div>
        <h1>{{ intro?.titre ?? titre }}</h1>
        <article class="page-body">
          <MdBlocks v-if="intro" :tokens="intro.tokens" />
          <SommaireSite :themes="theme ? [theme] : site.themes" :titres="!theme" />
        </article>
      </template>

      <template #footer>
        <SiteFooter v-if="site.repo" :repo="site.repo" />
      </template>
    </DocLayout>
  </div>
</template>
