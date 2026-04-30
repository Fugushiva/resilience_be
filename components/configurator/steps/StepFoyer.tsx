"use client";

import { useConfiguratorStore } from "@/lib/kit/store";
import { StepNav } from "../StepNav";
import { useState } from "react";

export function StepFoyer() {
  const { profile, updateProfile, nextStep } = useConfiguratorStore();
  const [adults, setAdults] = useState(profile.adults ?? 1);
  const [children, setChildren] = useState(profile.children ?? 0);
  const [teens, setTeens] = useState(profile.teens ?? 0);
  const [hasPets, setHasPets] = useState(profile.hasPets ?? false);
  const [petType, setPetType] = useState<"dog" | "cat" | "other">(
    profile.petType ?? "dog"
  );

  const handleNext = () => {
    updateProfile({ adults, children, teens, hasPets, petType });
    nextStep();
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Adults */}
      <Counter
        label="Adultes"
        sublabel="18 ans et plus"
        value={adults}
        min={1}
        max={10}
        onChange={setAdults}
      />

      {/* Teens */}
      <Counter
        label="Adolescents"
        sublabel="13 à 17 ans"
        value={teens}
        min={0}
        max={8}
        onChange={setTeens}
      />

      {/* Children */}
      <Counter
        label="Enfants"
        sublabel="12 ans et moins"
        value={children}
        min={0}
        max={8}
        onChange={setChildren}
      />

      {/* Pets */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-ink">Animaux de compagnie ?</p>
        <div className="flex gap-3 flex-wrap">
          <ToggleButton
            active={!hasPets}
            onClick={() => setHasPets(false)}
            label="Non"
          />
          <ToggleButton
            active={hasPets}
            onClick={() => setHasPets(true)}
            label="Oui"
          />
        </div>

        {hasPets && (
          <div className="flex gap-3 mt-3 flex-wrap">
            {(["dog", "cat", "other"] as const).map((type) => (
              <ToggleButton
                key={type}
                active={petType === type}
                onClick={() => setPetType(type)}
                label={type === "dog" ? "Chien" : type === "cat" ? "Chat" : "Autre"}
                small
              />
            ))}
          </div>
        )}
      </div>

      <StepNav onNext={handleNext} isFirst />
    </div>
  );
}

function Counter({
  label,
  sublabel,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-base font-medium text-ink">{label}</p>
        <p className="text-sm text-ink-muted">{sublabel}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-10 h-10 rounded-full border border-sand-dark/60 flex items-center justify-center text-ink hover:border-forest/50 hover:text-forest transition-colors text-lg font-light"
          aria-label={`Diminuer ${label}`}
          disabled={value <= min}
        >
          −
        </button>
        <span className="font-display font-bold text-2xl text-ink w-8 text-center tabular-nums">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-10 h-10 rounded-full border border-sand-dark/60 flex items-center justify-center text-ink hover:border-forest/50 hover:text-forest transition-colors text-lg font-light"
          aria-label={`Augmenter ${label}`}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  small,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 ${
        small ? "px-4 py-2 text-xs" : ""
      } ${
        active
          ? "bg-forest text-paper border-forest"
          : "bg-transparent text-ink border-sand-dark/60 hover:border-forest/40"
      }`}
    >
      {label}
    </button>
  );
}
