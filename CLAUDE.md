@AGENTS.md

# Survikit BE — Instructions pour agents IA

## Contexte du projet

**Survikit** est un configurateur intelligent de kit d'urgence 72h pour les Belges, construit en réponse aux annonces gouvernementales d'avril 2026. C'est une expérience web éditoriale premium, pas un site utilitaire.

**Objectif business** : monétisation par affiliation Amazon BE / Decathlon (Awin) et vente d'un guide PDF Premium.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 16 (App Router, RSC, TypeScript strict) |
| Style | Tailwind CSS v4 + tokens CSS custom |
| Animation | Framer Motion 11 + Lenis (smooth scroll) |
| État | Zustand (configurateur) |
| Fonts | Playfair Display (display), Inter (corps) via `next/font/google` |
| Tests | Playwright |
| Deploy | Vercel (prévu) |

---

## Architecture des dossiers

```
resilience/          ← racine du projet Next.js
  app/               ← App Router
    layout.tsx       ← LenisProvider + CustomCursor + Navbar
    globals.css      ← Design tokens Survikit + @theme inline Tailwind v4
    page.tsx         ← Landing page (5 sections)
    configurer/      ← Configurateur (5 étapes)
    kit/             ← Page résultat kit personnalisé

  components/
    editorial/       ← Sections marketing (Hero, Stats, Kits, Timeline, CTA)
    configurator/    ← Configurateur + étapes + résultat
    motion/          ← LenisProvider, CustomCursor, ScrollReveal

  lib/
    kit/
      catalog.ts     ← 80 SKUs avec prix et liens affiliés Amazon BE / Decathlon
      rules.ts       ← Moteur déterministe NCCN-compliant (0 API, 0 latence)
      store.ts       ← Zustand state machine 5 étapes
      types.ts       ← UserProfile, KitResult, ConfigStep

  tests/
    configurator.spec.ts  ← Tests Playwright (tunnel complet + accessibilité)
```

---

## Design System

### Palette (à respecter absolument)

```css
--color-paper:        #F0EDE8   /* fond principal, off-white chaud */
--color-cream:        #EAE6DF   /* fond secondaire, cartes stat */
--color-night:        #0E0E0C   /* noir profond, cartes dark */
--color-ink:          #1A1A18   /* texte principal */
--color-ink-muted:    #6B6866   /* texte secondaire, labels */
--color-forest:       #1E4A2A   /* vert principal, CTAs, accents */
--color-forest-mid:   #2D6B3E   /* hover forest */
--color-forest-light: #4A9460   /* forest clair, tags */
--color-signal:       #E8321A   /* rouge urgence — usage TRÈS limité */
--color-sand:         #D9D3C8   /* bordures légères */
--color-sand-dark:    #B8B2A8   /* bordures plus marquées */
```

**Règle d'or** : `signal` (rouge) n'apparaît que sur les labels "Heure X" de la timeline et les indicateurs critiques. Jamais en fond, jamais sur les CTAs.

### Typographie

- **Display** : `font-display` (Playfair Display) — titres monumentaux, italics pour les accents
- **Corps** : `font-sans` (Inter) — tout le reste
- **Mono** : `font-mono` (Geist Mono) — chiffres, labels, codes

### Animations — contraintes

- Durées : 300–900ms. **Jamais > 1s sauf transitions de page.**
- Easing standard : `[0.22, 1, 0.36, 1]` (ease-out cubic custom)
- Lenis gère le scroll — ne pas utiliser `scroll-behavior: smooth` en CSS
- `ScrollReveal` pour les entrées on-screen
- `AnimatePresence mode="wait"` pour les transitions entre étapes

---

## Règles de code

### Général

- TypeScript strict — pas de `any`, pas de `@ts-ignore`
- Tous les composants clients marqués `"use client"` en première ligne
- Composants serveur par défaut (pas de `"use client"` inutile)
- Imports avec alias `@/` (configuré dans `tsconfig.json`)
- Pas de `console.log` en production

### Tailwind v4

- Les tokens custom sont déclarés dans `@theme inline { }` dans `globals.css`
- Ils génèrent automatiquement les classes utilitaires : `bg-forest`, `text-paper`, `border-sand`, etc.
- Ne jamais utiliser de valeurs hardcodées en classe quand un token existe

### Moteur de kit (`lib/kit/rules.ts`)

- **Déterministe** : aucun appel LLM, 0 latence, 0 coût
- Basé sur les recommandations NCCN belge (72h minimum, 3L eau/personne/jour)
- Ne jamais recommander de médicaments sur ordonnance
- Les SKUs doivent toujours exister dans `catalog.ts`

### Affiliation

- Liens affiliés Amazon avec tag `survikit-21`
- Liens Decathlon via Awin
- Toujours ajouter `rel="noopener noreferrer sponsored"` sur les liens affiliés
- Disclosure obligatoire en bas de page résultat (conforme SPF Économie belge)

---

## Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Tests (nécessite npx playwright install au premier lancement)
npx playwright test
npx playwright test --ui           # interface graphique
npx playwright test --headed       # visible dans le navigateur

# Lint
npm run lint
```

---

## Ce qui n'est PAS encore implémenté (Phase 2+)

- Stripe Checkout pour le PDF Premium
- Supabase (sauvegarde kits, leads, orders)
- i18n NL (next-intl)
- Comptes utilisateurs
- API route `/api/kit/generate` (optionnel — le moteur déterministe suffit pour le MVP)
- OG images dynamiques
- Sitemap / robots.txt
- Cookie banner GDPR

---

## Comportement attendu du configurateur

1. `/configurer` → 5 étapes séquentielles (Foyer → Logement → Scénario → Santé → Autonomie)
2. À la dernière étape, `computeResult()` est appelé → délai UX 1.8s avec `ComputingScreen`
3. Le store Zustand redirige vers `/kit` après calcul
4. `/kit` lit le résultat depuis le store — si vide, redirige vers `/configurer`

**Important** : le store est client-side only (Zustand). La page `/kit` est marquée statique mais son contenu est hydraté côté client. Ne pas tenter de passer le résultat par URL params ou cookies pour le MVP.
