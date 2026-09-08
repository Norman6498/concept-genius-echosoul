"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ValuePillars } from "@/components/landing/ValuePillars";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ExperiencePreview } from "@/components/landing/ExperiencePreview";
import { SafetyTrust } from "@/components/landing/SafetyTrust";
import { PricingPreview } from "@/components/landing/PricingPreview";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-amber-400/30 selection:text-amber-200">
      {/* 1. Public Top Navigation */}
      <Navbar />

      {/* 2. Cinematic Hero Section (Screen 1A Reference) */}
      <main className="flex-1">
        <Hero />

        {/* 3. 4 Value Pillars Strip */}
        <ValuePillars />

        {/* 4. How It Works Section */}
        <HowItWorks />

        {/* 5. Four Intimate Experiences Interactive Preview */}
        <ExperiencePreview />

        {/* 6. Safety & Ethical Trust */}
        <SafetyTrust />

        {/* 7. Fair & Transparent Pricing */}
        <PricingPreview />
      </main>

      {/* 8. Public Editorial Footer */}
      <Footer />
    </div>
  );
}
