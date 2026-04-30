"use client";

import { useConfiguratorStore } from "@/lib/kit/store";
import { StepNav } from "../StepNav";
import { useState } from "react";
import type { UserProfile } from "@/lib/kit/types";

const HOUSING_OPTIONS: {
  id: UserProfile["housing"];
  label: string;
  desc: string;
}[] = [
  {
    id: "apartment",
    label: "Appartement",
    desc: "En immeuble, accès limité extérieur",
  },
  {
    id: "house",
    label: "Maison",
    desc: "Maison avec jardin ou terrain",
  },
  {
    id: "rural",
    label: "Zone rurale",
    desc: "Maison isolée, terrain, ressources naturelles",
  },
];

const LOCATION_OPTIONS: {
  id: UserProfile["location"];
  label: string;
  desc: string;
}[] = [
  { id: "urban", label: "Urbain", desc: "Bruxelles, Liège, Gand..." },
  {
    id: "suburban",
    label: "Périurbain",
    desc: "Banlieue, petites villes",
  },
  { id: "rural", label: "Rural", desc: "Campagne, village" },
];

export function StepLogement() {
  const { profile, updateProfile, nextStep, prevStep } =
    useConfiguratorStore();
  const [housing, setHousing] = useState<UserProfile["housing"]>(
    profile.housing ?? "apartment"
  );
  const [hasGarden, setHasGarden] = useState(profile.hasGarden ?? false);
  const [location, setLocation] = useState<UserProfile["location"]>(
    profile.location ?? "urban"
  );

  const handleNext = () => {
    updateProfile({ housing, hasGarden, location });
    nextStep();
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Housing type */}
      <div>
        <p className="text-sm font-medium text-ink mb-4">Type de logement</p>
        <div className="flex flex-col gap-3">
          {HOUSING_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              active={housing === opt.id}
              onClick={() => {
                setHousing(opt.id);
                if (opt.id === "apartment") setHasGarden(false);
              }}
              label={opt.label}
              desc={opt.desc}
            />
          ))}
        </div>
      </div>

      {/* Garden */}
      {(housing === "house" || housing === "rural") && (
        <div>
          <p className="text-sm font-medium text-ink mb-3">
            Accès à un jardin / terrain ?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setHasGarden(true)}
              className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                hasGarden
                  ? "bg-forest text-paper border-forest"
                  : "border-sand-dark/60 text-ink hover:border-forest/40"
              }`}
            >
              Oui
            </button>
            <button
              onClick={() => setHasGarden(false)}
              className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ${
                !hasGarden
                  ? "bg-forest text-paper border-forest"
                  : "border-sand-dark/60 text-ink hover:border-forest/40"
              }`}
            >
              Non
            </button>
          </div>
        </div>
      )}

      {/* Location density */}
      <div>
        <p className="text-sm font-medium text-ink mb-4">Zone géographique</p>
        <div className="flex flex-col gap-3">
          {LOCATION_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.id}
              active={location === opt.id}
              onClick={() => setLocation(opt.id)}
              label={opt.label}
              desc={opt.desc}
              compact
            />
          ))}
        </div>
      </div>

      <StepNav onNext={handleNext} onPrev={prevStep} />
    </div>
  );
}

function OptionCard({
  active,
  onClick,
  label,
  desc,
  compact,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  desc: string;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border px-5 py-4 transition-all duration-200 ${
        compact ? "py-3" : ""
      } ${
        active
          ? "border-forest bg-forest/5"
          : "border-sand/60 hover:border-forest/30 hover:bg-cream/50"
      }`}
    >
      <span
        className={`font-medium ${
          active ? "text-forest" : "text-ink"
        } text-sm`}
      >
        {label}
      </span>
      {!compact && (
        <p className="text-xs text-ink-muted mt-0.5">{desc}</p>
      )}
      {compact && (
        <span className="text-xs text-ink-muted ml-2">{desc}</span>
      )}
    </button>
  );
}
