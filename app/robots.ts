/**
 * app/robots.ts
 * Fichier robots.txt généré dynamiquement — Next.js 16 file convention.
 *
 * Stratégie :
 *  - Tous les bots : accès complet sauf /api/ et /_next/
 *  - /kit (racine exacte) : noindex géré via meta tag — la page est crawlable
 *    pour que Google puisse lire la directive noindex et suivre les liens sortants
 *  - /kit/ (sous-chemins, ex: /kit/[shareId]) : crawlables, metadata noindex
 *    explicite sur chaque page partagée
 *  - Bots LLM (GPTBot, Claude-Web, CCBot) : AUTORISÉS
 *    Raison : visibilité dans les réponses SGE/ChatGPT sur les requêtes
 *    "kit urgence Belgique" (stratégie EEAT 2026)
 *  - AhrefsBot / SemrushBot : autorisés (outils d'audit SEO légitimes)
 *
 * Génération : GET /robots.txt
 */

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";

const COMMON_DISALLOW = [
  "/api/",    // Routes API — pas d'intérêt SEO
  "/_next/",  // Assets Next.js internes
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Règle principale ─────────────────────────────────────────────────
      // /kit est crawlable — le noindex est géré par meta robots dans la page.
      // Bloquer via robots.txt empêcherait Google de lire la directive noindex
      // et de suivre les liens vers le Guide PDF.
      {
        userAgent: "*",
        allow: ["/"],
        disallow: COMMON_DISALLOW,
      },

      // ── Bots LLM & AI Search — autorisés pour SGE / AI Overviews ───────
      // OpenAI — ChatGPT search + browsing
      {
        userAgent: "GPTBot",
        allow: ["/"],
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/"],
        disallow: COMMON_DISALLOW,
      },
      // Anthropic — Claude search
      {
        userAgent: "ClaudeBot",
        allow: ["/"],
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "Claude-Web",
        allow: ["/"],
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/"],
        disallow: COMMON_DISALLOW,
      },
      // Google — Gemini + AI Overviews (distinct de Googlebot classique)
      {
        userAgent: "Google-Extended",
        allow: ["/"],
        disallow: COMMON_DISALLOW,
      },
      // Perplexity
      {
        userAgent: "PerplexityBot",
        allow: ["/"],
        disallow: COMMON_DISALLOW,
      },
      // Common Crawl (training datasets)
      {
        userAgent: "CCBot",
        allow: ["/"],
        disallow: COMMON_DISALLOW,
      },
      {
        userAgent: "Omgilibot",
        allow: ["/"],
        disallow: COMMON_DISALLOW,
      },

      // ── Bots SEO légitimes ────────────────────────────────────────────────
      {
        userAgent: "AhrefsBot",
        allow: ["/"],
        disallow: COMMON_DISALLOW,
        crawlDelay: 10,
      },
      {
        userAgent: "SemrushBot",
        allow: ["/"],
        disallow: COMMON_DISALLOW,
        crawlDelay: 10,
      },
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
