import React from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

interface PillarItem {
  icon: IconName;
  title: string;
  description: string;
  tagline: string;
}

const PILLARS: PillarItem[] = [
  {
    icon: "words",
    title: "Real Words",
    tagline: "Literature with Provenance",
    description:
      "Not AI-generated poetry. Curated lines from real poets, philosophers, and writers across languages, preserving exact source authenticity.",
  },
  {
    icon: "music",
    title: "Real Music",
    tagline: "Atmospheric Soundscapes",
    description:
      "Original ambient compositions and contextual melodies chosen for your current emotional moment, from calm to deep healing.",
  },
  {
    icon: "scenes",
    title: "Real Places",
    tagline: "Living Environments",
    description:
      "Multi-layered living scenes with moving clouds, warm lamps, and subtle weather that mirror your inner state and invite you to breathe.",
  },
  {
    icon: "journey",
    title: "A More You",
    tagline: "Your Living Novel",
    description:
      "Not a clinical score. A gentle mirror that weaves your conversations, moments, and lessons into the evolving story of your life.",
  },
];

export function ValuePillars() {
  return (
    <section className="relative z-20 py-16 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.title}
            className="glass-panel glass-panel-hover p-6 sm:p-7 flex flex-col justify-between group"
          >
            <div>
              {/* Icon Container with Warm Gold Glow */}
              <div className="w-12 h-12 rounded-[12px] bg-[#102531] border border-[#D9A441]/30 flex items-center justify-center text-[#F2C86A] mb-5 group-hover:border-[#D9A441]/60 group-hover:shadow-[0_0_20px_rgba(217,164,65,0.25)] transition-all">
                <Icon name={pillar.icon} size={22} />
              </div>

              {/* Tagline */}
              <span className="text-[11px] uppercase tracking-widest text-[#9AA8B0] font-medium block mb-1">
                {pillar.tagline}
              </span>

              {/* Title */}
              <h2 className="font-display text-2xl font-normal text-[#F5EBD6] mb-3 group-hover:text-[#F2C86A] transition-colors">
                {pillar.title}
              </h2>

              {/* Description */}
              <p className="font-ui text-sm text-[#CFC5B5] leading-relaxed">
                {pillar.description}
              </p>
            </div>

            {/* Subtle bottom indicator */}
            <div className="pt-6 mt-6 border-t border-[#D9A441]/10 flex items-center justify-between text-xs text-[#9AA8B0]">
              <span>Curated depth</span>
              <span className="text-[#D9A441] opacity-0 group-hover:opacity-100 transition-opacity">
                Explore →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
