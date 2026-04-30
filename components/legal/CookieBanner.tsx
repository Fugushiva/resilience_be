"use client";

/**
 * CookieBanner — bannière de consentement RGPD conforme APD Belgique.
 *
 * - Invisible si le choix a déjà été fait (ou expiré → nouvelle bannière)
 * - Trois actions : Accepter tout / Refuser tout / Personnaliser
 * - Focus trap et navigation clavier complète
 * - Accessible : rôle dialog, aria-modal, aria-labelledby, aria-describedby
 */

import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useConsent } from "./ConsentProvider";
import { CookiePreferences } from "./CookiePreferences";

export function CookieBanner() {
  const { showBanner, onAcceptAll, onRejectAll, onOpenPreferences } =
    useConsent();

  const bannerRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  // Focus the first action button when banner appears
  useEffect(() => {
    if (showBanner) {
      requestAnimationFrame(() => {
        firstButtonRef.current?.focus();
      });
    }
  }, [showBanner]);

  // Focus trap within the banner
  useEffect(() => {
    if (!showBanner) return;

    const banner = bannerRef.current;
    if (!banner) return;

    const focusableSelectors =
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (!banner) return;

      const focusable = Array.from(
        banner.querySelectorAll<HTMLElement>(focusableSelectors)
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
  }, [showBanner]);

  return (
    <>
      {/* Preferences panel (rendered separately, z-index above banner) */}
      <CookiePreferences />

      {/* Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            ref={bannerRef}
            key="cookie-banner"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="
              fixed bottom-4 inset-x-4 z-50
              sm:inset-x-6
              md:bottom-6 md:left-auto md:right-6 md:max-w-md
              lg:max-w-lg
              bg-paper border border-sand-dark rounded-2xl shadow-2xl
              p-6
              outline-none
            "
            tabIndex={-1}
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div
                className="flex-shrink-0 w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center mt-0.5"
                aria-hidden="true"
              >
                <ShieldCheck size={18} className="text-forest" />
              </div>
              <div>
                <h2
                  id={titleId}
                  className="font-display font-bold text-lg text-ink leading-tight"
                >
                  Vos données, votre choix
                </h2>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted mt-0.5">
                  Conformité RGPD · APD Belgique
                </p>
              </div>
            </div>

            {/* Description */}
            <p
              id={descId}
              className="font-sans text-sm text-ink-muted leading-relaxed mb-5"
            >
              Survikit utilise des cookies pour les liens affiliés (Amazon BE,
              Decathlon) et le paiement sécurisé (Stripe). Le configurateur
              fonctionne intégralement sans cookies de suivi.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              {/* Primary: Accept all */}
              <button
                ref={firstButtonRef}
                type="button"
                onClick={onAcceptAll}
                className="
                  w-full bg-forest text-paper py-3 px-6 rounded-full
                  font-sans font-medium text-sm
                  hover:bg-forest-mid transition-colors duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                "
              >
                Accepter tout
              </button>

              {/* Secondary row */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onRejectAll}
                  className="
                    flex-1 text-ink py-2.5 px-4 rounded-full
                    font-sans font-medium text-sm
                    border border-sand-dark
                    hover:bg-cream transition-colors duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                  "
                >
                  Refuser tout
                </button>
                <button
                  type="button"
                  onClick={onOpenPreferences}
                  aria-haspopup="dialog"
                  className="
                    flex-1 text-ink-muted py-2.5 px-4 rounded-full
                    font-sans font-medium text-sm
                    border border-sand
                    hover:border-sand-dark hover:text-ink transition-colors duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper
                  "
                >
                  Personnaliser
                </button>
              </div>
            </div>

            {/* Legal note */}
            <p className="mt-4 font-mono text-[10px] text-ink-muted/60 text-center tracking-wide">
              Votre consentement est conservé 6 mois · Modifiable à tout moment
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
