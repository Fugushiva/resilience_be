import { KitResultPage } from "@/components/configurator/KitResultPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon kit personnalisé — Survikit",
  description: "Votre kit d'urgence 72h personnalisé, prêt à commander.",
};

export default function KitPage() {
  return <KitResultPage />;
}
