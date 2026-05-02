/**
 * app/sitemap.ts
 * Sitemap XML généré dynamiquement — Next.js 16 file convention.
 *
 * Inclut les 3 routes publiques indexables avec priorités SEO différenciées.
 *
 * Exclusions :
 *  - /kit : noindex (contenu hydraté client sans valeur indexable)
 *  - /kit/[shareId] : non inclus (découverte via crawl ; à ajouter si indexation souhaitée)
 *
 * hreflang : fr-BE + x-default uniquement (Phase 1 — pas de version nl-BE)
 *
 * Génération : GET /sitemap.xml
 * Mis en cache par Next.js (Route Handler statique).
 */

import type { MetadataRoute } from "next";
import { SITE_URL, ROUTES, SITE_DATE_MODIFIED } from "@/lib/seo/constants";

// Utilise la date de dernière modification réelle du contenu, pas la date de build
const LAST_MODIFIED = new Date(SITE_DATE_MODIFIED);

// ─── Helper alternates fr-BE / x-default ─────────────────────────────────────

function buildAlternates(path: string) {
  return {
    languages: {
      "fr-BE": `${SITE_URL}${path}`,
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
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: buildAlternates(ROUTES.home),
    },

    // ── Page Guide PDF ── priorité très haute (produit payant = objectif business)
    {
      url: `${SITE_URL}${ROUTES.guide}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.95,
      alternates: buildAlternates(ROUTES.guide),
    },

    // ── Configurateur ── cœur de l'entonnoir, mise à jour mensuelle
    {
      url: `${SITE_URL}${ROUTES.configurer}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: buildAlternates(ROUTES.configurer),
    },
  ];
}
