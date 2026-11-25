
> Tout se fait au terminal : aucune extension ni login d'IDE nécessaire. `<...>` = valeur à remplacer. `[...]` = optionnel.

## Sommaire


---

## 1. Configuration initiale

À faire une seule fois par machine.

```bash
git config --global user.name  "Ton Nom"
git config --global user.email "ton@email.com"
git config --global init.defaultBranch main    # branche par défaut = main
git config --global core.editor "code --wait"  # éditeur (VS Code), optionnel
git config --global pull.rebase false          # pull = merge (comportement classique)

git config --list                  # voir toute la config
git config --global --list         # config globale seulement
git config user.name               # voir une valeur
git config --global --unset <clé>  # supprimer une valeur
```

Config **par projet** (sans `--global`, à lancer dans le dépôt) : utile pour utiliser un autre e-mail sur un projet précis.

---

## 2. Initialiser un dépôt local

### Nouveau projet

```bash
mkdir mon-projet && cd mon-projet
git init
```

### Projet existant (dossier déjà rempli)

```bash
cd mon-projet
git init
git add .
git commit -m "Initial commit"
```

### Si ta branche s'appelle `master` et tu veux `main`

```bash
git branch -M main
```

### Vérifier l'état

```bash
git status          # fichiers modifiés / indexés
git status -s       # version courte
```

---

## 3. Dépôt bare local (backup / "GitHub hors ligne")

Un dépôt **bare** n'a pas de fichiers de travail : c'est un "serveur" local. On ne travaille jamais dedans, on y **pousse** depuis un clone. Il fonctionne sans internet.

### Créer le bare (une seule fois)

```bash
git init --bare ~/depots/mon-projet.git
# Windows : git init --bare D:/depots/mon-projet.git
```

> Pour un vrai backup, place-le sur **un autre disque / clé USB** que ton projet.

### Cas A : projet existant → le relier au bare

```bash
cd mon-projet
git remote add origin ~/depots/mon-projet.git
git push -u origin main
```

### Cas B : nouveau projet → cloner depuis le bare

```bash
git clone ~/depots/mon-projet.git
# (avertissement "empty repository" = normal)
```

### Backup multiple (local + GitHub)

```bash
git remote add backup D:/depots/mon-projet.git
git push backup --all          # toutes les branches
git push backup --tags         # tous les tags
git push --mirror backup       # copie exacte (branches, tags, suppressions)
```

### Restaurer depuis le bare

```bash
git clone ~/depots/mon-projet.git nouveau-dossier
```

---

## 4. Authentification GitHub depuis le terminal

Trois méthodes, au choix. Pas besoin de l'extension VS Code.

### Méthode 1 : GitHub CLI (`gh`), la plus simple

```bash
# Installation
#   Windows : winget install GitHub.cli
#   macOS   : brew install gh
#   Linux   : sudo apt install gh

gh auth login          # suis l'assistant (navigateur ou token)
gh auth status         # vérifier la connexion
gh auth logout         # se déconnecter
```

Après `gh auth login`, `git push` / `git pull` en HTTPS fonctionnent directement.

### Méthode 2 : HTTPS + Personal Access Token (PAT)

1. GitHub → Settings → Developer settings → Personal access tokens → générer un token (droit `repo`).
2. Au `git push`, utilise ton **nom d'utilisateur** et le **token comme mot de passe** (le mot de passe du compte ne marche plus).

Mémoriser les identifiants :

```bash
git config --global credential.helper store      # stocke en clair dans ~/.git-credentials
git config --global credential.helper cache      # garde en mémoire 15 min (Linux/macOS)
git config --global credential.helper manager    # gestionnaire Windows (Git for Windows)
```

### Méthode 3 : SSH (aucun mot de passe ensuite)

```bash
ssh-keygen -t ed25519 -C "ton@email.com"     # Entrée pour tout accepter
cat ~/.ssh/id_ed25519.pub                    # copie la clé publique
```

Colle-la sur GitHub → Settings → SSH and GPG keys → New SSH key. Puis :

```bash
ssh -T git@github.com                        # test : "Hi <user>! You've successfully authenticated"
```

Utilise ensuite les URLs SSH : `git@github.com:<user>/<repo>.git`

---

## 5. Dépôt en ligne (GitHub)

### Créer le dépôt sur GitHub

