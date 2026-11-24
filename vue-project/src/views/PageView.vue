<script setup lang="ts">
// Une page .md : table des matières à gauche, leçons du thème à droite,
// fil d'Ariane, contenu, précédent / suivant.
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import DocLayout from '@/components/DocLayout.vue'
import LeconsBar from '@/components/LeconsBar.vue'
import SideBar from '@/components/SideBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import MdBlocks from '@/components/md/MdBlocks.vue'
import { lirePage, type PageLue } from '@/lecteur/MarkdownReader'
import { entreeLecon, pagesOrdonnees, themesHeader, trouverPage, useSite } from '@/lecteur/RouterMarkdown'

const props = defineProps<{ theme: string; chemin: string[] }>()
const etat = useSite()
const site = computed(() => etat.site!)

const trouve = computed(() => trouverPage(site.value, props.theme, props.chemin))

// Précédent / suivant dans l'ordre du thème
const voisins = computed(() => {
  if (!trouve.value) return {}
  const pages = pagesOrdonnees(trouve.value.theme)
  const i = pages.indexOf(trouve.value.page)
  return { prec: pages[i - 1], suiv: pages[i + 1] }
})

const lue = ref<PageLue>()
const erreur = ref('')
watch(
  () => trouve.value?.page,
  async (page) => {
    lue.value = undefined
    erreur.value = ''
    if (!page) return
    try {
      lue.value = await lirePage(page.chemin)
      document.title = `${lue.value.titre ?? page.label} · ${trouve.value!.theme.label}`
    } catch (e) {
      erreur.value = e instanceof Error ? e.message : String(e)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="ion-page">
    <SiteHeader :brand="{ label: site.titre, to: '/' }" :themes="themesHeader(site, props.theme)" />

    <DocLayout>
      <template #toc="{ actif }">
        <SideBar
          title="Sur cette page"
          :items="(lue?.toc ?? []).map((h) => ({ label: h.label, to: `#${h.id}`, level: h.level, active: h.id === actif }))"
        />
      </template>

      <template v-if="trouve" #pages>
        <LeconsBar :theme="trouve.theme" :actif="trouve.page.route" :lecon-active="trouve.lecon?.slug" />
      </template>

      <template v-if="!trouve">
        <h1>Page introuvable</h1>
        <p><RouterLink to="/">Retour à l'accueil</RouterLink></p>
      </template>
      <template v-else>
        <div class="breadcrumb">
          <RouterLink :to="trouve.theme.route">{{ trouve.theme.label }}</RouterLink>
          <template v-if="trouve.lecon">
            ›
            <RouterLink :to="entreeLecon(trouve.lecon)!.route">{{ trouve.lecon.label }}</RouterLink>
          </template>
          › {{ trouve.page.label }}
        </div>
        <h1>{{ lue?.titre ?? trouve.page.label }}</h1>
        <p v-if="erreur">{{ erreur }}</p>
        <article v-else-if="lue" class="page-body">
          <MdBlocks :tokens="lue.tokens" />
        </article>
        <p v-else>Chargement…</p>

        <nav v-if="voisins.prec || voisins.suiv" class="page-nav">
          <RouterLink v-if="voisins.prec" :to="voisins.prec.route"><small>Précédent</small>{{ voisins.prec.label }}</RouterLink>
          <span v-else></span>
          <RouterLink v-if="voisins.suiv" :to="voisins.suiv.route" class="next"><small>Suivant</small>{{ voisins.suiv.label }}</RouterLink>
        </nav>
      </template>

      <template #footer>
        <SiteFooter v-if="site.repo" :repo="site.repo" />
      </template>
    </DocLayout>
  </div>
</template>
