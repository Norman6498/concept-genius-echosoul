import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Manrope,
  Tiro_Devanagari_Hindi,
  Hind,
  Noto_Nastaliq_Urdu,
  Playfair_Display,
  Inter,
} from "next/font/google";
import { AuthProvider } from "@/lib/auth/context";
import { OnboardingPreviewProvider } from "@/lib/onboarding/preview-context";
import "./globals.css";

// 1. English Display — Cormorant Garamond
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// 2. English UI — Manrope
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

// 3. Hindi Literature — Tiro Devanagari Hindi
const tiroHindi = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-tiro-hindi",
  display: "swap",
});

// 4. Hindi UI — Hind
const hind = Hind({
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

// 5. Urdu Literature — Noto Nastaliq Urdu
const notoUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-urdu",
  display: "swap",
});

// Fallbacks for existing references
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
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
      className={`${cormorant.variable} ${manrope.variable} ${tiroHindi.variable} ${hind.variable} ${notoUrdu.variable} ${playfair.variable} ${inter.variable} dark overflow-x-clip max-w-full`}
    >
      <body className="bg-[#0B0F14] text-[#FFF8E1] font-ui antialiased selection:bg-[#F2D78A]/30 selection:text-[#F2D78A] overflow-x-clip max-w-full min-h-screen">
        <AuthProvider>
          <OnboardingPreviewProvider>{children}</OnboardingPreviewProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
