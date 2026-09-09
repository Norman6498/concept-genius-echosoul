import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Noto_Serif_Devanagari } from "next/font/google";
import { AuthProvider } from "@/lib/auth/context";
import "./globals.css";

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
      className={`${playfair.variable} ${inter.variable} ${devanagari.variable} dark overflow-x-clip max-w-full`}
    >
      <body className="bg-[#050B10] text-[#F5EBD6] font-ui antialiased selection:bg-[#D9A441]/30 selection:text-[#F2C86A] overflow-x-clip max-w-full min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
