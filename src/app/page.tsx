import React from "react";
import { Navbar, HeroPage } from "@/components/landing/LandingHero";

export default function Page() {
  return (
    <div className="bg-[#050B10] min-h-screen overflow-x-clip">
      <Navbar />
      <main id="main-content">
        <HeroPage />
      </main>
    </div>
  );
}
