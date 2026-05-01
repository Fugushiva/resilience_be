/**
 * app/robots.ts
 * Fichier robots.txt généré dynamiquement — Next.js 16 file convention.
 *
 * Stratégie :
 *  - Tous les bots : accès complet sauf /api/ et /_next/
 *  - /kit bloqué (contenu nécessite state Zustand, pas d'intérêt SEO direct)
 *  - Bots LLM (GPTBot, Claude-Web, CCBot) : AUTORISÉS
 *    Raison : on veut être cité dans les réponses SGE/ChatGPT pour maximiser
 *    la visibilité sur les requêtes "kit urgence Belgique" (stratégie EEAT 2026)
 *  - AhrefsBot / SemrushBot : autorisés (outils d'audit SEO légitimes)
 *
 * Génération : GET /robots.txt
 */

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Règle principale ─────────────────────────────────────────────────
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",     // Routes API — pas d'intérêt SEO
          "/_next/",   // Assets Next.js internes
          "/kit",      // Page résultat nécessite state client (noindex + disallow)
        ],
      },

      // ── Bots LLM — autorisés pour SGE / AI Overviews ────────────────────
      // Ces bots alimentent Google SGE, ChatGPT, Claude, Perplexity.
      // Les autoriser augmente la visibilité "zero-click" sur les requêtes info.
      {
        userAgent: "GPTBot",
        allow: ["/"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "CCBot",
        allow: ["/"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "Omgilibot",
        allow: ["/"],
        disallow: ["/api/", "/_next/"],
      },

      // ── Bots SEO légitimes ────────────────────────────────────────────────
      {
        userAgent: "AhrefsBot",
        allow: ["/"],
        disallow: ["/api/", "/_next/"],
        crawlDelay: 10,
      },
      {
        userAgent: "SemrushBot",
        allow: ["/"],
        disallow: ["/api/", "/_next/"],
        crawlDelay: 10,
      },
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
