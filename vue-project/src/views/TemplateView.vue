<script setup lang="ts">
// Page de vérification : reproduit template/template.html avec les composants.
// Le contenu des slots est encore statique, il viendra du .md plus tard.
import DocLayout from '@/components/DocLayout.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SideBar from '@/components/SideBar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import MdBlocks from '@/components/md/MdBlocks.vue'
import { headings, lex } from '@/markdown'
import type { NavLink, SideItem } from '@/types'

const brand: NavLink = { label: 'Mes notes', to: '/_template' }
const themes: NavLink[] = [
  { label: 'Accueil', to: '/_template?t=accueil' },
  { label: 'Réseaux', to: '/_template?t=reseaux', active: true },
  { label: 'Python', to: '/_template?t=python' },
  { label: 'Linux', to: '/_template?t=linux' },
]

// Plus tard : lu depuis la config globale (champ repo)
const repo = 'iriantsoaangeli/RepoDoc'

// Plus tard : le .md est chargé depuis app/md/
const md = `## Principe

TCP est un protocole **orienté connexion** qui garantit l'ordre et la livraison des données.

### Poignée de main

La connexion s'établit en trois étapes :

1. \`SYN\`
2. \`SYN-ACK\`
3. \`ACK\`

> À retenir : pas de données avant la fin de la poignée de main.

### Fermeture

- La fermeture utilise \`FIN\` et \`ACK\`
  - dans chaque sens
- [x] liste de tâches
- [ ] pas encore fait

## Exemple Python

\`\`\`python
import socket

with socket.create_connection(("example.com", 80)) as s:
    s.sendall(b"GET / HTTP/1.0\\r\\n\\r\\n")
    print(s.recv(1024))
\`\`\`

## Comparaison TCP / UDP

| Critère       | TCP | UDP |
|---------------|:---:|:---:|
| Connexion     | Oui | Non |
| Ordre garanti | Oui | Non |

---

Voir aussi la [RFC 793](https://www.rfc-editor.org/rfc/rfc793).
`

const tokens = lex(md)
const toc: SideItem[] = headings(tokens).map((h) => ({ label: h.label, to: `#${h.id}`, level: h.level }))
const pages: SideItem[] = [
  { label: 'Introduction', to: '/_template?p=intro' },
  { label: 'TCP', to: '/_template', active: true },
  { label: 'UDP', to: '/_template?p=udp' },
]
</script>

<template>
  <div class="ion-page">
    <SiteHeader :brand="brand" :themes="themes" />

    <DocLayout>
      <template #toc>
        <SideBar title="Sur cette page" :items="toc" />
      </template>

      <template #pages>
        <SideBar title="Réseaux" :items="pages" />
      </template>

      <div class="breadcrumb">Réseaux › TCP</div>
      <h1>TCP</h1>
      <article class="page-body">
        <MdBlocks :tokens="tokens" />
      </article>

      <template #footer>
        <SiteFooter :repo="repo" />
      </template>
    </DocLayout>
  </div>
</template>
