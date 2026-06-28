# SKILL.md — Ajouter une série d'exercices

## Quand utiliser cette compétence
Utiliser cette procédure chaque fois qu'on veut **générer de nouveaux exercices**
pour le tuteur et les ajouter à `data/exercices.json`.

## Entrées (à préciser à chaque utilisation)
- **Thème** : un thème du programme (ex. `fractions`, `perimetre-et-aire`,
  `nombres-entiers`, `priorite-des-operations`, `statistique`...).
- **Difficulté** : `facile`, `moyen` ou `difficile`.
- **Nombre d'exercices** : combien en générer (ex. 5).

## Procédure
1. Pour chaque exercice, rédiger une **situation-problème** en français, dans un
   contexte concret.
2. Respecter les restrictions du niveau (1re secondaire — voir `CLAUDE.md`).
3. Identifier les **mots-clés / vocabulaire** mathématiques de l'énoncé.
4. Rédiger la **démarche en 4 étapes** : Comprendre, Organiser, Résoudre, Vérifier.
5. Donner un **indice** (à montrer avant la solution complète).
6. Donner la **réponse finale** (avec les unités).
7. Ajouter chaque exercice au tableau dans `data/exercices.json` en respectant le
   schéma ci-dessous.
8. **Vérifier que chaque calcul est exact** avant d'enregistrer.

## Schéma JSON d'un exercice
```json
{
  "id": "theme-001",
  "theme": "fractions",
  "difficulte": "facile",
  "competence": "C1",
  "enonce": "Texte de la situation-problème.",
  "vocabulaire": [
    {
      "terme": "le reste",
      "sens": "Ce qui n'est pas déjà compté; indique souvent une soustraction."
    }
  ],
  "indice": "Une question qui oriente l'élève sans donner la réponse.",
  "demarche": {
    "comprendre": "Ce qu'on cherche et les données fournies.",
    "organiser": "La stratégie et les opérations choisies.",
    "resoudre": "Les calculs, étape par étape.",
    "verifier": "Comment valider que la réponse a du sens."
  },
  "reponse": "La réponse finale, avec les unités."
}
```

## Règles de qualité
- Tout en **français québécois**, terminologie PFEQ.
- Nombres réalistes pour le niveau.
- Un seul concept principal par exercice `facile`; on peut en combiner deux pour
  `difficile`.
- Les `id` sont **uniques** : préfixe du thème + numéro (ex. `frac-001`,
  `perim-001`).
- Toujours relire la cohérence : la `reponse` doit correspondre exactement à la
  `demarche`.
- `competence` : `C1` (résoudre une situation-problème), `C2` (raisonnement) ou
  `C3` (communication). La plupart des exercices contextualisés sont `C1`.

## Exemples
Voir `data/exercices.sample.json` pour deux exercices complets (fractions et
périmètre/aire) qui suivent ce schéma.
