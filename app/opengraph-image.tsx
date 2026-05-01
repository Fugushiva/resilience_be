/**
 * app/opengraph-image.tsx
 * Image Open Graph par défaut — racine du site.
 * Générée dynamiquement via Next.js ImageResponse API.
 *
 * Dimensions : 1200×630 (standard LinkedIn / X / iMessage)
 * Style : éditorial "Awwwards" — fond paper off-white, typographie Playfair,
 *         accent forest vert, motif radial subtil.
 *
 * Accès : GET /opengraph-image
 */

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_NAME } from "@/lib/seo/constants";

export const alt = `${SITE_NAME} — Préparation 72h pour familles belges`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OgImage() {
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
          padding: "72px 80px",
          backgroundColor: "#F0EDE8",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow background */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 800,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(74,148,96,0.18) 0%, rgba(74,148,96,0.08) 40%, transparent 70%)",
            pointerEvents: "none",
            display: "flex",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo / Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#1E4A2A",
              }}
            />
            <span
              style={{
                fontFamily: "Playfair",
                fontSize: 20,
                fontWeight: 900,
                color: "#1A1A18",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Survikit
            </span>
          </div>

          {/* Country badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "rgba(30, 74, 42, 0.08)",
              border: "1px solid rgba(30, 74, 42, 0.2)",
              borderRadius: 999,
              padding: "6px 16px",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1E4A2A",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Belgique · NCCN
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            <span
              style={{
                fontFamily: "Playfair",
                fontSize: 88,
                fontWeight: 900,
                color: "#1A1A18",
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
              }}
            >
              Préparation
            </span>
            <span
              style={{
                fontFamily: "Playfair",
                fontSize: 88,
                fontWeight: 900,
                fontStyle: "italic",
                color: "#1E4A2A",
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
              }}
            >
              72h.
            </span>
          </div>

          <p
            style={{
              fontSize: 22,
              color: "#6B6866",
              margin: 0,
              maxWidth: 560,
              lineHeight: 1.4,
            }}
          >
            {"Le configurateur intelligent de kit d'urgence pour les familles belges. Fondé sur les recommandations officielles."}
          </p>
        </div>

        {/* Bottom stats row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          {[
            { value: "72h", label: "couverture" },
            { value: "5 étapes", label: "diagnostic" },
            { value: "Gratuit", label: "sans inscription" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span
                style={{
                  fontFamily: "Playfair",
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#1A1A18",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "#6B6866",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}

          {/* CTA hint */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
              backgroundColor: "#1E4A2A",
              borderRadius: 999,
              padding: "14px 28px",
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "#F0EDE8",
                letterSpacing: "0.04em",
              }}
            >
              Composer mon kit →
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
