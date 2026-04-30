"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="bg-paper py-[var(--section-pad)] px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="bg-night rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-10"
        >
          {/* Text */}
          <div className="flex-1 max-w-lg">
            <span className="text-label text-paper/40 mb-6 block">
              PRÊT À COMMENCER ?
            </span>
            <h2 className="font-display font-black text-paper text-[clamp(2rem,5vw,4rem)] leading-[0.92] tracking-tight">
              Composez votre kit{" "}
              <em className="italic">avant d'en avoir besoin.</em>
            </h2>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 shrink-0">
            <Link
              href="/configurer"
              className="inline-flex items-center justify-center gap-3 bg-paper text-ink px-8 py-4 rounded-full font-medium text-base hover:bg-sand transition-colors duration-300 whitespace-nowrap"
            >
              Composer mon kit →
            </Link>
            <p className="text-[11px] text-paper/30 text-center">
              Gratuit · 2 minutes · Sans inscription
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-sand/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-6 rounded-full bg-forest flex items-center justify-center shrink-0"
              aria-hidden
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1L9.5 5.5H13L10 8.5L11 13L7 10.5L3 13L4 8.5L1 5.5H4.5L7 1Z"
                  fill="#F0EDE8"
                />
              </svg>
            </motion.div>
            <span className="font-display font-bold text-ink">Survikit</span>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-muted">
            <p>Kits de survie fondés sur les données.</p>
            <p>Conçus pour les 72 premières heures.</p>
          </div>

          <p className="text-xs text-ink-muted">
            © 2024 Survikit. Tous droits réservés.
          </p>
        </footer>
      </div>
    </section>
  );
}
