import{At as e,Ct as t,Et as n,Gt as r,Rt as i,Yt as a,jt as o,l as s,s as c}from"./MarkdownReader-D0UB4B0O.js";import{a as l,i as u,n as d,r as f,t as p}from"./MdBlocks-Blj8XEkR.js";var m={class:`ion-page`},h={class:`page-body`},g=`iriantsoaangeli/RepoDoc`,_=`## Principe

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
`,v=o({__name:`TemplateView`,setup(o){let v={label:`Mes notes`,to:`/_template`},y=[{label:`Accueil`,to:`/_template?t=accueil`},{label:`Réseaux`,to:`/_template?t=reseaux`,active:!0},{label:`Python`,to:`/_template?t=python`},{label:`Linux`,to:`/_template?t=linux`}],b=s(_),x=c(b).map(e=>({label:e.label,to:`#${e.id}`,level:e.level})),S=[{label:`Introduction`,to:`/_template?p=intro`},{label:`TCP`,to:`/_template`,active:!0},{label:`UDP`,to:`/_template?p=udp`}];return(o,s)=>(i(),n(`div`,m,[e(d,{brand:v,themes:y}),e(l,null,{toc:r(()=>[e(u,{title:`Sur cette page`,items:a(x)},null,8,[`items`])]),pages:r(()=>[e(u,{title:`Réseaux`,items:S})]),footer:r(()=>[e(f,{repo:g})]),default:r(()=>[s[0]||=t(`div`,{class:`breadcrumb`},`Réseaux › TCP`,-1),s[1]||=t(`h1`,null,`TCP`,-1),t(`article`,h,[e(p,{tokens:a(b)},null,8,[`tokens`])])]),_:1})]))}});export{v as default};