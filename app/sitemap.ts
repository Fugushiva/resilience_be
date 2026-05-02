/**
 * app/sitemap.ts
 * Sitemap XML généré dynamiquement — Next.js 16 file convention.
 *
 * Inclut :
 *  - Les 5 routes publiques avec priorités SEO différenciées
 *  - Les alternates hreflang fr-BE / nl-BE / x-default pour chaque URL
 *    (prépare l'expansion marché flamand Phase 2)
 *
 * Note sur les URLs nl-BE : les routes /nl/* n'existent pas encore.
 * Google les ignore proprement (avertissement Search Console, pas de pénalité).
 * La structure est prête pour next-intl Phase 2.
 *
 * Génération : GET /sitemap.xml
 * Mis en cache par Next.js (Route Handler statique).
 */

import type { MetadataRoute } from "next";
import { SITE_URL, ROUTES } from "@/lib/seo/constants";

// Date de dernière modification du code (utilisée pour lastModified)
const NOW = new Date();

// ─── Helper hreflang ──────────────────────────────────────────────────────────

function buildAlternates(path: string) {
  return {
    languages: {
      "fr-BE": `${SITE_URL}${path}`,
      "nl-BE": `${SITE_URL}/nl${path}`,
      "x-default": `${SITE_URL}${path}`,
    },
  };
}

// ─── Sitemap ──────────────────────────────────────────────────────────────────

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Landing page ── priorité maximale, mise à jour hebdo (contenu éditorial)
    {
      url: `${SITE_URL}${ROUTES.home}`,
      lastModified: NOW,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: buildAlternates(ROUTES.home),
    },

    // ── Page Guide PDF ── priorité très haute (produit payant = objectif business)
    {
      url: `${SITE_URL}${ROUTES.guide}`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.95,
      alternates: buildAlternates(ROUTES.guide),
    },

    // ── Configurateur ── cœur de l'entonnoir, mise à jour mensuelle
    {
      url: `${SITE_URL}${ROUTES.configurer}`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: buildAlternates(ROUTES.configurer),
    },

    // ── Page kit ── faible priorité (contenu hydraté client, noindex)
    // Incluse pour que les bots connaissent la route mais avec priorité minimale
    {
      url: `${SITE_URL}${ROUTES.kit}`,
      lastModified: NOW,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: buildAlternates(ROUTES.kit),
    },
  ];
}
