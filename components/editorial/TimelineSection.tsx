"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface TimelineEvent {
  hour: string;
  title: string;
  body: string;
  dark?: boolean;
}

const TIMELINE: TimelineEvent[] = [
  {
    hour: "Heure 1",
    title: "L'incident survient.",
    body: "Coupure de courant. Communications coupées. Vous avez votre kit ou vous ne l'avez pas.",
  },
  {
    hour: "Heure 6",
    title: "Abri sécurisé.",
    body: "Votre kit contient les outils pour transformer n'importe quel espace en refuge sûr pour 72 heures.",
  },
  {
    hour: "Heure 24",
    title: "Eau. Chaleur. Signal.",
    body: "Les trois besoins critiques. Chaque article Survikit répond à au moins l'un des deux.",
  },
  {
    hour: "Heure 72",
    title: "Vous avez survécu.",
    body: "Structuré. Préparé. Sans compromis. C'est la promesse Survikit.",
    dark: true,
  },
];

export function TimelineSection() {
  return (
    <section
      id="histoire"
      className="bg-paper py-[var(--section-pad)] px-6 md:px-12"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-ink-muted/40" />
            <span className="text-label text-ink-muted">
              L'HISTOIRE DES 72 HEURES
            </span>
          </div>
          <h2 className="font-display font-black text-ink text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.92] tracking-tight">
            Heure par heure.
            <br />
            <em className="italic text-forest">Article par article.</em>
          </h2>
        </ScrollReveal>

        {/* Timeline cards horizontal scroll on mobile, grid on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIMELINE.map((event, i) => (
            <TimelineCard key={event.hour} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineCard({
  event,
  index,
}: {
  event: TimelineEvent;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`rounded-2xl p-6 md:p-7 flex flex-col gap-4 min-h-[180px] min-w-0 ${
        event.dark
          ? "bg-night text-paper"
          : "bg-white border border-sand/60"
      }`}
    >
      <span
        className={`text-label break-words hyphens-auto ${
          event.dark ? "text-forest-light" : "text-signal"
        }`}
      >
        {event.hour}
      </span>

      <h3
        className={`font-display font-bold text-xl md:text-2xl leading-tight break-words hyphens-auto ${
          event.dark ? "text-paper" : "text-ink"
        }`}
      >
        {event.title}
      </h3>

      <p
        className={`text-sm leading-relaxed break-words hyphens-auto ${
          event.dark ? "text-paper/70" : "text-ink/65"
        }`}
      >
        {event.body}
      </p>
    </motion.div>
  );
}
