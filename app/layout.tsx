import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { Navbar } from "@/components/editorial/Navbar";
import { ConsentProvider } from "@/components/legal/ConsentProvider";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo/structured-data";
import { buildRootMetadata } from "@/lib/seo/metadata";
import { Analytics } from "@vercel/analytics/next";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Métadonnées racine — base pour toutes les pages.
 * Les pages individuelles héritent du template titre "%s · Survikit"
 * et overrident les champs qu'elles définissent.
 */
export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper overflow-x-hidden">
        {/*
         * JSON-LD globaux — injectés dans le body de toutes les pages.
         * Organization + WebSite servent de base EEAT pour tout le site.
         * Positionnés avant le ConsentProvider pour être dans le HTML initial.
         */}
        <JsonLd
          data={[buildOrganizationSchema(), buildWebSiteSchema()]}
          id="jsonld-global"
        />

        <ConsentProvider>
          <LenisProvider>
            <CustomCursor />
            <Navbar />
            <main>{children}</main>
            <CookieBanner />
          </LenisProvider>
        </ConsentProvider>
        <Analytics />
      </body>
    </html>
  );
}
