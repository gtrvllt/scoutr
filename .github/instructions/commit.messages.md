---
applyTo: '**'
---

# Règles pour les messages de commit

Ce fichier définit un format recommandé pour les messages de commit afin d'améliorer la lisibilité, les changelogs et l'intégration CI.

- Format principal: `type(scope): résumé`
  - `type`: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`.
  - `scope` (optionnel): zone impactée, ex. `metas`, `auth`, `ui`.
  - `résumé`: impératif, court (≤50 caractères), pas de point final.

- Corps (optionnel): expliquer le pourquoi et l'impact. Wrap à ~72 colonnes.

- Footer (optionnel): références de tickets et informations de breaking changes.
  - Exemple de fermeture d'issue: `Closes #123`
  - Pour une incompatibilité: inclure `BREAKING CHANGE: <description>` dans le footer.

- Exemple complet:
```
feat(metas): add lazy-loading for images

Add native `loading="lazy"` to meta images to improve list performance.

Closes #42
```

- Conseils pratiques:
  - Utiliser l'impératif pour le résumé (`Add`, `Fix`, `Remove`).
  - Garder les commits petits et ciblés.
  - Vérifier l'auto-import Nuxt avant d'ajouter des imports explicites (réduit le bruit de commit).
  - Ajouter des co-authors dans le footer si nécessaire: `Co-authored-by: Name <email>`.

- Outils recommandés (optionnel): linter de commits/CI — ex. `commitlint` + config Conventional Commits.

---

Placez ce fichier sous `/.github/instructions/` pour qu'il soit consultable lors des revues.

## Comportement automatisé de l'IA

- Lorsqu'on demande à l'assistant "rédiger un message de commit", l'assistant doit :
  - Scanner tous les changements non committés (staged et unstaged) dans le dépôt courant.
  - Générer un message de commit unique suivant les règles définies ci‑dessus (Conventional Commits).
  - Proposer en sortie le message `type(scope): résumé` + corps optionnel + footer si nécessaire, et inclure une courte liste des fichiers modifiés pour contexte.
  - Indiquer explicitement si le changement est potentiellement breaking et préfixer avec `BREAKING CHANGE:` le cas échéant.

Cette règle permet d'harmoniser les messages et d'accélérer les revues. L'assistant vérifiera les modifications non committées dans l'arborescence du dépôt courant avant de rédiger le message.
