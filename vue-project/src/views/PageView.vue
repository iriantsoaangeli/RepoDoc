<script setup lang="ts">
// Une page .md : table des matières à gauche, leçons du thème à droite,
// fil d'Ariane, contenu, précédent / suivant.
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import DocLayout from '@/components/DocLayout.vue'
import LeconsBar from '@/components/LeconsBar.vue'
import SideBar from '@/components/SideBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import MdBlocks from '@/components/md/MdBlocks.vue'
import { lirePage, type PageLue } from '@/lecteur/MarkdownReader'
import {
  entreeLecon,
  leconDe,
  pagesOrdonnees,
  themesHeader,
  trouverLecon,
  trouverPage,
  useSite,
  type Page,
} from '@/lecteur/RouterMarkdown'

const props = defineProps<{ theme: string; chemin: string[] }>()
const etat = useSite()
const site = computed(() => etat.site!)
const route = useRoute()
const router = useRouter()
const layout = ref<InstanceType<typeof DocLayout>>()

const themeCourant = computed(() => site.value.themes.find((t) => t.slug === props.theme))
const trouve = computed(() => trouverPage(site.value, props.theme, props.chemin))
const lecon = computed(() => trouve.value && leconDe(trouve.value.theme, trouve.value.page))

// URL d'une leçon (/theme/lecon) : on ouvre sa première page
const leconSeule = computed(() =>
  !trouve.value && props.chemin.length === 1
    ? trouverLecon(site.value, props.theme, props.chemin[0]!)
    : undefined,
)
watch(
  leconSeule,
  (l) => {
    const entree = l && entreeLecon(l)
    if (entree) router.replace(entree.route)
  },
  { immediate: true },
)

// Précédent / suivant dans l'ordre du thème
const voisins = computed(() => {
  if (!trouve.value) return {}
  const pages = pagesOrdonnees(trouve.value.theme)
  const i = pages.indexOf(trouve.value.page)
  return { prec: pages[i - 1], suiv: pages[i + 1] }
})
// "Couche 7 · Dns" quand la page voisine est dans une autre leçon
const libelleVoisin = (page: Page) => {
  const sa = leconDe(trouve.value!.theme, page)
  return sa && sa !== lecon.value ? `${sa.label} · ${page.label}` : page.label
}

const lue = ref<PageLue>()
const erreur = ref('')
watch(
  () => trouve.value?.page,
  async (page) => {
    lue.value = undefined
    erreur.value = ''
    if (!page) {
      if (!leconSeule.value) {
        document.title = 'Page introuvable'
        layout.value?.positionner()
      }
      return
    }
    try {
      lue.value = await lirePage(page.chemin)
      document.title = `${lue.value.titre ?? page.label} · ${trouve.value!.theme.label}`
    } catch (e) {
      erreur.value = e instanceof Error ? e.message : String(e)
    }
    layout.value?.positionner()
  },
  { immediate: true },
)
</script>

<template>
  <div class="ion-page">
    <SiteHeader :brand="{ label: site.titre, to: '/' }" :themes="themesHeader(site, props.theme)" />

    <DocLayout ref="layout">
      <template #toc="{ actif }">
        <SideBar
          v-if="lue?.toc.length"
          title="Sur cette page"
          :items="
            lue.toc.map((h) => ({
              label: h.label,
              to: `${route.path}#${h.id}`,
              level: h.level,
              active: h.id === actif,
            }))
          "
        />
      </template>

      <template v-if="themeCourant" #pages>
        <LeconsBar :theme="themeCourant" :actif="trouve?.page.route" :lecon-active="lecon?.slug" />
      </template>

      <template v-if="!trouve">
        <h1>Page introuvable</h1>
        <p v-if="themeCourant">
          Cette page n'existe pas (ou plus) dans
          <RouterLink :to="themeCourant.route">{{ themeCourant.label }}</RouterLink
          >. Les pages du thème sont listées dans le menu.
        </p>
        <p v-else><RouterLink to="/">Retour à l'accueil</RouterLink></p>
      </template>
      <template v-else>
        <div class="breadcrumb">
          <RouterLink :to="trouve.theme.route">{{ trouve.theme.label }}</RouterLink>
          <template v-if="lecon">
            ›
            <!-- Leçon sans intro : son entrée est la page affichée, pas de lien vers soi-même -->
            <template v-if="entreeLecon(lecon) === trouve.page">{{ lecon.label }}</template>
            <RouterLink v-else :to="`${trouve.theme.route}/${lecon.slug}`">{{
              lecon.label
            }}</RouterLink>
          </template>
          › {{ trouve.page.label }}
        </div>
        <h1>{{ lue?.titre ?? trouve.page.label }}</h1>
        <p v-if="erreur">{{ erreur }}</p>
        <article v-else-if="lue" class="page-body">
          <MdBlocks :tokens="lue.tokens" />
        </article>
        <p v-else>Chargement…</p>

        <nav class="page-nav">
          <RouterLink v-if="voisins.prec" :to="voisins.prec.route"
            ><small>Précédent</small>{{ libelleVoisin(voisins.prec) }}</RouterLink
          >
          <span v-else></span>
          <RouterLink v-if="voisins.suiv" :to="voisins.suiv.route" class="next"
            ><small>Suivant</small>{{ libelleVoisin(voisins.suiv) }}</RouterLink
          >
          <!-- Fin du thème : retour au sommaire -->
          <RouterLink v-else :to="trouve.theme.route" class="next"
            ><small>Fin du thème</small>Sommaire de {{ trouve.theme.label }}</RouterLink
          >
        </nav>
      </template>

      <template #footer>
        <SiteFooter v-if="site.repo" :repo="site.repo" />
      </template>
    </DocLayout>
  </div>
</template>
