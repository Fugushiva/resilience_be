/**
 * app/kit/opengraph-image.tsx
 * Image Open Graph dynamique pour la page de résultat kit.
 *
 * Lit les searchParams score, persons, hours pour générer un visuel personnalisé.
 * Si partagé via URL ?score=85&persons=4&hours=72, l'image reflète les données.
 *
 * dynamic = "force-dynamic" : nécessaire car les OG images avec searchParams
 * ne peuvent pas être pré-rendues statiquement — elles sont différentes par URL.
 *
 * Accès : GET /kit/opengraph-image?score=85&persons=4&hours=72
 */

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Force le rendu dynamique pour accéder aux searchParams
export const dynamic = "force-dynamic";

export const alt = "Votre kit d'urgence personnalisé — Survikit";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function KitOgImage(props: {
  searchParams?: Promise<{ score?: string; persons?: string; hours?: string }> | { score?: string; persons?: string; hours?: string };
}) {
  // Compatibilité Next.js 16 : searchParams peut être une Promise ou un objet direct
  const rawParams = props.searchParams;
  const searchParams = rawParams instanceof Promise ? await rawParams : (rawParams ?? {});

  const score = searchParams?.score ?? null;
  const persons = searchParams?.persons ?? null;
  const hours = searchParams?.hours ?? "72";

  const fontData = await readFile(
    join(process.cwd(), "public/fonts/playfair-display-black.ttf")
  );

  const hasDynamicData = score !== null || persons !== null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          backgroundColor: "#F0EDE8",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Forest radial glow */}
        <div
          style={{
            position: "absolute",
            bottom: -200,
            right: -200,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(30,74,42,0.14) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "Playfair",
              fontSize: 18,
              fontWeight: 900,
              color: "#6B6866",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Survikit / Résultat
          </span>
          <div
            style={{
              display: "flex",
              backgroundColor: "rgba(30,74,42,0.1)",
              border: "1px solid rgba(30,74,42,0.2)",
              borderRadius: 999,
              padding: "6px 16px",
            }}
          >
            <span style={{ fontSize: 13, color: "#1E4A2A", fontWeight: 600, letterSpacing: "0.06em" }}>
              Recommandations NCCN
            </span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {hasDynamicData && score ? (
            <>
              <span
                style={{
                  fontFamily: "Playfair",
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#6B6866",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Votre kit
              </span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "Playfair",
                    fontSize: 120,
                    fontWeight: 900,
                    color: "#1E4A2A",
                    lineHeight: 0.85,
                  }}
                >
                  {score}%
                </span>
              </div>
              <span
                style={{
                  fontFamily: "Playfair",
                  fontSize: 40,
                  fontWeight: 900,
                  fontStyle: "italic",
                  color: "#1A1A18",
                  lineHeight: 1,
                }}
              >
                prêt pour {hours}h d&apos;autonomie
              </span>
            </>
          ) : (
            <>
              <span
                style={{
                  fontFamily: "Playfair",
                  fontSize: 80,
                  fontWeight: 900,
                  color: "#1A1A18",
                  lineHeight: 0.92,
                  letterSpacing: "-0.02em",
                }}
              >
                Kit généré.
              </span>
              <span
                style={{
                  fontFamily: "Playfair",
                  fontSize: 80,
                  fontWeight: 900,
                  fontStyle: "italic",
                  color: "#1E4A2A",
                  lineHeight: 0.92,
                  letterSpacing: "-0.02em",
                }}
              >
                Prêt à commander.
              </span>
            </>
          )}
        </div>

        {/* Bottom info */}
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          {persons && (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span
                style={{
                  fontFamily: "Playfair",
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#1A1A18",
                }}
              >
                {persons}
              </span>
              <span style={{ fontSize: 13, color: "#6B6866", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {Number(persons) > 1 ? "personnes" : "personne"}
              </span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              style={{
                fontFamily: "Playfair",
                fontSize: 32,
                fontWeight: 900,
                color: "#1A1A18",
              }}
            >
              {hours}H
            </span>
            <span style={{ fontSize: 13, color: "#6B6866", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              couverture
            </span>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              backgroundColor: "#1E4A2A",
              borderRadius: 999,
              padding: "14px 28px",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: "#F0EDE8" }}>
              Guide Premium — 14,99€ →
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair",
          data: fontData,
          style: "normal",
          weight: 900,
        },
      ],
    }
  );
}
