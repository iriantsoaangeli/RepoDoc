# Lire le site

| Élément | Rôle |
|---|---|
| **Header** | un onglet par thème ; **Accueil** = sommaire complet |
| **Colonne de gauche** « Sur cette page » | titres de la page, celui en cours est surligné |
| **Colonne de droite** | pages du thème, leçons pliables (celle de la page ouverte est dépliée) |
| **Fil d'Ariane** | Thème › Leçon › Sous-leçon… › Page |
| **Précédent / Suivant** | en bas de page, dans l'ordre du thème |
| **⟳** | recharge le site : affiche les pages poussées depuis son ouverture |
| **Mode sombre** | suit le réglage du système |

Sur mobile, les deux colonnes sont dans le menu **☰**.

## Adresses

L'adresse d'une page est le **chemin de son fichier** :

```
#/                                            accueil
#/reseaux                                     sommaire du thème
#/reseaux/01-couche-4/tcp.md                  une page
#/reseaux/01-couche-4/tcp.md#poignée-de-main  une section de la page
#/cours/gestion-rh/contrat-de-travail-model/cdd.pdf   un PDF
```

Pour partager une section avec quelqu'un, cliquer sur le titre dans « Sur cette page » puis copier l'adresse.

## Hors ligne

Le site reste **lisible sans internet** dès la première visite :

- à la première ouverture, l'application et **toutes les pages** sont gardées dans le navigateur, en arrière-plan (quelques dizaines de Ko) ;
- un **PDF** est gardé quand on l'ouvre : il reste lisible hors ligne ensuite, mais un PDF jamais ouvert ne l'est pas ;
- aux visites suivantes, **rien n'est retéléchargé** tant que rien n'a changé : seule une page modifiée (ou ajoutée) est récupérée ;
- une nouvelle version du **code** du site s'applique au rechargement suivant.
