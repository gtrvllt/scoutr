
# Agents et Patterns de Développement du Projet Nuxt 4


## 1. Structure Générale (Nuxt 4)

Le projet suit les conventions Nuxt 4, avec une séparation claire des responsabilités :
- **/nuxt-project/** : Dossier unique de migration, toutes les évolutions et tests doivent s’y faire pendant la migration.
- **app/** : Composants, layouts, pages, assets, et configuration principale (Nuxt 4).
- **components/** : Composants Vue réutilisables, organisés par domaine (AppBar, UserMenu, dialogs, Metas).
- **composables/** : Fonctions réutilisables (auto-importées par Nuxt 4).
- **layouts/** : Layouts globaux (ex : default.vue).
- **lib/** : Intégration de services externes (ex : supabase.client.ts).
- **pages/** : Routage basé sur le filesystem, chaque fichier .vue correspond à une route.
- **stores/** : Gestion d’état centralisée (Pinia, auto-importée).
- **types/** : Définition des types TypeScript (ex : meta.ts).


## 2. Patterns de Développement (Nuxt 4)

### a. Composants Vue
- Utiliser la Composition API (`<script setup lang="ts">`) pour tous les nouveaux composants.
- Découper en composants spécialisés, découplés et réutilisables (ex : dialogs/loginDialog.vue, Metas/MetaItem.vue).
- Utiliser les slots nommés pour la flexibilité.
- Toujours typer les props et emits avec TypeScript.
- Préférer les imports automatiques (auto-import) pour composants/composables si la config le permet.

### b. Gestion d’État
- Utiliser **Pinia** pour la gestion d’état globale (stores/auth.ts), stores typés.
- Utiliser l’auto-import Pinia de Nuxt 4 (pas d’import manuel de `defineStore`).

### c. Intégration de Services
- Centraliser la connexion aux services externes dans **lib/** (ex : supabase.client.ts).
- Utiliser les modules Nuxt officiels pour l’auth, l’API, etc.

### d. Routage et Layouts
- Utiliser le routage automatique via le dossier **pages/**.
- Organiser la navigation avec pages et layouts.
- Utiliser les middlewares pour la gestion des accès et des redirections.

### e. Typage et Sécurité
- Utiliser TypeScript pour tous les types métiers (types/meta.ts).
- Séparer la logique métier, la présentation et l’accès aux données.
- Toujours sécuriser les endpoints API (validation, auth côté serveur).

### f. Bonnes pratiques Nuxt 4 spécifiques
- Utiliser les conventions Nuxt pour la structure des dossiers (composables, stores, plugins, etc.).
- Préférer la configuration via `nuxt.config.ts` et les fichiers d’environnement.
- Utiliser les composables Nuxt (`useRoute`, `useRouter`, etc.) pour accéder au contexte Nuxt.
- Toujours documenter les plugins et modules personnalisés.
- Vérifier l’auto-import Nuxt avant d’ajouter des imports explicites (voir plus bas).

## 3. Agents et Responsabilités

### a. Agents principaux
- **AppBar.vue / UserMenu.vue** : Gestion de la navigation et de l’état utilisateur.
- **dialogs/loginDialog.vue** : Gestion de l’authentification utilisateur via un dialogue modal.
- **Metas/MetaItem.vue, PictoRow.vue** : Affichage et gestion des entités "Meta".
- **stores/auth.ts** : Agent central pour l’authentification et la gestion de l’état utilisateur.

### b. Patterns d’agent
- **Agent de dialogue** : loginDialog.vue agit comme un agent d’authentification, isolant la logique de connexion.
- **Agent de données** : stores/auth.ts centralise la gestion de l’état utilisateur et l’accès aux données d’authentification.
- **Agent de présentation** : Les composants Metas/ sont responsables de l’affichage et de l’interaction avec les entités métier.


## 4. Bonnes Pratiques Observées (Nuxt 4)
- Découpage modulaire, réutilisable et découplé.
- Centralisation de la logique métier et de l’état (Pinia, composables).
- Utilisation stricte des conventions Nuxt 4 pour la maintenabilité et l’auto-import.
- Typage fort avec TypeScript sur tout le code métier.
- Sécurité et validation systématique côté serveur pour les endpoints/API.


## 5. Suggestions d’Amélioration (Nuxt 4)
- Documenter davantage les stores et composables pour faciliter l’onboarding.
- Ajouter des tests unitaires pour les agents critiques (auth, Metas).
- Utiliser des dossiers pour regrouper les composables par domaine métier.
- Toujours vérifier l’auto-import Nuxt 4 avant d’ajouter des imports explicites :
	- Nuxt 4 auto‑importe un grand nombre d’API Vue et helpers Nuxt (`ref`, `computed`, `watch`, `onMounted`, `onBeforeUnmount`, `defineProps`, `defineEmits`, `useRouter`, `useRoute`, `useRuntimeConfig`, `useFetch`, etc.).
	- N’ajoutez des imports manuels que si l’éditeur, le linter ou la compilation les réclament explicitement. Évitez les imports redondants pour les APIs auto‑importées et pour les composants déclarés dans les répertoires pris en charge par la configuration `components`.
	- Exceptions : importez explicitement les fonctions ou modules tiers (ex. `mapbox-gl`, `@supabase/supabase-js`) et les utilitaires locaux qui ne sont pas auto‑importés (ex. `~/app/lib/supabase.client`, composables non exposés).


## 6. Principes de réflexion et contexte de travail
- **First principles** : les agents doivent systématiquement décomposer les problèmes jusqu'aux principes fondamentaux, remettre en question les hypothèses et reconstruire des solutions simples et vérifiables.
- **Réflexion proactive** : les agents doivent proposer des améliorations, anticiper les effets secondaires et suggérer des étapes d'implémentation sans attendre des demandes supplémentaires.
- **Contexte de travail** :
	- Toutes les modifications, tests et expérimentations doivent être réalisées dans le dossier `/nuxt-project` pendant la migration Nuxt 4.
	- Aucun développement, test ou refactor ne doit être fait en dehors de `/nuxt-project` tant que la migration n’est pas finalisée.


## 7. Conventions de structure des fichiers `.vue` (Nuxt 4)

Pour assurer une cohérence visuelle et faciliter les revues de code, tous les fichiers Vue du projet doivent respecter l'ordre suivant des blocs SFC :

- Première balise : `<template>` — markup et structure visuelle.
- Deuxième balise : `<script setup lang="ts">` — logique du composant en Composition API et TypeScript.
- Troisième balise (optionnelle) : `<style>` ou `<style scoped>` — styles CSS/SCSS.

Règles complémentaires :
- Gardez l'ordre strictement comme ci‑dessus dans tous les nouveaux composants et lors des refactorings.
- Évitez d'imbriquer ou de répartir ces blocs ; chaque fichier doit contenir au plus un bloc de chaque type dans cet ordre.
- Cette convention facilite l'auto‑import, les outils de formatage et la relecture des PRs.

---

*Document généré automatiquement le 24/12/2025.*
