"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface Kit {
  id: string;
  number: string;
  name: string;
  articles: number;
  weight: string;
  duration: string;
  tag: string;
  dark?: boolean;
}

const KITS: Kit[] = [
  {
    id: "essentiels-alpine",
    number: "KIT 01",
    name: "Essentiels Alpine",
    articles: 23,
    weight: "4,2",
    duration: "72H",
    tag: "MONTAGNE",
    dark: true,
  },
  {
    id: "panne-urbaine",
    number: "KIT 02",
    name: "Panne Urbaine",
    articles: 18,
    weight: "3,1",
    duration: "72H",
    tag: "URBAIN",
  },
  {
    id: "foret-7-jours",
    number: "KIT 03",
    name: "Forêt 7 jours",
    articles: 41,
    weight: "7,8",
    duration: "7 JOURS",
    tag: "FORÊT",
  },
  {
    id: "kit-famille",
    number: "KIT 04",
    name: "Kit Famille",
    articles: 56,
    weight: "11,2",
    duration: "72H",
    tag: "FAMILLE",
  },
  {
    id: "evacuation-legere",
    number: "KIT 05",
    name: "Évacuation Légère",
    articles: 14,
    weight: "2,0",
    duration: "24H",
    tag: "LÉGER",
  },
];

export function KitsSection() {
  return (
    <section id="kits" className="bg-paper py-[var(--section-pad)] px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-ink-muted/40" />
            <span className="text-label text-ink-muted">NOS KITS</span>
          </div>
          <div className="grid md:grid-cols-2 items-end gap-8">
            <div>
              <h2 className="font-display font-black text-ink text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.92] tracking-tight">
                Zéro compromis.
                <br />
                <em className="italic text-forest">Chaque scénario.</em>
              </h2>
            </div>
            <p className="text-base text-ink/70 leading-relaxed max-w-xs md:ml-auto">
              Chaque kit est calibré pour un usage spécifique. Pas de surstock.
              Pas de manque.
            </p>
          </div>
        </ScrollReveal>

        {/* Kit cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {KITS.map((kit, i) => (
            <KitCard key={kit.id} kit={kit} index={i} />
          ))}
        </div>

        {/* Custom configurator CTA */}
        <ScrollReveal delay={0.3} className="mt-10 text-center">
          <p className="text-ink/60 text-sm mb-4">
            Aucun kit ne correspond exactement à votre situation ?
          </p>
          <Link
            href="/configurer"
            className="inline-flex items-center gap-3 border border-forest/40 text-forest px-7 py-3.5 rounded-full text-sm font-medium hover:bg-forest hover:text-paper transition-all duration-300"
          >
            Configurer mon kit sur mesure →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

function KitCard({ kit, index }: { kit: Kit; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/configurer?kit=${kit.id}`}
        className={`group flex flex-col justify-between rounded-2xl p-5 md:p-6 min-h-[200px] md:min-h-[240px] transition-transform duration-300 hover:scale-[1.02] ${
          kit.dark
            ? "bg-night text-paper"
            : "bg-white border border-sand/60 hover:border-forest/30"
        }`}
      >
        {/* Kit number */}
        <span
          className={`text-label ${
            kit.dark ? "text-paper/40" : "text-ink-muted"
          }`}
        >
          {kit.number}
        </span>

        {/* Kit name */}
        <div className="mt-4 mb-6">
          <h3
            className={`font-display font-bold text-xl md:text-2xl leading-tight ${
              kit.dark ? "text-paper" : "text-ink"
            }`}
          >
            {kit.name}
          </h3>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-end justify-between gap-y-4 gap-x-2 mt-auto">
          <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
            <div className="flex items-baseline">
              <span
                className={`font-display font-black text-2xl md:text-3xl ${
                  kit.dark ? "text-paper" : "text-ink"
                }`}
              >
                {kit.articles}
              </span>
              <span
                className={`text-[10px] md:text-xs font-bold tracking-widest ml-1 ${
                  kit.dark ? "text-paper/40" : "text-ink-muted"
                }`}
              >
                ART.
              </span>
            </div>
            <div className="flex items-baseline">
              <span
                className={`font-display font-black text-2xl md:text-3xl ${
                  kit.dark ? "text-paper" : "text-ink"
                }`}
              >
                {kit.weight}
              </span>
              <span
                className={`text-[10px] md:text-xs font-bold tracking-widest ml-1 ${
                  kit.dark ? "text-paper/40" : "text-ink-muted"
                }`}
              >
                KG
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-row sm:flex-col xl:flex-row 2xl:flex-col items-end gap-1.5 ml-auto">
            <span
              className={`text-[10px] font-medium tracking-[0.12em] uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${
                kit.dark
                  ? "bg-paper/10 text-paper/60"
                  : "bg-sand text-ink-muted"
              }`}
            >
              {kit.duration}
            </span>
            <span
              className={`text-[10px] font-medium tracking-[0.12em] uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${
                kit.dark
                  ? "bg-forest/30 text-paper"
                  : "bg-forest/10 text-forest"
              }`}
            >
              {kit.tag}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
