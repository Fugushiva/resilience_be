"use client";

/**
 * ConsentProvider — React context for GDPR consent state.
 * Gère l'état global du consentement et expose les helpers aux composants enfants.
 * Le script-gating (activation conditionnelle des scripts tiers) se fait ici.
 */

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ConsentChoices, ConsentRecord, ConsentStatus } from "@/lib/consent/types";
import { DEFAULT_CHOICES } from "@/lib/consent/types";
import {
  acceptAll,
  readConsent,
  rejectAll,
  saveCustomChoices,
} from "@/lib/consent/storage";

/* ─── Context shape ─────────────────────────────────────────── */

interface ConsentContextValue {
  /** Current consent status — "pending" until user has chosen */
  status: ConsentStatus;
  /** Granular choices */
  choices: ConsentChoices;
  /** Whether the banner should be shown */
  showBanner: boolean;
  /** Whether the preferences panel is open */
  showPreferences: boolean;
  /** Actions */
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSaveCustom: (choices: ConsentChoices) => void;
  onOpenPreferences: () => void;
  onClosePreferences: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

/* ─── Hook ──────────────────────────────────────────────────── */

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used inside <ConsentProvider>");
  }
  return ctx;
}

/* ─── Provider ──────────────────────────────────────────────── */

interface ConsentProviderProps {
  children: React.ReactNode;
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const [record, setRecord] = useState<ConsentRecord | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  /**
   * hydrated: true after first client render.
   * Prevents SSR mismatch — banner stays hidden until we've read localStorage.
   */
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    // Batch both state updates in a single transition to satisfy react-hooks/set-state-in-effect.
    // We read external storage (localStorage) and sync to React state — valid effect side-effect.
    startTransition(() => {
      setRecord(stored);
      setHydrated(true);
    });
  }, []);

  const handleAcceptAll = useCallback(() => {
    const r = acceptAll();
    setRecord(r);
    setShowPreferences(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    const r = rejectAll();
    setRecord(r);
    setShowPreferences(false);
  }, []);

  const handleSaveCustom = useCallback((choices: ConsentChoices) => {
    const r = saveCustomChoices(choices);
    setRecord(r);
    setShowPreferences(false);
  }, []);

  const handleOpenPreferences = useCallback(() => {
    setShowPreferences(true);
  }, []);

  const handleClosePreferences = useCallback(() => {
    setShowPreferences(false);
  }, []);

  const status: ConsentStatus = record?.status ?? "pending";
  const choices: ConsentChoices = record?.choices ?? DEFAULT_CHOICES;
  const showBanner = hydrated && status === "pending";

  return (
    <ConsentContext.Provider
      value={{
        status,
        choices,
        showBanner,
        showPreferences,
        onAcceptAll: handleAcceptAll,
        onRejectAll: handleRejectAll,
        onSaveCustom: handleSaveCustom,
        onOpenPreferences: handleOpenPreferences,
        onClosePreferences: handleClosePreferences,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}
