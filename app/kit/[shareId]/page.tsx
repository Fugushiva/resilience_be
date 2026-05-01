import { getKitByShareId } from "@/lib/supabase/actions";
import { SharedKitView } from "@/components/configurator/SharedKitView";
import type { Metadata } from "next";
import type { KitResult } from "@/lib/kit/types";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ shareId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { shareId } = await params;
  const result = await getKitByShareId(shareId);

  if (!result.success || !result.data) {
    return {
      title: "Kit introuvable — Survikit",
    };
  }

  const kit = result.data;
  const scenario = kit.scenario ?? "general";
  const persons = kit.persons ?? 1;

  return {
    title: `Kit ${scenario} pour ${persons} personne${persons > 1 ? "s" : ""} — Survikit`,
    description: `Kit d'urgence 72h personnalisé — ~${Math.round(kit.total_eur ?? 0)}€, ${kit.essential_count ?? 0} articles essentiels.`,
    openGraph: {
      title: `Kit de survie 72h personnalisé — Survikit`,
      description: `${kit.essential_count ?? 0} articles essentiels, ~${Math.round(kit.total_eur ?? 0)}€. Configurez le vôtre gratuitement.`,
    },
  };
}

export default async function SharedKitPage({ params }: PageProps) {
  const { shareId } = await params;
  const result = await getKitByShareId(shareId);

  if (!result.success || !result.data) {
    notFound();
  }

  const kitResult = result.data.items as unknown as KitResult;

  // Validate that the stored JSONB has the expected shape
  if (!kitResult?.categories || !kitResult?.profile) {
    notFound();
  }

  return <SharedKitView kitResult={kitResult} shareId={shareId} />;
}
