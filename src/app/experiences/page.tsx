import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { ExperiencePreview } from "@/components/landing/ExperiencePreview";
import { ValuePillars } from "@/components/landing/ValuePillars";
import { Footer } from "@/components/landing/Footer";

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-8 pb-16 space-y-12">
        <ExperiencePreview />
        <ValuePillars />
      </main>
      <Footer />
    </div>
  );
}
