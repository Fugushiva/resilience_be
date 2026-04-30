# Intégration de l'API Urgences (Emergency News)

La page `/emergency-news` agrège en temps réel les actualités d'urgence depuis les sources officielles belges et internationales, avec un filtre de pertinence strict orienté vers la vente de kits de survie.

## Sources de données

| Source | Méthode | Fiabilité |
|--------|---------|-----------|
| **RTL Info** | Flux RSS direct (`feedburner.com/rtlinfo/belgique`) | ✅ Haute |
| **RTBF** | Via Google News RSS (le flux direct RTBF est mort) | ✅ Haute |
| **Centre de Crise** | Via Google News RSS (pas de flux RSS officiel) | ✅ Haute |
| **BFM** | Via Google News RSS | ✅ Haute |

## Architecture de résilience (Zéro Bug Policy)

```
Flux RSS → Parse → Normalisation → HARD REJECT → SCORING → THRESHOLD → Dédoublonnage → Affichage
                                       ↓                       ↓
                                  Métaphorique?          Score < 30?
                                       ↓                       ↓
                                    Score = 0            FALLBACK DATA
```

Si **tous** les flux sont inaccessibles (timeout, erreur réseau), le service renvoie automatiquement des données de **Fallback** réalistes. La page ne crash jamais.

## Moteur de pertinence (Relevance Engine v3)

### Philosophie

On ne cherche PAS "tout article contenant le mot alerte". On cherche **uniquement** des articles qui motivent l'achat d'un kit de survie Survikit :

1. **Danger physique immédiat** — catastrophe naturelle, attentat, accident industriel
2. **Recommandations officielles** — Centre de Crise, Be-Alert, consignes de préparation
3. **Incidents outdoor** — dangers en randonnée, hypothermie, noyade
4. **Risques d'infrastructure** — blackout, pénurie eau/nourriture, coupure électrique

### Système de scoring à 3 tiers

| Tier | Points | Cap | Exemples |
|------|--------|-----|----------|
| **TIER 1** — Survie directe | +40 | 80 | "kit de survie", "be-alert", "trousse de secours" |
| **TIER 2** — Danger physique | +20 | 60 | "inondation", "blackout", "attentat", "évacuation" |
| **TIER 3** — Contexte (conditionnel) | +10 | 30 | "alerte", "neige", "pompiers", "randonnée" |

**Règle TIER 3** : Les points TIER 3 ne sont comptés QUE si au moins un TIER 1 ou TIER 2 est déjà présent. Cela empêche un article contenant uniquement "alerte" + "météo" + "danger" de passer (= trop vague).

**Seuil de validation** : **≥ 30 points**

| Combinaison | Score | Passe ? |
|-------------|-------|---------|
| 1× TIER1 | 40 | ✅ |
| 2× TIER2 | 40 | ✅ |
| 1× TIER2 + 1× TIER3 | 30 | ✅ |
| 1× TIER2 seul | 20 | ❌ |
| 3× TIER3 seuls | 0 (car conditionnel) | ❌ |

### Système de rejet

**HARD REJECT** — Élimine les articles hors-sujet (politique, sport, people, finance, justice, etc.) **sauf** si un terme TIER1 ou TIER2 de danger physique est présent.

**METAPHORICAL REJECT** — Élimine **toujours** (même avec TIER1), car ça indique un usage figuré des termes de survie. Exemples :
- "kit de survie des bébés" → parenting
- "chasseurs d'ouragans pour la science" → vulgarisation scientifique
- "kit de survie du manager" → business

## Schéma des données (Zod)

```typescript
{
  status: "ok" | "error",
  lastUpdated: string, // ISO 8601
  news: [{
    id: string,
    title: string,
    description: string,
    date: string,       // ISO 8601
    source: string,     // "RTBF" | "RTL Info" | "BFM" | "Centre de Crise" | "Presse"
    url?: string,
    severity: "info" | "warning" | "critical",
    relevanceScore?: number // 0-100
  }]
}
```

## Tests

```bash
# Tests unitaires du moteur de pertinence (24 cas)
npx tsx tests/emergency-relevance.test.ts

# Tests Playwright (affichage + résilience)
npx playwright test tests/emergency.spec.ts
```

## Fichiers

| Fichier | Rôle |
|---------|------|
| `lib/api/emergency.ts` | Service + moteur de pertinence + fallback |
| `app/emergency-news/page.tsx` | Page SSR avec ISR (revalidate 60s) |
| `tests/emergency-relevance.test.ts` | Tests unitaires du scoring |
| `tests/emergency.spec.ts` | Tests Playwright E2E |

## Extension future

Pour ajouter une nouvelle source :
1. Ajouter l'URL RSS dans le tableau `FEEDS` de `lib/api/emergency.ts`
2. Si la source a un nom fixe, utiliser `forcedSource: "Nom"`
3. Les mots-clés des 3 tiers sont dans le fichier — ajouter les termes spécifiques si nécessaire
4. Exécuter les tests pour vérifier qu'aucune régression n'est introduite
