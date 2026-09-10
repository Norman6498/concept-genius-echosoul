import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Playfair_Display, Inter, Noto_Serif_Devanagari } from "next/font/google";
import { AuthProvider } from "@/lib/auth/context";
import "./globals.css";

// Headline font — Cormorant Garamond
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Editorial display font — Playfair Display
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

// UI / body font — Inter
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Authentic literature — Devanagari script
const devanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-devanagari",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "EchoSoul — Enter a realm where you can finally be you.",
  description:
    "An AI companion for your thoughts, feelings, questions and the stories you're living. Concept Genius.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${inter.variable} ${devanagari.variable} dark overflow-x-clip max-w-full`}
    >
      <body className="bg-[#0B0F14] text-[#FFF8E1] font-ui antialiased selection:bg-[#F2D78A]/30 selection:text-[#F2D78A] overflow-x-clip max-w-full min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
