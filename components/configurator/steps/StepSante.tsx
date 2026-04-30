"use client";

import { useConfiguratorStore } from "@/lib/kit/store";
import { StepNav } from "../StepNav";
import { useState } from "react";

const DIETARY = [
  { id: "vegetarian", label: "Végétarien" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten_free", label: "Sans gluten" },
  { id: "lactose_free", label: "Sans lactose" },
  { id: "halal", label: "Halal" },
  { id: "kosher", label: "Kasher" },
];

export function StepSante() {
  const { profile, updateProfile, nextStep, prevStep } =
    useConfiguratorStore();
  const [medicalNeeds, setMedicalNeeds] = useState(
    profile.medicalNeeds ?? false
  );
  const [dietary, setDietary] = useState<string[]>(
    profile.dietaryRestrictions ?? []
  );

  const toggleDietary = (id: string) => {
    setDietary((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    updateProfile({ medicalNeeds, dietaryRestrictions: dietary });
    nextStep();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Medical */}
      <div>
        <p className="text-sm font-medium text-ink mb-1">
          Traitements médicaux continus ?
        </p>
        <p className="text-xs text-ink-muted mb-4">
          Insuline, anticoagulants, épinéphrine, etc. — nous adapterons les
          priorités de votre kit (sans remplacer l'avis médical).
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setMedicalNeeds(false)}
            className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ${
              !medicalNeeds
                ? "bg-forest text-paper border-forest"
                : "border-sand-dark/60 text-ink hover:border-forest/40"
            }`}
          >
            Non
          </button>
          <button
            onClick={() => setMedicalNeeds(true)}
            className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ${
              medicalNeeds
                ? "bg-forest text-paper border-forest"
                : "border-sand-dark/60 text-ink hover:border-forest/40"
            }`}
          >
            Oui
          </button>
        </div>
        {medicalNeeds && (
          <p className="mt-3 text-xs text-ink/60 bg-cream rounded-lg px-4 py-3 leading-relaxed">
            Le kit inclura une priorité sur les documents médicaux et une
            trousse de soins renforcée. Consultez votre médecin traitant pour
            un stock de médicaments d'ordonnance.
          </p>
        )}
      </div>

      {/* Dietary */}
      <div>
        <p className="text-sm font-medium text-ink mb-4">
          Restrictions alimentaires
        </p>
        <div className="flex flex-wrap gap-2">
          {DIETARY.map((d) => (
            <button
              key={d.id}
              onClick={() => toggleDietary(d.id)}
              className={`px-4 py-2 rounded-full border text-xs font-medium transition-all duration-200 ${
                dietary.includes(d.id)
                  ? "bg-forest text-paper border-forest"
                  : "border-sand-dark/60 text-ink hover:border-forest/40"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-muted">
          Sélectionnez toutes celles qui s'appliquent.
        </p>
      </div>

      <StepNav onNext={handleNext} onPrev={prevStep} />
    </div>
  );
}
