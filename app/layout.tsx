import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { Navbar } from "@/components/editorial/Navbar";

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

export const metadata: Metadata = {
  title: "Survikit — Kits de survie 72h pour les Belges",
  description:
    "Configurez en 2 minutes le kit d'urgence adapté à votre foyer. Fondé sur les recommandations du Centre de Crise National belge.",
  keywords: ["kit urgence", "72 heures", "Belgique", "préparation", "survie"],
  openGraph: {
    title: "Survikit — Préparez-vous en 2 minutes",
    description:
      "Kits de survie 72h conçus pour les Belges. Configurateur intelligent, produits sélectionnés.",
    locale: "fr_BE",
    type: "website",
  },
};

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
        <LenisProvider>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
