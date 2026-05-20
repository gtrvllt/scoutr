---
applyTo: '**'
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

**IMPORTANT** : Si une review est demandée sans fichier précisé, la review doit porter sur toutes les modifications non commitées du projet (staged et unstaged).

# Best Practices Vue 4 / Nuxt 4 / Tailwind

## Vue 4
- Utiliser la Composition API (script setup) pour tous les nouveaux composants.
- Préférer les composants fonctionnels et découplés, éviter la logique monolithique.
- Utiliser les slots nommés pour la flexibilité des composants.
- Toujours typer les props et les emits avec TypeScript.
- Utiliser `defineProps`, `defineEmits`, `defineExpose` et `defineOptions`.
- Préférer les computed et watch pour la réactivité, éviter les mutations directes.
- Utiliser les directives personnalisées avec parcimonie et documenter leur usage.
- Préférer les stores Pinia pour la gestion d’état globale.
- Toujours nettoyer les effets (watch, subscriptions) dans `onUnmounted`.
- Utiliser les hooks personnalisés (`useXXX`) pour factoriser la logique réutilisable.
- Respecter la convention de nommage PascalCase pour les composants.
- Préférer les imports automatiques (auto-import) si la configuration du projet le permet.

## Nuxt 4
- Utiliser les modules Nuxt officiels pour l’auth, l’API, etc.
- Préférer les pages et layouts pour organiser la navigation.
- Utiliser les middlewares pour la gestion des accès et des redirections.
- Préférer l’utilisation de `useFetch`/`useAsyncData` pour la récupération de données côté serveur.
- Toujours sécuriser les endpoints API (validation, auth côté serveur).
- Utiliser les composables Nuxt (`useRoute`, `useRouter`, etc.) pour accéder au contexte Nuxt.
- Préférer la configuration via `nuxt.config.ts` et les fichiers d’environnement.
- Utiliser les conventions Nuxt pour la structure des dossiers (composables, stores, plugins, etc.).
- Toujours documenter les plugins et modules personnalisés.

## Tailwind
- Utiliser les classes utilitaires Tailwind pour le style, éviter le CSS custom sauf cas justifié.
- Préférer les variantes responsives et dark mode intégrées.
- Utiliser les plugins Tailwind officiels pour les besoins avancés (forms, typography, etc.).
- Factoriser les classes répétitives via les @apply dans les fichiers CSS si besoin.
- Respecter la convention BEM si du CSS custom est nécessaire.
- Toujours privilégier l’accessibilité (focus, contrastes, aria-attributes).
- Utiliser les tokens de design (couleurs, tailles) définis dans le config Tailwind.
- Préférer les composants UI réutilisables et stylés via Tailwind.

# Code Review Guidelines: 5 Axes for Uncommitted Code

When reviewing or analyzing uncommitted code, always provide feedback and suggestions according to the following five perspectives:

1. **Performance**
	- Identify inefficient patterns, unnecessary computations, or potential bottlenecks.
	- Suggest optimizations (e.g., lazy loading, memoization, avoiding deep loops).

2. **Security**
	- Detect possible vulnerabilities (e.g., unsafe eval, direct DOM access, hardcoded secrets, lack of input validation).
	- Recommend best practices for secure code (e.g., sanitization, avoiding exposure of sensitive data).

3. **Scalability**
	- Assess if the code can handle growth in data, users, or features.
	- Point out code duplication, monolithic logic, or lack of modularity.

4. **Observability**
	- Check for presence of logging, error handling, and monitoring hooks.
	- Suggest improvements for traceability and debugging (e.g., structured logs, error boundaries).

5. **Developer Experience**
	- Evaluate code readability, comments, naming conventions, and type safety.
	- Highlight onboarding friction, unclear logic, or missing documentation.

Always structure your review by addressing each of these five axes, and provide actionable, concise feedback for each.