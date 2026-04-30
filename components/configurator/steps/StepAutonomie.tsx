"use client";

import { useConfiguratorStore } from "@/lib/kit/store";
import { StepNav } from "../StepNav";
import { useState } from "react";
import type { UserProfile } from "@/lib/kit/types";

const LEVELS: {
  id: UserProfile["autonomyLevel"];
  label: string;
  desc: string;
  items: string;
}[] = [
  {
    id: "basic",
    label: "Débutant",
    desc: "Je me prépare pour la première fois. Je veux l'essentiel.",
    items: "~18 articles essentiels uniquement",
  },
  {
    id: "prepared",
    label: "Préparé",
    desc: "J'ai déjà quelques bases. Je veux un kit complet et raisonné.",
    items: "~30 articles essentiel + recommandés",
  },
  {
    id: "expert",
    label: "Expert",
    desc: "Je maîtrise les bases. Je veux le kit le plus complet possible.",
    items: "Catalogue complet, toutes options incluses",
  },
];

export function StepAutonomie() {
  const { profile, updateProfile, computeResult, prevStep } =
    useConfiguratorStore();
  const [level, setLevel] = useState<UserProfile["autonomyLevel"]>(
    profile.autonomyLevel ?? "basic"
  );

  const handleCompute = () => {
    updateProfile({ autonomyLevel: level });
    computeResult();
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-muted mb-2">
        Votre niveau d'expérience détermine la complexité et la taille de votre
        kit.
      </p>

      {LEVELS.map((l) => (
        <button
          key={l.id}
          onClick={() => setLevel(l.id)}
          className={`text-left rounded-xl border px-5 py-5 transition-all duration-200 ${
            level === l.id
              ? "border-forest bg-forest/5"
              : "border-sand/60 hover:border-forest/30 hover:bg-cream/50"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={`font-medium text-base ${
                  level === l.id ? "text-forest" : "text-ink"
                }`}
              >
                {l.label}
              </p>
              <p className="text-sm text-ink-muted mt-1 leading-relaxed">
                {l.desc}
              </p>
              <p className="text-xs text-ink-muted/70 mt-2 font-mono">
                {l.items}
              </p>
            </div>
            {level === l.id && (
              <span className="shrink-0 text-forest font-bold text-sm mt-0.5">
                ✓
              </span>
            )}
          </div>
        </button>
      ))}

      <div className="mt-4 bg-cream rounded-xl px-5 py-4">
        <p className="text-xs text-ink-muted leading-relaxed">
          <strong className="text-ink">Prêt ?</strong> En cliquant sur
          "Calculer mon kit", notre moteur analyse vos réponses et génère
          votre liste personnalisée en quelques secondes.
        </p>
      </div>

      <StepNav
        onNext={handleCompute}
        onPrev={prevStep}
        nextLabel="Calculer mon kit →"
        isLast
      />
    </div>
  );
}
