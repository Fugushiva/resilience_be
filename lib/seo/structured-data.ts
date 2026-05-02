/**
 * lib/seo/structured-data.ts
 * Builders JSON-LD typés pour les Rich Snippets Google.
 *
 * Schémas implémentés :
 *  - Organization (logo, contact, areaServed BE)
 *  - WebSite (SearchAction interne)
 *  - SoftwareApplication (configurateur — outil gratuit)
 *  - Product (Guide PDF Premium — prix 14,99€, lien Gumroad)
 *  - BreadcrumbList
 *
 * Note: aggregateRating DÉLIBÉRÉMENT ABSENT sur tous les schémas.
 * Google peut manuellement pénaliser les fausses étoiles. À brancher
 * uniquement quand on dispose de vraies reviews vérifiables.
 *
 * Validation : https://validator.schema.org / Google Rich Results Test
 */

import {
  SITE_URL,
  SITE_NAME,
  ORGANIZATION,
  GUIDE_PDF,
  CONFIGURATOR,
  ROUTES,
  SITE_DATE_CREATED,
  SITE_DATE_MODIFIED,
} from "./constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// Type générique pour JSON-LD sérialisable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonLdObject = Record<string, any>;

// ─── Organization ─────────────────────────────────────────────────────────────

export function buildOrganizationSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: {
      "@type": "ImageObject",
      url: ORGANIZATION.logo,
      width: 512,
      height: 512,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: ORGANIZATION.email,
      contactType: "customer support",
      availableLanguage: ["French", "Dutch"],
      areaServed: ORGANIZATION.areaServed,
    },
    address: ORGANIZATION.address,
    areaServed: {
      "@type": "Country",
      name: "Belgium",
      "@id": "https://www.wikidata.org/wiki/Q31",
    },
    ...(ORGANIZATION.sameAs.length > 0 ? { sameAs: [...ORGANIZATION.sameAs] } : {}),
  };
}

// ─── WebSite ──────────────────────────────────────────────────────────────────

export function buildWebSiteSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Configurateur intelligent de kit d'urgence 72h pour les familles belges. Fondé sur les recommandations du Centre de Crise National (NCCN).",
    inLanguage: ["fr-BE", "nl-BE"],
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    dateCreated: SITE_DATE_CREATED,
    dateModified: SITE_DATE_MODIFIED,

  };
}

// ─── SoftwareApplication (configurateur) ──────────────────────────────────────

export function buildSoftwareApplicationSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}${ROUTES.configurer}/#app`,
    name: CONFIGURATOR.name,
    description: CONFIGURATOR.description,
    url: `${SITE_URL}${ROUTES.configurer}`,
    applicationCategory: CONFIGURATOR.applicationCategory,
    operatingSystem: CONFIGURATOR.operatingSystem,
    browserRequirements: "Requires JavaScript. Works with any modern browser.",
    inLanguage: "fr-BE",
    featureList: [
      "Diagnostic de foyer (adultes, enfants, animaux)",
      "Analyse de logement (appartement, maison, rural)",
      "Sélection de scénario (panne urbaine, évacuation, montagne, forêt)",
      "Prise en compte des besoins de santé",
      "Niveau d'autonomie personnalisable",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: "Outil de diagnostic gratuit, sans inscription",
      availability: "https://schema.org/OnlineOnly",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    creator: {
      "@id": `${SITE_URL}/#organization`,
    },
    dateCreated: SITE_DATE_CREATED,
    dateModified: SITE_DATE_MODIFIED,
    // Conformité réglementaire — élément EEAT crucial
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Conformité",
        value: "NCCN — Centre de Crise National belge",
      },
      {
        "@type": "PropertyValue",
        name: "Standard",
        value: "Recommandations UE — 72h autonomie minimale",
      },
    ],
  };
}

// ─── Product (Guide PDF Premium) ──────────────────────────────────────────────

/**
 * Schema.org Product pour le Guide de Résilience Familiale.
 * Ce schéma active l'affichage du prix et la disponibilité dans Google SERP.
 *
 * Pour activer les étoiles (aggregateRating), décommenter le bloc ci-dessous
 * et connecter à une vraie source de reviews (ex: Gumroad ratings, Trustpilot).
 */
export function buildProductSchema(): JsonLdObject {
  // priceValidUntil = fin d'année courante
  const priceValidUntil = new Date();
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);
  const priceValidUntilStr = priceValidUntil.toISOString().split("T")[0];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}${ROUTES.guide}/#product`,
    name: GUIDE_PDF.name,
    description: GUIDE_PDF.description,
    image: {
      "@type": "ImageObject",
      url: GUIDE_PDF.image,
      width: 1200,
      height: 630,
    },
    sku: GUIDE_PDF.sku,
    category: GUIDE_PDF.category,
    inLanguage: "fr-BE",
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    offers: {
      "@type": "Offer",
      url: GUIDE_PDF.gumroadUrl,
      price: GUIDE_PDF.priceEur.toFixed(2),
      priceCurrency: GUIDE_PDF.currency,
      priceValidUntil: priceValidUntilStr,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@id": `${SITE_URL}/#organization`,
      },
      // Champs requis Google Merchant — produit numérique (PDF)
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "EUR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "BE",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "BE",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 0,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
        refundType: "https://schema.org/ExchangeRefund",
      },
    },
    // TODO: Activer quand vraies reviews disponibles
    // aggregateRating: {
    //   "@type": "AggregateRating",
    //   ratingValue: "4.8",
    //   reviewCount: "47",
    //   bestRating: "5",
    //   worstRating: "1",
    // },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Format",
        value: "PDF numérique",
      },
      {
        "@type": "PropertyValue",
        name: "Chapitres",
        value: String(GUIDE_PDF.chapterCount),
      },
      {
        "@type": "PropertyValue",
        name: "Conformité",
        value: "NCCN / BE-Alert / SPF Intérieur",
      },
    ],
  };
}

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// ─── FAQPage ──────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Schema.org FAQPage — active les rich results "Questions fréquentes" dans Google SERP.
 * Chaque item peut apparaître en featured snippet (position 0).
 */
export function buildFAQSchema(items: FaqItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ─── WebPage générique ────────────────────────────────────────────────────────

export function buildWebPageSchema({
  path,
  name,
  description,
  dateModified,
}: {
  path: string;
  name: string;
  description: string;
  dateModified?: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}${path}/#webpage`,
    url: `${SITE_URL}${path}`,
    name,
    description,
    inLanguage: "fr-BE",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    ...(dateModified ? { dateModified } : {}),
  };
}
