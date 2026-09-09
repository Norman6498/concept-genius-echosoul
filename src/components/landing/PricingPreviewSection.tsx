import React from "react";
import { Button } from "@/components/ui/Button";

export function PricingPreviewSection() {
  return (
    <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D9A441] block mb-3">
          Honest & Respectful Pricing
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-light text-[#F5EBD6] tracking-tight mb-5">
          Start Free. Go Deeper When You&apos;re Ready.
        </h2>
        <p className="font-ui text-base text-[#CFC5B5] leading-relaxed">
          EchoSoul is built so that genuine emotional companionship is always accessible.
          Essential listening, literature, and memory safety are never locked behind a paywall.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Tier 1: Free Sanctuary */}
        <div className="glass-panel p-6 sm:p-9 flex flex-col justify-between border border-[#D9A441]/15">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl text-[#F5EBD6]">Free Sanctuary</h3>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#102531] text-[#CFC5B5]">
                Always Accessible
              </span>
            </div>
            <div className="mb-6">
              <span className="font-display text-4xl text-[#F5EBD6] font-normal">$0</span>
              <span className="text-xs text-[#9AA8B0] ml-2">/ forever</span>
            </div>
            <p className="text-sm text-[#CFC5B5] mb-6 leading-relaxed">
              Full access to daily empathetic listening, voice presence, authentic literature,
              and your personal memory archive.
            </p>

            <ul className="space-y-3 text-sm text-[#CFC5B5] mb-8 font-ui">
              <li className="flex items-center gap-2.5">
                <span className="text-[#8DBA8F]">✓</span>
                <span>Unrestricted daily voice & text conversations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#8DBA8F]">✓</span>
                <span>Full authentic poetry & literature library</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#8DBA8F]">✓</span>
                <span>Complete memory vault with instant purge</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#8DBA8F]">✓</span>
                <span>Core living visual scenes</span>
              </li>
            </ul>
          </div>

          <Button variant="secondary" size="lg" fullWidth href="/signup">
            Begin Free Journey
          </Button>
        </div>

        {/* Tier 2: EchoSoul Patron */}
        <div className="glass-panel p-6 sm:p-9 flex flex-col justify-between border-2 border-[#D9A441]/50 relative shadow-[0_8px_36px_rgba(217,164,65,0.2)]">
          {/* Most Recommended Tag */}
          <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-[#D9A441] text-[#050B10] text-[11px] font-bold uppercase tracking-wider shadow-sm">
            Deeper Immersion
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl text-[#F2C86A]">EchoSoul Patron</h3>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D9A441]/20 text-[#F2C86A]">
                Full Realms
              </span>
            </div>
            <div className="mb-6">
              <span className="font-display text-4xl text-[#F5EBD6] font-normal">$9</span>
              <span className="text-xs text-[#9AA8B0] ml-2">/ month</span>
            </div>
            <p className="text-sm text-[#CFC5B5] mb-6 leading-relaxed">
              For those seeking deeper personal reflection, the complete woven Life Novel,
              cinematic animated story chapters, and ad-free experience.
            </p>

            <ul className="space-y-3 text-sm text-[#CFC5B5] mb-8 font-ui">
              <li className="flex items-center gap-2.5">
                <span className="text-[#D9A441]">★</span>
                <span className="text-[#F5EBD6] font-medium">Complete Living Life Novel with export</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#D9A441]">★</span>
                <span>Animated cinematic story journeys</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#D9A441]">★</span>
                <span>Deep pattern & growth reflections over years</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#D9A441]">★</span>
                <span>All premium scenes, custom environments & audio</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#D9A441]">★</span>
                <span>100% Ad-free experience</span>
              </li>
            </ul>
          </div>

          <Button variant="primary" size="lg" fullWidth href="/signup">
            Become a Patron
          </Button>
        </div>
      </div>

      {/* Ethical Guarantee Note */}
      <div className="mt-12 text-center text-xs text-[#9AA8B0] max-w-xl mx-auto">
        <p>
          We never deploy intrusive paywalls when you are having an emotional or sensitive conversation.
          Your peace of mind always comes first.
        </p>
      </div>
    </section>
  );
}
