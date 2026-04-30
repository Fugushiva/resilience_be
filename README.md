# 🟢 Survikit — Configurateur de Kit d'Urgence 72h pour la Belgique

> **Préparez-vous en 2 minutes.** Survikit est un configurateur intelligent qui génère un kit de survie 72h personnalisé, fondé sur les recommandations du Centre de Crise National belge (NCCN) et les directives de la Commission Européenne d'avril 2026.

---

## 📋 Table des matières

- [Contexte](#-contexte)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Architecture du projet](#-architecture-du-projet)
- [Design System](#-design-system)
- [Le configurateur](#-le-configurateur)
- [Moteur de kit (Rules Engine)](#-moteur-de-kit-rules-engine)
- [Actualités d'urgence](#-actualités-durgence)
- [Monétisation](#-monétisation)
- [Getting Started](#-getting-started)
- [Scripts disponibles](#-scripts-disponibles)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Roadmap (Phase 2+)](#-roadmap-phase-2)
- [Licence](#-licence)

---

## 🌍 Contexte

En avril 2026, le gouvernement belge a renforcé ses recommandations de préparation aux urgences via le Centre de Crise National. Chaque foyer est invité à constituer un **kit d'urgence couvrant 72 heures d'autonomie** (eau, nourriture, éclairage, communication, premiers soins…).

**Survikit** répond à ce besoin en proposant une **expérience web éditoriale premium** — pas un simple site utilitaire. Le ton est éditorial, le design est soigné (inspiré des sites récompensés Awwwards), et le parcours utilisateur est fluide et engageant.

### Objectif business

Monétisation par :
- **Affiliation Amazon BE** — tag `survikit-21`
- **Affiliation Decathlon** — via le réseau Awin
- **Vente d'un guide PDF Premium** (Phase 2)

---

## ✨ Fonctionnalités

### Landing page éditoriale (5 sections)
| Section | Composant | Description |
|---------|-----------|-------------|
| **Hero** | `HeroSection` | Titre monumental avec typographie Playfair Display, accroche premium |
| **Stats** | `StatsSection` | Chiffres clés (population non préparée, temps moyen de coupure…) |
| **Kits** | `KitsSection` | Présentation des 3 niveaux de kits (Essentiel, Préparé, Expert) |
| **Timeline** | `TimelineSection` | Frise "Heure 0 → Heure 72" — ce qui se passe sans préparation |
| **CTA** | `CtaSection` | Call-to-action vers le configurateur |

### Configurateur intelligent (5 étapes)
Parcours guidé en 5 étapes pour générer un kit sur mesure (voir [Le configurateur](#-le-configurateur)).

### Page résultat `/kit`
Affichage du kit personnalisé avec prix, quantités, liens affiliés et poids total.

### Actualités d'urgence `/emergency-news`
Agrégation en temps réel des actualités d'urgence belges avec un moteur de pertinence strict (voir [Actualités d'urgence](#-actualités-durgence)).

### Expérience premium
- **Custom cursor** — curseur personnalisé sur desktop
- **Smooth scroll** — via Lenis pour une navigation fluide
- **Scroll reveal** — animations d'entrée au scroll via Framer Motion
- **Transitions** — entre les étapes du configurateur avec `AnimatePresence`

---

## 🛠 Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| **Framework** | Next.js (App Router, RSC, TypeScript strict) | 16.2.4 |
| **UI** | React | 19.2.4 |
| **Style** | Tailwind CSS v4 + tokens CSS custom | ^4 |
| **Animation** | Framer Motion + GSAP | ^12.38.0 / ^3.15.0 |
| **Smooth scroll** | Lenis | ^1.3.23 |
| **Icônes** | Lucide React | ^1.14.0 |
| **État** | Zustand | ^5.0.12 |
| **Validation** | Zod | ^4.4.1 |
| **RSS** | rss-parser | ^3.13.0 |
| **Tests E2E** | Playwright | ^1.59.1 |
| **Fonts** | Playfair Display (display), Inter (corps), Geist Mono (mono) | via `next/font/google` |
| **Déploiement** | Cloudflare (actuel) | — |

---

## 📁 Architecture du projet

```
resilience/                 ← racine du projet Next.js
│
├── app/                    ← App Router (routes)
│   ├── layout.tsx          ← Layout racine (LenisProvider + CustomCursor + Navbar)
│   ├── globals.css         ← Design tokens Survikit + @theme inline Tailwind v4
│   ├── page.tsx            ← Landing page (5 sections éditoriales)
│   ├── configurer/         ← Configurateur interactif (5 étapes)
│   │   └── page.tsx
│   ├── kit/                ← Page résultat du kit personnalisé
│   │   └── page.tsx
│   └── emergency-news/     ← Actualités d'urgence temps réel
│       └── page.tsx
│
├── components/
│   ├── editorial/          ← Sections marketing de la landing page
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── KitsSection.tsx
│   │   ├── TimelineSection.tsx
│   │   ├── CtaSection.tsx
│   │   └── Navbar.tsx
│   │
│   ├── configurator/       ← Composants du configurateur
│   │   ├── ConfiguratorShell.tsx   ← Shell avec navigation entre étapes
│   │   ├── ComputingScreen.tsx     ← Écran "IA en cours de calcul" (UX delay 1.8s)
│   │   ├── KitResultPage.tsx       ← Affichage du résultat avec liens affiliés
│   │   ├── StepNav.tsx             ← Navigation prev/next entre étapes
│   │   └── steps/
│   │       ├── StepFoyer.tsx       ← Étape 1 : composition du foyer
│   │       ├── StepLogement.tsx    ← Étape 2 : type de logement
│   │       ├── StepScenario.tsx    ← Étape 3 : scénario de risque
│   │       ├── StepSante.tsx       ← Étape 4 : besoins médicaux
│   │       └── StepAutonomie.tsx   ← Étape 5 : niveau d'expérience
│   │
│   └── motion/             ← Composants d'animation
│       ├── LenisProvider.tsx       ← Provider pour smooth scroll
│       ├── CustomCursor.tsx        ← Curseur custom desktop
│       └── ScrollReveal.tsx        ← Wrapper pour animations on-scroll
│
├── lib/
│   ├── kit/                ← Cœur métier — moteur de recommandation
│   │   ├── catalog.ts      ← ~80 SKUs avec prix et liens affiliés
│   │   ├── rules.ts        ← Moteur déterministe NCCN-compliant
│   │   ├── store.ts        ← Zustand state machine (5 étapes)
│   │   └── types.ts        ← Types TypeScript (UserProfile, KitResult, etc.)
│   │
│   ├── api/
│   │   └── emergency.ts    ← Service d'actualités d'urgence + moteur de pertinence
│   │
│   └── ai/                 ← Réservé pour Phase 2 (vide actuellement)
│
├── docs/
│   └── EMERGENCY_API.md    ← Documentation technique du service d'urgences
│
├── tests/
│   ├── configurator.spec.ts         ← Tests Playwright E2E du configurateur
│   ├── emergency.spec.ts            ← Tests Playwright E2E des actualités
│   └── emergency-relevance.test.ts  ← Tests unitaires du moteur de pertinence (24 cas)
│
├── public/                 ← Assets statiques (SVGs)
├── CLAUDE.md               ← Instructions pour agents IA
├── AGENTS.md               ← Règles agent Next.js
├── next.config.ts          ← Configuration Next.js
├── tsconfig.json           ← TypeScript strict, alias @/
├── playwright.config.ts    ← Config tests (Chromium + Mobile Safari)
├── postcss.config.mjs      ← PostCSS pour Tailwind v4
└── package.json
```

---

## 🎨 Design System

### Palette de couleurs

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-paper` | `#F0EDE8` | Fond principal, off-white chaud |
| `--color-cream` | `#EAE6DF` | Fond secondaire, cartes stats |
| `--color-night` | `#0E0E0C` | Noir profond, cartes dark |
| `--color-ink` | `#1A1A18` | Texte principal |
| `--color-ink-muted` | `#6B6866` | Texte secondaire, labels |
| `--color-forest` | `#1E4A2A` | 🟢 Vert principal — CTAs, accents |
| `--color-forest-mid` | `#2D6B3E` | Hover sur forest |
| `--color-forest-light` | `#4A9460` | Forest clair, tags |
| `--color-signal` | `#E8321A` | 🔴 Rouge urgence — usage TRÈS limité |
| `--color-sand` | `#D9D3C8` | Bordures légères |
| `--color-sand-dark` | `#B8B2A8` | Bordures plus marquées |

> **⚠️ Règle d'or** : `signal` (rouge) n'apparaît **que** sur les labels "Heure X" de la timeline et les indicateurs critiques. Jamais en fond, jamais sur les CTAs.

### Typographie

| Classe | Police | Usage |
|--------|--------|-------|
| `font-display` | Playfair Display | Titres monumentaux, accents en italic |
| `font-sans` | Inter | Corps de texte, UI |
| `font-mono` | Geist Mono | Chiffres, labels, codes |

### Classes utilitaires personnalisées

| Classe | Description |
|--------|-------------|
| `.text-display` | Titre monumental (clamp 3rem → 9rem), weight 800 |
| `.text-display-italic` | Idem en italic, weight 700 |
| `.text-label` | Label uppercase, tracking large, 11px |
| `.text-stat` | Chiffre statistique (clamp 2.5rem → 5rem) |

### Animations — Contraintes

- Durées : **300–900ms**. Jamais > 1s sauf transitions de page
- Easing standard : `[0.22, 1, 0.36, 1]` (ease-out cubic custom)
- Lenis gère le scroll — ne pas utiliser `scroll-behavior: smooth` en CSS
- `ScrollReveal` pour les entrées on-screen
- `AnimatePresence mode="wait"` pour les transitions entre étapes

---

## 🔧 Le configurateur

### Parcours utilisateur

```
/configurer → 5 étapes séquentielles → ComputingScreen (1.8s) → /kit
```

### Les 5 étapes

| # | Étape | ID | Question | Données collectées |
|---|-------|----|----------|-------------------|
| 1 | **Votre foyer** | `foyer` | Qui protégez-vous ? | `adults`, `children`, `teens`, `hasPets`, `petType` |
| 2 | **Votre logement** | `logement` | Où vous réfugiez-vous ? | `housing`, `hasGarden`, `location` |
| 3 | **Le scénario** | `scenario` | Quel risque principal ? | `scenario` (urban_power, evacuation, mountain, forest, general) |
| 4 | **Santé & besoins** | `sante` | Des besoins spécifiques ? | `medicalNeeds`, `dietaryRestrictions` |
| 5 | **Niveau d'autonomie** | `autonomie` | Quelle expérience ? | `autonomyLevel` (basic, prepared, expert) |

### Gestion d'état (Zustand)

Le store `useConfiguratorStore` est une **state machine client-side** :

```
Navigation : setStep(), nextStep(), prevStep()
Données    : updateProfile(Partial<UserProfile>)
Calcul     : computeResult() → délai UX 1.8s → KitResult
Reset      : reset() → retour à l'état initial
```

> **Important** : le store est **client-side only**. La page `/kit` est statique mais son contenu est hydraté côté client. Si le store est vide, l'utilisateur est redirigé vers `/configurer`.

---

## ⚙️ Moteur de kit (Rules Engine)

Le fichier `lib/kit/rules.ts` implémente un **moteur 100% déterministe** :

- **0 appel LLM**, 0 latence, 0 coût
- Basé sur les recommandations **NCCN belge** (72h minimum, 3L eau/personne/jour)
- Ne recommande **jamais** de médicaments sur ordonnance

### Pipeline de calcul

```
UserProfile → Filter par scenario tags → Filter par autonomyLevel → Calcul quantités → Groupement par catégorie → KitResult
```

### Catalogue produits

Le fichier `lib/kit/catalog.ts` contient environ **80 SKUs** organisés en 12 catégories :

| Catégorie | Description |
|-----------|-------------|
| `water` | Eau, filtres, purification |
| `food` | Barres énergétiques, conserves, lyophilisé |
| `light` | Lampes frontales, bougies, lanternes |
| `communication` | Radio DAB+, chargeurs, sifflet |
| `health` | Trousse de secours, médicaments OTC |
| `shelter` | Couvertures de survie, bâches, sacs de couchage |
| `tools` | Couteaux, multi-outils, corde |
| `hygiene` | Hygiène personnelle, sacs poubelle |
| `documents` | Copies documents, clé USB |
| `cash` | Espèces (recommandation NCCN) |
| `kids` | Spécifique enfants |
| `pets` | Spécifique animaux |

### Règles de quantité

Exemples de règles appliquées :
- **Eau** : 9L/personne (3L/jour × 3 jours), réduit pour évacuation
- **Nourriture** : 1 boîte de barres/personne
- **Lampes frontales** : 1/adulte + 1 spare, max 4
- **Couvertures** : 1/personne, max 6
- **Masques** : calculés par lots selon le nombre de personnes

---

## 📰 Actualités d'urgence

La page `/emergency-news` agrège en temps réel les actualités d'urgence depuis des sources belges via RSS.

### Sources de données

| Source | Méthode |
|--------|---------|
| **RTL Info** | Flux RSS direct |
| **RTBF** | Via Google News RSS |
| **Centre de Crise** | Via Google News RSS |
| **BFM** | Via Google News RSS |

### Moteur de pertinence (v3) — Scoring à 3 tiers

Le moteur ne cherche pas "tout article contenant le mot alerte" — il filtre **uniquement** les articles qui motivent l'achat d'un kit de survie :

| Tier | Points | Cap | Type de contenu |
|------|--------|-----|----------------|
| **TIER 1** — Survie directe | +40 | 80 | "kit de survie", "be-alert", "trousse de secours" |
| **TIER 2** — Danger physique | +20 | 60 | "inondation", "blackout", "attentat", "évacuation" |
| **TIER 3** — Contexte (conditionnel) | +10 | 30 | "alerte", "neige", "pompiers", "randonnée" |

- **Règle TIER 3** : les points ne comptent **que** si un TIER 1 ou TIER 2 est déjà présent
- **Seuil de validation** : **≥ 30 points**
- **HARD REJECT** : élimine sport, politique, people, finance, justice (sauf danger physique)
- **METAPHORICAL REJECT** : élimine toujours les usages figurés ("kit de survie du manager")
- **Fallback** : si tous les flux sont inaccessibles, des données réalistes sont affichées automatiquement

### Schéma des données

```typescript
{
  status: "ok" | "error",
  lastUpdated: string,        // ISO 8601
  news: [{
    id: string,
    title: string,
    description: string,
    date: string,              // ISO 8601
    source: string,            // "RTBF" | "RTL Info" | "BFM" | "Centre de Crise" | "Presse"
    url?: string,
    severity: "info" | "warning" | "critical",
    relevanceScore?: number    // 0-100
  }]
}
```

---

## 💰 Monétisation

### Liens affiliés

- **Amazon BE** : tag `survikit-21` — chaque produit du catalogue a un lien `amazonUrl`
- **Decathlon** : via le réseau Awin — chaque produit a un lien `decathlonUrl`
- **Disclosure** obligatoire en bas de la page résultat (conforme SPF Économie belge)
- Attribut `rel="noopener noreferrer sponsored"` sur tous les liens affiliés

---

## 🚀 Getting Started

### Prérequis

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/Fugushiva/resilience_be.git
cd resilience_be

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📜 Scripts disponibles

```bash
# Développement (hot reload)
npm run dev

# Build production
npm run build

# Serveur de production
npm start

# Lint (ESLint 9)
npm run lint

# Tests Playwright (installer les navigateurs au premier lancement)
npx playwright install
npx playwright test

# Tests avec interface graphique
npx playwright test --ui

# Tests visibles dans le navigateur
npx playwright test --headed

# Tests unitaires du moteur de pertinence
npx tsx tests/emergency-relevance.test.ts
```

---

## 🧪 Tests

### Playwright

La configuration (`playwright.config.ts`) cible :
- **Desktop** : Chromium
- **Mobile** : iPhone 14 (Mobile Safari)

Le serveur de dev est lancé automatiquement (`npm run dev`) avant les tests.

### Fichiers de tests

| Fichier | Type | Couverture |
|---------|------|-----------|
| `tests/configurator.spec.ts` | E2E | Tunnel complet du configurateur + accessibilité |
| `tests/emergency.spec.ts` | E2E | Affichage page urgences + résilience (fallback) |
| `tests/emergency-relevance.test.ts` | Unitaire | 24 cas de test du moteur de pertinence/scoring |

---

## ☁️ Déploiement

Le projet est actuellement déployé sur **Cloudflare Pages** avec un pipeline CI/CD automatique depuis GitHub.

```bash
# Build de production
npm run build
```

---

## 🗺 Roadmap (Phase 2+)

| Fonctionnalité | Priorité | Description |
|----------------|----------|-------------|
| **Stripe Checkout** | 🔴 Haute | Paiement pour le PDF Premium |
| **Supabase** | 🔴 Haute | Sauvegarde kits, leads, commandes |
| **Cookie banner GDPR** | 🔴 Haute | Conformité réglementaire belge |
| **Sitemap / robots.txt** | 🟡 Moyenne | SEO technique |
| **OG images dynamiques** | 🟡 Moyenne | Partage social optimisé |
| **i18n NL** | 🟡 Moyenne | Version néerlandaise (next-intl) |
| **Comptes utilisateurs** | 🟢 Basse | Sauvegarde & historique de kits |
| **API `/api/kit/generate`** | 🟢 Basse | Optionnel — le moteur déterministe suffit pour le MVP |

---

## 📝 Règles de code

- **TypeScript strict** — pas de `any`, pas de `@ts-ignore`
- **Composants serveur par défaut** — `"use client"` uniquement quand nécessaire
- **Imports avec alias** `@/` (configuré dans `tsconfig.json`)
- **Pas de `console.log`** en production
- **Tailwind v4** — tokens déclarés dans `@theme inline {}`, jamais de valeurs hardcodées
- **Lenis** gère le scroll — ne pas utiliser `scroll-behavior: smooth` en CSS

---

## 📄 Licence

Projet privé — tous droits réservés.
