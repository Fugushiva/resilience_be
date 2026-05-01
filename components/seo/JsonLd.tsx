/**
 * components/seo/JsonLd.tsx
 * Composant utilitaire Server Component pour injecter du JSON-LD dans la page.
 *
 * Usage :
 *   import { JsonLd } from "@/components/seo/JsonLd";
 *   import { buildProductSchema } from "@/lib/seo/structured-data";
 *
 *   <JsonLd data={buildProductSchema()} />
 *
 * Note : Ce composant ne doit PAS être marqué "use client".
 * Il s'exécute côté serveur → le JSON-LD est dans le HTML initial → Googlebot
 * le voit sans exécuter JavaScript (critique pour les bots HTML-limited).
 *
 * Injection de plusieurs schémas :
 *   <JsonLd data={[buildOrganizationSchema(), buildWebSiteSchema()]} />
 */

import type { JsonLdObject } from "@/lib/seo/structured-data";

interface JsonLdProps {
  data: JsonLdObject | JsonLdObject[];
  /** Identifiant optionnel pour repérer le script dans l'HTML (utile en debug) */
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  // Supprimer les propriétés undefined (elles rendraient le JSON invalide)
  const cleaned = JSON.parse(
    JSON.stringify(Array.isArray(data) ? data : data, (_key, value) =>
      value === undefined ? undefined : value
    )
  ) as JsonLdObject | JsonLdObject[];

  return (
    <script
      type="application/ld+json"
      id={id}
      // dangerouslySetInnerHTML est nécessaire et sans risque ici car :
      // 1. Les données viennent exclusivement de nos builders TypeScript typés
      // 2. Aucune donnée utilisateur n'est injectée dans ces schémas
      // 3. JSON.stringify encode les caractères dangereux (<, >, &)
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(cleaned, null, 0),
      }}
    />
  );
}
