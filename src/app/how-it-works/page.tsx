import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-8 pb-16">
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
