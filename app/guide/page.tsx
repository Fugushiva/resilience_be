/**
 * app/guide/page.tsx
 * Landing page du Guide de Résilience Familiale 72h (PDF Premium).
 *
 * Objectif SEO : capter les requêtes "guide résilience famille Belgique pdf"
 * et convertir en achat Gumroad.
 *
 * Contenu basé sur les chapitres I–VIII du guide PDF.
 * JSON-LD Product + Breadcrumb injektés pour Rich Snippets.
 */

import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildProductSchema,
  buildBreadcrumbSchema,
  buildWebPageSchema,
} from "@/lib/seo/structured-data";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { GUIDE_PDF } from "@/lib/seo/constants";
import { KEYWORDS_GUIDE } from "@/lib/seo/keywords";
import { ArrowRight, BookOpen, CheckCircle, Shield, Download } from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  path: "/guide",
  title: "Guide de Résilience Familiale 72h — Belgique",
  description:
    "Le guide complet de préparation aux urgences pour familles belges. 8 chapitres, conformité NCCN/BE-Alert, checklists imprimables, plan familial. Téléchargement PDF — 12€.",
  keywords: KEYWORDS_GUIDE,
  ogType: "website",
});

// ─── Chapitres du guide ───────────────────────────────────────────────────────

const CHAPTERS = [
  {
    number: "I",
    title: "Comprendre les risques belges",
    description:
      "Cartographie des risques officiels reconnus par le Centre de Crise National : pannes électriques prolongées, inondations, incidents industriels (SEVESO), événements météorologiques extrêmes. Comprendre pour anticiper sereinement.",
    tags: ["NCCN", "BE-Alert", "Risques"],
  },
  {
    number: "II",
    title: "L'eau — pilier de survie",
    description:
      "Calcul précis des besoins hydriques (3L/personne/jour minimum NCCN). Stockage, purification, alternatives en cas de coupure. Quelles bouteilles, quels filtres, comment tester la qualité de l'eau en urgence.",
    tags: ["72h", "Stockage", "Purification"],
  },
  {
    number: "III",
    title: "Alimentation d'urgence",
    description:
      "Constitution d'un garde-manger d'urgence équilibré et rotatif. Aliments à longue conservation, barres énergétiques, besoins spécifiques enfants et seniors. Budget estimé et liste d'achats optimisée.",
    tags: ["Nutrition", "Conservation", "Famille"],
  },
  {
    number: "IV",
    title: "Communication & information",
    description:
      "Rester informé sans électricité ni réseau : radio à piles BE-Alert, fréquences officielles régionales, plan de contact familial. Comment rejoindre la famille si les téléphones ne fonctionnent plus.",
    tags: ["BE-Alert", "Radio", "Plan familial"],
  },
  {
    number: "V",
    title: "Santé & premiers secours",
    description:
      "Trousse de premiers secours complète selon les recommandations SPF Santé. Médicaments sans ordonnance essentiels, gestes de premiers secours, spécificités nourrissons et personnes âgées.",
    tags: ["Premiers secours", "Santé", "SPF"],
  },
  {
    number: "VI",
    title: "Abri, chaleur & lumière",
    description:
      "Maintenir une température vitale sans chauffage (scénario panne hiver). Couvertures de survie, bougies sécurisées, lampes frontales, groupes électrogènes — ce qui vaut vraiment l'investissement.",
    tags: ["Chauffage", "Lumière", "Confort"],
  },
  {
    number: "VII",
    title: "Documents & finances d'urgence",
    description:
      "Quels documents photocopier et où les stocker. Argent liquide (combien, en quelles coupures). Copies numériques chiffrées. Contacts assureurs et administrations belges clés.",
    tags: ["Documents", "Finances", "Administration"],
  },
  {
    number: "VIII",
    title: "Plan d'action familial",
    description:
      "Créer un plan sur mesure pour votre foyer : point de rassemblement, rôles de chaque membre, scénarios d'évacuation depuis votre commune, trousse de 72h prête à emporter. Template imprimable inclus.",
    tags: ["Plan familial", "Évacuation", "Template"],
  },
];

