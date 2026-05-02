"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface StatCardData {
  value: string;
  unit: string;
  label: string;
  desc: string;
  dark?: boolean;
}

const STAT_CARDS: StatCardData[] = [
  {
    value: "72",
    unit: "H",
    label: "AUTONOMIE COUVERTE",
    desc: "Les 72 premières heures sont déterminantes selon le NCCN. Chaque article est choisi pour cette fenêtre.",
    dark: true,
  },
  {
    value: "23",
    unit: "ART.",
    label: "ARTICLES PAR KIT",
    desc: "Zéro redondance. Chaque élément est irremplaçable.",
  },
  {
    value: "4,2",
    unit: "KG",
    label: "POIDS DU KIT",
    desc: "Tout ce qu'il faut. Rien de plus.",
  },
  {
    value: "8",
    unit: "CHAP.",
    label: "CHAPITRES GUIDE",
    desc: "Conformes aux recommandations NCCN, BE-Alert et SPF Intérieur.",
  },
];

export function StatsSection() {
  return (
    <section
      id="science"
      className="bg-paper py-[var(--section-pad)] px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <ScrollReveal className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-ink-muted/40" />
            <span className="text-label text-ink-muted">EN CHIFFRES</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4 items-start">
            <h2 className="font-display font-black text-ink text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] tracking-tight">
              Conçu autour de la
              <br />
              fenêtre critique des 72
              <br />
              premières heures.
            </h2>
          </div>
        </ScrollReveal>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {STAT_CARDS.map((card, i) => (
            <BentoStatCard key={card.label} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BentoStatCard({
  card,
  index,
}: {
  card: StatCardData;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`rounded-2xl p-6 md:p-7 flex flex-col justify-between min-h-[180px] min-w-0 ${
        card.dark
          ? "bg-night text-paper"
          : index === 2
          ? "bg-cream"
          : "bg-white border border-sand/60"
      }`}
    >
      {/* Number */}
      <div className="flex items-baseline gap-1.5 mb-4 flex-wrap">
        <AnimatedNumber
          value={card.value}
          isInView={isInView}
          dark={card.dark}
        />
        <span
          className={`text-label ${
            card.dark ? "text-paper/50" : "text-ink-muted"
          }`}
        >
          {card.unit}
        </span>

      </div>

      {/* Label */}
      <div className="min-w-0">
        <p
          className={`text-label mb-1.5 break-words hyphens-auto ${
            card.dark ? "text-paper/50" : "text-ink-muted"
          }`}
        >
          {card.label}
        </p>
        <p
          className={`text-sm leading-snug break-words hyphens-auto ${
            card.dark ? "text-paper/80" : "text-ink/70"
          }`}
        >
          {card.desc}
        </p>
      </div>
    </motion.div>
  );
}

function AnimatedNumber({
  value,
  isInView,
  dark,
}: {
  value: string;
  isInView: boolean;
  dark?: boolean;
}) {
  const numeric = parseFloat(value.replace(",", "."));
  const isDecimal = value.includes(",");

  return (
    <motion.span
      className={`font-display font-black text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-tight ${
        dark ? "text-paper" : "text-ink"
      }`}
    >
      {isDecimal ? value : (
        <CountUp target={numeric} isInView={isInView} />
      )}
    </motion.span>
  );
}

function CountUp({
  target,
  isInView,
}: {
  target: number;
  isInView: boolean;
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  // Animation moved to useEffect to avoid accessing refs during render
  useEffect(() => {
    if (isInView && !started.current && nodeRef.current) {
      started.current = true;
      const duration = 1200;
      const start = performance.now();
      const update = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        if (nodeRef.current) {
          nodeRef.current.textContent = Math.round(ease * target).toString();
        }
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    }
  }, [isInView, target]);

  return <span ref={nodeRef}>0</span>;
}
