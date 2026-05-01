/**
 * app/guide/opengraph-image.tsx
 * Image Open Graph pour la landing du Guide PDF Premium.
 *
 * Visuel : fond sombre élégant, titre + prix mis en avant, sceau NCCN.
 * Objectif : déclencher un clic LinkedIn/X sur "Guide PDF — 12€"
 */

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { GUIDE_PDF } from "@/lib/seo/constants";

export const alt = `${GUIDE_PDF.name} — Télécharger le PDF`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function GuideOgImage() {
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
        {/* Double radial glow */}
        <div
          style={{
            position: "absolute",
            top: -150,
            right: -150,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(30,74,42,0.5) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: 200,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(30,74,42,0.25) 0%, transparent 70%)",
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
              color: "rgba(240,237,232,0.4)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Survikit / Guide Premium
          </span>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#1E4A2A",
                borderRadius: 999,
                padding: "6px 16px",
                display: "flex",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: "#F0EDE8", letterSpacing: "0.06em" }}>
                PDF · {GUIDE_PDF.chapterCount} chapitres
              </span>
            </div>
            <div
              style={{
                backgroundColor: "#F0EDE8",
                borderRadius: 999,
                padding: "6px 20px",
                display: "flex",
              }}
            >
              <span
                style={{
                  fontFamily: "Playfair",
                  fontSize: 15,
                  fontWeight: 900,
                  color: "#1A1A18",
                }}
              >
                {GUIDE_PDF.priceEur}€
              </span>
            </div>
          </div>
        </div>

        {/* Main headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span
            style={{
              fontFamily: "Playfair",
              fontSize: 22,
              fontWeight: 900,
              color: "#4A9460",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Guide de
          </span>
          <span
            style={{
              fontFamily: "Playfair",
              fontSize: 80,
              fontWeight: 900,
              color: "#F0EDE8",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
            }}
          >
            Résilience
          </span>
          <span
            style={{
              fontFamily: "Playfair",
              fontSize: 80,
              fontWeight: 900,
              fontStyle: "italic",
              color: "#4A9460",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
            }}
          >
            Familiale.
          </span>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {["Conformité NCCN", "BE-Alert", "Checklists imprimables", "Plan familial", "Contacts urgence BE"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  backgroundColor: "rgba(240,237,232,0.07)",
                  border: "1px solid rgba(240,237,232,0.12)",
                  borderRadius: 999,
                  padding: "6px 14px",
                }}
              >
                <span style={{ fontSize: 12, color: "rgba(240,237,232,0.6)", letterSpacing: "0.06em" }}>
                  {tag}
                </span>
              </div>
            )
          )}
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
