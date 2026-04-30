"use client";

/**
 * CookiePreferences — panneau de personnalisation granulaire des cookies.
 * Accessible, focus-trapped, conforme APD Belgique.
 */

import { startTransition, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ConsentChoices } from "@/lib/consent/types";
import { useConsent } from "./ConsentProvider";

/* ─── Category descriptions ─────────────────────────────────── */

interface CategoryMeta {
  key: keyof ConsentChoices;
  label: string;
  description: string;
  required: boolean;
  examples: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    key: "necessary",
    label: "Nécessaires",
    description:
      "Fonctionnalités essentielles au bon fonctionnement du site : mémorisation de votre kit, navigation entre les étapes du configurateur.",
    required: true,
    examples: "État du configurateur (Zustand, localStorage)",
  },
  {
    key: "marketing",
    label: "Marketing & Affiliation",
    description:
      "Scripts permettant le suivi des clics vers nos partenaires affiliés (Amazon Belgique, Decathlon via Awin). Nécessaires pour maintenir la gratuité du service.",
    required: false,
    examples: "Amazon tag survikit-21, Awin pixel",
  },
  {
    key: "payment",
    label: "Paiement",
    description:
      "Scripts Stripe requis pour le traitement sécurisé des paiements lors de l'achat du guide PDF Premium.",
    required: false,
    examples: "Stripe.js, Stripe Checkout",
  },
  {
    key: "analytics",
    label: "Analytique",
    description:
      "Mesure d'audience anonymisée pour améliorer l'expérience. Aucune donnée personnelle transmise à des tiers.",
    required: false,
    examples: "Non encore activé (prévu Phase 2)",
  },
];

/* ─── Toggle Switch ─────────────────────────────────────────── */

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  disabled: boolean;
  onChange: (val: boolean) => void;
  label: string;
}

function ToggleSwitch({ id, checked, disabled, onChange, label }: ToggleSwitchProps) {
  return (
    <label
      htmlFor={id}
      className={`relative inline-flex items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`
          relative inline-block w-10 h-5 rounded-full transition-colors duration-200
          focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-forest
          ${disabled
            ? "bg-sand cursor-not-allowed"
            : checked
              ? "bg-forest"
              : "bg-sand-dark"
          }
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-paper transition-transform duration-200
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </span>
    </label>
  );
}

/* ─── Main component ─────────────────────────────────────────── */

export function CookiePreferences() {
  const { choices, showPreferences, onSaveCustom, onClosePreferences, onAcceptAll, onRejectAll } =
    useConsent();

  const [draft, setDraft] = useState<ConsentChoices>({ ...choices });
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // Sync draft when panel opens — use startTransition to satisfy react-hooks/set-state-in-effect
  useEffect(() => {
    if (showPreferences) {
      startTransition(() => {
        setDraft({ ...choices });
      });
      // Focus close button on open (outside transition — DOM side-effect)
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    }
  }, [showPreferences, choices]);

  // Focus trap
  useEffect(() => {
    if (!showPreferences) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableSelectors =
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClosePreferences();
        return;
      }
      if (e.key !== "Tab") return;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelectors)
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showPreferences, onClosePreferences]);

  // Prevent background scroll when open
  useEffect(() => {
    if (showPreferences) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPreferences]);

  function handleToggle(key: keyof ConsentChoices, value: boolean) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    onSaveCustom(draft);
  }

  return (
    <AnimatePresence>
      {showPreferences && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-night/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClosePreferences}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="
              fixed inset-x-4 bottom-4 top-auto z-[70]
              md:inset-x-auto md:left-1/2 md:-translate-x-1/2
              md:w-full md:max-w-2xl
              bg-paper border border-sand-dark rounded-2xl shadow-2xl
              flex flex-col max-h-[90dvh]
              outline-none
            "
            tabIndex={-1}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-sand">
              <h2
                id={titleId}
                className="font-display text-xl font-bold text-ink"
              >
                Personnaliser mes préférences
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClosePreferences}
                aria-label="Fermer le panneau de préférences"
                className="
                  p-2 rounded-full text-ink-muted hover:text-ink hover:bg-cream
                  transition-colors duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2
                "
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Intro */}
            <p className="px-6 py-4 text-sm text-ink-muted font-sans leading-relaxed">
              Survikit utilise différentes catégories de cookies et traceurs.
              Activez uniquement ceux qui vous semblent nécessaires. Votre choix
              est conservé 6 mois.
            </p>

            {/* Categories list */}
            <ul className="px-6 overflow-y-auto flex-1 space-y-1 pb-2" role="list">
              {CATEGORIES.map((cat) => {
                const toggleId = `consent-toggle-${cat.key}`;
                const isChecked = cat.required ? true : draft[cat.key];
                return (
                  <li
                    key={cat.key}
                    className="py-4 border-b border-sand last:border-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-sans font-semibold text-sm text-ink">
                            {cat.label}
                          </span>
                          {cat.required && (
                            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted bg-cream px-2 py-0.5 rounded-full border border-sand">
                              Requis
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink-muted leading-relaxed">
                          {cat.description}
                        </p>
                        <p className="mt-1 font-mono text-[10px] text-ink-muted/70 tracking-wide">
                          {cat.examples}
                        </p>
                      </div>
                      <div className="flex-shrink-0 pt-0.5">
                        <ToggleSwitch
                          id={toggleId}
                          checked={isChecked as boolean}
                          disabled={cat.required}
                          onChange={(val) =>
                            !cat.required && handleToggle(cat.key, val)
                          }
                          label={`${cat.required ? "Toujours actif" : isChecked ? "Désactiver" : "Activer"} : ${cat.label}`}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-sand flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="
                  flex-1 bg-forest text-paper py-3 px-6 rounded-full
                  font-sans font-medium text-sm
                  hover:bg-forest-mid transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2
                "
              >
                Enregistrer mes choix
              </button>
              <button
                type="button"
                onClick={onAcceptAll}
                className="
                  flex-1 bg-cream text-ink py-3 px-6 rounded-full
                  font-sans font-medium text-sm border border-sand-dark
                  hover:bg-sand transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2
                "
              >
                Tout accepter
              </button>
              <button
                type="button"
                onClick={onRejectAll}
                className="
                  flex-1 text-ink-muted py-3 px-6 rounded-full
                  font-sans font-medium text-sm border border-sand
                  hover:border-sand-dark hover:text-ink transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2
                "
              >
                Tout refuser
              </button>
            </div>

            {/* Legal footer */}
            <div className="px-6 pb-5 pt-1">
              <p className="font-mono text-[10px] text-ink-muted/60 text-center tracking-wide">
                Conforme RGPD · APD Belgique · Votre consentement expire après 6 mois
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
