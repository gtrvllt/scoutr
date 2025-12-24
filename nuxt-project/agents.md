# Agents et Patterns de Développement du Projet Nuxt

## 1. Structure Générale

Le projet est organisé selon les conventions Nuxt 3, avec une séparation claire des responsabilités :
- **app/** : Composants, layouts, pages, assets, et configuration principale.
- **components/** : Composants Vue réutilisables, organisés par domaine (AppBar, UserMenu, dialogs, Metas).
- **composables/** : Fonctions réutilisables (non détaillé ici, mais standard Nuxt).
- **layouts/** : Layouts globaux (ex : default.vue).
- **lib/** : Intégration de services externes (ex : supabase.client.ts).
- **pages/** : Routage basé sur le filesystem, chaque fichier .vue correspond à une route.
- **stores/** : Gestion d’état centralisée (Pinia).
- **types/** : Définition des types TypeScript (ex : meta.ts).

## 2. Patterns de Développement

### a. Composants Vue
- Utilisation de la composition API (setup, script setup).
- Découpage en composants spécialisés (ex : dialogs/loginDialog.vue, Metas/MetaItem.vue).
- Utilisation de props et d’événements personnalisés pour la communication parent/enfant.

### b. Gestion d’État
- Utilisation de **Pinia** pour la gestion d’état globale (stores/auth.ts).
- Stores typés pour la robustesse et la maintenabilité.

### c. Intégration de Services
- **lib/supabase.client.ts** : centralise la connexion à Supabase, favorisant la réutilisation et la séparation des responsabilités.

### d. Routage et Layouts
- Routage automatique via le dossier **pages/**.
- Layouts globaux pour la cohérence visuelle et structurelle.

### e. Typage et Sécurité
- Utilisation de TypeScript pour les types métiers (types/meta.ts).
- Séparation claire entre logique métier, présentation et accès aux données.

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

## 4. Bonnes Pratiques Observées
- Découpage modulaire et réutilisable.
- Centralisation de la logique métier et de l’état.
- Utilisation de conventions Nuxt/Vue pour la maintenabilité.
- Typage fort avec TypeScript.

## 5. Suggestions d’Amélioration
 - Documenter davantage les stores et composables pour faciliter l’onboarding.
 - Ajouter des tests unitaires pour les agents critiques (auth, Metas).
 - Utiliser des dossiers pour regrouper les composables par domaine métier.
 - Vérifier l'auto-import de Nuxt avant d'ajouter des imports explicites : Nuxt auto‑importe les API Vue (ex. `ref`, `computed`, `watch`, `defineProps`, etc.) et certains helpers, ce qui réduit les imports manuels et évite les erreurs de duplication.

## 6. Principes de réflexion
 - **First principles** : les agents doivent systématiquement décomposer les problèmes jusqu'aux principes fondamentaux, remettre en question les hypothèses et reconstruire des solutions simples et vérifiables.
 - **Réflexion proactive** : les agents doivent proposer des améliorations, anticiper les effets secondaires et suggérer des étapes d'implémentation sans attendre des demandes supplémentaires.
 - **Contexte de travail** : toutes les modifications, tests et expérimentations doivent être réalisées dans le dossier ~/nuxt-project pour assurer cohérence et traçabilité.

---

*Document généré automatiquement le 24/12/2025.*
