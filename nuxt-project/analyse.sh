#!/bin/bash
# analyse.sh : Analyse le code non commité selon 5 axes
# Usage : ./analyse.sh

# 1. Performance
function analyse_performance() {
  echo "\n=== Analyse Performance ==="
  # Recherche de boucles coûteuses, usage de computed/memoization, lazy loading
  git diff --cached -U0 | grep -E 'for |while |map\(|filter\(|reduce\(' && echo "(Boucles ou itérations détectées)"
  grep -r --include='*.vue' 'computed' app/components/ || echo "(Pas d'usage de computed explicite)"
  grep -r --include='*.vue' 'lazy' app/ || echo "(Pas de lazy loading explicite)"
}

# 2. Sécurité
function analyse_securite() {
  echo "\n=== Analyse Sécurité ==="
  # Recherche de TODO/FIXME, accès direct à window, eval, ou accès à des credentials
  git diff --cached -U0 | grep -Ei 'todo|fixme|eval|window\.|localStorage|sessionStorage|password|secret' && echo "(Potentiels problèmes de sécurité)"
}

# 3. Scalabilité
function analyse_scalabilite() {
  echo "\n=== Analyse Scalabilité ==="
  # Recherche de code dupliqué, fichiers trop gros, absence de factorisation
  git diff --cached --name-only | xargs -I{} wc -l {} | awk '$1 > 300 {print $2, "(Fichier volumineux)"}'
  git diff --cached -U0 | grep -E 'copy|paste|dupli' && echo "(Attention à la duplication de code)"
}

# 4. Observabilité
function analyse_observabilite() {
  echo "\n=== Analyse Observabilité ==="
  # Recherche de logs, instrumentation, hooks d'erreur
  git diff --cached -U0 | grep -E 'console\.log|console\.error|logger|track|Sentry' && echo "(Instrumentation/logs détectés)"
}

# 5. Developer Experience
function analyse_dx() {
  echo "\n=== Analyse Developer Experience ==="
  # Recherche de commentaires, typage, conventions, TODO
  git diff --cached -U0 | grep -E 'any |// |/\*|TODO|FIXME' && echo "(Commentaires ou TODO détectés)"
  git diff --cached --name-only | grep -E '\.ts$|\.vue$' | xargs grep -L 'type ' && echo "(Fichiers sans typage explicite)"
}

# Exécution des analyses
analyse_performance
analyse_securite
analyse_scalabilite
analyse_observabilite
analyse_dx
