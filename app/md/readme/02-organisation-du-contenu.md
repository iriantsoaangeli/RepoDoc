# Organisation du contenu

Tout le contenu est dans `app/md/`. L'arborescence fait la navigation :

```
app/md/
├── config.yaml                 configuration globale (titre, dépôt, pages cachées)
├── intro.md                    texte de la page d'accueil
│
├── reseaux/                    ← THÈME   : un onglet dans le header
│   ├── intro.md                texte affiché en haut du sommaire du thème
│   ├── config.yaml             (facultatif) pages cachées de ce thème
│   ├── glossaire.md            ← PAGE posée directement dans le thème
│   │
│   ├── 01-couche-4/            ← LEÇON (sujet) : un bloc pliable dans la colonne de droite
│   │   ├── intro.md            première page de la leçon, nommée « Introduction »
│   │   ├── tcp.md              ← PAGE
│   │   └── udp.md
│   │
│   └── corba/
│       └── Mise en pratique Corba.md
│
└── cours/
    └── gestion-rh/
        ├── Gestion de resources humaines.md
        └── contrat-de-travail-model/     ← dossier de PDF (voir « PDF »)
            └── cdd.pdf
```

## Les trois niveaux

| Niveau | Ce que c'est | Où il apparaît |
|---|---|---|
| **Thème** | dossier de premier niveau | onglet dans le header, sommaire `#/theme` |
| **Leçon** (sujet) | sous-dossier d'un thème | bloc pliable dans la colonne de droite |
| **Page** | fichier `.md` dans un thème ou une leçon | lien dans la colonne de droite |

**Trois niveaux maximum** pour les `.md` : un fichier plus profond (`theme/lecon/sous-dossier/page.md`) est **ignoré**. Seuls les PDF peuvent être rangés plus profond.

## Les fichiers `intro.md`

| Emplacement | Rôle |
|---|---|
| `app/md/intro.md` | texte de la page d'accueil, au-dessus du sommaire complet |
| `theme/intro.md` | texte en haut du sommaire du thème ; pas de lien dans la colonne de droite |
| `theme/lecon/intro.md` | première page de la leçon, affichée sous le nom « Introduction » |

Tous sont facultatifs.

## Noms et ordre

Les libellés affichés viennent des **noms de fichiers et de dossiers** :

- les `-` et `_` deviennent des espaces, la première lettre passe en majuscule : `gestion-rh` → « Gestion rh », `tcp.md` → « Tcp » ;
- un **préfixe numérique fixe l'ordre** et n'est pas affiché : `01-couche-4` → « Couche 4 », placé avant `02-couche-7` ;
- sans préfixe, l'ordre est alphabétique.

Le nom du fichier est aussi le libellé dans la colonne de droite : choisir un nom lisible (`Guide d'utilisation de Maven.md` plutôt que `gm.md`).

> **À éviter dans les noms** : `?` et `#`. Ils coupent l'adresse du fichier et la page ne se charge pas. Les espaces, accents, apostrophes et parenthèses ne posent pas de problème.
