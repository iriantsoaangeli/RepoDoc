import{Ct as e,Dt as t,Ft as n,Ht as r,Kt as i,Ot as a,a as o,bt as s,s as c}from"./MarkdownReader-DjcpB4M7.js";import{a as l,i as u,n as d,r as f,t as p}from"./MdBlocks-BMiw_CBz.js";var m={class:`ion-page`},h={class:`page-body`},g=`iriantsoaangeli/RepoDoc`,_=`## Principe

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
`,v=a({__name:`TemplateView`,setup(a){let v={label:`Mes notes`,to:`/_template`},y=[{label:`Accueil`,to:`/_template?t=accueil`},{label:`Réseaux`,to:`/_template?t=reseaux`,active:!0},{label:`Python`,to:`/_template?t=python`},{label:`Linux`,to:`/_template?t=linux`}],b=c(_),x=o(b).map(e=>({label:e.label,to:`#${e.id}`,level:e.level})),S=[{label:`Introduction`,to:`/_template?p=intro`},{label:`TCP`,to:`/_template`,active:!0},{label:`UDP`,to:`/_template?p=udp`}];return(a,o)=>(n(),e(`div`,m,[t(d,{brand:v,themes:y}),t(l,null,{toc:r(()=>[t(u,{title:`Sur cette page`,items:i(x)},null,8,[`items`])]),pages:r(()=>[t(u,{title:`Réseaux`,items:S})]),footer:r(()=>[t(f,{repo:g})]),default:r(()=>[o[0]||=s(`div`,{class:`breadcrumb`},`Réseaux › TCP`,-1),o[1]||=s(`h1`,null,`TCP`,-1),s(`article`,h,[t(p,{tokens:i(b)},null,8,[`tokens`])])]),_:1})]))}});export{v as default};