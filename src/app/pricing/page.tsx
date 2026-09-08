import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { PricingPreview } from "@/components/landing/PricingPreview";
import { Footer } from "@/components/landing/Footer";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-8 pb-16">
        <PricingPreview />
      </main>
      <Footer />
    </div>
  );
}
