/**
 * app/twitter-image.tsx
 * Image Twitter Card par défaut — racine du site.
 * Identique à opengraph-image mais avec un style légèrement condensé pour X.
 *
 * Dimensions : 1200×630 (summary_large_image format)
 *
 * Accès : GET /twitter-image
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

export default async function TwitterImage() {
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
          padding: "64px 72px",
          backgroundColor: "#F0EDE8",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -100,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(74,148,96,0.16) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: "#1E4A2A",
            }}
          />
          <span
            style={{
              fontFamily: "Playfair",
              fontSize: 18,
              fontWeight: 900,
              color: "#1A1A18",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {SITE_NAME}
          </span>
          <span
            style={{
              fontSize: 13,
              color: "#6B6866",
              marginLeft: 8,
              letterSpacing: "0.06em",
            }}
          >
            · survikit.be
          </span>
        </div>

        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              fontFamily: "Playfair",
              fontSize: 76,
              fontWeight: 900,
              color: "#1A1A18",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            Sans bruit.
          </span>
          <span
            style={{
              fontFamily: "Playfair",
              fontSize: 76,
              fontWeight: 900,
              fontStyle: "italic",
              color: "#1E4A2A",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            Sans manque.
          </span>
          <p
            style={{
              fontSize: 20,
              color: "#6B6866",
              margin: "16px 0 0",
              maxWidth: 520,
              lineHeight: 1.4,
            }}
          >
            Kit 72h pour familles belges — recommandations NCCN, gratuit.
          </p>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <span
            style={{
              fontSize: 14,
              color: "#6B6866",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Belgique · BE-Alert · Sécurité Civile
          </span>
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
