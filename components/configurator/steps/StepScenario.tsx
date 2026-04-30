"use client";

import { useConfiguratorStore } from "@/lib/kit/store";
import { StepNav } from "../StepNav";
import { useState } from "react";
import type { UserProfile } from "@/lib/kit/types";

const SCENARIOS: {
  id: UserProfile["scenario"];
  label: string;
  desc: string;
  icon: string;
}[] = [
  {
    id: "urban_power",
    label: "Panne urbaine",
    desc: "Panne de courant, coupure eau, incident industriel en ville",
    icon: "⚡",
  },
  {
    id: "evacuation",
    label: "Évacuation rapide",
    desc: "Devoir quitter son domicile dans l'heure avec le strict nécessaire",
    icon: "🚪",
  },
  {
    id: "general",
    label: "Urgence générale",
    desc: "Couverture polyvalente pour tout scénario belge",
    icon: "🛡️",
  },
  {
    id: "mountain",
    label: "Montagne / Randonnée",
    desc: "Isolation en altitude, météo imprévisible, loin des secours",
    icon: "⛰️",
  },
  {
    id: "forest",
    label: "Forêt / Nature",
    desc: "Randonnée longue durée, bivouac, forêt ardennaise",
    icon: "🌲",
  },
];

export function StepScenario() {
  const { profile, updateProfile, nextStep, prevStep } =
    useConfiguratorStore();
  const [scenario, setScenario] = useState<UserProfile["scenario"]>(
    profile.scenario ?? "urban_power"
  );

  const handleNext = () => {
    updateProfile({ scenario });
    nextStep();
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-muted mb-2">
        Choisissez le scénario principal pour lequel vous souhaitez vous
        préparer.
      </p>

      {SCENARIOS.map((s) => (
        <button
          key={s.id}
          onClick={() => setScenario(s.id)}
          className={`text-left rounded-xl border px-5 py-4 flex items-start gap-4 transition-all duration-200 ${
            scenario === s.id
              ? "border-forest bg-forest/5"
              : "border-sand/60 hover:border-forest/30 hover:bg-cream/50"
          }`}
        >
          <span className="text-2xl mt-0.5 shrink-0">{s.icon}</span>
          <div>
            <p
              className={`font-medium text-sm ${
                scenario === s.id ? "text-forest" : "text-ink"
              }`}
            >
              {s.label}
            </p>
            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
              {s.desc}
            </p>
          </div>
          {scenario === s.id && (
            <span className="ml-auto shrink-0 text-forest font-bold text-sm">
              ✓
            </span>
          )}
        </button>
      ))}

      <StepNav onNext={handleNext} onPrev={prevStep} />
    </div>
  );
}
