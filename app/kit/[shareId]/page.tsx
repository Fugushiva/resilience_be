import { getKitByShareId } from "@/lib/supabase/actions";
import { SharedKitView } from "@/components/configurator/SharedKitView";
import type { Metadata } from "next";
import type { KitResult } from "@/lib/kit/types";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo/constants";

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
      robots: { index: false, follow: false },
    };
  }

  const kit = result.data;
  const scenario = kit.scenario ?? "général";
  const persons = kit.persons ?? 1;

  const title = `Kit d'urgence ${scenario} pour ${persons} personne${persons > 1 ? "s" : ""} — Survikit`;
  const description = `Kit d'urgence 72h personnalisé — ${kit.essential_count ?? 0} articles essentiels, ~${Math.round(kit.total_eur ?? 0)}€. Configurez le vôtre gratuitement sur Survikit.`;
  const canonicalUrl = `${SITE_URL}/kit/${shareId}`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Kit d'urgence 72h personnalisé — Survikit`,
      description,
      url: canonicalUrl,
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
