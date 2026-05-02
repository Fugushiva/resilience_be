/**
 * lib/seo/metadata.ts
 * Helpers pour composer les objets Metadata Next.js 16.
 *
 * Centralise la logique de composition OG, Twitter, alternates, hreflang,
 * robots — pour éviter la dérive entre pages.
 *
 * Usage :
 *   import { buildPageMetadata, buildKitDynamicMetadata } from "@/lib/seo/metadata";
 *
 *   export const metadata = buildPageMetadata({ path: "/configurer", title: "...", description: "..." });
 */

import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  DEFAULT_LOCALE,
  HREFLANG,
  TWITTER_HANDLE,
  OG_IMAGES,
} from "./constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PageMetadataOptions {
  /** Chemin absolu depuis la racine, ex: "/configurer" */
  path: string;
  /** Titre de la page — sera inséré dans le template "%s · Survikit" */
  title: string;
  /** Description méta (idéalement 150–160 caractères) */
  description: string;
  /** Mots-clés additionnels spécifiques à la page */
  keywords?: readonly string[];
  /** URL d'image OG spécifique (utilise le default si absent) */
  ogImagePath?: string;
  /** Type OG : "website" (défaut) ou "article" */
  ogType?: "website" | "article";
  /** Robots directives — par défaut index+follow */
  robots?: {
    index?: boolean;
    follow?: boolean;
  };
  /** Date de modification (pour les pages de type article) */
  dateModified?: string;
}

export interface KitSearchParams {
  score?: string;
  persons?: string;
  hours?: string;
  essentials?: string;
}

// ─── Alternates (hreflang + canonical) ───────────────────────────────────────

/**
 * Génère les balises alternates pour une URL donnée.
 * Phase 1 : fr-BE uniquement + x-default.
 * Phase 2 (nl-BE) : à brancher via next-intl quand la traduction est prête.
 */
export function buildAlternates(path: string): NonNullable<Metadata["alternates"]> {
  const canonicalUrl = `${SITE_URL}${path}`;

  return {
    canonical: canonicalUrl,
    languages: {
      [HREFLANG.fr]: canonicalUrl,
      [HREFLANG.default]: canonicalUrl,
    },
  };
}

// ─── Metadata racine (layout.tsx) ─────────────────────────────────────────────

/**
 * Configuration Metadata pour le layout racine.
 * Sert de base — les pages individuelles override les champs qu'elles définissent.
 */
export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: `${SITE_NAME} — ${SITE_TAGLINE}`,
      template: `%s · ${SITE_NAME}`,
    },

    description:
      "Configurez en 2 minutes le kit d'urgence adapté à votre foyer. Fondé sur les recommandations du Centre de Crise National belge (NCCN). Sérénité familiale, conformité BE-Alert.",

    keywords: [
      "kit urgence Belgique",
      "préparation 72h famille",
      "résilience familiale",
      "Centre de Crise National",
      "NCCN kit survie",
      "BE-Alert préparation",
      "sécurité civile famille Belgique",
    ],

    applicationName: SITE_NAME,

    authors: [{ name: SITE_NAME, url: SITE_URL }],

    creator: SITE_NAME,

    publisher: SITE_NAME,

    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    referrer: "origin-when-cross-origin",

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      siteName: SITE_NAME,
      locale: DEFAULT_LOCALE,
      type: "website",
      url: SITE_URL,
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description:
        "Le configurateur intelligent de kit d'urgence 72h pour les familles belges. Fondé sur les recommandations officielles. Gratuit, sans inscription.",
      images: [
        {
          url: OG_IMAGES.default,
          width: OG_IMAGES.width,
          height: OG_IMAGES.height,
          alt: `${SITE_NAME} — Préparation 72h pour familles belges`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description:
        "Configurez votre kit d'urgence 72h en 2 minutes. Recommandations NCCN belge.",
      images: [OG_IMAGES.default],
    },

    alternates: buildAlternates("/"),

    category: "safety",

    // Placeholders — à remplir après Search Console & Bing Webmaster Tools
    // verification: {
    //   google: "GOOGLE_SITE_VERIFICATION_TOKEN",
    //   other: {
    //     "msvalidate.01": "BING_SITE_VERIFICATION_TOKEN",
    //   },
    // },
  };
}

