"use client";

/**
 * components/editorial/HomeFaqSection.tsx
 *
 * Section FAQ de la landing page — 4 questions haute intention pour les
 * requêtes "kit urgence Belgique" et les AI Overviews (ChatGPT, Perplexity,
 * Google SGE).
 *
 * Chaque réponse est un bloc autonome (sens sans contexte) avec liens vers
 * les sources primaires officielles (NCCN, BE-Alert, SPF Intérieur).
 * Le schema FAQPage correspondant est injecté dans app/page.tsx (buildFAQSchema).
 *
 * Sources liées :
 *  - crisis.be (Centre de Crise National)
 *  - be-alert.be (système d'alerte)
 *  - ibz.rrn.fgov.be (SPF Intérieur)
 */

import { ScrollReveal } from "@/components/motion/ScrollReveal";
import Link from "next/link";

interface FaqRichItem {
  question: string;
  answer: React.ReactNode;
}

const FAQ_ITEMS_RICH: FaqRichItem[] = [
  {
    question: "Qu'est-ce qu'un kit d'urgence 72h ?",
    answer: (
      <>
        Un kit d&apos;urgence 72h est un ensemble d&apos;articles essentiels permettant à un foyer de
        subsister de manière autonome pendant 72 heures sans accès aux services publics (eau,
        électricité, réseau). Il contient de l&apos;eau (3 litres par personne et par jour selon le{" "}
        <a
          href="https://www.crisis.be/fr/conseils/kit-durgence/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-forest underline underline-offset-2 hover:text-forest-mid transition-colors"
        >
          Centre de Crise National belge
        </a>
        ), des aliments non périssables, une radio à piles, une trousse de premiers secours, des
        documents importants et de l&apos;argent liquide.
      </>
    ),
  },
  {
    question: "Pourquoi 72 heures d'autonomie ?",
    answer: (
      <>
        72 heures est la durée recommandée par le{" "}
        <a
          href="https://www.crisis.be/fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-forest underline underline-offset-2 hover:text-forest-mid transition-colors"
        >
          Centre de Crise National belge (NCCN)
        </a>{" "}
        et la Commission Européenne (EU Civil Resilience Framework 2026). C&apos;est le temps estimé
        nécessaire aux services d&apos;urgence pour rétablir les services essentiels après une crise
        majeure — tempête, panne électrique prolongée, inondation ou incident industriel.
      </>
    ),
  },
  {
    question: "Quels sont les risques d'urgence en Belgique ?",
    answer: (
      <>
        Les principaux risques reconnus par le{" "}
        <a
          href="https://www.crisis.be/fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-forest underline underline-offset-2 hover:text-forest-mid transition-colors"
        >
          Centre de Crise National
        </a>{" "}
        sont : les pannes électriques prolongées, les inondations (vallées de la Meuse et de la
        Vesdre), les incidents industriels SEVESO (300+ sites en Belgique), les tempêtes hivernales,
        et les incidents de transport de matières dangereuses.{" "}
        <a
          href="https://www.be-alert.be/fr/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-forest underline underline-offset-2 hover:text-forest-mid transition-colors"
        >
          BE-Alert
        </a>{" "}
        permet de recevoir des alertes officielles par SMS selon votre commune.
      </>
    ),
  },
  {
    question: "Le configurateur Survikit est-il vraiment gratuit ?",
    answer: (
      <>
        Oui. Le configurateur est entièrement gratuit, sans inscription et sans collecte de données
        personnelles. En 5 étapes (foyer, logement, scénario, santé, autonomie souhaitée), il génère
        une liste personnalisée basée sur les recommandations du{" "}
        <a
          href="https://www.crisis.be/fr/conseils/kit-durgence/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-forest underline underline-offset-2 hover:text-forest-mid transition-colors"
        >
          NCCN
        </a>
        . Un{" "}
        <Link
          href="/guide"
          className="text-forest underline underline-offset-2 hover:text-forest-mid transition-colors"
        >
          guide PDF complet
        </Link>{" "}
        est disponible séparément (14,99€) pour aller plus loin.
      </>
    ),
  },
];

export function HomeFaqSection() {
  return (
    <section
      id="faq"
      className="bg-paper py-[var(--section-pad)] px-6 md:px-12"
      aria-labelledby="home-faq-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-ink-muted/40" />
            <span className="text-label text-ink-muted">QUESTIONS FRÉQUENTES</span>
          </div>
          <div className="grid md:grid-cols-2 items-end gap-8">
            <h2
              id="home-faq-heading"
              className="font-display font-black text-ink text-[clamp(2rem,5vw,3.8rem)] leading-[0.95] tracking-tight"
            >
              Tout ce que vous devez{" "}
              <em className="italic text-forest">savoir.</em>
            </h2>
            <p className="text-base text-ink/70 leading-relaxed max-w-xs md:ml-auto">
              Basé sur les recommandations officielles du Centre de Crise National belge et de
              BE-Alert.
            </p>
          </div>
        </ScrollReveal>

        {/* FAQ list */}
        <ScrollReveal>
          <dl className="divide-y divide-sand/40">
            {FAQ_ITEMS_RICH.map((item) => (
              <div key={item.question} className="py-8 first:pt-0">
                <dt>
                  <h3 className="font-display font-bold text-lg md:text-xl text-ink leading-snug mb-4">
                    {item.question}
                  </h3>
                </dt>
                <dd className="font-sans text-base text-ink/65 leading-relaxed max-w-3xl">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </ScrollReveal>

        {/* CTA bas de section */}
        <ScrollReveal delay={0.2} className="mt-12 pt-8 border-t border-sand/40">
          <p className="font-sans text-sm text-ink/60 mb-4">
            D&apos;autres questions ? Le guide PDF répond en détail à chaque scénario.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/configurer"
              className="inline-flex items-center gap-2 bg-forest text-paper px-6 py-3 rounded-full font-sans font-medium text-sm hover:bg-forest-mid transition-colors duration-200"
            >
              Configurer mon kit gratuit →
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center gap-2 border border-sand-dark/60 text-ink-muted px-6 py-3 rounded-full font-sans text-sm hover:border-forest/40 hover:text-forest transition-colors duration-200"
            >
              Voir le guide PDF
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
