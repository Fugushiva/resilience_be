"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CheckCircle, Download } from "lucide-react";
import { GUIDE_PDF } from "@/lib/seo/constants";

const HIGHLIGHTS = [
  "8 chapitres · conformité NCCN & BE-Alert",
  "Checklists imprimables incluses",
  "Plan familial personnalisable (template PDF)",
  "Contacts officiels belges : 112, 1722, BE-Alert",
  "Mis à jour — annonces gouvernementales avril 2026",
];

export function GuideSection() {
  return (
    <section
      id="guide"
      className="bg-cream py-[var(--section-pad)] px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-ink-muted/40" />
            <span className="text-label text-ink-muted">GUIDE PREMIUM</span>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left — texte */}
          <ScrollReveal>
            <h2 className="font-display font-black text-ink text-[clamp(2rem,5vw,3.8rem)] leading-[0.95] tracking-tight mb-6">
              Le manuel complet pour{" "}
              <em className="italic text-forest">votre famille.</em>
            </h2>
            <p className="font-sans text-base md:text-lg text-ink/70 leading-relaxed mb-8 max-w-md">
              Le configurateur vous donne la liste. Le guide vous explique
              pourquoi, comment et dans quel ordre — basé sur les recommandations
              officielles du Centre de Crise National belge.
            </p>

            <ul className="space-y-3 mb-10">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-4 h-4 text-forest shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="font-sans text-sm text-ink/70">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <a
                href={GUIDE_PDF.gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-forest hover:bg-forest-mid text-paper px-8 py-4 rounded-full font-sans font-semibold text-base transition-colors duration-200"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Télécharger — {GUIDE_PDF.priceEur}€
              </a>
              <Link
                href="/guide"
                className="inline-flex items-center gap-2 text-sm text-ink-muted border border-sand-dark/60 px-7 py-4 rounded-full hover:border-forest/40 hover:text-forest transition-colors duration-200"
              >
                Voir le sommaire →
              </Link>
            </div>
          </ScrollReveal>

          {/* Right — carte produit */}
          <ScrollReveal delay={0.15}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="bg-night rounded-3xl p-8 md:p-10"
            >
              {/* Header carte */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="font-mono text-xs text-paper/40 uppercase tracking-widest mb-2">
                    PDF · {GUIDE_PDF.chapterCount} chapitres
                  </p>
                  <h3 className="font-display font-bold text-paper text-xl leading-tight">
                    Guide de Résilience
                    <br />
                    Familiale 72h
                  </h3>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-display font-black text-paper text-4xl leading-none">
                    {GUIDE_PDF.priceEur}€
                  </p>
                  <p className="font-mono text-[10px] text-paper/40 uppercase tracking-wider mt-1">
                    Accès immédiat
                  </p>
                </div>
              </div>

              {/* Badges conformité */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["NCCN", "BE-Alert", "SPF Intérieur"].map((badge) => (
                  <span
                    key={badge}
                    className="font-mono text-[10px] tracking-widest uppercase text-forest-light bg-forest/15 border border-forest/25 px-3 py-1.5 rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Séparateur */}
              <div className="border-t border-paper/10 mb-6" />

              <p className="font-mono text-xs text-paper/30 text-center">
                Paiement sécurisé · PDF livré instantanément · Aucun abonnement
              </p>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
