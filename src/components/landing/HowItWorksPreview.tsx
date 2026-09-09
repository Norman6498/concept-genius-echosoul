import React from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

interface Step {
  num: string;
  title: string;
  subtitle: string;
  icon: IconName;
  description: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "Speak or Write Freely",
    subtitle: "A Space Without Pretense",
    icon: "microphone",
    description:
      "Share your thoughts, worries, unformed questions or creative ideas. Speak naturally via voice or type quietly into the night.",
  },
  {
    num: "02",
    title: "Listen with Patience",
    subtitle: "Presence Before Solution",
    icon: "talk",
    description:
      "EchoSoul listens first. It doesn't rush to fix you, give unsolicited advice, or diagnose. It holds space so you can hear yourself think.",
  },
  {
    num: "03",
    title: "Resonate, Not Analyze",
    subtitle: "Contextual Understanding",
    icon: "heart",
    description:
      "Combining your current feeling with the history you choose to share, EchoSoul offers a thoughtful reflection that touches what actually matters.",
  },
  {
    num: "04",
    title: "Encounter Real Art",
    subtitle: "Literature, Music & Scenes",
    icon: "words",
    description:
      "When ordinary words aren't enough, discover a couplet by Mir Taqi Mir, an ambient cello motif, or a quiet rainy mountain balcony.",
  },
  {
    num: "05",
    title: "Your Living Novel",
    subtitle: "Continuous Personal Growth",
    icon: "journey",
    description:
      "Over weeks and months, your thoughts and milestones naturally assemble into chapters of your own life story—honest, artistic, and entirely yours.",
  },
];

export function HowItWorksPreview() {
  return (
    <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D9A441] block mb-3">
          The Accompaniment Journey
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-light text-[#F5EBD6] tracking-tight mb-5">
          How EchoSoul Accompanies You
        </h2>
        <p className="font-ui text-base text-[#CFC5B5] leading-relaxed">
          Not a checklist, not a clinical therapy session. A quiet sanctuary designed to
          meet you wherever you are, anytime of the day or night.
        </p>
      </div>

      {/* 5 Journey Steps Horizontal / Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
        {STEPS.map((step, idx) => (
          <div
            key={step.num}
            className="glass-panel p-6 flex flex-col justify-between relative group hover:border-[#D9A441]/40 transition-all duration-300"
          >
            {/* Step Number with Gold Accent */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-3xl font-light text-[#D9A441]/80 group-hover:text-[#F2C86A] transition-colors">
                {step.num}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#102531] flex items-center justify-center text-[#9AA8B0] group-hover:text-[#F2C86A] transition-colors">
                <Icon name={step.icon} size={16} />
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#9AA8B0] font-medium block mb-1">
                {step.subtitle}
              </span>
              <h3 className="font-display text-lg font-medium text-[#F5EBD6] mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="font-ui text-xs sm:text-sm text-[#CFC5B5] leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Connecting Arrow for desktop */}
            {idx < STEPS.length - 1 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-[#D9A441]/40 pointer-events-none">
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
