/**
 * app/emergency-news/page.tsx — Actualités d'urgence Belgique
 *
 * ISR : revalidation toutes les 60 secondes.
 *
 * JSON-LD injectés :
 *  - ItemList de NewsArticle (boost SGE / AI Overviews)
 *  - BreadcrumbList
 *
 * Métadonnées dynamiques : titre avec date de mise à jour.
 */

import { fetchEmergencyNews, type EmergencyNewsItem } from "@/lib/api/emergency";
import { AlertTriangle, Info, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildNewsItemListSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { KEYWORDS_NEWS } from "@/lib/seo/keywords";

// ISR — revalidation toutes les 60 secondes pour la fraîcheur des news
export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  path: "/emergency-news",
  title: "Actualités d'urgence Belgique — Centre de Crise National",
  description:
    "Suivi en temps réel des recommandations du Centre de Crise National belge et de l'état des urgences. Alertes BE-Alert, risques en cours, conseils de protection civile.",
  keywords: KEYWORDS_NEWS,
  ogType: "website",
});

// ─── Sous-composants ──────────────────────────────────────────────────────────

function SeverityIcon({ severity }: { severity: EmergencyNewsItem["severity"] }) {
  switch (severity) {
    case "critical":
      return <ShieldAlert className="w-6 h-6 text-signal" aria-hidden="true" />;
    case "warning":
      return <AlertTriangle className="w-6 h-6 text-amber-500" aria-hidden="true" />;
    case "info":
      return <Info className="w-6 h-6 text-forest-light" aria-hidden="true" />;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EmergencyNewsPage() {
  const data = await fetchEmergencyNews();

  // Construire les données pour JSON-LD NewsArticle
  const articlesForSchema = data.news.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    date: item.date,
    url: item.url,
    source: item.source,
  }));

  return (
    <>
      {/* JSON-LD : ItemList de NewsArticle + BreadcrumbList */}
      <JsonLd
        data={[
          buildNewsItemListSchema(articlesForSchema),
          buildBreadcrumbSchema([
            { name: "Accueil", url: "/" },
            { name: "Info Urgences Belgique", url: "/emergency-news" },
          ]),
        ]}
        id="jsonld-emergency-news"
      />

      <div className="min-h-screen bg-paper text-ink pb-24">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6 md:px-12 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 text-xs text-ink-muted font-mono mb-10"
            aria-label="Fil d'Ariane"
          >
            <Link href="/" className="hover:text-forest transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-ink">Info Urgences</span>
          </nav>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-signal animate-pulse" />
            <span className="font-mono text-sm tracking-wider uppercase text-ink-muted">
              En direct
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Info <span className="italic font-light">Urgences</span> Belgique
          </h1>
          <p className="font-sans text-lg md:text-xl text-ink-muted max-w-2xl leading-relaxed">
            Suivi des recommandations du Centre de Crise National et de l&apos;état des urgences
            sur le territoire belge.
          </p>
          <p className="font-mono text-xs text-ink-muted mt-8">
            Dernière mise à jour :{" "}
            {new Date(data.lastUpdated).toLocaleString("fr-BE")}
          </p>
        </section>

        {/* News Feed */}
        <section className="px-6 md:px-12 max-w-5xl mx-auto">
          <div className="flex flex-col gap-6">
            {data.news.map((item) => {
              const isCritical = item.severity === "critical";

              return (
                <article
                  key={item.id}
                  className={`relative p-6 md:p-8 rounded-xl border flex flex-col md:flex-row gap-6 items-start transition-all duration-300
                    ${
                      isCritical
                        ? "bg-cream border-signal/30 shadow-sm"
                        : "bg-cream/50 border-sand hover:bg-cream"
                    }
                  `}
                >
                  <div className="flex-shrink-0 mt-1">
                    <SeverityIcon severity={item.severity} />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className={`font-mono text-xs font-medium px-2 py-1 rounded-sm uppercase tracking-wider
                          ${
                            isCritical
                              ? "bg-signal/10 text-signal"
                              : item.severity === "warning"
                              ? "bg-amber-500/10 text-amber-700"
                              : "bg-forest/10 text-forest"
                          }
                        `}
                      >
                        {item.severity === "critical"
                          ? "Critique"
                          : item.severity === "warning"
                          ? "Alerte"
                          : "Info"}
                      </span>
                      <span className="font-mono text-xs text-ink-muted">
                        {new Date(item.date).toLocaleTimeString("fr-BE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" - "}
                        {new Date(item.date).toLocaleDateString("fr-BE")}
                      </span>
                      <span className="font-mono text-xs font-semibold text-ink px-2 py-0.5 bg-sand-dark/20 rounded-full">
                        Source: {item.source}
                      </span>
                    </div>

                    <h2 className="font-display text-2xl font-bold mb-3">{item.title}</h2>
                    <p className="font-sans text-ink-muted leading-relaxed mb-6">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 font-mono text-sm font-semibold text-forest hover:text-forest-mid transition-colors"
                        >
                          Lire la source officielle
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {data.news.length === 0 && (
            <div className="p-12 text-center border border-sand border-dashed rounded-xl">
              <p className="font-sans text-ink-muted">
                Aucune alerte en cours pour le moment.
              </p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="px-6 md:px-12 max-w-5xl mx-auto mt-20">
          <div className="bg-night text-paper p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-3xl font-bold mb-3">
                Ne soyez pas pris au dépourvu
              </h3>
              <p className="font-sans text-paper/70 max-w-md">
                Configurez votre kit de survie 72h personnalisé en fonction de votre foyer
                et des recommandations nationales.
              </p>
            </div>
            <Link
              href="/configurer"
              className="flex-shrink-0 inline-flex items-center justify-center px-8 py-4 bg-forest hover:bg-forest-mid text-paper font-sans font-semibold rounded-lg transition-colors"
            >
              Composer mon kit →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
