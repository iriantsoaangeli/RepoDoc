# PDF

Un PDF s'affiche **dans le site**, comme une page : header, fil d'Ariane et colonne des leçons restent autour, et seul le lecteur PDF défile.

## Ajouter un PDF

1. Ranger le fichier n'importe où dans un thème, par exemple dans un sous-dossier de la leçon :
   ```
   app/md/cours/gestion-rh/contrat-de-travail-model/cdd.pdf
   ```
2. Faire un lien vers lui depuis un `.md`, avec n'importe quelle forme de la section [Liens](04-liens.md) :
   ```markdown
   [Modèle de CDD](cdd.pdf)
   [Modèle de CDD](contrat-de-travail-model/cdd.pdf)
   [Modèle de CDD](/cours/gestion-rh/contrat-de-travail-model/cdd.pdf)
   ```

Le lien ouvre la page `#/cours/gestion-rh/contrat-de-travail-model/cdd.pdf`.

## Bon à savoir

- Les PDF **n'apparaissent pas dans la colonne de droite** : on les ouvre depuis un lien dans une page.
- Le PDF s'ouvre ajusté à la largeur, avec le lecteur intégré du navigateur.
- Au-dessus du lecteur : **Ouvrir dans un nouvel onglet** et **Télécharger**. Utile sur mobile, où certains navigateurs n'affichent pas le PDF dans la page.
- Pas de « Précédent / Suivant » sur une page PDF.
