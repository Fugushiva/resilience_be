# SEO Technique — Survikit

Documentation opérationnelle pour l'optimisation SEO du site survikit.be.

---

## Architecture des fichiers SEO

```
lib/seo/
  constants.ts       ← Source unique de vérité (URLs, prix, Gumroad, OG images)
  keywords.ts        ← Champs lexicaux par page (registre sécurité civile / sérénité)
  structured-data.ts ← Builders JSON-LD typés (Organization, Product, SoftwareApp…)
  metadata.ts        ← Helpers Metadata Next.js 16 (buildPageMetadata, buildKitDynamicMetadata)

components/seo/
  JsonLd.tsx         ← RSC pour injecter JSON-LD dans le HTML initial

app/
  sitemap.ts         ← /sitemap.xml — 5 routes + hreflang fr-BE/nl-BE/x-default
  robots.ts          ← /robots.txt — bots LLM autorisés (stratégie SGE)
  opengraph-image.tsx        ← OG image racine (Awwwards-style, Playfair)
  twitter-image.tsx          ← Twitter Card racine
  configurer/opengraph-image.tsx
  kit/opengraph-image.tsx    ← Dynamique (lit searchParams score/persons/hours)
  guide/opengraph-image.tsx

public/fonts/
  playfair-display-black.ttf ← Police locale pour ImageResponse (OG images)
```

---

## Checkliste : ajouter une nouvelle page indexable

1. **Metadata** : exporter `metadata` ou `generateMetadata` dans `page.tsx`
   ```ts
   export const metadata: Metadata = buildPageMetadata({
     path: "/ma-page",
     title: "Titre de la page",
     description: "Description ≥ 120 chars",
     keywords: KEYWORDS_MA_PAGE,
   });
   ```

2. **Sitemap** : ajouter l'entrée dans `app/sitemap.ts`
   ```ts
   {
     url: `${SITE_URL}/ma-page`,
     lastModified: NOW,
     changeFrequency: "monthly",
     priority: 0.8,
     alternates: buildAlternates("/ma-page"),
   }
   ```

3. **Robots** : si la page ne doit pas être indexée, ajouter à `disallow` dans `app/robots.ts`

4. **OG image** : créer `app/ma-page/opengraph-image.tsx` (voir modèle `app/guide/opengraph-image.tsx`)

5. **JSON-LD** : si la page représente un produit, article ou service :
   ```tsx
   <JsonLd data={buildProductSchema()} id="jsonld-ma-page" />
   ```

6. **hreflang** : les alternates sont générés automatiquement via `buildAlternates()` — aucune action supplémentaire.

---

## Variables d'environnement / Tokens à configurer

Tous dans `lib/seo/constants.ts` — aucun secret, tout est public :

| Constante | Valeur actuelle | Action requise |
|-----------|----------------|----------------|
| `SITE_URL` | `https://survikit.be` | Vérifier en prod |
| `GUIDE_PDF.gumroadUrl` | `https://jeromedel.gumroad.com/l/guide-72h-belgique` | Tester le lien |
| `ORGANIZATION.email` | `contact@survikit.be` | Créer la boîte mail |
| `TWITTER_HANDLE` | `@survikit` | Créer le compte |
| Vérification Google | Commenté dans `buildRootMetadata()` | Décommenter après Search Console |
| Vérification Bing | Commenté | Décommenter après Bing Webmaster Tools |

---

## Stratégie SGE / AI Overviews (2026)

Les robots GPTBot, Claude-Web, CCBot, PerplexityBot et anthropic-ai sont **explicitement autorisés** dans `app/robots.ts`.

**Pourquoi** : Google SGE, ChatGPT, Perplexity et Claude citent les sources qu'ils ont pu crawler. Autoriser ces bots augmente la visibilité "zero-click" sur les requêtes informationnelles ("kit urgence Belgique", "recommandations NCCN 72h") — même quand l'utilisateur n'arrive jamais sur le site.

**EEAT renforcé** : le JSON-LD `Organization` (areaServed BE, lien NCCN, adresse belge) + le schéma `SoftwareApplication` avec `additionalProperty NCCN/EU` signalent l'autorité thématique aux crawlers LLM.

---

## Activation des étoiles (aggregateRating)

Le schéma `Product` dans `lib/seo/structured-data.ts` a l'`aggregateRating` **commenté** :

```ts
// aggregateRating: {
//   "@type": "AggregateRating",
//   ratingValue: "4.8",
//   reviewCount: "47",
// }
```

**Ne pas décommenter** avec des valeurs inventées — Google peut manuellement sanctionner.

**Pour activer** :
1. Collecter de vraies reviews (Gumroad ratings, Google Reviews, Trustpilot)
2. Connecter une API ou lire le fichier de reviews
3. Passer les vraies valeurs dans `buildProductSchema()`
4. Valider sur https://search.google.com/test/rich-results

---

## Expansion marché flamand (NL) — Roadmap Phase 2

L'infrastructure hreflang est **câblée** dans tous les `metadata` et le sitemap.

Pour activer `/nl` :

1. Installer `next-intl` :
   ```bash
   npm install next-intl
   ```

2. Créer la structure App Router i18n :
   ```
   app/
     [locale]/         ← wrapper locale
       page.tsx        ← home FR + NL
       configurer/
       kit/
       guide/
       emergency-news/
   ```

3. Traduire `lib/seo/keywords.ts` → `KEYWORDS_HOME_NL`, etc.

4. Mettre à jour `app/sitemap.ts` pour supprimer les URLs nl-BE placeholder et pointer sur les vraies routes.

5. Retirer le flag "Phase 2" des commentaires dans `constants.ts`.

---

## Audit post-déploiement

```bash
# 1. Build clean
npm run build

# 2. Tests Playwright SEO
npx playwright test tests/seo.spec.ts

# 3. Inspection manuelle
curl https://survikit.be/sitemap.xml
curl https://survikit.be/robots.txt

# 4. Lighthouse CI (installer si absent)
npx @lhci/cli autorun

# 5. Outils externes
# Rich Results Test : https://search.google.com/test/rich-results
# Schema.org validator : https://validator.schema.org
# LinkedIn Post Inspector : https://www.linkedin.com/post-inspector/
# Twitter Card Validator : https://cards-dev.twitter.com/validator
# PageSpeed Insights : https://pagespeed.web.dev
```

**Métriques cibles** :
- Core Web Vitals : LCP < 2.5s, CLS < 0.1, FID < 100ms
- Rich Results : Organization ✓, SoftwareApplication ✓, Product ✓
- Sitemap indexé dans Google Search Console en < 48h post-deploy

---

## Champ lexical — Règles éditoriales SEO

### Autorisé (registre "sécurité civile / sérénité familiale")
- Kit d'urgence, kit de survie, préparation, résilience, autonomie
- Sécurité civile, protection civile, NCCN, BE-Alert, SPF Intérieur
- Serein, protégé, prêt, anticipé, conforme
- 72h, 72 heures, 3 jours, autonomie familiale

### Interdit (sensationnalisme / jargon prepper)
- Armageddon, apocalypse, fin du monde, collapse
- Survivaliste extrême, prepper, doomsday
- SHTF, WROL
- Catastrophiste, alarmiste

La suite de tests `seo.spec.ts` inclut une assertion automatique sur ces termes interdits.

---

*Dernière mise à jour : Mai 2026*