**Avec `gh` (sans ouvrir le navigateur) :**

```bash
cd mon-projet
gh repo create mon-projet --private --source=. --remote=origin --push
# --public pour un dépôt public
```

**Ou manuellement :** crée un dépôt **vide** sur github.com (sans README), puis :

```bash
cd mon-projet
git remote add origin https://github.com/<user>/<repo>.git
# ou en SSH : git@github.com:<user>/<repo>.git
git branch -M main
git push -u origin main
```

### Cloner un dépôt existant

```bash
git clone https://github.com/<user>/<repo>.git
git clone git@github.com:<user>/<repo>.git
git clone <url> mon-dossier            # dans un dossier précis
git clone --depth 1 <url>              # seulement le dernier commit (rapide)
git clone -b <branche> <url>           # directement sur une branche
gh repo clone <user>/<repo>            # via gh
```

### Récupérer / envoyer

```bash
git fetch                  # télécharge sans modifier ton code
git pull                   # fetch + fusion dans la branche courante
git push                   # envoie les commits
git push -u origin <branche>   # première fois pour une nouvelle branche
```

### Fork et Pull Request (avec `gh`)

```bash
gh repo fork <user>/<repo> --clone
gh pr create --title "Titre" --body "Description"
gh pr list
gh pr checkout <numéro>
gh pr merge <numéro>
gh repo view --web                     # ouvre le dépôt dans le navigateur
```

---

## 6. Cycle de travail quotidien

```bash
git status                       # où j'en suis ?
git add <fichier>                # indexer un fichier
git add .                        # tout indexer
git add -p                       # indexer morceau par morceau (interactif)
git commit -m "Message clair"    # valider
git commit -am "Message"         # add + commit des fichiers DÉJÀ suivis
git push                         # envoyer
```

### Bonnes pratiques de message

```
Ajoute la validation du formulaire de login
Corrige le crash quand la liste est vide
Refactor: extrait la logique de binding
```

### Modifier le dernier commit (non encore poussé)

```bash
git commit --amend -m "Nouveau message"
git add oubli.txt && git commit --amend --no-edit   # ajouter un fichier oublié
```

---

## 7. Gestion des branches

### Voir

```bash
git branch                 # branches locales (* = courante)
git branch -a              # locales + distantes
git branch -r              # distantes seulement
git branch -vv             # avec suivi du remote et dernier commit
git branch --merged        # branches déjà fusionnées
git branch --no-merged     # branches pas encore fusionnées
```

### Créer / changer

```bash
git branch <nom>                    # créer (sans y aller)
git switch <nom>                    # aller sur une branche
git switch -c <nom>                 # créer + aller dessus
git switch -c <nom> <commit|tag>    # créer depuis un point précis
git switch -                        # revenir à la branche précédente

# Ancienne syntaxe équivalente
git checkout <nom>
git checkout -b <nom>
```

### Renommer

```bash
git branch -m <nouveau-nom>              # renomme la branche courante
git branch -m <ancien> <nouveau>         # renomme une autre branche
git branch -M main                       # force le renommage en main

# Mettre à jour le remote après renommage
git push origin -u <nouveau>
git push origin --delete <ancien>
```

### Supprimer

```bash
git branch -d <nom>                  # supprime (si fusionnée)
git branch -D <nom>                  # supprime de force
git push origin --delete <nom>       # supprime sur le remote
git fetch --prune                    # nettoie les références distantes supprimées
```

### Publier une branche / suivre une branche distante

```bash
git push -u origin <nom>                       # publier + lier
git branch --set-upstream-to=origin/<nom>      # lier une branche existante
git switch <nom>                               # si <nom> existe sur origin, crée la branche locale liée
git checkout --track origin/<nom>              # équivalent explicite
```

### Travailler sur plusieurs branches en même temps (worktree)

```bash
git worktree add ../projet-hotfix hotfix       # 2e dossier lié au même dépôt
git worktree list
git worktree remove ../projet-hotfix
```

---

## 8. Fusion et rebase

### Merge

```bash
git switch main
git merge <branche>              # fusionne <branche> dans main
git merge --no-ff <branche>      # force un commit de fusion
git merge --squash <branche>     # combine tout en un seul commit (à valider ensuite)
git merge --abort                # annule une fusion en cours (conflits)
```

