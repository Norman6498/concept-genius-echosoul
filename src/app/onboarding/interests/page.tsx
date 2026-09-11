import React from "react";
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Interests — EchoSoul",
  description: "Select what you love to personalize your EchoSoul conversations, literature, music, and journeys.",
};

export default function OnboardingInterestsPage() {
  return <OnboardingStep2 />;
}