// ─── Metadata par page ────────────────────────────────────────────────────────

/**
 * Construit un objet Metadata complet pour une page donnée.
 * Hérite du template de titre du layout racine.
 */
export function buildPageMetadata({
  path,
  title,
  description,
  keywords = [],
  ogImagePath,
  ogType = "website",
  robots,
  dateModified,
}: PageMetadataOptions): Metadata {
  const resolvedOgImage = ogImagePath ?? path + "/opengraph-image";

  const robotsConfig: NonNullable<Metadata["robots"]> = {
    index: robots?.index ?? true,
    follow: robots?.follow ?? true,
    nocache: false,
    googleBot: {
      index: robots?.index ?? true,
      follow: robots?.follow ?? true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };

  const meta: Metadata = {
    title,
    description,
    keywords: [...keywords],
    robots: robotsConfig,
    alternates: buildAlternates(path),

    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      locale: DEFAULT_LOCALE,
      type: ogType,
      images: [
        {
          url: resolvedOgImage,
          width: OG_IMAGES.width,
          height: OG_IMAGES.height,
          alt: title,
        },
      ],
      ...(dateModified ? { modifiedTime: dateModified } : {}),
    },

    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title,
      description,
      images: [resolvedOgImage],
    },
  };

  return meta;
}

// ─── Metadata dynamique /kit ──────────────────────────────────────────────────

/**
 * Génère les métadonnées dynamiques pour /kit selon les searchParams.
 *
 * Stratégie hybride :
 * - Si searchParams présents (lien partagé) : titre + description contextuels
 * - Sinon : titre/description statiques génériques
 * - robots: noindex (le contenu sans state n'a aucune valeur SEO)
 *
 * Le KitResultPage.tsx met à jour document.title côté client une fois le
 * résultat Zustand hydraté (pour les onglets et bookmarks).
 */
export function buildKitDynamicMetadata(searchParams: KitSearchParams): Metadata {
  const { score, persons, hours, essentials } = searchParams;

  const hasDynamicData =
    score !== undefined ||
    persons !== undefined ||
    hours !== undefined;

  let title: string;
  let description: string;

  if (hasDynamicData) {
    const scoreVal = score ?? "?";
    const hoursVal = hours ?? "72";
    const personsVal = persons ?? "votre foyer";
    const essentialsVal = essentials ?? "";

    title = `Votre kit Survikit : ${scoreVal}% prêt pour ${hoursVal}h d'autonomie`;
    description = [
      `Kit personnalisé pour ${personsVal} personne${Number(personsVal) > 1 ? "s" : ""}.`,
      essentialsVal ? `${essentialsVal} articles essentiels.` : "",
      "Conformité NCCN. Retrouvez chaque article recommandé depuis la liste.",
      "Guide Premium disponible pour aller plus loin.",
    ]
      .filter(Boolean)
      .join(" ");
  } else {
    title = "Mon kit d'urgence personnalisé 72h — Survikit";
    description =
      "Votre kit d'urgence 72h calculé sur mesure. Articles essentiels, budget estimé et recommandations d'achat. Fondé sur les recommandations NCCN belge.";
  }

  return {
    title,
    description,
    // noindex : la page sans state est inutile pour l'index
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
    // Canonical sans params pour éviter la duplication infinie
    alternates: {
      canonical: `${SITE_URL}/kit`,
      languages: {
        [HREFLANG.fr]: `${SITE_URL}/kit`,
        [HREFLANG.default]: `${SITE_URL}/kit`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/kit`,
      siteName: SITE_NAME,
      locale: DEFAULT_LOCALE,
      type: "website",
      images: [
        {
          url: hasDynamicData
            ? `/kit/opengraph-image?score=${score}&persons=${persons}&hours=${hours}`
            : OG_IMAGES.kit,
          width: OG_IMAGES.width,
          height: OG_IMAGES.height,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      title,
      description,
      images: [
        hasDynamicData
          ? `/kit/opengraph-image?score=${score}&persons=${persons}&hours=${hours}`
          : OG_IMAGES.kit,
      ],
    },
  };
}
