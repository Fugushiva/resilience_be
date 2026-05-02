/**
 * app/page.tsx — Landing page (/)
 *
 * JSON-LD injectés :
 *  - SoftwareApplication (configurateur gratuit)
 *  - Product (Guide PDF Premium — 14,99€)
 *  - BreadcrumbList (niveau racine)
 *  - WebPage (entité page dans le graph)
 *  - FAQPage (rich results + visibilité AI Overviews)
 */

import type { Metadata } from "next";
import { HeroSection } from "@/components/editorial/HeroSection";
import { StatsSection } from "@/components/editorial/StatsSection";
import { KitsSection } from "@/components/editorial/KitsSection";
import { TimelineSection } from "@/components/editorial/TimelineSection";
import { GuideSection } from "@/components/editorial/GuideSection";
import { HomeFaqSection } from "@/components/editorial/HomeFaqSection";
import { CtaSection } from "@/components/editorial/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildSoftwareApplicationSchema,
  buildProductSchema,
  buildBreadcrumbSchema,
  buildWebPageSchema,
  buildFAQSchema,
} from "@/lib/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { KEYWORDS_HOME } from "@/lib/seo/keywords";

// ─── FAQ home — questions haute intention pour AI Overviews ──────────────────
// Blocs autonomes (sens sans contexte) : chaque réponse fonctionne seule.
// Sources primaires liées dans le rendu JSX (HomeFaqSection).

export const HOME_FAQ_SCHEMA_ITEMS = [
  {
    question: "Qu'est-ce qu'un kit d'urgence 72h ?",
    answer:
      "Un kit d'urgence 72h est un ensemble d'articles essentiels permettant à un foyer de subsister de manière autonome pendant 72 heures sans accès aux services publics (eau, électricité, réseau). Il contient de l'eau (3L/personne/jour selon le NCCN), des aliments non périssables, une radio à piles, une trousse de premiers secours, des documents importants et de l'argent liquide. Le Centre de Crise National belge recommande que chaque foyer en dispose.",
  },
  {
    question: "Pourquoi 72 heures d'autonomie ?",
    answer:
      "72 heures est la durée recommandée par le Centre de Crise National belge (NCCN) et la Commission Européenne (EU Civil Resilience Framework 2026). C'est le temps estimé nécessaire aux services d'urgence pour rétablir les services essentiels après une crise majeure (tempête, panne électrique, inondation, incident industriel). Cette durée est aussi adoptée par la FEMA aux États-Unis et la FINRA en Europe du Nord.",
  },
  {
    question: "Quels sont les risques d'urgence en Belgique ?",
    answer:
      "Les principaux risques reconnus par le Centre de Crise National belge sont : les pannes électriques prolongées (réseau haute tension vulnérable), les inondations (vallées de la Meuse et de la Vesdre), les incidents industriels SEVESO (300+ sites en Belgique), les tempêtes hivernales, et les incidents de transport de matières dangereuses. BE-Alert permet de recevoir des alertes officielles par SMS selon votre commune.",
  },
  {
    question: "Le configurateur Survikit est-il vraiment gratuit ?",
    answer:
      "Oui. Le configurateur de kit d'urgence Survikit est entièrement gratuit, sans inscription et sans collecte de données personnelles. En 5 étapes (foyer, logement, scénario, santé, autonomie souhaitée), il génère une liste personnalisée d'articles essentiels basée sur les recommandations du NCCN. Un guide PDF complet est disponible séparément (14,99€) pour aller plus loin.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  path: "/",
  title: "Survikit — Le kit 72h conçu pour les familles belges",
  description:
    "Configurez en 2 minutes le kit d'urgence adapté à votre foyer. Fondé sur les recommandations du Centre de Crise National belge (NCCN). Sérénité familiale, conformité BE-Alert.",
  keywords: KEYWORDS_HOME,
  ogImagePath: "/opengraph-image",
});

export default function HomePage() {
  return (
    <>
      {/*
       * JSON-LD page-level :
       * SoftwareApplication → Rich Snippet "Outil gratuit" dans la SERP
       * Product            → Rich Snippet prix + disponibilité du Guide PDF
       * BreadcrumbList     → Navigation enrichie (niveau racine)
       * WebPage            → Nœud page dans le graph d'entités
       * FAQPage            → Rich Results "Questions fréquentes" + AI Overviews
       */}
      <JsonLd
        data={[
          buildSoftwareApplicationSchema(),
          buildProductSchema(),
          buildBreadcrumbSchema([{ name: "Accueil", url: "/" }]),
          buildWebPageSchema({
            path: "/",
            name: "Survikit — Le kit 72h conçu pour les familles belges",
            description:
              "Configurez en 2 minutes le kit d'urgence adapté à votre foyer. Fondé sur les recommandations du Centre de Crise National belge (NCCN). Sérénité familiale, conformité BE-Alert.",
          }),
          buildFAQSchema(HOME_FAQ_SCHEMA_ITEMS),
        ]}
        id="jsonld-home"
      />

      <HeroSection />
      <StatsSection />
      <KitsSection />
      <TimelineSection />
      <GuideSection />
      <HomeFaqSection />
      <CtaSection />
    </>
  );
}
