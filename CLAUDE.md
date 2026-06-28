# CLAUDE.md — Tuteur de mathématiques (1re secondaire)

## À propos du projet
Ce projet est un **tuteur de mathématiques** pour un élève de **1re secondaire**
(premier cycle du secondaire) dans une école francophone du Québec, selon le
**Programme de formation de l'école québécoise (PFEQ)**.

**Objectif pédagogique** : aider l'élève à mieux **comprendre ce qu'un énoncé
demande** (les situations-problèmes) et à suivre une **démarche structurée** pour
résoudre, plutôt que de chercher la réponse au hasard.

Tout le contenu généré (énoncés, explications, vocabulaire) doit être en
**français québécois**, avec la terminologie du PFEQ.

## Public cible
- Élève d'environ 12-13 ans, 1re secondaire.
- Ton : bienveillant, clair, encourageant. Les erreurs font partie de
  l'apprentissage — ne jamais dévaloriser l'élève.

## Contenu du programme (1re secondaire)
Les exercices portent sur ces thèmes :
- Sens du nombre, fractions, nombres décimaux et pourcentage
- Nombres entiers (positifs et négatifs)
- Priorité des opérations
- Statistique
- Géométrie : angles, figures planes, transformations
- Mesure : périmètre et aire

## Les trois compétences (PFEQ)
1. Résoudre une situation-problème (C1)
2. Déployer un raisonnement mathématique (C2)
3. Communiquer à l'aide du langage mathématique (C3)

## Démarche obligatoire de résolution
Chaque solution DOIT être structurée en quatre étapes (vocabulaire de la
démarche québécoise de résolution de problème) :
1. **Comprendre** — Que cherche-t-on ? Quelles sont les données ? Quels mots-clés
   de l'énoncé l'indiquent ?
2. **Organiser** — Quelle stratégie ? Quelles opérations, et dans quel ordre ?
3. **Résoudre** — Exécuter les calculs, étape par étape.
4. **Vérifier** — La réponse a-t-elle du sens ? Validation (ex. opération
   inverse, ordre de grandeur).

## Leçons par sujet
Avant de proposer des exercices, l'application présente une **leçon brève** sur
chaque sujet. Chaque leçon comprend :
- Une explication claire en français québécois (2–3 phrases).
- Les **termes clés** à retenir (vocabulaire mathématique).
- Un **exemple travaillé simple** suivi des quatre étapes de la démarche
  (Comprendre, Organiser, Résoudre, Vérifier).

Cela garantit que l'élève maîtrise les concepts de base avant d'aborder les
exercices. Les leçons sont stockées dans `data/lecons.json`.

## Vocabulaire / mots-clés
Pour chaque exercice, identifier les **termes mathématiques** importants de
l'énoncé et expliquer leur sens — surtout quand un mot courant a un sens
mathématique particulier (ex. *produit*, *différence*, *aire*, *terme*,
*expression*). C'est souvent là que se trouve la difficulté de compréhension.

## Règles pédagogiques (important)
- **Ne pas donner la réponse tout de suite.** L'application montre d'abord un
  **indice**, puis la démarche complète seulement après une tentative de l'élève.
- Privilégier des contextes concrets et québécois (prénoms, situations du
  quotidien).
- Garder les nombres réalistes pour le niveau. Restrictions du PFEQ à respecter :
  pour additionner ou soustraire des fractions, un dénominateur doit être un
  multiple de l'autre; les fractions sont multipliées par des nombres naturels
  seulement.

## Format des données
- Les exercices sont stockés en **JSON**, dans `data/exercices.json`.
- Le schéma de chaque exercice est défini dans `SKILL.md`.
- Voir `data/exercices.sample.json` pour deux exemples complets.
- Les leçons sont stockées dans `data/lecons.json` avec un exemple travaillé par
  sujet.

## Pile technologique (Phase 2a)
- Site **statique** : HTML, CSS, JavaScript.
- Aucune base de données, aucun serveur, **aucune clé API**.
- Déployable sur **GitHub Pages**.
- (Phase 2b, plus tard : tuteur en direct via l'API Claude — nécessite un petit
  serveur. À reporter, comme prévu.)

## Structure des fichiers
- `index.html` — page principale
- `style.css` — styles
- `app.js` — logique (afficher un exercice, dévoiler l'indice puis la démarche)
- `data/exercices.json` — banque d'exercices
- `data/exercices.sample.json` — exemples de référence
- `CLAUDE.md` — ce fichier (contexte pour Claude Code)
- `SKILL.md` — procédure réutilisable « ajouter une série d'exercices »
- `README.md` — documentation du projet
