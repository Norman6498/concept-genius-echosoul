import React from "react";
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step 1: About You | Solenne",
  description: "Personalize your Solenne sanctuary. The more you share, the more Solenne understands you.",
};

export default function OnboardingPage() {
  return <OnboardingStep1 />;
}