// ─── Avantages clés ───────────────────────────────────────────────────────────

const BENEFITS = [
  "Conformité totale aux recommandations NCCN belge",
  "Adapté aux contextes urbains, périurbains et ruraux",
  "Checklists imprimables — plastifiables",
  "Contacts d'urgence officiels belges (112, 1722, BE-Alert…)",
  "Plan familial personnalisable (template inclus)",
  "Mis à jour suite aux annonces gouvernementales d'avril 2026",
  "Aucun sensationnalisme — approche calme et méthodique",
  "Téléchargement instantané après paiement",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GuidePage() {
  return (
    <>
      {/* JSON-LD : Product + Breadcrumb + WebPage */}
      <JsonLd
        data={[
          buildProductSchema(),
          buildBreadcrumbSchema([
            { name: "Accueil", url: "/" },
            { name: "Guide Premium", url: "/guide" },
          ]),
          buildWebPageSchema({
            path: "/guide",
            name: "Guide de Résilience Familiale 72h — Belgique",
            description:
              "Le guide complet de préparation aux urgences pour familles belges. 8 chapitres, conformité NCCN/BE-Alert, checklists imprimables, plan familial. PDF — 12€.",
          }),
        ]}
        id="jsonld-guide"
      />

      <div className="min-h-screen bg-paper text-ink">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="pt-32 pb-20 px-6 md:px-12 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-ink-muted font-mono mb-12" aria-label="Fil d'Ariane">
            <Link href="/" className="hover:text-forest transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-ink">Guide Premium</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left : Texte */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-forest" />
                <span className="font-mono text-xs tracking-widest uppercase text-ink-muted">
                  PDF Premium · {GUIDE_PDF.chapterCount} Chapitres
                </span>
              </div>

              <h1 className="font-display text-[clamp(2.2rem,5.5vw,4rem)] font-black leading-[0.9] tracking-tight mb-6">
                Guide de{" "}
                <em className="italic text-forest">Résilience Familiale</em>
                <br />
                72h — Belgique
              </h1>

              <p className="font-sans text-base md:text-lg text-ink/70 leading-relaxed mb-10 max-w-md">
                Le manuel de préparation aux urgences conçu pour les familles belges. Méthodique,
                officiel, serein — pas de survivalism extrême, juste la sécurité de savoir que
                votre foyer est prêt.
              </p>

              {/* CTA principal */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={GUIDE_PDF.gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-forest hover:bg-forest-mid text-paper px-8 py-4 rounded-full font-sans font-semibold text-base transition-colors duration-200"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Télécharger — {GUIDE_PDF.priceEur}€
                </a>

                <Link
                  href="/configurer"
                  className="inline-flex items-center justify-center gap-2 border border-sand-dark/60 text-ink-muted px-8 py-4 rounded-full font-sans text-sm hover:border-forest/40 hover:text-forest transition-colors duration-200"
                >
                  Configurer mon kit gratuit →
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-4 mt-8">
                {[
                  "Conformité NCCN",
                  "BE-Alert",
                  "SPF Intérieur",
                  "Téléchargement instantané",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-widest uppercase text-forest bg-forest/8 border border-forest/20 px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right : Preview card */}
            <div className="relative">
              <div className="bg-night rounded-3xl p-8 md:p-10">
                <div className="flex items-start justify-between mb-8">
                  <BookOpen className="w-8 h-8 text-forest-light" aria-hidden="true" />
                  <div className="text-right">
                    <p className="font-display font-black text-paper text-3xl">
                      {GUIDE_PDF.priceEur}€
                    </p>
                    <p className="font-mono text-xs text-paper/40 uppercase tracking-wider mt-1">
                      Accès immédiat
                    </p>
                  </div>
                </div>

                <h2 className="font-display text-2xl font-bold text-paper mb-2">
                  Guide de Résilience Familiale
                </h2>
                <p className="font-mono text-xs text-paper/40 uppercase tracking-wider mb-8">
                  72h Belgique · {GUIDE_PDF.chapterCount} chapitres · PDF
                </p>

                <ul className="space-y-3">
                  {BENEFITS.slice(0, 5).map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle
                        className="w-4 h-4 text-forest-light shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="font-sans text-sm text-paper/70">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={GUIDE_PDF.gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 w-full flex items-center justify-center gap-2 bg-forest hover:bg-forest-mid text-paper rounded-full py-3.5 font-sans font-semibold text-sm transition-colors duration-200"
                >
                  Obtenir le guide
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tous les bénéfices ──────────────────────────────────────────── */}
        <section className="bg-cream py-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-black text-ink mb-12">
              Ce que contient le guide
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 bg-paper rounded-2xl p-5 border border-sand/40"
                >
                  <Shield
                    className="w-4 h-4 text-forest shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="font-sans text-sm text-ink leading-relaxed">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Chapitres I–VIII ────────────────────────────────────────────── */}
        <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-ink-muted/40" />
            <span className="font-mono text-xs tracking-widest uppercase text-ink-muted">
              Sommaire
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-black text-ink mb-16">
            {GUIDE_PDF.chapterCount} chapitres pour une{" "}
            <em className="italic text-forest">famille sécurisée</em>
          </h2>

          <div className="space-y-px">
            {CHAPTERS.map((chapter) => (
              <div
                key={chapter.number}
                className="group flex flex-col md:flex-row gap-4 md:gap-10 items-start py-8 border-t border-sand/40 first:border-t-0"
              >
                {/* Chapter number */}
                <div className="shrink-0 w-16">
                  <span className="font-display font-black text-2xl text-ink-muted/40 group-hover:text-forest transition-colors duration-300">
                    {chapter.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl text-ink mb-3">
                    {chapter.title}
                  </h3>
                  <p className="font-sans text-base text-ink/65 leading-relaxed mb-4">
                    {chapter.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {chapter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full bg-sand/60 text-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA finale ─────────────────────────────────────────────────── */}
        <section className="bg-night py-20 px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-mono text-xs tracking-widest uppercase text-paper/40 mb-6">
              Disponible maintenant
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-paper mb-6 leading-tight">
              Prêt à sécuriser{" "}
              <em className="italic text-forest-light">votre famille ?</em>
            </h2>
            <p className="font-sans text-paper/60 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Téléchargement instantané. Lecture hors ligne. Format imprimable.
              Un investissement unique pour une sérénité durable.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={GUIDE_PDF.gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-forest hover:bg-forest-mid text-paper px-10 py-5 rounded-full font-sans font-semibold text-lg transition-colors duration-200"
              >
                <Download className="w-5 h-5" aria-hidden="true" />
                Télécharger le guide — {GUIDE_PDF.priceEur}€
              </a>
            </div>

            <p className="font-mono text-xs text-paper/30 mt-8">
              Paiement sécurisé via Gumroad · PDF livré instantanément · Aucun abonnement
            </p>
          </div>
        </section>

        {/* ── Lien vers le configurateur gratuit ──────────────────────────── */}
        <section className="py-16 px-6 md:px-12 max-w-5xl mx-auto">
          <div className="bg-cream rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-ink mb-2">
                Pas encore prêt à acheter ?
              </h3>
              <p className="font-sans text-ink/60 max-w-sm">
                Commencez par le diagnostic gratuit. Créez votre liste personnalisée en 2 minutes,
                sans inscription.
              </p>
            </div>
            <Link
              href="/configurer"
              className="shrink-0 inline-flex items-center gap-2 border border-forest/40 text-forest px-8 py-4 rounded-full font-sans font-medium hover:bg-forest hover:text-paper transition-all duration-200"
            >
              Configurer mon kit gratuit →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
