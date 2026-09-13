import React from "react";
import { FeaturesRealm } from "@/components/features/FeaturesRealm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — Tools for a more meaningful you | Solenne",
  description:
    "Explore everything Solenne offers to help you feel, reflect, and grow — through conversations, real literature, music, visuals, and your personal journey.",
};

export default function FeaturesPage() {
  return <FeaturesRealm />;
}
