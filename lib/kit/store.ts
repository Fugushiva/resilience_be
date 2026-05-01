"use client";

import { create } from "zustand";
import type { UserProfile, ConfigStep, KitResult } from "./types";
import { computeKit } from "./rules";
import { saveKit, updateKit } from "@/lib/supabase/actions";
import type { DbKit } from "@/lib/supabase/types";

// ─── Session ID ──────────────────────────────────────────────
// Anonymous session tracking for kit persistence before auth
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "survikit_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// ─── Sync State ──────────────────────────────────────────────

interface SyncState {
  /** The persisted kit row from Supabase */
  savedKit: DbKit | null;
  /** Whether a save/update operation is in progress */
  isSaving: boolean;
  /** Last sync error message */
  syncError: string | null;
  /** The share URL slug */
  shareId: string | null;
}

// ─── Store Interface ─────────────────────────────────────────

interface ConfiguratorStore {
  // Navigation
  currentStep: ConfigStep;
  completedSteps: ConfigStep[];

  // Form data
  profile: Partial<UserProfile>;

  // Result
  result: KitResult | null;
  isComputing: boolean;

  // Supabase sync
  sync: SyncState;

  // Actions
  setStep: (step: ConfigStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  computeResult: () => void;
  reset: () => void;

  // Persistence actions
  persistKit: () => Promise<void>;
  getShareUrl: () => string | null;
  clearSyncError: () => void;
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

  // Sync state
  sync: {
    savedKit: null,
    isSaving: false,
    syncError: null,
    shareId: null,
  },

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
      sync: {
        savedKit: null,
        isSaving: false,
        syncError: null,
        shareId: null,
      },
    }),

  // ─── Persistence Actions ─────────────────────────────────

  persistKit: async () => {
    const { result, sync } = get();
    if (!result) return;

    // Optimistic: mark saving immediately
    set({
      sync: { ...sync, isSaving: true, syncError: null },
    });

    try {
      const sessionId = getOrCreateSessionId();

      if (sync.savedKit) {
        // Update existing kit
        const res = await updateKit(sync.savedKit.id, result);
        if (res.success && res.data) {
          set({
            sync: {
              savedKit: res.data,
              isSaving: false,
              syncError: null,
              shareId: res.data.share_id,
            },
          });
        } else {
          set({
            sync: {
              ...get().sync,
              isSaving: false,
              syncError: res.error ?? "Erreur de sauvegarde",
            },
          });
        }
      } else {
        // Insert new kit
        const res = await saveKit(result, sessionId);
        if (res.success && res.data) {
          set({
            sync: {
              savedKit: res.data,
              isSaving: false,
              syncError: null,
              shareId: res.data.share_id,
            },
          });
        } else {
          set({
            sync: {
              ...get().sync,
              isSaving: false,
              syncError: res.error ?? "Erreur de sauvegarde",
            },
          });
        }
      }
    } catch (err) {
      set({
        sync: {
          ...get().sync,
          isSaving: false,
          syncError:
            err instanceof Error ? err.message : "Erreur de connexion",
        },
      });
    }
  },

  getShareUrl: () => {
    const { sync } = get();
    if (!sync.shareId) return null;
    if (typeof window === "undefined") return null;
    return `${window.location.origin}/kit/${sync.shareId}`;
  },

  clearSyncError: () =>
    set((state) => ({
      sync: { ...state.sync, syncError: null },
    })),
}));

export { STEP_ORDER };
