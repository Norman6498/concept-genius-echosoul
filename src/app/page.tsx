import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ValuePillars } from "@/components/landing/ValuePillars";
import { HowItWorksPreview } from "@/components/landing/HowItWorksPreview";
import { ExperiencesPreview } from "@/components/landing/ExperiencesPreview";
import { SafetyTrustSection } from "@/components/landing/SafetyTrustSection";
import { PricingPreviewSection } from "@/components/landing/PricingPreviewSection";
import { Footer } from "@/components/landing/Footer";

export default function Page01Landing() {
  return (
    <div className="min-h-screen bg-[#050B10] text-[#F5EBD6] flex flex-col selection:bg-[#D9A441]/30 selection:text-[#F2C86A]">
      {/* 1. Public Top Navigation */}
      <Navbar />

      {/* 2. Main Page Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* Cinematic Hero with Living Environment */}
        <Hero />

        {/* 4 Core Value Pillars */}
        <ValuePillars />

        {/* How EchoSoul Accompanies You Preview */}
        <HowItWorksPreview />

        {/* Three Intimate Sanctuaries Interactive Preview */}
        <ExperiencesPreview />

        {/* Safety, Ethical Architecture & Trust */}
        <SafetyTrustSection />

        {/* Transparent & Respectful Pricing Preview */}
        <PricingPreviewSection />
      </main>

      {/* 3. Concept Genius Provenance & Public Footer */}
      <Footer />
    </div>
  );
}
