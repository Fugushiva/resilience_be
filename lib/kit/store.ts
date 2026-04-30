"use client";

import { create } from "zustand";
import type { UserProfile, ConfigStep, KitResult } from "./types";
import { computeKit } from "./rules";

interface ConfiguratorStore {
  // Navigation
  currentStep: ConfigStep;
  completedSteps: ConfigStep[];

  // Form data
  profile: Partial<UserProfile>;

  // Result
  result: KitResult | null;
  isComputing: boolean;

  // Actions
  setStep: (step: ConfigStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  computeResult: () => void;
  reset: () => void;
}

const STEP_ORDER: ConfigStep[] = [
  "foyer",
  "logement",
  "scenario",
  "sante",
  "autonomie",
];

const DEFAULT_PROFILE: UserProfile = {
  adults: 1,
  children: 0,
  teens: 0,
  hasPets: false,
  housing: "apartment",
  hasGarden: false,
  scenario: "urban_power",
  medicalNeeds: false,
  dietaryRestrictions: [],
  autonomyLevel: "basic",
  location: "urban",
};

export const useConfiguratorStore = create<ConfiguratorStore>((set, get) => ({
  currentStep: "foyer",
  completedSteps: [],
  profile: {},
  result: null,
  isComputing: false,

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep, completedSteps } = get();
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx < STEP_ORDER.length - 1) {
      const next = STEP_ORDER[idx + 1];
      set({
        currentStep: next,
        completedSteps: completedSteps.includes(currentStep)
          ? completedSteps
          : [...completedSteps, currentStep],
      });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx > 0) {
      set({ currentStep: STEP_ORDER[idx - 1] });
    }
  },

  updateProfile: (data) =>
    set((state) => ({ profile: { ...state.profile, ...data } })),

  computeResult: () => {
    const { profile } = get();
    set({ isComputing: true });

    // Merge with defaults for any missing fields
    const fullProfile: UserProfile = { ...DEFAULT_PROFILE, ...profile };

    // Simulate "AI thinking" with a brief delay for UX
    setTimeout(() => {
      const result = computeKit(fullProfile);
      set({ result, isComputing: false });
    }, 1800);
  },

  reset: () =>
    set({
      currentStep: "foyer",
      completedSteps: [],
      profile: {},
      result: null,
      isComputing: false,
    }),
}));

export { STEP_ORDER };
