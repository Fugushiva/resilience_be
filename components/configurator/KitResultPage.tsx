"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useConfiguratorStore } from "@/lib/kit/store";
import { CATEGORY_LABELS } from "@/lib/kit/catalog";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function KitResultPage() {
  const { result, reset } = useConfiguratorStore();
  const router = useRouter();

  useEffect(() => {
    if (!result) {
      router.replace("/configurer");
    }
  }, [result, router]);

  if (!result) return null;

  const { categories, totalEur, totalWeightKg, essentialCount, coverageHours } =
    result;

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <div className="pt-24 pb-12 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-forest" />
            <span className="text-label text-ink-muted">VOTRE KIT PERSONNALISÉ</span>
          </div>

          <h1 className="font-display font-black text-ink text-[clamp(2rem,5vw,3.5rem)] leading-tight tracking-tight mb-8">
            Kit <em className="italic text-forest">généré.</em>
          </h1>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-12">
            {[
              {
                value: String(essentialCount),
                unit: "ART.",
                label: "Articles essentiels",
              },
              {
                value: totalWeightKg.toFixed(1).replace(".", ","),
                unit: "KG",
                label: "Poids total",
              },
              {
                value: `${coverageHours}`,
                unit: "H",
                label: "Heures couvertes",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-cream rounded-xl p-4 md:p-5 min-w-0 flex flex-col justify-center"
              >
                <div className="flex items-baseline gap-1 mb-1 flex-wrap">
                  <span className="font-display font-black text-ink text-2xl md:text-3xl leading-none">
                    {stat.value}
                  </span>
                  <span className="text-label text-ink-muted text-[10px]">
                    {stat.unit}
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted break-words hyphens-auto">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Budget estimate */}
          <div className="bg-night text-paper rounded-2xl px-6 py-5 mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-label text-paper/40 mb-1 break-words hyphens-auto">Budget estimé</p>
              <p className="font-display font-black text-2xl">
                ~{Math.round(totalEur)}€
              </p>
            </div>
            <p className="text-xs text-paper/50 max-w-[180px] text-right sm:text-left leading-relaxed">
              Prix indicatifs Amazon BE / Decathlon. Mis à jour régulièrement.
            </p>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="space-y-10">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1 + ci * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-5 h-px bg-ink-muted/30" />
                <h2 className="text-label text-ink-muted">
                  {CATEGORY_LABELS[cat.id as keyof typeof CATEGORY_LABELS] ??
                    cat.label}
                </h2>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {cat.items.map((item) => (
                  <KitItemRow key={item.sku} item={item} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 pt-8 border-t border-sand/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div>
            <p className="text-sm text-ink-muted mb-1">
              Envie d'un kit encore plus complet ?
            </p>
            <p className="text-sm font-medium text-ink">
              Guide PDF Premium — checklist imprimable, contacts belges, plan familial
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button className="px-7 py-3.5 bg-forest text-paper rounded-full text-sm font-medium hover:bg-forest-mid transition-colors duration-200">
              Guide Premium — 12€ →
            </button>
            <button
              onClick={() => {
                reset();
                window.location.href = "/configurer";
              }}
              className="px-7 py-3.5 border border-sand-dark/60 text-ink-muted rounded-full text-sm hover:border-forest/40 hover:text-forest transition-colors duration-200"
            >
              Recommencer
            </button>
          </div>
        </motion.div>

        {/* Affiliate disclosure */}
        <p className="mt-8 text-xs text-ink-muted/60 leading-relaxed">
          * Survikit participe aux programmes d'affiliation Amazon EU et
          Decathlon Affiliés (Awin). Les liens marqués peuvent générer une
          commission, sans coût supplémentaire pour vous. Conformément à la
          réglementation belge SPF Économie.
        </p>
      </div>
    </div>
  );
}

function KitItemRow({
  item,
}: {
  item: {
    sku: string;
    name: string;
    qty: number;
    priceEur: number;
    essential: boolean;
    amazonUrl?: string;
    decathlonUrl?: string;
  };
}) {
  const affiliateUrl = item.amazonUrl || item.decathlonUrl;
  const partner = item.amazonUrl ? "Amazon" : item.decathlonUrl ? "Decathlon" : null;

  return (
    <div
      className={`flex items-center justify-between rounded-xl px-4 py-3 gap-4 ${
        item.essential ? "bg-white border border-sand/40" : "bg-cream/60"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {item.essential && (
          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-forest" />
        )}
        <span className="text-sm text-ink truncate">{item.name}</span>
        {item.qty > 1 && (
          <span className="shrink-0 text-xs text-ink-muted font-mono">
            ×{item.qty}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {item.priceEur > 0 && (
          <span className="text-xs text-ink-muted font-mono">
            ~{(item.priceEur * item.qty).toFixed(0)}€
          </span>
        )}
        {affiliateUrl && partner && (
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="text-xs font-medium text-forest border border-forest/30 px-3 py-1 rounded-full hover:bg-forest hover:text-paper transition-colors duration-200"
          >
            {partner} →
          </a>
        )}
      </div>
    </div>
  );
}
