import React from "react";
import { RealAboutPage } from "@/components/about/RealAboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Solenne | A Place for What You Feel",
  description: "Solenne is more than an AI. It is a space that listens, understands, and grows with you — through conversations, real literature, music, visuals, and your personal journey.",
};

export default function AboutPage() {
  return <RealAboutPage />;
}
