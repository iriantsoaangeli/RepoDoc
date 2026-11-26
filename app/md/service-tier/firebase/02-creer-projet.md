# 02 — Créer le projet (Spark) et installer les outils

## ✅ Checklist

- [ ] 1. Créer le projet
- [ ] 2. Créer Firestore (région **définitive**)
- [ ] 3. Activer l'auth anonyme
- [ ] 4. Déclarer l'app Web et copier la config
- [ ] 5. Installer Node, Java, Firebase CLI
- [ ] 6. Lier un dossier local au projet

Aucune étape ne demande de carte. Si un écran t'en demande une, tu es sur la mauvaise page : reviens en arrière.

---

## 1. Créer le projet

🔗 https://console.firebase.google.com

1. 🖱️ **Create a project** (ou **Add project**)
2. Nom : au choix. Note l'**ID** affiché dessous (ex : `mon-app-4f2a1`) = ton `PROJECT_ID`.
3. Google Analytics : 🖱️ **désactive**.
4. 🖱️ **Create project** → 🖱️ **Continue**

Vérifie le plan : en bas à gauche, le badge doit afficher **Spark**.

## 2. Créer Firestore

🔗 `https://console.firebase.google.com/project/PROJECT_ID/firestore`

1. 🖱️ **Create database**
2. Édition (si demandée) : **Standard edition**
3. Database ID : **(default)** — c'est elle qui a le quota gratuit.
4. Location : **`europe-west1` (Belgique)** — la plus proche de Madagascar parmi les régions classiques. ⚠️ **Non modifiable ensuite.**
5. Mode : 🖱️ **Start in production mode** (tout fermé ; les vraies règles arrivent au doc 05)
6. 🖱️ **Create**

Il n'y a **pas de tables à créer** : une collection apparaît quand l'app y écrit le premier document.

## 3. Activer l'auth anonyme

🔗 `https://console.firebase.google.com/project/PROJECT_ID/authentication/providers`

1. 🖱️ **Get started** (première fois)
2. 🖱️ **Anonymous** → bascule **Enable** → 🖱️ **Save**

Pourquoi : chaque installation de l'app reçoit un `uid` sans écran de login. Les règles s'en servent (« seul l'auteur peut supprimer son annonce »). Tu pourras plus tard transformer un compte anonyme en compte email/Google sans perdre ses données.

## 4. Déclarer l'app Web

Pourquoi « Web » : ton app Vue tourne dans une WebView Capacitor, c'est le **SDK JavaScript web** qui est utilisé.

🔗 `https://console.firebase.google.com/project/PROJECT_ID/settings/general`

1. Section **Your apps** → 🖱️ **Add app** → icône **`</>`**
2. Surnom : `vue-app` · **ne coche pas** Firebase Hosting → 🖱️ **Register app**
3. **Copie l'objet `firebaseConfig`** affiché (il ira dans `src/firebase.ts`, doc 06) → 🖱️ **Continue to console**

`apiKey` n'est pas un secret : elle identifie ton projet. La sécurité vient des règles.

## 5. Installer les outils (Linux)

```bash
# Node.js 22 via nvm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
$ source ~/.bashrc
$ nvm install 22

# Java 21+ : obligatoire pour l'émulateur Firestore (tests locaux)
$ sudo apt install openjdk-21-jdk     # Fedora : sudo dnf install java-21-openjdk

# Firebase CLI (sert à déployer les règles et lancer les émulateurs ; gratuit en Spark)
$ npm install -g firebase-tools
$ firebase login
```

Pourquoi l'émulateur : tu testes l'app et les règles **en local, sans consommer un seul quota**.

## 6. Lier un dossier au projet

Dans le dossier de ton app Vue (les fichiers de règles vivront à côté du code) :

```bash
$ cd ton-app-vue
$ firebase use --add        # choisis ton projet, alias : default
$ firebase init firestore   # accepte firestore.rules et firestore.indexes.json
$ firebase init emulators   # coche Authentication et Firestore
```

➡️ Suite : `03-modeliser-ses-donnees.md`
