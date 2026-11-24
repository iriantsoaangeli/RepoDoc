import{It as e,Mt as t,Tt as n,dt as r,mt as i,r as a,t as o,vt as s,yt as c}from"./markdown-DchkBjF_.js";import{a as l,i as u,n as d,r as f,t as p}from"./MdBlocks-BVrCergv.js";var m={class:`ion-page`},h={class:`page-body`},g=`iriantsoaangeli/RepoDoc`,_=`## Principe

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
`,v=c({__name:`TemplateView`,setup(c){let v={label:`Mes notes`,to:`/_template`},y=[{label:`Accueil`,to:`/_template?t=accueil`},{label:`Réseaux`,to:`/_template?t=reseaux`,active:!0},{label:`Python`,to:`/_template?t=python`},{label:`Linux`,to:`/_template?t=linux`}],b=a(_),x=o(b).map(e=>({label:e.label,to:`#${e.id}`,level:e.level})),S=[{label:`Introduction`,to:`/_template?p=intro`},{label:`TCP`,to:`/_template`,active:!0},{label:`UDP`,to:`/_template?p=udp`}];return(a,o)=>(n(),i(`div`,m,[s(d,{brand:v,themes:y}),s(l,null,{toc:t(()=>[s(u,{title:`Sur cette page`,items:e(x)},null,8,[`items`])]),pages:t(()=>[s(u,{title:`Réseaux`,items:S})]),footer:t(()=>[s(f,{repo:g})]),default:t(()=>[o[0]||=r(`div`,{class:`breadcrumb`},`Réseaux › TCP`,-1),o[1]||=r(`h1`,null,`TCP`,-1),r(`article`,h,[s(p,{tokens:e(b)},null,8,[`tokens`])])]),_:1})]))}});export{v as default};