### Résoudre un conflit

1. `git status` → liste les fichiers en conflit.
2. Ouvre le fichier, repère les marqueurs :
    
    ```
    <<<<<<< HEADta version=======leur version>>>>>>> branche
    ```
    
3. Garde le bon code, supprime les marqueurs.
4. Puis :
    
    ```bash
    git add <fichier>git commit            # (ou git merge --continue)
    ```
    

Garder entièrement un côté :

```bash
git checkout --ours   <fichier>    # ta version
git checkout --theirs <fichier>    # leur version
```

### Rebase (historique linéaire)

```bash
git switch ma-feature
git rebase main                  # rejoue tes commits au-dessus de main
git rebase --continue            # après résolution d'un conflit
git rebase --abort               # annuler
git rebase -i HEAD~3             # réécrire/fusionner/réordonner les 3 derniers commits
```

> **Ne jamais rebase une branche déjà partagée/poussée** sans coordination. Après un rebase local d'une branche déjà poussée : `git push --force-with-lease`

### Cherry-pick (reprendre un commit précis)

```bash
git cherry-pick <hash>
git cherry-pick <hash1> <hash2>
git cherry-pick --abort
```

---

## 9. Consulter l'historique

```bash
git log                              # historique complet
git log --oneline                    # une ligne par commit
git log --oneline --graph --all      # arbre de toutes les branches
git log -n 5                         # 5 derniers commits
git log --author="Nom"               # filtrer par auteur
git log --since="2 weeks ago"        # filtrer par date
git log --grep="mot"                 # chercher dans les messages
git log -- <fichier>                 # historique d'un fichier
git log -p -- <fichier>              # avec les changements
git log -S"texte"                    # commits qui ajoutent/suppriment ce texte

git show <hash>                      # détail d'un commit
git show <hash>:chemin/fichier       # contenu d'un fichier à ce commit

git diff                             # modifs non indexées
git diff --staged                    # modifs indexées (prêtes à commit)
git diff <hash1> <hash2>             # entre deux commits
git diff main..ma-feature            # entre deux branches
git diff --stat                      # résumé

git blame <fichier>                  # qui a modifié chaque ligne
git shortlog -sn                     # nombre de commits par auteur
```

### Voir / récupérer une ancienne version

```bash
git switch --detach <hash>           # visiter un ancien état (lecture)
git switch main                      # revenir
git restore --source=<hash> <fichier>        # récupérer un seul fichier ancien
git checkout <hash> -- <fichier>             # équivalent
```

### Reflog : le filet de sécurité

```bash
git reflog                           # journal de tout ce que HEAD a fait
git reset --hard HEAD@{2}            # revenir à un état précédent (même "perdu")
```

---

## 10. Annuler / corriger

|Situation|Commande|
|---|---|
|Annuler les modifs d'un fichier (non indexé)|`git restore <fichier>`|
|Tout annuler (non indexé)|`git restore .`|
|Désindexer un fichier (garde les modifs)|`git restore --staged <fichier>`|
|Annuler le dernier commit, **garder** les modifs indexées|`git reset --soft HEAD~1`|
|Annuler le dernier commit, garder les modifs non indexées|`git reset HEAD~1`|
|Annuler le dernier commit, **tout perdre**|`git reset --hard HEAD~1`|
|Annuler un commit **déjà poussé** (sûr)|`git revert <hash>`|
|Revenir exactement à l'état du remote|`git fetch && git reset --hard origin/main`|
|Supprimer les fichiers non suivis|`git clean -n` (aperçu) puis `git clean -fd`|
|Retirer un fichier du suivi (garde sur disque)|`git rm --cached <fichier>`|
|Supprimer un fichier + le suivi|`git rm <fichier>`|
|Renommer / déplacer un fichier|`git mv <ancien> <nouveau>`|

> `reset --hard` et `clean -fd` sont **destructifs**. Utilise `git clean -n` d'abord. `git revert` est la bonne méthode pour défaire un commit déjà partagé.

---

## 11. Stash (mise de côté)

Pour mettre tes modifications de côté sans commit (ex. changer de branche en urgence).

