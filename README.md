# Location Benne Occitanie — Site + Admin (GitHub Pages)

Site statique (Vite + React) avec un fichier de contenu `data.config` éditable depuis une page d’administration.

## Déploiement GitHub Pages (important)

Dans GitHub : **Settings → Pages → Build and deployment → Source : “GitHub Actions”**.

## Contenu du site

- Le wording du site est chargé depuis `public/data.config` (JSON).
- En production, le fichier est publié à la racine du site : `data.config`.

## Admin (édition du `data.config`)

- Accès : `/#/admin`
- Fonctionnement : l’admin charge `public/data.config` depuis GitHub, vous l’éditez, puis vous sauvegardez (commit via l’API GitHub).
- Sécurité : utilisez un **Fine-grained Personal Access Token** limité au dépôt (permission **Contents: Read & Write**). Le token est conservé en **sessionStorage** si vous cochez l’option.

## Admin — mot de passe

Vous pouvez activer un mot de passe pour l’admin (hash PBKDF2) via `admin.gate` dans `public/data.config` (générable depuis l’admin).

> Important : GitHub Pages = site statique, donc protection **côté client**. Utilisez un mot de passe long + gardez le token GitHub privé.

## Avis Google (récupération)

L’admin peut se connecter à Google Business Profile pour récupérer les avis.

- Pré-requis Google Cloud : activer l’API **Google My Business API** (mybusiness.googleapis.com) + créer un **OAuth Client ID (Web)**.
- Origines JavaScript à autoriser dans Google Cloud :
  - `https://<username>.github.io`
  - `http://localhost:3000` (dev)
  - `http://localhost:4173` (app desktop packagée)

## Développement local

Prérequis : Node.js

```bash
npm install
npm run dev
```

> Windows / PowerShell : si `npm` est bloqué (ExecutionPolicy), utilisez `npm.cmd install` / `npm.cmd run dev`.

## Build

```bash
npm run build
npm run preview
```

## Créer un `.exe` (Windows)

```bash
npm.cmd install
npm.cmd run desktop:pack
```

Le binaire est généré dans `release/Location Benne Occitanie-win32-x64/Location Benne Occitanie.exe`.
