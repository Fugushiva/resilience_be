/**
 * lib/seo/constants.ts
 * Source unique de vérité pour toutes les constantes SEO/OG du projet.
 * Importer depuis ici — jamais hardcoder ailleurs.
 */

// ─── Site ────────────────────────────────────────────────────────────────────

export const SITE_URL = "https://survikit.be" as const;
export const SITE_NAME = "Survikit" as const;
export const SITE_TAGLINE = "Préparation 72h pour familles belges" as const;

// ─── Localisation ─────────────────────────────────────────────────────────────

export const DEFAULT_LOCALE = "fr_BE" as const;
export const ALT_LOCALES = ["nl_BE"] as const;

// Codes BCP 47 pour hreflang
export const HREFLANG = {
  fr: "fr-BE",
  nl: "nl-BE",
  default: "x-default",
} as const;

// ─── Organisation légale ──────────────────────────────────────────────────────

export const ORGANIZATION = {
  name: "Survikit",
  legalName: "Survikit",
  url: SITE_URL,
  logo: `${SITE_URL}/og/logo-survikit.png`,
  email: "contact@survikit.be",
  areaServed: "BE",
  sameAs: [
    // À compléter avec les profils sociaux une fois créés
    // "https://www.linkedin.com/company/survikit",
    // "https://twitter.com/survikit",
  ],
  address: {
    "@type": "PostalAddress" as const,
    addressCountry: "BE",
  },
} as const;

// ─── Produit payant — Guide PDF Premium ───────────────────────────────────────

export const GUIDE_PDF = {
  name: "Guide de Résilience Familiale 72h — Belgique",
  description:
    "Le guide complet de préparation aux urgences pour les familles belges. 8 chapitres, conformité NCCN/BE-Alert, checklists imprimables, contacts d'urgence officiels et plan familial personnalisé.",
  priceEur: 14.99,
  currency: "EUR",
  sku: "SVK-GUIDE-001",
  gumroadUrl: "https://jeromedel.gumroad.com/l/guide-72h-belgique",
  image: `${SITE_URL}/og/guide-pdf-cover.jpg`,
  chapterCount: 8,
  category: "DigitalDocument",
  // Note: aggregateRating délibérément absent — activé uniquement avec vraies reviews
} as const;

// ─── Open Graph images ────────────────────────────────────────────────────────

export const OG_IMAGES = {
  default: "/opengraph-image",     // Route dynamique Next 16
  home: "/opengraph-image",
  configurer: "/configurer/opengraph-image",
  kit: "/kit/opengraph-image",
  guide: "/guide/opengraph-image",
  emergencyNews: "/emergency-news/opengraph-image",
  // Dimensions standard 1200×630
  width: 1200,
  height: 630,
} as const;

// ─── Réseaux sociaux ──────────────────────────────────────────────────────────

export const TWITTER_HANDLE = "@survikit" as const;

// ─── Routes canoniques ────────────────────────────────────────────────────────

export const ROUTES = {
  home: "/",
  configurer: "/configurer",
  kit: "/kit",
  emergencyNews: "/emergency-news",
  guide: "/guide",
} as const;

// ─── Configurateur ────────────────────────────────────────────────────────────

export const CONFIGURATOR = {
  name: "Configurateur de kit d'urgence 72h — Survikit",
  description:
    "Outil gratuit de diagnostic en 5 étapes pour créer votre kit d'urgence personnalisé. Fondé sur les recommandations du Centre de Crise National belge (NCCN).",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  stepCount: 5,
} as const;

// ─── Dates de référence ───────────────────────────────────────────────────────

/** Date de création du site (utilisée pour schema DateCreated) */
export const SITE_DATE_CREATED = "2024-01-01" as const;

/** Date de la dernière mise à jour majeure du contenu */
export const SITE_DATE_MODIFIED = "2026-04-01" as const;
