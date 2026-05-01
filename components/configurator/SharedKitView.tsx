"use client";

import { motion } from "framer-motion";
import type { KitResult } from "@/lib/kit/types";
import { CATEGORY_LABELS } from "@/lib/kit/catalog";
import Link from "next/link";

interface SharedKitViewProps {
  kitResult: KitResult;
  shareId: string;
}

/**
 * Read-only view of a shared kit.
 * Rendered on /kit/[shareId] for publicly shared kits.
 */
export function SharedKitView({ kitResult, shareId }: SharedKitViewProps) {
  const {
    categories,
    totalEur,
    totalWeightKg,
    essentialCount,
    coverageHours,
    profile,
  } = kitResult;

  const persons = profile.adults + profile.children + profile.teens;

  return (
    <div className="min-h-screen bg-paper">
      <div className="pt-24 pb-12 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Shared badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-forest" />
            <span className="text-label text-ink-muted">
              KIT PARTAGÉ — {persons} PERSONNE{persons > 1 ? "S" : ""}
            </span>
          </div>

          <h1 className="font-display font-black text-ink text-[clamp(2rem,5vw,3.5rem)] leading-tight tracking-tight mb-8">
            Kit de <em className="italic text-forest">survie 72h</em>
          </h1>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-12">
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
              {
                value: `~${Math.round(totalEur)}`,
                unit: "€",
                label: "Budget estimé",
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
                <p className="text-[11px] text-ink-muted break-words hyphens-auto">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

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
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-5 h-px bg-ink-muted/30" />
                  <h2 className="text-label text-ink-muted">
                    {CATEGORY_LABELS[
                      cat.id as keyof typeof CATEGORY_LABELS
                    ] ?? cat.label}
                  </h2>
                </div>

                <div className="space-y-2">
                  {cat.items.map((item) => (
                    <div
                      key={item.sku}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 gap-4 ${
                        item.essential
                          ? "bg-white border border-sand/40"
                          : "bg-cream/60"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.essential && (
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-forest" />
                        )}
                        <span className="text-sm text-ink truncate">
                          {item.name}
                        </span>
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
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16 pt-8 border-t border-sand/40 text-center"
          >
            <p className="text-sm text-ink-muted mb-4">
              Envie de créer votre propre kit personnalisé ?
            </p>
            <Link
              href="/configurer"
              className="inline-block px-7 py-3.5 bg-forest text-paper rounded-full text-sm font-medium hover:bg-forest-mid transition-colors duration-200"
            >
              Configurer mon kit →
            </Link>
            <p className="mt-6 text-xs text-ink-muted/50">
              ID de partage : {shareId}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
