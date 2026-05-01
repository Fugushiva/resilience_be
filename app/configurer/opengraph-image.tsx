/**
 * app/configurer/opengraph-image.tsx
 * Image Open Graph pour la page Configurateur.
 *
 * Visuel : 5 étapes du configurateur sous forme de cases numérotées.
 * Tone : outil, diagnostic, action immédiate.
 */

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Configurateur de kit d'urgence 72h — Survikit";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const STEPS = [
  { number: "01", label: "Foyer" },
  { number: "02", label: "Logement" },
  { number: "03", label: "Scénario" },
  { number: "04", label: "Santé" },
  { number: "05", label: "Autonomie" },
];

export default async function ConfigurerOgImage() {
  const fontData = await readFile(
    join(process.cwd(), "public/fonts/playfair-display-black.ttf")
  );

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
          backgroundColor: "#0E0E0C",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(30,74,42,0.4) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "Playfair",
              fontSize: 18,
              fontWeight: 900,
              color: "rgba(240,237,232,0.5)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Survikit / Configurer
          </span>
          <div
            style={{
              backgroundColor: "#1E4A2A",
              borderRadius: 999,
              padding: "6px 16px",
              display: "flex",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#F0EDE8",
                letterSpacing: "0.08em",
              }}
            >
              Gratuit · 2 min
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span
            style={{
              fontFamily: "Playfair",
              fontSize: 72,
              fontWeight: 900,
              color: "#F0EDE8",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            Diagnostic
          </span>
          <span
            style={{
              fontFamily: "Playfair",
              fontSize: 72,
              fontWeight: 900,
              fontStyle: "italic",
              color: "#4A9460",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            5 étapes.
          </span>
        </div>

        {/* Step cards */}
        <div style={{ display: "flex", gap: 12 }}>
          {STEPS.map((step) => (
            <div
              key={step.number}
              style={{
                flex: 1,
                backgroundColor: "rgba(240,237,232,0.06)",
                border: "1px solid rgba(240,237,232,0.1)",
                borderRadius: 16,
                padding: "20px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(240,237,232,0.3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {step.number}
              </span>
              <span
                style={{
                  fontFamily: "Playfair",
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#F0EDE8",
                }}
              >
                {step.label}
              </span>
            </div>
          ))}
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
