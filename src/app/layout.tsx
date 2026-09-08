import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/context";
import "./globals.css";

export const metadata: Metadata = {
  title: "EchoSoul — Feel · Reflect · Heal · Grow",
  description:
    "An adaptive AI emotional companion that listens, preserves authentic literature, and narrates your story.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080c14] text-slate-100 antialiased selection:bg-amber-400/25 selection:text-amber-200">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
