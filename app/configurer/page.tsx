/**
 * app/configurer/page.tsx — Configurateur de kit d'urgence 72h
 *
 * JSON-LD injectés :
 *  - SoftwareApplication (outil de diagnostic)
 *  - BreadcrumbList (Accueil → Configurer)
 */

import type { Metadata } from "next";
import { ConfiguratorShell } from "@/components/configurator/ConfiguratorShell";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildSoftwareApplicationSchema,
  buildBreadcrumbSchema,
  buildWebPageSchema,
} from "@/lib/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { KEYWORDS_CONFIGURATOR } from "@/lib/seo/keywords";

export const metadata: Metadata = buildPageMetadata({
  path: "/configurer",
  title: "Configurer mon kit d'urgence 72h — Diagnostic en 2 minutes",
  description:
    "Un diagnostic en 5 étapes basé sur les recommandations du Centre de Crise National belge. Foyer, logement, scénario, santé, autonomie. Résultat personnalisé — gratuit, sans inscription.",
  keywords: KEYWORDS_CONFIGURATOR,
  ogImagePath: "/configurer/opengraph-image",
});

export default function ConfigurerPage() {
  return (
    <>
      <JsonLd
        data={[
          buildSoftwareApplicationSchema(),
          buildBreadcrumbSchema([
            { name: "Accueil", url: "/" },
            { name: "Configurer mon kit", url: "/configurer" },
          ]),
          buildWebPageSchema({
            path: "/configurer",
            name: "Configurer mon kit d'urgence 72h — Diagnostic en 2 minutes",
            description:
              "Un diagnostic en 5 étapes basé sur les recommandations du Centre de Crise National belge. Foyer, logement, scénario, santé, autonomie. Résultat personnalisé — gratuit, sans inscription.",
          }),
        ]}
        id="jsonld-configurer"
      />
      <ConfiguratorShell />
    </>
  );
}
