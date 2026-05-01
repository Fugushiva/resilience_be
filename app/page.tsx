/**
 * app/page.tsx — Landing page (/)
 *
 * JSON-LD injectés :
 *  - SoftwareApplication (configurateur gratuit)
 *  - Product (Guide PDF Premium — 14,99€)
 *  - Breadcrumb (niveau racine)
 */

import type { Metadata } from "next";
import { HeroSection } from "@/components/editorial/HeroSection";
import { StatsSection } from "@/components/editorial/StatsSection";
import { KitsSection } from "@/components/editorial/KitsSection";
import { TimelineSection } from "@/components/editorial/TimelineSection";
import { CtaSection } from "@/components/editorial/CtaSection";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildSoftwareApplicationSchema,
  buildProductSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { KEYWORDS_HOME } from "@/lib/seo/keywords";

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
       */}
      <JsonLd
        data={[
          buildSoftwareApplicationSchema(),
          buildProductSchema(),
          buildBreadcrumbSchema([{ name: "Accueil", url: "/" }]),
        ]}
        id="jsonld-home"
      />

      <HeroSection />
      <StatsSection />
      <KitsSection />
      <TimelineSection />
      <CtaSection />
    </>
  );
}
