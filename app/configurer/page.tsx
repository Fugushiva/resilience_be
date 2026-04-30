import { ConfiguratorShell } from "@/components/configurator/ConfiguratorShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurer mon kit — Survikit",
  description:
    "Créez votre kit d'urgence 72h personnalisé en 2 minutes. Adapté à votre foyer, logement et scénario.",
};

export default function ConfigurerPage() {
  return <ConfiguratorShell />;
}