```bash
git stash                          # met de côté
git stash -u                       # inclut les fichiers non suivis
git stash push -m "description"    # avec un nom
git stash list                     # liste
git stash show -p stash@{0}        # voir le contenu
git stash pop                      # réapplique + supprime
git stash apply stash@{1}          # réapplique sans supprimer
git stash drop stash@{0}           # supprime un stash
git stash clear                    # supprime tout
git stash branch <nom>             # crée une branche depuis un stash
```

---

## 12. Tags (versions)

```bash
git tag                            # lister
git tag v1.0.0                     # tag léger sur le commit courant
git tag -a v1.0.0 -m "Version 1.0" # tag annoté (recommandé)
git tag -a v0.9 <hash> -m "msg"    # tag sur un ancien commit
git show v1.0.0                    # détails

git push origin v1.0.0             # envoyer un tag
git push --tags                    # envoyer tous les tags

git tag -d v1.0.0                  # supprimer en local
git push origin --delete v1.0.0    # supprimer sur le remote

git switch --detach v1.0.0         # visiter une version taguée
```

Release GitHub : `gh release create v1.0.0 --title "v1.0.0" --notes "Notes"`

---

## 13. Gérer les remotes (ajouter, renommer, enlever)

Un **remote** est un dépôt distant lié au tien (`origin` par convention). Un projet peut en avoir plusieurs (GitHub + backup local, par exemple).

### Voir

```bash
git remote                         # noms des remotes
git remote -v                      # noms + URLs (fetch / push)
git remote show origin             # détails (branches suivies, état)
git remote get-url origin          # juste l'URL
```

### Ajouter

```bash
git remote add origin <url>
git remote add backup D:/depots/mon-projet.git
```

### Changer l'URL (ex. HTTPS → SSH, ou dépôt déplacé)

```bash
git remote set-url origin git@github.com:<user>/<repo>.git
git remote set-url origin https://github.com/<user>/<repo>.git
git remote set-url --push origin <url-autre>      # URL différente pour push seulement
```

### Renommer

```bash
git remote rename origin ancien-origin
```

### Enlever un remote

```bash
git remote remove origin           # ou : git remote rm origin
```

Ce que ça fait : supprime le lien et les branches de suivi `origin/*` côté local. **Ton code et ton historique local restent intacts**, et le dépôt distant n'est pas touché.

Vérifier :

```bash
git remote -v                      # ne doit plus afficher le remote
```

### Remplacer un remote (changer de dépôt cible)

```bash
git remote remove origin
git remote add origin <nouvelle-url>
git push -u origin main
```

### Supprimer plusieurs remotes d'un coup (Bash)

```bash
for r in $(git remote); do git remote remove "$r"; done
```

### Nettoyer les références mortes

```bash
git remote prune origin            # supprime les origin/* qui n'existent plus
git fetch --prune                  # idem au fetch
```

### Pousser vers plusieurs remotes d'un coup

```bash
git remote set-url --add --push origin <url-github>
git remote set-url --add --push origin D:/depots/mon-projet.git
git push                           # envoie vers les deux
```

### Supprimer complètement l'historique Git d'un dossier

```bash
rm -rf .git                        # Windows PowerShell : Remove-Item -Recurse -Force .git
```

> Irréversible : le dossier redevient un simple dossier, sans aucun historique.

---

## 14. .gitignore

Fichier à la racine listant ce que Git doit ignorer.

```gitignore
# Dépendances / build
node_modules/
target/
build/
dist/
*.class
*.jar
*.war

# IDE
.vscode/
.idea/

# Secrets
.env
*.key

# Système
.DS_Store
Thumbs.db

# Logs
*.log
```

Syntaxe : `dossier/` (un dossier), `*.ext` (par extension), `!garder.txt` (exception), `/racine.txt` (seulement à la racine).

### Un fichier déjà suivi n'est pas ignoré : il faut le retirer du suivi

```bash
git rm -r --cached <fichier-ou-dossier>
git commit -m "Retire du suivi"
```

### Débogage

```bash
git check-ignore -v <fichier>      # pourquoi ce fichier est ignoré ?
git status --ignored               # voir les fichiers ignorés
```

---

## 15. Trucs pratiques

### Alias (raccourcis)

```bash
git config --global alias.st "status -s"
git config --global alias.co "checkout"
git config --global alias.br "branch"
git config --global alias.sw "switch"
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.last "log -1 HEAD"
git config --global alias.unstage "restore --staged"
```

Usage : `git lg`, `git st`, etc.

