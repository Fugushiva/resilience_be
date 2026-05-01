/**
 * app/kit/page.tsx — Page résultat kit personnalisé
 *
 * Stratégie metadata hybride :
 *  - generateMetadata lit les searchParams optionnels ?score=&persons=&hours=&essentials=
 *  - Si présents (lien partagé) : titre + description dynamiques
 *  - Sinon : titre/description statiques génériques
 *  - robots: noindex (le contenu sans state Zustand est vide)
 *
 * Le KitResultPage.tsx met à jour document.title côté client via useEffect
 * dès que le résultat Zustand est hydraté.
 */

import type { Metadata } from "next";
import { KitResultPage } from "@/components/configurator/KitResultPage";
import { buildKitDynamicMetadata } from "@/lib/seo/metadata";

type Props = {
  searchParams: Promise<{
    score?: string;
    persons?: string;
    hours?: string;
    essentials?: string;
  }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  return buildKitDynamicMetadata(sp);
}

export default function KitPage() {
  return <KitResultPage />;
}
