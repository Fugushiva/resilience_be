/**
 * scripts/generate-og-assets.mjs
 * Génère les assets statiques OG manquants :
 *  - public/og/logo-survikit.png  (512×512 — Organization schema + Knowledge Panel)
 *  - public/og/guide-pdf-cover.jpg (1200×630 — Product schema image)
 *
 * Usage : node scripts/generate-og-assets.mjs
 * Dépendance : sharp (déjà installé dans devDependencies)
 */

import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OG_DIR = join(ROOT, "public", "og");

await mkdir(OG_DIR, { recursive: true });

// ─── 1. Logo 512×512 ──────────────────────────────────────────────────────────
// Étoile Survikit blanche sur fond forest #1E4A2A, coins arrondis
// Reprend exactement le SVG de la Navbar

const logoSvg = Buffer.from(`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#1E4A2A" rx="80"/>
  <path
    d="M256 80 L310 192 L432 210 L344 296 L366 418 L256 356 L146 418 L168 296 L80 210 L202 192 Z"
    fill="#F0EDE8"
    stroke="#F0EDE8"
    stroke-width="6"
    stroke-linejoin="round"
  />
</svg>
`);

await sharp(logoSvg)
  .png({ compressionLevel: 9 })
  .toFile(join(OG_DIR, "logo-survikit.png"));

console.log("✓ logo-survikit.png (512×512)");

// ─── 2. Guide PDF Cover — OG format 1200×630 ─────────────────────────────────
// Reprend l'esthétique de la première page du PDF :
// fond forest #1E4A2A, titre en serif blanc italique, tagline monospace

const coverSvg = Buffer.from(`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="30%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#2A6040" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#1E4A2A" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Fond forest -->
  <rect width="1200" height="630" fill="#1E4A2A"/>
  <!-- Radial glow subtil -->
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Encadré header — style PDF -->
  <rect x="64" y="48" width="420" height="36" fill="none" stroke="#F0EDE8" stroke-opacity="0.3" stroke-width="1" rx="2"/>
  <text x="80" y="72" font-family="monospace" font-size="13" fill="#F0EDE8" fill-opacity="0.55" letter-spacing="2">
    SURVIKIT · ÉDITION 2026 · NCCN / CE
  </text>

  <!-- Titre principal -->
  <text x="64" y="240" font-family="Georgia, serif" font-size="96" font-style="italic" fill="#F0EDE8" font-weight="700">
    Guide de
  </text>
  <text x="64" y="340" font-family="Georgia, serif" font-size="96" font-style="italic" fill="#F0EDE8" font-weight="700">
    Résilience
  </text>
  <text x="64" y="440" font-family="Georgia, serif" font-size="96" font-style="italic" fill="#F0EDE8" font-weight="700">
    Familiale
  </text>

  <!-- Sous-titre -->
  <text x="64" y="490" font-family="monospace" font-size="16" fill="#F0EDE8" fill-opacity="0.55" letter-spacing="4">
    72 HEURES D&apos;AUTONOMIE
  </text>

  <!-- Séparateur -->
  <line x1="64" y1="518" x2="120" y2="518" stroke="#F0EDE8" stroke-opacity="0.4" stroke-width="2"/>

  <!-- Badges droite -->
  <rect x="860" y="200" width="276" height="36" fill="none" stroke="#F0EDE8" stroke-opacity="0.2" stroke-width="1" rx="18"/>
  <text x="998" y="224" font-family="monospace" font-size="12" fill="#F0EDE8" fill-opacity="0.6" text-anchor="middle" letter-spacing="1">
    CONFORMITÉ NCCN
  </text>

  <rect x="860" y="250" width="276" height="36" fill="none" stroke="#F0EDE8" stroke-opacity="0.2" stroke-width="1" rx="18"/>
  <text x="998" y="274" font-family="monospace" font-size="12" fill="#F0EDE8" fill-opacity="0.6" text-anchor="middle" letter-spacing="1">
    BE-ALERT
  </text>

  <rect x="860" y="300" width="276" height="36" fill="none" stroke="#F0EDE8" stroke-opacity="0.2" stroke-width="1" rx="18"/>
  <text x="998" y="324" font-family="monospace" font-size="12" fill="#F0EDE8" fill-opacity="0.6" text-anchor="middle" letter-spacing="1">
    SPF INTÉRIEUR
  </text>

  <!-- Prix -->
  <text x="998" y="430" font-family="Georgia, serif" font-size="72" fill="#F0EDE8" fill-opacity="0.9" text-anchor="middle" font-weight="700">
    14,99€
  </text>
  <text x="998" y="460" font-family="monospace" font-size="12" fill="#F0EDE8" fill-opacity="0.4" text-anchor="middle" letter-spacing="2">
    TÉLÉCHARGEMENT PDF
  </text>

  <!-- Footer -->
  <text x="64" y="596" font-family="monospace" font-size="12" fill="#F0EDE8" fill-opacity="0.3" letter-spacing="2">
    SURVIKIT · RESILIENCE.BE
  </text>
  <text x="1136" y="596" font-family="monospace" font-size="12" fill="#F0EDE8" fill-opacity="0.3" text-anchor="end" letter-spacing="1">
    8 CHAPITRES · FAMILLES BELGES
  </text>
</svg>
`);

await sharp(coverSvg)
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(join(OG_DIR, "guide-pdf-cover.jpg"));

console.log("✓ guide-pdf-cover.jpg (1200×630)");
console.log("Done — assets in public/og/");
