"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

const WORDS = [
  { text: "Préparez", italic: false },
  { text: "votre famille.", italic: false },
  { text: "Sereinement.", italic: true },
];

const STATS = [
  { value: "72", unit: "H", label: "HEURES COUVERTES" },
  { value: "23", unit: "ART.", label: "ARTICLES ESSENTIELS" },
  { value: "4,2", unit: "KG", label: "POIDS TOTAL" },
];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const radialY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const radialOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] bg-paper flex flex-col overflow-hidden"
    >
      {/* Radial glow — matching PDF page 1 */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        aria-hidden
        style={{
          y: radialY,
          opacity: radialOpacity,
          background:
            "radial-gradient(ellipse at center, rgba(74,148,96,0.13) 0%, rgba(74,148,96,0.06) 40%, transparent 70%)",
        }}
      />

      {/* Breadcrumb header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex items-center justify-between pt-28 pb-0 px-6 md:px-12"
      >
        <span className="text-label text-ink-muted">
          — PRÉPARATION · ÉDITION 2026
        </span>
        <span className="text-label text-ink-muted hidden md:block">
          1 / 5
        </span>
      </motion.div>

      {/* Main title */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 pt-12 pb-8 md:pb-0">
        <h1 className="font-display font-black text-ink leading-[0.92] tracking-tight mb-12 md:mb-16">
          {WORDS.map((word, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.5 + i * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`inline-block text-[clamp(2.8rem,9vw,8.5rem)] ${
                  word.italic ? "italic text-forest" : ""
                }`}
              >
                {word.text}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Bottom row — description + stats */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-base md:text-lg text-ink/75 leading-relaxed max-w-sm mb-8">
              Survikit vous aide à préparer votre foyer aux urgences —
              configurateur gratuit, guide officiel basé sur les recommandations
              du Centre de Crise National belge.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/configurer"
                className="group inline-flex items-center justify-between gap-4 bg-forest text-paper px-7 py-4 rounded-full font-medium text-base hover:bg-forest-mid transition-colors duration-300 w-fit"
              >
                <span className="writing-mode-vertical md:writing-mode-horizontal">
                  Composer mon kit →
                </span>
              </Link>
              <Link
                href="/#science"
                className="inline-flex items-center gap-2 text-sm text-ink-muted border border-sand-dark/60 px-7 py-3.5 rounded-full hover:border-forest/40 hover:text-forest transition-colors duration-200 w-fit"
              >
                Découvrir la science
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 w-full"
          >
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={1.7 + i * 0.1} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Vertical side label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-2 z-40"
        aria-hidden
      >
        <div className="w-px h-16 bg-sand-dark/40" />
        <span
          className="text-[10px] text-ink-muted tracking-[0.2em] uppercase"
          style={{ writingMode: "vertical-lr" }}
        >
          Défiler
        </span>
        <div className="w-px h-16 bg-sand-dark/40" />
      </motion.div>
    </section>
  );
}

function StatCard({
  stat,
  delay,
}: {
  stat: (typeof STATS)[number];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="bg-cream rounded-2xl p-4 md:p-5 flex flex-col justify-center min-w-0"
    >
      <div className="flex items-baseline gap-1 mb-1.5 flex-wrap">
        <span className="font-display font-black text-ink text-[clamp(2rem,4vw,3rem)] leading-none tracking-tight">
          {stat.value}
        </span>
        <span className="text-label text-ink-muted">{stat.unit}</span>
      </div>
      <span className="text-label text-ink-muted text-[10px] break-words hyphens-auto">
        {stat.label}
      </span>
    </motion.div>
  );
}
