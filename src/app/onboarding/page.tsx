import React from "react";
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Step 1: About You | EchoSoul",
  description: "Personalize your EchoSoul sanctuary. The more you share, the more EchoSoul understands you.",
};

export default function OnboardingPage() {
  return <OnboardingStep1 />;
}