### Chercher dans le code

```bash
git grep "motif"                   # cherche dans les fichiers suivis
git grep -n "motif" <branche>      # avec numéros de ligne
```

### Trouver le commit qui a introduit un bug (bisect)

```bash
git bisect start
git bisect bad                     # le commit actuel est cassé
git bisect good <hash-ok>          # un commit connu comme bon
# Git te place sur des commits intermédiaires : teste, puis
git bisect good    # ou    git bisect bad
git bisect reset                   # terminer
```

### Sous-modules

```bash
git submodule add <url> libs/dep
git submodule update --init --recursive
git clone --recurse-submodules <url>
```

### Archive du code sans `.git`

```bash
git archive --format=zip -o projet.zip HEAD
git archive --format=tar.gz -o projet.tar.gz main
```

### Informations / maintenance

```bash
git count-objects -vH              # taille du dépôt
git gc                             # nettoyage / compression
git fsck                           # vérifier l'intégrité
git rev-parse --show-toplevel      # racine du dépôt
git rev-parse --abbrev-ref HEAD    # nom de la branche courante
```

### Gros fichiers

Git gère mal les gros binaires ; utilise Git LFS :

```bash
git lfs install
git lfs track "*.psd"
git add .gitattributes
```

### Script de sauvegarde en une commande (Bash)

```bash
#!/bin/bash
# save.sh : commit + push en une commande
git add -A
git commit -m "${1:-Sauvegarde $(date '+%Y-%m-%d %H:%M')}"
git push
```

Usage : `./save.sh "Mon message"` ou simplement `./save.sh`.

### Fins de ligne (Windows ↔ Linux)

```bash
git config --global core.autocrlf true     # Windows
git config --global core.autocrlf input    # Linux / macOS
```

---

## 16. Erreurs fréquentes

|Message|Cause / solution|
|---|---|
|`fatal: not a git repository`|Tu n'es pas dans un dépôt : `cd` au bon dossier ou `git init`.|
|`remote origin already exists`|`git remote set-url origin <url>` ou `git remote remove origin` puis `add`.|
|`src refspec main does not match any`|Aucun commit encore, ou la branche s'appelle `master` : fais un commit / `git branch -M main`.|
|`failed to push some refs` / `rejected (non-fast-forward)`|Le remote a des commits que tu n'as pas : `git pull` puis `git push`.|
|`refusing to merge unrelated histories`|`git pull origin main --allow-unrelated-histories`.|
|`Authentication failed`|Mot de passe refusé : utilise un **token** (PAT), `gh auth login` ou SSH.|
|`Permission denied (publickey)`|Clé SSH absente ou non ajoutée à GitHub : voir section 4.|
|`detached HEAD`|Tu es sur un commit, pas sur une branche : `git switch main` (ou `git switch -c <nom>` pour garder ton travail).|
|`Your local changes would be overwritten`|Commit ou `git stash` avant de changer de branche / pull.|
|`Please tell me who you are`|Configure `user.name` et `user.email` (section 1).|
|`LF will be replaced by CRLF`|Avertissement de fins de ligne, sans gravité : voir `core.autocrlf`.|
|Fichier ignoré qui reste suivi|`git rm --cached <fichier>` (section 14).|

---

## 17. Aide-mémoire rapide

```bash
# DÉMARRER
git init                                  # nouveau dépôt local
git clone <url>                           # copier un dépôt
git init --bare <chemin>.git              # dépôt bare (serveur local)

# AU QUOTIDIEN
git status
git add .
git commit -m "msg"
git push / git pull

# BRANCHES
git switch -c <nom>                       # créer + aller
git switch <nom>                          # changer
git merge <nom>                           # fusionner
git branch -d <nom>                       # supprimer

# HISTORIQUE
git log --oneline --graph --all
git diff
git show <hash>

# ANNULER
git restore <fichier>
git reset --soft HEAD~1
git revert <hash>

# REMOTES
git remote -v
git remote add <nom> <url>
git remote set-url <nom> <url>
git remote remove <nom>

# MISE DE CÔTÉ
git stash / git stash pop

# VERSIONS
git tag -a v1.0 -m "msg" && git push --tags
```

---

_Astuce : `git <commande> --help` (ou `git help <commande>`) ouvre le manuel complet de n'importe quelle commande, même hors ligne._