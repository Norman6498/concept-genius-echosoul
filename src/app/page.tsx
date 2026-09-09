import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ValuePillarsSection } from "@/components/landing/ValuePillarsSection";
import { ExperiencesPreview } from "@/components/landing/ExperiencesPreview";
import { SafetyTrustSection } from "@/components/landing/SafetyTrustSection";
import { PricingPreviewSection } from "@/components/landing/PricingPreviewSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050B10] text-[#F5EBD6] selection:bg-[#D9A441]/30 selection:text-[#F2C86A] overflow-x-clip">
      <Navbar />
      <main id="main-content">
        <Hero />
        <ValuePillarsSection />
        <ExperiencesPreview />
        <SafetyTrustSection />
        <PricingPreviewSection />
      </main>
      <Footer />
    </div>
  );
}
